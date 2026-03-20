
import { useShallow } from "zustand/react/shallow";
import { useNavigate } from "react-router";
import { useAuthStore } from "~/features/auth";
import { Button } from "~/shared/ui/Button";

const ProfilePage = () => {
    const { userId, isLoading, error } = useAuthStore(
        useShallow((state) => ({
            userId: state.userId,
            isLoading: state.isLoading,
            error: state.error,
        })),
    );

    const logOut = useAuthStore(state=>state.logout);

    const navigate = useNavigate();

    const handleLogOut = async ()=>{
        await logOut();
        navigate('/');
    }

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error || !userId) {
        console.error(error);
        console.log(userId)
        return <p>Error</p>;
    }
    return (
        <>
            <h1>{userId}</h1>
            <Button onClick={()=>handleLogOut()}>Log Out</Button>
        </>
    );
};
export default ProfilePage;
