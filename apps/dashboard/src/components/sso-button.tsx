import { Button, Icon, Link } from "@chakra-ui/react"
import { FaGithub, FaRedditAlien, FaTwitter } from "react-icons/fa"
import { IconType } from "react-icons/lib"

const SsoIcons: Record<string, IconType> = {
    Twitter: FaTwitter,
    Github: FaGithub,
    Reddit: FaRedditAlien
}

export default function SsoButton(prop: { provider: string }): JSX.Element {
    return (
        <Link
            href={`${process.env.NX_API_URL}/auth/${prop.provider}`}
            mb="24px"
        >
            <Button
                h="44px"
                bgColor="#FFFFFF"
                border="1px solid #D0D1D2"
                fontSize="18px"
                w="500px"
            >
                <Icon as={SsoIcons[prop.provider]} mr="8px" />
                Continue with {prop.provider}
            </Button>
        </Link>
    )
}
