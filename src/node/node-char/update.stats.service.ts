import { Injectable } from '@nestjs/common';
import { SkillNode } from '@prisma/client';
import { DataBaseService } from 'src/database/prisma.service';
import { UpgradeStat } from '../dto/create-node.dto';

@Injectable()
export class UpdateStatsService {
  constructor(private readonly dataBaseService: DataBaseService) {}

  async updateStatsOnNodeDelete(node: SkillNode) {
    try {
      const characters = await this.dataBaseService.character.findMany();
      const stats: UpgradeStat[] = this.deStringifyStats(node.effect_on_char);

      // If the character has the node, remove it
      for (const character of characters) {
        if (character.skill_tree.includes(node.id.toString())) {
          // Update the stats
          for (const stat of stats) {
            await this.updateStats(stat.type, stat.value * -1, character.id);
          }

          // Remove the node from the character's skill tree
          const updatedSkillTree = character.skill_tree.filter(
            (nodeId) => nodeId !== node.id.toString(),
          );
          await this.dataBaseService.character.update({
            where: { id: character.id },
            data: {
              skill_tree: updatedSkillTree,
            },
          });
        }
      }
    } catch (error) {
      return error;
    }
  }
  async updateStats(stat: string, value: number, characterId: string) {
    try {
      const character = await this.dataBaseService.character.findUnique({
        where: { id: characterId },
      });
      switch (stat) {
        case 'DEF':
          const upgradedDefense = character.defense + value;
          await this.dataBaseService.character.update({
            where: { id: characterId },
            data: {
              defense: upgradedDefense,
            },
          });
          break;
        case 'STR':
          const upgradedStrength = character.strength + value;
          console.log(upgradedStrength);
          await this.dataBaseService.character.update({
            where: { id: characterId },
            data: {
              strength: upgradedStrength,
            },
          });
          break;
        case 'MANA':
          const upgradedMana = character.mana + value;
          await this.dataBaseService.character.update({
            where: { id: characterId },
            data: {
              mana: upgradedMana,
            },
          });
          break;
        default:
          throw new Error('Stat not found');
      }
    } catch (error) {
      return error;
    }
  }

  deStringifyStats(stats: string[]): UpgradeStat[] {
    try {
      return stats.map((stat) => {
        const [type, value] = stat.split('#');
        return { type, value: parseInt(value) };
      });
    } catch (error) {
      return error;
    }
  }

  async updateStatsOnNodeAdd(node: SkillNode, characterId: string) {
    try {
      const stats: UpgradeStat[] = this.deStringifyStats(node.effect_on_char);

      // If the character has the node, remove it
      stats.forEach(async (stat) => {
        await this.updateStats(stat.type, stat.value, characterId);
      });
    } catch (error) {
      return error;
    }
  }

  async updateStatsOnNodeUpdate(node: SkillNode, editedStats: string[]) {
    try {
      const oldStats: UpgradeStat[] = this.deStringifyStats(
        node.effect_on_char,
      );
      const newStats: UpgradeStat[] = this.deStringifyStats(editedStats);

      // If the character has the node, remove the old stats and add the new ones
      const characters = await this.dataBaseService.character.findMany();
      for (const character of characters) {
        if (character.skill_tree.includes(node.id.toString())) {
          // Remove the old stats
          for (const stat of oldStats) {
            await this.updateStats(stat.type, stat.value * -1, character.id);
          }

          // Add the new stats
          for (const stat of newStats) {
            await this.updateStats(stat.type, stat.value, character.id);
          }
        }
      }
    } catch (error) {
      return error;
    }
  }
}
