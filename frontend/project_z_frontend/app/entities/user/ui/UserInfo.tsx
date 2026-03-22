
interface UserInfoProps {
    description?: string;
    createdAt?: string;
}

export const UserInfo = ({ description, createdAt }: UserInfoProps) => {
    return (
        <div className="flex flex-col gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-400 uppercase">About Me</h3>
                <p className="mt-1 text-gray-800">
                    {description || "This user hasn't added a bio yet."}
                </p>
            </div>
            
            <div className="text-xs text-gray-400">
                Joined: {createdAt ? new Date(createdAt).toLocaleDateString() : "Long ago"}
            </div>
        </div>
    );
};