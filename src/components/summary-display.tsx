export default function SummaryDisplay({ data }: { data: any }) {
  if (!data) return null;

  return (
    <div className="mt-4 p-4 border rounded bg-gray-50">
      <h2 className="text-xl font-bold mb-2">English Summary</h2>
      <p>{data.summary}</p>

      <h2 className="text-xl font-bold mt-4 mb-2">Urdu Summary</h2>
      <p>{data.summaryUrdu}</p>
    </div>
  );
}
