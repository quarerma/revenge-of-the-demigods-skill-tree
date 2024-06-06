import { Module } from '@nestjs/common';
import { NodeService } from './node.service';
import { NodeController } from './node.controller';
import { DataBaseService } from 'src/database/prisma.service';
import { UpdateStatsService } from './node-char/update.stats.service';

@Module({
  controllers: [NodeController],
  providers: [NodeService, DataBaseService, UpdateStatsService],
})
export class NodeModule {}
