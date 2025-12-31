#!/bin/bash
cd "$(dirname "$0")/.."

if [ -d "venv" ]; then
    source venv/bin/activate
fi

python3 src/main.py
echo "Organization complete at $(date)"
