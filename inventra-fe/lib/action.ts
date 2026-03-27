/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import {
  API_URL,
  ENCRYPT_SECRET,
} from "../global";

import { getCookies, setCookies } from "./server-cookie";
import CryptoJS from "crypto-js";

type TypedResponse = {
  status: boolean;
  message?: string;

  data?: Record<string, never> | null;
};

const decryptFromClient = (encrypted: string): string => {
  const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPT_SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const encryptClient = async (data: string) => {
  return CryptoJS.AES.encrypt(data, ENCRYPT_SECRET).toString();
};
export const post = async (
  url: string,
  payload: string | FormData,
  token?: string
): Promise<TypedResponse> => {
  try {

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : ''
        
      },
      body: typeof payload == "string" ? decryptFromClient(payload) : payload,

    });


    const data = await res.json();
    if (!res.ok) {
      return data
    }
  
    return data;
  } catch (error) {
    let message = "Faild to fetch";
    if (error instanceof Error) {
      message = error.message;
    }
    return {
      status: false,
      message,
      data: null,
    };
  }
};
export const put = async (
  url: string,
  payload: string | FormData,
  token?: string,

): Promise<TypedResponse> => {
  try {

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: token ? `Bearer ${token}` : ''
      },
      body: typeof payload == "string" ? decryptFromClient(payload) : payload,

    });

    const data = await res.json();
    if (!res.ok) {
      return data
    }
  
    return data;
  } catch (error) {
    let message = "Faild to fetch";
    if (error instanceof Error) {
      message = error.message;
    }
    return {
      status: false,
      message,
      data: null,
    };
  }
};
export const get = async (
  url: string,
  payload: string | FormData,
  token?: string,

): Promise<TypedResponse> => {
  try {

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: token ? `Bearer ${token}` : ''
      },
      body: typeof payload == "string" ? decryptFromClient(payload) : payload,

    });

     const data = await res.json();
    if (!res.ok) {
      return data
    }
  
    return data;
  } catch (error) {
    let message = "Faild to fetch";
    if (error instanceof Error) {
      message = error.message;
    }
    return {
      status: false,
      message,
      data: null,
    };
  }
};
export const del = async (
  url: string,
  payload: string | FormData,
  token?: string,

): Promise<TypedResponse> => {
  try {

    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: token ? `Bearer ${token}` : ''
      },
      body: typeof payload == "string" ? decryptFromClient(payload) : payload,

    });

      const data = await res.json();
    if (!res.ok) {
      return data
    }
  
    return data;
  } catch (error) {
    let message = "Faild to fetch";
    if (error instanceof Error) {
      message = error.message;
    }
    return {
      status: false,
      message,
      data: null,
    };
  }
};
