import { ApiProperty } from '@nestjs/swagger';

export class ScopeDto {
  @ApiProperty()
  readonly _id: string;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly alias: string;
}
