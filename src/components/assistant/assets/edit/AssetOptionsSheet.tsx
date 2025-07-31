"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Asset, AssetInstance, AssetVariants } from "@/types/assistant";
import React, { useContext, useEffect, useState, useTransition } from "react";
import { cn, removeKeysFromQuery } from "@/lib/utils";
import HoverInfoButton from "../../shared/HoverInfoButton";
import { getAssetInstanceById, getFullAssetById } from "@/lib/api/assets.api";
import ProgressBar from "@/components/shared/ProgressBar";
import { addAsset, deleteAsset } from "@/lib/actions/assets.action";
import { toast } from "sonner";
import SheetContentComponent from "./SheetContentComponent";
import SheetContentMeasure from "./SheetContentMeasure";
import FetchingError from "../../shared/FetchingError";
import { useRouter, useSearchParams } from "next/navigation";
import { NotificationsContext } from "@/contexts/NotificationsProvider";
import { toggelRecommendationRelevancy } from "@/lib/actions/recommendations.action";

const AssetOptionsSheet = ({
  variant,
  asset,
  children,
}: {
  variant: AssetVariants;
  asset: Asset;
  children: React.ReactNode;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [isPendingToggle, startTransitionToggle] = useTransition();
  const [open, setOpen] = useState(false);
  const [fullAsset, setFullAsset] = useState<Asset | undefined>(undefined);
  const { refreshRecommendationsCounter } = useContext(NotificationsContext);

  const refreshData = (instance?: AssetInstance) => {
    if (instance) {
      asset.asset = instance;
    } else {
      startTransition(() =>
        getAssetInstanceById({ id: asset.id, variant: variant })
          .then((result) => {
            if (result) {
              asset.asset = result;
            }
          })
          .catch(() => {})
      );
    }
  };

  useEffect(() => {
    // open automatically if asset id is requested directly from url
    const aid = searchParams?.get("aid");
    if (aid == asset.id) {
      setOpen(true);
    }
  }, [asset.id, searchParams]);

  useEffect(() => {
    if (open && fullAsset === undefined) {
      startTransition(() =>
        getFullAssetById({ id: asset.id, variant: variant })
          .then((result) => setFullAsset(result))
          .catch(() => {})
      );
    }
  }, [open, asset, fullAsset, variant]);

  const toggleAssetState = () => {
    if (
      asset.asset !== undefined &&
      variant === "measures" &&
      asset.asset.recommended
    ) {
      // hide measure
      startTransitionToggle(() =>
        toggelRecommendationRelevancy(asset.id)
          .then((res) => {
            if (res.success) {
              toast.success(res.message);
              refreshData();
            } else {
              toast.error(res.message);
            }
          })
          .catch(() => {})
          .finally(() => {
            refreshRecommendationsCounter();
          })
      );
    } else if (asset.asset !== undefined) {
      // remove asset
      startTransitionToggle(() =>
        deleteAsset({
          assetId: asset.id,
          variant: variant,
        })
          .then((res) => {
            if (res.success) {
              toast.success(res.message);
              refreshData();
            } else {
              toast.error(res.message);
            }
          })
          .catch(() => {})
          .finally(() => {
            refreshRecommendationsCounter();
          })
      );
    } else {
      // add asset
      startTransitionToggle(() =>
        addAsset(asset.id, variant)
          .then((res) => {
            if (res.success) {
              toast.success(res.message);
              refreshData((res.payload as AssetInstance) || undefined);
            } else {
              toast.error(res.message);
            }
          })
          .catch(() => {})
          .finally(() => {
            refreshRecommendationsCounter();
          })
      );
    }
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      startTransition(() =>
        getAssetInstanceById({ id: asset.id, variant: variant })
          .then((result) => {
            asset.asset = result;
          })
          .catch(() => {})
      );

      // remove asset id from url when sheet is closed
      const aid = searchParams?.get("aid");
      if (aid == asset.id) {
        const newUrl = removeKeysFromQuery({
          params: searchParams?.toString() || "",
          keysToRemove: ["aid"],
        });
        router.replace(newUrl, { scroll: false });
      }
    }
  };

  return (
    <Sheet open={open} onOpenChange={(state) => handleOpenChange(state)}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        className="min-w-full min-[800px]:min-w-[800px] overflow-scroll"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <SheetHeader>
          <div className="flex flex-row max-sm:flex-col flex-between gap-4 pe-10">
            <SheetTitle className="text-lg" asChild>
              <h1 className="text-xl font-bold">
                {variant === "infrastructure"
                  ? "IT-Komponente"
                  : variant === "measures"
                    ? "ITSM-Maßnahme"
                    : "Asset"}{" "}
                {asset.asset !== undefined ? "bearbeiten" : "erfassen"}{" "}
                {variant === "infrastructure" && (
                  <HoverInfoButton
                    text={`Die Komponente repräsentiert den Typ ${asset.name}, welcher eine
            oder mehrere konkrete Hard- oder Softwareprodukte in Ihrem Betrieb
            umfassen kann. Falls Sie mehrere konkrete Hard- oder
            Softwareprodukte vom Typ ${asset.name} besitzen, können Sie jeweils
            einen eigene Alias-Namen für die einzelen Produkte vergeben (z. B.
            Notebook-Empfang, Notebook-Außendienst-1, Notebook-Außendienst-2).
            Die Vergabe von Alias-Namen ist rein optional und dient der besseren
            Übersichtlichkeit. Die Vergabe von Alias-Namen hat keinen Einfluss
            auf die Generierung von Handlungsempfehlungen.`}
                  />
                )}
              </h1>
            </SheetTitle>
            <div className="flex flex-row items-center gap-3">
              {isPending && (
                <>
                  <ProgressBar
                    progress={50}
                    spinner={true}
                    style="bold"
                    className="w-6"
                  />
                  <span>Ansicht wird aktualisiert...</span>
                </>
              )}
            </div>
          </div>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <>
          {fullAsset !== undefined ? (
            <div className="flex flex-col mt-8 gap-8 text-base">
              <div>
                <div className="flex flex-col sm:flex-row gap-2">
                  {asset.asset !== undefined ? (
                    <>
                      {variant === "measures" && asset.asset.recommended ? (
                        <Button
                          className={cn("text-base", "button-contrast")}
                          onClick={() => toggleAssetState()}
                        >
                          <i className="material-symbols-outlined md-m bold me-2">
                            {asset.asset.status === "IRRELEVANT"
                              ? "visibility"
                              : "visibility_off"}
                          </i>
                          Empfohlene Maßnahme{" "}
                          {asset.asset.status === "IRRELEVANT"
                            ? "einblenden"
                            : "ausblenden"}
                        </Button>
                      ) : (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              className={cn("text-base", "button-contrast")}
                            >
                              <i className="material-symbols-outlined md-m bold me-1">
                                delete
                              </i>
                              {variant === "infrastructure"
                                ? "Komponente"
                                : "Maßnahme"}{" "}
                              entfernen
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Sind Sie sich sicher?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-base">
                                {variant === "infrastructure"
                                  ? "Durch Entfernung der Komponente werden auch alle individuellen Aliase gelöscht, die Sie dieser Komponente hinzugefügt haben."
                                  : "Sind Sie sich wirklich sicher, dass Sie die Maßnahme entfernen wollen?"}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-3">
                              <AlertDialogAction asChild>
                                <SheetClose asChild>
                                  <Button
                                    className={cn("text-base", "button-danger")}
                                    onClick={() => toggleAssetState()}
                                  >
                                    <i className="material-symbols-outlined md-m bold me-1">
                                      delete
                                    </i>
                                    {variant === "infrastructure"
                                      ? "Komponente"
                                      : "Maßnahme"}{" "}
                                    entfernen
                                  </Button>
                                </SheetClose>
                              </AlertDialogAction>
                              <AlertDialogCancel asChild>
                                <Button className="button text-base">
                                  Abbrechen
                                </Button>
                              </AlertDialogCancel>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </>
                  ) : (
                    <Button
                      className={cn("text-base", "button-success")}
                      onClick={() => toggleAssetState()}
                      disabled={isPendingToggle}
                    >
                      {isPendingToggle ? (
                        <>
                          <span>Hinzufügen...</span>
                          <ProgressBar
                            progress={50}
                            spinner={true}
                            style="bold"
                            className="w-6 ms-3"
                          />
                        </>
                      ) : (
                        <>
                          <i className="material-symbols-outlined md-m bold me-1">
                            add
                          </i>
                          {variant === "infrastructure"
                            ? "Komponente"
                            : "Maßnahme"}{" "}
                          erfassen
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold">
                  {asset.name}
                  {asset.asset !== undefined &&
                    (variant === "infrastructure" ||
                      (variant === "measures" &&
                        asset.asset.status !== "IRRELEVANT" &&
                        asset.asset.status !== "OPEN")) && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <i className="ms-2 material-symbols-outlined md-s heavy text-highlight-100">
                              check_circle
                            </i>
                          </TooltipTrigger>
                          <TooltipContent hideWhenDetached={true}>
                            {variant === "infrastructure"
                              ? "Die Komponente ist Teil Ihrer IT-Infrastruktur"
                              : "Die Maßnahme ist in Ihrem Betrieb aktiv"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                </h2>
                <p className="pe-10">
                  {fullAsset.longDescription &&
                  fullAsset.longDescription.length > 0
                    ? fullAsset.longDescription
                    : fullAsset.description}
                </p>
                <div className="mt-8">
                  {isPendingToggle ? (
                    <div className="flex flex-row items-center gap-3">
                      <ProgressBar
                        progress={50}
                        spinner={true}
                        style="bold"
                        className="w-6"
                      />
                      <span>Ansicht wird aktualisiert...</span>
                    </div>
                  ) : (
                    <>
                      {variant === "infrastructure" ? (
                        <SheetContentComponent
                          fullAsset={fullAsset}
                          asset={asset}
                          refreshData={refreshData}
                        />
                      ) : (
                        variant === "measures" && (
                          <SheetContentMeasure
                            fullAsset={fullAsset}
                            asset={asset.asset}
                            refreshData={refreshData}
                          />
                        )
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-12">
              <FetchingError />
            </div>
          )}
        </>
      </SheetContent>
    </Sheet>
  );
};

export default AssetOptionsSheet;
