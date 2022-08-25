import { Truck } from '../../types/common';
import truckRepository from './truck.repository';

const createTruck = async (truckPayload: Omit<Truck, 'id'>) => {
  const newTruck = await truckRepository.createTruck(truckPayload);
  return newTruck;
};

const getTrucks = async () => {
  const trucks = await truckRepository.getTrucks();
  return trucks;
};

const truckService = {
  createTruck,
  getTrucks,
};

export default truckService;
