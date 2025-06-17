"use client";

import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

export interface PageHeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  action?: {
    label: string;
    icon?: LucideIcon;
    onClick?: () => void;
    href?: string;
    variant?:
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | "link";
    size?: "default" | "sm" | "lg" | "icon";
    disabled?: boolean;
  };
  children?: React.ReactNode;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  breadcrumbs,
  action,
  children,
  className = "",
}) => {
  const ActionIcon = action?.icon;

  const renderAction = () => {
    if (!action) return null;

    const buttonContent = (
      <>
        {ActionIcon && <ActionIcon className=" h-4 w-4" />}
        {action.label}
      </>
    );

    if (action.href) {
      return (
        <Button
          size={action.size || "lg"}
          variant={action.variant || "default"}
          disabled={action.disabled}
          asChild
        >
          <a href={action.href}>{buttonContent}</a>
        </Button>
      );
    }

    return (
      <Button
        size={action.size || "lg"}
        variant={action.variant || "default"}
        onClick={action.onClick}
        disabled={action.disabled}
      >
        {buttonContent}
      </Button>
    );
  };

  const renderBreadcrumbs = () => {
    if (!breadcrumbs || breadcrumbs.length <= 1) return null;

    return (
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {item.isCurrentPage ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={item.href || "#"}>
                    {item.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    );
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mt-4">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>

        <div className="flex items-center gap-2">
          {children}
          {renderAction()}
        </div>
      </div>
      {renderBreadcrumbs()}
    </div>
  );
};

export default PageHeader;
