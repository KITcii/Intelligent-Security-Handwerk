import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const BackgroundPanel = ({
  title,
  bg,
  textColor,
  className,
  contentClassName,
  children,
}: {
  title?: string;
  bg?: string;
  textColor?: string;
  className?: string;
  contentClassName?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className={cn("flex-auto w-auto", className)}>
      <Card
        className={cn(
          "p-6 drop-shadow-soft-3 h-fit",
          bg,
          textColor,
          contentClassName
        )}
      >
        {children && (
          <CardContent className="p-0 h-full ">
            {title && <h2 className="font-bold mb-3">{title}</h2>}
            {children}
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default BackgroundPanel;
