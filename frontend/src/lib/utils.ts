import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from 'axios';
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
const dev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
export const axiosInstance = axios.create({ baseURL: dev ? "http://localhost:8080/api": `http://${window.location.host}/api`});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);