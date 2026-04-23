import React from "react";

export const Column = ({
  key,
  label,
  renderCell,
  className,
  expandable = false,
}: {
  key: string;
  label: string;
  renderCell?: (value: unknown, item: unknown) => React.ReactNode;
  className?: string;
  expandable?: boolean;
}) => ({ key, label, renderCell, className, expandable });

export type ColumnType = {
  key: string;
  label: string;
  renderCell?: (value: unknown, item: unknown) => React.ReactNode;
  className?: string;
  expandable?: boolean;
};
