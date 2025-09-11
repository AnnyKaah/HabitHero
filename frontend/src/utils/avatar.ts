export const getAvatarUrl = (avatarId: string | undefined) => {
  // No changes needed here
  return `/assets/avatars/${avatarId || "avatar1"}.png`;
};
