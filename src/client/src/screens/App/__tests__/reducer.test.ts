import { rootReducer } from '../reducer';

describe('rootReducer', () => {
  test('ensure it is a function', () => {
    expect(rootReducer).toEqual(expect.any(Function));
  });
});
