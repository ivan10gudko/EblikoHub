import EditIcon from "@mui/icons-material/Edit";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { UserAvatar } from "~/entities/user";
import { RequestStatus } from "~/shared/types";
import { Button } from "~/shared/ui/Button";
import { UserProfileEdit } from "./UserProfileEditCard";
import { UserFavoriteTitlesShowcase } from "./UserFavoriteTitlesShowcase";
import { useUserProfile } from "~/widgets/UserProfileCard/hooks/useUserProfile";

interface UserProfileCardProps {
  userId: string;
}

export const UserProfileCard = ({ userId }: UserProfileCardProps) => {
  const {
    user,
    isOwn,
    isEditing,
    setIsEditing,
    friendshipStatus,
    friendshipId,
    onAction,
    isActionLoading,
    updateProfile,
    isUpdating,
  } = useUserProfile(userId);

  const isNone = !friendshipStatus || friendshipStatus === RequestStatus.NONE;
  const isPending = friendshipStatus === RequestStatus.PENDING;
  const isAccepted = friendshipStatus === RequestStatus.ACCEPTED;

  return (
    <>
      {!isEditing ? (
        <>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <UserAvatar
              src={user.img || undefined}
              name={user.name}
              size="lg"
            />

            <div className="flex flex-col items-center sm:items-start grow">
              <h1 className="text-3xl font-black text-foreground tracking-tight">
                {user.name}
              </h1>
              <span className="text-lg text-primary font-mono">
                @{user.nameTag}
              </span>
            </div>

            {isOwn && (
              <Button
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-background-muted hover:bg-background-muted-hover text-card hover:text-primary-hover p-3 rounded-2xl transition-all"
              >
                <EditIcon className="text-primary" />
              </Button>
            )}

            {!isOwn && (
              <div className="flex items-center gap-3">
            
                {isNone && (
                  <Button
                    type="button"
                    variant="accept"
                    disabled={isActionLoading}
                    onClick={() => onAction("send", userId)}
                    className="h-11 px-5 rounded-xl gap-2 font-bold"
                  >
                    <PersonAddIcon fontSize="small" />
                    <span>{isActionLoading ? "Sending..." : "Add Friend"}</span>
                  </Button>
                )}

             
                {isPending && (
                  <Button
                    type="button"
                    variant="altCancel"
                    disabled={isActionLoading || !friendshipId}
                    onClick={() =>
                      friendshipId && onAction("delete", friendshipId)
                    }
                    className="h-11 px-5 rounded-xl gap-2 font-bold"
                  >
                    <PersonRemoveIcon sx={{ fontSize: 18 }} />
                    <span>
                      {isActionLoading ? "Cancelling..." : "Cancel Request"}
                    </span>
                  </Button>
                )}

               
                {isAccepted && (
                  <Button
                    type="button"
                    variant="altCancel"
                    disabled={isActionLoading || !friendshipId}
                    onClick={() =>
                      friendshipId && onAction("delete", friendshipId)
                    }
                    className="h-11 px-5 rounded-xl gap-2 font-bold"
                  >
                    <PersonRemoveIcon sx={{ fontSize: 18 }} />
                    <span>
                      {isActionLoading ? "Removing..." : "Remove Friend"}
                    </span>
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="h-px bg-background-muted w-full" />

          <p className="text-foreground leading-relaxed">
            {user.description ||
              "No description provided yet. Let people know who you are!"}
          </p>

          <div className="h-[1px] bg-background-muted w-full my-2" />

          <UserFavoriteTitlesShowcase
            profile={user}
            isOwner={false}
          />
        </>
      ) : (
        <UserProfileEdit
          user={user}
          onSave={(data, file) =>
            updateProfile(
              { profileData: data, avatarFile: file },
              {
                onSuccess: () => setIsEditing(false),
              }
            )
          }
          onCancel={() => setIsEditing(false)}
          isPending={isUpdating}
        />
      )}
    </>
  );
};