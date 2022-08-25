import mongoose, { Schema } from 'mongoose';
import { Customer } from '../../types/common';

const customerSchema = new Schema<Customer>(
  {
    initial: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
    },
    address: {
      type: String,
    },
  },
  { versionKey: false }
);

export const CustomerModel =
  mongoose.models.customer ||
  mongoose.model<Customer>('customer', customerSchema);
