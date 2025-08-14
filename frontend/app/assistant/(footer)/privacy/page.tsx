import Header from "@/components/assistant/shared/Header";
import Privacy from "@/components/shared/navigation/Privacy";

const page = () => {
  return (
    <div className="mb-16">
      <Header title="Datenschutzerklärung" />
      <Privacy />
    </div>
  );
};

export default page;
