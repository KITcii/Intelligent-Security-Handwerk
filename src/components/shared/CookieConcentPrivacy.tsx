import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import Privacy from "./navigation/Privacy";

const CookieConcentPrivacy = ({
  variant,
  className,
}: {
  variant: "button" | "link";
  className?: string;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild={variant === "button"}>
        {variant === "button" ? (
          <Button className={cn("button-subtle", className)}>
            Datenschutzerklärung anzeigen
          </Button>
        ) : (
          variant === "link" && (
            <span className={cn("inline-link", className)}>
              Datenschutzerklärung
            </span>
          )
        )}
      </DialogTrigger>
      <DialogContent
        className="!min-w-[95%] !h-[95vh] overflow-auto"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <DialogHeader className="flex flex-row align-center justify-center">
          <DialogTitle className="text-3xl">Datenschutzerklärung</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="overflow-auto">
          <Privacy />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CookieConcentPrivacy;
