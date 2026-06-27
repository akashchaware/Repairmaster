import http.server
import os
import sys
import time
import threading
from pathlib import Path

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 5500
WATCH_DIR = Path(__file__).parent

extensions = {".html", ".css", ".js", ".json", ".sql"}

def get_mtimes():
    m = {}
    for f in WATCH_DIR.rglob("*"):
        if f.suffix in extensions and ".git" not in f.parts and ".codex" not in f.parts and ".agents" not in f.parts and "__pycache__" not in f.parts:
            try:
                m[str(f.relative_to(WATCH_DIR))] = os.path.getmtime(f)
            except:
                pass
    return m

mtimes = get_mtimes()
changed = threading.Event()

def watcher():
    global mtimes
    time.sleep(2)
    while True:
        time.sleep(1)
        current = get_mtimes()
        for path, mtime in current.items():
            if mtimes.get(path) != mtime:
                mtimes = current
                changed.set()
                break

t = threading.Thread(target=watcher, daemon=True)
t.start()

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/__reload_events":
            self.send_response(200)
            self.send_header("Content-Type", "text/event-stream")
            self.send_header("Cache-Control", "no-cache")
            self.send_header("Connection", "keep-alive")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            try:
                self.wfile.write(b": connected\n\n")
                self.wfile.flush()
            except:
                pass
            while True:
                if changed.wait(timeout=30):
                    changed.clear()
                    try:
                        self.wfile.write(b"data: reload\n\n")
                        self.wfile.flush()
                    except:
                        break
                else:
                    try:
                        self.wfile.write(b": keepalive\n\n")
                        self.wfile.flush()
                    except:
                        break
            return
        if self.path == "/":
            self.path = "/index.html"
        if self.path.endswith(".html"):
            path = self.translate_path(self.path)
            if os.path.exists(path):
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Cache-Control", "no-cache")
                self.end_headers()
                with open(path, "rb") as f:
                    content = f.read()
                reload_script = b"""
<script>
(function(){var s=new EventSource('/__reload_events');
s.onmessage=function(e){if(e.data=='reload')location.reload()};
})();
</script>
</body>"""
                content = content.replace(b"</body>", reload_script)
                self.wfile.write(content)
                return
        return super().do_GET()

    def log_message(self, format, *args):
        pass

print(f"\n  Live-reload dev server running at:")
print(f"  http://localhost:{PORT}/\n")
print(f"  Edit any .html/.css/.js file and the browser will auto-refresh.\n")
http.server.HTTPServer(("0.0.0.0", PORT), Handler).serve_forever()
