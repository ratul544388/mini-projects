"use client";

import { words } from "@/constants";
import { Keyboard } from "./_components/keyboard";
import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Drawing } from "./_components/drawing";
import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { AnimatePresence, animate, motion, useAnimation } from "framer-motion";

const HangmanPage = () => {
  const animation = useAnimation();
  const generateRandomWord = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  }, []);

  const { onOpen } = useConfettiStore();
  const [isMount, setIsMount] = useState(false);
  const [word, setWord] = useState(generateRandomWord());
  const [result, setResult] = useState<"WIN" | "LOSE">();
  const [pressedKeys, setPressedKeys] = useState<string[]>([]);
  const [chance, setChance] = useState(0);

  useEffect(() => {
    generateRandomWord();
    setIsMount(true);
  }, [generateRandomWord]);

  const onKeyPress = (key: string) => {
    setPressedKeys((prev) => [...prev, key]);
    if (!word.includes(key)) {
      setChance(chance + 1);
    }
  };

  useEffect(() => {
    if (!pressedKeys.length) return;
    const isWin = word.split("").every((char) => {
      return pressedKeys.includes(char);
    });
    if (isWin) {
      onOpen();
      animation.start("visible");
      return setResult("WIN");
    } else {
      if (chance === 6) {
        animation.start("visible");
        return setResult("LOSE");
      }
    }
  }, [pressedKeys, word, chance, onOpen, animation]);

  const onReset = () => {
    animation.start("hidden");
    setResult(undefined);
    setWord(generateRandomWord);
    setChance(0);
    setPressedKeys([]);
  };

  if (!isMount) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-5">
      <Drawing chance={chance} />
      <div className="flex gap-1 text-3xl font-bold text-gray-700">
        {word.split("").map((char, index) => (
          <div key={index} className="flex flex-col items-center min-w-[24px]">
            <h3
              className={cn(
                "opacity-0",
                pressedKeys.includes(char) && "opacity-100"
              )}
            >
              {char}
            </h3>
            <span className="w-full h-1 bg-primary" />
          </div>
        ))}
      </div>
      <Keyboard
        word={word}
        onChange={(key) => onKeyPress(key)}
        pressedKeys={pressedKeys}
      />
      <AnimatePresence>
        <motion.div
          variants={{
            hidden: { opacity: 0, pointerEvents: "none" },
            visible: { opacity: 1, pointerEvents: "auto" },
          }}
          initial="hidden"
          animate={animation}
          exit="hidden"
          transition={{ duration: 0.4 }}
          className="fixed inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm"
        >
          <motion.div
            variants={{
              hidden: { y: 300, scale: 0.1 },
              visible: { y: 0, scale: 1 },
            }}
            initial="hidden"
            animate={animation}
            exit="hidden"
            transition={{ duration: 0.4 }}
            className="w-full flex flex-col items-center gap-8 max-w-[450px] p-6 rounded-lg border shadow-lg bg-background"
          >
            <h3 className="text-2xl font-bold">
              Game Over -
              <span
                className={cn(
                  "text-primary",
                  result === "LOSE" && "text-red-500"
                )}
              >
                {result === "WIN" ? "You Servived!" : "You Lost!"}
              </span>
            </h3>
            <Button onClick={onReset}>Play again</Button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default HangmanPage;
