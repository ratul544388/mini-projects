"use client";

import { Modal } from "./modal";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import { useModal } from "@/hooks/use-modal-store";
import { GameLevelType } from "@/app/country-capital/page";

export const CountryCapitalLevelModal = () => {
  const { isOpen, type, onClose } = useModal();

  const open = isOpen && type === "countryCapitalLavelModal";

  const levels: GameLevelType[] = [
    {
      title: "Easy",
      description: "Easy: (30 Popular + 5 Total)",
      totalCountries: 30,
      pickedCountries: 5,
    },
    {
      title: "Medium",
      description: "Medium: (50 Popular + 6 Total)",
      totalCountries: 50,
      pickedCountries: 6,
    },
    {
      title: "Hard",
      description: "Hard (80 Popular + 8 Total)",
      totalCountries: 80,
      pickedCountries: 8,
    },
    {
      title: "Insane",
      description: "Insane (130 Popular + 10 Total)",
      totalCountries: 130,
      pickedCountries: 10,
    },
    {
      title: "Impossible",
      description: "Impossible (210 countries + 10 Total)",
      totalCountries: 210,
      pickedCountries: 10,
    },
  ];

  const handleClick = (props: GameLevelType) => {
    localStorage.setItem("countryCapitalLevel", JSON.stringify(props));
    toast.success(`Game is currenty on ${props.title} Mode`);
    onClose();
    window.location.reload();
  };

  return (
    <Modal open={open} title="Game Complexity">
      <div className="space-y-3">
        {levels.map((level) => (
          <Button
            onClick={() => handleClick(level)}
            key={level.title}
            variant="outline"
            className="w-full ring-primary ring-1 text-base font-bold"
          >
            {level.description}
          </Button>
        ))}
      </div>
    </Modal>
  );
};
