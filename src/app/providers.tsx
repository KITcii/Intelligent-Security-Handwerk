import { NotificationsProvider } from "@/contexts/NotificationsProvider";

function Providers({ children }: { children: React.ReactNode }) {
  return <NotificationsProvider>{children}</NotificationsProvider>;
}

export default Providers;
