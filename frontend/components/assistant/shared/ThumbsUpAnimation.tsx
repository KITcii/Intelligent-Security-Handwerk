import { cn } from "@/lib/utils";
import style from "./ThumbsUpAnimation.module.css";
const ThumbsUpAnimation = ({ className }: { className?: string }) => {
  return (
    <div className="w-full flex justify-center">
      <div
        className={cn(
          style["center"],
          "relative w-[180px] aspect-square",
          className
        )}
      >
        <i
          className={cn(
            style["thumb"],
            "material-symbols-outlined filled md-3xl"
          )}
        >
          thumb_up
        </i>
        <div className={cn(style["circle-wrap"])}>
          <div className={cn(style["circle-lg"])}></div>
        </div>
      </div>
    </div>
  );
};

export default ThumbsUpAnimation;
