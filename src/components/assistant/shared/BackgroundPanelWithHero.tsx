import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

const BackgroundPanelWithHero = ({
  title,
  bg,
  textColor,
  className,
  heroImg = "bg-contrast-neutral",
  url,
  children,
}: {
  title?: string;
  bg?: string;
  textColor?: string;
  className?: string;
  heroImg?: string;
  url?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className={cn("flex-auto w-auto", className)}>
      <Card className={cn("drop-shadow-soft-3 h-full", bg, textColor)}>
        <Link href={url ? url : ""}>
          <CardHeader
            style={{ backgroundImage: `url(${heroImg})` }}
            className={cn("bg-cover w-full h-44", "flex justify-center")}
          >
            {title && (
              <CardTitle className="text-5xl max-sm:text-4xl text-tc-contrast">
                {title}
              </CardTitle>
            )}
          </CardHeader>
        </Link>
        {children && (
          <CardContent className="p-5 ps-7 h-full">{children}</CardContent>
        )}
      </Card>
    </div>
  );
};

export default BackgroundPanelWithHero;
