import asyncio
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI

from src.config import settings
from src.api import auth_router
from src.bot import get_bot

logging.basicConfig(
    level=logging.INFO if not settings.debug else logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting Dance of Mind Backend...")

    bot = get_bot()
    await bot.initialize()
    logger.info("Telegram bot initialized")

    yield

    logger.info("Shutting down Dance of Mind Backend...")
    await bot.shutdown()
    logger.info("Telegram bot shut down")


app = FastAPI(
    title="Dance of Mind API",
    description="Backend API for Dance of Mind with Telegram Bot Authentication",
    version="1.0.0",
    lifespan=lifespan,
)

app.include_router(auth_router)


@app.get("/")
async def root():
    return {
        "status": "ok",
        "service": "Dance of Mind Backend",
        "version": "1.0.0",
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level="debug" if settings.debug else "info",
     )
