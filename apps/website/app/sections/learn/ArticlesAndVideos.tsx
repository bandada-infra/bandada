"use client"

import React from "react"
import { classed } from "@tw-classed/react"
import { AppContainer } from "@/components/AppContainer"
import { ArticleCard } from "@/components/cards/ArticleCard"
import { VideoCard } from "@/components/cards/VideoCard"
import { ShowMore } from "@/components/ShowMore"
import useContent from "@/hooks/useContent"
import { LABELS } from "@/shared/labels"

const SectionTitle = classed.h3(
    "text-baltic-sea-50 font-unbounded font-normal text-3xl"
)

export function ArticlesAndVideos() {
    const { articles, videos } = useContent()
    return (
        <div className="bg-baltic-sea-950 py-28 ">
            <AppContainer className="flex flex-col gap-24">
                <div className="flex flex-col gap-14">
                    <SectionTitle>{LABELS.COMMON.VIDEOS}</SectionTitle>
                    <ShowMore className="grid grid-cols-1 gap-x-[30px] gap-y-8 md:grid-cols-2 lg:grid-cols-3">
                        {videos.map((video, index) => (
                            <VideoCard key={index} {...video} />
                        ))}
                    </ShowMore>
                </div>
                <div className="flex flex-col gap-14">
                    <SectionTitle>{LABELS.COMMON.ARTICLES}</SectionTitle>
                    <ShowMore className="grid grid-cols-1 gap-x-[30px] gap-y-8 md:grid-cols-2 lg:grid-cols-3">
                        {articles.map((article, index) => (
                            <ArticleCard key={index} {...article} />
                        ))}
                    </ShowMore>
                </div>
            </AppContainer>
        </div>
    )
}
