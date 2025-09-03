import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function MyCompetitionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}