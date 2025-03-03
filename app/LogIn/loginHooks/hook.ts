import { useQuery, useMutation } from "@tanstack/react-query";
import { default as axios } from 'axios';
import Cookies from "js-cookie";

const loginResponse = async (credentials: { email: string, password: string }): Promise<{ token: string }> => {

  const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, credentials).then((res) => {
    Cookies.set(process.env.NEXT_PUBLIC_AUTH_KEY || "f34bdb07-355f-477d-92d8-78041ac31f57", res.data.token, { expires: 1 });
    console.log(res.data);
    return res.data;
  }).catch((err) => {
    console.log('Login failed');
  });

  return response;

}

export const useLogin = () => {
  return useMutation({ mutationFn: loginResponse });
}
