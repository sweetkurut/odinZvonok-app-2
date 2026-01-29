import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/shared/hooks";
import { Navigation } from "./shared/ui";

interface RoleLayoutProps {
    role: "client" | "operator" | "master";
}

export const RoleLayout = ({ role }: RoleLayoutProps) => {
    const { user, loading } = useAppSelector((state) => state.auth);

    if (loading) return null; // или skeleton

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role?.toLowerCase() !== role) {
        return <Navigate to={`/${user.role?.toLowerCase()}`} replace />;
    }

    return (
        <>
            <Navigation role={role} />
            <Outlet />
        </>
    );
};
