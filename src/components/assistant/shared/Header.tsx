import LoggedInUser from "@/components/assistant/shared/LoggedInUser";

const Header = ({ title }: { title: string }) => {
  return (
    <div className="flex flex-col max-sm: gap-4 sm:flex-row sm:flex-between mb-11 mt-4">
      <div className="flex flex-row items-center">
        <span className="material-symbols-outlined md-l bold text-highlight-50">
          process_chart
        </span>
        <h1 className="text-xl font-bold ms-2">{title}</h1>
      </div>
      <LoggedInUser />
    </div>
  );
};

export default Header;
