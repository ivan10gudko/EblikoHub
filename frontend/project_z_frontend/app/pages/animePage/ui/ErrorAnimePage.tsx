import { useNavigate } from "react-router";
import Button from "../../../shared/ui/Button/Button";
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';

const ErrorAnimePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 transition-colors duration-200">
      
      <div className="max-w-md w-full bg-card border border-border shadow-lg rounded-xl overflow-hidden transition-colors duration-200">
        <div className="p-8 space-y-6">

          <div className="flex justify-center">
            <div className="bg-danger/10 rounded-full p-4 border-2 border-danger/30 transition-colors duration-200">
              <ErrorOutlineRoundedIcon className="h-12 w-12 text-danger" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-foreground text-xl font-semibold font-inter transition-colors duration-200">
              Something went wrong
            </h2>
            <p className="text-foreground-muted transition-colors duration-200">
              Page not found
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Button
              onClick={() => navigate(-1)}
              className="w-full"
              variant="fill"
            >
              <RefreshRoundedIcon className="mr-2 h-5 w-5" />
              Get Back
            </Button>

            <Button
              onClick={() => navigate("/")}
              className="w-full text-foreground"
              variant="outline"

            >
              <HomeRoundedIcon className="mr-2 h-5 w-5" />
              Home
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ErrorAnimePage;