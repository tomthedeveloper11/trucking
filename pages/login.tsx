import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { BASE_URL, User } from '../types/common';
import { setCookie } from 'cookies-next';

export default function Login() {
  const router = useRouter();
  const [user, setUser] = useState({
    username: '',
    password: '',
  } as Omit<User, 'id' | 'role'>);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  async function loginFunction() {
    window.event?.preventDefault();
    const response = await axios({
      method: 'POST',
      url: `${BASE_URL}/api/login`,
      data: user,
    });
    setCookie('access_token', response.data.access_token);
    router.push('/home');
  }

  return (
    <div className="absolute left-[30vw] top-[28vh]">
      <form
        className="flex-col w-[40vw] text-center"
        action="post"
        onSubmit={loginFunction}
      >
        <div>
          <h1 className="text-2xl font-bold">Login to your account</h1>
        </div>
        <div className="my-3">
          <label className="block text-md mb-2">Username</label>
          <input
            className="px-4 w-full border-2 py-2 rounded-md text-sm outline-none"
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
            className="px-4 w-full border-2 py-2 rounded-md text-sm outline-none"
            type="password"
            name="password"
            placeholder="Password"
            value={user.password}
            onChange={handleChange}
          />
        </div>

        <div className="">
          <button
            className="mt-4 mb-3 w-full bg-green-500 hover:bg-green-400 text-white py-2 rounded-md transition duration-100"
            type="submit"
          >
            Log in
          </button>
        </div>
      </form>
    </div>
  );
}
