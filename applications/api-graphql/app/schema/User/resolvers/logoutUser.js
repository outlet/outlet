export default function logoutUser(_, args, { res }) {
  res.clearCookie('jwt.user');
  return { success: true };
}
