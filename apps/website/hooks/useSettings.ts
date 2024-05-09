"use client"

import MobileDetect from "mobile-detect"
import { useRef, useState, useEffect } from "react"

export default function useSettings() {
    const md = useRef<any>()
    const [isMobile, setIsMobile] = useState(false)
    const [isTablet, setIsTablet] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const [clientHeight, setClientHeight] = useState(0)
    const [clientWidth, setClientWidth] = useState(0)

    useEffect(() => {
        if (typeof window !== "undefined") {
            md.current = new MobileDetect(window?.navigator?.userAgent)
            setIsMobile(md.current?.mobile() !== null)
            setIsTablet(md.current?.tablet() !== null)
            setIsLoaded(true)
            setClientHeight(window?.document?.documentElement?.clientHeight)
            setClientWidth(window?.document?.documentElement?.clientWidth)
        }
    }, [])

    return {
        isMobile,
        isTablet,
        isLoaded,
        clientHeight,
        clientWidth
    }
}
