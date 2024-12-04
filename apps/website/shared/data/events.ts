export type Event = {
    date: string
    event: string
    description: string
    link: string
}

export const EVENTS: Event[] = [
    {
        event: "DIF - Decentralized Identity Foundation",
        date: "Oct 1 - Nov 4, 2024",
        description:
            "Bandada team will deliver a talk and sponsor prizes for the online hackathon.",
        link: "https://identity.foundation/"
    },
    {
        event: "ETHRome",
        date: "Oct 4-6, 2024",
        description:
            "Bandada team will deliver an in-person talk and sponsor prizes for the hackathon.",
        link: "https://www.ethrome.org/"
    },
    {
        event: "Devcon",
        date: "Nov 12-15, 2024",
        description:
            "Bandada team will deliver an in-person talk and run workshops.",
        link: "https://devcon.org/en/"
    },
    {
        event: "ETHIndia",
        date: "Dec 6-8, 2024",
        description:
            "Semaphore team will deliver an in-person talk on Semaphore and Bandada.",
        link: "https://ethindia.co"
    }
]
