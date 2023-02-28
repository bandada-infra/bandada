import { Button, Icon, Link } from "@chakra-ui/react"
import { FaGithub, FaRedditAlien, FaTwitter } from "react-icons/fa"
import { IconType } from "react-icons/lib"

const SsoIcons: Record<string, IconType> = {
    Twitter: FaTwitter,
    Github: FaGithub,
    Reddit: FaRedditAlien
}

export default function SsoButton({
    provider
}: {
    provider: string
}): JSX.Element {
    return (
        <Link
            href={`${import.meta.env.VITE_API_URL}/auth/${provider}`}
            mb="24px"
        >
            <Button
                h="44px"
                bgColor="#FFFFFF"
                border="1px solid #D0D1D2"
                fontSize="18px"
                w="500px"
            >
                <Icon as={SsoIcons[provider]} mr="8px" />
                Continue with {provider}
            </Button>
        </Link>
    )
}
