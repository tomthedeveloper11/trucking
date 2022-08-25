import { Table } from 'flowbite-react';
import TextInput from './text-input';
import EditTruckTransactionButton from './truck/edit-truck-transaction-button';
import {
  DataTableTruckTransaction,
  TransactionType,
  UITruckTransaction,
} from '../types/common';
import React, { useEffect, useState } from 'react';
import { PrinterIcon } from '@heroicons/react/solid';
import truckTransactionBloc from '../lib/truckTransaction';
import DeleteVariousTransactionButton from './delete-various-transaction-button';
import { useToastContext } from '../lib/toast-context';
import authorizeUser from '../helpers/auth';
import { useRouterRefresh } from '../hooks/hooks';
import { formatRupiah } from '../helpers/hbsHelpers';

interface DataTableProperties {
  headers: Record<string, string>;
  data: DataTableTruckTransaction[];
  hiddenFields?: string[];
  autoCompleteData: Record<string, string[]>;
  emkl?: boolean;
  endDate: Date;
}

function buildTransactionRow(
  obj: DataTableTruckTransaction,
  hiddenFields?: string[]
) {
  const tableTransaction: Record<string, string | number | Date | boolean> = {
    ...obj,
  };

  if (hiddenFields) {
    for (const field of hiddenFields) {
      delete tableTransaction[field];
    }
  }

  return (
    <>
      {Object.entries(tableTransaction).map(([key, val], i) => {
        let rowValue = val.toString();
        if (['sellingPrice', 'cost'].includes(key)) {
          rowValue = val.toLocaleString().replace(/,/g, '.');
        }
        return (
          <Table.Cell className="px-0 text-center" key={`td-${obj.id}-${i}`}>
            {rowValue}
          </Table.Cell>
        );
      })}
    </>
  );
}

function prepareTruckTransactions(
  dataTableTruckTransaction: DataTableTruckTransaction[]
): UITruckTransaction[] {
  return dataTableTruckTransaction.map((t: DataTableTruckTransaction) => {
    return {
      ...t,
      transactionType: TransactionType.TRUCK_TRANSACTION,
      selected: false,
    };
  });
}

export default function TruckTransactionDataTable({
  headers,
  data,
  hiddenFields,
  autoCompleteData,
  emkl = false,
  endDate,
}: DataTableProperties) {
  const user = authorizeUser();
  const refreshData = useRouterRefresh();
  const addToast = useToastContext();
  const [truckTransactions, setTruckTransactions] = useState(
    prepareTruckTransactions(data)
  );
  const [invoiceNum, setInvoiceNum] = useState('');

  useEffect(() => {
    setTruckTransactions(prepareTruckTransactions(data));
  }, [data]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;

    setInvoiceNum(value);
  }

  async function print(type: string) {
    const markedTransactions = truckTransactions
      .filter((t) => t.selected)
      .map((t) => t.id);
      
    const customerInitial = truckTransactions.filter((t) => t.selected)[0].customer

    if (markedTransactions.length < 1) {
      addToast('Mohon pilih transaksi');
      return;
    }

    if (type === 'tagihan' && !invoiceNum) {
      addToast('Mohon isi no invoice');
      return;
    }

    addToast('Loading...');

    const response = await truckTransactionBloc.printTransactions(
      invoiceNum,
      customerInitial,
      markedTransactions,
      type,
      endDate
    );

    if (response === 'Print Success') {
      addToast('Print Sukses');
    } else {
      addToast('Mohon coba kembali');
    }
    truckTransactions.forEach((trax) => {
      trax.selected = false;
    });
    setTruckTransactions([...truckTransactions]);
    refreshData();
  }

  const totalCost = data.reduce((acc, obj) => acc + obj.cost, 0);
  const totalSell = data.reduce((acc, obj) => acc + obj.sellingPrice, 0);


  return (
    <>
      {emkl && user.role !== 'user' && (
        <div className="flex justify-end gap-5 my-2">
          <TextInput
            name="invoiceNum"
            placeholder="No Invoice"
            value={invoiceNum}
            onChange={handleChange}
          />
          <button
            className={`flex my-1 border border-gray-300 rounded shadow-sm px-2 text-gray-600 hover:bg-white`}
            onClick={() => print('tagihan')}
          >
            <PrinterIcon className="h-5 mt-1" />
            <p className={`text-lg font-bold`}>Tagihan</p>
          </button>
          <button
            className={`flex my-1 border border-gray-300 rounded shadow-sm px-2 text-gray-600 hover:bg-white`}
            onClick={() => print('bon')}
          >
            <PrinterIcon className="h-5 mt-1" />
            <p className={`text-lg font-bold`}>Bon</p>
          </button>
        </div>
      )}

      <Table>
        <Table.Head className="whitespace-nowrap">
          {emkl && user.role !== 'user' && (
            <Table.HeadCell className="text-center">Print</Table.HeadCell>
          )}
          {emkl && <Table.HeadCell className="text-center">No</Table.HeadCell>}

          {Object.entries(headers).map(([header, columnWidth], index) => (
            <Table.HeadCell
              key={index}
              className={`${columnWidth} px-3 text-center`}
            >
              {header}
            </Table.HeadCell>
          ))}
          {user?.role !== 'guest' && <Table.HeadCell>Actions</Table.HeadCell>}
        </Table.Head>
        <Table.Body className="divide-y">
          {data.map((truckTransaction, index) => {
            return (
              <Table.Row
                key={`tr-${index}`}
                className={`${
                  truckTransactions[index]?.selected &&
                  'bg-green-100 hover:bg-green-200'
                } hover:bg-gray-100`}
                onClick={
                  emkl
                    ? () => {
                        truckTransactions[index].selected =
                          !truckTransactions[index].selected;
                        setTruckTransactions([...truckTransactions]);
                      }
                    : undefined
                }
              >
                {emkl && user.role !== 'user' && (
                  <Table.Cell>
                    <div className="flex gap-3">
                      <input
                        className="mt-5 rounded checked:bg-green-400 checked:border-green-400 focus:ring-green-500"
                        {...(truckTransactions[index].selected && {
                          checked: true,
                        })}
                        type="checkbox"
                      ></input>
                      <div>
                        <div
                          className={`my-1 border border-gray-300 rounded px-2 ${
                            truckTransaction.isPrintedBon
                              ? 'bg-green-400 text-gray-100'
                              : 'text-gray-600'
                          }`}
                        >
                          <p className={`text-center font-bold`}>Bon</p>
                        </div>

                        <div
                          className={`my-1 border border-gray-300 rounded px-2 ${
                            truckTransaction.isPrintedInvoice
                              ? 'bg-green-400 text-gray-100'
                              : 'text-gray-600'
                          }`}
                        >
                          <p className={`text-center font-bold`}>Tagihan</p>
                        </div>
                      </div>
                    </div>
                  </Table.Cell>
                )}
                {buildTransactionRow(truckTransaction, hiddenFields)}
                {truckTransactions[index] && user?.role !== 'guest' && (
                  <Table.Cell>
                    <div className="flex flex-row">
                      <EditTruckTransactionButton
                        key={`edit-modal-key${index}`}
                        existingTruckTransaction={truckTransactions[index]}
                        autoCompleteData={autoCompleteData}
                        disabled={truckTransactions[index]?.selected}
                      />
                      <DeleteVariousTransactionButton
                        transactionId={truckTransaction.id}
                        disabled={truckTransactions[index]?.selected}
                      />
                    </div>
                  </Table.Cell>
                )}
              </Table.Row>
            );
          })}
          <Table.Row>
            {new Array(emkl ? 6 : 5).fill('').map((_, i) => (
              <Table.Cell key={`c${i}`}></Table.Cell>
            ))}

            {data.length > 0 && (
              <>
                <Table.Cell className="text-center font-bold whitespace-nowrap">
                  {formatRupiah(totalCost)}
                </Table.Cell>
                {totalSell !== 0 && (
                  <Table.Cell className="text-center font-bold whitespace-nowrap">
                    {formatRupiah(totalSell)}
                  </Table.Cell>
                )}
              </>
            )}
          </Table.Row>
        </Table.Body>
      </Table>
    </>
  );
}
