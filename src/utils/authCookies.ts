"use client";
import { getCookie, setCookie, removeCookie } from "@/lib/clientCookie";

export const removeCookies = () => {
  removeCookie("token");
  removeCookie("role");
  removeCookie("name");
  removeCookie("user_id");
};

export const save = (name: string, value: string, days?: number) =>
  setCookie(name, value, days);

export const get = (name: string): string | null => getCookie(name);

export const remove = (name: string) => removeCookie(name);

export const setCookies = (
  token: string,
  role: string,
  name: string,
  id: number,
  accessToken: string,
  refreshToken: string,
  experationDays: number
) => {
  setCookie("token", token, experationDays);
  setCookie("role", role, experationDays);
  setCookie("name", name, experationDays);
  setCookie("user_id", id.toString(), experationDays);
  setCookie("accessToken", accessToken, experationDays);
  setCookie("refreshToken", refreshToken, experationDays);
};

export const getCookies = () => {
  const token = getCookie("token");
  const role = getCookie("role");
  const name = getCookie("name");
  const user_id = getCookie("user_id");
  return { token, role, name, user_id };
};
