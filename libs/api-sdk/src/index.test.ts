import { request } from "@bandada/utils"
import ApiSdk from "./apiSdk"
import {
    GroupCreationDetails,
    Group,
    GroupUpdateDetails,
    Invite,
    SupportedUrl,
    DashboardUrl
} from "./types"
import checkParameter from "./checkParameter"

jest.mock("@bandada/utils", () => {
    const originalModule = jest.requireActual("@bandada/utils")

    return {
        __esModule: true,
        ...originalModule,
        request: jest.fn()
    }
})

const requestMocked = request as jest.MockedFunction<typeof request>

describe("Bandada API SDK", () => {
    describe("ApiSdk constructor", () => {
        it("Should create new ApiSdk instance without url and config", () => {
            const config = {
                headers: {
                    "Content-Type": "application/json"
                },
                baseURL: SupportedUrl.PROD
            }
            const apiSdk: ApiSdk = new ApiSdk()
            expect(apiSdk.url).toBe(SupportedUrl.PROD)
            expect(JSON.stringify(apiSdk.config)).toBe(JSON.stringify(config))
        })
        it("Should create new ApiSdk instance with url and without config", () => {
            const url = "htps://api.example.com"
            const config = {
                headers: {
                    "Content-Type": "application/json"
                },
                baseURL: url
            }
            const apiSdk: ApiSdk = new ApiSdk(url)
            expect(apiSdk.url).toBe(url)
            expect(JSON.stringify(apiSdk.config)).toBe(JSON.stringify(config))
        })
        it("Should create new ApiSdk instance with url and config", () => {
            const config = {
                headers: {
                    "Content-Type": "text/html"
                },
                baseURL: SupportedUrl.PROD
            }
            const apiSdk: ApiSdk = new ApiSdk(SupportedUrl.PROD, config)
            expect(apiSdk.url).toBe(SupportedUrl.PROD)
            expect(apiSdk.config).toBe(config)
        })
        it("Should throw and error because url and baseURL are not the same", () => {
            const config = {
                headers: {
                    "Content-Type": "text/html"
                },
                baseURL: SupportedUrl.PROD
            }
            const fun = () => new ApiSdk(SupportedUrl.DEV, config)
            expect(fun).toThrow("The url and baseURL should be the same")
        })
        it("Should throw an error when the url has the wrong type", () => {
            const url = 123
            const fun = () => new ApiSdk(url as any)
            expect(fun).toThrow("Parameter 'url' is not a string")
        })
        it("Should add the baseURL to config", () => {
            const config = {
                headers: {
                    "Content-Type": "text/html"
                }
            }
            const apiSdk: ApiSdk = new ApiSdk(SupportedUrl.DEV, config)
            expect(apiSdk.url).toBe(SupportedUrl.DEV)
        })
    })
    describe("Groups", () => {
        describe("#createGroup", () => {
            it("Should create a group", async () => {
                const expectedGroup: GroupCreationDetails = {
                    name: "Group1",
                    description: "This is a new group",
                    treeDepth: 16,
                    fingerprintDuration: 3600
                }
                const apiKey = "70f07d0d-6aa2-4fe1-b4b9-06c271a641dc"

                requestMocked.mockImplementationOnce(() =>
                    Promise.resolve([
                        {
                            id: "10402173435763029700781503965100",
                            name: "Group1",
                            description: "This is a new group",
                            admin: "0xdf558148e66850ac48dbe2c8119b0eefa7d08bfd19c997c90a142eb97916b847",
                            treeDepth: 16,
                            fingerprintDuration: 3600,
                            createdAt: "2023-07-15T08:21:05.000Z",
                            members: [],
                            credentials: null
                        }
                    ])
                )

                const apiSdk: ApiSdk = new ApiSdk(SupportedUrl.DEV)
                const group: Group = await apiSdk.createGroup(
                    expectedGroup,
                    apiKey
                )

                expect(group.description).toBe(expectedGroup.description)
                expect(group.name).toBe(expectedGroup.name)
                expect(group.treeDepth).toBe(expectedGroup.treeDepth)
                expect(group.fingerprintDuration).toBe(
                    expectedGroup.fingerprintDuration
                )
                expect(group.members).toHaveLength(0)
                expect(group.credentials).toBeNull()
            })
            it("Should create a credential group", async () => {
                const credentials = {
                    id: "BLOCKCHAIN_BALANCE",
                    criteria: {
                        minBalance: "10",
                        network: "Sepolia"
                    }
                }

                const expectedGroup: GroupCreationDetails = {
                    name: "Group1",
                    description: "This is a new group",
                    treeDepth: 16,
                    fingerprintDuration: 3600,
                    credentials
                }
                const apiKey = "70f07d0d-6aa2-4fe1-b4b9-06c271a641dc"

                requestMocked.mockImplementationOnce(() =>
                    Promise.resolve([
                        {
                            id: "10402173435763029700781503965100",
                            name: "Group1",
                            description: "This is a new group",
                            admin: "0xdf558148e66850ac48dbe2c8119b0eefa7d08bfd19c997c90a142eb97916b847",
                            treeDepth: 16,
                            fingerprintDuration: 3600,
                            createdAt: "2023-07-15T08:21:05.000Z",
                            members: [],
                            credentials: JSON.stringify(credentials)
                        }
                    ])
                )

                const apiSdk: ApiSdk = new ApiSdk(SupportedUrl.DEV)
                const group: Group = await apiSdk.createGroup(
                    expectedGroup,
                    apiKey
                )

                expect(group.description).toBe(expectedGroup.description)
                expect(group.name).toBe(expectedGroup.name)
                expect(group.treeDepth).toBe(expectedGroup.treeDepth)
                expect(group.fingerprintDuration).toBe(
                    expectedGroup.fingerprintDuration
                )
                expect(group.members).toHaveLength(0)
                expect(group.credentials).toStrictEqual(
                    JSON.stringify(expectedGroup.credentials)
                )
            })
            it("Should create a multiple credentials group", async () => {
                const credentials = {
                    credentials: [
                        {
                            id: "BLOCKCHAIN_TRANSACTIONS",
                            criteria: {
                                minTransactions: 10,
                                network: "Sepolia"
                            }
                        },
                        {
                            id: "BLOCKCHAIN_BALANCE",
                            criteria: {
                                minBalance: "5",
                                network: "Sepolia"
                            }
                        }
                    ],
                    expression: ["", "and", ""]
                }

                const expectedGroup: GroupCreationDetails = {
                    name: "Group1",
                    description: "This is a new group",
                    treeDepth: 16,
                    fingerprintDuration: 3600,
                    credentials
                }
                const apiKey = "70f07d0d-6aa2-4fe1-b4b9-06c271a641dc"

                requestMocked.mockImplementationOnce(() =>
                    Promise.resolve([
                        {
                            id: "10402173435763029700781503965100",
                            name: "Group1",
                            description: "This is a new group",
                            admin: "0xdf558148e66850ac48dbe2c8119b0eefa7d08bfd19c997c90a142eb97916b847",
                            treeDepth: 16,
                            fingerprintDuration: 3600,
                            createdAt: "2023-07-15T08:21:05.000Z",
                            members: [],
                            credentials: JSON.stringify(credentials)
                        }
                    ])
                )

                const apiSdk: ApiSdk = new ApiSdk(SupportedUrl.DEV)
                const group: Group = await apiSdk.createGroup(
                    expectedGroup,
                    apiKey
                )

                expect(group.description).toBe(expectedGroup.description)
                expect(group.name).toBe(expectedGroup.name)
                expect(group.treeDepth).toBe(expectedGroup.treeDepth)
                expect(group.fingerprintDuration).toBe(
                    expectedGroup.fingerprintDuration
                )
                expect(group.members).toHaveLength(0)
                expect(group.credentials).toStrictEqual(
                    JSON.stringify(expectedGroup.credentials)
                )
            })
        })
        describe("#createGroups", () => {
            it("Should create the groups", async () => {
                const expectedGroups: Array<GroupCreationDetails> = [
                    {
                        name: "Group1",
                        description: "This is a new group",
                        treeDepth: 16,
                        fingerprintDuration: 3600
                    },
                    {
                        name: "Group2",
                        description: "This is a new group",
                        treeDepth: 32,
                        fingerprintDuration: 7200
                    }
                ]
                const apiKey = "70f07d0d-6aa2-4fe1-b4b9-06c271a641dc"

                requestMocked.mockImplementationOnce(() =>
                    Promise.resolve([
                        {
                            id: "10402173435763029700781503965100",
                            name: "Group1",
                            description: "This is a new group",
                            admin: "0xdf558148e66850ac48dbe2c8119b0eefa7d08bfd19c997c90a142eb97916b847",
                            treeDepth: 16,
                            fingerprintDuration: 3600,
                            createdAt: "2023-07-15T08:21:05.000Z",
                            members: [],
                            credentials: null
                        },
                        {
                            id: "20402173435763029700781503965200",
                            name: "Group2",
                            description: "This is a new group",
                            admin: "0xdf558148e66850ac48dbe2c8119b0eefa7d08bfd19c997c90a142eb97916b847",
                            treeDepth: 32,
                            fingerprintDuration: 7200,
                            createdAt: "2023-07-15T08:21:05.000Z",
                            members: [],
                            credentials: null
                        }
                    ])
                )

                const apiSdk: ApiSdk = new ApiSdk(SupportedUrl.DEV)
                const groups: Array<Group> = await apiSdk.createGroups(
                    [expectedGroups[0], expectedGroups[1]],
                    apiKey
                )

                groups.forEach((group: Group, i: number) => {
                    expect(group.description).toBe(
                        expectedGroups[i].description
                    )
                    expect(group.name).toBe(expectedGroups[i].name)
                    expect(group.treeDepth).toBe(expectedGroups[i].treeDepth)
                    expect(group.fingerprintDuration).toBe(
                        expectedGroups[i].fingerprintDuration
                    )
                    expect(group.members).toHaveLength(0)
                    expect(group.credentials).toBeNull()
                })
            })

            it("Should not create a group if the treeDepth is not between 16 and 32", async () => {
                const expectedGroups: Array<GroupCreationDetails> = [
                    {
                        name: "Group3",
                        description: "This is a new group",
                        treeDepth: 15,
                        fingerprintDuration: 3600
                    }
                ]
                const apiKey = "70f07d0d-6aa2-4fe1-b4b9-06c271a641dc"
                const apiSdk: ApiSdk = new ApiSdk(SupportedUrl.DEV)
                const fun = apiSdk.createGroups([expectedGroups[0]], apiKey)

                await expect(fun).rejects.toThrow(
                    "The tree depth must be between 16 and 32"
                )
            })
        })
        describe("#removeGroup", () => {
            it("Should create a group", async () => {
                const groupId = "10402173435763029700781503965100"
                const apiKey = "70f07d0d-6aa2-4fe1-b4b9-06c271a641dc"

                requestMocked.mockImplementationOnce(() => Promise.resolve())

                const apiSdk: ApiSdk = new ApiSdk(SupportedUrl.DEV)
                const res = await apiSdk.removeGroup(groupId, apiKey)
                expect(res).toBeUndefined()
            })
        })
        describe("#removeGroups", () => {
            it("Should create a group", async () => {
                const groupIds = [
                    "10402173435763029700781503965100",
                    "20402173435763029700781503965200"
                ]
                const apiKey = "70f07d0d-6aa2-4fe1-b4b9-06c271a641dc"

                requestMocked.mockImplementationOnce(() => Promise.resolve())

                const apiSdk: ApiSdk = new ApiSdk(SupportedUrl.DEV)
                const res = await apiSdk.removeGroups(groupIds, apiKey)
                expect(res).toBeUndefined()
            })
        })
        describe("#updateGroup", () => {
            it("Should update a group", async () => {
                const groupId = "10402173435763029700781503965100"
                const updatedGroup: GroupUpdateDetails = {
                    description: "This is a new group",
                    treeDepth: 16,
                    fingerprintDuration: 3600
                }
                const apiKey = "70f07d0d-6aa2-4fe1-b4b9-06c271a641dc"

                requestMocked.mockImplementationOnce(() =>
                    Promise.resolve({
                        id: "10402173435763029700781503965100",
                        name: "Group1",
                        description: "This is a new group",
                        admin: "0xdf558148e66850ac48dbe2c8119b0eefa7d08bfd19c997c90a142eb97916b847",
                        treeDepth: 16,
                        fingerprintDuration: 3600,
                        createdAt: "2023-07-15T08:21:05.000Z",
                        members: [],
                        credentials: null
                    })
                )

                const apiSdk: ApiSdk = new ApiSdk(SupportedUrl.DEV)
                const group: Group = await apiSdk.updateGroup(
                    groupId,
                    updatedGroup,
                    apiKey
                )

                expect(group.description).toBe(updatedGroup.description)
                expect(group.treeDepth).toBe(updatedGroup.treeDepth)
                expect(group.fingerprintDuration).toBe(
                    updatedGroup.fingerprintDuration
                )
            })
        })
        describe("#updateGroups", () => {
            it("Should update some groups", async () => {
                const groupIds = [
                    "10402173435763029700781503965100",
                    "20402173435763029700781503965200"
                ]
                const updatedGroups: Array<GroupUpdateDetails> = [
                    {
                        description: "This is a new group1",
                        treeDepth: 32,
                        fingerprintDuration: 7200
                    },
                    {
                        description: "This is a new group2",
                        treeDepth: 32,
                        fingerprintDuration: 7200
                    }
                ]
                const apiKey = "70f07d0d-6aa2-4fe1-b4b9-06c271a641dc"

                requestMocked.mockImplementationOnce(() =>
                    Promise.resolve([
                        {
                            id: "10402173435763029700781503965100",
                            name: "Group1",
                            description: "This is a new group1",
                            admin: "0xdf558148e66850ac48dbe2c8119b0eefa7d08bfd19c997c90a142eb97916b847",
                            treeDepth: 32,
                            fingerprintDuration: 7200,
                            createdAt: "2023-07-15T08:21:05.000Z",
                            members: [],
                            credentials: null
                        },
                        {
                            id: "20402173435763029700781503965200",
                            name: "Group1",
                            description: "This is a new group2",
                            admin: "0xdf558148e66850ac48dbe2c8119b0eefa7d08bfd19c997c90a142eb97916b847",
                            treeDepth: 32,
                            fingerprintDuration: 7200,
                            createdAt: "2023-07-15T08:21:05.000Z",
                            members: [],
                            credentials: null
                        }
                    ])
                )

                const apiSdk: ApiSdk = new ApiSdk(SupportedUrl.DEV)
                const groups: Array<Group> = await apiSdk.updateGroups(
                    groupIds,
                    updatedGroups,
                    apiKey
                )

                groups.forEach((group: Group, i: number) => {
                    expect(group.description).toBe(updatedGroups[i].description)
                    expect(group.treeDepth).toBe(updatedGroups[i].treeDepth)
                    expect(group.fingerprintDuration).toBe(
                        updatedGroups[i].fingerprintDuration
                    )
                })
            })
        })
        describe("#getGroups", () => {
            it("Should return all groups", async () => {
                requestMocked.mockImplementationOnce(() =>
                    Promise.resolve([
                        {
                            id: "10402173435763029700781503965100",
                            name: "Group1",
                            description: "This is a new group",
                            admin: "0xdf558148e66850ac48dbe2c8119b0eefa7d08bfd19c997c90a142eb97916b847",
                            treeDepth: 16,
                            fingerprintDuration: 3600,
                            createdAt: "2023-07-15T08:21:05.000Z",
                            members: [],
                            credentials: null
                        }
                    ])
                )
                const apiSdk: ApiSdk = new ApiSdk(SupportedUrl.DEV)
                const groups: Group[] = await apiSdk.getGroups()
                expect(groups).toHaveLength(1)
            })
            it("Should return all groups and null in the credentials that don't have a valid JSON string", async () => {
                requestMocked.mockImplementationOnce(() =>
                    Promise.resolve([
                        {
                            id: "10402173435763029700781503965100",
                            name: "Group1",
                            description: "This is a new group",
                            admin: "0xdf558148e66850ac48dbe2c8119b0eefa7d08bfd19c997c90a142eb97916b847",
                            treeDepth: 16,
                            fingerprintDuration: 3600,
                            createdAt: "2023-07-15T08:21:05.000Z",
                            members: [],
                            credentials: {}
                        }
                    ])
                )
                const apiSdk: ApiSdk = new ApiSdk(SupportedUrl.DEV)
                const groups: Group[] = await apiSdk.getGroups()
                expect(groups).toHaveLength(1)
                expect(groups[0].credentials).toBeNull()
            })
        })
        describe("#getGroupsByAdminId", () => {
            it("Should return all groups by admin id", async () => {
                requestMocked.mockImplementationOnce(() =>
                    Promise.resolve([
                        {
                            id: "10402173435763029700781503965100",
                            name: "Group1",
                            description: "This is a new group",
                            admin: "0xdf558148e66850ac48dbe2c8119b0eefa7d08bfd19c997c90a142eb97916b847",
                            treeDepth: 16,
                            fingerprintDuration: 3600,
                            createdAt: "2023-07-15T08:21:05.000Z",
                            members: [],
                            credentials: null
                        }
                    ])
                )

                const adminId =
                    "0xdf558148e66850ac48dbe2c8119b0eefa7d08bfd19c997c90a142eb97916b847"

                const apiSdk: ApiSdk = new ApiSdk(SupportedUrl.DEV)
                const groups: Group[] = await apiSdk.getGroupsByAdminId(adminId)
                expect(groups).toHaveLength(1)
                groups.forEach((group: Group) => {
                    expect(group.admin).toBe(adminId)
                })
            })
            it("Should return all groups by admin id and null in the credentials that don't have a valid JSON string", async () => {
                requestMocked.mockImplementationOnce(() =>
                    Promise.resolve([
                        {
                            id: "10402173435763029700781503965100",
                            name: "Group1",
                            description: "This is a new group",
                            admin: "0xdf558148e66850ac48dbe2c8119b0eefa7d08bfd19c997c90a142eb97916b847",
                            treeDepth: 16,
                            fingerprintDuration: 3600,
                            createdAt: "2023-07-15T08:21:05.000Z",
                            members: [],
                            credentials: {}
                        }
                    ])
                )

                const adminId =
                    "0xdf558148e66850ac48dbe2c8119b0eefa7d08bfd19c997c90a142eb97916b847"

                const apiSdk: ApiSdk = new ApiSdk(SupportedUrl.DEV)
                const groups: Group[] = await apiSdk.getGroupsByAdminId(adminId)
                expect(groups).toHaveLength(1)
                groups.forEach((group: Group) => {
                    expect(group.admin).toBe(adminId)
                    expect(group.credentials).toBeNull()
                })
            })
        })
        describe("#getGroupsByMemberId", () => {
            it("Should return all groups by member id", async () => {
                requestMocked.mockImplementationOnce(() =>
                    Promise.resolve([
                        {
                            id: "10402173435763029700781503965100",
                            name: "Group1",
                            description: "This is a new group",
                            admin: "0xdf558148e66850ac48dbe2c8119b0eefa7d08bfd19c997c90a142eb97916b847",
                            treeDepth: 16,
                            fingerprintDuration: 3600,
                            createdAt: "2023-07-15T08:21:05.000Z",
                            members: ["1"],
                            credentials: null
                        }
                    ])
                )

                const memberId = "1"

                const apiSdk: ApiSdk = new ApiSdk(SupportedUrl.DEV)
                const groups: Group[] = await apiSdk.getGroupsByMemberId(
                    memberId
                )
                expect(groups).toHaveLength(1)
            })
            it("Should return all groups by member id and null in the credentials that don't have a valid JSON string", async () => {
                requestMocked.mockImplementationOnce(() =>
                    Promise.resolve([
                        {
                            id: "10402173435763029700781503965100",
                            name: "Group1",
                            description: "This is a new group",
                            admin: "0xdf558148e66850ac48dbe2c8119b0eefa7d08bfd19c997c90a142eb97916b847",
                            treeDepth: 16,
                            fingerprintDuration: 3600,
                            createdAt: "2023-07-15T08:21:05.000Z",
                            members: ["1"],
                            credentials: {}
                        }
                    ])
                )

                const memberId = "1"

                const apiSdk: ApiSdk = new ApiSdk(SupportedUrl.DEV)
                const groups: Group[] = await apiSdk.getGroupsByMemberId(
                    memberId
                )
                expect(groups).toHaveLength(1)
                expect(groups[0].credentials).toBeNull()
            })
        })
        describe("getGroupsByGroupIds", () => {
            it("Should return all groups by group ids", async () => {
                requestMocked.mockImplementationOnce(() =>
                    Promise.resolve([
                        {
                            id: "10402173435763029700781503965100",
                            name: "Group1",
                            description: "This is a new group",
                            admin: "0xdf558148e66850ac48dbe2c8119b0eefa7d08bfd19c997c90a142eb97916b847",
                            treeDepth: 16,
                            fingerprintDuration: 3600,
                            createdAt: "2023-07-15T08:21:05.000Z",
                            members: [],
                            credentials: null
                        }
                    ])
                )

                const groupIds = ["10402173435763029700781503965100"]

                const apiSdk: ApiSdk = new ApiSdk(SupportedUrl.DEV)
                const groups: Group[] = await apiSdk.getGroupsByGroupIds(
                    groupIds
                )
                expect(groups).toHaveLength(1)
            })
            it("Should return all groups by group ids and null in the credentials that don't have a valid JSON string", async () => {
                requestMocked.mockImplementationOnce(() =>
                    Promise.resolve([
                        {
                            id: "10402173435763029700781503965100",
                            name: "Group1",
                            description: "This is a new group",
                            admin: "0xdf558148e66850ac48dbe2c8119b0eefa7d08bfd19c997c90a142eb97916b847",
                            treeDepth: 16,
                            fingerprintDuration: 3600,
                            createdAt: "2023-07-15T08:21:05.000Z",
                            members: [],
                            credentials: {}
                        }
                    ])
                )

                const groupIds = ["10402173435763029700781503965100"]

                const apiSdk: ApiSdk = new ApiSdk(SupportedUrl.DEV)
                const groups: Group[] = await apiSdk.getGroupsByGroupIds(
                    groupIds
                )
                expect(groups).toHaveLength(1)
                expect(groups[0].credentials).toBeNull()
            })
        })
        describe("#getGroup", () => {
            it("Should return a group", async () => {
                requestMocked.mockImplementationOnce(() =>
                    Promise.resolve({
                        id: "10402173435763029700781503965100",
                        name: "Group1",
                        description: "This is a new group",
                        admin: "0xdf558148e66850ac48dbe2c8119b0eefa7d08bfd19c997c90a142eb97916b847",
                        treeDepth: 16,
                        fingerprintDuration: 3600,
                        createdAt: "2023-07-15T08:21:05.000Z",
                        members: [],
                        credentials: null
                    })
                )
                const groupId = "10402173435763029700781503965100"

                const apiSdk: ApiSdk = new ApiSdk(SupportedUrl.DEV)
                const group: Group = await apiSdk.getGroup(groupId)
                expect(group.id).toBe(groupId)
            })
            it("Should return a credential group", async () => {
                const credentials = {
                    id: "BLOCKCHAIN_BALANCE",
                    criteria: {
                        minBalance: "10",
                        network: "Sepolia"
                    }
                }
                requestMocked.mockImplementationOnce(() =>
                    Promise.resolve({
                        id: "10402173435763029700781503965100",
                        name: "Group1",
                        description: "This is a new group",
                        admin: "0xdf558148e66850ac48dbe2c8119b0eefa7d08bfd19c997c90a142eb97916b847",
                        treeDepth: 16,
                        fingerprintDuration: 3600,
                        createdAt: "2023-07-15T08:21:05.000Z",
                        members: [],
                        credentials: JSON.stringify(credentials)
                    })
                )
                const groupId = "10402173435763029700781503965100"

                const apiSdk: ApiSdk = new ApiSdk(SupportedUrl.DEV)
                const group: Group = await apiSdk.getGroup(groupId)
                expect(group.id).toBe(groupId)
                expect(group.credentials).toStrictEqual(credentials)
            })
            it("Should return null in credentials if credentials is not a valid JSON string", async () => {
                requestMocked.mockImplementationOnce(() =>
                    Promise.resolve({
                        id: "10402173435763029700781503965100",
                        name: "Group1",
                        description: "This is a new group",
                        admin: "0xdf558148e66850ac48dbe2c8119b0eefa7d08bfd19c997c90a142eb97916b847",
                        treeDepth: 16,
                        fingerprintDuration: 3600,
                        createdAt: "2023-07-15T08:21:05.000Z",
                        members: [],
                        credentials: {}
                    })
                )
                const groupId = "10402173435763029700781503965100"

                const apiSdk: ApiSdk = new ApiSdk(SupportedUrl.DEV)
                const group: Group = await apiSdk.getGroup(groupId)
                expect(group.id).toBe(groupId)
                expect(group.credentials).toBeNull()
            })
        })
        describe("#isGroupMember", () => {
            it("Should return true because the member is part of the group", async () => {
                requestMocked.mockImplementationOnce(() =>
                    Promise.resolve(true)
                )

                const groupId = "10402173435763029700781503965100"
                const memberId = "1"

                const apiSdk: ApiSdk = new ApiSdk(SupportedUrl.DEV)
                const isMember: boolean = await apiSdk.isGroupMember(
                    groupId,
                    memberId
                )
                expect(isMember).toBe(true)
            })
            it("Should return false because the member is not part of the group", async () => {
                requestMocked.mockImplementationOnce(() =>
                    Promise.resolve(false)
                )

                const groupId = "10402173435763029700781503965100"
                const memberId = "2"

                const apiSdk: ApiSdk = new ApiSdk(SupportedUrl.DEV)
                const isMember: boolean = await apiSdk.isGroupMember(
                    groupId,
                    memberId
                )
                expect(isMember).toBe(false)
            })
        })
        describe("#generateMerkleProof", () => {
            it("Should return a Merkle Proof", async () => {
                requestMocked.mockImplementationOnce(() =>
                    Promise.resolve({
                        root: "16120817324115479839090910434483215148302532798895768237083755631824751661672",
                        leaf: "1",
                        pathIndices: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
                        ],
                        siblings: [
                            "384408577843501022310959887828614832614930811451158175959898700407399293447",
                            "11464637998466348158990864764171988441365624809276502223022326352183999603897",
                            "16995802126328450145626989538740075750482497167830680899191230719087399941271",
                            "12284288117917133995532936820627390983704295203575990380477368677308417626085",
                            "11789345746101565609147792291852263546840589969088991361216951948942699675178",
                            "11715627449760558697639721113198255812003033659557667855646415594066767134734",
                            "21444426520145645594433040565608292060601733719630904203203956291237625643120",
                            "12000229382683300344707010229427676755707019352102610638537601352467378730838",
                            "5328720977031845440638155587701595855968137595058586028782051652537401280322",
                            "3422961763534257451648502427966318678375730557678257655173599141056664711143",
                            "7465412440922841031537086657026230317924219203646131997866006596280274386279",
                            "16954651410792361482651176096873979323285202722587039715561067317373223534207",
                            "722210113753171120380705056299492855313462195113296610907348223686002467060",
                            "1780181428187769532820921253060913519472437891117210941872806914943370199985",
                            "3961869937726402877486590678513246159805661477250039204649652346238669559917",
                            "6014115290839581304201972414043084008090227286903636684274551222297410836423"
                        ]
                    })
                )
                const groupId = "10402173435763029700781503965100"
                const memberId = "1"

                const apiSdk: ApiSdk = new ApiSdk(SupportedUrl.DEV)
                const proof: string = await apiSdk.generateMerkleProof(
                    groupId,
                    memberId
                )
                expect(proof["leaf"]).toBe(memberId)
            })
        })
        describe("#addMember", () => {
            it("Should add a member to the group using an API Key", async () => {
                requestMocked.mockImplementationOnce(() => Promise.resolve())

                const groupId = "10402173435763029700781503965100"
                const memberId = "1"
                const apiKey = "70f07d0d-6aa2-4fe1-b4b9-06c271a641dc"

                const apiSdk: ApiSdk = new ApiSdk(SupportedUrl.DEV)
                const res = await apiSdk.addMemberByApiKey(
                    groupId,
                    memberId,
                    apiKey
                )
                expect(res).toBeUndefined()
            })
            it("Should add a member to the group using an Invite Code", async () => {
                requestMocked.mockImplementationOnce(() => Promise.resolve())

                const groupId = "10402173435763029700781503965100"
                const memberId = "1"
                const inviteCode = "MQYS4UR5"

                const apiSdk: ApiSdk = new ApiSdk(SupportedUrl.DEV)
                const res = await apiSdk.addMemberByInviteCode(
                    groupId,
                    memberId,
                    inviteCode
                )
                expect(res).toBeUndefined()
            })
        })
        describe("#addMembers", () => {
            it("Should add multiple members to the group using an API Key", async () => {
                requestMocked.mockImplementationOnce(() => Promise.resolve())

                const groupId = "10402173435763029700781503965100"
                const memberIds = ["1", "2", "3"]
                const apiKey = "70f07d0d-6aa2-4fe1-b4b9-06c271a641dc"

                const apiSdk: ApiSdk = new ApiSdk(SupportedUrl.DEV)
                const res = await apiSdk.addMembersByApiKey(
                    groupId,
                    memberIds,
                    apiKey
                )
                expect(res).toBeUndefined()
            })
        })

        describe("#addMemberToGroups", () => {
            it("Should add a member to multiple groups using an API Key", async () => {
                requestMocked.mockImplementationOnce(() => Promise.resolve())

                const groupIds = [
                    "10402173435763029700781503965100",
                    "20402173435763029700781503965200"
                ]
                const memberId = "1"
                const apiKey = "70f07d0d-6aa2-4fe1-b4b9-06c271a641dc"

                const apiSdk: ApiSdk = new ApiSdk(SupportedUrl.DEV)
                const res = await apiSdk.addMemberToGroupsByApiKey(
                    groupIds,
                    memberId,
                    apiKey
                )

                expect(res).toBeUndefined()
            })
        })

        describe("#removeMemberByApiKey", () => {
            it("Should remove a member from a group using an API Key", async () => {
                requestMocked.mockImplementationOnce(() => Promise.resolve())

                const groupId = "10402173435763029700781503965100"
                const memberId = "1"
                const apiKey = "70f07d0d-6aa2-4fe1-b4b9-06c271a641dc"

                const apiSdk: ApiSdk = new ApiSdk(SupportedUrl.DEV)
                const res = await apiSdk.removeMemberByApiKey(
                    groupId,
                    memberId,
                    apiKey
                )
                expect(res).toBeUndefined()
            })
        })

        describe("#removeMembersByApiKey", () => {
            it("Should remove multiple members from a group using an API Key", async () => {
                requestMocked.mockImplementationOnce(() => Promise.resolve())

                const groupId = "10402173435763029700781503965100"
                const memberIds = ["1", "2", "3"]
                const apiKey = "70f07d0d-6aa2-4fe1-b4b9-06c271a641dc"

                const apiSdk: ApiSdk = new ApiSdk(SupportedUrl.DEV)
                const res = await apiSdk.removeMembersByApiKey(
                    groupId,
                    memberIds,
                    apiKey
                )
                expect(res).toBeUndefined()
            })
        })

        describe("#getCredentialGroupJoinUrl", () => {
            it("Should generate a custom url for joining a credential group", async () => {
                const dashboardUrl = DashboardUrl.DEV
                const groupId = "10402173435763029700781503965100"
                const commitment = "1"
                const providerName = "github"
                const redirectUri = "http://localhost:3003"

                const apiSdk: ApiSdk = new ApiSdk(SupportedUrl.DEV)
                const res = apiSdk.getCredentialGroupJoinUrl(
                    dashboardUrl,
                    groupId,
                    commitment,
                    providerName,
                    redirectUri
                )

                const url = `${dashboardUrl}/credentials?group=${groupId}&member=${commitment}&provider=${providerName}&redirect_uri=${redirectUri}?redirect=true`

                expect(res).toBe(url)
            })
        })

        describe("#getMultipleCredentialGroupJoinUrl", () => {
            it("Should generate a custom url for joining a multiple credential group", async () => {
                const dashboardUrl = DashboardUrl.DEV
                const groupId = "10402173435763029700781503965100"
                const commitment = "1"

                const apiSdk: ApiSdk = new ApiSdk(SupportedUrl.DEV)
                const res = apiSdk.getMultipleCredentialsGroupJoinUrl(
                    dashboardUrl,
                    groupId,
                    commitment
                )

                const url = `${dashboardUrl}/credentials?group=${groupId}&member=${commitment}&type=multiple`

                expect(res).toBe(url)
            })
        })
    })
    describe("Invites", () => {
        it("# createInvite", async () => {
            const groupId = "95633257675970239314311768035433"
            const groupName = "Group 1"
            const group = {
                id: groupId,
                name: groupName,
                description: "This is Group 1",
                adminId:
                    "0x63229164c457584616006e31d1e171e6cdd4163695bc9c4bf0227095998ffa4c",
                treeDepth: 16,
                fingerprintDuration: 3600,
                credentials: null,
                apiEnabled: false,
                apiKey: null,
                createdAt: "2023-08-09T18:09:53.000Z",
                updatedAt: "2023-08-09T18:09:53.000Z"
            }
            const apiKey = "70f07d0d-6aa2-4fe1-b4b9-06c271a641dc"
            const inviteCode = "C5VAG4HD"
            const inviteCreatedAt = "2023-08-09T18:10:02.000Z"

            requestMocked.mockImplementationOnce(() =>
                Promise.resolve({
                    code: inviteCode,
                    isRedeemed: false,
                    createdAt: inviteCreatedAt,
                    group
                })
            )

            const apiSdk: ApiSdk = new ApiSdk(SupportedUrl.DEV)
            const invite: Invite = await apiSdk.createInvite(groupId, apiKey)

            expect(invite.code).toBe(inviteCode)
            expect(invite.createdAt).toBe(inviteCreatedAt)
            expect(invite.code).toBe(inviteCode)
            expect(invite.group).toStrictEqual(group)
        })

        describe("# getInvite", () => {
            it("Should return an invite", async () => {
                const groupId = "95633257675970239314311768035433"
                const groupName = "Group 1"
                const group = {
                    id: groupId,
                    name: groupName,
                    description: "This is Group 1",
                    adminId:
                        "0x63229164c457584616006e31d1e171e6cdd4163695bc9c4bf0227095998ffa4c",
                    treeDepth: 16,
                    fingerprintDuration: 3600,
                    credentials: null,
                    apiEnabled: false,
                    apiKey: null,
                    createdAt: "2023-08-09T18:09:53.000Z",
                    updatedAt: "2023-08-09T18:09:53.000Z"
                }
                const inviteCode = "C5VAG4HD"
                const inviteCreatedAt = "2023-08-09T18:10:02.000Z"

                requestMocked.mockImplementationOnce(() =>
                    Promise.resolve({
                        code: inviteCode,
                        isRedeemed: false,
                        createdAt: inviteCreatedAt,
                        group
                    })
                )

                const apiSdk: ApiSdk = new ApiSdk(SupportedUrl.DEV)
                const invite: Invite = await apiSdk.getInvite(inviteCode)

                expect(invite.code).toBe(inviteCode)
                expect(invite.createdAt).toBe(inviteCreatedAt)
                expect(invite.code).toBe(inviteCode)
                expect(invite.group).toStrictEqual(group)
            })
        })

        describe("# redeemInvite", () => {
            it("Should redeem an invite", async () => {
                const groupId = "95633257675970239314311768035433"
                const groupName = "Group 1"
                const group = {
                    id: groupId,
                    name: groupName,
                    description: "This is Group 1",
                    type: "off-chain",
                    adminId:
                        "0x63229164c457584616006e31d1e171e6cdd4163695bc9c4bf0227095998ffa4c",
                    treeDepth: 16,
                    fingerprintDuration: 3600,
                    credentials: null,
                    apiEnabled: false,
                    apiKey: null,
                    createdAt: "2023-08-09T18:09:53.000Z",
                    updatedAt: "2023-08-09T18:09:53.000Z"
                }
                const apiKey = "70f07d0d-6aa2-4fe1-b4b9-06c271a641dc"
                const inviteCode = "C5VAG4HD"
                const inviteCreatedAt = "2023-08-09T18:10:02.000Z"

                requestMocked.mockImplementationOnce(() =>
                    Promise.resolve({
                        code: inviteCode,
                        isRedeemed: true,
                        createdAt: inviteCreatedAt,
                        group
                    })
                )

                const apiSdk: ApiSdk = new ApiSdk(SupportedUrl.DEV)
                const invite = await apiSdk.redeemInvite(
                    inviteCode,
                    groupId,
                    apiKey
                )

                expect(invite.code).toBe(inviteCode)
                expect(invite.isRedeemed).toBe(true)
            })
        })
    })
    describe("Check Parameter", () => {
        describe("Should not throw an error if the parameter has the expected type", () => {
            it("Should not throw an error if the parameter is a string and the function expects a string", () => {
                const url = "http://localhost:3000"
                const fun = () => {
                    checkParameter(url, "url", "string")
                }
                expect(fun).not.toThrow()
            })
        })

        describe("Should throw an error if the parameter does not have the expected type", () => {
            it("Should throw an error if the parameter is a number and the function expects a string", () => {
                const url = 123
                const fun = () => {
                    checkParameter(url, "url", "string")
                }
                expect(fun).toThrow("Parameter 'url' is not a string")
            })
            it("Should throw an error if the parameter is a string and the function expects an object", () => {
                const url = "http://localhost:3000"
                const fun = () => {
                    checkParameter(url, "url", "object")
                }
                expect(fun).toThrow("Parameter 'url' is not an object")
            })
        })
    })
})
