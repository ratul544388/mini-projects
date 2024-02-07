import { cn } from "@/lib/utils";

const O = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "w-[90%] h-[90%] rounded-full border-[12px] border-foreground",
        className
      )}
    />
  );
};

export default O;
