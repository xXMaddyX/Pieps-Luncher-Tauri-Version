import React from "react";
import { HashRouter ,Routes , Route } from 'react-router-dom';
import HeaderContainer from "./header/HeaderContainer";
import GameContainer from "./gameContainer/GameContainer";
import OptionPage from "./optionPage/OptionPage";
import './App.css'

const App = () => {
    return(
        <div className="app-content">
            <HashRouter>
                <HeaderContainer />
                <Routes>
                    <Route path="/" element={<GameContainer/>} />
                    <Route path="options" element={<OptionPage/>} />
                </Routes>
            </HashRouter>
        </div>
    )
}

export default App;