import { cn } from "@/lib/utils";
import type { Column, TrendCellData } from "@/lib/types";

interface DataTableProps {
  columns: Column[];
  rows: Record<string, unknown>[];
  highlightRowIndex?: number[];
  firstColumnBold?: boolean;
}

const alignClass = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
} as const;

export function DataTable({
  columns,
  rows,
  highlightRowIndex = [],
  firstColumnBold = true,
}: DataTableProps) {
  return (
    <div className="bg-white border border-border rounded-card shadow-card overflow-hidden">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "font-sans font-semibold text-steel-500 uppercase",
                  "text-[11px] tracking-[0.8px] py-[10px] px-3",
                  alignClass[col.align],
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const highlighted = highlightRowIndex.includes(i);
            return (
              <tr
                key={i}
                className={cn(
                  "border-b border-[#F1F3F5] transition-colors duration-100 hover:bg-[#FAFBFC]",
                  highlighted && "bg-[#F8FAFC]",
                )}
              >
                {columns.map((col, j) => {
                  const cell = row[col.key];
                  const isFirst = j === 0;
                  const shouldBold = highlighted || (isFirst && firstColumnBold);

                  if (col.type === "trend") {
                    const t = cell as TrendCellData;
                    const color =
                      t.tone === "positive"
                        ? "text-green-600"
                        : t.tone === "negative"
                        ? "text-red-600"
                        : "text-amber-600";
                    return (
                      <td
                        key={col.key}
                        className={cn(
                          "py-[10px] px-3 font-mono text-[13px] font-semibold",
                          alignClass[col.align],
                          color,
                        )}
                      >
                        {t.value}
                      </td>
                    );
                  }

                  const isNumber = col.type === "number";
                  return (
                    <td
                      key={col.key}
                      className={cn(
                        "py-[10px] px-3 text-carbon text-[13px]",
                        isNumber
                          ? "font-mono font-semibold"
                          : "font-sans font-medium",
                        alignClass[col.align],
                        shouldBold && "font-semibold",
                      )}
                    >
                      {cell as React.ReactNode}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
