"use client";

import { useState } from "react";
import UrlInput from "@/components/url-input";
import SummaryDisplay from "@/components/summary-display";

export default function BlogSummarizer() {
  const [summaryData, setSummaryData] = useState(null);

  return (
    <div className="w-full max-w-2xl p-4 bg-white rounded shadow">
      <UrlInput onSummary={setSummaryData} />
      <SummaryDisplay data={summaryData} />
    </div>
  );
}
