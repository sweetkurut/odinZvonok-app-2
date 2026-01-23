import { useNavigate, useLocation } from "react-router-dom";
import { Home, Phone, History, User, FileText, Layers, Package, BadgeDollarSign } from "lucide-react";
import styles from "./Navigation.module.scss";

interface NavigationProps {
    role: "client" | "operator" | "master";
}

export const Navigation = ({ role }: NavigationProps) => {
    const navigate = useNavigate();
    const location = useLocation();

    // const getNavItems = () => {
    //     switch (role) {
    //         case "client":
    //             return [
    //                 { path: "/client", icon: Home, label: "Главная" },
    //                 { path: "/client/tariffs", icon: BadgeDollarSign, label: "Тариф" },
    //                 { path: "/client/history", icon: History, label: "История" },
    //                 { path: "/client/create-order", icon: FileText, label: "Заказ" },
    //                 { path: "/client/profile", icon: User, label: "Профиль" },
    //             ];
    //         case "operator":
    //             return [
    //                 { path: "/operator", icon: Home, label: "Главная" },
    //                 { path: "/operator", icon: Phone, label: "Чат" },
    //                 { path: "/operator", icon: History, label: "История" },
    //                 { path: "/operator", icon: FileText, label: "Заказы" },
    //                 { path: "/operator", icon: User, label: "Профиль" },
    //             ];
    //         case "master":
    //             return [
    //                 { path: "/master", icon: Home, label: "Главная" },
    //                 { path: "/master", icon: Phone, label: "Чат" },
    //                 { path: "/master/history", icon: History, label: "История" },
    //                 { path: "/master", icon: FileText, label: "Заказы" },
    //                 { path: "/master", icon: User, label: "Профиль" },
    //             ];
    //         default:
    //             return [];
    //     }
    // };

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
                    // выполненные
                    { path: "/operator/completed/1", icon: History, label: "Завершённые" },
                ];

            case "master":
                return [
                    { path: "/master", icon: Home, label: "Главная" },
                    { path: "/master/history", icon: History, label: "История" },
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
