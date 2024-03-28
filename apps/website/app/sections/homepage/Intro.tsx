import { AppContainer } from "@/components/AppContainer"

function Intro() {
    return (
        <div className="bg-[url('/images/intro-background.png')] bg-cover bg-center relative flex flex-col h-[90vh]">
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-pink-transparent py-16 md:py-28">
                <AppContainer className=" flex flex-col md:flex-row justify-between gap-10">
                    <h1 className="font-normal text-center md:text-left font-unbounded text-3xl md:text-4xl leading-[32px] md:leading-[46px]">
                        Easily manage privacy-preserving groups of anonymous
                        individuals
                    </h1>
                    <span className="text-lg text-center md:text-right font-medium tracking-[0.18px] leading-[27px] text-baltic-sea-800 font-dm-sans">
                        Add a layer of privacy to your dapp, build custom gating
                        mechanisms, build a strong anti-sybil system.
                    </span>
                </AppContainer>
            </div>
        </div>
    )
}

Intro.displayName = "Intro"
export { Intro }
