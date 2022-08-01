import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { GroupsService } from './groups.service';

describe('GroupsService', () => {
  let service: GroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupsService],
    }).compile();

    service = module.get<GroupsService>(GroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('# getAllGroupsData', () => {
    it('should return an array', () => {
      const result = service.getAllGroupsData();
      expect(result).toBeInstanceOf(Array);
    });

  });

  describe('# getGroup', () => {
    it('should return a groupData', () => {
      service.createGroup({
        name: 'Test group',
        description: 'This is a group for testing',
        treeDepth: 16,
      });
      const group = service.getGroupData('Test group');
      expect(group).toBeDefined();
    });

    it('should throw 404 error', () => {
      try{
        service.getGroupData('Master group');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('# createGroup', () => {
    it('should create a group', () => {
      const beforeCreate = service.getAllGroupsData().length;
      service.createGroup({
        name: 'Test group',
        description: 'This is a group for testing',
        treeDepth: 16,
      });
      const afterCreate = service.getAllGroupsData().length;
      expect(afterCreate).toBeGreaterThan(beforeCreate);
    })
  });

  describe('# isGroupMember', () => {
    it('Should return false with empty group', () => {
      service.createGroup({
        name: 'Test group',
        description: 'This is a group for testing',
        treeDepth: 16,
      });
      const result = service.isGroupMember('Test group', '123123');
      expect(result).toBeFalsy();
    });
  });

  describe('# addMember', () => {
    beforeEach(()=>{
      service.createGroup({
        name: 'Test group',
        description: 'This is a group for testing',
        treeDepth: 16,
      });
    })
    it('Should add a member', () => {
      service.addMember('Test group','123123');
      const members = service.getGroupData('Test group').members;
      expect(members.length).toBeGreaterThan(0);
    });

    it('Should throw 400 error', () => {
      service.addMember('Test group','123123');
      try{
        service.addMember('Test group','123123');
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
      }
    })
  });
  describe('generateMerkleProof', () => {
    beforeEach(()=>{
      service.createGroup({
        name: 'Test group',
        description: 'This is a group for testing',
        treeDepth: 16,
      });
      service.addMember('Test group', '123123');
    })
    it('Should return Merkle proof', () => {
      const merkleproof = service.generateMerkleProof('Test group', '123123');
      expect(merkleproof).toBeDefined();
    })

    it('Should throw 400 error', () => {
      try{
        service.generateMerkleProof('Test group', '999999');
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
      }
    })
  });
  describe('updateGroup', () => {
    it("Should update a group", () => {
      service.createGroup({
        name: 'Test group',
        description: 'This is a group for testing',
        treeDepth: 16,
      });
      service.updateGroup('Test group', {description: 'Change the group description'})
      const group = service.getGroupData('Test group');
      expect(group.description).toEqual('Change the group description');
    });
  });
});
