const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/api/frequent-words', async (req, res) => {
    const { url, n } = req.body;

    if (!url || !n) {
        return res.status(400).json({ error: 'URL and n are required' });
    }

    try {
        const response = await axios.get(url);
        const html = response.data;

        const $ = cheerio.load(html);
        const text = $('body').text();

        // Process text content for word frequency
        const words = text
            .toLowerCase()
            .replace(/[^a-z\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 1);

        const frequencyMap = {};
        words.forEach(word => {
            frequencyMap[word] = (frequencyMap[word] || 0) + 1;
        });

        const sortedWords = Object.entries(frequencyMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, n);

        const result = sortedWords.map(([word, count]) => ({ word, count }));

        // Calculate Flesch-Kincaid readability score
        const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [];
        const syllableCount = text
            .toLowerCase()
            .replace(/[^a-z\s]/g, '')
            .split(/\s+/)
            .reduce((count, word) => count + countSyllables(word), 0);

        const wordCount = words.length;
        const sentenceCount = sentences.length;
        const readabilityScore = 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (syllableCount / wordCount);

        res.json({ words: result, readabilityScore });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching or processing the URL' });
    }
});

// Helper function to count syllables in a word
function countSyllables(word) {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const syllables = word.match(/[aeiouy]{1,2}/g);
    return syllables ? syllables.length : 1;
}

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
