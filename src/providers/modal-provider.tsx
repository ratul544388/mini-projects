"use client";

import { CountryCapitalLevelModal } from "@/components/modals/country-capital-level-modal";
import { CountryCapitalScoreBoardModal } from "@/components/modals/country-capital-score-board-modal";

export const ModalProvider = () => {
  return (
    <>
      <CountryCapitalScoreBoardModal />
      <CountryCapitalLevelModal />
    </>
  );
};
