import ProgressBar from "@/components/shared/ProgressBar";

const LoadingContent = () => {
  return (
    <div className="flex w-full justify-center ">
      <div className="flex flex-row items-center gap-3">
        <ProgressBar
          progress={50}
          spinner={true}
          style="bold"
          className="w-6"
        />
        <span>Suche...</span>
      </div>
    </div>
  );
};

export default LoadingContent;
