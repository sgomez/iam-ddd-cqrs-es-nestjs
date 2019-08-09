import { ScopeId } from './ScopeId';

describe('ScopeId', () => {
  it('should be an uuid v4', () => {
    const vo = ScopeId.fromString('1061abe8-37e5-4623-8696-a9fd40797f73');

    expect(vo.value()).toBe('1061abe8-37e5-4623-8696-a9fd40797f73');
  });

  it('should not accept invalid uuid', () => {
    expect(() => {
      ScopeId.fromString('invalid');
    }).toThrow();
  });
});
