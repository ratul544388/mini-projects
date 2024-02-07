"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";

interface KeyboardProps {
  word: string;
  onChange: (value: string) => void;
  pressedKeys: string[];
}

export const Keyboard = ({ onChange, word, pressedKeys }: KeyboardProps) => {
  const keys = useMemo(() => {
    return [
      "Q",
      "W",
      "E",
      "R",
      "T",
      "Y",
      "U",
      "I",
      "O",
      "P",
      "A",
      "S",
      "D",
      "F",
      "G",
      "H",
      "J",
      "K",
      "L",
      "Z",
      "X",
      "C",
      "V",
      "B",
      "N",
      "M",
    ];
  }, []);

  const isWrong = (key: string) => {
    return !word.includes(key) && pressedKeys.includes(key);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;
      if (!keys.includes(key.toUpperCase())) return;

      onChange(key.toUpperCase());
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onChange, keys]);

  return (
    <div className="grid grid-cols-20 gap-y-2">
      {keys.map((key) => (
        <Button
          onClick={() => onChange(key)}
          variant={
            isWrong(key)
              ? "destructive"
              : pressedKeys.includes(key)
              ? "default"
              : "ghost"
          }
          size="icon"
          disabled={pressedKeys.includes(key)}
          className={cn(
            "text-2xl col-span-2 disabled",
            key === "A" && "col-span-3 ml-auto",
            key === "L" && "col-span-3 mr-auto",
            key === "Z" && "col-span-5 ml-auto",
            key === "M" && "col-span-5 mr-auto"
          )}
          key={key}
        >
          {key}
        </Button>
      ))}
    </div>
  );
};
