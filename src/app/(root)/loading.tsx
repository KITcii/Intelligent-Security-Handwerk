import ProgressBar from "@/components/shared/ProgressBar";

export default function Loading() {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <ProgressBar
        progress={50}
        spinner={true}
        style="default"
        className="w-32"
      />
    </div>
  );
}
