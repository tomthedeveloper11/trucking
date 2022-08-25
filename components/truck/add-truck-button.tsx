import { Modal } from 'flowbite-react';
import axios from 'axios';
import { useState } from 'react';
import TextInput from '../text-input';
import { BASE_URL, Truck } from '../../types/common';
import { useRouterRefresh } from '../../hooks/hooks';

export default function AddTruckButton() {
  const [newTruck, setNewTruck] = useState({
    name: '',
    licenseNumber: '',
  } as Omit<Truck, 'id'>);
  const [modal, setModal] = useState(false);
  const refreshData = useRouterRefresh();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setNewTruck((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  async function addTruck() {
    await axios({
      method: 'POST',
      url: `${BASE_URL}/api/truck`,
      data: newTruck,
    });
    setNewTruck({ name: '', licenseNumber: '' });
    refreshData();
  }

  return (
    <>
      <button
        className="bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-10 rounded"
        onClick={() => setModal(true)}
      >
        Tambah Truk
      </button>
      <Modal show={modal} onClose={() => setModal(false)}>
        <Modal.Header>Tambah Truk Baru</Modal.Header>
        <Modal.Body>
          <form action="post">
            <div className="grid grid-rows-2 grid-cols-3 grid-flow-row gap-4">
              <div className="form-group row-span-1 col-span-3">
                <TextInput
                  label="Nama"
                  name="name"
                  value={newTruck.name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group row-span-1 col-span-3">
                <TextInput
                  label="NoPol"
                  name="licenseNumber"
                  value={newTruck.licenseNumber}
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
              addTruck();
              setModal(false);
            }}
          >
            Tambah Truk
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
