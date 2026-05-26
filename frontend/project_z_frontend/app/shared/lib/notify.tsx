import { toast } from "react-hot-toast";

interface NotifyOptions {
  duration?: number;
}

export const notify = {
  success: (message: string, options?: NotifyOptions) => {
    toast.custom(
      (t) => (
        <div
          className={`${t.visible ? "animate-enter" : "animate-leave"} 
            max-w-md w-full bg-card border-2 border-border/80 text-foreground px-4 py-3 
            rounded-xl shadow-xl flex items-center gap-3 font-medium text-sm transition-all`}
        >
          <div className="flex items-center justify-center p-1.5 bg-primary/10 text-primary rounded-lg shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <div className="flex-1 break-words">{message}</div>
        </div>
      ),
      { duration: options?.duration ?? 3000 }
    );
  },

  error: (message: string, options?: NotifyOptions) => {
    toast.custom(
      (t) => (
        <div
          className={`${t.visible ? "animate-enter" : "animate-leave"} 
            max-w-md w-full bg-card border-2 border-danger/50 text-foreground px-4 py-3 
            rounded-xl shadow-xl flex items-center gap-3 font-medium text-sm transition-all`}
        >
          <div className="flex items-center justify-center p-1.5 bg-danger/10 text-danger rounded-lg shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <div className="flex-1 break-words">{message}</div>
        </div>
      ),
      { duration: options?.duration ?? 4000 }
    );
  },

  info: (message: string, options?: NotifyOptions) => {
    toast.custom(
      (t) => (
        <div
          className={`${t.visible ? "animate-enter" : "animate-leave"} 
            max-w-md w-full bg-card border-2 border-border text-foreground px-4 py-3 
            rounded-xl shadow-xl flex items-center gap-3 font-medium text-sm transition-all`}
        >
          <div className="flex items-center justify-center p-1.5 bg-foreground/10 text-foreground-muted rounded-lg shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 1 1 1.063 1.063L12 13.504M12 7.5h.008v.008H12V7.5Zm0 13.5a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <div className="flex-1 break-words">{message}</div>
        </div>
      ),
      { duration: options?.duration ?? 3000 }
    );
  },
  loading: (message: string): string => {
    return toast.custom(
      (t) => (
        <div
          className={`${t.visible ? "animate-enter" : "animate-leave"} 
            max-w-md w-full bg-card border-2 border-border/80 text-foreground px-4 py-3 
            rounded-xl shadow-xl flex items-center gap-3 font-medium text-sm transition-all`}
        >
          <div className="flex items-center justify-center p-1.5 text-primary rounded-lg shrink-0">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <div className="flex-1 break-words">{message}</div>
        </div>
      ),
      { id: Math.random().toString() } 
    );
  },

  updateSuccess: (toastId: string, message: string, options?: NotifyOptions) => {
    toast.custom(
      (t) => (
        <div
          className={`${t.visible ? "animate-enter" : "animate-leave"} 
            max-w-md w-full bg-card border-2 border-border/80 text-foreground px-4 py-3 
            rounded-xl shadow-xl flex items-center gap-3 font-medium text-sm transition-all`}
        >
          <div className="flex items-center justify-center p-1.5 bg-primary/10 text-primary rounded-lg shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <div className="flex-1 break-words">{message}</div>
        </div>
      ),
      { id: toastId, duration: options?.duration ?? 2000 }
    );
  },

  updateError: (toastId: string, message: string, options?: NotifyOptions) => {
    toast.custom(
      (t) => (
        <div
          className={`${t.visible ? "animate-enter" : "animate-leave"} 
            max-w-md w-full bg-card border-2 border-danger/50 text-foreground px-4 py-3 
            rounded-xl shadow-xl flex items-center gap-3 font-medium text-sm transition-all`}
        >
          <div className="flex items-center justify-center p-1.5 bg-danger/10 text-danger rounded-lg shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <div className="flex-1 break-words">{message}</div>
        </div>
      ),
      { id: toastId, duration: options?.duration ?? 3000 }
    );
  }
};
