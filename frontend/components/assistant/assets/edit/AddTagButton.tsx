import ProgressBar from "@/components/shared/ProgressBar";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

const AddTagButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="button-success"
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
        <>
          <i className="material-symbols-outlined md-s me-1 bold">add</i>{" "}
          <span>Tag hinzufügen</span>
        </>
      )}
    </Button>
  );
};

export default AddTagButton;
