"use client";

import { useModal } from "@/hooks/use-modal-store";
import { motion, useAnimation } from "framer-motion";
import { X } from "lucide-react";
import { ReactNode, useEffect } from "react";
import { Button } from "../ui/button";

interface ModalProps {
  open: boolean;
  children: ReactNode;
  title: string;
  description?: string;
  disabled?: boolean;
}

export const Modal = ({
  children,
  title,
  description,
  open,
  disabled,
}: ModalProps) => {
  const { onClose } = useModal();

  const animation = useAnimation();
  useEffect(() => {
    if (open) {
      animation.start("visible");
    } else {
      animation.start("hidden");
    }
  }, [open, animation]);

  const handleClose = () => {
    if (disabled) return;
    onClose();
    animation.start("hidden");
  };

  return (
    <motion.div
      onClick={handleClose}
      variants={{
        hidden: {
          display: "none",
          opacity: 0,
          transition: {
            delay: 0.1,
          },
        },
        visible: { display: "flex", opacity: 1 },
      }}
      transition={{
        duration: 0.15,
      }}
      initial="hidden"
      animate={animation}
      className="fixed flex items-center justify-center inset-0 z-50 bg-neutral-900/80 backdrop-blur-sm"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        variants={{
          hidden: { y: 200, scale: 0.5 },
          visible: { y: 0, scale: 1 },
        }}
        transition={{
          type: "tween",
          duration: 0.15,
        }}
        initial="hidden"
        animate={animation}
        className="relative bg-background border rounded-lg w-full max-w-[500px]"
      >
        <Button
          onClick={handleClose}
          disabled={disabled}
          className="absolute right-3 top-3 z-50 ring-[1.5px] ring-primary h-7 w-7"
          variant="outline"
          size="icon"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </Button>
        <div className="max-h-[90vh]">
          <div className="p-5">
            <h1 className="font-semibold text-xl">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
            <div className="mt-5">{children}</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
