import { User } from '../../types/common';
import userRepository from './user.repository';

import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const register = async (userPayload: Omit<User, 'id'>) => {
  const user = await userRepository.getUser(userPayload.username);

  if (user) throw new Error('Username sudah terpakai');

  userPayload.password = bcrypt.hashSync(userPayload.password, 10);
  const newUser = await userRepository.createUser(userPayload);

  return newUser;
};

const login = async (userPayload: Omit<User, 'id'>) => {
  const user = await userRepository.getUser(userPayload.username);

  if (!user) throw new Error('User tidak terdaftar');

  const correctPassword = bcrypt.compareSync(
    userPayload.password,
    user.password
  );

  if (!correctPassword) throw new Error('Username atau Password Salah');

  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
  };

  const access_token = jwt.sign(payload, process.env.SECRET_KEY);

  return access_token;
};

const getUser = async (username: string) => {
  const user = await userRepository.getUser(username);
  return user;
};

const userService = {
  register,
  login,
  getUser,
};

export default userService;
