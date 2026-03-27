"use server";
import { cookies } from "next/headers";
export const getCookies = async (key: string): Promise<string> => {
  return (await cookies()).get(key)?.value || "";
};
export const setCookies = async (key: string, value: string) => {
  (await cookies()).set(key, value, {
    httpOnly: true,
    sameSite: `strict`,
    maxAge: 60 * 60 * 24,
  });
};
export const removeCookies = async (key: string) => {
  (await cookies()).delete(key);
};
