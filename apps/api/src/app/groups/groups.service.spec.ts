import { BadRequestException, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { MongoRepository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupData } from './entities/group.entity';
import { GroupsService } from './groups.service';

const mockRepository = {
  find: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  count: jest.fn(),
  updateOne: jest.fn(),
}

type mockRepository<T> = Partial<Record<keyof MongoRepository<T>, jest.Mock>>;

describe('GroupsService', () => {
  let service: GroupsService;
  let groupRepository: mockRepository<GroupData>;

  const createGroupArgs: CreateGroupDto = {
    name:'Test group',
    description:'This group is for unit test.',
    treeDepth:16
  }
  const TestGroup: GroupData = {
    _id: new ObjectId(),
    index: 0,
    admin: 'testAdmin',
    members: [],
    createdAt: '2022-08-14T11:11:11.111Z',
    tag: 0,
    ...createGroupArgs
  }
  const TestGroupAddedMember: GroupData = {
    _id: new ObjectId(),
    index: 0,
    admin: 'testAdmin',
    members: ['123123'],
    createdAt: '2022-08-14T11:11:11.111Z',
    tag: 0,
    ...createGroupArgs
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupsService, {
        provide: getRepositoryToken(GroupData),
        useValue: mockRepository,
      }],
    }).compile();

    service = module.get<GroupsService>(GroupsService);
    groupRepository = module.get(getRepositoryToken(GroupData));
  });

  it('Should be init', async () => {
    groupRepository.find.mockResolvedValue([TestGroupAddedMember]);

    expect(groupRepository.find).toBeCalledTimes(1);
  })

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('# getAllGroupsData', () => {
    it('Should return an groupData array', async () => {
      groupRepository.find.mockResolvedValue([]);
      const result = await service.getAllGroupsData();

      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('# getGroup', () => {

    it('Should return a groupData', async () => {
      groupRepository.findOneBy.mockResolvedValue(TestGroup);
      const group = await service.getGroupData('Test group');
      expect(group).toBeDefined();
    });

    it('Should throw 404 error about not exist group', async () => {
      try{
        groupRepository.findOneBy.mockResolvedValue(undefined);
        await service.getGroupData('Master group');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('# createGroup', () => {
    it('Should create a group', async () => {
      groupRepository.create.mockResolvedValue(TestGroup);
      groupRepository.save.mockResolvedValue(TestGroup);

      const result = await service.createGroup(createGroupArgs, 'testAdmin');

      expect(result).toMatchObject(TestGroup);
    });

    it('Should be unique with group name', async () => {
      try{
      groupRepository.save.mockRejectedValueOnce(new Error('duplicated group name'));
      await service.createGroup(createGroupArgs, 'testAdmin');
      }catch(e){
        expect(e).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });

  describe('# isGroupMember', () => {
    it('Should return false with empty group', async () => {
      groupRepository.findOneBy.mockResolvedValue(TestGroup);

      const result = await service.isGroupMember('Test group', '123123');
      expect(result).toBeFalsy();
    });

    it('Should return true with group containing member', async () => {
      groupRepository.findOneBy.mockResolvedValue(TestGroupAddedMember);

      const result = await service.isGroupMember('Test group', '123123');
      expect(result).toBeTruthy();
    })
  });

  describe('# addMember',() => {
    beforeEach(async () => {
      groupRepository.create.mockResolvedValueOnce(TestGroup);
      groupRepository.save.mockResolvedValueOnce(TestGroup);

      await service.createGroup(createGroupArgs, 'testAdmin');
    });

    it('Should throw 401 error about not a group admin', async () => {
      groupRepository.findOneBy.mockResolvedValue(TestGroup);
      try{
        await service.addMember('Test group', '123123', 'otherAdmin');
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
      }
    });

    it('Should add a member', async () => {
      groupRepository.findOneBy.mockResolvedValue(TestGroup);
      groupRepository.save.mockResolvedValue(TestGroupAddedMember);
      const result = await service.addMember('Test group', '123123', 'testAdmin');
      expect(result).toBe(TestGroupAddedMember);
    });

    it('Should throw 400 error about exist member', async () => {
      groupRepository.findOneBy.mockResolvedValue(TestGroupAddedMember);
      try{
        await service.addMember('Test group', '123123', 'testAdmin');
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('# generateMerkleProof', () => {
    const TestGroupAddedMember2: GroupData = {
      _id: new ObjectId(),
      index: 0,
      admin: 'test',
      members: ['111111'],
      createdAt: '2022-08-14T11:11:11.111Z',
      tag: 0,
      ...createGroupArgs
    }
    beforeEach(async () => {
      groupRepository.create.mockResolvedValue(TestGroup);
      groupRepository.save.mockResolvedValue(TestGroup);

      await service.createGroup(createGroupArgs, 'testAdmin');
    });

    it('Should return Merkle proof', async () => {
      groupRepository.findOneBy.mockResolvedValue(TestGroup);
      groupRepository.save.mockResolvedValue(TestGroupAddedMember2);
      await service.addMember('Test group', '111111', 'testAdmin');

      groupRepository.findOneBy.mockResolvedValue(TestGroupAddedMember2);
      const merkleproof = await service.generateMerkleProof('Test group', '111111');

      expect(merkleproof).toBeDefined();
    });

    it('Should throw 400 error about not exist member', async () => {
      try{
        groupRepository.findOneBy.mockResolvedValue(TestGroupAddedMember2);
        await service.generateMerkleProof('Test group', '999999');
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('# updateGroup', () => {
    const updateGroupArgs: UpdateGroupDto = {
      description: 'change my group description.'
    }
    beforeEach(async () => {
      groupRepository.create.mockResolvedValue(TestGroup);
      groupRepository.save.mockResolvedValue(TestGroup);

      await service.createGroup(createGroupArgs, 'testAdmin');
    });

    it('Should throw 401 error about not a group admin', async () => {
      groupRepository.findOneBy.mockResolvedValue(TestGroup);
      try{
        await service.updateGroup('Test group', updateGroupArgs, 'otherAdmin');
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
      }
    });

    it('Should update a group', async () => {
      groupRepository.findOneBy.mockResolvedValue(TestGroup);

      await service.updateGroup('Test group', updateGroupArgs, 'testAdmin');

      expect(groupRepository.updateOne).toBeCalledTimes(1);
    });
  });
});
