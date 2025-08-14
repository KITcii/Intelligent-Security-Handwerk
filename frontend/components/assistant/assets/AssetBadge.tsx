import { cn } from "@/lib/utils";

const AssetBadge = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactElement;
}) => {
  return (
    <div
      className={cn(
        "aspect-square grid content-center h-10 rounded-full text-tc-contrast text-center text-base hover:bg-tc-contrast hover:text-tc",
        className
      )}
    >
      {children}
    </div>
  );
};

export default AssetBadge;
