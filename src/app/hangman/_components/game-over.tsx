"use client";
interface GameOverProps {}

export const GameOver = ({}: GameOverProps) => {
  return (
    <div className="absolute bottom-0 z-20 flex flex-col items-center w-full gap-3 pt-10 translate-y-1/2 rounded-full bg-primary aspect-square">
      <h3 className="text-3xl font-bold text-white">You Servived</h3>
    </div>
  );
};
