import Image from "next/image";

const Error404 = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6">
      <Image
        src="/assets/images/404-error.svg"
        height={200}
        width={200}
        alt="404"
      />
      <p className="text-xl mt-2 text-center">
        Die gewünschte Seite konnte nicht gefunden werden.
      </p>
    </div>
  );
};

export default Error404;
