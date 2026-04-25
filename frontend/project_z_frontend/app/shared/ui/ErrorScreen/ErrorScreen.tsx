import { Link } from "react-router";
import { Button } from "~/shared/ui/Button";

interface ErrorScreenProps {
  title: string;
  message: string;
  status?: number;
  stack?: string;
  onRetry?: () => void;
}

export const ErrorScreen = ({ title, message, status, stack, onRetry }: ErrorScreenProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6 relative overflow-hidden">
      {status && (
        <h1 className="text-[12rem] font-black text-primary opacity-5 absolute pointer-events-none select-none">
          {status}
        </h1>
      )}
      
      <div className="z-10 text-center max-w-lg">
        <h2 className="text-3xl font-bold mb-3">{title}</h2>
        <p className="text-foreground-muted mb-8">{message}</p>
        
        {stack && (
          <div className="bg-background-muted p-4 rounded-xl text-left mb-8 overflow-auto max-h-40 border border-danger/20 shadow-inner">
            <code className="text-md text-danger leading-relaxed">{stack}</code>
          </div>
        )}

        <div className="flex items-center justify-center gap-4">
          <Button className = "bg-card text-foreground" onClick={onRetry || (() => window.location.reload())} variant="outline">
            Try again
          </Button>
          <Link to="/">
            <Button className="px-8 bg-card text-foreground" variant="outline">Go Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};