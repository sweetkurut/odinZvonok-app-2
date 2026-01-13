import type { ReactNode } from "react";
import styles from "./Button.module.scss";

interface ButtonProps {
    children: ReactNode;
    variant?: "primary" | "secondary" | "success" | "danger";
    size?: "small" | "medium" | "large";
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
}

export const Button = ({
    children,
    variant = "primary",
    size = "medium",
    onClick,
    disabled,
    className,
}: ButtonProps) => {
    return (
        <button
            className={`${styles.button} ${styles[variant]} ${styles[size]} ${className || ""}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};
