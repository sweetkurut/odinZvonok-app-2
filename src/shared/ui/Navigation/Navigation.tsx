import { useNavigate, useLocation } from "react-router-dom";
import { Home, History, User, FileText, BadgeDollarSign, UsersIcon } from "lucide-react";
import styles from "./Navigation.module.scss";

interface NavigationProps {
    role: "client" | "operator" | "master";
}

export const Navigation = ({ role }: NavigationProps) => {
    const navigate = useNavigate();
    const location = useLocation();

    const getNavItems = () => {
        switch (role) {
            case "client":
                return [
                    { path: "/client", icon: Home, label: "Главная" },
                    { path: "/client/tariffs", icon: BadgeDollarSign, label: "Тариф" },
                    { path: "/client/history", icon: History, label: "История" },
                    { path: "/client/create-order", icon: FileText, label: "Заказ" },
                    { path: "/client/profile", icon: User, label: "Профиль" },
                ];

            case "operator":
                return [
                    // { path: "/operator", icon: Home, label: "Главная" },
                    // список активных заказов
                    { path: "/operator", icon: FileText, label: "Сделки" },
                    { path: "/operator/masters-list", icon: UsersIcon, label: "Мастера" },
                    // выполненные
                    { path: "/operator/completed/1", icon: History, label: "Завершённые" },
                ];

            case "master":
                return [
                    { path: "/master", icon: Home, label: "Главная" },
                    { path: "/master/history", icon: History, label: "История" },
                    { path: "/master/profile", icon: User, label: "Профиль" },
                ];

            default:
                return [];
        }
    };

    const navItems = getNavItems();

    return (
        <nav className={styles.navigation}>
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                    <button
                        key={item.path}
                        className={`${styles.navItem} ${isActive ? styles.active : ""}`}
                        onClick={() => navigate(item.path)}
                    >
                        <Icon size={20} />
                        <span className={styles.label}>{item.label}</span>
                    </button>
                );
            })}
        </nav>
    );
};
