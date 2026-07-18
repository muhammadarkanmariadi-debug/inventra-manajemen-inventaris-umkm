"use client";
import React from "react";
import ComponentCard from "../../common/ComponentCard";

import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import { useModal } from "@/hooks/useModal";
import { Trans } from "@lingui/macro";

export default function DefaultModal() {
  const { isOpen, openModal, closeModal } = useModal();
  const handleSave = () => {

    closeModal();
  };
  return (
    <div>
      <ComponentCard title="Default Modal">
        <Button size="sm" onClick={openModal}>
          {/* @ts-ignore */}<Trans>Open Modal</Trans></Button>
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          className="max-w-[600px] p-5 lg:p-10"
        >
          <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
            {/* @ts-ignore */}<Trans>Modal Heading</Trans></h4>
          <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
            {/* @ts-ignore */}<Trans>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                  Pellentesque euismod est quis mauris lacinia pharetra. Sed a ligula
                                  ac odio condimentum aliquet a nec nulla. Aliquam bibendum ex sit
                                  amet ipsum rutrum feugiat ultrices enim quam.</Trans></p>
          <p className="mt-5 text-sm leading-6 text-gray-500 dark:text-gray-400">
            {/* @ts-ignore */}<Trans>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                  Pellentesque euismod est quis mauris lacinia pharetra. Sed a ligula
                                  ac odio.</Trans></p>
          <div className="flex items-center justify-end w-full gap-3 mt-8">
            <Button size="sm" variant="outline" onClick={closeModal}>
              {/* @ts-ignore */}<Trans>Close</Trans></Button>
            <Button size="sm" onClick={handleSave}>
              {/* @ts-ignore */}<Trans>Save Changes</Trans></Button>
          </div>
        </Modal>
      </ComponentCard>
    </div>
  );
}
