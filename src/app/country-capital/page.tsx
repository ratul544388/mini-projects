"use client";

import { DropdownMenu } from "@/components/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";
import { motion, useAnimation } from "framer-motion";
import { MenuIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { GiCycle } from "react-icons/gi";
import { SiLevelsdotfyi } from "react-icons/si";
import { countryData } from "./config";

export type ScoreBoardType = {
  country: {
    name: string;
    isCorrect: boolean;
  };
  capital: {
    name: string;
    isCorrect: boolean;
  };
};

type GameDataType = {
  objects: {
    country: string;
    capital: string;
  }[];
  array: string[];
};

export type GameLevelType = {
  title: string;
  description: string;
  totalCountries: number;
  pickedCountries: number;
};

const CountrycapitalPage = () => {
  const { onOpen } = useModal();
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [pair, setPair] = useState<string[]>([]);
  const [mount, setMount] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const animation = useAnimation();
  const [scoreBoard, setScoreBoard] = useState<ScoreBoardType[]>([]);
  const [data, setData] = useState<GameDataType | null>(null);
  const [level, setLevel] = useState<GameLevelType>();

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

  const getGameData = useCallback(
    ({
      totalCountries,
      pickedCountries,
    }: { totalCountries?: number; pickedCountries?: number } = {}) => {
      let array: string[] = [];
      let randomIndexes = generateRandomIndexes({
        max: totalCountries || 60,
        min: pickedCountries || 6,
      });
      const objects = countryData.filter((_, index) => {
        return randomIndexes.includes(index);
      });

      objects.map((obj) => {
        array.push(obj.country);
        array.push(obj.capital);
      });

      randomIndexes = generateRandomIndexes({
        max: array.length,
        min: array.length,
      });

      array = randomIndexes.map((index) => {
        return array[index];
      });

      return { objects, array };
    },
    []
  );

  useEffect(() => {
    const localData: GameLevelType = JSON.parse(
      localStorage.getItem("countryCapitalLevel") as string
    );
    setData(
      getGameData({
        totalCountries: localData?.totalCountries,
        pickedCountries: localData?.pickedCountries,
      })
    );
    setLevel(localData);
  }, [getGameData]);

  const isCorrect = useCallback(() => {
    if (pair.length !== 2) return false;
    return data?.objects.some((o) => {
      return pair.includes(o.country) && pair.includes(o.capital);
    });
  }, [data?.objects, pair]);

  useEffect(() => {
    if (!mount) setMount(true);
    if (pair.length !== 2) return;
    const correctObj = data?.objects.find((obj) => {
      return pair[0] === obj.country || pair[0] === obj.capital;
    });
    if (!correctObj) return;

    setScoreBoard((prev) => {
      return [
        ...prev,
        {
          country: {
            name: correctObj.country,
            isCorrect: pair.includes(correctObj.country),
          },
          capital: {
            name: correctObj.capital,
            isCorrect: pair.includes(correctObj.capital),
          },
        },
      ];
    });

    const timeout = setTimeout(() => {
      if (isCorrect()) {
        setCorrect(correct + 1);
      } else {
        setWrong(wrong + 1);
      }
      setData((prev) => ({
        ...prev!,
        array: prev!.array.filter((item) => {
          return item !== correctObj.country && item !== correctObj.capital;
        }),
      }));
      setPair([]);
    }, 300);

    return () => clearTimeout(timeout);
  }, [pair, isCorrect, mount, data, correct, wrong]);

  useEffect(() => {
    if (data && !data.array.length) {
      animation.start("gameOver");
      setAccuracy((correct / (correct + wrong)) * 100);
    }
  }, [data, animation, wrong, correct]);

  const handleClick = (item: string) => {
    if (pair[0] === item) {
      return setPair([]);
    }
    setPair((prev) => [...prev, item]);
  };

  const handleReset = () => {
    setData(getGameData());
    setCorrect(0);
    setWrong(0);
    animation.start("reset");
    setScoreBoard([]);
  };

  const menuTrigger = (
    <Button variant="outline" size="icon" className="focus:ring-1 focus:ring-primary">
      <MenuIcon />
    </Button>
  );

  if (!mount) {
    return null;
  }

  return (
    <div className="h-full flex flex-col justify-center gap-8 items-center sm:px-5 px-10 pb-20">
      <motion.div
        variants={{
          reset: { scale: 1 },
          gameOver: { scale: 1.5 },
        }}
        initial="reset"
        animate={animation}
        className="flex flex-col items-center gap-5"
      >
        <div className="flex items-center gap-3">
          <p className="font-semibold text-lg text-muted-foreground">
            Correct: <span className="text-green-500 font-bold">{correct}</span>
          </p>
          <Separator orientation="vertical" className="h-8" />
          <p className="font-semibold text-lg text-muted-foreground">
            Wrong: <span className="text-red-500 font-bold">{wrong}</span>
          </p>
        </div>
        <motion.div
          variants={{
            reset: { display: "none", scale: 0.2, opacity: 0 },
            gameOver: {
              display: "block",
              scale: 1,
              opacity: 1,
            },
          }}
          transition={{ type: "tween" }}
          initial="reset"
          animate={animation}
          className="space-y-5"
        >
          <Button
            onClick={() =>
              onOpen("countryCapitalScoreBoardModal", {
                countryCapitalScoreBoard: scoreBoard,
              })
            }
            size="sm"
            variant="outline"
            className="w-full"
          >
            Score Board 🏁
          </Button>
          <p className="font-semibold text-2xl text-muted-foreground">
            Accuracy:{" "}
            <span
              className={cn(
                "text-green-500 font-bold",
                accuracy < 50 && "text-red-500"
              )}
            >
              {accuracy.toFixed(2)}%
            </span>
          </p>
          <Button size="sm" onClick={handleReset} className="w-full">
            Play Again
          </Button>
        </motion.div>
      </motion.div>
      <section className="flex flex-wrap justify-center gap-3">
        {data?.array.map((item) => (
          <Button
            onClick={() => handleClick(item)}
            variant="outline"
            key={item}
            className={cn(
              pair.includes(item) && "ring-[2px] ring-primary",
              isCorrect() && pair.includes(item) && "ring-[2px] ring-green-500",
              !isCorrect() &&
                pair.length === 2 &&
                pair.includes(item) &&
                "ring-[2px] ring-red-500"
            )}
          >
            {item}
          </Button>
        ))}
      </section>
      <div className="absolute top-4 right-4">
        <DropdownMenu
          trigger={menuTrigger}
          items={[
            {
              label: "Level",
              icon: SiLevelsdotfyi,
              onClick: () => onOpen("countryCapitalLavelModal"),
            },
            {
              label: "Reset",
              icon: GiCycle,
              onClick: () => handleReset(),
              destructive: true,
            },
          ]}
        />
      </div>
      <Button
        className="absolute top-4 left-1/2 -translate-x-1/2 text-primary ring-1 ring-pirmary"
        variant="outline"
        size="sm"
        onClick={() => onOpen("countryCapitalLavelModal")}
      >
        {level?.title || "Easy"}
      </Button>
    </div>
  );
};

export default CountrycapitalPage;
