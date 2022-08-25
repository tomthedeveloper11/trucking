import {
  HomeIcon,
  TruckIcon,
  ClipboardIcon,
  ViewGridIcon,
  UserAddIcon,
} from '@heroicons/react/solid';
import { LogoutIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { deleteCookie } from 'cookies-next';
import authorizeUser from '../helpers/auth';

export default function SidebarComponent() {
  const user = authorizeUser();

  const router = useRouter();

  function logOut() {
    deleteCookie('access_token');
    router.push('/login');
  }

  return (
    <div className="scrollbar fixed w-[17vw] max-w-[155px] overflow-y-scroll top-0 bottom-0 left-0 py-10 bg-gray-50 rounded scroll">
      <ul className="mb-5 border-b border-gray-200">
        <li>
          <a className="flex items-center p-2 mt-5 text-base font-normal text-gray-900 rounded-lg transition duration-75 hover:bg-gray-100 group">
            <h6 className="font-bold">Current User: </h6>
            <span className="ml-3">{user.username}</span>
          </a>
        </li>
      </ul>
      <ul className="space-y-7">
        <Link href="/home">
          <li
            className={
              router.pathname == '/home' ? 'sidebarActiveLink' : 'sidebarLink'
            }
          >
            <span className="flex">
              <HomeIcon
                className={
                  router.pathname == '/home'
                    ? 'sidebarActiveIcon'
                    : 'sidebarIcon'
                }
              />
              <span
                className={
                  router.pathname == '/home'
                    ? 'sidebarActiveText'
                    : 'sidebarText'
                }
              >
                Home
              </span>
            </span>
          </li>
        </Link>
        <Link href="/trucks">
          <li
            className={
              router.pathname == '/trucks' ? 'sidebarActiveLink' : 'sidebarLink'
            }
          >
            <span className="flex">
              <TruckIcon
                className={
                  router.pathname == '/trucks'
                    ? 'sidebarActiveIcon'
                    : 'sidebarIcon'
                }
              />
              <span
                className={
                  router.pathname == '/trucks'
                    ? 'sidebarActiveText'
                    : 'sidebarText'
                }
              >
                Semua Truk
              </span>
            </span>
          </li>
        </Link>
        <Link href="/misc">
          <li
            className={
              router.pathname == '/misc' ? 'sidebarActiveLink' : 'sidebarLink'
            }
          >
            <ClipboardIcon
              className={
                router.pathname == '/misc' ? 'sidebarActiveIcon' : 'sidebarIcon'
              }
            />
            <span
              className={
                router.pathname == '/misc' ? 'sidebarActiveText' : 'sidebarText'
              }
            >
              Pengeluaran Lain
            </span>
          </li>
        </Link>

        <Link href="/customers">
          <li
            className={
              router.pathname == '/customers'
                ? 'sidebarActiveLink'
                : 'sidebarLink'
            }
          >
            <ViewGridIcon
              className={
                router.pathname == '/customers'
                  ? 'sidebarActiveIcon'
                  : 'sidebarIcon'
              }
            />
            <span
              className={
                router.pathname == '/customers'
                  ? 'sidebarActiveText'
                  : 'sidebarText'
              }
            >
              EMKL
            </span>
          </li>
        </Link>
        {user.role === 'admin' && <Link href="/register">
          <li
            className={
              router.pathname == '/register'
                ? 'sidebarActiveLink'
                : 'sidebarLink'
            }
          >
            <UserAddIcon
              className={
                router.pathname == '/register'
                  ? 'sidebarActiveIcon'
                  : 'sidebarIcon'
              }
            />
            <span
              className={
                router.pathname == '/register'
                  ? 'sidebarActiveText'
                  : 'sidebarText'
              }
            >
              Tambah User Baru
            </span>
          </li>
        </Link>}
        <li
          className="sidebarLink flex cursor-pointer"
          onClick={() => logOut()}
        >
          <LogoutIcon className="sidebarIcon" />
          <span className="sidebarText">Log Out</span>
        </li>
      </ul>
    </div>
  );
}
