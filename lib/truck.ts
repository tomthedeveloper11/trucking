import axios from 'axios';
import { BASE_URL, Truck } from '../types/common';

const getTrucks = async () => {
  const response = await axios({
    method: 'GET',
    url: `${BASE_URL}/api/truck`,
  });
  if (response && response.data) {
    return response.data.data as Truck[];
  }
  return [];
};
const truckBloc = { getTrucks };

export default truckBloc;
