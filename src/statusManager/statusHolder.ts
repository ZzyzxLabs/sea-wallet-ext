// statusManager/statusHolder.ts
import { create } from "zustand"

type PopupState = "init" | "home" | "app" | "chat" //add more statuses here

interface PopupStore {
  state: PopupState
  setState: (newState: PopupState) => void
}

export const usePopupStore = create<PopupStore>((set) => ({
  state: "init",
  setState: (newState) => set({ state: newState })
}))