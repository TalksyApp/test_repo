import type React from "react"
import type { Metadata } from "next"
import { Outfit } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "@/components/providers"
import { BackgroundProvider } from "@/components/background-provider"
import "./globals.css"

const outfit = Outfit({ weight: ["300", "400", "500", "600", "700", "800"], subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TALKSY - Connect with the Void",
  description: "Connect through conversations in the void.",
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased bg-black text-white`}>
        <Providers>
          <BackgroundProvider>
            {children}
          </BackgroundProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
