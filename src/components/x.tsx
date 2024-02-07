import { cn } from "@/lib/utils";

const X = ({ className }: { className?: string }) => {
  return (
    <div className={cn("absolute inset-0", className)}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-[90%] bg-foreground rotate-45" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-[90%] bg-foreground -rotate-45" />
    </div>
  );
};

export default X;
