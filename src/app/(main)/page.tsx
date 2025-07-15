"use client";

import { useState } from "react";

type SummaryResponse = {
  success: boolean;
  url: string;
  summary: string;
  summaryUrdu: string;
  length: number;
};

export default function HomePage() {
  const [url, setUrl] = useState<string>("");
  const [data, setData] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url) return alert("Please enter a blog URL");

    setLoading(true);
    setData(null);

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) throw new Error("Failed to fetch summary");

      const json: SummaryResponse = await res.json();
      setData(json);
    } catch (error: unknown) {
      alert((error as Error).message || "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        📝 Blog Summarizer
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex gap-2 w-full max-w-xl mb-6"
      >
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter blog URL here"
          className="flex-grow border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Summarizing..." : "Summarize"}
        </button>
      </form>

      {data && (
        <div className="w-full max-w-2xl bg-white shadow rounded p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {"📄 English Summary"}
          </h2>
          <p className="text-gray-700 mb-4">{data.summary}</p>

          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {"🌐 Urdu Summary"}
          </h2>
          <p className="text-gray-700">{data.summaryUrdu}</p>

          <p className="text-sm text-gray-500 mt-4">
            🔗 URL:{" "}
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {data.url}
            </a>
          </p>
        </div>
      )}
    </main>
  );
}
