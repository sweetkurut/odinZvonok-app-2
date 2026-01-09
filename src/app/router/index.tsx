import { Routes, Route, Navigate } from "react-router-dom";
import { ClientHomePage } from "../../pages/client/HomePage";
import { ClientHelpPage } from "../../pages/client/HelpPage";
import { ClientHistoryPage } from "../../pages/client/HistoryPage";
import { ClientProfilePage } from "../../pages/client/ProfilePage";
import { ClientCreateOrderPage } from "../../pages/client/CreateOrderPage";
import { ClientTariffPage } from "../../pages/client/TariffPage";
import { OperatorHomePage } from "../../pages/operator/HomePage";
import { OperatorOrderPage } from "../../pages/operator/OrderPage";
import { OperatorMasterPage } from "../../pages/operator/MasterPage";
import { OperatorCompletedPage } from "../../pages/operator/CompletedPage";
import { MasterHomePage } from "../../pages/master/HomePage";
import { MasterHistoryPage } from "../../pages/master/HistoryPage";
import { MasterOrderPage } from "../../pages/master/OrderPage";
import Login from "@/pages/Login/Login";

export const AppRouter = () => {
    return (
        <Routes>
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Login */}
            <Route path="/login" element={<Login />} />

            {/* Client Routes */}
            <Route path="/client" element={<ClientHomePage />} />
            <Route path="/client/help" element={<ClientHelpPage />} />
            <Route path="/client/history" element={<ClientHistoryPage />} />
            <Route path="/client/profile" element={<ClientProfilePage />} />
            <Route path="/client/create-order" element={<ClientCreateOrderPage />} />
            <Route path="/client/tariff" element={<ClientTariffPage />} />

            {/* Operator Routes */}
            <Route path="/operator" element={<OperatorHomePage />} />
            <Route path="/operator/order/:id" element={<OperatorOrderPage />} />
            <Route path="/operator/master/:id" element={<OperatorMasterPage />} />
            <Route path="/operator/completed/:id" element={<OperatorCompletedPage />} />

            {/* Master Routes */}
            <Route path="/master" element={<MasterHomePage />} />
            <Route path="/master/history" element={<MasterHistoryPage />} />
            <Route path="/master/order/:id" element={<MasterOrderPage />} />
        </Routes>
    );
};
