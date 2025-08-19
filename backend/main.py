# # from fastapi import FastAPI
# # from fastapi.responses import PlainTextResponse
# #
# # app = FastAPI()
# #
# # @app.get("/", response_class=PlainTextResponse)
# # def home():
# #     print("hello")
# #     return "wiz"
#
# # from fastapi import FastAPI, Request
# # from fastapi.templating import Jinja2Templates
# # from fastapi.staticfiles import StaticFiles
# # from pathlib import Path
# # from fastapi.responses import HTMLResponse
# #
# # BASE_DIR = Path(__file__).resolve().parent.parent  # Goes up from backend/ to project root
# #
# # app = FastAPI()
# # app.mount(
# #     "/static",
# #     StaticFiles(directory=BASE_DIR / "frontend" / "static"),
# #     name="static"
# # )
# #
# # templates = Jinja2Templates(directory=BASE_DIR / "frontend" / "templates")
# #
# # @app.get("/", response_class=HTMLResponse)
# # async def home(request: Request):
# #     return templates.TemplateResponse("index.html", {"request": request})
#
#
# # from fastapi import FastAPI
# # from fastapi.responses import HTMLResponse
# #
# # app = FastAPI()
#
# # @app.get("/", response_class=HTMLResponse)
# # async def home():
# #     html_content = """
# #     <!DOCTYPE html>
# #     <html>
# #     <head>
# #         <title>My First Page</title>
# #     </head>
# #     <body>
# #         <h1>Hello, Word!</h1>
# #         <p>This is a simple HTML page.</p>
# #     </body>
# #     </html>
# #     """
# #     return HTMLResponse(content=html_content, status_code=200)
#
#
#
# from pathlib import Path
# # from fastapi import FastAPI, Request
# # from fastapi.responses import HTMLResponse
# # from fastapi.staticfiles import StaticFiles
# # from fastapi.templating import Jinja2Templates
# #
# # BASE_DIR = Path(__file__).resolve().parent.parent  # Root project folder
# #
# # app = FastAPI()
# #
# # # Make sure the static directory exists
# # static_dir = BASE_DIR / "frontend" / "static"
# # static_dir.mkdir(parents=True, exist_ok=True)
# #
# # # Mount BEFORE defining any routes
# # app.mount("/static", StaticFiles(directory=static_dir), name="static")
# #
# # # Templates folder
# # templates = Jinja2Templates(directory=BASE_DIR / "frontend" / "templates")
# #
# # @app.get("/", response_class=HTMLResponse)
# # async def home(request: Request):
# #     return templates.TemplateResponse(
# #         "index.html",
# #         {"request": request, "title": "FastAPI Static Example"}
# #     )
#
# # from pathlib import Path
# # from fastapi import FastAPI, Request
# # from fastapi.responses import HTMLResponse, RedirectResponse
# # from fastapi.staticfiles import StaticFiles
# # from fastapi.templating import Jinja2Templates
# #
# # BASE_DIR = Path(__file__).resolve().parent.parent
# #
# # app = FastAPI()
# #
# # # Static files
# # static_dir = BASE_DIR / "frontend" / "static"
# # static_dir.mkdir(parents=True, exist_ok=True)
# # app.mount("/static", StaticFiles(directory=static_dir), name="static")
# #
# # # Templates
# # templates = Jinja2Templates(directory=BASE_DIR / "frontend" / "templates")
# #
# # # Home route
# # @app.get("/", response_class=HTMLResponse)
# # async def home(request: Request):
# #     return templates.TemplateResponse(
# #         "index.html",
# #         {"request": request, "title": "Hello FastAPI!"}
# #     )
#
# # Optional Flask-style redirect
# # @app.get("/flask_static/{filename:path}", name="flask_static")
# # async def flask_static_redirect(filename: str):
# #     return RedirectResponse(url=f"/static/{filename}")
#
# from fastapi import FastAPI, Request
# from fastapi.staticfiles import StaticFiles
# from fastapi.templating import Jinja2Templates
# from fastapi.responses import HTMLResponse
# from pathlib import Path
#
# # Setup paths
# BASE_DIR = Path(__file__).resolve().parent.parent
# templates = Jinja2Templates(directory=str(BASE_DIR / "frontend" / "templates"))
#
# app = FastAPI()
#
# app.mount("/static", StaticFiles(directory=BASE_DIR / "frontend" / "static"), name="static")
#
# from backend.auth.routes import auth_router
# app.include_router(auth_router, prefix="/auth")
#
# @app.get("/", response_class=HTMLResponse)
# async def home(request: Request):
#     return templates.TemplateResponse("index.html", {"request": request})

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
