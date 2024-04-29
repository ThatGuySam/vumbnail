# Vercel Python Example - https://github.com/vercel/examples/tree/main/python

import yt_dlp;
from starlette.responses import JSONResponse;
from fastapi.responses import PlainTextResponse;
from fastapi import FastAPI, HTTPException, status;
from fastapi.exceptions import RequestValidationError;
from starlette.exceptions import HTTPException as StarletteHTTPException;

DEFAULT_FORMAT = "bestvideo+bestaudio/best"
app = FastAPI(docs_url=None, redoc_url=None)

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc):
    return PlainTextResponse(str(exc.detail), status_code=exc.status_code)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return PlainTextResponse(str(exc), status_code=status.HTTP_400_BAD_REQUEST)

@app.get("/favicon.ico", status_code=status.HTTP_200_OK)
async def favicon_blank():
	return PlainTextResponse("")

@app.get("/api/info", status_code=status.HTTP_200_OK)
async def get_info(query: str, format: str = DEFAULT_FORMAT):
      ydl_opts = {
            "format": format.replace(" ", "+"),
            "retries": 3,
            "encoding": "utf8",
      }
      with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            try:
                  res = ydl.extract_info(query, download=False)
                  return JSONResponse(res, headers={"Cache-Control": "s-maxage=2592000, stale-while-revalidate"})
            except Exception as e:
                  raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=repr(e), headers={"Cache-Control": "no-store, max-age=0"})

@app.get("/api/version", status_code=status.HTTP_200_OK)
async def get_version():
      return JSONResponse({
            "wrapper": yt_dlp.version.__version__,
            "variant": yt_dlp.version.VARIANT,
            "git_hash": yt_dlp.version.RELEASE_GIT_HEAD
      })