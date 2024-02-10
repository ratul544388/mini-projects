"use client";
import { cn } from "@/lib/utils";
import { motion, useAnimation } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { IconType } from "react-icons";
interface DropdownMenuProps {
  items: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon | IconType;
    destructive?: boolean;
  }[];
  trigger: ReactNode;
}

export const DropdownMenu = ({
  items,
  trigger,
}: DropdownMenuProps) => {
  const animation = useAnimation();
  return (
    <>
      <div className="relative w-fit">
        <div onClick={() => animation.start("visible")}>{trigger}</div>
        <motion.div
          variants={{
            hidden: {
              height: 0,
              opacity: 0,
              pointerEvents: "none",
            },
            visible: {
              height: "auto",
              opacity: 1,
              pointerEvents: "auto",
            },
          }}
          initial="hidden"
          animate={animation}
          className="absolute overflow-hidden bg-background  border rounded-md z-[60] right-0 top-[110%]"
        >
          {items.map(({ label, onClick, icon: Icon, destructive }) => (
            <div
              role="button"
              onClick={() => {
                animation.start("hidden");
                onClick();
              }}
              key={label}
              className={cn(
                "flex font-semibold min-w-[140px] whitespace-nowrap text-foreground/70 items-center gap-2 px-4 py-1.5 hover:bg-accent",
                destructive && "bg-red-500/10 text-red-600 hover:bg-red-500/20"
              )}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {label}
            </div>
          ))}
        </motion.div>
      </div>
      <motion.div
        onClick={() => animation.start("hidden")}
        variants={{
          hidden: { display: "none" },
          visible: { display: "block" },
        }}
        initial="hidden"
        animate={animation}
        className="fixed inset-0 z-50"
      />
    </>
  );
};
