import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

const ReinviteButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      variant="outline"
      type="submit"
      size="icon"
      disabled={pending}
      aria-disabled={pending}
      className="group"
    >
      <i className="material-symbols-outlined text-tc-muted hover:text-highlight-50 group-disabled:animate-reverse-spin">
        replay
      </i>
    </Button>
  );
};

export default ReinviteButton;
