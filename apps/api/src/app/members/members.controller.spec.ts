import { NotAcceptableException, NotFoundException } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"
import { MembersController } from "./members.controller"
import { MembersService } from "./members.service"

describe("MembersController", () => {
    let controller: MembersController

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MembersController],
            providers: [MembersService]
        }).compile()

        controller = module.get<MembersController>(MembersController)
    })

    it("should be defined", () => {
        expect(controller).toBeDefined()
    })

    describe("getAllMembers", () => {
        it("should return an array", () => {
            const result = controller.getAllMembers("testGroup")

            expect(result).toBeInstanceOf(Array)
        })
    })

    describe("getMemberByIndex", () => {
        it("should return member", () => {
            controller.addMember("testGroup", {
                identityCommitment: "testIdc"
            })
            const member = controller.getMemberByIndex(1)
            expect(member).toBeDefined()
        })

        it("should throw 404 error", () => {
            try {
                controller.getMemberByIndex(999)
            } catch (e) {
                expect(e).toBeInstanceOf(NotFoundException)
            }
        })
    })

    describe("addMember", () => {
        it("should add a memeber", () => {
            const beforeAdd = controller.getAllMembers("testGroup").length
            controller.addMember("testGroup", {
                identityCommitment: "testIdc"
            })
            const afterAdd = controller.getAllMembers("testGroup").length
            expect(afterAdd).toBeGreaterThan(beforeAdd)
        })

        it("should throw 406 error", () => {
            try {
                controller.addMember("testGroup", {
                    identityCommitment: "testIdc"
                })
                controller.addMember("testGroup", {
                    identityCommitment: "testIdc"
                })
            } catch (e) {
                expect(e).toBeInstanceOf(NotAcceptableException)
                expect(e.message).toEqual("Member with IdentityCommitment:testIdc already exist")
            }
        })
    })
})
