import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from 'axios';
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const axiosInstance = axios.create({ baseURL: `http://${window.location.host}/api`});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);
export function nextFriday(): number {
  const currentDate = new Date();
  const currentDay = currentDate.getDay();
  return (5 + 7 - currentDay) % 7;
}
export const formattedDate = (date: Date, d?: number) => {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 to month to adjust for 0-based months
  const day = (date.getDate() + (d != undefined ? d : 0)).toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const formattedHours = (timestamp: number) => {
  const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  return  `${formattedHours}:${formattedMinutes}`;
}
