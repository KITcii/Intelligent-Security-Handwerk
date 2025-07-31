import { cn, formatTimeString } from "@/lib/utils";
import { zxcvbn } from "@zxcvbn-ts/core";
import PasswordStrengthIndicatorListItem from "./PasswordStrengthIndicatorListItem";
import BackgroundPanel from "./BackgroundPanel";
import HoverInfoButton from "./HoverInfoButton";

const PasswordStrengthIndicator = ({
  password,
  className,
}: {
  password: string;
  className?: string;
}) => {
  const result = zxcvbn(password);

  const fulfillment = {
    lowerCase: /[a-z]+/.test(password),
    upperCase: /[A-Z]+/.test(password),
    numbers: /\d+/.test(password),
    special: /[!"#$%&'()*+\,\-\./:;<=>?@[\]^_`{|}~]+/.test(password),
    count: password.length > 11,
  };

  const strength = {
    label: "",
    color: "",
    icon: "",
  };

  switch (result.score) {
    case 0:
      strength.label = "Sehr schwaches";
      strength.color = "text-danger-high";
      strength.icon = "lock_open";
      break;
    case 1:
      strength.label = "Schwaches";
      strength.color = "text-danger-mid";
      strength.icon = "lock_open";
      break;
    case 2:
      strength.label = "Moderates";
      strength.color = "text-danger-low";
      strength.icon = "lock_open";
      break;
    case 3:
      strength.label = "Starkes";
      strength.color = "text-danger-none";
      strength.icon = "lock";
      break;
    case 4:
      strength.label = "Sehr starkes";
      strength.color = "text-shamrock";
      strength.icon = "lock";
    default:
      break;
  }

  return (
    <div className={cn("pt-2", className)}>
      <BackgroundPanel>
        <div className="flex flex-col">
          <div className="grid md:grid-cols-12 grid-flow-row">
            <div>
              <i
                className={cn(
                  "material-symbols-outlined filled inline-block align-top",
                  strength.color
                )}
              >
                {strength.icon}
              </i>
            </div>
            <div className="col-span-11">
              <div
                className={cn(
                  "font-semibold text-lg mt-1 align-middle",
                  strength.color
                )}
              >
                {strength.label} Passwort
              </div>
              <div className="mt-1">
                <div>
                  Aufwand um das Passwort zu erraten{" "}
                  <HoverInfoButton text="Wichtiger Hinweis: Der hier berechnete Aufwand bezieht sich auf das Erraten des Passwortes durch austesten aller möglichen Buchstabenkombinationen.  Unabhängig von der hier genannten Dauer, reduziert sich die benötigte Zeit drastisch auf wenige Sekunden, falls das Passwort häufig von vielen anderen Personen verwendet wird (z.B. 'Passwort123' oder bekannte Romanfiguren) oder das Passwort aus Begriffen besteht, die in einem Wörterbuch zu finden sind." />
                </div>
                <span className={cn("font-semibold text-lg", strength.color)}>
                  {formatTimeString(
                    result.crackTimesSeconds.offlineSlowHashing1e4PerSecond
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <h2 className="font-semibold mb-2">
              So kannst du dein Passwort verbessern:
            </h2>
            <ul>
              <PasswordStrengthIndicatorListItem
                label="Mindestens 12 Zeichen"
                fulfilled={fulfillment.count}
              />
              <PasswordStrengthIndicatorListItem
                label="Kleinbuchstaben"
                fulfilled={fulfillment.lowerCase}
              />
              <PasswordStrengthIndicatorListItem
                label="Großbuchstaben"
                fulfilled={fulfillment.upperCase}
              />
              <PasswordStrengthIndicatorListItem
                label="Zahlen"
                fulfilled={fulfillment.numbers}
              />
              <PasswordStrengthIndicatorListItem
                label="Sonderzeichen (?#@...)"
                fulfilled={fulfillment.special}
              />
            </ul>
          </div>
        </div>
      </BackgroundPanel>
    </div>
  );
};

export default PasswordStrengthIndicator;
