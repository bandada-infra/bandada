import { AppContainer } from "@/components/AppContainer"
import { Section } from "@/components/typography/Section"
import { LABELS } from "@/shared/labels"

export function Intro() {
    return (
        <div className="bg-[url('/images/intro-background.png')] bg-cover bg-center relative flex flex-col h-[90vh]">
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-pink-transparent py-15 md:py-30">
                <AppContainer className="flex flex-col md:flex-row justify-between gap-10">
                    <div className="md:max-w-[656px]">
                        <Section.Title mobileSize="sm">
                            {LABELS.HOMEPAGE.INTRO.TITLE}
                        </Section.Title>
                    </div>
                    <Section.Description subtitle>
                        {LABELS.HOMEPAGE.INTRO.DESCRIPTION}
                    </Section.Description>
                </AppContainer>
            </div>
        </div>
    )
}
