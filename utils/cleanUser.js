export function cleanFirebaseUser(user) {
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email || null,
    displayName: user.displayName || null,
    photoURL: user.photoURL || null,
    phoneNumber: user.phoneNumber || null,
    emailVerified: user.emailVerified || false,
  };
}
