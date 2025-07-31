import { Suspense } from "react";
import AlertWidgetContent from "./AlertWidgetContent";
const AlertWidget = () => {
  return (
    // Suspense without fallback to not show any loading placeholder
    <Suspense>
      <AlertWidgetContent />
    </Suspense>
  );
};

export default AlertWidget;
