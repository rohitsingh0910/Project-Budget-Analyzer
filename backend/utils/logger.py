import logging
import os
from pathlib import Path

log_dir = Path("logs")
os.makedirs(log_dir, exist_ok=True)

logging.basicConfig(
    filename=log_dir / 'auth.log',
    level=logging.INFO,
    format='%(asctime)s - %(message)s',
    filemode='a'
)
logger = logging.getLogger()
