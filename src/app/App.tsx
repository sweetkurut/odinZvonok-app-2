import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../store";
import { AppRouter } from "./router";
import "./styles/global.scss";

function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <div className="app">
                    <AppRouter />
                </div>
            </BrowserRouter>
        </Provider>
    );
}

export default App;
