import os
import yaml
from dotenv import load_dotenv
from organizer import FileOrganizer

load_dotenv()
with open('config/rules.yaml', 'r') as f:
    config = yaml.safe_load(f)

def run_organizer():
    source_dir = os.getenv("SOURCE_DIRECTORY")
    if not source_dir or not os.path.exists(source_dir):
        print(f"Error: Source directory '{source_dir}' not found.")
        return

    organizer = FileOrganizer(config)
    print(f"--- Starting Organization in {source_dir} ---")

    for filename in os.listdir(source_dir):
        file_path = os.path.join(source_dir, filename)
        if os.path.isdir(file_path):
            continue
            
        extension = os.path.splitext(filename)[1]
        category = organizer.get_category(extension)
        dest_dir = os.path.join(source_dir, category)
        
        organizer.move_file(file_path, dest_dir)
        print(f"Moved: {filename} -> {category}/")

if __name__ == "__main__":
    run_organizer()
