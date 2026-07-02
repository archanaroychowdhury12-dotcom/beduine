import React from "react";
import { cn } from "../utils/cn";

interface Column {
  key: string;
  label: string;
  className?: string;
}

interface DataTableProps {
  columns: Column[];
  children: React.ReactNode;
  className?: string;
  emptyText?: string;
}

export function DataTable({ columns, children, className, emptyText = "No records found" }: DataTableProps) {
  const childCount = React.Children.count(children);
  const hasRows = childCount > 0;

  const animatedChildren = React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return child;
    const props = child.props as { className?: string; style?: React.CSSProperties };
    return React.cloneElement(child as React.ReactElement<any>, {
      className: cn(props.className, "transition-all duration-200 hover:bg-secondary-light/35"),
      style: { ...props.style, animationDelay: `${index * 50}ms` },
    });
  });

  return (
    <div className={cn("w-full overflow-x-auto rounded-2xl border border-border bg-white shadow-sm shadow-blue-950/5", className)}>
      <table className="w-full min-w-[720px] text-left text-[13px]">
        <thead className="bg-[#F0F6FF]">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={cn("px-4 py-3 text-[11px] font-black uppercase tracking-[0.14em] text-text-secondary", col.className)}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/70 bg-white">
          {hasRows ? (
            animatedChildren
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center font-semibold text-text-secondary">
                {emptyText}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
