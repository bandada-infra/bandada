import React from "react"

interface IllustrationContainerProps
    extends React.HTMLAttributes<HTMLDivElement> {
    height?: number
}

export default function IllustrationContainer({
    height,
    children
}: IllustrationContainerProps) {
    return (
        <div
            className="relative overflow-x-hidden h-full"
            style={{
                height: height ? `${height}px` : undefined
            }}
        >
            {children}
        </div>
    )
}
