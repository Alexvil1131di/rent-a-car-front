import { useQuery, useMutation } from "@tanstack/react-query";
import { default as axios } from 'axios';
import Cookies from "js-cookie";

export interface vehicleInterface {
  id?: number;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  status: "AVAILABLE" | "RENTED" | "COMPLETED";
  dailyPrice: number;
  actions?: any;
}


const getVehicles = async (): Promise<vehicleInterface[]> => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/vehicles`,
    {
      headers: {
        Authorization: `Bearer ${Cookies.get(process.env.NEXT_PUBLIC_AUTH_KEY || "f34bdb07-355f-477d-92d8-78041ac31f57")}`
      }
    }
  ).then((res) => {
    return res.data;
  }).catch((err) => {
    throw new Error('Error getting clients');
  });
  return response;
}

const createVehicle = async (client: vehicleInterface) => {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/vehicles`, client,
    {
      headers: {
        Authorization: `Bearer ${Cookies.get(process.env.NEXT_PUBLIC_AUTH_KEY || "f34bdb07-355f-477d-92d8-78041ac31f57")}`
      }
    }
  ).then((res) => {
    return res.data;
  }).catch((err) => {
    throw new Error('Error creating client');
  });
  return response;
}

const updateVehicle = async (client: vehicleInterface) => {
  const response = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/vehicles/${client.id}`, client,
    {
      headers: {
        Authorization: `Bearer ${Cookies.get(process.env.NEXT_PUBLIC_AUTH_KEY || "f34bdb07-355f-477d-92d8-78041ac31f57")}`
      }
    }
  ).then((res) => {
    return res.data;
  }
  ).catch((err) => {
    throw new Error('Error updating client');
  });
  return response;
}

export const useGetVehicles = () => {
  return useQuery({ queryKey: ["vehicles"], queryFn: getVehicles });
}

export const useCreateVehicle = () => {
  return useMutation({ mutationFn: createVehicle });
}

export const useUpdateVehicle = () => {
  return useMutation({ mutationFn: updateVehicle });
}