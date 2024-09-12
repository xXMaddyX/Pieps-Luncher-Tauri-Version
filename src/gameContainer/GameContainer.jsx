import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api";
import { appDataDir, join } from "@tauri-apps/api/path";
import { readBinaryFile, writeBinaryFile } from "@tauri-apps/api/fs";
import { open } from "@tauri-apps/api/dialog";
import './GameContainer.css';

async function getSavePath() {
    const userDataDir = await appDataDir();
    const saveFilePath = await join(userDataDir, 'pieps-luncher-save.json');
    return saveFilePath;
}

const startGame = async (gamePath) => {
    try {
        await invoke("start_game", { gamePath });
    } catch (err) {
        console.error("Fehler beim Starten des Spiels", err);
    }
};

const GameContainer = () => {
    const [itemList, setItemList] = useState([]);
    const [gameName, setGameName] = useState("");
    const [gameIcon, setGameIcon] = useState(null);
    const [gamePath, setGamePath] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const savePath = await getSavePath();
                const data = await invoke("load_json", { savePath });
                setItemList(JSON.parse(data));
            } catch (err) {
                console.log("Keine Spieledatei gefunden", err);
            }
        };
        loadData();
    }, []);

    const saveGameItem = () => {
        let gameItem = {
            gameName: gameName,
            gameIcon: gameIcon || "",
            gamePath: gamePath || "",
        };

        setItemList((prevItemList) => {
            const updatedList = [...prevItemList, gameItem];
            saveGameListFiles(updatedList);
            return updatedList;
        });

        clearInputs();
    };

    const saveGameListFiles = async (list) => {
        try {
            const savePath = await getSavePath();
            await invoke('save_game_list', { data: JSON.stringify(list) });
            console.log('Spieledaten gespeichert');
        } catch (error) {
            console.error('Fehler beim Speichern der Spieledaten:', error);
        }
    };

    const deleteGameItem = (index) => {
        setItemList((prevItemList) => {
            const updatedList = prevItemList.filter((_, i) => i !== index);
            saveGameListFiles(updatedList);
            return updatedList;
        });
    };

    const clearInputs = () => {
        setGameName("");
        setGameIcon(null);
        setGamePath(null);
    };

    const selectGamePath = async () => {
        try {
            const path = await open({ properties: ['openFile'] });
            if (path) setGamePath(path);
        } catch (err) {
            console.error("Fehler beim Auswählen des Spielpfads", err);
        }
    };

    const selectImgPath = async () => {
        try {
            const path = await open({
                properties: ['openFile'],
                filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif'] }]
            });
    
            if (path) {
                const file = await readBinaryFile(path);
    
                const base64Image = `data:image/png;base64,${btoa(
                    String.fromCharCode(...new Uint8Array(file))
                )}`;
    
                setGameIcon(base64Image);
            }
        } catch (err) {
            console.error("Fehler beim Auswählen des Bildpfads", err);
        }
    };
    

    return (
        <div className="game-container">
            <div className="game-container-content">
                {itemList.map((item, key) => (
                    <div className="game-container-item" key={key}>
                        <h2>{item.gameName}</h2>
                        <img src={item.gameIcon} alt="Game Icon" />
                        <button onClick={() => startGame(item.gamePath)}>Start Game</button>
                        <button onClick={() => deleteGameItem(key)}>Delete Game</button>
                    </div>
                ))}

                <div className="game-container-add">
                    <input
                        type="text"
                        placeholder="Game Titel"
                        value={gameName}
                        onChange={(e) => setGameName(e.target.value)}
                    />
                    <button onClick={selectImgPath}>Select Image Path</button>
                    <button onClick={selectGamePath}>Select Game Path</button>
                    <button onClick={saveGameItem}>Add Game</button>
                </div>
            </div>
        </div>
    );
};

export default GameContainer;
