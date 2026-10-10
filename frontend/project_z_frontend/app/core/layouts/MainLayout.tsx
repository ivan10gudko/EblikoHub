import { Outlet } from "react-router";
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
    </div>
  );
};

export default MainLayout;
