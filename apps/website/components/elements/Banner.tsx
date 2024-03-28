import { AppContainer } from "../AppContainer"

interface BannerProps {
    title: React.ReactNode
    description?: React.ReactNode
    children?: React.ReactNode
}

function Banner({ title, description, children }: BannerProps) {
    return (
        <div className="bg-gradient-bandada">
            <AppContainer className="md:px-0 py-10 flex flex-col items-center gap-10 justify-center">
                <div className="flex flex-col gap-5 md:w-3/4">
                    <span className="text-baltic-sea-50 text-[25px] leading-[30px] md:leading-[46.8px] md:text-[39px] font-unbounded text-center font-normal">
                        {title}
                    </span>
                    {description && (
                        <span className="text-baltic-sea-50 text-base tracking-[0.16px] md:tracking-[0.18px] leading-6 md:leading-7 md:text-lg font-dm-sans text-center font-medium">
                            {description}
                        </span>
                    )}
                </div>
                <div className="mx-auto">{children}</div>
            </AppContainer>
        </div>
    )
}

Banner.displayName = "Banner"
export { Banner }
