import React, { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "../Button";

interface ModalProps {
    children: React.ReactNode;
    title?: string;
    isOpen: boolean;
    onClose: () => void;
    maxWidth?: string; 
    className?: string;
}

const Modal = ({ children, title, isOpen, onClose, maxWidth = "max-w-lg", className = "" }: ModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const DEFAULT_STYLES = "relative bg-background w-full rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 mt-10 mb-10";
    const handleEsc = useCallback((e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            window.addEventListener("keydown", handleEsc);
            document.body.style.overflow = "hidden"; 
        }
        return () => {
            window.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, handleEsc]);

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-foreground-muted/20 backdrop-blur-[2px] p-4 md:p-16"
            onClick={onClose}
        >
            <div
                ref={modalRef}
                className={`
                    ${DEFAULT_STYLES} 
                    ${className} 
                    ${maxWidth}
                    `}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-5 border-b border-border">
                    {title ? (
                        <h2 className="text-xl font-bold text-foreground">{title}</h2>
                    ) : (
                        <div />
                    )}
                    <Button
                        variant="text-only" 
                        onClick={onClose}
                        className="p-1 text-foreground-muted hover:text-foreground hover:bg-card rounded-full transition-colors"
                    >
                        <CloseIcon fontSize="small" />
                    </Button>
                </div>

                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;