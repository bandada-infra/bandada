import type { MDXComponents } from "mdx/types"
import { Section } from "./components/typography/Section"

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        ...components,
        h1: ({ children }) => (
            <Section.Header className="text-center">{children}</Section.Header>
        ),
        h3: ({ children }) => (
            <h4 className="text-2xl font-unbounded font-normal text-baltic-sea-950r">
                {children}
            </h4>
        ),
        h6: ({ children }) => (
            <h6 className="text-lg leading-5 md:text-xl md:leading-6 font-unbounded font-normal text-baltic-sea-950 text-center">
                {children}
            </h6>
        ),
        a: ({ children, ...props }) => (
            <a
                className="text-base font-medium leading-6 font-dm-sans text-baltic-sea-600 hover:text-baltic-sea-800 underline"
                target="_blank"
                {...props}
            >
                {children}
            </a>
        ),
        img: ({ alt, src, ...props }) => (
            <img
                alt={alt}
                src={src}
                className="w-full md:!w-2/3 h-auto"
                {...props}
            />
        ),
        p: ({ children }) => (
            <span className="!block !pb-3 font-normal tracking-[0.16px] md:leading-[27px] md:tracking-[0.18px] md:text-lg">
                {children}
            </span>
        )
    }
}
