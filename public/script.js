const input = document.getElementById("searchInput");
const resultsDiv = document.getElementById("results");

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") search();
});

async function search() {
  const query = input.value.trim();

  if (!query) {
    resultsDiv.innerHTML = "<p>Type something first 👀</p>";
    return;
  }

  resultsDiv.innerHTML = "<p>Searching...</p>";

  try {
    const res = await fetch(`/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();

    if (!data.length) {
      resultsDiv.innerHTML = "<p>No results found 😢</p>";
      return;
    }

    resultsDiv.innerHTML = data.map(item => `
      <div class="result">
        <a href="${item.url}" target="_blank" rel="noopener noreferrer">
          ${item.title}
        </a>
      </div>
    `).join("");

  } catch (err) {
    resultsDiv.innerHTML = "<p>Something went wrong ⚠️</p>";
  }
}
