"use client";

import { useState } from "react";

// ✅ Define the API response type
type SummaryResponse = {
  success: boolean;
  url: string;
  summary: string;
  summaryUrdu: string;
  length: number;
};

export default function Home() {
  // ✅ State for URL input
  const [url, setUrl] = useState<string>("");
  // ✅ State for summary data
  const [summaryData, setSummaryData] = useState<SummaryResponse | null>(null);
  // ✅ State for loading indicator
  const [loading, setLoading] = useState<boolean>(false);

  // ✅ Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url) {
      alert("Please enter a blog URL");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch summary");
      }

      const data: SummaryResponse = await response.json();
      setSummaryData(data);
    } catch (error) {
      console.error("Error fetching summary:", error);
      alert("An error occurred while fetching the summary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">
        📝 Blog Summarizer
      </h1>

      {/* URL Input Form */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 mb-4 w-full max-w-xl"
      >
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter blog URL"
          className="flex-grow border border-gray-300 rounded px-3 py-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Summarizing..." : "Summarize"}
        </button>
      </form>

      {/* Display Summary */}
      {summaryData && (
        <div className="w-full max-w-2xl bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            📄 English Summary
          </h2>
          <p className="text-gray-700">{summaryData.summary}</p>

          <h2 className="text-xl font-semibold mt-4 mb-2 text-gray-800">
            🌐 Urdu Summary
          </h2>
          <p className="text-gray-700">{summaryData.summaryUrdu}</p>

          <p className="text-sm text-gray-500 mt-4">
            🔗 URL:{" "}
            <a
              href={summaryData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {summaryData.url}
            </a>
          </p>
        </div>
      )}
    </main>
  );
}
