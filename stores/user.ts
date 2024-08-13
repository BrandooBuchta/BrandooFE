import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-toastify";
import QueryString from "qs";

import {
  User,
  Token,
  SignInRequest,
  SignInResponse,
  ResetPasswordFinishBody,
  UserFormInfo,
} from "@/interfaces/user";
import { api, setAuthTokenHeader } from "@/utils/api";

interface AuthState {
  isLoggedIn: boolean;
  isDevMode: boolean;
  setIsDevMode: () => void;
  user: User | null;
  signIn: (signInInput: SignInRequest) => Promise<void>;
  signOut: () => void;
  token: Token | null;
  resetPassword: (body: { email: string }) => Promise<void>;
  resetPasswordFinish: (body: ResetPasswordFinishBody) => Promise<void>;
  startVerification: (id: string) => Promise<void>;
  finishVerification: (body: { code: string }, id: string) => Promise<void>;
  setUserFormInfo: (info: UserFormInfo) => void;
}

const useUserStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      token: null,
      isDevMode: false,
      signIn: async (signInInput: SignInRequest) => {
        try {
          const {
            data: { user, token },
          } = await api.post<SignInResponse>("user/sign-in", signInInput);

          setAuthTokenHeader(token.authToken);
          set({
            isLoggedIn: true,
            user,
            token,
          });
        } catch (error) {
          toast.error(`${error}`);
        }
      },
      signOut: () => {
        set({
          isLoggedIn: false,
          user: null,
          token: null,
        });
      },
      resetPassword: async (body) => {
        try {
          await api.post(`user/password-reset/start?email=${body.email}`);
        } catch (error) {
          toast.error(`${error}`);
        }
      },
      resetPasswordFinish: async (body) => {
        const query = QueryString.stringify(body);

        try {
          await api.post(`user/password-reset/finish?${query}`);
        } catch (error) {
          toast.error(`${error}`);
        }
      },
      startVerification: async (id) => {
        try {
          await api.post(`user/start-verification/${id}`);
        } catch (error) {
          toast.error(`${error}`);
        }
      },
      finishVerification: async (body, id) => {
        try {
          await api.post(`user/finish-verification/${id}`, body);

          set((state) => ({
            user: state.user ? { ...state.user, isVerified: true } : null,
          }));
          toast.success("You were successfully verified.");
        } catch (error) {
          toast.error(`${error}`);
        }
      },
      setIsDevMode: () => {
        set((state) => ({
          isDevMode: !state.isDevMode,
        }));
      },
      setUserFormInfo: (info) => {
        const { user } = get();

        user &&
          set(() => ({
            user: { ...user, ...info },
          }));
      },
    }),
    {
      name: "brandoo-auth-storage",
      getStorage: () => localStorage,
    },
  ),
);

export default useUserStore;
