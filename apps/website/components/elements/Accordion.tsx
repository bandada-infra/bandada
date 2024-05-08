"use client"

import { ReactNode, useState } from "react"
import { cn } from "@/common/utils"

import { Icons } from "./Icons"

interface AccordionProps {
    label: string
    children?: ReactNode
}

export function Accordion({ label, children }: AccordionProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div
            className="flex flex-col py-4 bg-transparent"
            aria-expanded={isOpen}
            aria-label="accordion"
        >
            <div
                aria-hidden="true"
                className="grid grid-cols-[1fr_20px] gap-1 justify-between items-center cursor-pointer"
                onClick={() => {
                    setIsOpen(!isOpen)
                }}
            >
                <span
                    className={cn(
                        "font-unbounded text-lg leading-6 font-normal uppercase",
                        isOpen
                            ? "text-sunset-orange-600"
                            : "text-baltic-sea-600"
                    )}
                >
                    {label}
                </span>
                {isOpen ? (
                    <Icons.Minus className="text-sunset-orange-600" />
                ) : (
                    <Icons.Plus className="text-baltic-sea-600" />
                )}
            </div>
            <div className="overflow-hidden box-border transition-all duration-300 ease-in-out">
                <div
                    className={cn(
                        "block overflow-hidden max-h-0 duration-200 ease-in-out",
                        isOpen
                            ? "grid-rows-[1fr] opacity-100 max-h-full"
                            : "grid-rows-[0fr] opacity-0"
                    )}
                >
                    <p className="block overflow-hidden pt-4 text-baltic-sea-800 font-sans text-lg leading-7 font-normal tracking-[0.18px]">
                        {children}
                    </p>
                </div>
            </div>
        </div>
    )
}
