import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CreateCharacterDto } from './dto/create-character.dto';

@Controller('character')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Post('create')
  async create(@Body() createCharacterDto: CreateCharacterDto) {
    try {
      return this.characterService.create(createCharacterDto);
    } catch (error) {
      return error;
    }
  }

  @Get('list')
  async list() {
    try {
      return this.characterService.list();
    } catch (error) {
      return error;
    }
  }

  @Get('findUnique/:id')
  async findUnique(@Param('id') id: string) {
    try {
      return this.characterService.findUnique(id);
    } catch (error) {
      return error;
    }
  }

  @Patch('addNode/:characterId/:nodeId')
  async addNewNodeToSkillTree(
    @Param('characterId') characterId: string,
    @Param('nodeId') nodeId: string,
  ) {
    try {
      return this.characterService.addNodeToSkillTree(characterId, nodeId);
    } catch (error) {
      return error;
    }
  }

  @Patch('removeNode/:characterId/:nodeId')
  async removeNodeFromSkillTree(
    @Param('characterId') characterId: string,
    @Param('nodeId') nodeId: string,
  ) {
    try {
      return this.characterService.removeNodeFromSkillTree(characterId, nodeId);
    } catch (error) {
      return error;
    }
  }
}
