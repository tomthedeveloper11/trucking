import { Toast } from 'flowbite-react';

export default function MyToast({ message }: { message: string }) {
  return (
    <>
      <Toast>
        {/* <div className="inline-flex h-7 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-500 dark:bg-blue-800 dark:text-blue-200">
          <h1>asd</h1>
        </div> */}
        <div className="ml-3 text-sm font-normal">{message}</div>
        {/* <Toast.Toggle /> */}
      </Toast>
    </>
  );
}
