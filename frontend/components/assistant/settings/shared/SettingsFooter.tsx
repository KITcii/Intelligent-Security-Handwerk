import style from "@/components/assistant/settings/shared/settings.module.css";
import { Separator } from "@/components/ui/separator";
import { forwardRef } from "react";
import SubmitChangeFormButton from "../../shared/SubmitChangeFormButton";

const SettingsFooter = forwardRef<HTMLButtonElement, unknown>((_props, ref) => {
  return (
    <div className={style.SettingsSectionFooter}>
      <Separator className={style.SettingsSectionEndSeparator} />
      <div className={style.SettingsSectionButtonRow}>
        <div>
          <SubmitChangeFormButton
            ref={ref}
            className={style.SettingsSubmitButton}
          />
        </div>
      </div>
    </div>
  );
});

SettingsFooter.displayName = "SettingsFooter";

export default SettingsFooter;
