import BackgroundPanel from "@/components/assistant/shared/BackgroundPanel";
import Header from "@/components/assistant/shared/Header";
import ContactForm from "@/components/shared/navigation/ContactForm";

const page = () => {
  return (
    <div>
      <Header title="Kontakt" />
      <BackgroundPanel contentClassName="p-10 md:ps-20">
        <ContactForm />
      </BackgroundPanel>
    </div>
  );
};

export default page;
