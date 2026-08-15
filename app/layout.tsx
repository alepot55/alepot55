import type React from "react"
import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"

const geistSans = localFont({
  src: [
    {
      path: "../node_modules/geist/dist/fonts/geist-sans/Geist-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../node_modules/geist/dist/fonts/geist-sans/Geist-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../node_modules/geist/dist/fonts/geist-sans/Geist-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
})

// Names, titles, numbers, labels and code. Self-hosted rather than pulled from
// next/font/google, so the production build does not depend on reaching
// fonts.googleapis.com. Chivo Mono is OFL.
const chivoMono = localFont({
  src: [{ path: "./fonts/ChivoMono-Variable.woff2", weight: "400 600", style: "normal" }],
  variable: "--font-mono",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
})

const siteUrl = "https://alepot55.github.io/alepot55"

const description =
  "GPU kernels, compiler work, and formally verified systems. MSc Computer Engineering at Politecnico di Milano."

export const metadata: Metadata = {
  title: {
    default: "Alessandro Potenza",
    template: "%s | Alessandro Potenza",
  },
  description,
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Alessandro Potenza",
    description,
    url: siteUrl,
    siteName: "Alessandro Potenza",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Alessandro Potenza",
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  colorScheme: "light",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${chivoMono.variable}`}>
      <body className="font-sans antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  )
}
