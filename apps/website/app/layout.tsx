import type { Metadata } from "next"
import "./globals.css"
import { DM_Sans } from "next/font/google"
import { AppHeader } from "@/components/AppHeader"
import { AppFooter } from "@/components/AppFooter"
import { APP_SETTINGS } from "@/common/settings"

const dmSans = DM_Sans({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: APP_SETTINGS.APP_TITLE,
    description: APP_SETTINGS.APP_DESCRIPTION
}

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={dmSans.className}>
                <AppHeader />
                {children}
                <AppFooter />
            </body>
        </html>
    )
}
