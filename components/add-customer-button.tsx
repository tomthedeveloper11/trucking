import { Modal } from 'flowbite-react';
import axios from 'axios';
import { useState } from 'react';
import TextInput from './text-input';
import { BASE_URL, Customer } from '../types/common';
import { useRouterRefresh } from '../hooks/hooks';

export default function AddCustomerButton() {
  const [newCustomer, setNewCustomer] = useState({
    initial: '',
    name: '',
    address: '',
  } as Omit<Customer, 'id'>);
  const [modal, setModal] = useState(false);
  const refreshData = useRouterRefresh();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setNewCustomer((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  async function addCustomer() {
    await axios({
      method: 'POST',
      url: `${BASE_URL}/api/customer`,
      data: newCustomer,
    });
    setNewCustomer({
      initial: '',
      name: '',
      address: '',
    });
    refreshData();
  }

  return (
    <>
      <button
        className="bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-10 rounded"
        onClick={() => setModal(true)}
      >
        Tambah Customer
      </button>
      <Modal show={modal} onClose={() => setModal(false)}>
        <Modal.Header>Tambah Customer Baru</Modal.Header>
        <Modal.Body>
          <form action="post">
            <div className="grid grid-rows-2 grid-cols-3 grid-flow-row gap-4">
              <div className="form-group row-span-1 col-span-3">
                <TextInput
                  label="Initial"
                  name="initial"
                  value={newCustomer.initial}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group row-span-1 col-span-3">
                <TextInput
                  label="Nama"
                  name="name"
                  value={newCustomer.name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group row-span-1 col-span-3">
                <TextInput
                  label="Alamat"
                  name="address"
                  value={newCustomer.address}
                  onChange={handleChange}
                />
              </div>
            </div>
          </form>{' '}
        </Modal.Body>
        <Modal.Footer>
          <button
            className="bg-green-400
            hover:bg-green-500 text-white font-bold py-2 px-10 rounded w-full"
            onClick={() => {
              addCustomer();
              setModal(false);
            }}
          >
            Tambah Customer
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
