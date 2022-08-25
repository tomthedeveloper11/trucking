import { Table } from 'flowbite-react';
import EditAdditionalTruckTransactionButton from './truck/edit-additional-truck-transaction-button';
import {
  DataTableAdditionalTransaction,
  TransactionType,
} from '../types/common';
import DeleteVariousTransactionButton from './delete-various-transaction-button';
import { formatRupiah } from '../helpers/hbsHelpers';
import authorizeUser from '../helpers/auth';

interface DataTableProperties {
  headers: Record<string, string>;
  data: DataTableAdditionalTransaction[];
  hiddenFields?: string[];
}

export default function AdditionalTruckTransactionDataTable({
  headers,
  data,
  hiddenFields,
}: DataTableProperties) {
  const user = authorizeUser();

  function buildTransactionRow(obj: DataTableAdditionalTransaction) {
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

  const totalCost = data.reduce((acc, obj) => acc + obj.cost, 0);

  return (
    <>
      <Table hoverable={true}>
        <Table.Head className="text-center whitespace-nowrap">
          {Object.entries(headers).map(([header, columnWidth], index) => (
            <Table.HeadCell key={index} className={`${columnWidth}`}>
              {header}
            </Table.HeadCell>
          ))}
          {user?.role !== 'guest' && <Table.HeadCell>Actions</Table.HeadCell>}
        </Table.Head>
        <Table.Body className="divide-y">
          {data.map((transaction, index) => {
            return (
              <Table.Row key={`tr-${index}`}>
                {buildTransactionRow(transaction)}
                {user?.role !== 'guest' && (
                  <Table.Cell className="flex flex-row">
                    <EditAdditionalTruckTransactionButton
                      key={`edit-modal-key${index}`}
                      existingTransaction={{
                        ...transaction,
                        transactionType:
                          TransactionType.TRUCK_ADDITIONAL_TRANSACTION,
                      }}
                    />
                    <DeleteVariousTransactionButton
                      transactionId={transaction.id}
                    />
                  </Table.Cell>
                )}
              </Table.Row>
            );
          })}
          <Table.Row>
            {new Array(3).fill('').map((_, i) => (
              <Table.Cell key={`c${i}`}></Table.Cell>
            ))}
            {data.length > 0 && (
              <Table.Cell className="text-center font-bold whitespace-nowrap">
                {formatRupiah(totalCost)}
              </Table.Cell>
            )}
          </Table.Row>
        </Table.Body>
      </Table>
    </>
  );
}
