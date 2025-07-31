import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import DashboardWidgetLinkWrapper from "./DashboardWidgetLinkWrapper";

const DashboardWidgetWrapper = ({
  id,
  title,
  bg,
  bghover,
  children,
  href,
  className,
  contentClassName,
}: {
  id?: string;
  title?: string;
  bg?: string;
  bghover?: string;
  children?: React.ReactNode;
  href?: string;
  className?: string;
  contentClassName?: string;
}) => {
  return (
    <DashboardWidgetLinkWrapper href={href} className={className}>
      <div
        className={cn("flex-1 w-auto overflow-hidden", className)}
        id={id ? id : `widget_${Math.ceil(Math.random() * 1000000)}`}
      >
        <Card className={cn("drop-shadow-soft-3 h-full", bg, bghover)}>
          {title && (
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
          )}

          {children && (
            <CardContent className="p-4 h-full w-full">
              <div className={cn(contentClassName)}>{children}</div>
            </CardContent>
          )}
        </Card>
      </div>
    </DashboardWidgetLinkWrapper>
  );
};

export default DashboardWidgetWrapper;
