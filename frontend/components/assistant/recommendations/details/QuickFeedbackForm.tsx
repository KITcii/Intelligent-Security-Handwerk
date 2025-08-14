"use client";

import ProgressBar from "@/components/shared/ProgressBar";
import { Button } from "@/components/ui/button";
import { FORM_UPDATE_ERROR } from "@/constants/dialog";
import { sendRecommendationPerception } from "@/lib/actions/recommendations.action";
import { RecommendationPerception } from "@/types/assistant";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";

const QuickFeedbackForm = ({
  recommendationId,
}: {
  recommendationId: string;
}) => {
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);

  const handleAction = async (
    id: string,
    perception: RecommendationPerception
  ) => {
    const response = await sendRecommendationPerception(id, perception);
    if (response.success) {
      setSubmitted(true);
    } else {
      toast.error(response.message ?? FORM_UPDATE_ERROR);
    }
  };

  return (
    <div className="flex flex-row gap-6 items-center justify-end pe-6">
      {submitted ? (
        <div className="text-center sm:text-right">
          <p className="font-semibold mb-2 text-lg text-highlight-100">
            Vielen Dank für Ihre Rückmeldung!
          </p>
          <p>
            Ihr Feedback hilft uns dabei, diese Handlungsempfehlungen weiter zu
            verbessern.
          </p>
          <p>
            Falls Sie uns noch weiter unterstützen möchten, können Sie uns{" "}
            <Link href="#feedback" className="inline-link">
              <b>hier</b>
            </Link>{" "}
            Ihre Meinung genauer schildern.
          </p>
        </div>
      ) : (
        <>
          <div className="min-h-10 flex items-center justify-center max-[450px]:flex-col max-[450px]:gap-6">
            {isPending ? (
              <ProgressBar
                progress={50}
                spinner={true}
                style="bold"
                className="w-8"
              />
            ) : (
              <>
                <span className="font-semibold me-5">
                  Ist diese Handlungsempfehlung hilfreich?
                </span>
                <div className="flex flex-row gap-3">
                  <Button
                    variant="outline"
                    className="flex flex-row items-center"
                    onClick={() => {
                      startTransition(() => {
                        handleAction(recommendationId, "good").catch(() => {
                          toast.error(FORM_UPDATE_ERROR);
                        });
                      });
                    }}
                  >
                    <i className="material-symbols-outlined md-m text-highlight-100 filled me-2">
                      thumb_up
                    </i>
                    Ja
                  </Button>
                  <Button
                    variant="outline"
                    className="flex flex-row items-center"
                    onClick={() => {
                      startTransition(() => {
                        handleAction(recommendationId, "bad").catch(() => {
                          toast.error(FORM_UPDATE_ERROR);
                        });
                      });
                    }}
                  >
                    <i className="material-symbols-outlined md-m text-highlight-100 filled me-2">
                      thumb_down
                    </i>
                    Nein
                  </Button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default QuickFeedbackForm;
