"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { countryData } from "./config";
import { motion, useAnimation } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { RefreshCcw } from "lucide-react";

const CountrycityPage = () => {
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [pair, setPair] = useState<string[]>([]);
  const [wrongPair, setWrongPair] = useState<string[]>([]);
  const [mount, setMount] = useState(false);
  const animation = useAnimation();

  const generateRandomIndexes = ({
    max,
    min,
  }: {
    max: number;
    min: number;
  }) => {
    const numbers = [];
    for (let i = 0; i < max; i++) {
      numbers.push(i);
    }

    for (let i = numbers.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * i);
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    return numbers.slice(0, min);
  };

  const getGameData = () => {
    let array: string[] = [];
    let randomIndexes = generateRandomIndexes({
      max: countryData.length,
      min: 8,
    });
    const objects = countryData.filter((_, index) => {
      return randomIndexes.includes(index);
    });

    objects.map((obj) => {
      array.push(obj.country);
      array.push(obj.city);
    });

    randomIndexes = generateRandomIndexes({
      max: array.length,
      min: array.length,
    });

    array = randomIndexes.map((index) => {
      return array[index];
    });

    return { objects, array };
  };

  const [data, setData] = useState(getGameData());

  const isCorrect = useCallback(() => {
    if (pair.length !== 2) return false;
    return data.objects.some((o) => {
      return pair.includes(o.country) && pair.includes(o.city);
    });
  }, [data.objects, pair]);

  useEffect(() => {
    if (!mount) setMount(true);
    if (pair.length !== 2) return;
    setTimeout(() => {
      if (isCorrect()) {
        setData((prev) => ({
          ...prev,
          array: data.array.filter((item) => !pair.includes(item)),
        }));
        setCorrect(correct + 1);
      } else {
        setWrong(wrong + 1);
        setWrongPair((prev) => [...prev, ...pair]);
      }
      setPair([]);
    }, 300);
  }, [pair, isCorrect, mount, data.array, correct, wrong]);

  useEffect(() => {
    if (data && !data.array.length) {
      animation.start("gameOver");
    }
  }, [data, animation]);

  const handleClick = (item: string) => {
    if (pair[0] === item) {
      return setPair([]);
    }
    if (wrongPair.includes(item)) {
      setWrongPair((prev) => prev.filter((p) => p !== item));
    }
    setPair((prev) => [...prev, item]);
  };

  const handleReset = () => {
    setData(getGameData());
    setCorrect(0);
    setWrong(0);
    setWrongPair([]);
    animation.start("reset");
  };

  function calculateAccuracy() {
    const totalAnswers = correct + wrong;
    const accuracy = (correct / totalAnswers) * 100;
    return accuracy.toFixed(2) + "%";
  }

  if (!mount) {
    return null;
  }

  return (
    <div className="flex flex-col gap-8 items-center sm:px-5 px-10 pt-28">
      <motion.div
        variants={{
          reset: { y: 0, scale: 1 },
          gameOver: { y: 200, scale: 1.5 },
        }}
        transition={{ duration: 0.5 }}
        initial="reset"
        animate={animation}
        className="flex flex-col gap-5"
      >
        <section className="flex items-center gap-5">
          <p className="font-semibold text-lg text-muted-foreground">
            Correct: <span className="text-green-500 font-bold">{correct}</span>
          </p>
          <Separator orientation="vertical" className="h-8" />
          <p className="font-semibold text-lg text-muted-foreground">
            Wrong: <span className="text-red-500 font-bold">{wrong}</span>
          </p>
        </section>
        <motion.div
          variants={{
            reset: { display: "none", y: -50, opacity: 0 },
            gameOver: {
              display: "block",
              y: 0,
              opacity: 1,
              transition: { delay: 0.5 },
            },
          }}
          transition={{ type: "tween" }}
          initial="reset"
          animate={animation}
        >
          <div className="flex flex-col gap-5">
            <p className="font-semibold text-xl text-muted-foreground">
              accuracy:{" "}
              <span className="text-blue-500">{calculateAccuracy()}</span>
            </p>
            <Button size="sm" onClick={handleReset} className="w-full">
              Play Again
            </Button>
          </div>
        </motion.div>
      </motion.div>
      <section className="flex flex-wrap justify-center gap-3">
        {data.array.map((item) => (
          <Button
            onClick={() => handleClick(item)}
            variant="outline"
            key={item}
            className={cn(
              pair.includes(item) && "ring-[2px] ring-primary",
              isCorrect() && pair.includes(item) && "ring-[2px] ring-green-500",
              wrongPair.includes(item) && "ring-[2px] ring-red-500"
            )}
          >
            {item}
          </Button>
        ))}
      </section>
      <Button
        className="fixed top-2 right-2"
        onClick={handleReset}
        variant="destructive"
      >
        Reset
        <RefreshCcw className="h-4 w-4 ml-2" />{" "}
      </Button>
    </div>
  );
};

export default CountrycityPage;
