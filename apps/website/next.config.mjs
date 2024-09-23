import createMDX from "@next/mdx"
/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ["tsx", "ts", "md", "mdx", "js"],
    async redirects() {
        return [
            {
                source: "/hackathon-guide",
                destination:
                    "https://www.notion.so/pse-team/Bandada-s-Hackathon-Guide-82d0d9d3c6b64b7bb2a09d4c7647c083",
                permanent: false,
                basePath: false
            }
        ]
    }
}

const withMDX = createMDX({})
export default withMDX(nextConfig)
