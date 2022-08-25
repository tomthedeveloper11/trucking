import Head from 'next/head';
import { InferGetServerSidePropsType } from 'next';
import AddTransactionButton from '../components/add-transaction-button';
import transactionBloc from '../lib/transactions';
import { redirectToLogin, Transaction } from '../types/common';
import TransactionDataTable from '../components/transaction-data-table';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as jwt from 'jsonwebtoken';
import { getCookie } from 'cookies-next';
import authorizeUser from '../helpers/auth';

const defaultStartDate = new Date(2020, 1, 1);
const defaultEndDate = new Date(new Date().setHours(23, 59, 59));

export default function TransactionPage({
  transactions,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const user = authorizeUser();

  const transactionDataTableHeaders = {
    No: '',
    Tanggal: 'w-3/12',
    Deskripsi: 'w-4/12',
    Harga: 'w-3/12',
  };

  const formatTransaction = (transaction: Transaction, index: number) => {
    return {
      no: index,
      id: transaction.id,
      date: new Date(transaction.date).toLocaleDateString('id-ID'),
      details: transaction.details,
      cost: transaction.cost,
    };
  };

  const [transactionsState, setTransactionsState] = useState(transactions);

  const [startDate, setStartDate] = useState(
    new Date(new Date().setHours(0, 0, 0))
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().setHours(23, 59, 59))
  );

  useEffect(() => {
    setTransactionsState(transactions);
  }, [transactions]);

  async function filterByMonth() {
    const transactions = await transactionBloc.getTransactions({
      access_token: user.access_token,
      startDate,
      endDate,
    });

    setTransactionsState(transactions);
  }

  return (
    <>
      <Head>
        <title>Truck Details</title>
      </Head>

      <div className="container p-8 mb-60 flex-col">
        <h1 className="text-center text-7xl mb-5">Pengeluaran Lain</h1>
        <div className="flex w-56 gap-5 mx-3 my-5">
          <DatePicker
            dateFormat="dd/MM/yyyy"
            selected={startDate}
            onChange={(date: Date) =>
              setStartDate(new Date(new Date(date).setHours(0, 0, 0)))
            }
          />
          <span className="text-3xl">-</span>
          <DatePicker
            dateFormat="dd/MM/yyyy"
            selected={endDate}
            onChange={(date: Date) =>
              setEndDate(new Date(new Date(date).setHours(23, 59, 59)))
            }
            minDate={startDate}
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={filterByMonth}
          >
            Filter
          </button>
        </div>
        {user?.role !== 'guest' && (
          <div className="flex justify-end mr-5 mb-3">
            <AddTransactionButton />
          </div>
        )}
        <TransactionDataTable
          headers={transactionDataTableHeaders}
          data={transactionsState.map((t, i) => formatTransaction(t, i + 1))}
          hiddenFields={['id', 'isPrinted', 'truckId']}
        />
      </div>
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  const access_token = getCookie('access_token', {
    req: context.req,
    res: context.res,
  });

  if (!access_token) return redirectToLogin;

  try {
    jwt.verify(access_token.toString(), process.env.SECRET_KEY);
  } catch (e) {
    return redirectToLogin;
  }

  const transactions = await transactionBloc.getTransactions({
    access_token,
    startDate: defaultStartDate,
    endDate: defaultEndDate,
  });

  return {
    props: { transactions },
  };
};
