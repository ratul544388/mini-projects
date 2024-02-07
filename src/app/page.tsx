"use client";
import O from "@/components/o";
import X from "@/components/x";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function Home() {
  const confetti = useConfettiStore();
  const [currentTurn, setCurrentTurn] = useState<"X" | "O">("X");
  const [status, setStatus] = useState<"X_WON" | "O_WON" | "DRAW">();
  type ItemType = "X" | "O";
  const [filledItems, setFilledItems] = useState<ItemType[]>(
    Array(9).fill(undefined)
  );

  const winConditions = useMemo(() => {
    return [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
  }, []);

  useEffect(() => {
    const hasWinner = winConditions.some((condition) => {
      return (
        condition.every((item) => {
          return filledItems[item] === "X";
        }) ||
        condition.every((item) => {
          return filledItems[item] === "O";
        })
      );
    });

    console.log(hasWinner);

    const isDraw = filledItems.every((item) => {
      return item === "X" || item === "O";
    });

    if (hasWinner) {
      if (currentTurn === "X") {
        setStatus("X_WON");
      } else {
        setStatus("O_WON");
      }
      return confetti.onOpen();
    } else if (isDraw) {
      setStatus("DRAW");
    } else {
      currentTurn === "X" ? setCurrentTurn("O") : setCurrentTurn("X");
    }
  }, [filledItems, confetti, currentTurn, winConditions]);

  const handleClick = (index: number) => {
    if (filledItems[index]) return;
    const updatedItems = [...filledItems];
    updatedItems[index] = currentTurn;
    setFilledItems(updatedItems);
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div
        className={cn(
          "relative grid grid-cols-3",
          status && "pointer-events-none"
        )}
      >
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            onClick={() => handleClick(index)}
            key={index}
            className={cn(
              "border-2 border-neutral-600 relative group h-20 w-20 flex items-center justify-center",
              index <= 2 && "border-t-0",
              index >= 6 && "border-b-0",
              index % 3 === 0 && "border-l-0",
              index % 3 === 2 && "border-r-0",
              filledItems[index] && "cursor-not-allowed"
            )}
          >
            <X
              className={cn(
                "opacity-0",
                filledItems[index] === "X" && "opacity-100",
                currentTurn === "X" &&
                  !filledItems[index] &&
                  "group-hover:opacity-30"
              )}
            />
            <O
              className={cn(
                "opacity-0",
                filledItems[index] === "O" && "opacity-100",
                currentTurn === "O" &&
                  !filledItems[index] &&
                  "group-hover:opacity-30"
              )}
            />
          </div>
        ))}
        <div
          className={cn(
            "w-0 h-2.5 bg-red-500 absolute top-1/2 -translate-y-1/2 left-0 rotate-45 transition duration-1000",
            status && "w-full"
          )}
        />
      </div>
    </main>
  );
}
