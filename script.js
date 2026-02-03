let showcases = {};
let favorites = [];

// Status update helper
function setStatus(text, type) {
  const status = document.getElementById('status');
  status.innerText = text;
  status.className = `status ${type || ''}`;
}

// Load JSON
setStatus("Loading data...", "loading");

fetch('showcases.json')
  .then(res => res.json())
  .then(data => {
    showcases = data;
    setStatus("Data loaded. Ready!", "ready");
  })
  .catch(() => {
    setStatus("Failed to load showcases.json", "error");
    document.getElementById('result').innerHTML =
      '<div class="error">Failed to load showcases.json</div>';
  });

// Load favorites
function loadFavorites() {
  favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
}
loadFavorites();

// Save favorites
function saveFavorites() {
  localStorage.setItem('favorites', JSON.stringify(favorites));
  renderFavorites();
}

document.getElementById('findBtn').addEventListener('click', findShowcase);
document.getElementById('randomBtn').addEventListener('click', randomLevel);
document.getElementById('favBtn').addEventListener('click', addFavorite);

document.getElementById('levelId').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') findShowcase();
});

document.getElementById('levelId').addEventListener('input', () => {
  showSuggestions();
});

function findShowcase() {
  const id = document.getElementById('levelId').value.trim();
  const result = document.getElementById('result');
  const video = document.getElementById('video');

  result.innerHTML = '';
  video.innerHTML = '';
  video.style.display = 'none'; // hide by default

  if (!id) {
    result.innerHTML = '<div class="error">Please enter a Level ID.</div>';
    return;
  }

  const ytId = showcases[id];

  if (!ytId) {
    result.innerHTML =
      '<div class="error">No showcase found for this Level ID.</div>';
    showClosestMatches(id);
    return;
  }

  const url = `https://youtube.com/watch?v=${ytId}`;

  result.innerHTML = `
    <div>Showcase found:</div>
    <a class="link" id="ytLink" href="${url}" target="_blank">${url}</a>
    <button class="copy-btn" id="copyBtn">Copy</button>
    <span id="copiedText" class="copied" style="display:none;">Copied!</span>
  `;

  document.getElementById('copyBtn').addEventListener('click', () => {
    navigator.clipboard.writeText(url).then(() => {
      const copiedText = document.getElementById('copiedText');
      copiedText.style.display = 'inline';

      setTimeout(() => {
        copiedText.style.display = 'none';
      }, 1200);
    });
  });

  // Show the iframe only when we have a video
  video.style.display = 'block';
  video.innerHTML = `
    <iframe
      src="https://www.youtube.com/embed/${ytId}"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen>
    </iframe>
  `;
}

function randomLevel() {
  const ids = Object.keys(showcases);
  const randomId = ids[Math.floor(Math.random() * ids.length)];
  document.getElementById('levelId').value = randomId;
  findShowcase();
}

function addFavorite() {
  const id = document.getElementById('levelId').value.trim();
  if (!id) return;

  if (!favorites.includes(id)) {
    favorites.push(id);
    saveFavorites();
  }
}

function renderFavorites() {
  const list = document.getElementById('favoritesList');
  list.innerHTML = '';

  if (favorites.length === 0) {
    list.innerHTML = '<div class="muted">No favorites yet.</div>';
    return;
  }

  favorites.forEach(id => {
    const ytId = showcases[id];
    const url = ytId ? `https://youtube.com/watch?v=${ytId}` : '#';

    const item = document.createElement('div');
    item.className = 'fav-item';

    item.innerHTML = `
      <a href="${url}" target="_blank">${id}</a>
      <button onclick="removeFavorite('${id}')">Remove</button>
    `;

    item.querySelector('a').addEventListener('click', (e) => {
      if (!ytId) {
        e.preventDefault();
        alert('No showcase available for this ID anymore.');
        return;
      }
      document.getElementById('levelId').value = id;
      findShowcase();
    });

    list.appendChild(item);
  });
}

function removeFavorite(id) {
  favorites = favorites.filter(f => f !== id);
  saveFavorites();
}

function showSuggestions() {
  const input = document.getElementById('levelId').value.trim();
  const suggestions = document.getElementById('suggestions');

  if (!input) {
    suggestions.innerHTML = '';
    return;
  }

  const ids = Object.keys(showcases);
  const matches = ids.filter(id => id.startsWith(input)).slice(0, 5);

  if (matches.length === 0) {
    suggestions.innerHTML = '';
    return;
  }

  suggestions.innerHTML = `Suggestions: ${matches.join(', ')}`;
}

function showClosestMatches(inputId) {
  const ids = Object.keys(showcases);

  const closest = ids
    .sort((a, b) => levenshteinDistance(a, inputId) - levenshteinDistance(b, inputId))
    .slice(0, 5);

  const suggestions = document.getElementById('suggestions');
  suggestions.innerHTML = `Closest matches: ${closest.join(', ')}`;
}

// Simple Levenshtein distance
function levenshteinDistance(a, b) {
  const matrix = Array.from({ length: b.length + 1 }, () => []);

  for (let i = 0; i <= b.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// Render favorites on load
renderFavorites();
