#
# from fastapi import APIRouter, Request, Form, HTTPException
# from fastapi.responses import HTMLResponse, RedirectResponse
# from fastapi.templating import Jinja2Templates
# from pathlib import Path
# from typing import Optional
# from datetime import datetime
# from backend.auth.service import login_user, signup_user
# from backend.auth.database import users_collection
#
# BASE_DIR = Path(__file__).resolve().parent.parent.parent
# templates = Jinja2Templates(directory=str(BASE_DIR / "frontend" / "templates"))
#
# auth_router = APIRouter(tags=["Authentication"])
#
#
# @auth_router.get("/login", response_class=HTMLResponse)
# async def login_page(
#         request: Request,
#         error: Optional[str] = None,
#         message: Optional[str] = None
# ):
#     return templates.TemplateResponse(
#         "signin.html",
#         {
#             "request": request,
#             "error": error,
#             "message": message
#         }
#     )
#
#
# @auth_router.get("/signup", response_class=HTMLResponse)
# async def signup_page(request: Request, error: Optional[str] = None):
#     return templates.TemplateResponse(
#         "signup.html",
#         {
#             "request": request,
#             "error": error
#         }
#     )
#
#
# @auth_router.post("/login")
# async def login_api(
#         request: Request,
#         email: str = Form(...),
#         password: str = Form(...)
# ):
#     try:
#         user = login_user(email, password)
#         if not user:
#             raise HTTPException(
#                 status_code=401,
#                 detail="Invalid credentials"
#             )
#
#
#         return RedirectResponse(url="/", status_code=303)
#
#     except HTTPException as he:
#         return templates.TemplateResponse(
#             "signin.html",
#             {
#                 "request": request,
#                 "error": he.detail
#             },
#             status_code=he.status_code
#         )
#
#
# @auth_router.post("/signup")
# async def handle_signup(
#         request: Request,
#         full_name: str = Form(...),
#         email: str = Form(...),
#         password: str = Form(...),
#         confirm_password: str = Form(...)
# ):
#     # Password confirmation
#     if password != confirm_password:
#         return templates.TemplateResponse(
#             "signup.html",
#             {
#                 "request": request,
#                 "error": "Passwords do not match"
#             },
#             status_code=400
#         )
#
#     # Prepare user data
#     user_data = {
#         "full_name": full_name,
#         "email": email,
#         "password": password,
#         "created_at": datetime.utcnow()
#     }
#
#     # Insert into database
#     result = signup_user(user_data)
#
#
#     if "error" in result:
#         return templates.TemplateResponse(
#             "signup.html",
#             {
#                 "request": request,
#                 "error": result["error"]
#             },
#             status_code=400
#         )
#
#
#     return RedirectResponse(
#         url="/auth/login?message=Account+created+successfully",
#         status_code=303
#     )
#
#
from fastapi import APIRouter, Request, Form, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from pathlib import Path
from typing import Optional
from datetime import datetime
from backend.auth.service import login_user, signup_user
import logging

from backend.utils.logger import logger

logger = logging.getLogger()

BASE_DIR = Path(__file__).resolve().parent.parent.parent
templates = Jinja2Templates(directory=str(BASE_DIR / "frontend" / "templates"))

auth_router = APIRouter(tags=["Authentication"])

# ------------------ LOGIN PAGE ------------------
@auth_router.get("/login", response_class=HTMLResponse)
async def login_page(
    request: Request,
    error: Optional[str] = None,
    message: Optional[str] = None
):
    return templates.TemplateResponse(
        "signin.html",
        {
            "request": request,
            "error": error,
            "message": message
        }
    )

# ------------------ SIGNUP PAGE ------------------
@auth_router.get("/signup", response_class=HTMLResponse)
async def signup_page(request: Request, error: Optional[str] = None):
    return templates.TemplateResponse(
        "signup.html",
        {
            "request": request,
            "error": error
        }
    )

# ------------------ LOGIN API ------------------
@auth_router.post("/login")
async def login_api(
    request: Request,
    email: str = Form(...),
    password: str = Form(...)
):
    try:
        user = login_user(email, password)  # returns user if valid
        if not user:
            logger.warning(f"FAILED login: {email}")
            raise HTTPException(
                status_code=401,
                detail="Invalid credentials"
            )

        logger.info(f"SUCCESS login: {email}")

        #  store session
        request.session["user"] = {
            "email": email,
            "full_name": user.get("full_name", email)  # fallback if no name
        }

        return RedirectResponse(url="/auth/dashboard", status_code=303)

    except HTTPException as he:
        return templates.TemplateResponse(
            "signin.html",
            {
                "request": request,
                "error": he.detail
            },
            status_code=he.status_code
        )

# ------------------ SIGNUP API ------------------
import re

EMAIL_REGEX = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
PASSWORD_REGEX = r"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"


@auth_router.post("/signup")
async def handle_signup(
    request: Request,
    full_name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    confirm_password: str = Form(...)
):

    # Email validation
    if not re.match(EMAIL_REGEX, email):
        logger.warning(f"INVALID EMAIL SIGNUP: {email}")
        return templates.TemplateResponse(
            "signup.html",
            {
                "request": request,
                "error": "Invalid email format"
            },
            status_code=400
        )

    # Password strength validation
    if not re.match(PASSWORD_REGEX, password):
        logger.warning(f"WEAK PASSWORD SIGNUP: {email}")
        return templates.TemplateResponse(
            "signup.html",
            {
                "request": request,
                "error": "Password must be at least 8 characters long, at least one letter (small or capital), one number."
            },
            status_code=400
        )

    # Password confirmation
    if password != confirm_password:
        logger.warning(f"PASSWORD MISMATCH: {email}")
        return templates.TemplateResponse(
            "signup.html",
            {
                "request": request,
                "error": "Passwords do not match"
            },
            status_code=400
        )

    # Prepare user data
    user_data = {
        "full_name": full_name,
        "email": email,
        "password": password,
        "created_at": datetime.utcnow()
    }

    result = signup_user(user_data)

    if "error" in result:
        logger.warning(f"BLOCKED signup: {email} - {result['error']}")
        return templates.TemplateResponse(
            "signup.html",
            {
                "request": request,
                "error": result["error"]
            },
            status_code=400
        )

    logger.info(f"NEW signup: {email}")
    return RedirectResponse(
        url="/auth/login?message=Account+created+successfully",
        status_code=303
    )

# ------------------ DASHBOARD ------------------
@auth_router.get("/dashboard", response_class=HTMLResponse)
async def dashboard(request: Request):
    user = request.session.get("user")
    if not user:
        return RedirectResponse(url="/auth/login", status_code=303)

    return templates.TemplateResponse(
        "dashboard.html",
        {
            "request": request,
            "username": user["full_name"]
        }
    )

# ------------------ LOGOUT ------------------
@auth_router.get("/logout")
async def logout(request: Request):
    user_email = request.session.get("user")  # or whatever key you stored at login
    # print(user_email["email"])
    if user_email:
        logger.info(f"LOGOUT: {user_email["email"]}")  # ✅ write to log file
    request.session.clear()  # remove session completely
    return RedirectResponse(url="/auth/login", status_code=303)


# ------------------ ABOUT ------------------
@auth_router.get("/about", response_class=HTMLResponse)
async def about_page(request: Request):
    return templates.TemplateResponse("about.html", {"request": request})


# ------------------ CONTACT ------------------
@auth_router.get("/contact", response_class=HTMLResponse)
async def about_page(request: Request):
    return templates.TemplateResponse("contact.html", {"request": request})