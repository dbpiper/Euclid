import isObjectConstant from 'util/test/isObjectConstant';
import TimeWindow from '../TimeWindow';

test('ensure it is constant', () => {
  expect(isObjectConstant(TimeWindow)).toBe(true);
});
