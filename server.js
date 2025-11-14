import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors({
    origin: [
        "https://meeshovideodl.online",
        "http://localhost:3000"
    ]
}));
app.use(express.json());

// Function to follow redirects from Meesho short links
async function expandShortURL(shortURL) {
    try {
        const response = await fetch(shortURL, { redirect: "follow" });
        return response.url; // final expanded URL
    } catch (error) {
        return null;
    }
}

app.post('/api/download', async (req, res) => {
    let { url } = req.body;

    // Step 1: Expand Meesho Shortlink
    if (url.includes("meesho.co") || url.includes("link.meesho.co")) {
        const expanded = await expandShortURL(url);
        if (expanded) url = expanded;
    }

    try {
        const response = await fetch(url);
        const html = await response.text();

        // Step 2: Extract actual video link from HTML
        const regex = /"videoUrl":"(https:[^"]+)"/;
        const match = html.match(regex);

        if (!match) {
            return res.json({ success: false, message: "Video URL not found!" });
        }

        let videoUrl = match[1].replace(/\\u002F/g, "/");

        return res.json({
            success: true,
            video: videoUrl
        });

    } catch (error) {
        return res.json({ success: false, message: "Error fetching video!" });
    }
});

app.get("/", (req, res) => {
    res.send("Meesho Video Downloader Backend Running");
});

app.listen(process.env.PORT || 8080, () =>
    console.log("Server running on port 8080")
);
