from starlette.responses import JSONResponse
import youtube_dl
from fastapi import FastAPI, HTTPException, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import PlainTextResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from youtube_dl.version import __version__ as youtube_dl_version

# DEFAULT_FORMAT = "bestvideo+bestaudio/best"
DEFAULT_FORMAT = "http-240p/http-360p/worstvideo[ext=mp4]/mp4"
DEFAULT_SEARCH = "ytsearch10"

app = FastAPI(docs_url=None, redoc_url=None)


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc):
    return PlainTextResponse(str(exc.detail), status_code=exc.status_code)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return PlainTextResponse(str(exc), status_code=status.HTTP_400_BAD_REQUEST)


@app.get("/api/info", status_code=status.HTTP_200_OK)
async def get_info(q: str, f: str = DEFAULT_FORMAT):
    ydl_opts = {
        "default_search": DEFAULT_SEARCH,
        "format": f.replace(" ", "+"),
        "retries": 3,
        "encoding": "utf8",
    }
    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        try:
            res = ydl.extract_info(q, download=False)
            return JSONResponse(res, headers={"Cache-Control": "no-store, s-maxage=0"})
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=repr(e), headers={"Cache-Control": "no-store, max-age=0"})


@app.get("/api/version", status_code=status.HTTP_200_OK)
async def get_version():
    return PlainTextResponse(youtube_dl_version)