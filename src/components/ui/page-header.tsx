import { ReactNode } from 'react';
import { Button } from './button';
import Link from 'next/link';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
  children?: ReactNode;
}

export function PageHeader({ title, description, action, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 pb-6 border-b mb-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        {action && (
          <Button asChild>
            <Link href={action.href}>{action.label}</Link>
          </Button>
        )}
      </div>
      {children}
    </div>
  );
}
