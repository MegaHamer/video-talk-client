import axios from "axios";
import { TypeRegisterSchema } from "../shemes/register.shema";
import { TypeLoginSchema } from "../shemes/login.shema";
import  api  from "@/shared/api/axios";



export interface RegisterResponse {
  //   id: string;
  //   email: string;
  access_token: string;
}

export const registerUser = async (
  data: TypeRegisterSchema,
): Promise<RegisterResponse> => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const loginUser = async (
  data: TypeLoginSchema,
): Promise<RegisterResponse> => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};
