import { useNavigate } from "react-router";
import Button from "../../../shared/ui/Button";
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
const ErrorAnimePage : React.FC = ()=>{
    const navigate = useNavigate()

    return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border-slate-200 shadow-lg">
        <div className="p-8 space-y-6">

          <div className="flex justify-center">
            <div className="bg-red-50 rounded-full p-4 border-2 border-red-200">
              <ErrorOutlineRoundedIcon className="h-12 w-12 text-red-500" />
            </div>
          </div>


          <div className="text-center space-y-2">
            <h2 className="text-slate-900">Something went wrong</h2>
            <p className="text-slate-600">Page not found</p>
          </div>


          <div className="space-y-3 pt-2">
              <Button
                action={()=>navigate(-1)}
                className="w-full"
                variant="fill"
              >
                <RefreshRoundedIcon className="mr-2 h-5 w-5" />
                Get Back
              </Button>


              <Button
                action={()=>navigate("/")}
                className="w-full"
                variant="outline"
              >
                <HomeRoundedIcon className="mr-2 h-5 w-5" />
                Home
              </Button>

          </div>
      </div>
    </div>
    </div>
}


export default ErrorAnimePage;

