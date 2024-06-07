import { useEffect, useState } from "react"

const CONTENT_URL: Record<string, string> = {
    VIDEOS: "https://raw.githubusercontent.com/bandada-infra/bandada/main/apps/docs/static/data/videos.json",
    ARTICLES:
        "https://raw.githubusercontent.com/bandada-infra/bandada/main/apps/docs/static/data/articles.json"
}

/**
 * @dev This hook is used as helper to fetch content from the server
 * @returns
 */
export default function useContent() {
    const [videos, setVideos] = useState<any[]>([])
    const [articles, setArticles] = useState<any[]>([])

    useEffect(() => {
        const fetchContent = async () => {
            const [fetchedArticles, fetchedVideos] = await Promise.all([
                fetch(CONTENT_URL.ARTICLES).then((res) => res.json()),
                fetch(CONTENT_URL.VIDEOS).then((res) => res.json())
            ])
            setArticles(fetchedArticles)
            setVideos(fetchedVideos)
        }
        fetchContent()
    }, [])

    return {
        articles, // list of articles /docs/static/data/articles.json
        videos // list of videos in /docs/static/data/videos.json
    }
}
