"use client";
import React from "react";
import ComponentCard from "../../common/ComponentCard";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import { useModal } from "@/hooks/useModal";
import { Trans } from "@lingui/macro";

export default function VerticallyCenteredModal() {
  const { isOpen, openModal, closeModal } = useModal();
  const handleSave = () => {
    // Handle save logic here
    closeModal();
  };
  return (
    <ComponentCard title="Vertically Centered Modal">
      <Button size="sm" onClick={openModal}>
        {/* @ts-ignore */}<Trans>Open Modal</Trans></Button>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        showCloseButton={false}
        className="max-w-[507px] p-6 lg:p-10"
      >
        <div className="text-center">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-title-sm">
            {/* @ts-ignore */}<Trans>All Done! Success Confirmed</Trans></h4>
          <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
            {/* @ts-ignore */}<Trans>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                  Pellentesque euismod est quis mauris lacinia pharetra.</Trans></p>

          <div className="flex items-center justify-center w-full gap-3 mt-8">
            <Button size="sm" variant="outline" onClick={closeModal}>
              {/* @ts-ignore */}<Trans>Close</Trans></Button>
            <Button size="sm" onClick={handleSave}>
              {/* @ts-ignore */}<Trans>Save Changes</Trans></Button>
          </div>
        </div>
      </Modal>
    </ComponentCard>
  );
}
