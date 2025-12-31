import os
import shutil
import logging

class FileOrganizer:
    def __init__(self, rules):
        self.rules = rules['categories']
        
    def get_category(self, extension):
        extension = extension.lower()
        for category, extensions in self.rules.items():
            if extension in extensions:
                return category
        return "Others"

    def move_file(self, file_path, dest_dir):
        if not os.path.exists(dest_dir):
            os.makedirs(dest_dir)
            
        file_name = os.path.basename(file_path)
        dest_path = os.path.join(dest_dir, file_name)
        
        counter = 1
        name, ext = os.path.splitext(file_name)
        while os.path.exists(dest_path):
            dest_path = os.path.join(dest_dir, f"{name}_{counter}{ext}")
            counter += 1
            
        shutil.move(file_path, dest_path)
        return dest_path
