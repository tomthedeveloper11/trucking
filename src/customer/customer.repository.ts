import { Customer } from '../../types/common';
import { CustomerModel } from './customer.model';
import { Document } from 'mongoose';

const convertDocumentToObject = <T>(document: Document) =>
  document.toObject({ getters: true }) as T;

const createCustomer = async (customerPayload: Omit<Customer, 'id'>) => {
  const customer = await CustomerModel.create(customerPayload);
  return convertDocumentToObject<Customer>(customer);
};

const getCustomers = async () => {
  const customers = await CustomerModel.find({});
  return customers.map((customer) =>
    convertDocumentToObject<Customer>(customer)
  );
};

const getCustomerByInitial = async (initial: string) => {
  const customer = await CustomerModel.findOne({ initial });
  if (customer) {
    return convertDocumentToObject<Customer>(customer);
  }
  return null;
};

const getCustomerByCustomerId = async (customerId: string) => {
  const customer = await CustomerModel.findOne({ _id: customerId });
  if (customer) {
    return convertDocumentToObject<Customer>(customer);
  }
  return null;
};

const customerRepository = {
  createCustomer,
  getCustomers,
  getCustomerByInitial,
  getCustomerByCustomerId,
};

export default customerRepository;
