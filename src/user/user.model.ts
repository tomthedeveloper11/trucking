import mongoose, { Schema } from 'mongoose';
import { User } from '../../types/common';

const userSchema = new Schema<User>(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    role: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
    },
  },
  { versionKey: false }
);

export const UserModel =
  mongoose.models.user || mongoose.model<User>('user', userSchema);
