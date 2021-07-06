export class CreateScopeDto {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly alias: string,
  ) {}
}
