import { Modal} from 'flowbite-react';
import React, { useState } from 'react';
import TextInput from '../text-input';
import { BASE_URL, Transaction } from '../../types/common';
import { useRouterRefresh } from '../../hooks/hooks';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { useToastContext } from '../../lib/toast-context';
import { PencilAltIcon } from '@heroicons/react/solid';

interface EditAdditionalTruckTransactionButtonProps {
  existingTransaction: Transaction;
  disabled?: boolean;
}

export default function EditAdditionalTruckTransactionButton({
  existingTransaction,
  disabled = false,
}: EditAdditionalTruckTransactionButtonProps) {
  const [transaction, setTransaction] = useState(existingTransaction);
  const [modal, setModal] = useState(false);
  const [day, month, year] = transaction.date.toString().split('/');
  const [date, setDate] = useState(
    new Date(Number(year), Number(month) - 1, Number(day))
  );

  const refreshData = useRouterRefresh();
  const addToast = useToastContext();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setTransaction((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  async function editAdditionalTruckTransaction() {
    await axios({
      method: 'PUT',
      url: `${BASE_URL}/api/transaction/truck/misc/${transaction.id}`,
      data: { ...transaction, date },
    });
    refreshData();
  }
  return (
    <>
      <PencilAltIcon
        className={`${
          disabled ? 'text-gray-200' : 'text-yellow-200'
        } cursor-pointer h-7`}
        onClick={() => {
          if (!disabled) {
            setModal(true);
          }
        }}
      />

      <Modal show={modal} onClose={() => setModal(false)} size="3xl">
        <Modal.Header>Edit Transaksi</Modal.Header>
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
            className="bg-[#F5D558] hover:bg-[#E3C652] text-white font-bold py-2 px-10 rounded w-full"
            onClick={() => {
              editAdditionalTruckTransaction()
                .then(() => setModal(false))
                .catch((err) => addToast(err.response.data.message));
            }}
          >
            Edit Transaksi
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
