import ProgressBar from "@/components/shared/ProgressBar";

export default function Loading() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <ProgressBar
        progress={50}
        spinner={true}
        style="default"
        className="w-32"
      />
    </div>
  );
}
