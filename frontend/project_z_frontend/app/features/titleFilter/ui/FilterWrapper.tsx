
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { Button } from "~/shared/ui/Button";
import { useState, type ReactNode } from 'react';

interface FilterResponsiveWrapperProps {
  children: ReactNode;
  title?: string;
}

export const FilterResponsiveWrapper = ({ children, title = "Filters" }: FilterResponsiveWrapperProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <>
      <div className="lg:hidden flex items-center justify-between gap-4 mb-6 px-2">
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">
          Your Watchlist
        </h1>
        <Button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-background px-5 py-2.5 rounded-2xl shadow-md shadow-amber-200 transition-all active:scale-95"
        >
          <FilterListIcon sx={{ fontSize: 20 }} />
          <span className="font-bold text-sm">Filters</span>
        </Button>
      </div>

      <aside className={`
        fixed inset-0 z-[100] transition-all duration-300 lg:static lg:translate-x-0 lg:z-auto
        ${isOpen ? "visible opacity-100" : "invisible opacity-0 lg:visible lg:opacity-100"}
        flex lg:block
      `}>
        <div 
          className="absolute inset-0 bg-foreground/60 backdrop-blur-sm lg:hidden transition-opacity" 
          onClick={close} 
        />
        
        <div className={`
          relative w-80 lg:w-64 h-full bg-background lg:bg-transparent shadow-2xl lg:shadow-none transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
          <div className="lg:hidden flex justify-between items-center p-5 border-b border-border bg-background-muted/50">
             <span className="font-black uppercase tracking-wider text-gray-500 text-xs">{title}</span>
             <button 
               className="p-2 hover:bg-background-muted-hover rounded-xl transition-colors text-foreground-muted" 
               onClick={close}
             >
               <CloseIcon />
             </button>
          </div>
          
          <div className="p-5 lg:p-0 h-[calc(100%-70px)] lg:h-auto overflow-y-auto lg:overflow-visible">
            {children}
          </div>
        </div>
      </aside>
    </>
  );
};