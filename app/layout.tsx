import type React from "react"
import type { Metadata } from "next"
import localFont from "next/font/local"
import { ThemeProvider } from "@/components/theme-provider"
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
    {
      path: "../node_modules/geist/dist/fonts/geist-sans/Geist-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
})

const siteUrl = "https://alepot55.github.io/alepot55"

export const metadata: Metadata = {
  title: {
    default: "Alessandro Potenza",
    template: "%s | Alessandro Potenza",
  },
  description:
    "Computer Engineering student at Politecnico di Milano, building high-performance AI systems, GPU kernels, and open-source tools.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Alessandro Potenza",
    description:
      "Computer Engineering student at Politecnico di Milano, building high-performance AI systems, GPU kernels, and open-source tools.",
    url: siteUrl,
    siteName: "Alessandro Potenza",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Alessandro Potenza",
    description:
      "Computer Engineering student at Politecnico di Milano, building high-performance AI systems, GPU kernels, and open-source tools.",
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={geistSans.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");var d=document.documentElement;if(t==="dark"||((!t||t==="system")&&window.matchMedia("(prefers-color-scheme:dark)").matches)){d.classList.add("dark")}else{d.classList.add("light")}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
