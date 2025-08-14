import ProgressBar from "@/components/shared/ProgressBar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFormStatus } from "react-dom";

const SubmitFormButton = ({ className }: { className?: string }) => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className={cn("button-success", className)}
      disabled={pending}
      aria-disabled={pending}
    >
      {pending ? (
        <>
          <span>Speichern...</span>
          <ProgressBar
            progress={50}
            spinner={true}
            style="bold"
            className="w-6 ms-3"
          />
        </>
      ) : (
        "Änderung speichern"
      )}
    </Button>
  );
};

export default SubmitFormButton;
