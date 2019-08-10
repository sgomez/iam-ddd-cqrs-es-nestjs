import { ScopeAlias } from './ScopeAlias';

describe('ScopeAlias', () => {
  it('should be a string', () => {
    expect(ScopeAlias.fromString('my-name').value()).toBe('my-name');
  });

  describe.each([['my-name'], ['my-name-0'], ['my0name'], ['myname']])(
    'The alias "%s"',
    alias => {
      it('should be a valid string', () => {
        expect(ScopeAlias.fromString(alias).value()).toBe(alias);
      });
    },
  );

  describe.each([['my name'], ['0myname'], ['-myname'], ['MyName']])(
    'The alias "%s"',
    alias => {
      it('should be invalid', () => {
        expect(() => {
          ScopeAlias.fromString(alias);
        }).toThrow();
      });
    },
  );
});
