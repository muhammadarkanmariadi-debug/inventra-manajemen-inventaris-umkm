import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";
import { LocaleProvider } from "@/context/LocaleProvider";

import { ThemeProvider } from "@/context/ThemeContext";
import { i18n, loadCatalog } from "@/lib/i18n";
import { Trans, useLingui } from "@lingui/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Toaster } from "sonner";

export default  function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {



  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">

      <Toaster position="top-left" />
      <LocaleProvider >
        <ThemeProvider>

          <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col  dark:bg-gray-900 sm:p-0">
            {children}
            <div className="lg:w-1/2 w-full h-full bg-brand-950 dark:bg-white/5 lg:grid items-center hidden">
              <div className="relative items-center justify-center  flex z-1">
                {/* <!-- ===== Common Grid Shape Start ===== --> */}
                <GridShape />
                <div className="flex flex-col items-center max-w-xs">
                  <Link href="/" className="block mb-4">
                    <Image
                      width={231}
                      height={48}
                      src="/images/logo/auth-logo.svg"
                      alt="Logo"
                    />
                  </Link>
                  <h1 className="text-white text-center text-xl font-semibold mb-2">Smart inventory management
                    for modern teams</h1>
                  <p className="text-center text-gray-400 dark:text-white/60">
                    Track stock in real-time, manage suppliers, and get alerts before you run out.
                  </p>
                </div>
              </div>
            </div>
            <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
              <ThemeTogglerTwo />

            </div>
          </div>

        </ThemeProvider >
      </LocaleProvider>
    </div >
  );
}
