use serde::Serialize;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AppStatus {
    name: &'static str,
    version: &'static str,
    foundation_ready: bool,
}

#[tauri::command]
fn app_status() -> AppStatus {
    AppStatus {
        name: "RBR WX",
        version: env!("CARGO_PKG_VERSION"),
        foundation_ready: true,
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![app_status])
        .run(tauri::generate_context!())
        .expect("error while running RBR WX");
}
