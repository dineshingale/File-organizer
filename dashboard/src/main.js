import './style.css'

const organizeBtn = document.getElementById('organize-btn');
const btnContent = document.getElementById('btn-content');
const btnLoader = document.getElementById('btn-loader');
const sourcePathInput = document.getElementById('source-path-input');
const resultsArea = document.getElementById('results-area');
const logList = document.getElementById('log-list');
const moveCountEl = document.getElementById('move-count');
const emptyState = document.getElementById('empty-state');

const API_URL = 'http://localhost:8001/api/organize';

organizeBtn.addEventListener('click', async () => {
  const path = sourcePathInput.value.trim();
  if (!path) {
    alert("Please enter a directory path!");
    return;
  }

  setLoading(true);
  resetUI();

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ source_path: path })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || 'Organization failed');
    }

    const data = await response.json();

    handleResults(data);

  } catch (error) {
    showError(error.message);
  } finally {
    setLoading(false);
  }
});

function setLoading(isLoading) {
  organizeBtn.disabled = isLoading;
  if (isLoading) {
    btnContent.classList.add('hidden');
    btnLoader.classList.remove('hidden');
  } else {
    btnContent.classList.remove('hidden');
    btnLoader.classList.add('hidden');
  }
}

function resetUI() {
  resultsArea.classList.add('hidden');
  emptyState.classList.add('hidden');
  logList.innerHTML = '';
}

function handleResults(data) {
  const moved = data.moved_files;
  const errors = data.errors;
  const total = moved.length + errors.length;

  if (total === 0) {
    emptyState.classList.remove('hidden');
    return;
  }

  resultsArea.classList.remove('hidden');
  moveCountEl.textContent = `${moved.length} files moved`;

  // Process logs animation
  let delay = 0;

  [...moved, ...errors].forEach((item, index) => {
    const isError = index >= moved.length;
    const li = document.createElement('li');
    li.className = isError
      ? 'text-red-400 border-l-2 border-red-500 pl-3 opacity-0 translate-x-4 transition-all duration-300'
      : 'text-emerald-400 border-l-2 border-emerald-500 pl-3 opacity-0 translate-x-4 transition-all duration-300';
    li.textContent = item;
    logList.appendChild(li);

    // Stagger animation
    setTimeout(() => {
      li.classList.remove('opacity-0', 'translate-x-4');
    }, delay);
    delay += 50;
  });
}

function showError(msg) {
  const li = document.createElement('li');
  li.className = 'text-red-500 font-bold bg-red-900/20 p-2 rounded';
  li.textContent = `Error: ${msg}`;
  resultsArea.classList.remove('hidden');
  logList.appendChild(li);
}
