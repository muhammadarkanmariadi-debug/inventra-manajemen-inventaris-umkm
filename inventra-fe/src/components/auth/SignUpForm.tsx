"use client";
import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import { register } from "../../../services/auth.service";
import { setCookies } from "../../../lib/server-cookie";
import { toast, Toaster } from "sonner";
import Button from "@/components/ui/button/Button";

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../lib/firebase";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [data, setData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
  });

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!data.fname || !data.email || !data.password) {
      toast.error("Validation Error", {
        description: "Please fill all required fields.",
      });
      return;
    }

    try {
      const username = `${data.fname} ${data.lname}`.trim();
      const res = await register({
        username,
        email: data.email,
        password: data.password,
      });

      if (!res || res.status !== true) {
        toast.error("Registration Failed", {
          description: res?.message ?? "Server error",
        });
        return;
      }

      // Automatically logic after signed up as provided by backend
      toast.success("Check Your Email", {
        description: "We've sent a verification link to your email.",
      });

      router.push('/verify-email-pending');
    } catch (error) {
      toast.error("Something went wrong", {
        description: (error as Error)?.message ?? "Unknown error",
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/firebase-google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ token: idToken }),
      });

      const data = await res.json();
      if (!res.ok || data.status !== true) {
        toast.error("Google Sign-Up Failed", {
          description: data?.message ?? "Server error",
        });
        return;
      }

      if (data.data?.token) {
        await setCookies('token', data.data.token);
      }
      
      toast.success("Login Success", {
        description: data.message,
      });
      router.push('/auth/business-setup');
    } catch (error) {
      toast.error("Google Sign-Up Error", {
        description: (error as Error)?.message ?? "Unknown error",
      });
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
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
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your details to create an account!
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <Label>
                      First Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="fname"
                      name="fname"
                      placeholder="Enter your first name"
                      value={data.fname}
                      onChange={(e) => setData({ ...data, fname: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <Label>
                      Last Name
                    </Label>
                    <Input
                      type="text"
                      id="lname"
                      name="lname"
                      placeholder="Enter your last name"
                      value={data.lname}
                      onChange={(e) => setData({ ...data, lname: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label>
                    Email<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={data.email}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label>
                    Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      value={data.password}
                      onChange={(e) => setData({ ...data, password: e.target.value })}
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
                <div className="flex items-center gap-3">
                  <Checkbox
                    className="w-5 h-5"
                    checked={isChecked}
                    onChange={setIsChecked}
                  />
                  <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                    By creating an account means you agree to the{" "}
                    <span className="text-gray-800 dark:text-white/90">
                      Terms and Conditions,
                    </span>{" "}
                    and our{" "}
                    <span className="text-gray-800 dark:text-white">
                      Privacy Policy
                    </span>
                  </p>
                </div>
                <div>
                  <Button type="submit" className="w-full" size="sm">
                    Sign Up
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-6 flex items-center justify-between">
              <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/4"></span>
              <span className="text-xs text-center text-gray-500 uppercase dark:text-gray-400">
                BISA JUGA DENGAN
              </span>
              <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/4"></span>
            </div>
            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="flex items-center justify-center w-full gap-3 px-4 py-3 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Daftar dengan Google
              </button>
            </div>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account?{" "}
                <Link
                  href="/auth/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
