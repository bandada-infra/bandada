export type MenuItem = {
    label: string
    href: string
    icon?: React.ReactNode
    external?: boolean
    footerOnly?: boolean
    showInMobile?: boolean // force show in mobile
}

export type SocialLink = {
    label: string
    icon: React.ReactNode
    href: string
}
