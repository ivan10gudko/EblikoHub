import { Outlet } from "react-router";
import { ScrollToTopButton } from "~/shared/ui/ScrollToTopButton/ScrollToTopButton";
import { Footer } from "~/widgets/Footer";
import { Header } from "~/widgets/Header";


const MainLayout = () => {
  return (
    <div className="app font-industrial min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default MainLayout;
