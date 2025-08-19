from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from pathlib import Path
from starlette.middleware.sessions import SessionMiddleware

# Setup paths
BASE_DIR = Path(__file__).resolve().parent.parent
templates = Jinja2Templates(directory=str(BASE_DIR / "frontend" / "templates"))

app = FastAPI()

# Enable session middleware (needed for login/logout/dashboard)
app.add_middleware(SessionMiddleware, secret_key="supersecretkey123")

# Static files
app.mount("/static", StaticFiles(directory=BASE_DIR / "frontend" / "static"), name="static")

# Import and include auth routes
from backend.auth.routes import auth_router
app.include_router(auth_router, prefix="/auth")

# Home route
@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})
