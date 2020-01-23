const invokeFraction = require('../src');

const tosser = (err = new Error('should not be called')) => () => {
  throw err;
};

describe('invokeFraction', () => {
  it('should invoke the default handler', () => {
    const handler = jest.fn().mockReturnValueOnce('value');
    expect(invokeFraction([], handler)).toBe('value');
    expect(handler.mock.calls).toEqual([[]]);
  });

  it('should invoke the last handler', () => {
    const handler = jest.fn().mockReturnValueOnce('value');
    expect(invokeFraction([[1e-10, handler]])).toBe('value');
    expect(handler.mock.calls).toEqual([[]]);
  });

  it('should prioritize the default handler over the last handler', () => {
    const lastHandler = jest.fn().mockReturnValueOnce('bad');
    const defaultHandler = jest.fn().mockReturnValueOnce('good');
    expect(invokeFraction([[1e-10, lastHandler]], defaultHandler)).toBe('good');
    expect(lastHandler.mock.calls).toEqual([]);
    expect(defaultHandler.mock.calls).toEqual([[]]);
  });

  it('should invoke an enabled handler', () => {
    const disabledHandler = jest.fn().mockImplementation(tosser());
    const enabledHandler = jest
      .fn()
      .mockReturnValueOnce('good1')
      .mockReturnValueOnce('good2')
      .mockReturnValueOnce('good3');
    expect(
      invokeFraction([
        [0, disabledHandler],
        [0, disabledHandler],
        [1, enabledHandler],
        [0, disabledHandler],
      ])
    ).toBe('good1');
    expect(
      invokeFraction([
        [0, disabledHandler],
        [0, disabledHandler],
        [1e-10, enabledHandler],
        [0, disabledHandler],
      ])
    ).toBe('good2');
    expect(
      invokeFraction([
        [0, disabledHandler],
        [0, disabledHandler],
        [1e-10, enabledHandler],
        [0, disabledHandler],
        [1, enabledHandler],
      ])
    ).toBe('good3');

    expect(enabledHandler.mock.calls).toEqual([[], [], []]);
  });
});
