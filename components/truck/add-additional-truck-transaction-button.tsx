import { Modal } from 'flowbite-react';
import axios from 'axios';
import { useState } from 'react';
import TextInput from '../text-input';
import {
  TransactionType,
  AdditionalTruckTransaction,
  BASE_URL,
} from '../../types/common';
import { useRouterRefresh } from '../../hooks/hooks';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { PlusIcon } from '@heroicons/react/solid';
import { useToastContext } from '../../lib/toast-context';

interface AddAdditionalTruckTransactionButtonProps {
  truckId: string;
}

export default function AddAdditionalTruckTransactionButton({
  truckId,
}: AddAdditionalTruckTransactionButtonProps) {
  const addToast = useToastContext();
  const baseTransaction: Omit<AdditionalTruckTransaction, 'id' | 'date'> = {
    details: '',
    cost: 0,
    transactionType: TransactionType.TRUCK_ADDITIONAL_TRANSACTION,
    truckId,
  };
  const refreshData = useRouterRefresh();
  const [transaction, setTransaction] = useState(baseTransaction);
  const [date, setDate] = useState(new Date());
  const [modal, setModal] = useState(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setTransaction((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  async function addTransaction() {
    await axios({
      method: 'POST',
      url: `${BASE_URL}/api/transaction/truck/misc`,
      data: { ...transaction, date },
    })
      .then(() => {
        setTransaction(baseTransaction);
        refreshData();
        setModal(false);
      })
      .catch((err) => {
        addToast(err.response.data.message);
      });
  }

  return (
    <>
      <button
        className="z-10 fixed bottom-5 bg-green-400 hover:bg-green-500 text-white p-2 lg:p-5 transition-all rounded-full"
        onClick={() => setModal(true)}
      >
        <PlusIcon className="h-10" />
      </button>
      <Modal show={modal} onClose={() => setModal(false)} size="3xl">
        <Modal.Header>Transaksi Lainnya</Modal.Header>
        <Modal.Body>
          <form action="post">
            <div className="grid grid-rows-4 grid-cols-5 grid-flow-row gap-4">
              <div className="form-group row-span-1 col-span-3">
                <TextInput
                  label="Deskripsi"
                  name="details"
                  value={transaction.details}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group row-span-5 col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Tanggal
                </label>
                <DatePicker
                  dateFormat="dd/MM/yyyy"
                  selected={date}
                  onChange={(date: Date) => setDate(date)}
                />
              </div>
              <div className="form-group row-span-1 col-span-2">
                <TextInput
                  label="Harga"
                  name="cost"
                  type="currency"
                  value={transaction.cost}
                  prefix="Rp"
                  onChange={handleChange}
                />
              </div>
            </div>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <button
            className="bg-green-400
            hover:bg-green-500 text-white font-bold py-2 px-10 rounded w-full"
            onClick={addTransaction}
          >
            Tambah Transaksi
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
