import Head from 'next/head';
import { InferGetServerSidePropsType } from 'next';
import AddTruckTransactionButton from '../../components/truck/add-truck-transaction-button';
import AddAdditionalTruckTransactionButton from '../../components/truck/add-additional-truck-transaction-button';
import truckTransactionBloc from '../../lib/truckTransaction';
import {
  DataTableTruckTransaction,
  DataTableAdditionalTransaction,
  TruckTransaction,
  AdditionalTruckTransaction,
  redirectToLogin,
} from '../../types/common';
import TruckTransactionDataTable from '../../components/truck-transaction-data-table';
import AdditionalTruckTransactionDataTable from '../../components/additional-truck-transaction-data-table';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as jwt from 'jsonwebtoken';
import { getCookie } from 'cookies-next';
import authorizeUser from '../../helpers/auth';

const defaultStartDate = new Date(2020, 1, 1);
const defaultEndDate = new Date(new Date().setHours(23, 59, 59));

export default function TruckDetails({
  truckName,
  truckId,
  truckTransactions,
  miscTruckTransactions,
  autoCompleteData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const user = authorizeUser();

  const [truckTransactionsState, setTruckTransactionsState] =
    useState(truckTransactions);
  const [miscTruckTransactionsState, setMiscTruckTransactionsState] = useState(
    miscTruckTransactions
  );

  useEffect(() => {
    setTruckTransactionsState(truckTransactions);
    setMiscTruckTransactionsState(miscTruckTransactions);
  }, [truckTransactions, miscTruckTransactions]);

  const truckDataTableHeaders = {
    No: '',
    Tanggal: 'w-1/12',
    'No. Container': 'w-2/12',
    'No. Bon': 'w-1/12',
    Tujuan: 'w-2/12',
    Borongan: 'w-1/12',
    Pembayaran: 'w-1/12',
    EMKL: 'w-1/12',
    bon: 'w-1/12',
    'Info Tambahan': 'w-2/12',
  };

  if (user?.role === 'user') {
    delete truckDataTableHeaders.Pembayaran;
  }

  const miscDataTableHeaders = {
    No: '',
    Tanggal: 'w-3/12',
    Deskripsi: 'w-4/12',
    Harga: 'w-3/12',
  };

  const formatTruckTransaction = (
    truckTransaction: TruckTransaction,
    index: number
  ): DataTableTruckTransaction => {
    return {
      no: index,
      id: truckTransaction.id,
      date: new Date(truckTransaction.date).toLocaleDateString('id-ID'),
      containerNo: truckTransaction.containerNo,
      invoiceNo: truckTransaction.invoiceNo,
      destination: truckTransaction.destination,
      cost: truckTransaction.cost,
      sellingPrice: truckTransaction.sellingPrice,
      customer: truckTransaction.customer,
      bon: truckTransaction.bon,
      details: truckTransaction.details,
      truckId: truckTransaction.truckId,
      isPrintedBon: truckTransaction.isPrintedBon,
      isPrintedInvoice: truckTransaction.isPrintedInvoice,
    };
  };

  const formatMiscTransaction = (
    transaction: AdditionalTruckTransaction,
    index: number
  ): DataTableAdditionalTransaction => {
    return {
      no: index,
      id: transaction.id,
      date: new Date(transaction.date).toLocaleDateString('id-ID'),
      details: transaction.details,
      cost: transaction.cost,
      truckId: transaction.truckId,
    };
  };

  const [table, setTable] = useState('trip');
  const [startDate, setStartDate] = useState(
    new Date(new Date().setHours(0, 0, 0))
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().setHours(23, 59, 59))
  );

  async function filterByMonth() {
    const truckTransactions =
      await truckTransactionBloc.getTruckTransactionsByTruckId(
        user.access_token,
        truckId,
        startDate,
        endDate
      );

    const miscTruckTransactions =
      await truckTransactionBloc.getAdditionalTruckTransactionsByTruckId(
        user.access_token,
        truckId,
        startDate,
        endDate
      );

    setTruckTransactionsState(truckTransactions);
    setMiscTruckTransactionsState(miscTruckTransactions);
  }
  return (
    <>
      <Head>
        <title>Truck Details</title>
      </Head>

      <div className="container p-8 mb-60 flex-col">
        <h1 className="text-center text-7xl mb-5">{truckName}</h1>
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
        <div className="grid grid-cols-2">
          <button
            className={`mr-3 hover:bg-blue-500 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded ${
              table === 'trip'
                ? 'bg-blue-500 text-white'
                : 'bg-transparent text-blue-700'
            }`}
            onClick={() => setTable('trip')}
          >
            Transaksi Trip
          </button>
          <button
            className={`mr-3 hover:bg-blue-500 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded ${
              table === 'misc'
                ? 'bg-blue-500 text-white'
                : 'bg-transparent text-blue-700'
            }`}
            onClick={() => setTable('misc')}
          >
            Transaksi Lainnya
          </button>
        </div>
        {table === 'trip' && user?.role !== 'guest' && (
          <div className="flex justify-end mr-5 mb-3">
            <AddTruckTransactionButton
              truckId={truckId}
              autoCompleteData={autoCompleteData}
            />
          </div>
        )}{' '}
        {table === 'misc' && user?.role !== 'guest' && (
          <div className="flex justify-end mr-5 mb-3">
            <AddAdditionalTruckTransactionButton truckId={truckId} />
          </div>
        )}
        {table === 'trip' ? (
          <TruckTransactionDataTable
            headers={truckDataTableHeaders}
            data={truckTransactionsState.map((t, i) =>
              formatTruckTransaction(t, i + 1)
            )}
            hiddenFields={[
              'id',
              'isPrinted',
              'truckId',
              'isPrintedBon',
              'isPrintedInvoice',
              user?.role === 'user' ? 'sellingPrice' : '',
            ]}
            autoCompleteData={autoCompleteData}
          />
        ) : (
          <AdditionalTruckTransactionDataTable
            headers={miscDataTableHeaders}
            data={miscTruckTransactionsState.map((t, i) =>
              formatMiscTransaction(t, i + 1)
            )}
            hiddenFields={['id', 'isPrinted', 'truckId']}
          />
        )}
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

  const truckId: string = context.params.id;
  const truckName: string = context.query.truckName;

  const truckTransactions =
    await truckTransactionBloc.getTruckTransactionsByTruckId(
      access_token,
      truckId,
      defaultStartDate,
      defaultEndDate
    );
  const miscTruckTransactions =
    await truckTransactionBloc.getAdditionalTruckTransactionsByTruckId(
      access_token,
      truckId,
      defaultStartDate,
      defaultEndDate
    );
  const autoCompleteData =
    await truckTransactionBloc.getTruckTransactionAutoComplete();
    
  return {
    props: {
      truckName,
      truckId,
      truckTransactions,
      miscTruckTransactions,
      autoCompleteData,
    },
  };
};
