import { createContext, ReactNode, useCallback, useContext, useState } from "react";

type Ctx = { open: boolean; openModal: () => void; closeModal: () => void };
const ContactModalContext = createContext<Ctx | null>(null);

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);
  return (
    <ContactModalContext.Provider value={{ open, openModal, closeModal }}>
      {children}
    </ContactModalContext.Provider>
  );
}

const NOOP: Ctx = { open: false, openModal: () => {}, closeModal: () => {} };

export function useContactModal() {
  return useContext(ContactModalContext) ?? NOOP;
}
