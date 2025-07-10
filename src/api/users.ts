import { api } from "@/services/api";

export const getUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

export const checkUserPassword = async (user_id: number, password: string) => {
  const data = {
    user_id,
    password,
  };

  const res = await api.post(`/users/${user_id}/check-password`, data);
  return res.data;
};
