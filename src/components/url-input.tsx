/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React from "react";

// ✅ Define prop types
type UrlInputProps = {
  url: string;
  setUrl: (url: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
};

const UrlInput: React.FC<UrlInputProps> = ({
  url,
  setUrl,
  handleSubmit,
  loading,
}) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 mb-4 w-full max-w-xl"
    >
      <input
        type="text"
        placeholder="Enter blog URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Summarizing..." : "Summarize"}
      </button>
    </form>
  );
};

export default UrlInput;
