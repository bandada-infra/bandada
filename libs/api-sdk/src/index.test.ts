import { request } from "@bandada/utils"
import ApiSdk from "./apiSdk"
import { GroupResponse, InviteResponse, SupportedUrl } from "./types"

jest.mock("@bandada/utils", () => ({
    __esModule: true,
    request: jest.fn()
}))

const requestMocked = request as jest.MockedFunction<typeof request>

describe("Bandada API SDK", () => {
    let apiSdk: ApiSdk
    describe("ApiSdk constructor", () => {
        it("Should create new ApiSdk instance without url and config", () => {
            const config = {
                headers: {
                    "Content-Type": "application/json"
                },
                baseURL: SupportedUrl.PROD
            }
            apiSdk = new ApiSdk()
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
            apiSdk = new ApiSdk(url)
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
            apiSdk = new ApiSdk(SupportedUrl.PROD, config)
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
            const fun = () => {
                apiSdk = new ApiSdk(SupportedUrl.DEV, config)
            }
            expect(fun).toThrow("The url and baseURL should be the same")
        })
        it("Should add the baseURL to config", () => {
            const config = {
                headers: {
                    "Content-Type": "text/html"
                }
            }
            apiSdk = new ApiSdk(SupportedUrl.DEV, config)
            expect(apiSdk.url).toBe(SupportedUrl.DEV)
        })
    })
    describe("Groups", () => {
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
                apiSdk = new ApiSdk(SupportedUrl.DEV)
                const groups: GroupResponse[] = await apiSdk.getGroups()
                expect(groups).toHaveLength(1)
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

                apiSdk = new ApiSdk(SupportedUrl.DEV)
                const group: GroupResponse = await apiSdk.getGroup(groupId)
                expect(group.id).toBe(groupId)
            })
        })
        describe("#isGroupMember", () => {
            it("Should return true because the member is part of the group", async () => {
                requestMocked.mockImplementationOnce(() =>
                    Promise.resolve(true)
                )

                const groupId = "10402173435763029700781503965100"
                const memberId = "1"

                apiSdk = new ApiSdk(SupportedUrl.DEV)
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

                apiSdk = new ApiSdk(SupportedUrl.DEV)
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

                apiSdk = new ApiSdk(SupportedUrl.DEV)
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

                apiSdk = new ApiSdk(SupportedUrl.DEV)
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

                apiSdk = new ApiSdk(SupportedUrl.DEV)
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

                apiSdk = new ApiSdk(SupportedUrl.DEV)
                const res = await apiSdk.addMembersByApiKey(
                    groupId,
                    memberIds,
                    apiKey
                )
                expect(res).toBeUndefined()
            })
            describe("#removeMemberByApiKey", () => {
                it("Should remove a member from a group using an API Key", async () => {
                    requestMocked.mockImplementationOnce(() =>
                        Promise.resolve()
                    )

                    const groupId = "10402173435763029700781503965100"
                    const memberId = "1"
                    const apiKey = "70f07d0d-6aa2-4fe1-b4b9-06c271a641dc"

                    apiSdk = new ApiSdk(SupportedUrl.DEV)
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
                    requestMocked.mockImplementationOnce(() =>
                        Promise.resolve()
                    )

                    const groupId = "10402173435763029700781503965100"
                    const memberIds = ["1", "2", "3"]
                    const apiKey = "70f07d0d-6aa2-4fe1-b4b9-06c271a641dc"

                    apiSdk = new ApiSdk(SupportedUrl.DEV)
                    const res = await apiSdk.removeMembersByApiKey(
                        groupId,
                        memberIds,
                        apiKey
                    )
                    expect(res).toBeUndefined()
                })
            })
        })
    })
    describe("Invites", () => {
        describe("# getInvite", () => {
            it("Should return an invite", async () => {
                requestMocked.mockImplementationOnce(() =>
                    Promise.resolve({
                        code: "C5VAG4HD",
                        isRedeemed: false,
                        createdAt: "2023-08-09T18:10:02.000Z",
                        group: {
                            id: "95633257675970239314311768035433",
                            name: "Group 1",
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
                        },
                        groupName: "Group 1",
                        groupId: "95633257675970239314311768035433"
                    })
                )

                const inviteCode = "C5VAG4HD"

                apiSdk = new ApiSdk(SupportedUrl.DEV)
                const invite: InviteResponse = await apiSdk.getInvite(
                    inviteCode
                )
                expect(invite.code).toBe(inviteCode)
            })
        })
    })
})
