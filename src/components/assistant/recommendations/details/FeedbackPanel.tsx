import React from "react";
import BackgroundPanel from "../../shared/BackgroundPanel";
import FeedbackForm from "../FeedbackForm";

const FeedbackPanel = ({ recommendationId }: { recommendationId: string }) => {
  return (
    <BackgroundPanel
      title="Ihre Meinung oder Verbesserungsvorschläge zu dieser Handlungsempfehlung"
      contentClassName="ps-9"
    >
      <div id="feedback">
        <FeedbackForm recommendationId={recommendationId} />
      </div>
    </BackgroundPanel>
  );
};

export default FeedbackPanel;
