type Props = {
  error?: string;
  imported?: string;
  skipped?: string;
};

export default function ImportFeedback({ error, imported, skipped }: Props) {
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 font-medium">Import failed</p>
        <p className="text-red-700 text-sm mt-1 break-all">
          {(() => {
            try {
              return decodeURIComponent(error);
            } catch {
              return error;
            }
          })()}
        </p>
      </div>
    );
  }

  if (imported) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-800 font-medium">
          Successfully imported {imported} {parseInt(imported) === 1 ? "item" : "items"}
          {skipped ? ` (${skipped} skipped)` : ""}
        </p>
      </div>
    );
  }

  return null;
}
