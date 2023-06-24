import bcrypt from 'bcrypt';
import { User } from '../user/user.entity';

const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const comparePassword = async (
  user: User,
  password: string,
): Promise<boolean> => {
  return await bcrypt.compare(user.password, password);
};

export { hashPassword, comparePassword };
