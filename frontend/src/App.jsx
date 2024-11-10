import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [url, setUrl] = useState('');
    const [n, setN] = useState(10);
    const [words, setWords] = useState([]);
    const [readabilityScore, setReadabilityScore] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setReadabilityScore(null);

        try {
            const response = await axios.post('http://localhost:3000/api/frequent-words', { url, n });
            setWords(response.data.words);
            setReadabilityScore(response.data.readabilityScore.toFixed(2));  // Format to 2 decimal places
        } catch (err) {
            setError('Failed to fetch word frequencies. Please check the URL or try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-400 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-slate-200 rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-4 text-center">Top N Word Frequency Analyzer</h1>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">URL</label>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Enter a URL"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Top N Words</label>
                        <input
                            type="number"
                            value={n}
                            onChange={(e) => setN(e.target.value)}
                            placeholder="10"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
                        disabled={loading}
                    >
                        {loading ? 'Analyzing...' : 'Analyze'}
                    </button>
                </form>

                {error && <p className="text-red-500 text-center mt-4">{error}</p>}

                {words.length > 0 && (
                    <div className="mt-6">
                        <h2 className="text-xl font-bold text-gray-700 mb-2">Top {n} Words</h2>
                        <table className="min-w-full bg-slate-300 border border-gray-300 rounded-md">
                            <thead>
                                <tr>
                                    <th className="border px-4 py-2">Word</th>
                                    <th className="border px-4 py-2">Frequency</th>
                                </tr>
                            </thead>
                            <tbody>
                                {words.map((wordObj, index) => (
                                    <tr key={index} className="text-center">
                                        <td className="border px-4 py-2">{wordObj.word}</td>
                                        <td className="border px-4 py-2">{wordObj.count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {readabilityScore && (
                    <div className="mt-4">
                        <h2 className="text-xl font-bold text-gray-700 mb-2">Readability Score</h2>
                        <p className="text-lg text-center">{readabilityScore}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
