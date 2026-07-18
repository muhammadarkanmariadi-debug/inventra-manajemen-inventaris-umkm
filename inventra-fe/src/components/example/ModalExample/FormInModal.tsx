"use client";
import React from "react";
import ComponentCard from "../../common/ComponentCard";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import { useModal } from "@/hooks/useModal";
import { Trans } from "@lingui/macro";

export default function FormInModal() {
  const { isOpen, openModal, closeModal } = useModal();
  const handleSave = () => {
    // Handle save logic here
    closeModal();
  };
  return (
    <ComponentCard title="Form In Modal">
      <Button size="sm" onClick={openModal}>
        {/* @ts-ignore */}<Trans>Open Modal</Trans></Button>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[584px] p-5 lg:p-10"
      >
        <form className="">
          <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
            {/* @ts-ignore */}<Trans>Personal Information</Trans></h4>

          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <div className="col-span-1">
              <Label>{/* @ts-ignore */}<Trans>First Name</Trans></Label>
              <Input type="text" placeholder="Emirhan" />
            </div>

            <div className="col-span-1">
              <Label>{/* @ts-ignore */}<Trans>Last Name</Trans></Label>
              <Input type="text" placeholder="Boruch" />
            </div>

            <div className="col-span-1">
              <Label>{/* @ts-ignore */}<Trans>Last Name</Trans></Label>
              <Input type="email" placeholder="emirhanboruch55@gmail.com" />
            </div>

            <div className="col-span-1">
              <Label>{/* @ts-ignore */}<Trans>Phone</Trans></Label>
              <Input type="text" placeholder="+09 363 398 46" />
            </div>

            <div className="col-span-1 sm:col-span-2">
              <Label>{/* @ts-ignore */}<Trans>Bio</Trans></Label>
              <Input type="text" placeholder="Team Manager" />
            </div>
          </div>

          <div className="flex items-center justify-end w-full gap-3 mt-6">
            <Button size="sm" variant="outline" onClick={closeModal}>
              {/* @ts-ignore */}<Trans>Close</Trans></Button>
            <Button size="sm" onClick={handleSave}>
              {/* @ts-ignore */}<Trans>Save Changes</Trans></Button>
          </div>
        </form>
      </Modal>
    </ComponentCard>
  );
}
