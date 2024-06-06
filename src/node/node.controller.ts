import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { NodeService } from './node.service';
import { CreateNodeDto } from './dto/create-node.dto';

@Controller('node')
export class NodeController {
  constructor(private readonly nodeService: NodeService) {}

  @Post('create')
  async create(@Body() body: CreateNodeDto) {
    try {
      return this.nodeService.create(body);
    } catch (error) {
      return error;
    }
  }

  @Delete('delete/:id')
  async deleteNode(@Param('id') id: string) {
    try {
      return this.nodeService.deleteNode(Number(id));
    } catch (error) {
      return error;
    }
  }

  @Patch('connect/:node1/:node2')
  async connectNodes(
    @Param('node1') node1: string,
    @Param('node2') node2: string,
  ) {
    try {
      console.log(node1, node2);
      return this.nodeService.connectNodes(Number(node1), Number(node2));
    } catch (error) {
      return error;
    }
  }

  @Patch('disconnect/:node1/:node2')
  async disconnectNodes(
    @Param('node1') node1: string,
    @Param('node2') node2: string,
  ) {
    try {
      return this.nodeService.removeConnection(Number(node1), Number(node2));
    } catch (error) {
      return error;
    }
  }

  @Patch('update/:id')
  async updateNode(@Body() data: CreateNodeDto, @Param('id') id: string) {
    try {
      console.log(data, id);
      return this.nodeService.updateNodeValues(Number(id), data);
    } catch (error) {
      return error;
    }
  }

  @Get('list')
  async list() {
    try {
      return this.nodeService.list();
    } catch (error) {
      return error;
    }
  }

  @Get('findUnique/:id')
  async findUnique(@Param('id') id: string) {
    try {
      return this.nodeService.findUnique(Number(id));
    } catch (error) {
      return error;
    }
  }
}
