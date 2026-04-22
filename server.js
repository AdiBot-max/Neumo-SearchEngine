const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

const EXA_API = process.env.EXA_API;

if (!EXA_API) {
  console.warn("⚠️ EXA_API not found. Search will fail.");
}

app.get("/search", async (req, res) => {
  const query = req.query.q;

  if (!query || query.trim() === "") {
    return res.json([]);
  }

  if (!EXA_API) {
    return res.status(500).json({
      error: "Server missing EXA_API"
    });
  }

  try {
    const response = await fetch("https://api.exa.ai/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${EXA_API}`
      },
      body: JSON.stringify({
        query: query,
        numResults: 10
      })
    });

    const data = await response.json();

    if (!data.results) {
      return res.json([]);
    }

    const results = data.results.map(item => ({
      title: item.title || "No title",
      url: item.url || "#"
    }));

    res.json(results);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Search failed"
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
