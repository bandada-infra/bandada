import createMDX from '@next/mdx'
/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['tsx', 'ts', 'md', 'mdx', 'js'],
}

const withMDX = createMDX({})
export default withMDX(nextConfig)
