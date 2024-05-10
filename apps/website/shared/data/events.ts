export type Event = {
    date: string
    event: string
    description: string
    link: string
}

export const EVENTS: Event[] = [
    {
        event: "ETHRome",
        date: "Oct 4-6, 2024",
        description:
            "Semaphore team will deliver an in-person talk and sponsor prizes for the hackathon.",
        link: "https://www.ethrome.org/"
    },
    {
        event: "Devcon",
        date: "Nov 12-15, 2024",
        description:
            "Semaphore team will deliver an in-person talk and run workshops.",
        link: "https://devcon.org/en/"
    }
]
