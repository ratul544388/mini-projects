"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

type TurnType = "X" | "O";

const Page = () => {
  const animation = useAnimation();
  const [turn, setTurn] = useState<TurnType>("X");
  const [winner, setWinner] = useState<TurnType | "Draw">();
  const initialBoxes: (TurnType | undefined)[] = Array(9).fill(undefined);
  const [filledBox, setFilledBox] = useState(initialBoxes);
  const [lineIndex, setLineIndex] = useState<number>();

  const handleClick = (index: number) => {
    if (filledBox[index] || winner) return;
    setTurn(turn === "X" ? "O" : "X");
    setFilledBox((prev) => {
      const newFilledBox = [...prev];
      newFilledBox[index] = turn;
      return newFilledBox;
    });
  };

  useEffect(() => {
    const winCondition = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    winCondition.some((condition, index) => {
      if (condition.every((item) => filledBox[item] === "X")) {
        setWinner("X");
        setLineIndex(index);
      } else if (condition.every((item) => filledBox[item] === "O")) {
        setWinner("O");
        setLineIndex(index);
      }
    });

    if (!winner && filledBox.every((item) => item)) {
      setWinner("Draw");
    }
  }, [turn, filledBox, winner]);

  useEffect(() => {
    if (winner && winner !== "Draw" && lineIndex) {
      if ([0, 1, 2].includes(lineIndex)) {
        animation.start("animateWidth");
      } else {
        animation.start("animateHeight");
      }
      animation.start("buttonAnimation");
    }
  }, [animation, winner, lineIndex]);

  const handleReset = () => {
    setFilledBox(initialBoxes);
    setWinner(undefined);
    setTurn("X");
    animation.start("initial");
  };

  return (
    <div className="h-full flex flex-col gap-10 items-center justify-center">
      <div className="relative overflow-hidden grid grid-cols-3">
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            onClick={() => handleClick(index)}
            key={index}
            className={cn(
              "relative cursor-pointer group grid place-items-center border-[2px] border-neutral-700 h-[100px] w-[100px]",
              [0, 1, 2].includes(index) && "border-t-0",
              [0, 3, 6].includes(index) && "border-l-0",
              [6, 7, 8].includes(index) && "border-b-0",
              [2, 5, 8].includes(index) && "border-r-0",
              (filledBox[index] || winner) && "hover:cursor-not-allowed"
            )}
          >
            <X
              className={cn(
                "hidden transition-colors",
                turn === "X" &&
                  !filledBox[index] &&
                  !winner &&
                  "group-hover:block group-hover:bg-neutral-300",
                filledBox[index] === "X" && "block bg-neutral-800"
              )}
            />
            <O
              className={cn(
                "hidden transition-colors",
                turn === "O" &&
                  !filledBox[index] &&
                  !winner &&
                  "group-hover:block group-hover:border-neutral-300",
                filledBox[index] === "O" && "block border-neutral-800"
              )}
            />
          </div>
        ))}
        <motion.span
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-[400px] bg-red-500/80",
            lineIndex === 0 && "w-full h-1.5 top-[16.2%]",
            lineIndex === 1 && "w-full h-1.5 top-1/2 -translate-y-1/2",
            lineIndex === 2 && "w-full h-1.5 top-[83.5%]",
            lineIndex === 3 && "h-full w-1.5 left-[16.2%]",
            lineIndex === 5 && "h-full w-1.5 left-[83.5%]",
            lineIndex === 6 && "-rotate-45",
            lineIndex === 7 && "rotate-45"
          )}
          variants={{
            initial: { height: 0, width: 0 },
            animateWidth: { width: 400, height: 6 },
            animateHeight: { height: 400, width: 6 },
          }}
          initial="initial"
          animate={animation}
        />
      </div>
      <h1 className="font-bold text-5xl">
        {winner === "X"
          ? "X Won"
          : winner === "O"
          ? "O Won"
          : winner === "Draw"
          ? "Draw"
          : `${turn} Turn`}
      </h1>
      <motion.div
        variants={{
          initial: { pointerEvents: "none", opacity: 0, y: -30 },
          buttonAnimation: { pointerEvents: "auto", opacity: 100, y: 0 },
        }}
        initial="initial"
        animate={animation}
      >
        <Button onClick={handleReset}>Reset</Button>
      </motion.div>
    </div>
  );
};

const X = ({ className }: { className?: string }) => {
  return (
    <>
      <span
        className={cn(
          "h-16 w-2.5 bg-neutral-700 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45",
          className
        )}
      />
      <span
        className={cn(
          "h-16 w-2.5 bg-neutral-700 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45",
          className
        )}
      />
    </>
  );
};

const O = ({ className }: { className?: string }) => {
  return (
    <span
      className={cn(
        "h-16 w-16 rounded-full border-[10px] border-neutral-700 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        className
      )}
    />
  );
};

export default Page;
