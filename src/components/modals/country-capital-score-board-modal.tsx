"use client";

import { useModal } from "@/hooks/use-modal-store";
import { Modal } from "./modal";
import { cn } from "@/lib/utils";

export const CountryCapitalScoreBoardModal = () => {
  const { isOpen, type, data } = useModal();

  const open = isOpen && type === "countryCapitalScoreBoardModal";
  return (
    <Modal open={open} title="Score Board">
      <div className="space-y-3">
        {data.countryCapitalScoreBoard?.map(({ country, capital }, index) => (
          <div key={country.name} className="flex items-center gap-3">
            <div className="bg-blue-500 h-6 w-6 rounded-full text-white flex items-center justify-center text-sm font-bold">
              {index + 1}
            </div>
            <div
              className={cn(
                "bg-green-500 text-white py-1.5 px-3 rounded-md text-sm font-medium",
                !country.isCorrect && "bg-red-500"
              )}
            >
              {country.name}
            </div>
            <div
              className={cn(
                "bg-green-500 text-white py-1.5 px-3 rounded-md text-sm font-medium",
                !capital.isCorrect && "bg-destructive"
              )}
            >
              {capital.name}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};
