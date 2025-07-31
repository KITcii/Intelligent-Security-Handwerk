import ProgressBar from "./ProgressBar";

const SuspenseLoader = () => {
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
};

export default SuspenseLoader;
