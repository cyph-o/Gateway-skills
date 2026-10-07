/** Shared form state. Not declared in the "use server" module: such a file may
 *  only export async functions. */
export interface AdminLoginState {
  error?: string;
}

export const initialAdminLoginState: AdminLoginState = {};
