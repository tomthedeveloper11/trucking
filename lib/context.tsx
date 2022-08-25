import { createContext } from 'react';
import { Truck } from '../types/common';

export const TruckContext = createContext<Omit<Truck, 'id'>[]>([]);