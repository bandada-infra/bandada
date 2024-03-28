import Image from "next/image"

interface HeaderIllustrationProps {
    image: string
}

function HeaderIllustration({ image }: HeaderIllustrationProps) {
    return (
        <div className="flex relative h-[270px]">
            <div className="absolute md:relative flex mx-auto top-1/2 -translate-y-1/2 -translate-x-32 md:-translate-x-60 ">
                <Image
                    src={image}
                    height={96}
                    width={520}
                    alt="projects banner"
                />
            </div>
        </div>
    )
}

HeaderIllustration.displayName = "HeaderIllustration"

export { HeaderIllustration }
