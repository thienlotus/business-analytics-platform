"""
NexusBI - Enterprise Backend Server & Text-to-SQL API
Author: Le Vu Thien (thienlotus)
"""

import os
import sqlite3
import json
from http.server import HTTPServer, SimpleHTTPRequestHandler

PORT = int(os.environ.get("PORT", 8080))
DB_PATH = "nexus_bi.db"

def init_sqlite_database():
    """Initializes SQLite database using schema.sql"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    if os.path.exists("schema.sql"):
        with open("schema.sql", "r", encoding="utf-8") as f:
            sql_script = f.read()
            cursor.executescript(sql_script)
            conn.commit()
    conn.close()
    print("[*] SQLite database initialized successfully from schema.sql")

class NexusRequestHandler(SimpleHTTPRequestHandler):
    """Serves static files and provides Text-to-SQL API endpoints"""
    def do_GET(self):
        if self.path == "/api/health":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "healthy", "service": "NexusBI Enterprise API"}).encode("utf-8"))
            return
        
        # Default to serving static files
        super().do_GET()

def run_server():
    init_sqlite_database()
    server_address = ("", PORT)
    httpd = HTTPServer(server_address, NexusRequestHandler)
    print(f"\n=======================================================")
    print(f"  🚀 NexusBI Enterprise Platform is Live!")
    print(f"  👉 URL: http://localhost:{PORT}")
    print(f"  👨‍💻 Author: Le Vu Thien (@thienlotus)")
    print(f"=======================================================\n")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[*] Server stopped.")

if __name__ == "__main__":
    run_server()
