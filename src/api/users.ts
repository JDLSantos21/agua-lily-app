import { fetcher } from "./fetcher";

export const getUsers = async () => {
  return await fetcher("/users");
};

export const checkUserPassword = async (user_id: number, password: string) => {
  return await fetcher(`/users/${user_id}/check-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });
};
