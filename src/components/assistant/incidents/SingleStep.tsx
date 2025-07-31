import React from "react";

const SingleStep = ({
  pos,
  title,
  children,
}: {
  pos: number;
  title?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-row gap-4">
      <div>
        <div className="h-12 w-12 rounded-full bg-highlight-50 text-tc-contrast font-semibold text-3xl flex items-center justify-center">
          <span>{pos}</span>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-wrap">{title}</h3>
        <p>{children}</p>
      </div>
    </div>
  );
};

export default SingleStep;
