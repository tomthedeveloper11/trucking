import axios from 'axios';
import { BASE_URL, Customer } from '../types/common';

const getCustomers = async () => {
  const response = await axios({
    method: 'GET',
    url: `${BASE_URL}/api/customer`,
  });
  if (response && response.data) {
    return response.data.data as Customer[];
  }
  return [];
};

const getCustomerByCustomerId = async (customerId: string) => {
  const response = await axios({
    method: 'GET',
    url: `${BASE_URL}/api/customer/${customerId}`,
  });
  if (response && response.data) {
    return response.data.data as Customer;
  }
  return {} as Customer;
};

const customerBloc = { getCustomers, getCustomerByCustomerId };

export default customerBloc;
