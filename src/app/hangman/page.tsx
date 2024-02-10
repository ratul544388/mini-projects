"use client";

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { Drawing } from "./_components/drawing";
import { Keyboard } from "./_components/keyboard";
import { data } from "./config";

const HangmanPage = () => {
  const animation = useAnimation();

  const generateRandomWord = useCallback(() => {
    const randomCategoryIndex = Math.floor(Math.random() * data.length);
    const category = data[randomCategoryIndex];
    const randomWordIndex = Math.floor(Math.random() * category.words.length);
    const word = data[randomCategoryIndex].words[randomWordIndex].toUpperCase();
    return { category: category.category, word };
  }, []);

  const { onOpen } = useConfettiStore();
  const [isMount, setIsMount] = useState(false);
  const [word, setWord] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [result, setResult] = useState<"WIN" | "LOSE">();
  const [pressedKeys, setPressedKeys] = useState<string[]>([]);
  const [chance, setChance] = useState(0);

  useEffect(() => {
    const { category, word } = generateRandomWord();
    setWord(word);
    setCategory(category);
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
    const { word, category } = generateRandomWord();
    animation.start("hidden");
    setResult(undefined);
    setWord(word);
    setCategory(category);
    setChance(0);
    setPressedKeys([]);
  };

  if (!isMount) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-5">
      <p className="font-semibold text-xl text-muted-foreground">
        Guess{" "}
        {["A", "E", "O", "I", "U"].includes(category.charAt(0)) ? "an " : "a "}
        <span className="text-primary">{category}</span> name
      </p>
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
            <p className="font-medium">
              Correct word was: <span className="text-primary">{word}</span>
            </p>
            <Button onClick={onReset}>Play again</Button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default HangmanPage;
