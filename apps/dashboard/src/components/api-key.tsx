import { useCallback, useEffect, useState } from "react"
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

    const getAdminInfo = useCallback(async () => {
        getAdmin(adminId).then((admin) => {
            if (admin) {
                setAdmin(admin)
                setApiKey(!admin.apiKey ? "" : admin.apiKey)
                setIsEnabled(admin.apiEnabled)
            }
        })
    }, [adminId])

    useEffect(() => {
        getAdminInfo()
    }, [getAdminInfo])

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
        const refresh = window.confirm(
            "Are you sure you want to refresh your API Key?"
        )

        if (!refresh) return

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
                getAdminInfo()
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
            getAdminInfo()
            showToast(toastTitle, toastDescription, "success")
        }
    }

    return (
        <Flex
            align="center"
            justify="space-between"
            p={4}
            borderRadius="md"
            border="1px"
            color={isEnabled ? "balticSea.900" : "balticSea.400"}
            minWidth="300px"
            height="48px"
        >
            <Flex align="center" flexGrow={1} justify="center">
                <Box>
                    <Text fontWeight="bold" colorScheme="primary">
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
                                height="40px"
                                icon={<ViewIcon />}
                                onClick={showApiKey}
                                aria-label="View API Key"
                            />
                        </Tooltip>
                        <Tooltip label="Copy API Key">
                            <IconButton
                                height="40px"
                                icon={isCopied ? <CheckIcon /> : <CopyIcon />}
                                onClick={handleCopy}
                                ml={2}
                                aria-label="Copy API Key"
                                isDisabled={!isEnabled}
                            />
                        </Tooltip>
                        <Tooltip label="Refresh API Key">
                            <IconButton
                                height="40px"
                                icon={<RepeatIcon />}
                                onClick={handleRefresh}
                                ml={2}
                                aria-label="Refresh API Key"
                                isDisabled={!isEnabled}
                            />
                        </Tooltip>
                    </Flex>
                )}
            </Flex>
        </Flex>
    )
}
