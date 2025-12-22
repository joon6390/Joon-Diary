"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import styles from "./styles.module.css";

interface ModalItem {
  id: string;
  content: ReactNode;
}

interface ModalContextType {
  openModal: (content: ReactNode) => string;
  closeModal: (id?: string) => void;
  closeAllModals: () => void;
  isOpen: boolean;
  modalCount: number;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within ModalProvider");
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

const BASE_Z_INDEX = 1000;
const Z_INDEX_INCREMENT = 10;

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modals, setModals] = useState<ModalItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const modalIdCounter = useRef(0);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // 모달이 열려있을 때 body 스크롤 제거
  useEffect(() => {
    if (modals.length > 0) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [modals.length]);

  const openModal = useCallback((content: ReactNode): string => {
    const id = `modal-${modalIdCounter.current++}`;
    setModals((prev) => [...prev, { id, content }]);
    return id;
  }, []);

  const closeModal = useCallback((id?: string) => {
    if (id) {
      setModals((prev) => prev.filter((modal) => modal.id !== id));
    } else {
      // id가 없으면 가장 최근 모달 닫기
      setModals((prev) => prev.slice(0, -1));
    }
  }, []);

  const closeAllModals = useCallback(() => {
    setModals([]);
  }, []);

  const handleBackdropClick = useCallback(
    (modalId: string) => {
      // 가장 최상위 모달만 닫기
      setModals((prev) => {
        if (prev.length > 0 && prev[prev.length - 1].id === modalId) {
          return prev.filter((modal) => modal.id !== modalId);
        }
        return prev;
      });
    },
    []
  );

  const modalRoot = isMounted ? document.body : null;

  return (
    <ModalContext.Provider
      value={{
        openModal,
        closeModal,
        closeAllModals,
        isOpen: modals.length > 0,
        modalCount: modals.length,
      }}
    >
      {children}
      {modalRoot &&
        modals.map((modal, index) => {
          const zIndex = BASE_Z_INDEX + index * Z_INDEX_INCREMENT;
          const backdropZIndex = zIndex;
          const contentZIndex = zIndex + 1;

          return createPortal(
            <div
              key={modal.id}
              className={styles.modalContainer}
              style={{ zIndex }}
              onClick={() => handleBackdropClick(modal.id)}
            >
              <div
                className={styles.backdrop}
                style={{ zIndex: backdropZIndex }}
              />
              <div
                className={styles.modalContent}
                style={{ zIndex: contentZIndex }}
                onClick={(e) => e.stopPropagation()}
              >
                {modal.content}
              </div>
            </div>,
            modalRoot
          );
        })}
    </ModalContext.Provider>
  );
};



