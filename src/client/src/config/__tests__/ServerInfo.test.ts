import isObjectConstant from 'util/test/isObjectConstant';
import ServerInfo from '../ServerInfo-secret';

test('ensure it is constant', () => {
  expect(isObjectConstant(ServerInfo)).toBe(true);
});
