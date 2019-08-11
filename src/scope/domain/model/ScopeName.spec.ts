import { ScopeName } from './ScopeName';

describe('ScopeName', () => {
  it('should be a string', () => {
    expect(ScopeName.fromString('My name').value).toBe('My name');
  });

  it('should not be empty', () => {
    expect(() => {
      ScopeName.fromString('');
    }).toThrow();
  });
});
