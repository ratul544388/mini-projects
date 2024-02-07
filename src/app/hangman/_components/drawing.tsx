"use client";
interface DrawingProps {
  chance: number;
}

export const Drawing = ({ chance }: DrawingProps) => {
  return (
    <div className="relative w-[220px] h-[270px] overflow-hidden">
      <span className="absolute bottom-0 w-full h-2 rounded-full bg-foreground" />
      <span className="absolute w-2 h-full rounded-full left-9 bg-foreground" />
      <span className="absolute inset-x-0 h-2 rounded-full left-9 bg-foreground" />
      <span className="absolute w-32 h-1.5 left-5 rotate-[-45deg] top-0 bg-foreground" />
      <span className="absolute top-0 w-2 h-10 left-[60%] -translate-x-1/2 bg-foreground" />
      {/* head below */}
      {chance >= 1 && (
        <span className="absolute h-14 w-14 border-[8px] -translate-x-1/2 rounded-full border-foreground top-10 left-[60%]" />
      )}

      {chance >= 2 && (
        <span className="absolute h-[70px] w-2 bg-foreground top-24 left-[60%] -translate-x-1/2 rounded-b-full" />
      )}

      {chance >= 3 && (
        <span className="absolute w-12 origin-top-left rotate-45 rounded-full h-2 bg-foreground top-24 left-[60%]" />
      )}
      {chance >= 4 && (
        <span className="absolute w-12 origin-top-left rotate-[135deg] rounded-full h-2 bg-foreground top-[102px] left-[62%]" />
      )}

      {chance >= 5 && (
        <span className="absolute w-12 origin-top-left rotate-45 rounded-full h-2 bg-foreground top-[154px] left-[60%]" />
      )}
      {chance >= 6 && (
        <span className="absolute w-12 origin-top-left rotate-[135deg] rounded-full h-2 bg-foreground top-[160px] left-[62%]" />
      )}
    </div>
  );
};
