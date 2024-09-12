// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Manager, State, Window};
use std::fs;
use std::process::Command;
use std::path::PathBuf;
use tauri::api::path::app_data_dir;
use tauri::Config;

#[tauri::command]
fn load_json(config: State<'_, Config>) -> Result<String, String> {
    let save_path: PathBuf = app_data_dir(&config)
        .ok_or("Fehler beim Abrufen des App-Verzeichnisses")?
        .join("pieps-luncher-save.json");

    let data = fs::read_to_string(save_path)
        .map_err(|e| format!("Fehler beim Laden der Spieledaten: {}", e))?;

    Ok(data)
}

#[tauri::command]
fn open_external_window(window: Window, url: String) -> Result<(), String> {
    tauri::api::shell::open(&window.shell_scope(), url, None)
        .map_err(|e| format!("Fehler beim Öffnen des Fensters: {}", e))?;
    Ok(())
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn start_game(game_path: String) -> Result<(), String> {
    let output = Command::new(game_path)
        .output()
        .map_err(|e| format!("Fehler beim Starten des Spiels: {}", e))?;

    if !output.stderr.is_empty() {
        return Err(String::from_utf8_lossy(&output.stderr).to_string());
    }
    println!("Spiel gestartet: {}", String::from_utf8_lossy(&output.stdout));
    Ok(())
}

#[tauri::command]
fn save_game_list(config: State<'_, Config>, data: String) -> Result<(), String> {
    let save_path: PathBuf = app_data_dir(&config)
        .ok_or("Fehler beim Abrufen des App-Verzeichnisses")?
        .join("pieps-luncher-save.json");

    fs::write(save_path, data)
        .map_err(|e| format!("Fehler beim Speichern der Daten: {}", e))?;

    Ok(())
}

fn main() {
    tauri::Builder::default()
        .manage(Config::default())
        .invoke_handler(tauri::generate_handler![
            greet,
            start_game,
            save_game_list,
            load_json,
            open_external_window
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
