import React from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from './button';
import { cn } from '../../utils/cn';

// Helper function to check if a path is external (starts with /novatrace)
const isExternalPath = (href: string) => {
  return href.startsWith('/novatrace') || href === '/';
};

// Helper function to navigate to external paths
const navigateToExternal = (href: string) => {
  window.parent.postMessage({ type: 'navigate', path: href }, '*');
};

interface NavigationItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'lg';
  variant?: 'default' | 'ghost';
}

interface NavigationProps {
  items: NavigationItem[];
  className?: string;
}

export function Navigation({ items, className }: NavigationProps) {
  const [location] = useLocation();
  console.log(items);

  return (
    <nav className={cn("flex items-center space-x-1", className)}>
      {items.map((item) => {
        const isActive = location === item.href;
        const isExternal = isExternalPath(item.href);
        
        if (isExternal) {
          return (
            <Button
              key={item.href}
              variant={isActive ? "ghost" : "default"}
              size="lg"
              onClick={() => navigateToExternal(item.href)}
              className={cn(
                "flex items-center space-x-2",
                isActive && "bg-primary text-primary-foreground"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Button>
          );
        }
        
        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant={isActive ? "ghost" : item.variant || "default"}
              size={item.size || "lg"}
              className={cn(
                "flex items-center space-x-2",
                isActive && "bg-primary text-primary-foreground"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}

export function BreadcrumbNavigation({ items }: { items: NavigationItem[] }) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
      {items.map((item, index) => {
        const isExternal = isExternalPath(item.href);
        
        return (
          <React.Fragment key={item.href}>
            {isExternal ? (
              <span 
                className="hover:text-foreground transition-colors cursor-pointer"
                onClick={() => navigateToExternal(item.href)}
              >
                {item.label}
              </span>
            ) : (
              <Link href={item.href}>
                <span className="hover:text-foreground transition-colors cursor-pointer">
                  {item.label}
                </span>
              </Link>
            )}
            {index < items.length - 1 && (
              <span>/</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
