import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onClose,
}) => {
  // Accessibility: Close the modal when the "Escape" key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      // Optional: Prevent background scrolling while modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    // Fixed screen overlay with backdrop blur
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      {/* Modal Container: Prevents click propagation so clicking the box doesn't close it */}
      <div
        className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-center shadow-xl transition-all scale-100 ease-out duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <h3 className="text-xl font-semibold leading-6 text-gray-900">
          {title}
        </h3>

        {/* Body Message */}
        <div className="mt-3">
          <p className="text-sm text-gray-500">{message}</p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            type="button"
            className="w-full sm:w-auto inline-flex justify-center rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-200 transition-colors cursor-pointer"
            onClick={onClose}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="w-full sm:w-auto inline-flex justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors cursor-pointer shadow-sm"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
