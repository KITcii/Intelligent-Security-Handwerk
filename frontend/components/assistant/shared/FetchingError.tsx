import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const FetchingError = () => {
  return (
    <Alert className="w-full flex flex-row gap-4 items-center">
      <i className="material-symbols-outlined md-2xl text-contrast-neutral">
        warning
      </i>
      <div>
        <AlertTitle className="text-base">
          Die Daten konnten nicht geladen werden!
        </AlertTitle>
        <AlertDescription className="text-base">
          Bitte versuchen Sie es zu einem spätern Zeitpunkt erneut.
        </AlertDescription>
      </div>
    </Alert>
  );
};

export default FetchingError;
