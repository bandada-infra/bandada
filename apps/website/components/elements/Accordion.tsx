"use client"

import { classed } from "@tw-classed/react"
import { ReactNode, useState } from "react"

import { Icons } from "./Icons"

interface AccordionProps {
    label: string
    children?: ReactNode
}

const AccordionTitle = classed.span(
    "font-unbounded text-base leading-[19.2px] font-normal uppercase md:text-lg md:leading-[21px]",
    {
        variants: {
            open: {
                true: "text-sunset-orange-600",
                false: "text-baltic-sea-600"
            }
        },
        defaultVariants: {
            open: false
        }
    }
)

const AccordionContent = classed.div(
    "block overflow-hidden max-h-0 duration-200 ease-in-out",
    {
        variants: {
            open: {
                true: "grid-rows-[1fr] opacity-100 max-h-full",
                false: "grid-rows-[0fr] opacity-0"
            }
        }
    }
)

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
                className="grid grid-cols-[1fr_100px] md:grid-cols-[1fr_20px] gap-1 justify-between items-center cursor-pointer"
                onClick={() => {
                    setIsOpen(!isOpen)
                }}
            >
                <AccordionTitle open={isOpen}>{label}</AccordionTitle>
                <div className="ml-auto">
                    {isOpen ? (
                        <Icons.Minus className="text-sunset-orange-600" />
                    ) : (
                        <Icons.Plus className="text-baltic-sea-600" />
                    )}
                </div>
            </div>
            <div className="overflow-hidden box-border transition-all duration-300 ease-in-out">
                <AccordionContent open={isOpen}>
                    <p className="block overflow-hidden pt-4 text-baltic-sea-800 font-sans text-lg leading-7 font-normal tracking-[0.18px]">
                        {children}
                    </p>
                </AccordionContent>
            </div>
        </div>
    )
}
