import BusinessSetupForm from "@/components/auth/BusinessSetupForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Setup | TailAdmin - Next.js Dashboard Template",
  description: "Set up your business to get started in the dashboard.",
};

export default function BusinessSetup() {
  return <BusinessSetupForm />;
}
