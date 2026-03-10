import subprocess
import os
import sys
import time

def run_backend():
    print("🚀 Starting FastAPI Backend...")
    return subprocess.Popen([sys.executable, "-m", "uvicorn", "main:app", "--reload", "--port", "8000"], cwd="backend")

def run_frontend():
    print("🎨 Starting Vite Frontend...")
    return subprocess.Popen(["npm", "run", "dev"], cwd="frontend", shell=True)

if __name__ == "__main__":
    backend_proc = None
    frontend_proc = None
    try:
        backend_proc = run_backend()
        time.sleep(2)  # Give backend time to start
        frontend_proc = run_frontend()
        
        print("\n✅ System is running!")
        print("🔗 Frontend: http://localhost:5173")
        print("🔗 Backend: http://localhost:8000/docs")
        print("\nPress Ctrl+C to stop everything.")
        
        backend_proc.wait()
        frontend_proc.wait()
    except KeyboardInterrupt:
        print("\n🛑 Shutting down...")
        if backend_proc: backend_proc.terminate()
        if frontend_proc: frontend_proc.terminate()
