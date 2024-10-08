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
                        - {video.speakers.join(", ")} at{" "}
                        <u>{video.eventName}</u> (
                        <i>
                            {new Date(video.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric"
                            })}
                        </i>
                        )
                    </div>
                ))}
        </div>
    )
}
