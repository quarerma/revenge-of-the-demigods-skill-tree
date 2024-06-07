import { Injectable } from '@nestjs/common';
import { CreateCharacterDto } from './dto/create-character.dto';
import { DataBaseService } from 'src/database/prisma.service';
import { UpdateStatsService } from 'src/node/node-char/update.stats.service';
import { NodeService } from 'src/node/node.service';
import { Character, SkillNode } from '@prisma/client';

@Injectable()
export class CharacterService {
  constructor(
    private readonly dataBaseService: DataBaseService,
    private readonly updateStats: UpdateStatsService,
    private readonly nodeService: NodeService,
  ) {}
  async create(createCharacterDto: CreateCharacterDto) {
    try {
      return this.dataBaseService.character.create({
        data: createCharacterDto,
      });
    } catch (error) {
      return error;
    }
  }

  async list() {
    try {
      return this.dataBaseService.character.findMany();
    } catch (error) {
      return error;
    }
  }

  async findUnique(id: string) {
    try {
      return this.dataBaseService.character.findUnique({
        where: { id },
      });
    } catch (error) {
      return error;
    }
  }

  async addNodeToSkillTree(characterId: string, nodeId: string) {
    try {
      const character: Character =
        await this.dataBaseService.character.findUnique({
          where: { id: characterId },
        });
      if (!character) {
        return 'Character not found';
      }

      const node: SkillNode = await this.dataBaseService.skillNode.findUnique({
        where: { id: parseInt(nodeId) },
      });
      if (!node) {
        return 'Node not found';
      }

      if (character.skill_tree.includes(nodeId)) {
        return 'Node already in skill tree';
      }

      // Check if can learn the node
      try {
        await this.nodeService.checkIfCharacterCanLearnNode(character, node);
      } catch (error) {
        return error.message;
      }

      // Update the stats
      this.updateStats.updateStatsOnNodeAdd(node, character.id);

      const updatedSkillTree = character.skill_tree;
      updatedSkillTree.push(nodeId);

      return this.dataBaseService.character.update({
        where: { id: characterId },
        data: {
          skill_tree: updatedSkillTree,
        },
      });
    } catch (error) {
      return error;
    }
  }

  async removeNodeFromSkillTree(characterId: string, nodeId: string) {
    try {
      const character = await this.dataBaseService.character.findUnique({
        where: { id: characterId },
      });
      if (!character) {
        return 'Character not found';
      }

      const node: SkillNode = await this.dataBaseService.skillNode.findUnique({
        where: { id: parseInt(nodeId) },
      });
      if (!node) {
        return 'Node not found';
      }

      if (!character.skill_tree.includes(nodeId)) {
        return 'Node not in skill tree';
      }

      const updatedSkillTree = character.skill_tree.filter(
        (id) => id !== nodeId,
      );
      const nodesEffescts = this.updateStats.deStringifyStats(
        node.effect_on_char,
      );

      for (const stat of nodesEffescts) {
        await this.updateStats.updateStats(
          stat.type,
          stat.value * -1,
          character.id,
        );
      }

      return this.dataBaseService.character.update({
        where: { id: characterId },
        data: {
          skill_tree: updatedSkillTree,
        },
      });
    } catch (error) {
      return error;
    }
  }
}
