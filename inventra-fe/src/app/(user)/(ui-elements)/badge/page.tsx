import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Badge from "@/components/ui/badge/Badge";
import { PlusIcon } from "@/icons";
import { Metadata } from "next";
import React from "react";
import { Trans } from "@lingui/macro";

export const metadata: Metadata = {
  title: "Next.js Badge | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Badge page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
  // other metadata
};

export default function BadgePage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Badges" />
      <div className="space-y-5 sm:space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="px-6 py-5">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              {/* @ts-ignore */}<Trans>With Light Background</Trans></h3>
          </div>
          <div className="p-6 border-t border-gray-100 dark:border-gray-800 xl:p-10">
            <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
              {/* Light Variant */}
              <Badge variant="light" color="primary">
                {/* @ts-ignore */}<Trans>Primary</Trans></Badge>
              <Badge variant="light" color="success">
                {/* @ts-ignore */}<Trans>Success</Trans></Badge>{" "}
              <Badge variant="light" color="error">
                {/* @ts-ignore */}<Trans>Error</Trans></Badge>{" "}
              <Badge variant="light" color="warning">
                {/* @ts-ignore */}<Trans>Warning</Trans></Badge>{" "}
              <Badge variant="light" color="info">
                {/* @ts-ignore */}<Trans>Info</Trans></Badge>
              <Badge variant="light" color="light">
                {/* @ts-ignore */}<Trans>Light</Trans></Badge>
              <Badge variant="light" color="dark">
                {/* @ts-ignore */}<Trans>Dark</Trans></Badge>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="px-6 py-5">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              {/* @ts-ignore */}<Trans>With Solid Background</Trans></h3>
          </div>
          <div className="p-6 border-t border-gray-100 dark:border-gray-800 xl:p-10">
            <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
              {/* Light Variant */}
              <Badge variant="solid" color="primary">
                {/* @ts-ignore */}<Trans>Primary</Trans></Badge>
              <Badge variant="solid" color="success">
                {/* @ts-ignore */}<Trans>Success</Trans></Badge>{" "}
              <Badge variant="solid" color="error">
                {/* @ts-ignore */}<Trans>Error</Trans></Badge>{" "}
              <Badge variant="solid" color="warning">
                {/* @ts-ignore */}<Trans>Warning</Trans></Badge>{" "}
              <Badge variant="solid" color="info">
                {/* @ts-ignore */}<Trans>Info</Trans></Badge>
              <Badge variant="solid" color="light">
                {/* @ts-ignore */}<Trans>Light</Trans></Badge>
              <Badge variant="solid" color="dark">
                {/* @ts-ignore */}<Trans>Dark</Trans></Badge>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="px-6 py-5">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              {/* @ts-ignore */}<Trans>Light Background with Left Icon</Trans></h3>
          </div>
          <div className="p-6 border-t border-gray-100 dark:border-gray-800 xl:p-10">
            <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
              <Badge variant="light" color="primary" startIcon={<PlusIcon />}>
                {/* @ts-ignore */}<Trans>Primary</Trans></Badge>
              <Badge variant="light" color="success" startIcon={<PlusIcon />}>
                {/* @ts-ignore */}<Trans>Success</Trans></Badge>{" "}
              <Badge variant="light" color="error" startIcon={<PlusIcon />}>
                {/* @ts-ignore */}<Trans>Error</Trans></Badge>{" "}
              <Badge variant="light" color="warning" startIcon={<PlusIcon />}>
                {/* @ts-ignore */}<Trans>Warning</Trans></Badge>{" "}
              <Badge variant="light" color="info" startIcon={<PlusIcon />}>
                {/* @ts-ignore */}<Trans>Info</Trans></Badge>
              <Badge variant="light" color="light" startIcon={<PlusIcon />}>
                {/* @ts-ignore */}<Trans>Light</Trans></Badge>
              <Badge variant="light" color="dark" startIcon={<PlusIcon />}>
                {/* @ts-ignore */}<Trans>Dark</Trans></Badge>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="px-6 py-5">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              {/* @ts-ignore */}<Trans>Solid Background with Left Icon</Trans></h3>
          </div>
          <div className="p-6 border-t border-gray-100 dark:border-gray-800 xl:p-10">
            <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
              <Badge variant="solid" color="primary" startIcon={<PlusIcon />}>
                {/* @ts-ignore */}<Trans>Primary</Trans></Badge>
              <Badge variant="solid" color="success" startIcon={<PlusIcon />}>
                {/* @ts-ignore */}<Trans>Success</Trans></Badge>{" "}
              <Badge variant="solid" color="error" startIcon={<PlusIcon />}>
                {/* @ts-ignore */}<Trans>Error</Trans></Badge>{" "}
              <Badge variant="solid" color="warning" startIcon={<PlusIcon />}>
                {/* @ts-ignore */}<Trans>Warning</Trans></Badge>{" "}
              <Badge variant="solid" color="info" startIcon={<PlusIcon />}>
                {/* @ts-ignore */}<Trans>Info</Trans></Badge>
              <Badge variant="solid" color="light" startIcon={<PlusIcon />}>
                {/* @ts-ignore */}<Trans>Light</Trans></Badge>
              <Badge variant="solid" color="dark" startIcon={<PlusIcon />}>
                {/* @ts-ignore */}<Trans>Dark</Trans></Badge>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="px-6 py-5">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              {/* @ts-ignore */}<Trans>Light Background with Right Icon</Trans></h3>
          </div>
          <div className="p-6 border-t border-gray-100 dark:border-gray-800 xl:p-10">
            <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
              <Badge variant="light" color="primary" endIcon={<PlusIcon />}>
                {/* @ts-ignore */}<Trans>Primary</Trans></Badge>
              <Badge variant="light" color="success" endIcon={<PlusIcon />}>
                {/* @ts-ignore */}<Trans>Success</Trans></Badge>{" "}
              <Badge variant="light" color="error" endIcon={<PlusIcon />}>
                {/* @ts-ignore */}<Trans>Error</Trans></Badge>{" "}
              <Badge variant="light" color="warning" endIcon={<PlusIcon />}>
                {/* @ts-ignore */}<Trans>Warning</Trans></Badge>{" "}
              <Badge variant="light" color="info" endIcon={<PlusIcon />}>
                {/* @ts-ignore */}<Trans>Info</Trans></Badge>
              <Badge variant="light" color="light" endIcon={<PlusIcon />}>
                {/* @ts-ignore */}<Trans>Light</Trans></Badge>
              <Badge variant="light" color="dark" endIcon={<PlusIcon />}>
                {/* @ts-ignore */}<Trans>Dark</Trans></Badge>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="px-6 py-5">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              {/* @ts-ignore */}<Trans>Solid Background with Right Icon</Trans></h3>
          </div>
          <div className="p-6 border-t border-gray-100 dark:border-gray-800 xl:p-10">
            <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
              <Badge variant="solid" color="primary" endIcon={<PlusIcon />}>
                {/* @ts-ignore */}<Trans>Primary</Trans></Badge>
              <Badge variant="solid" color="success" endIcon={<PlusIcon />}>
                {/* @ts-ignore */}<Trans>Success</Trans></Badge>{" "}
              <Badge variant="solid" color="error" endIcon={<PlusIcon />}>
                {/* @ts-ignore */}<Trans>Error</Trans></Badge>{" "}
              <Badge variant="solid" color="warning" endIcon={<PlusIcon />}>
                {/* @ts-ignore */}<Trans>Warning</Trans></Badge>{" "}
              <Badge variant="solid" color="info" endIcon={<PlusIcon />}>
                {/* @ts-ignore */}<Trans>Info</Trans></Badge>
              <Badge variant="solid" color="light" endIcon={<PlusIcon />}>
                {/* @ts-ignore */}<Trans>Light</Trans></Badge>
              <Badge variant="solid" color="dark" endIcon={<PlusIcon />}>
                {/* @ts-ignore */}<Trans>Dark</Trans></Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
