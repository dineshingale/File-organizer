from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys
import os
import yaml
from typing import List

# Ensure imports work
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.organizer import FileOrganizer

# Load env variables for SOURCE_DIRECTORY
from dotenv import load_dotenv
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env')
load_dotenv(dotenv_path=env_path, override=True)

app = FastAPI(title="File Organizer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class OrganizationResult(BaseModel):
    moved_files: List[str]
    errors: List[str]
    source_dir: str

class OrganizeRequest(BaseModel):
    source_path: str

@app.post("/api/organize", response_model=OrganizationResult)
async def organize_files(request: OrganizeRequest):
    source_dir = request.source_path
    if not source_dir or not os.path.exists(source_dir):
        raise HTTPException(status_code=400, detail=f"Source directory not found: {source_dir}")

    # Load Config
    config_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'config', 'rules.yaml')
    with open(config_path, 'r') as f:
        config = yaml.safe_load(f)

    organizer = FileOrganizer(config)
    moved_log = []
    error_log = []

    try:
        for filename in os.listdir(source_dir):
            file_path = os.path.join(source_dir, filename)
            
            if os.path.isdir(file_path):
                continue
                
            extension = os.path.splitext(filename)[1]
            category = organizer.get_category(extension)
            dest_dir = os.path.join(source_dir, category)
            
            try:
                organizer.move_file(file_path, dest_dir)
                moved_log.append(f"{filename} -> {category}/")
            except Exception as e:
                error_log.append(f"Failed to move {filename}: {str(e)}")
                
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {
        "moved_files": moved_log,
        "errors": error_log,
        "source_dir": source_dir
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
