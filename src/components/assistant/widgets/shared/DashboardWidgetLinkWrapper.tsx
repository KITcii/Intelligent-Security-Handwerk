import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

const DashboardWidgetLinkWrapper = ({
  href,
  className,
  children,
}: {
  href?: string;
  className?: string;
  children?: React.ReactNode;
}) => {
  if (href !== undefined) {
    return (
      <Link href={href} className={cn(className)}>
        {children}
      </Link>
    );
  }
  return <>{children}</>;
};

export default DashboardWidgetLinkWrapper;
