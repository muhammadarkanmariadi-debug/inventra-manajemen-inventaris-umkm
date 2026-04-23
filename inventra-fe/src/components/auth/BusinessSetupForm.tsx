"use client";
import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { ChevronLeftIcon } from "@/icons";
import Link from "next/link";
import { createBusiness } from "../../../services/business.service";
import { toast, Toaster } from "sonner";
import Button from "@/components/ui/button/Button";

export default function BusinessSetupForm() {
  const [data, setData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!data.name || !data.address || !data.phone || !data.email) {
      toast.error("Validation Error", {
        description: "Please fill all required fields.",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await createBusiness({
        name: data.name,
        address: data.address,
        phone: data.phone,
        email: data.email,
        description: data.description,
      });

      if (!res || res.status !== true) {
        toast.error("Setup Failed", {
          description: res?.message ?? "Server error",
        });
        setLoading(false);
        return;
      }

      toast.success("Business Registered", {
        description: "Your business profile is fully set up.",
      });

      // Redirect to the dashboard
      router.push('/dashboard');
    } catch (error) {
      toast.error("Something went wrong", {
        description: (error as Error)?.message ?? "Unknown error",
      });
      setLoading(false);
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
          Back to home
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Setup Your Business
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Complete this step to start managing your inventory!
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div>
                  <Label>
                    Business Name<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter business name"
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>
                    Phone Number<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Enter phone number"
                    value={data.phone}
                    onChange={(e) => setData({ ...data, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label>
                    Business Email<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter business email"
                    value={data.email}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label>
                    Business Address<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="address"
                    name="address"
                    placeholder="Enter business address"
                    value={data.address}
                    onChange={(e) => setData({ ...data, address: e.target.value })}
                  />
                </div>
                <div>
                   <Label>
                    Description
                  </Label>
                  <Input
                    type="text"
                    id="description"
                    name="description"
                    placeholder="Brief description about your business"
                    value={data.description}
                    onChange={(e) => setData({ ...data, description: e.target.value })}
                  />
                </div>
                <div className="pt-3">
                  <Button type="submit" className="w-full" size="sm" disabled={loading}>
                    {loading ? "Creating..." : "Complete Setup"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
