# 📁 Automated File Organizer (2025)

A smart, rule-based file management system using Python, YAML, and FastAPI. It features a modern web dashboard for organizing files with a single click.

## 🚀 Features

-   **Smart Sorting:** Automatically categorizes files (Images, Docs, Media, etc.) based on `config/rules.yaml`.
-   **Dashboard UI:** Sort files instantly using a beautiful web interface.
-   **REST API:** Programmatic access via FastAPI.
-   **Dynamic Path:** Choose any folder to organize directly from the UI.
-   **Extensible:** Easy to add new file types and categories.

## 🛠️ Installation

### 1. Backend Setup

1.  Clone the repository:
    ```bash
    git clone https://github.com/dineshingale/File-organizer.git
    cd File-organizer
    ```

2.  Create and activate a virtual environment:
    ```bash
    python -m venv .venv
    # Windows
    .venv\Scripts\Activate.ps1
    # Linux/Mac
    source .venv/bin/activate
    ```

3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

### 2. Frontend Setup

1.  Navigate to the dashboard directory:
    ```bash
    cd dashboard
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

## 🏃‍♂️ Running the Application

You need to run both the backend API and the frontend dev server.

### Start the Backend API

From the root directory:
```bash
python -m uvicorn src.server:app --port 8001 --reload
```
The API will be available at `http://localhost:8001`.

### Start the Dashboard

From the `dashboard` directory:
```bash
npm run dev
```
The UI will be available at `http://localhost:5173` (or the port shown in terminal).

## 📖 Usage

1.  Open the Dashboard in your browser.
2.  Paste the full path of the folder you want to organize (e.g., `C:/Users/YourName/Downloads`).
3.  Click **"Organize Files Now"**.
4.  Watch the files get sorted into folders (`Documents/`, `Images/`, etc.) in real-time!

## ⚙️ Configuration

Edit `config/rules.yaml` to customize categories:

```yaml
categories:
  Images:
    - .jpg
    - .png
    - .webp
  Documents:
    - .pdf
    - .docx
```

## 🤝 Contributing

1.  Create an Issue.
2.  Branch off `main` (`feat/issue-ID-description`).
3.  Commit your changes.
4.  Open a Pull Request.

---
**License**: MIT
