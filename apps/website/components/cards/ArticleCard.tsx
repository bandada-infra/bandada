import { Card } from "./Card"
import { LABELS } from "@/shared/labels"
import { AppLink } from "../AppLink"

interface ArticleProps {
    title?: string
    minRead?: string
    url?: string
}

function ArticleCard({ title, url = "#", minRead = "0" }: ArticleProps) {
    return (
        <AppLink href={url} external>
            <Card.Base
                padding="xs"
                variant="content"
                borderSize="xs"
                border="dark"
            >
                <div className="flex flex-col gap-5">
                    <div className=" h-24">
                        <h4 className="line-clamp-3 text-baltic-sea-50 font-dm-sans font-bold text-xl">
                            {title}
                        </h4>
                    </div>
                    <p className="text-baltic-sea-500 h-5 font-dm-sans font-normal text-sm tracking-[0.14px]">
                        {minRead !== undefined && (
                            <>
                                {minRead} {LABELS.COMMON.READ_TIME}
                            </>
                        )}
                    </p>
                </div>
            </Card.Base>
        </AppLink>
    )
}

ArticleCard.displayName = "ArticleCard"
export { ArticleCard }
