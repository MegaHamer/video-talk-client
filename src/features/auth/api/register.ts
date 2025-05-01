import axios from 'axios';
import { TypeRegisterSchema } from '../shemes/register.shema';

export const authApi = axios.create({
  baseURL: process.env.SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});



export interface RegisterResponse {
//   id: string;
//   email: string;
  access_token: string;
}

export const registerUser = async (data: TypeRegisterSchema): Promise<RegisterResponse> => {
  const response = await authApi.post('/auth/register', data);
  return response.data;
};