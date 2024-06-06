import { Module } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CharacterController } from './character.controller';
import { DataBaseService } from 'src/database/prisma.service';
import { UpdateStatsService } from 'src/node/node-char/update.stats.service';
import { NodeService } from 'src/node/node.service';

@Module({
  controllers: [CharacterController],
  providers: [
    CharacterService,
    DataBaseService,
    UpdateStatsService,
    NodeService,
  ],
})
export class CharacterModule {}
