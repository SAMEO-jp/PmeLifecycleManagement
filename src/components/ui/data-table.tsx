'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';
import { Button } from './button';
import { Edit, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';

export interface DataTableColumn<T> {
  key: string;
  label: string;
  render?: (value: unknown, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
  getEditHref?: (row: T) => string;
  getViewHref?: (row: T) => string;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  onEdit,
  onDelete,
  onView,
  getEditHref,
  getViewHref,
  isLoading = false,
  emptyMessage = 'データがありません',
}: DataTableProps<T>) {
  const hasActions = onEdit || onDelete || onView || getEditHref || getViewHref;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key}>{column.label}</TableHead>
            ))}
            {hasActions && <TableHead className="text-right">操作</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {column.render
                    ? column.render(row[column.key], row)
                    : String(row[column.key] ?? '')}
                </TableCell>
              ))}
              {hasActions && (
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {(onView || getViewHref) && (
                      <>
                        {getViewHref ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                          >
                            <Link href={getViewHref(row)}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onView?.(row)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                      </>
                    )}
                    {(onEdit || getEditHref) && (
                      <>
                        {getEditHref ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                          >
                            <Link href={getEditHref(row)}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit?.(row)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(row)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
