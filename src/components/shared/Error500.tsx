import Image from "next/image";

const Error500 = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6">
      <Image
        src="/assets/images/500-error.svg"
        height={200}
        width={200}
        alt="500"
      />
      <p className="text-xl mt-2 text-center">
        Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.
      </p>
    </div>
  );
};

export default Error500;
