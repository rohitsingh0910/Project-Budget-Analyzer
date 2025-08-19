from fastapi import HTTPException, status

class AppExceptions:
    class NotFound(HTTPException):
        def __init__(self, detail="Resource not found"):
            super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)

    class BadRequest(HTTPException):
        def __init__(self, detail="Bad request"):
            super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)

    class Unauthorized(HTTPException):
        def __init__(self, detail="Unauthorized access"):
            super().__init__(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail)

    class InternalServerError(HTTPException):
        def __init__(self, detail="Internal server error"):
            super().__init__(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=detail)
