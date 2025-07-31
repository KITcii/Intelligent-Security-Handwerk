import { getComponentCount } from "@/lib/api/assets.api";
import WidgetError from "./shared/WidgetError";

const ComponentsWidgetContent = async () => {
  const data = await getComponentCount();

  if (data === undefined) {
    return <WidgetError />;
  }

  return (
    <div className="flex flex-row gap-5 items-center w-full h-full justify-center">
      <div className="relative h-20 aspect-square bg-highlight-100 rounded-full flex justify-center items-center text-center p-3">
        <i className="material-symbols-outlined thin md-xl text-tc-contrast ">
          devices
        </i>
      </div>
      <div className="text-center">
        <p className="mb-2">IT-Infrastruktur</p>
        <p className="font-bold leading-none">
          {data <= 0 ? "0" : Math.ceil(data)}
          <br />
          Komponenten
        </p>
      </div>
    </div>
  );
};

export default ComponentsWidgetContent;
