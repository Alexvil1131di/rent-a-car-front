import { useQuery, useMutation } from "@tanstack/react-query";
import { default as axios } from 'axios';
import Cookies from "js-cookie";

export interface vehicleInterface {
  id?: number;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  status: "AVAILABLE" | "RENTED" | "MAINTENANCE";
  dailyPrice: number;
  actions?: any;
}

export interface reservationInterface {
  id?: number;
  vehicleId: number;
  clientId: number;
  startDate: string;
  endDate: string;
}

export interface getReservationsInterface {
  vehicleId: number;
}
export interface reservationDetailsInterface {
  id: number;
  startDate: string;
  endDate: string;
  totalCost: string;
  status: "CONFIRMED" | "COMPLETED" | "CANCELLED";
  vehicle: {
    id: number;
    brand: string;
    model: string;
    year: number;
  };
  client: {
    id: number;
    name: string;
    email: string;
  };
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

const updateVehicle = async ({ id, client }: { id: any, client: vehicleInterface }) => {
  const response = await axios.patch(`${process.env.NEXT_PUBLIC_BASE_URL}/vehicles/${id}`, client,
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



const getReservations = async (vehicleId: number): Promise<reservationDetailsInterface[]> => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/reservations/check-availability?vehicleId=${vehicleId}`,
    {
      headers: {
        Authorization: `Bearer ${Cookies.get(process.env.NEXT_PUBLIC_AUTH_KEY || "f34bdb07-355f-477d-92d8-78041ac31f57")}`
      }
    }
  ).then((res) => {
    return res.data;
  }).catch((err) => {
    throw new Error('Error getting reservations');
  });
  return response;
}

const createReservation = async (reservation: reservationInterface) => {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/reservations`, reservation,
    {
      headers: {
        Authorization: `Bearer ${Cookies.get(process.env.NEXT_PUBLIC_AUTH_KEY || "f34bdb07-355f-477d-92d8-78041ac31f57")}`
      }
    }
  ).then((res) => {
    return res.data;
  }).catch((err) => {
    throw new Error('Error creating reservation');
  });
  return response;
}

const updateReservationStatus = async ({ id, status }: { id: any, status: "CONFIRMED" | "PENDING" | "CANCELLED" }) => {
  const response = await axios.patch(`${process.env.NEXT_PUBLIC_BASE_URL}/reservations/${id}/status`, { status },
    {
      headers: {
        Authorization: `Bearer ${Cookies.get(process.env.NEXT_PUBLIC_AUTH_KEY || "f34bdb07-355f-477d-92d8-78041ac31f57")}`
      }
    }
  ).then((res) => {
    return res.data;
  }
  ).catch((err) => {
    throw new Error('Error updating reservation');
  });
  return response;
}

export const useCreateReservation = () => {
  return useMutation({ mutationFn: createReservation });
}

export const useUpdateReservationStatus = () => {
  return useMutation({ mutationFn: updateReservationStatus });
}



export const useGetReservations = () => {
  return useMutation({ mutationFn: getReservations });
}

export const useGetVehicles = () => {
  return useQuery({ queryKey: ["vehicles"], queryFn: getVehicles });
}

export const useCreateVehicle = () => {
  return useMutation({ mutationFn: createVehicle });
}

export const useUpdateVehicle = () => {
  return useMutation({ mutationFn: (variables: { id: number, client: vehicleInterface }) => updateVehicle(variables) });
}