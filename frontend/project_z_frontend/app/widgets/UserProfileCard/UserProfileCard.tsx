import EditIcon from "@mui/icons-material/Edit";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
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
                    disabled={isActionLoading}
                    onClick={() => onAction("send", userId)}
                    className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-2xl font-medium transition-all shadow-sm active:scale-95 disabled:opacity-50"
                  >
                    {isActionLoading ? "Sending..." : "Add Friend"}
                  </Button>
                )}

                {isPending && (
                  <Button
                    disabled={isActionLoading || !friendshipId}
                    onClick={() =>
                      friendshipId && onAction("delete", friendshipId)
                    }
                    className="group flex items-center gap-2 border border-red-500/30 hover:border-red-500/60 bg-red-500/5 hover:bg-red-500/10 text-red-500 px-5 py-2.5 rounded-2xl font-medium transition-all duration-200 active:scale-95 disabled:opacity-50"
                  >
                    <PersonRemoveIcon className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
                    <span>
                      {isActionLoading ? "Cancelling..." : "Cancel Request"}
                    </span>
                  </Button>
                )}

                {isAccepted && (
                  <Button
                    disabled={isActionLoading || !friendshipId}
                    onClick={() =>
                      friendshipId && onAction("delete", friendshipId)
                    }
                    className="group flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 hover:text-rose-600 border border-rose-500/20 hover:border-rose-500/40 px-5 py-2.5 rounded-2xl font-semibold transition-all duration-200 active:scale-95 shadow-sm disabled:opacity-50"
                  >
                    <PersonRemoveIcon className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
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