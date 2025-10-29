import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DesktopNav } from "@/components/layout/DesktopNav";
import { MobileDock } from "@/components/layout/MobileDock";
import { AuthProvider } from "@/components/providers/AuthProvider";
import ReduxProvider from "@/components/providers/ReduxProvider";

import { Footer } from "@/components/layout/Footer";
import { OnboardingProvider } from "@/components/providers/OnboardingProvider";
import { Toaster } from "@/components/ui/sonner";

import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GigGeni - Competition Platform",
  description: "Navigate your career through competitions and leaderboards",
  keywords: ["competitions", "leaderboards", "career", "gig economy"],
};

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {PIXEL_ID && (
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
            />
          </noscript>
        )}
      </head>

      <body className={inter.className}>
        <ReduxProvider>
          <AuthProvider>
            <OnboardingProvider>
              <div className="min-h-screen bg-background overflow-x-hidden flex flex-col">
                <DesktopNav />
                <main className="flex-1">{children}</main>
                <Footer />
                <MobileDock />
              </div>
            </OnboardingProvider>
          </AuthProvider>
        </ReduxProvider>

        <Toaster richColors position="top-center" />

        {PIXEL_ID && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}
      </body>
    </html>
  );
}
