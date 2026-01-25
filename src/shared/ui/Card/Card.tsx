import type { ReactNode } from "react";
import styles from "./Card.module.scss";

interface CardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

export const Card = ({ children, className, onClick }: CardProps) => {
    return (
        <div className={`${styles.card} ${className || ""}`} onClick={onClick}>
            {children}
        </div>
    );
};
