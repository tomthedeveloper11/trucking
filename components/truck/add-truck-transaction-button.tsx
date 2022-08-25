import { Modal, ListGroup } from 'flowbite-react';
import axios from 'axios';
import { useState } from 'react';
import TextInput from '../text-input';
import {
  BASE_URL,
  TransactionType,
  TruckTransaction,
} from '../../types/common';
import { useRouterRefresh } from '../../hooks/hooks';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { PlusIcon } from '@heroicons/react/solid';
import { useToastContext } from '../../lib/toast-context';
import authorizeUser from '../../helpers/auth';

interface AddTruckTransactionButtonProps {
  truckId: string;
  autoCompleteData: Record<string, string[]>;
}

export default function AddTruckTransactionButton({
  truckId,
  autoCompleteData,
}: AddTruckTransactionButtonProps) {
  const user = authorizeUser();

  const addToast = useToastContext();
  const baseTruckTransaction: Omit<TruckTransaction, 'id' | 'date'> = {
    containerNo: '',
    invoiceNo: '',
    destination: '',
    cost: 0,
    sellingPrice: 0,
    customer: '',
    details: '',
    bon: '',
    transactionType: TransactionType.TRUCK_TRANSACTION,
    truckId,
    isPrintedBon: false,
    isPrintedInvoice: false,
  };
  const refreshData = useRouterRefresh();
  const [truckTransaction, setTruckTransaction] =
    useState(baseTruckTransaction);
  const [date, setDate] = useState(new Date());
  const [modal, setModal] = useState(false);
  const [recommendation, setRecommendation] = useState({
    destination: [],
    customer: [],
  });

  function filterKeywords(field: string, keyword: string) {
    const matchRegex = new RegExp(keyword, 'i');
    const matchedKeywords = autoCompleteData[field].filter((d) =>
      matchRegex.test(d)
    );
    return matchedKeywords;
  }

  function handleAutoComplete(
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) {
    const recommendations = filterKeywords(field, event.target.value);
    setRecommendation((prevState) => ({
      ...prevState,
      [field]: recommendations,
    }));
    setTruckTransaction((p) => ({
      ...p,
      [field]: event.target.value,
    }));
  }

  function selectAutocomplete(field: string, value: string) {
    setTruckTransaction((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    setRecommendation((p) => ({
      ...p,
      [field]: [],
    }));
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setTruckTransaction((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  async function addTruckTransaction() {
    await axios({
      method: 'POST',
      url: `${BASE_URL}/api/transaction/truck`,
      data: { ...truckTransaction, date },
    })
      .then(() => {
        setTruckTransaction(baseTruckTransaction);
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
        <PlusIcon className="h-10 " />
      </button>
      <Modal show={modal} onClose={() => setModal(false)} size="5xl">
        <Modal.Header>Transaksi Trip</Modal.Header>
        <Modal.Body>
          <form action="post">
            <div className="grid grid-rows-2 grid-cols-7 grid-flow-row gap-4">
              <div className="form-group row-span-1 col-span-2">
                <TextInput
                  label="No. Container"
                  name="containerNo"
                  value={truckTransaction.containerNo}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group row-span-1 col-span-2">
                <TextInput
                  label="No. Bon"
                  name="invoiceNo"
                  value={truckTransaction.invoiceNo}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group row-span-1 col-span-1">
                <div className="relative w-full">
                  <TextInput
                    label="EMKL"
                    name="customer"
                    value={truckTransaction.customer}
                    onChange={(e) => handleAutoComplete(e, 'customer')}
                  />
                  {/* autoComplete customer */}
                  <div
                    className={`absolute left-0 w-full ${
                      recommendation.customer.length ? '' : 'hidden'
                    }`}
                    style={{ zIndex: 2 }}
                  >
                    <ListGroup>
                      {recommendation.customer.map((customer, i) => {
                        return (
                          <ListGroup.Item
                            key={`customer-auto-${i}`}
                            onClick={() =>
                              selectAutocomplete('customer', customer)
                            }
                          >
                            <div>{customer}</div>
                          </ListGroup.Item>
                        );
                      })}
                    </ListGroup>
                  </div>
                  {/* autoComplete customer */}
                </div>
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
              <div className="form-group row-span-1 col-span-3">
                <div className="relative w-full">
                  <TextInput
                    label="Tujuan"
                    name="destination"
                    value={truckTransaction.destination}
                    onChange={(e) => handleAutoComplete(e, 'destination')}
                  />
                  {/* autoComplete destination */}
                  <div
                    className={`absolute left-0 w-full ${
                      recommendation.destination.length ? '' : 'hidden'
                    }`}
                    style={{ zIndex: 2 }}
                  >
                    <ListGroup>
                      {recommendation.destination.map((destination, i) => {
                        return (
                          <ListGroup.Item
                            key={`destination-auto-${i}`}
                            onClick={() =>
                              selectAutocomplete('destination', destination)
                            }
                          >
                            <div>{destination}</div>
                          </ListGroup.Item>
                        );
                      })}
                    </ListGroup>
                  </div>
                  {/* autoComplete destination */}
                </div>
              </div>
              <div className="form-group row-span-1 col-span-1">
                <TextInput
                  label="Borongan"
                  name="cost"
                  type="currency"
                  value={truckTransaction.cost}
                  prefix="Rp"
                  onChange={handleChange}
                />
              </div>
              {user?.role === 'admin' && (
                <div className="form-group row-span-1 col-span-1">
                  <TextInput
                    label="Pembayaran"
                    name="sellingPrice"
                    type="currency"
                    value={truckTransaction.sellingPrice}
                    prefix="Rp"
                    onChange={handleChange}
                  />
                </div>
              )}

              <div className="form-group row-span-1 col-span-5">
                <TextInput
                  label="Bon"
                  name="bon"
                  value={truckTransaction.bon}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group row-span-1 col-span-5">
                <TextInput
                  label="Deskripsi/Info Tambahan"
                  name="details"
                  value={truckTransaction.details}
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
            onClick={addTruckTransaction}
          >
            Tambah Transaksi
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
