import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RenameScopeDto {
  @ApiProperty({ required: false })
  readonly _id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
