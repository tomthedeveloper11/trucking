import axios from 'axios';
import React, { useState } from 'react';
import { BASE_URL, User } from '../types/common';

export default function Register() {
  const [user, setUser] = useState({
    username: '',
    password: '',
    role: '',
  } as Omit<User, 'id'>);

  function handleChange(
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) {
    const { name, value } = event.target;

    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  async function registerFunction() {
    window.event?.preventDefault();
    const response = await axios({
      method: 'POST',
      url: `${BASE_URL}/api/register`,
      data: user,
    });
    setUser({ username: '', password: '', role: 'user' });
  }

  return (
    <div className="flex text-center m-auto">
      <form
        className="xl:mt-[22vh] mt-[11vh]"
        action="post"
        onSubmit={registerFunction}
      >
        <div>
          <h1 className="text-2xl font-bold">Tambah Pengguna Baru</h1>
        </div>
        <div className="my-3">
          <label className="block text-md mb-2">Username</label>
          <input
            className="block appearance-none w-full border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-6"
            type="username"
            name="username"
            placeholder="Username"
            value={user.username}
            onChange={handleChange}
          />
        </div>
        <div className="mt-5">
          <label className="block text-md mb-2">Password</label>
          <input
            className="block appearance-none w-full border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-6"
            type="password"
            name="password"
            placeholder="Password"
            value={user.password}
            onChange={handleChange}
          />
        </div>
        <div className="mt-5">
          <label className="block text-md mb-2">Role</label>
          <select
            className="w-full border box-border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-6"
            name="role"
            value={user.role}
            onChange={handleChange}
          >
            <option value="" selected disabled>
              Pilih role pengguna baru
            </option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="guest">Guest</option>
          </select>
        </div>

        <div className="">
          <button
            className="mt-4 mb-3 w-full bg-green-400 hover:bg-green-500 text-white py-2 rounded transition duration-100"
            type="submit"
          >
            Tambah
          </button>
        </div>
      </form>
    </div>
  );
}
