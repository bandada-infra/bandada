import { useEffect, useState } from "react"
import {
    Box,
    Flex,
    Switch,
    useClipboard,
    useToast,
    IconButton,
    Tooltip,
    Text
} from "@chakra-ui/react"
import { ViewIcon, CopyIcon, RepeatIcon, CheckIcon } from "@chakra-ui/icons"
import { ApiKeyActions } from "@bandada/utils"
import { Admin } from "../types"
import { getAdmin, updateApiKey } from "../api/bandadaAPI"

export default function ApiKeyComponent({
    adminId
}: {
    adminId: string
}): JSX.Element {
    const [admin, setAdmin] = useState<Admin>()
    const [apiKey, setApiKey] = useState("")
    const [isEnabled, setIsEnabled] = useState(false)
    const [isCopied, setIsCopied] = useState(false)
    const { onCopy } = useClipboard(apiKey)
    const toast = useToast()

    useEffect(() => {
        getAdmin(adminId).then((admin) => {
            if (admin) {
                setAdmin(admin)
                setApiKey(!admin.apiKey ? "" : admin.apiKey)
                setIsEnabled(admin.apiEnabled)
            }
        })
    })

    useEffect(() => {
        if (isCopied) {
            const timer = setTimeout(() => {
                setIsCopied(false)
            }, 2000)
            return () => clearTimeout(timer)
        }
    }, [isCopied])

    const showToast = (
        title: string,
        description: string,
        status: "info" | "warning" | "success" | "error",
        duration = 2000,
        position: "top" | "bottom" = "top"
    ) => {
        toast({
            title,
            description,
            status,
            duration,
            isClosable: true,
            position
        })
    }

    const handleCopy = () => {
        onCopy()
        setIsCopied(true)
    }

    const handleRefresh = async () => {
        if (admin) {
            const newApiKey = await updateApiKey(
                admin.id,
                ApiKeyActions.Generate
            )
            if (!newApiKey) {
                showToast(
                    "Something went wrong",
                    "API Key has not been refreshed",
                    "error"
                )
            } else {
                showToast(
                    "API Key refresh",
                    "Successfully refreshed",
                    "success"
                )
                setApiKey(newApiKey)
            }
        }
    }

    const showApiKey = () => {
        if (admin && admin.apiKey) {
            showToast(
                "API Key",
                `Your API key is: ${admin.apiKey}`,
                "info",
                2500,
                "top"
            )
        }
    }

    const toggleIsEnabled = async () => {
        if (admin) {
            let toastTitle = ""
            let toastDescription = ""
            let action = ApiKeyActions.Enable

            if (!admin.apiKey) {
                await updateApiKey(admin.id, ApiKeyActions.Generate)
                toastTitle = "API Key Generated"
                toastDescription = "A new API key has been generated."
            } else {
                action = isEnabled
                    ? ApiKeyActions.Disable
                    : ApiKeyActions.Enable
                await updateApiKey(admin.id, action)
                toastTitle =
                    action === ApiKeyActions.Enable
                        ? "API Key Enabled"
                        : "API Key Disabled"
                toastDescription =
                    action === ApiKeyActions.Enable
                        ? "API key has been enabled."
                        : "API key has been disabled."
            }

            showToast(toastTitle, toastDescription, "success")
            setIsEnabled((prevState) => !prevState)
        }
    }

    return (
        <Flex
            align="center"
            justify="space-between"
            p={4}
            borderRadius="md"
            minWidth="300px"
            height="48px"
        >
            <Flex align="center" flexGrow={1} justify="center">
                <Box>
                    <Text
                        fontWeight="bold"
                        colorScheme="primary"
                        color={isEnabled ? "balticSea.900" : "balticSea.400"}
                    >
                        API Key
                    </Text>
                </Box>
                <Switch
                    isChecked={isEnabled}
                    onChange={toggleIsEnabled}
                    mx={4}
                />

                {isEnabled && (
                    <Flex align="center">
                        <Tooltip label="Show API Key">
                            <IconButton
                                icon={<ViewIcon />}
                                onClick={showApiKey}
                                aria-label="View API Key"
                            />
                        </Tooltip>
                        <IconButton
                            icon={isCopied ? <CheckIcon /> : <CopyIcon />}
                            onClick={handleCopy}
                            ml={2}
                            aria-label="Copy API Key"
                            isDisabled={!isEnabled}
                        />
                        <IconButton
                            icon={<RepeatIcon />}
                            onClick={handleRefresh}
                            ml={2}
                            aria-label="Refresh API Key"
                            isDisabled={!isEnabled}
                        />
                    </Flex>
                )}
            </Flex>
        </Flex>
    )
}
