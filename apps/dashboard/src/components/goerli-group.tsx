import {
    Box,
    Icon,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    Text,
    Tooltip,
    useClipboard
} from "@chakra-ui/react"
import { FiCopy } from "react-icons/fi"

export type GoerliGroupCardProps = {
    name: string
    id: string
}

export default function GoerliGroupCard({
    name,
    id
}: GoerliGroupCardProps): JSX.Element {
    const { hasCopied: hasCopiedGroupId, onCopy: onCopyGroupId } =
        useClipboard(id)
    return (
        <Box>
            <Text fontSize="20px">{name}</Text>

            <InputGroup size="md" mt="10px">
                <Input
                    pr="50px"
                    placeholder="Group ID"
                    value={id}
                    isDisabled
                    borderColor="balticSea.500"
                    _hover={{ borderColor: "balticSea.500" }}
                />

                <InputRightElement mr="5px">
                    <Tooltip
                        label={hasCopiedGroupId ? "Copied!" : "Copy"}
                        closeOnClick={false}
                        hasArrow
                    >
                        <IconButton
                            variant="link"
                            aria-label="Copy Group id"
                            onClick={onCopyGroupId}
                            onMouseDown={(e) => e.preventDefault()}
                            icon={
                                <Icon
                                    color="sunsetOrange.600"
                                    boxSize="5"
                                    as={FiCopy}
                                />
                            }
                        />
                    </Tooltip>
                </InputRightElement>
            </InputGroup>
        </Box>
    )
}
