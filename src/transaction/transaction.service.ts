import { CustomerIdQuery, TruckIdQuery, DateQuery } from './../../types/common';
import {
  TruckTransaction,
  TruckTransactionPayload,
  FilterTransactionsQuery,
  AdditionalTruckTransaction,
  TransactionSummaryQuery,
  TransactionSummary,
  TotalSummary,
  Transaction,
  TransactionType,
} from '../../types/common';
import transactionRepository from './transaction.repository';
import truckRepository from '../truck/truck.repository';

import {
  formatRupiah,
  formatDate,
  indexPlusOne,
} from '../../helpers/hbsHelpers';
import fs from 'fs';
import handlers from 'handlebars';
import path from 'path';
import customerService from '../customer/customer.service';
import htmlToPdf from 'html-pdf';
import moment from 'moment';

const templateDirectory = path.resolve(process.cwd(), 'templates');

const validateAndModifyPayload = async (
  truckTransactionPayload: Omit<TruckTransaction, 'id'>
) => {
  const customer = await customerService.getCustomerByInitial(
    truckTransactionPayload.customer
  );
  if (!customer) {
    throw new Error('Customer tidak terdaftar');
  }
  const modifiedPayload: TruckTransactionPayload = {
    ...truckTransactionPayload,
    customer: {
      customerId: customer.id,
      initial: customer.initial,
    },
  };
  return modifiedPayload;
};

const createTruckTransaction = async (
  truckTransactionPayload: Omit<TruckTransaction, 'id'>
) => {
  const modifiedPayload = await validateAndModifyPayload(
    truckTransactionPayload
  );
  const newTruckTransaction =
    await transactionRepository.createTruckTransaction(modifiedPayload);
  return newTruckTransaction;
};

const createAdditionalTruckTransaction = async (
  transactionPayload: AdditionalTruckTransaction
) => {
  const newTransaction =
    await transactionRepository.createAdditionalTruckTransaction(
      transactionPayload
    );
  return newTransaction;
};

const getTransactions = async (date: TransactionSummaryQuery) => {
  const transactions = await transactionRepository.getTransactions(date);
  return transactions;
};

const createTransaction = async (transactionPayload: Transaction) => {
  const newTransaction = await transactionRepository.createTransaction(
    transactionPayload
  );
  return newTransaction;
};

const editTransaction = async (transactionPayload: Transaction) => {
  const newTransaction = await transactionRepository.editTransaction(
    transactionPayload
  );
  return newTransaction;
};

const deleteTransaction = async (transactionId: string) => {
  const transaction = await transactionRepository.deleteTransaction(
    transactionId
  );
  return transaction;
};

const getTruckTransactions = async () => {
  const transactions = await transactionRepository.getTruckTransactions();
  return transactions;
};
const getGroupedTruckTransactions = async (date: TransactionSummaryQuery) => {
  const transactions = await transactionRepository.getAllTransactions(date);
  const trucks = await truckRepository.getTrucks();

  const summary: TransactionSummary = {};
  for (const transaction of transactions) {
    const truckName = trucks.find((t) => t.id === transaction.truckId)?.name;
    if (!truckName) {
      continue;
    }

    if (!summary[truckName]) {
      summary[truckName] = {
        truckId: transaction.truckId,
        cost: 0,
        additionalCost: 0,
        sellingPrice: transaction.sellingPrice,
        margin: transaction.sellingPrice - transaction.cost,
      };
      if (transaction.transactionType == 'TRUCK_TRANSACTION') {
        summary[truckName].cost = transaction.cost;
      } else {
        summary[truckName].additionalCost = transaction.cost;
      }
    } else {
      summary[truckName] = {
        truckId: transaction.truckId,
        cost:
          transaction.transactionType == 'TRUCK_TRANSACTION'
            ? summary[truckName].cost + transaction.cost
            : summary[truckName].cost,
        additionalCost:
          transaction.transactionType == 'TRUCK_ADDITIONAL_TRANSACTION'
            ? summary[truckName].additionalCost + transaction.cost
            : summary[truckName].additionalCost,
        sellingPrice:
          summary[truckName].sellingPrice +
          (transaction.sellingPrice ? transaction.sellingPrice : 0),
        margin:
          summary[truckName].margin +
          (transaction.sellingPrice
            ? transaction.sellingPrice - transaction.cost
            : 0 - transaction.cost),
      };
    }
  }

  return summary;
};

const getTotalSummary = async (date: TransactionSummaryQuery) => {
  const transactions = await transactionRepository.getAllTransactions(date);

  const summary: TotalSummary = {
    totalAdditionalCost: 0,
    totalTripCost: 0,
    totalTripSellingPrice: 0,
    totalMargin: 0,
  };

  for (const transaction of transactions) {
    if (
      transaction.transactionType === TransactionType.TRUCK_TRANSACTION ||
      transaction.transactionType ===
        TransactionType.TRUCK_ADDITIONAL_TRANSACTION
    ) {
      summary.totalTripCost += transaction.cost;
    }

    if (
      transaction.transactionType === TransactionType.ADDITIONAL_TRANSACTION
    ) {
      summary.totalAdditionalCost += transaction.cost;
    }

    summary.totalTripSellingPrice += transaction.sellingPrice
      ? transaction.sellingPrice
      : 0;

    summary.totalMargin += transaction.sellingPrice
      ? transaction.sellingPrice - transaction.cost
      : 0 - transaction.cost;
  }

  return summary;
};

const getTruckTransactionsByCustomerId = async ({
  customerId,
  startDate,
  endDate,
}: CustomerIdQuery) => {
  const transactions =
    await transactionRepository.getTruckTransactionsByCustomerId(
      customerId,
      startDate,
      endDate
    );
  return transactions;
};

const getTruckTransactionsByTruckId = async ({
  truckId,
  startDate,
  endDate,
}: TruckIdQuery) => {
  const transactions =
    await transactionRepository.getTruckTransactionsByTruckId(
      truckId,
      startDate,
      endDate
    );
  return transactions;
};

const getAdditionalTruckTransactionsByTruckId = async ({
  truckId,
  startDate,
  endDate,
}: TruckIdQuery) => {
  const transactions =
    await transactionRepository.getAdditionalTruckTransactionsByTruckId(
      truckId,
      startDate,
      endDate
    );
  return transactions;
};

const editTruckTransaction = async (
  editTruckTransactionPayload: TruckTransaction
) => {
  const modifiedPayload = await validateAndModifyPayload(
    editTruckTransactionPayload
  );

  const editTruckTransaction = await transactionRepository.editTruckTransaction(
    { ...modifiedPayload, id: editTruckTransactionPayload.id }
  );
  return editTruckTransaction;
};

const editAdditionalTruckTransaction = async (
  editAdditionalTruckTransactionPayload: AdditionalTruckTransaction
) => {
  const editAdditionalTruckTransaction =
    await transactionRepository.editAdditionalTruckTransaction({
      ...editAdditionalTruckTransactionPayload,
      id: editAdditionalTruckTransactionPayload.id,
    });
  return editAdditionalTruckTransaction;
};

const getTruckTransactionAutoComplete = async () => {
  const truckTransactionAutoComplete =
    await transactionRepository.getTruckTransactionAutoComplete();

  return truckTransactionAutoComplete;
};

const printTransaction = async (
  invoiceNum: string,
  transactionIds: string[],
  type: string,
  endDate: Date
) => {
  handlers.registerHelper('formatRupiah', formatRupiah);
  handlers.registerHelper('formatDate', formatDate);
  handlers.registerHelper('indexPlusOne', indexPlusOne);

  const truckTransactions = await transactionRepository.printTransaction(
    transactionIds
  );

  let sortedTruckTransactions = truckTransactions.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  sortedTruckTransactions = sortedTruckTransactions.map((t) => {
    return { ...t, date: moment(t.date).utcOffset(7, false).toDate() };
  });

  const totalSellingPrice = sortedTruckTransactions.reduce(
    (accumulator, obj) => accumulator + obj.sellingPrice,
    0
  );

  const trucks = await truckRepository.getTrucks();
  const customer = await customerService.getCustomerByInitial(
    sortedTruckTransactions[0].customer
  );

  for (const truckTransaction of sortedTruckTransactions) {
    const licenseNumber = trucks.find(
      (t) => t.id === truckTransaction.truckId
    )?.licenseNumber;

    truckTransaction.licenseNumber = licenseNumber;
  }

  const content = {
    main: {
      endDate,
      invoiceNum,
      currentDate: new Date(),
      customerInitial: sortedTruckTransactions[0].customer,
      customerName: customer?.name,
      totalSellingPrice,
    },
    transactions: sortedTruckTransactions,
  };
  let file;
  if (type === 'bon') {
    file = fs.readFileSync(path.join(templateDirectory, 'bon.html'), 'utf8');
  } else {
    file = fs.readFileSync(
      path.join(templateDirectory, 'tagihan.html'),
      'utf8'
    );
  }

  const template = handlers.compile(`${file}`);
  const html = template(content);

  const pdf = htmlToPdf.create(html, {
    format: 'A4',
    // phantomPath: '/usr/local/bin/phantomjs',
  });

  return pdf;
};

const printSummary = async ({ startDate, endDate }: DateQuery) => {
  handlers.registerHelper('formatRupiah', formatRupiah);
  handlers.registerHelper('formatDate', formatDate);

  const summary = await getGroupedTruckTransactions({ startDate, endDate });
  const transactions = await transactionRepository.getTransactions({
    startDate,
    endDate,
  });

  const totalSellingPrice = Object.values(summary).reduce(
    (acc, obj) => acc + obj.sellingPrice,
    0
  );
  const totalTruckCost = Object.values(summary).reduce(
    (acc, obj) => acc + obj.cost,
    0
  );
  const totalAdditionalCost = Object.values(summary).reduce(
    (acc, obj) => acc + obj.additionalCost,
    0
  );
  const transactionsTotal = transactions.reduce(
    (acc, obj) => acc + obj.cost,
    0
  );
  const totalCost = totalAdditionalCost + transactionsTotal;
  const totalMargin = totalSellingPrice - totalCost - totalTruckCost;

  const content = {
    startDate: new Date(startDate).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    endDate: new Date(endDate).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    summary,
    transactions,
    totalSellingPrice,
    totalTruckCost,
    totalCost,
    totalMargin,
  };

  const file = fs.readFileSync(
    path.join(templateDirectory, 'laporan.html'),
    'utf8'
  );
  const template = handlers.compile(`${file}`);
  const html = template(content);

  return htmlToPdf.create(html, {
    format: 'A4',
    // phantomPath: '/usr/local/bin/phantomjs',
  });
};

const filterTruckTransactions = async (query: FilterTransactionsQuery) => {
  // TODO
  transactionRepository.filterTruckTransactions(query);
};

const updatePrintStatus = async (transactionIds: string[], type: string) => {
  transactionRepository.updatePrintStatus(transactionIds, type);
};

const transactionService = {
  createTruckTransaction,
  createAdditionalTruckTransaction,
  getTruckTransactions,
  deleteTransaction,
  getGroupedTruckTransactions,
  getTotalSummary,
  getTruckTransactionsByCustomerId,
  getTruckTransactionsByTruckId,
  getAdditionalTruckTransactionsByTruckId,
  editTruckTransaction,
  editAdditionalTruckTransaction,
  getTruckTransactionAutoComplete,
  printTransaction,
  filterTruckTransactions,
  getTransactions,
  createTransaction,
  editTransaction,
  printSummary,
  updatePrintStatus,
};

export default transactionService;
