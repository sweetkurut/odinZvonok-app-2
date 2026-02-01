import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../store";
import { AppRouter } from "./router";
import "./styles/global.scss";
import { ToastContainer } from "react-toastify";

function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <div className="app">
                    <ToastContainer position="top-right" autoClose={3000} />
                    <AppRouter />
                </div>
            </BrowserRouter>
        </Provider>
    );
}

export default App;
