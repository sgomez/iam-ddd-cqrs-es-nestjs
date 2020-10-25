import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RenameScopeDto {
  @IsString()
  @ApiProperty()
  readonly name!: string;
}
