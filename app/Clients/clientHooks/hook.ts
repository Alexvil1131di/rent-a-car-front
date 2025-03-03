import { useQuery, useMutation } from "@tanstack/react-query";
import { default as axios } from 'axios';
import Cookies from "js-cookie";

export interface clientInterface {
  id?: number;
  name: string;
  lastName: string;
  documentId: string;
  phone: string;
  email: string;
  address: string;
}


const getClient = async (): Promise<clientInterface[]> => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/clients`,
    {
      headers: {
        Authorization: `Bearer ${Cookies.get(process.env.NEXT_PUBLIC_AUTH_KEY || "f34bdb07-355f-477d-92d8-78041ac31f57")}`
      }
    }
  ).then((res) => {
    return res.data;
  }).catch((err) => {
    console.log('Error getting clients');
  });
  return response;
}

export const useGetClients = () => {
  return useQuery({ queryKey: ["clients"], queryFn: getClient });
}

const createClient = async (client: clientInterface) => {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/clients`, client,
    {
      headers: {
        Authorization: `Bearer ${Cookies.get(process.env.NEXT_PUBLIC_AUTH_KEY || "f34bdb07-355f-477d-92d8-78041ac31f57")}`
      }
    }
  ).then((res) => {
    return res.data;
  }).catch((err) => {
    console.log('Error creating client');
  });
  return response;
}

export const useCreateClient = () => {
  return useMutation({ mutationFn: createClient });
}