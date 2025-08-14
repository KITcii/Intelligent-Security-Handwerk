"use client";
import { Button } from "@/components/ui/button";
import { cn, formUrlQuery } from "@/lib/utils";
import { AssetVariants } from "@/types/assistant";
import { useRouter, useSearchParams } from "next/navigation";

const ListSelectedFilter = ({
  active,
  variant,
  className,
}: {
  active: boolean;
  variant: AssetVariants;
  className?: string;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const toggleFilter = () => {
    const newUrl = formUrlQuery({
      params: searchParams?.toString() || "",
      data: [{ key: "selected", value: !active ? "true" : "false" }],
    });
    router.replace(newUrl, { scroll: false });
  };

  return (
    <Button
      className={cn(active ? "button-success" : "button-subtle", className)}
      onClick={toggleFilter}
    >
      <i className="material-symbols-outlined md-m me-2">
        {active ? "check_box" : "check_box_outline_blank"}
      </i>{" "}
      Nur meine{" "}
      {variant === "infrastructure"
        ? "Komponenten"
        : variant === "measures"
          ? "Maßnahmen"
          : "Auswahl"}
    </Button>
  );
};

export default ListSelectedFilter;
