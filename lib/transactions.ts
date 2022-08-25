import { BASE_URL, TransactionSummaryQuery } from './../types/common';
import axios from 'axios';
import { Transaction } from '../types/common';

const getTransactions = async ({
  startDate,
  endDate,
}: TransactionSummaryQuery) => {
  const response = await axios({
    method: 'GET',
    url: `${BASE_URL}/api/transaction`,
    params: {
      startDate,
      endDate,
    },
  });
  if (response && response.data) {
    return response.data.data as Transaction[];
  }
  return [];
};

const transactionBloc = {
  getTransactions,
};

export default transactionBloc;
