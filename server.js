import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(
  cors({
    origin: [
      "https://meeshovideodl.online",
      "http://meeshovideodl.online"
    ]
  })
);

app.use(express.json());

app.post("/api/download", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.json({ error: "No URL provided" });

    const response = await fetch(url);
    const buffer = await response.buffer();

    res.set({
      "Content-Type": "video/mp4",
      "Content-Disposition": "attachment; filename=meesho_video.mp4"
    });

    res.send(buffer);
  } catch (e) {
    res.json({ error: "Download failed" });
  }
});

app.get("/", (req, res) => {
  res.send("Backend running.");
});

app.listen(PORT, () => console.log("Server running on port " + PORT));
