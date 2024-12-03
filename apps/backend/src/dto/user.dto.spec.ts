import { queryUserList } from './user.dto';

describe('UserDto', () => {
  it('should to be defined', () => expect(queryUserList).toBeDefined());

  it('render correctly', () => expect(queryUserList).toMatchSnapshot());
});
