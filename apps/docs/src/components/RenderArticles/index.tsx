import articles from "../../../static/data/articles.json"

export default function RenderArticles(): JSX.Element {
    return (
        <div>
            {articles
                .sort(
                    (a, b) =>
                        new Date(b.date || "").getTime() -
                        new Date(a.date || "").getTime()
                )
                .map((article) => (
                    <div style={{ margin: "15px" }}>
                        {" "}
                        <a
                            href={article.url}
                            target="_blank"
                            rel="noreferrer noopener nofollow"
                        >
                            {article.title}
                        </a>{" "}
                        - {article.authors.join(", ")} (<i>{article.date}</i>)
                    </div>
                ))}
        </div>
    )
}
