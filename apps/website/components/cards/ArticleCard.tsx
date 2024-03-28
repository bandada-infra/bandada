import { LABELS } from "@/content/pages/label"
import { Card } from "./Card"
import { Article } from "@/content/articles"

function ArticleCard({ title, readTime = "0" }: Article) {
    return (
        <Card.Base padding="xs" variant="content" borderSize="xs" border="dark">
            <div className="flex flex-col gap-5">
                <div className=" h-24">
                    <h4 className="line-clamp-3 text-baltic-sea-50 font-dm-sans font-bold text-xl">
                        {title}
                    </h4>
                </div>
                <p className="text-baltic-sea-500 h-5 font-dm-sans font-normal text-sm tracking-[0.14px]">
                    {readTime !== undefined && (
                        <>
                            {readTime} {LABELS.ARTICLE.READ_TIME}
                        </>
                    )}
                </p>
            </div>
        </Card.Base>
    )
}

ArticleCard.displayName = "ArticleCard"
export { ArticleCard }
