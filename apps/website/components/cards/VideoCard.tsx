import Link from "next/link"
import { Card } from "./Card"

interface VideoProps {
    title?: string
    thumbnail?: string
    url?: string
}
function VideoCard({ title, thumbnail, url = "#" }: VideoProps) {
    return (
        <Link href={url} target="_blank">
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
                <div
                    className="bg-slate-200 h-[210px] bg-cover bg-center"
                    style={{
                        backgroundImage: thumbnail
                            ? `url(${thumbnail})`
                            : undefined
                    }}
                />
            </Card.Base>
        </Link>
    )
}

VideoCard.displayName = "ArticleCard"
export { VideoCard }
