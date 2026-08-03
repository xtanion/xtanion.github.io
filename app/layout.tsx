import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL('https://xtanion.github.io/portfolio'),
  title: {
    default: "xtanion - portfolio",
    template: "%s | xtanion"
  },
  description: "Software engineer specializing in backend systems, AI, and distributed architectures.",
  keywords: ["xtanion", "Shivam Anand", "software engineer", "backend engineer", "AI", "distributed systems", "full stack developer", "Edra Labs", "IIT Roorkee", "IITR"],
  authors: [{ name: "xtanion" }, { name: "Shivam Anand" }],
  creator: "xtanion",
  publisher: "xtanion",
  generator: "Next.js",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://xtanion.github.io/portfolio',
    title: 'xtanion - Shivam Anand | Software Engineer',
    description: 'Software engineer specializing in backend systems, AI/ML platforms, and distributed architectures.',
    siteName: 'xtanion',
    images: [{
      url: '/portfolio/banner.png',
      width: 1200,
      height: 630,
      alt: 'Shivam Anand - Software Developer',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'xtanion - Shivam Anand | Software Engineer',
    description: 'Software engineer specializing in backend systems, AI/ML platforms, and distributed architectures.',
    creator: '@xtanion',
    images: ['/portfolio/banner.png'],
  },
  icons: {
    icon: [
      { url: '/portfolio/dog_128.png', type: 'image/png', sizes: '128x128' },
    ],
    apple: '/portfolio/dog_128.png',
  },
  alternates: {
    canonical: 'https://xtanion.github.io/portfolio',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
