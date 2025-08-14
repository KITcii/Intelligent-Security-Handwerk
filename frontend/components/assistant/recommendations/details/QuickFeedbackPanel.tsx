import BackgroundPanel from "../../shared/BackgroundPanel";
import QuickFeedbackForm from "./QuickFeedbackForm";

const QuickFeedbackPanel = ({
  recommendationId,
}: {
  recommendationId: string;
}) => {
  return (
    <BackgroundPanel>
      <QuickFeedbackForm recommendationId={recommendationId} />
    </BackgroundPanel>
  );
};

export default QuickFeedbackPanel;
