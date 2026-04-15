/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { FormEvent, useEffect, useState } from "react";
import { signIn } from "../../../services/auth.service";
import { API_URL } from "../../../global";
import { json } from "stream/consumers";
import { useRouter } from "next/navigation";
import Alert from "../ui/alert/Alert";
import { toast, Toaster } from "sonner";
import { setCookies } from "../../../lib/server-cookie";

import { Trans } from "@lingui/react"

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [data, setData] = useState({
    email: '',
    password: ''
  })


  const router = useRouter();

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setData({ ...data, email: savedEmail })
      setIsChecked(true);
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {

    e.preventDefault();
    try {
      const sign = await signIn({ ...data, email: data.email, password: data.password });
  
      if (!sign || sign.status !== true) {
        toast.error("Login Failed", {
          description: sign?.message ?? "Server error",
        });
        return;
      }

      setCookies('token', sign.data.token);

      if (isChecked) {
        localStorage.setItem("rememberedEmail", data.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      setData({ ...data, password: '' });
      router.push('/');
      toast.success("Login Success", {
        description: sign.message,
      });
    } catch (error) {
      toast.error("Something went wrong", {
        description: (error as Error)?.message ?? "Unknown error",
      });
    }
  };

  




  return (
    <>

      <div className="flex flex-col flex-1 
    
    lg:w-1/2 w-full">
        <Toaster position="top-left" />
        <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ChevronLeftIcon />
            Back to dashboard
          </Link>
        </div>
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div>
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              
                Sign In
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enter your email and password to sign in!
              </p>
            </div>
            <div>

              <form onSubmit={async (e) => {
                handleSubmit(e)

              }} >
                <div className="space-y-6">
                  <div>
                    <Label>
                      Email <span className="text-error-500">*</span>{" "}
                    </Label>
                    <Input defaultValue={data.email} onChange={e => { setData({ ...data, email: e.target.value }) }} placeholder="info@gmail.com" type="email" />
                  </div>
                  <div>
                    <Label>
                      Password <span className="text-error-500">*</span>{" "}
                    </Label>
                    <div className="relative">
                      <Input
                        defaultValue={data.password}
                        onChange={e => { setData({ ...data, password: e.target.value }) }}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                      >
                        {showPassword ? (
                          <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                        ) : (
                          <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox checked={isChecked} onChange={setIsChecked} />
                      <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                        Keep me logged in
                      </span>
                    </div>
                    <Link
                      href="/reset-password"
                      className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div>
                    <Button type="submit" className="w-full" size="sm">
                      Sign in
                    </Button>

                  </div>
                </div>
              </form>

              <div className="mt-5">
                <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                  Don&apos;t have an account? {""}
                  <Link
                    href="/signup"
                    className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div></>
  );
}
