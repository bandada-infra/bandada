import videos from "../../../static/data/videos.json"

export default function RenderVideos(): JSX.Element {
    return (
        <div>
            {videos
                .sort(
                    (a, b) =>
                        new Date(b.date || "").getTime() -
                        new Date(a.date || "").getTime()
                )
                .map((video) => (
                    <div style={{ margin: "15px" }}>
                        {" "}
                        <a
                            href={video.url}
                            target="_blank"
                            rel="noreferrer noopener nofollow"
                        >
                            {video.title}
                        </a>{" "}
                        - {video.speakers.join(", ")} (<i>{video.date}</i>)
                    </div>
                ))}
        </div>
    )
}
