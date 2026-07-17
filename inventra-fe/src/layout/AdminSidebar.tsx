/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  GridIcon,
  HorizontaLDots,
  ChevronDownIcon,
  UserIcon,
} from "../icons/index";
import { useAuth } from "@/context/AuthContext";
import { Building2, Settings, User, UserCircle, Users, ArrowLeft } from "lucide-react";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  permission?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean; permission?: string }[];
};

const adminNavItems: NavItem[] = [
  {
    icon: <Building2 className="w-5 h-5" />,
    name: "Semua Bisnis",
    path: "/admin/businesses",
  },
  {
    icon: <Users className="w-5 h-5" />,
    name: "Semua Pengguna",
    path: "/admin/users",
  },
  {
    icon: <Settings className="w-5 h-5" />,
    name: "Pengaturan",
    path: "/account/settings",
  },
  {
    icon: <UserCircle className="w-5 h-5" />,
    name: "Edit Profil",
    path: "/account/profile",
  },
];

const AdminSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const renderMenuItems = (navItems: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.path && (
            <Link
              href={nav.path}
              className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"}`}
            >
              <span className={`${isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );

  const isActive = useCallback((path: string) => path === pathname || pathname.startsWith(path + '/'), [pathname]);

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
        <Link href="/admin/businesses">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image className="dark:hidden" src={'/images/logo/logo.svg'} alt="Logo" width={150} height={40} />
              <Image className="hidden dark:block" src={'/images/logo/logo-dark.svg'} alt="Logo" width={150} height={40} />
            </>
          ) : (
            <>
              <Image className="dark:hidden" src={'/images/logo/logo.svg'} alt="Logo" width={32} height={32} />
              <Image className="hidden dark:block" src={'/images/logo/logo-dark.svg'} alt="Logo" width={32} height={32} />
            </>
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
                {isExpanded || isHovered || isMobileOpen ? "SaaS Admin" : <HorizontaLDots />}
              </h2>
              {renderMenuItems(adminNavItems)}
            </div>
          </div>
        </nav>
      </div>

      <div className="mt-auto pb-6 pt-4">
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium text-gray-500 duration-300 ease-in-out hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white ${!isExpanded && !isHovered
              ? "lg:justify-center"
              : "justify-start"
              }`}
          >
            <span className="text-gray-500 transition-colors group-hover:text-brand-500 dark:text-gray-400 group-hover:dark:text-brand-400 flex items-center justify-center">
              <ArrowLeft className="w-5 h-5" />
            </span>
            {(isExpanded || isHovered || isMobileOpen) && (
              <span className="text-sm">
                Kembali ke Beranda
              </span>
            )}
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
