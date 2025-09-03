import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/competitions',
  '/leaderboards',
  '/contact'
];

// Define role-based protected routes
const roleProtectedRoutes = {
  employer: [
    '/competitions/create',
    '/competitions/manage',
    '/competitions/manage/[id]'
  ],
  employee: [
    '/competitions/join'
  ],
  admin: [
    '/competitions/create',
    '/competitions/manage',
    '/competitions/manage/[id]',
    '/competitions/join'
  ]
};

// Routes that require authentication but no specific role
const authRequiredRoutes = [
  '/profile',
  '/settings',
  '/notifications',
  '/competitions/my'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if route is public
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }
  
  // Competition details pages should be public
  if (pathname.match(/^\/competitions\/[^/]+$/)) {
    return NextResponse.next();
  }
  
  // Get auth token from cookies
  const authCookie = request.cookies.get('auth-token');
  let user = null;
  let isAuthenticated = false;
  
  if (authCookie) {
    try {
      // The token is stored directly as a JWT string
      const accessToken = authCookie.value;
      
      if (accessToken) {
        // Decode JWT token (basic decode without verification for middleware)
        // In production, you should verify the token signature
        const tokenParts = accessToken.split('.');
        if (tokenParts.length === 3) {
          try {
            // Handle URL-safe base64 and add padding if needed
            let base64Payload = tokenParts[1];
            base64Payload = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
            while (base64Payload.length % 4) {
              base64Payload += '=';
            }
            
            const payload = JSON.parse(atob(base64Payload));
            
            // Check if token is not expired
            const currentTime = Math.floor(Date.now() / 1000);
            if (payload.exp && payload.exp > currentTime) {
              user = {
                id: payload.sub || payload.userId,
                email: payload.email,
                role: payload.role,
                name: payload.name
              };
              isAuthenticated = true;
            }
          } catch (decodeError) {
            console.error('Error decoding JWT payload:', decodeError);
          }
        }
      }
    } catch (error) {
      console.error('Error parsing auth token:', error);
    }
  }
  
  // Redirect to home if not authenticated and trying to access protected routes
  if (!isAuthenticated && (authRequiredRoutes.some(route => pathname.startsWith(route)) || 
      Object.values(roleProtectedRoutes).flat().some(route => {
        // Handle dynamic routes like [id]
        const routePattern = route.replace(/\[.*?\]/g, '[^/]+');
        const regex = new RegExp(`^${routePattern}$`);
        return regex.test(pathname);
      }))) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    url.searchParams.set('auth', 'required');
    return NextResponse.redirect(url);
  }
  
  // Check role-based access if user is authenticated
  if (isAuthenticated && user?.role) {
    const userRole = user.role as keyof typeof roleProtectedRoutes;
    
    // Check if trying to access role-restricted routes
    for (const [role, routes] of Object.entries(roleProtectedRoutes)) {
      if (role !== userRole && role !== 'admin') {
        const hasAccess = routes.some(route => {
          const routePattern = route.replace(/\[.*?\]/g, '[^/]+');
          const regex = new RegExp(`^${routePattern}$`);
          return regex.test(pathname);
        });
        
        if (hasAccess) {
          // User trying to access route they don't have permission for
          const url = request.nextUrl.clone();
          url.pathname = '/';
          url.searchParams.set('error', 'unauthorized');
          return NextResponse.redirect(url);
        }
      }
    }
    
    // Check if user has access to the current route
    const allowedRoutes = roleProtectedRoutes[userRole] || [];
    const isRoleProtectedRoute = Object.values(roleProtectedRoutes).flat().some(route => {
      const routePattern = route.replace(/\[.*?\]/g, '[^/]+');
      const regex = new RegExp(`^${routePattern}$`);
      return regex.test(pathname);
    });
    
    if (isRoleProtectedRoute) {
      const hasAccess = allowedRoutes.some(route => {
        const routePattern = route.replace(/\[.*?\]/g, '[^/]+');
        const regex = new RegExp(`^${routePattern}$`);
        return regex.test(pathname);
      }) || userRole === 'admin'; // Admin has access to all routes
      
      if (!hasAccess) {
        const url = request.nextUrl.clone();
        url.pathname = '/';
        url.searchParams.set('error', 'unauthorized');
        return NextResponse.redirect(url);
      }
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};