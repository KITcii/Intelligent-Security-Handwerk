import Header from "@/components/assistant/shared/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header title="IT-Sicherheitswissen" />
      {children}
    </>
  );
}
