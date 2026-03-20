
import { useShallow } from "zustand/react/shallow";
import { useNavigate } from "react-router";
import { useAuthStore } from "~/features/auth";
import { Button } from "~/shared/ui/Button";

const ProfilePage = () => {
    const { user, isLoading, error } = useAuthStore(
        useShallow((state) => ({
            user: state.user,
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

    if (error || !user) {
        console.error(error);
        console.log(user)
        return <p>Error</p>;
    }
    return (
        <>
            <h1>name: {user.name}</h1>
            <h2>#{user.nameTag}</h2>
            <Button onClick={()=>handleLogOut()}>Log Out</Button>
        </>
    );
};
export default ProfilePage;
