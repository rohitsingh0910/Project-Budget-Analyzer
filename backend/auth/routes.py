import joblib
from fastapi import APIRouter, Request, Form, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from pathlib import Path
from typing import Optional
from datetime import datetime
from backend.auth.service import login_user, signup_user
from backend.utils.logger import logger

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
        logger.info(f"LOGOUT: {user_email["email"]}")  #  write to log file
    request.session.clear() # remove session completely
    return RedirectResponse(url="/auth/login", status_code=303)


# ------------------ ABOUT ------------------
@auth_router.get("/about", response_class=HTMLResponse)
async def about_page(request: Request):
    return templates.TemplateResponse("about.html", {"request": request})


# ------------------ CONTACT ------------------
@auth_router.get("/contact", response_class=HTMLResponse)
async def about_page(request: Request):
    user = request.session.get("user")
    if not user:
        return RedirectResponse(url="/auth/login", status_code=303)
    return templates.TemplateResponse("contact.html", {"request": request})


# ------------------ OUTPUT ------------------
import pandas as pd
@auth_router.post("/output", response_class=HTMLResponse)
async def output(request: Request):
    user = request.session.get("user")
    if not user:
        return RedirectResponse(url="/auth/login", status_code=303)
    form = await request.form()
    data = dict(form)
    print(data)
    # ===================
    import pandas as pd

    def transform_input(data):
        # Define all possible architecture categories
        architecture_categories = [
            'Client server',
            'Multi-tier',
            'Multi-tier with web interface',
            'Stand alone'
        ]

        # One-hot encode architecture
        arch_dict = {
            f'Architecture_{arch}': int(data['architecture'] == arch)
            for arch in architecture_categories
        }

        # Convert the rest to numeric with "_num" suffix
        numeric_dict = {
            'Development_Type_num': int(data['development_type']),
            'Development_Platform_num': int(data['development_platform']),
            'Language_Type_num': int(data['language_type']),
            'Relative_Size_num': int(data['relative_size']),
            'Resource_Level_num': int(data['resource_level']),
            'Industry_Sector_num': int(data['industry_sector'])
        }

        # Merge dictionaries
        final_dict = {**arch_dict, **numeric_dict}

        return pd.DataFrame([final_dict])

    # Transform your given data
    sample_input = transform_input(data)

    print(sample_input)

    # --------------------ml-model------------------------------
    best_model = joblib.load(r"C:\Users\Admin\PycharmProjects\Project-Budget-Analyzer\random_forest_model.pkl")
    prediction = best_model.predict(sample_input)

    # Since it's multi-output: [Summary Work Effort, Project Elapsed Time]
    summary_effort, elapsed_time = prediction[0]

    print("Predicted Summary Work Effort:", summary_effort)
    print("Predicted Project Elapsed Time:", elapsed_time)

    # ---------------------------
    # Budget calculation
    # ---------------------------
    cost_per_effort_unit = 10000  # Example: 100 currency units per effort unit
    predicted_budget = summary_effort * elapsed_time * cost_per_effort_unit

    # Format as INR (Indian Rupee, widely used in software estimation in India)
    print("Predicted Budget: ₹{:,}".format(round(predicted_budget, 2)))

    return templates.TemplateResponse(
        "output.html",
        {"request": request, "username":user["full_name"], "amount":predicted_budget}
    )
