"""
Enterprise Business Analytics - Backend Server & Text-to-SQL API
Author: Le Vu Thien (thienlotus)
"""

import os
import sqlite3
import json
from pathlib import Path
from http.server import HTTPServer, SimpleHTTPRequestHandler

PORT = int(os.environ.get("PORT", 8080))
BASE_DIR = Path(__file__).resolve().parent
ROOT_DIR = BASE_DIR.parent.parent
FRONTEND_DIR = ROOT_DIR / "src" / "frontend"
DB_PATH = BASE_DIR / "analytics.db"
SCHEMA_PATH = BASE_DIR / "schema.sql"

def init_sqlite_database():
    """Initializes SQLite database using schema.sql"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    if SCHEMA_PATH.exists():
        with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
            sql_script = f.read()
            cursor.executescript(sql_script)
            conn.commit()
    conn.close()
    print("[*] SQLite database initialized successfully from schema.sql")

class AnalyticsRequestHandler(SimpleHTTPRequestHandler):
    """Serves static files from frontend directory and provides API endpoints"""
    def __init__(self, *args, **kwargs):
        directory = str(FRONTEND_DIR if FRONTEND_DIR.exists() else ROOT_DIR)
        super().__init__(*args, directory=directory, **kwargs)

    def do_GET(self):
        if self.path == "/api/health":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps({
                "status": "healthy",
                "service": "Business Analytics Platform API",
                "author": "Le Vu Thien (@thienlotus)"
            }).encode("utf-8"))
            return
        
        super().do_GET()

def run_server():
    init_sqlite_database()
    server_address = ("", PORT)
    httpd = HTTPServer(server_address, AnalyticsRequestHandler)
    print(f"\n=======================================================")
    print(f"  🚀 Business Analytics Enterprise Platform is Live!")
    print(f"  👉 URL: http://localhost:{PORT}")
    print(f"  👨‍💻 Author: Le Vu Thien (@thienlotus)")
    print(f"=======================================================\n")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[*] Server stopped.")

if __name__ == "__main__":
    run_server()
