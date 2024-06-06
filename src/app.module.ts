import { Module } from '@nestjs/common';
import { CharacterModule } from './character/character.module';
import { NodeModule } from './node/node.module';

@Module({
  imports: [CharacterModule, NodeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
