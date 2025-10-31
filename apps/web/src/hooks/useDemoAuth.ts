// This file is not needed - we use useAuthSession.ts instead
// Keeping as placeholder to avoid import errors

export function useDemoAuth() {
  return {
    user: null,
    loading: false,
    signOut: () => { }
  }
}