import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(cors({
    origin: [
        "https://meeshovideodl.online",
        "http://localhost:3000"
    ]
}));

app.use(express.json());

// Expand Meesho short URL
async function expandShortURL(shortURL) {
    try {
        const response = await fetch(shortURL, { redirect: "follow" });
        return response.url;
    } catch (e) {
        return null;
    }
}

app.post("/api/download", async (req, res) => {
    let { url } = req.body;

    // Expand short links
    if (url.includes("meesho.co")) {
        const expandedURL = await expandShortURL(url);
        if (expandedURL) url = expandedURL;
    }

    try {
        const response = await fetch(url);
        const html = await response.text();

        // Extract Video URL
        const match = html.match(/"videoUrl":"(https:[^"]+)"/);

        if (!match) {
            return res.json({ success: false, message: "Video URL not found!" });
        }

        const videoUrl = match[1].replace(/\\u002F/g, "/");

        return res.json({
            success: true,
            video: videoUrl
        });

    } catch (e) {
        return res.json({ success: false, message: "Server error!" });
    }
});

app.listen(process.env.PORT || 8080, () =>
    console.log("Backend running...")
);
