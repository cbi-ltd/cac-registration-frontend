import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geistSans = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CBI Business Registration Portal - CAC Compliance Made Easy",
  description:
    "Register your business with CAC and qualify for PoS terminal deployment. Fast, secure, and compliant business registration for Nigerian merchants and agents.",
  keywords: ["CAC registration", "business registration", "Nigeria", "PoS terminal", "merchant onboarding"],
  authors: [{ name: "CBI Technologies Limited" }],
  creator: "CBI Technologies Limited",
  publisher: "CBI Technologies Limited",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://registration.cbi.ng",
    siteName: "CBI Business Registration Portal",
    title: "CBI Business Registration Portal - CAC Compliance Made Easy",
    description: "Register your business with CAC and qualify for PoS terminal deployment",
  },
  twitter: {
    card: "summary_large_image",
    title: "CBI Business Registration Portal",
    description: "Register your business with CAC and qualify for PoS terminal deployment",
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://registration.cbi.ng",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#AE0C00",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en-NG">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="CBI Registration" />
      </head>
      <body className={`${_geistSans.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
