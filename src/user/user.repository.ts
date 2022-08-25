import { User } from '../../types/common';
import { UserModel } from './user.model';
import { Document } from 'mongoose';

const convertDocumentToObject = <T>(document: Document) =>
  document.toObject({ getters: true }) as T;

const createUser = async (userPayload: Omit<User, 'id'>) => {
  const user = await UserModel.create(userPayload);
  return convertDocumentToObject<User>(user);
};

const getUser = async (username: string) => {
  const user = await UserModel.findOne({ username });
  return user;
};
const userRepository = {
  createUser,
  getUser,
};

export default userRepository;
