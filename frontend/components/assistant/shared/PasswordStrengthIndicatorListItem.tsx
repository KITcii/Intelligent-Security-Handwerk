import { cn } from "@/lib/utils";

const PasswordStrengthIndicatorListItem = ({
  label,
  fulfilled,
}: {
  label: string;
  fulfilled: boolean;
}) => {
  return (
    <li className="flex flex-row items-center list-outside gap-2 mb-1 ms-3">
      <i
        className={cn(
          "material-symbols-outlined heavy md-s",
          fulfilled && "text-highlight-100"
        )}
      >
        {fulfilled ? "check" : "fiber_manual_record"}
      </i>
      <span className={cn(fulfilled ? "text-tc-muted" : "font-semibold")}>
        {label}
      </span>
    </li>
  );
};

export default PasswordStrengthIndicatorListItem;
