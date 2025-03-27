import { getCookie, setCookie, removeCookie } from "@/lib/clientCookie";

export const removeCookies = () => {
  removeCookie("token");
  removeCookie("role");
  removeCookie("name");
  removeCookie("user_id");
};

export const setCookies = (
  token: string,
  role: string,
  name: string,
  id: number,
  experationDays: number
) => {
  setCookie("token", token, experationDays);
  setCookie("role", role, experationDays);
  setCookie("name", name, experationDays);
  setCookie("user_id", id.toString(), experationDays);
};

export const getCookies = () => {
  const token = getCookie("token");
  const role = getCookie("role");
  const name = getCookie("name");
  const user_id = getCookie("user_id");
  return { token, role, name, user_id };
};
