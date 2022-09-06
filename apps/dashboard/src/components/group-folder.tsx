import { Box, Button, Text } from "@chakra-ui/react"
import { AiFillFolder } from "react-icons/ai"

export default function GroupFolder(): JSX.Element {
    return (
        <Box mt="60px" w="100%">
            <Button
                w="xs"
                justifyContent="flex-start"
                fontSize="20px"
                bgColor="#FCFCFC"
                p="10px"
                boxShadow="0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)"
            >
                <AiFillFolder />
                <Text ml="10px">Archive</Text>
            </Button>
        </Box>
    )
}
