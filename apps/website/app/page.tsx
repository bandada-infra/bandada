import Link from "next/link"
import { Features } from "./sections/homepage/Features"
import { Banner } from "@/components/elements/Banner"
import { Button } from "@/components/elements/Button"
import { Intro } from "./sections/homepage/Intro"
import { Projects } from "./sections/homepage/Projects"
import { Events } from "./sections/homepage/Events"
import { LABELS } from "@/content/pages/label"
import { Icons } from "@/components/elements/Icons"
import { LINKS } from "@/common/settings"

export default function Home() {
    return (
        <div>
            <Intro />
            <Features />
            <Projects />
            <Events />
            <Banner title={LABELS.HOMEPAGE.BANNER.TITLE}>
                <Link href={LINKS.DISCORD} target="_blank">
                    <Button className="flex items-center gap-2" color="black">
                        <Icons.discord size={18} />
                        <div className="flex items-center">Discord</div>
                    </Button>
                </Link>
            </Banner>
        </div>
    )
}
