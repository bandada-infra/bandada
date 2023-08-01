import { validators } from "@bandada/reputation"
import {
    Box,
    Button,
    Container,
    Heading,
    HStack,
    Icon,
    Image,
    Input,
    ListItem,
    Select,
    Tag,
    Text,
    UnorderedList,
    VStack
} from "@chakra-ui/react"
import { useState } from "react"
import { FiHardDrive, FiZap } from "react-icons/fi"
import { MdOutlineKeyboardArrowRight } from "react-icons/md"
import { useNavigate } from "react-router-dom"
import icon1Image from "../assets/icon1.svg"
import icon2Image from "../assets/icon2.svg"
import icon3Image from "../assets/icon3.svg"
import icon4Image from "../assets/icon4.svg"
import image2 from "../assets/image2.svg"
import GroupCard from "../components/group-card"
import { groupSizes } from "../data"
import capitalize from "../utils/capitalize"

const steps = ["General info", "Group size", "Member mechanism", "Summary"]
const groupTypes = ["on-chain", "off-chain"]
const accessModes = ["manual", "credentials"]

export default function NewGroupPage(): JSX.Element {
    const [_currentStep, setCurrentStep] = useState<number>(0)
    const [_groupName, setGroupName] = useState<string>("")
    const [_groupDescription, setGroupDescription] = useState<string>()
    const [_groupType, setGroupType] = useState<"off-chain" | "on-chain">()
    const [_treeDepth, setTreeDepth] = useState<number>()
    const [_accessMode, setAccessMode] = useState<"manual" | "credentials">()
    const navigate = useNavigate()

    return (
        <Container maxW="container.xl" px="8" pb="20">
            <VStack spacing="9" flex="1">
                <HStack justifyContent="space-between" width="100%">
                    <Heading fontSize="40px" as="h1">
                        Nueva bandada
                    </Heading>
                </HStack>

                <HStack w="100%" bg="balticSea.50" p="16px" borderRadius="8px">
                    {steps.map((step, i) => (
                        <HStack
                            onClick={
                                i < _currentStep
                                    ? () => setCurrentStep(i)
                                    : undefined
                            }
                            cursor={i < _currentStep ? "pointer" : "inherit"}
                            color={
                                i === _currentStep
                                    ? "balticSea.800"
                                    : "balticSea.500"
                            }
                            key={step}
                        >
                            <Text
                                color={
                                    i === _currentStep
                                        ? "balticSea.50"
                                        : "balticSea.800"
                                }
                                fontSize="13px"
                                py="4px"
                                px="10px"
                                borderRadius="50px"
                                bgGradient={
                                    i === _currentStep
                                        ? "linear(to-r, sunsetOrange.500, classicRose.600)"
                                        : "linear(to-r, balticSea.200, balticSea.200)"
                                }
                            >
                                {i + 1}
                            </Text>
                            <Text>{step}</Text>
                            {i !== steps.length - 1 && (
                                <Icon
                                    as={MdOutlineKeyboardArrowRight}
                                    boxSize={5}
                                />
                            )}
                        </HStack>
                    ))}
                </HStack>

                <HStack w="100%" align="start">
                    <VStack
                        align="left"
                        position="relative"
                        w="374px"
                        h="483px"
                        bgImg={`url(${image2})`}
                        bgRepeat="no-repeat"
                        p="20px"
                        borderRadius="8px"
                    >
                        <Box
                            position="absolute"
                            h="300px"
                            w="100%"
                            top="0px"
                            left="0px"
                            bgGradient="linear(169.41deg, #402A75 3.98%, rgba(220, 189, 238, 0) 65.06%)"
                            borderRadius="8px"
                        />

                        <Heading
                            zIndex="1"
                            fontSize="25px"
                            as="h1"
                            color="balticSea.50"
                            pb="16px"
                        >
                            Group preview
                        </Heading>

                        <Box zIndex="1">
                            <GroupCard
                                name={_groupName}
                                description={_groupDescription}
                                type={_groupType}
                                treeDepth={_treeDepth}
                            />
                        </Box>
                    </VStack>
                    <VStack
                        bg="balticSea.50"
                        py="25px"
                        px="35px"
                        borderRadius="8px"
                        flex="1"
                        align="left"
                    >
                        {_currentStep === 0 ? (
                            <>
                                <Text>What type of group is this?</Text>

                                <HStack>
                                    {groupTypes.map((groupType: any) => (
                                        <VStack
                                            borderColor={
                                                _groupType === groupType
                                                    ? "classicRose.600"
                                                    : "balticSea.200"
                                            }
                                            borderWidth="2px"
                                            borderRadius="8px"
                                            w="252px"
                                            h="210px"
                                            align="left"
                                            spacing="0"
                                            cursor="pointer"
                                            onClick={() =>
                                                setGroupType(groupType)
                                            }
                                            key={groupType}
                                        >
                                            <HStack
                                                bgColor={
                                                    _groupType === groupType
                                                        ? "classicRose.100"
                                                        : "balticSea.100"
                                                }
                                                px="20px"
                                                py="15px"
                                                borderTopRadius="8px"
                                                spacing="3"
                                            >
                                                <Icon
                                                    color={
                                                        _groupType === groupType
                                                            ? "classicRose.600"
                                                            : "balticSea.600"
                                                    }
                                                    boxSize="5"
                                                    as={
                                                        groupType === "on-chain"
                                                            ? FiZap
                                                            : FiHardDrive
                                                    }
                                                />

                                                <Text>
                                                    {groupType === "on-chain"
                                                        ? "On chain"
                                                        : "Off chain"}
                                                </Text>
                                            </HStack>

                                            <Text
                                                color="balticSea.700"
                                                px="16px"
                                                py="10px"
                                            >
                                                Quick summary of pros and cons
                                                of on-chain groups, spanning
                                                about 3 lines?
                                            </Text>
                                        </VStack>
                                    ))}
                                </HStack>

                                <VStack align="left" pt="20px">
                                    <Text>Name</Text>

                                    <Input
                                        size="lg"
                                        value={_groupName}
                                        onChange={(event) =>
                                            setGroupName(event.target.value)
                                        }
                                    />
                                    <Text fontSize="13px" color="balticSea.500">
                                        Give it a cool name you can recognize.
                                    </Text>
                                </VStack>

                                {_groupType === "off-chain" && (
                                    <VStack align="left" pt="20px">
                                        <Text>Description</Text>

                                        <Input
                                            size="lg"
                                            minLength={10}
                                            value={_groupDescription ?? ""}
                                            onChange={(event) =>
                                                setGroupDescription(
                                                    event.target.value
                                                )
                                            }
                                        />
                                        <Text
                                            fontSize="13px"
                                            color="balticSea.500"
                                        >
                                            Describe your group.
                                        </Text>
                                    </VStack>
                                )}

                                {_groupType && (
                                    <Box pt="20px">
                                        <Text
                                            p="16px"
                                            borderRadius="8px"
                                            bgColor="classicRose.100"
                                            color="classicRose.900"
                                        >
                                            {_groupType === "off-chain"
                                                ? "By continuing, you will create that will be stored in our servers."
                                                : "By continuing, you will create that lives on the Ethereum blockchain."}
                                        </Text>
                                    </Box>
                                )}
                            </>
                        ) : _currentStep === 1 ? (
                            <>
                                <Text>How big is your group?</Text>

                                <HStack w="764px" py="16px" overflowX="scroll">
                                    {groupSizes.map((groupSize) => (
                                        <VStack
                                            borderColor={
                                                _treeDepth ===
                                                groupSize.treeDepth
                                                    ? "classicRose.600"
                                                    : "balticSea.300"
                                            }
                                            borderWidth="2px"
                                            borderRadius="8px"
                                            minW="320px"
                                            h="370px"
                                            align="start"
                                            spacing="0"
                                            cursor="pointer"
                                            p="16px"
                                            onClick={() =>
                                                setTreeDepth(
                                                    groupSize.treeDepth
                                                )
                                            }
                                            key={groupSize.name}
                                        >
                                            <Image
                                                src={
                                                    groupSize.treeDepth >= 27
                                                        ? icon4Image
                                                        : groupSize.treeDepth >=
                                                          24
                                                        ? icon3Image
                                                        : groupSize.treeDepth >=
                                                          20
                                                        ? icon2Image
                                                        : icon1Image
                                                }
                                                htmlWidth="50px"
                                                alt="Bandada icon"
                                            />

                                            <Heading
                                                fontSize="25px"
                                                as="h1"
                                                pt="16px"
                                                pb="10px"
                                            >
                                                {groupSize.name}
                                            </Heading>

                                            <Tag
                                                colorScheme="primary"
                                                borderRadius="full"
                                                borderWidth={1}
                                                borderColor="classicRose.900"
                                                color="classicRose.900"
                                                bgColor="classicRose.50"
                                            >
                                                {groupSize.capacity}
                                            </Tag>

                                            <Text
                                                color="balticSea.500"
                                                py="10px"
                                            >
                                                {groupSize.description}
                                            </Text>

                                            <Text
                                                color="balticSea.700"
                                                pt="10px"
                                            >
                                                Anonymously:
                                            </Text>
                                            <UnorderedList
                                                color="balticSea.700"
                                                pl="20px"
                                            >
                                                {groupSize.useCases.map(
                                                    (useCase) => (
                                                        <ListItem key={useCase}>
                                                            {useCase}
                                                        </ListItem>
                                                    )
                                                )}
                                            </UnorderedList>
                                        </VStack>
                                    ))}
                                </HStack>
                            </>
                        ) : (
                            <>
                                <HStack>
                                    {accessModes.map((accessMode: any) => (
                                        <VStack
                                            borderColor={
                                                _accessMode === accessMode
                                                    ? "classicRose.600"
                                                    : "balticSea.200"
                                            }
                                            borderWidth="2px"
                                            borderRadius="8px"
                                            w="252px"
                                            h="210px"
                                            align="left"
                                            spacing="0"
                                            cursor="pointer"
                                            onClick={() =>
                                                setAccessMode(accessMode)
                                            }
                                            key={accessMode}
                                        >
                                            <HStack
                                                bgColor={
                                                    _accessMode === accessMode
                                                        ? "classicRose.100"
                                                        : "balticSea.100"
                                                }
                                                px="20px"
                                                py="15px"
                                                borderTopRadius="8px"
                                                spacing="3"
                                            >
                                                <Icon
                                                    color={
                                                        _accessMode ===
                                                        accessMode
                                                            ? "classicRose.600"
                                                            : "balticSea.600"
                                                    }
                                                    boxSize="5"
                                                    as={
                                                        accessMode ===
                                                        "on-chain"
                                                            ? FiZap
                                                            : FiHardDrive
                                                    }
                                                />

                                                <Text>
                                                    {capitalize(accessMode)}
                                                </Text>
                                            </HStack>

                                            <Text
                                                color="balticSea.700"
                                                px="16px"
                                                py="10px"
                                            >
                                                {accessMode === "manual"
                                                    ? "I’ll add members by pasting in their address or sending them a generated invite link."
                                                    : "Members can join my group if they fit the criteria I will setup."}
                                            </Text>
                                        </VStack>
                                    ))}
                                </HStack>

                                {_accessMode === "credentials" && (
                                    <>
                                        <VStack align="left" pt="20px">
                                            <Text>
                                                Choose credential and provider
                                            </Text>

                                            <Select
                                                size="lg"
                                                color="balticSea.400"
                                            >
                                                {validators.map((validator) => (
                                                    <option
                                                        key={validator.id}
                                                        value={validator.id}
                                                    >
                                                        {validator.id}
                                                    </option>
                                                ))}
                                            </Select>
                                        </VStack>

                                        <Box pt="20px">
                                            <Text
                                                p="16px"
                                                borderRadius="8px"
                                                bgColor="classicRose.100"
                                                color="classicRose.900"
                                            >
                                                Disclaimer: We will use a bit of
                                                your member’s data to check if
                                                they meet the criteria and
                                                generate their reputation to
                                                join the group.
                                            </Text>
                                        </Box>
                                    </>
                                )}
                            </>
                        )}

                        <HStack justify="right" pt="20px">
                            <Button
                                variant="solid"
                                colorScheme="tertiary"
                                onClick={() =>
                                    _currentStep === 0
                                        ? navigate("/groups")
                                        : setCurrentStep(_currentStep - 1)
                                }
                            >
                                {_currentStep === 0 ? "Cancel" : "Back"}
                            </Button>
                            <Button
                                isDisabled={
                                    !_groupName ||
                                    (_groupType === "off-chain" &&
                                        !_groupDescription) ||
                                    !_groupType ||
                                    (_currentStep === 1 && !_treeDepth) ||
                                    (_currentStep === 2 && !_accessMode)
                                }
                                variant="solid"
                                colorScheme="primary"
                                onClick={() => setCurrentStep(_currentStep + 1)}
                            >
                                Continue
                            </Button>
                        </HStack>
                    </VStack>
                </HStack>
            </VStack>
        </Container>
    )
}
