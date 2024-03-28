import { Card } from "./Card"
import { Video } from "@/content/videos"

function VideoCard({ title }: Video) {
    return (
        <Card.Base
            padding="none"
            variant="content"
            borderSize="xs"
            border="dark"
        >
            <div className="p-6">
                <div className="flex flex-col gap-5">
                    <div className="min-h-[116px]">
                        <span className=" line-clamp-4 text-baltic-sea-50 font-dm-sans font-bold text-xl">
                            {title}
                        </span>
                    </div>
                </div>
            </div>
            <div className="bg-slate-200 h-[210px]" />
        </Card.Base>
    )
}

VideoCard.displayName = "ArticleCard"
export { VideoCard }
