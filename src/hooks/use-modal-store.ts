import { ScoreBoardType } from "@/app/country-capital/page";
import { create } from "zustand";

export type ModalType =
  | "countryCapitalScoreBoardModal"
  | "countryCapitalLavelModal";

interface ModalData {
  countryCapitalScoreBoard?: ScoreBoardType[];
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
