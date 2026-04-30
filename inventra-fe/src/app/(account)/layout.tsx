"use client";

import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import AdminSidebar from "@/layout/AdminSidebar";
import Backdrop from "@/layout/Backdrop";
import ChatbotWidget from "@/components/chatbot/ChatbotWidget";
import React from "react";

function AccountContent({ children }: { children: React.ReactNode }) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { user, isLoading } = useAuth();

  const isSuperAdmin = user?.role === "SUPERADMIN";

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen xl:flex">
      {isSuperAdmin ? <AdminSidebar /> : <AppSidebar />}
      <Backdrop />
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
      </div>
      <ChatbotWidget />
    </div>
  );
}

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <AccountContent>{children}</AccountContent>
      </SidebarProvider>
    </AuthProvider>
  );
}
