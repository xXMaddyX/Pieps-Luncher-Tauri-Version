import React from 'react';
import CustomRouter from '../router/CostomRouter';
import { invoke } from '@tauri-apps/api';
import './HeaderContainer.css';

const HeaderContainer = () => {
    const { goToHome, goToOptions, goToAbout } = CustomRouter();
    const goToPiepsSoft = async () => {
        await invoke('open_external_window', { url: 'https://www.piepssoft.de' })
    }
    
    return(
        <div className="header-container">
            <div className="header-content">
                <div className="button-container">
                    <div className="button-container-content">
                        <button onClick={goToHome}>Main</button>
                        <button onClick={goToOptions}>Options</button>
                        <button onClick={goToPiepsSoft}>Pieps Soft Homepage</button>
                        <button>About</button>
                    </div>
                </div>
                <div id='header-logo'>
                    <img src="" alt="" />
                </div>
            </div>
        </div>
    )
}

export default HeaderContainer;