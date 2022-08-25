import Head from 'next/head';
import Link from 'next/link';
import { redirectToLogin, Truck } from '../../types/common';
import truckBloc from '../../lib/truck';
import { InferGetServerSidePropsType } from 'next';
import AddTruckButton from '../../components/truck/add-truck-button';
import * as jwt from 'jsonwebtoken';
import { getCookie } from 'cookies-next';
import authorizeUser from '../../helpers/auth';

export default function Home({
  trucks,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const user = authorizeUser();

  return (
    <>
      <Head>
        <title>{'Home'}</title>
      </Head>
      <div className="container p-8">
        {user.role === 'admin' && (
          <div className="flex justify-end mr-5 mb-3">
            <AddTruckButton />
          </div>
        )}
        <div className="grid grid-cols-4 gap-4 ml-17">
          {trucks.map((truck: Truck) => (
            <Link
              href={{
                pathname: `/trucks/${truck.id}`,
                query: {
                  truckName: truck.name,
                },
              }}
              key={truck.id}
            >
              <a className="xl:w-64 xl:h-64 w-40 h-40 rounded-lg border border-gray-200 shadow-md hover:bg-gray-100">
                <h1 className="xl:text-5xl text-3xl text-center xl:mt-20 mt-[52px]">
                  {truck.name}
                </h1>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  const access_token = getCookie('access_token', {
    req: context.req,
    res: context.res,
  });

  if (!access_token) return redirectToLogin;
  
  try {
    jwt.verify(access_token.toString(), process.env.SECRET_KEY);
  } catch (e) {
    return redirectToLogin;
  }

  const trucks: Truck[] = await truckBloc.getTrucks();
  
  return {
    props: {
      trucks,
    },
  };
};
