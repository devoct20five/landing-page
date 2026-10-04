import "@fontsource-variable/saira"; // Primary typeface — Saira (brand book slide 13), self-hosted
import "./globals.css";
import { Providers } from "./providers";
import SmoothScroll from "@/components/motion/SmoothScroll";

// Primary:   Saira (Regular / Bold / Heavy) — loaded above via @fontsource-variable/saira.
// Secondary: Satoshi (Light / Regular / Bold) — loaded from Fontshare below.
// Both are wired to --font-display / --font-body in globals.css.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://oct20five.example.com";

export const metadata = {
  title: {
    default: "OCT20FIVE — A Creative Ecosystem Built for the Future",
    template: "%s — OCT20FIVE",
  },
  description:
    "Concept. Create. Deliver. Editing, Design, 3D Ads, Web Dev — full-spectrum creative services for brands, agencies and creators.",
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [
      { url: "/brand/favicon.ico" },
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/brand/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "OCT20FIVE — A Creative Ecosystem",
    description: "Concept. Create. Deliver.",
    type: "website",
    images: [{ url: "/brand/icon-512.png", width: 512, height: 512 }],
  },
};

export const viewport = {
  themeColor: "#1A0907",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&display=swap"
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);',
          }}
        />
      </head>
      <body className="antialiased">
        <Providers>
          <SmoothScroll>{children}</SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}
