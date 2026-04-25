export const formatUser = (user) => {
  if (!user) return null;

  return {
    id: user._id,
    name: user.name,
    email: user.email,

    // ✅ BEST FIX

    role: user.role
      ? {
          id: user.role._id,
          name: user.role.role_name,
          key: user.role.role_key,
        }
      : null,
    createdAt: user.createdAt,
    avatar: user.avatar?.url || null,
  };
};