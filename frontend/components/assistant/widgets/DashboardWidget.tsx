import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

const DashboardWidget = ({
  id,
  title,
  bg,
  bghover,
  children,
  className,
}: {
  id?: string;
  title?: string;
  bg?: string;
  bghover?: string;
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
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
          <CardContent className="p-4 h-full w-full">{children}</CardContent>
        )}
      </Card>
    </div>
  );
};

export default DashboardWidget;
