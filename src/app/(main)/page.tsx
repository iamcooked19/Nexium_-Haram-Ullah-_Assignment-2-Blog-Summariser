"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [summaryData, setSummaryData] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return alert("Please enter a URL");

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      setSummaryData(data);
    } catch (err) {
      console.error("Error fetching summary:", err);
      alert("Something went wrong! Check the console.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4 text-blue-600">Blog Summarizer</h1>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter blog URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Summarize
        </button>
      </form>
      {summaryData && (
        <div className="mt-4 p-4 border rounded bg-gray-50 w-full max-w-2xl">
          <h2 className="text-xl font-bold mb-2">English Summary</h2>
          <p>{summaryData.summary}</p>

          <h2 className="text-xl font-bold mt-4 mb-2">Urdu Summary</h2>
          <p>{summaryData.summaryUrdu}</p>
        </div>
      )}
    </main>
  );
}
