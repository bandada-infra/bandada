import type { Metadata } from "next"
import "./globals.css"
import { DM_Sans, Unbounded } from "next/font/google"
import { AppHeader } from "@/components/AppHeader"
import { AppFooter } from "@/components/AppFooter"
import { APP_SETTINGS } from "@/common/settings"

const dm_sans = DM_Sans({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-sans"
})
const undbounded = Unbounded({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-unbounded"
})

export const metadata: Metadata = {
    title: APP_SETTINGS.APP_TITLE,
    description: APP_SETTINGS.APP_DESCRIPTION,
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon.ico"
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        title: APP_SETTINGS.APP_TITLE,
        description: APP_SETTINGS.APP_DESCRIPTION,
        images: [
            {
                url: `/og-image.png`,
                width: 1200,
                height: 630,
                alt: "Bandada"
            }
        ]
    }
}

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${dm_sans.className} ${dm_sans.variable} ${undbounded.variable}`}
                suppressHydrationWarning
            >
                <AppHeader />
                {children}
                <AppFooter />
            </body>
        </html>
    )
}
