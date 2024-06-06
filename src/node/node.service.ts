import { Injectable } from '@nestjs/common';
import { DataBaseService } from 'src/database/prisma.service';
import { CreateNodeDto } from './dto/create-node.dto';
import { UpdateStatsService } from './node-char/update.stats.service';
import { Character, SkillNode } from '@prisma/client';

@Injectable()
export class NodeService {
  constructor(
    private readonly dataBaseService: DataBaseService,
    private readonly updateCharStats: UpdateStatsService,
  ) {}

  async create(data: CreateNodeDto) {
    try {
      return this.dataBaseService.skillNode.create({
        data,
      });
    } catch (error) {
      return error;
    }
  }

  async list() {
    try {
      return this.dataBaseService.skillNode.findMany();
    } catch (error) {
      return error;
    }
  }

  async findUnique(id: number) {
    try {
      return this.dataBaseService.skillNode.findUnique({
        where: { id },
      });
    } catch (error) {
      return error;
    }
  }

  async deleteNode(id: number) {
    try {
      const nodeToDelete = await this.dataBaseService.skillNode.findUnique({
        where: { id },
      });
      if (!nodeToDelete) {
        return 'Node not found';
      }

      // Update stats and remove node from characters' skill trees
      await this.updateCharStats.updateStatsOnNodeDelete(nodeToDelete);

      for (const node of nodeToDelete.connected_to) {
        const currentNode = await this.dataBaseService.skillNode.findUnique({
          where: { id: node },
        });

        if (currentNode) {
          const updatedConnectedTo = currentNode.connected_to.filter(
            (nodeId) => nodeId !== id,
          );

          await this.dataBaseService.skillNode.update({
            where: { id: node },
            data: {
              connected_to: updatedConnectedTo,
              number_of_connections: updatedConnectedTo.length,
            },
          });
        }
      }

      await this.dataBaseService.skillNode.delete({
        where: { id },
      });
    } catch (error) {
      return error;
    }
  }

  async connectNodes(nodeId_1: number, nodeId_2: number) {
    try {
      console.log(nodeId_1, nodeId_2);
      const node1 = await this.dataBaseService.skillNode.findUnique({
        where: { id: nodeId_1 },
      });
      const node2 = await this.dataBaseService.skillNode.findUnique({
        where: { id: nodeId_2 },
      });

      console.log(node1, node2);
      if (!node1 || !node2) {
        return 'Node not found';
      }

      if (
        node1.connected_to.includes(nodeId_2) ||
        node2.connected_to.includes(nodeId_1)
      ) {
        return 'Nodes already connected';
      }

      node1.connected_to.push(nodeId_2);
      node2.connected_to.push(nodeId_1);

      // update the nodes and the number of connections
      await this.dataBaseService.skillNode.update({
        where: { id: nodeId_1 },
        data: {
          connected_to: node1.connected_to,
          number_of_connections: node1.connected_to.length,
        },
      });

      await this.dataBaseService.skillNode.update({
        where: { id: nodeId_2 },
        data: {
          connected_to: node2.connected_to,
          number_of_connections: node2.connected_to.length,
        },
      });
    } catch (error) {
      return error;
    }
  }

  async removeConnection(nodeId_1: number, nodeId_2: number) {
    try {
      const node1 = await this.dataBaseService.skillNode.findUnique({
        where: { id: nodeId_1 },
      });
      const node2 = await this.dataBaseService.skillNode.findUnique({
        where: { id: nodeId_2 },
      });

      if (!node1 || !node2) {
        return 'Node not found';
      }

      if (
        !node1.connected_to.includes(nodeId_2) ||
        !node2.connected_to.includes(nodeId_1)
      ) {
        return 'Nodes not connected';
      }

      const updatedConnectedTo1 = node1.connected_to.filter(
        (nodeId) => nodeId !== nodeId_2,
      );
      const updatedConnectedTo2 = node2.connected_to.filter(
        (nodeId) => nodeId !== nodeId_1,
      );

      await this.dataBaseService.skillNode.update({
        where: { id: nodeId_1 },
        data: {
          connected_to: updatedConnectedTo1,
          number_of_connections: updatedConnectedTo1.length,
        },
      });

      await this.dataBaseService.skillNode.update({
        where: { id: nodeId_2 },
        data: {
          connected_to: updatedConnectedTo2,
          number_of_connections: updatedConnectedTo2.length,
        },
      });
    } catch (error) {
      return error;
    }
  }

  async checkIfCharacterCanLearnNode(character: Character, node: SkillNode) {
    try {
      if (character.skill_tree.includes(node.id.toString())) {
        throw new Error('Character already knows this node');
      }

      // If character has no nodes yet, only allow nodes 1, 2, and 3
      if (character.skill_tree.length === 0) {
        if (![1, 2, 3].includes(node.id)) {
          throw new Error(
            'Character can only learn nodes 1, 2, or 3 as the first node',
          );
        } else {
          return true;
        }
      }

      const connectedNodes = await this.dataBaseService.skillNode.findMany({
        where: {
          id: {
            in: node.connected_to,
          },
        },
      });

      const connectedNodesIds = connectedNodes.map((node) => node.id);

      // If any of the connected nodes are known by the character, allow learning the node
      if (
        !connectedNodesIds.some((nodeId) =>
          character.skill_tree.includes(nodeId.toString()),
        )
      ) {
        throw new Error('Character does not know any of the connected nodes');
      }

      return true;
    } catch (error) {
      throw error;
    }
  }
  async updateNodeValues(nodeId: number, data: CreateNodeDto) {
    try {
      // need to update the new value to all characters that are connected to this node
      const node = await this.dataBaseService.skillNode.findUnique({
        where: { id: nodeId },
      });
      if (!node) {
        return 'Node not found';
      }

      // update the stats
      this.updateCharStats.updateStatsOnNodeUpdate(node, data.effect_on_char);

      return this.dataBaseService.skillNode.update({
        where: { id: nodeId },
        data,
      });
    } catch (error) {
      return error;
    }
  }
}
