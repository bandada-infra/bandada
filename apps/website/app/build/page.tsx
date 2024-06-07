import React from "react"
import Image from "next/image"
import Link from "next/link"

import { LINKS } from "@/common/settings"
import { AppContainer } from "@/components/AppContainer"
import { Card } from "@/components/cards/Card"
import { Banner } from "@/components/elements/Banner"
import { Button } from "@/components/elements/Button"
import { Label } from "@/components/elements/Label"
import { BuildItems } from "@/shared/data/build"

import { Divider } from "@/components/elements/Divider"
import { Icons } from "@/components/elements/Icons"
import { Section } from "@/components/typography/Section"
import { LABELS } from "@/shared/labels"
import { AppLink } from "@/components/AppLink"

function Illustration() {
    return (
        <AppContainer className="relative ">
            <Image
                src="/illustrations/birds-build.svg"
                alt="birds illustrations"
                className="absolute max-w-max translate-x-20 translate-y-12 z-[2] md:-translate-y-1/2 md:top-1/2 md:translate-x-full"
                height={211}
                width={533}
            />
            <div className="h-[270px] overflow-x-hidden">
                <Image
                    className="absolute inset-0 md:relative flex mx-auto top-1/2 -translate-y-1/2 -translate-x-32 md:-translate-x-60"
                    src="/illustrations/clouds-build.svg"
                    height={96}
                    width={520}
                    alt="projects banner"
                />
            </div>
        </AppContainer>
    )
}

export default function BuildPage() {
    return (
        <div id="buildPage">
            <div className=" bg-classic-rose-100 py-30">
                <Illustration />
                <AppContainer className="flex flex-col gap-16 pt-10">
                    <div className="flex flex-col gap-6 text-center">
                        <Section.Header className="text-center">
                            {LABELS.BUILD.TITLE}
                        </Section.Header>
                        <Section.Description subtitle>
                            {LABELS.BUILD.SUBTITLE}
                        </Section.Description>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {BuildItems.map(({ title, icon, content }, key) => (
                            <Card.Base
                                key={key}
                                variant="baltic"
                                border="gray"
                                borderSize="sm"
                                className="min-h-[470px] md:hover:!border-sunset-orange-500"
                            >
                                <div className="flex flex-col gap-7">
                                    <div className="relative size-16 bg-cover">
                                        <Image src={icon} alt={title} fill />
                                    </div>
                                    <Card.Title
                                        className="font-unbounded"
                                        size="md"
                                    >
                                        {title}
                                    </Card.Title>
                                </div>
                                <Divider.Line className="my-6" />
                                <div>
                                    <span className="text-base text-baltic-sea-700 font-sans font-normal">
                                        {content.title}
                                    </span>
                                    <ul className=" list-disc ">
                                        {content.items.map((item, index) => (
                                            <li
                                                className="ml-5 text-base text-baltic-sea-700 font-sans font-normal"
                                                key={index}
                                            >
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Card.Base>
                        ))}
                    </div>
                </AppContainer>
            </div>

            <div className="bg-baltic-sea-950 pt-30 pb-20">
                <AppContainer className="flex flex-col gap-14">
                    <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-40">
                        <Label.Section color="white">
                            {LABELS.BUILD.CONTRIBUTE.TITLE}
                        </Label.Section>
                        <div className="flex flex-col gap-10">
                            <Label.Paragraph className="!text-baltic-sea-300 text-base font-medium tracking-[0.18px] md:text-lg">
                                {LABELS.BUILD.CONTRIBUTE.DESCRIPTION}
                            </Label.Paragraph>
                            <div className="flex flex-col gap-5 items-start">
                                {LABELS.BUILD.CONTRIBUTE.LINKS.map(
                                    ({ label, href }, index) => (
                                        <Link
                                            href={href}
                                            key={index}
                                            target="_blank"
                                            className="inline-flex grow-0 items-center gap-0.5 text-baltic-sea-50 hover:text-classic-rose-300"
                                        >
                                            <span className="text-base underline duration-200">
                                                {label}
                                            </span>
                                            <Icons.ExternalLink />
                                        </Link>
                                    )
                                )}
                            </div>
                        </div>
                    </div>

                    <svg
                        width="338"
                        height="120"
                        viewBox="0 0 338 120"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M165.11 1.35336C162.999 1.61716 160.766 2.03004 158.343 2.03004C153.637 2.03004 149.708 6.09012 145.148 6.09012C139.565 6.09012 134.732 7.44348 129.246 7.44348C123.404 7.44348 118.906 8.27518 113.344 9.51111C109.468 10.3725 110.793 14.0277 113.006 16.2403C115.719 18.954 117.296 20.2296 120.975 21.5034C124.843 22.8423 127.796 21.6538 131.652 21.6538H140.749C144.27 21.6538 147.263 23.0071 150.9 23.0071C154.009 23.0071 157.019 22.3304 160.223 22.3304C165.362 22.3304 174.583 21.3628 174.583 28.7213C174.583 33.0399 173.396 31.9574 170.523 34.5107C168.163 36.6087 166.081 36.5407 163.08 36.5407C161.644 36.5407 160.509 35.864 159.02 35.864C157.445 35.864 156.171 36.5407 154.621 36.5407C151.477 36.5407 149.576 38.5707 146.501 38.5707C144.79 38.5707 143.173 37.8941 141.388 37.8941C137.413 37.8941 139.925 43.6908 141.952 45.1872C144.471 47.0461 147.771 48.0443 150.749 48.0443C153.202 48.0443 165.531 46.6418 166.426 49.7736C168.21 56.0178 163.015 59.5478 157.666 59.5478C148.871 59.5478 139.973 60.2245 131.276 60.2245C127.382 60.2245 124.342 62.9312 120.449 62.9312H111.803C105.621 62.9312 98.3995 60.7238 92.3292 62.9312C84.539 65.764 76.824 62.9312 68.7582 62.9312C63.8473 62.9312 61.0672 64.481 56.6907 66.1642C53.0045 67.582 48.7062 66.9913 44.8112 66.9913H33.834C30.5708 66.9913 28.1349 69.2179 25.0372 69.6604C21.8062 70.122 19.7756 73.7581 16.917 73.7581H7.96978C5.76408 73.7581 0 73.422 0 76.4648C0 80.265 2.35115 80.7033 5.0751 82.2166C10.5735 85.2713 16.7021 84.7524 22.4808 86.4646C25.6484 87.4032 28.9716 85.9383 32.1047 85.9383H44.6609C54.0601 85.9383 63.0791 87.2917 72.4047 87.2917C76.4573 87.2917 80.055 89.3217 83.9083 89.3217C85.4828 89.3217 91.2312 88.3846 91.3518 90.6751C91.5154 93.7842 91.9613 96.5922 88.3067 97.4043C85.713 97.9807 83.0975 98.0602 80.5249 98.7952C77.3802 99.6937 75.1404 102.378 71.8784 103.382C69.7266 104.044 66.5681 102.653 64.8109 104.058C62.4621 105.937 60.9012 104.577 60.9012 108.607C60.9012 111.861 69.0817 114.672 71.6905 114.998C79.5419 115.979 87.5901 114.359 95.4118 114.359C104.759 114.359 114.356 115.036 123.832 115.036C128.608 115.036 133.421 114.859 138.193 115.036C142.686 115.202 145.569 120.291 150.448 118.945C156.947 117.152 162.961 116.389 169.809 116.389H179.019C182.163 116.389 185.308 115.171 188.493 115.75C192.578 116.493 196.23 117.066 200.448 117.066C204.629 117.066 208.308 114.508 212.327 114.359C219.283 114.101 224.92 114.254 231.424 111.652C234.263 110.517 236.125 109.179 239.394 108.945C242.246 108.742 246.576 107.15 243.454 103.682C240.402 100.291 233.628 99.4719 229.056 99.4719C222.935 99.4719 216.199 99.0367 209.921 98.7952C208.39 98.7364 202.696 98.4099 201.651 97.1036C200.239 95.3388 196.611 94.9904 194.545 95.4494C189.473 96.5767 181.619 96.6592 182.027 89.3217C182.414 82.3528 194.073 82.923 198.606 81.9158C202.202 81.1166 205.103 80.0018 208.417 78.3445C211.978 76.5644 216.173 77.8729 219.921 76.9911C223.238 76.2106 226.676 76.1796 229.77 74.7731C233.672 72.9996 236.626 69.5194 240.56 68.0063C243.886 66.7271 248.464 68.2139 251.725 66.8409C254.671 65.6007 257.674 64.8815 260.522 63.4575C266.813 60.3118 272.855 60.9012 279.77 60.9012C283.401 60.9012 286.345 60.4 289.619 59.0215C292.319 57.8847 297.435 58.8711 300.295 58.8711C305.572 58.8711 311.669 57.7487 316.348 55.1494C318.649 53.8711 323.502 54.1344 326.16 54.1344C328.79 54.1344 332.099 52.8606 334.28 51.578C337.176 49.8746 337.158 47.7509 336.987 44.6609C336.884 42.8218 332.396 41.104 330.896 40.7512C324.406 39.2241 317.465 41.3044 310.934 39.5858C304.753 37.9591 298.111 38.5707 291.649 38.5707C289.067 38.5707 286.81 36.1947 284.544 35.1873C281.901 34.0126 279.358 33.1573 276.424 33.1573C271.408 33.1573 265.729 33.667 261.198 31.6536C258.765 30.572 255.393 31.1273 252.74 31.1273C249.954 31.1273 248.289 33.1573 245.296 33.1573C242.214 33.1573 239.326 33.834 236.161 33.834C233.533 33.834 231.286 33.1573 228.718 33.1573C224.006 33.1573 218.081 34.1393 213.492 33.1197C211.003 32.5664 208.809 32.3716 206.726 30.7513C205.043 29.4425 205.105 25.0652 207.44 24.3981C211.712 23.1775 218.254 22.6651 221.801 19.4733C224.948 16.6405 233.244 21.5786 236.161 17.932C237.925 15.7278 241.088 15.6046 240.898 12.1802C240.764 9.76262 238.168 8.77804 236.688 7.59385C234.383 5.74986 229.254 6.09012 226.349 6.09012C224.589 6.09012 221.314 4.82969 219.583 4.06008C215.122 2.07757 207.905 3.3834 203.004 3.3834C197.461 3.3834 193.348 1.35336 187.779 1.35336C182.127 1.35336 177.534 0 172.027 0C169.42 0 167.373 1.07041 165.11 1.35336Z"
                            fill="url(#paint0_linear_1_819)"
                        />
                    </svg>

                    <div className="hidden h-[400px] border border-white relative overflow-hidden">
                        <div className="size-[400px] cloud-5 " />
                    </div>
                </AppContainer>
            </div>

            <Banner
                title="Project ideas to explore with Bandada"
                description="The team has created this list of project ideas to build with Bandada, but there are many more to be discovered."
            >
                <AppLink href={LINKS.GET_INSPIRED} external>
                    <Button color="black">{LABELS.COMMON.GET_INSPIRED}</Button>
                </AppLink>
            </Banner>
        </div>
    )
}
