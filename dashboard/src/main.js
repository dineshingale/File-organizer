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
      ? 'text-[#d93025] flex items-center gap-2' // Google Red
      : 'text-[#188038] flex items-center gap-2'; // Google Green

    // Add success/error icon
    const icon = document.createElement('span');
    icon.innerHTML = isError
      ? '<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
      : '<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';

    li.prepend(icon);
    li.appendChild(document.createTextNode(item));

    logList.appendChild(li);
  });
}

function showError(msg) {
  const li = document.createElement('li');
  li.className = 'text-red-500 font-bold bg-red-900/20 p-2 rounded';
  li.textContent = `Error: ${msg}`;
  resultsArea.classList.remove('hidden');
  logList.appendChild(li);
}
