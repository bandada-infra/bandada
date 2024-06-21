import { Card } from "./Card"
import { AppLink } from "../AppLink"

interface VideoProps {
    title?: string
    thumbnail?: string
    url?: string
}
function VideoCard({ title, thumbnail, url = "#" }: VideoProps) {
    return (
        <AppLink href={url} external>
            <Card.Base
                padding="none"
                variant="content"
                borderSize="xs"
                border="dark"
            >
                <div className="p-6">
                    <div className="flex flex-col gap-5">
                        <div className="min-h-[84px] max-h-[84px] truncate ">
                            <span className=" line-clamp-4 text-baltic-sea-50 font-dm-sans font-bold text-xl">
                                {title}
                            </span>
                        </div>
                    </div>
                </div>
                <div
                    className="bg-slate-200 h-[210px] bg-cover bg-center"
                    style={{
                        backgroundImage: thumbnail
                            ? `url(${thumbnail})`
                            : undefined
                    }}
                />
            </Card.Base>
        </AppLink>
    )
}

VideoCard.displayName = "ArticleCard"
export { VideoCard }
