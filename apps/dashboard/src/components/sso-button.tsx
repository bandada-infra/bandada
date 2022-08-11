import { Icon } from "@chakra-ui/react"
import { IconType } from "react-icons/lib"
import { Button } from "@chakra-ui/react"
import { FaGithub, FaRedditAlien, FaTwitter } from "react-icons/fa"

const SsoIcons: Record<string, IconType> = {
    Twitter: FaTwitter,
    Github: FaGithub,
    Reddit: FaRedditAlien
}

export default function SsoButton(prop: { provider: string }): JSX.Element {
    return (
        <Button
            h="44px"
            bgColor="#FFFFFF"
            border="1px solid #D0D1D2"
            fontSize="18px"
        >
            <Icon as={SsoIcons[prop.provider]} mr="8px" />
            Continue with {prop.provider}
        </Button>
    )
}
