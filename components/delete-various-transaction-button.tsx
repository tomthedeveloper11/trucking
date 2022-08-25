import axios from 'axios';
import { useRouterRefresh } from '../hooks/hooks';
import { TrashIcon } from '@heroicons/react/solid';
import { useToastContext } from '../lib/toast-context';
import { BASE_URL } from '../types/common';

interface DeleteTruckTransactionButtonProps {
  transactionId: string;
  disabled?: boolean;
}

export default function DeleteVariousTransactionButton({
  transactionId,
  disabled = false,
}: DeleteTruckTransactionButtonProps) {
  const refreshData = useRouterRefresh();
  const addToast = useToastContext();

  async function deleteTruckTransaction() {
    await axios({
      method: 'DELETE',
      url: `${BASE_URL}/api/transaction/${transactionId}`,
    })
      .then(() => {
        refreshData();
      })
      .catch((err) => {
        addToast(err.response.data.message);
      });
  }

  return (
    <TrashIcon
      className={`${
        disabled ? 'text-gray-200' : 'text-red-500 cursor-pointer'
      } h-7`}
      onClick={() => {
        if (!disabled) {
          deleteTruckTransaction();
        }
      }}
    />
  );
}
