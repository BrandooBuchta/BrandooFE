import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import QueryString from "qs";

import {
  User,
  SignInRequest,
  SignInResponse,
  ResetPasswordFinishBody,
  UserFormInfo,
} from "@/interfaces/user";
import { api } from "@/utils/api";

interface AuthState {
  isLoggedIn: boolean;
  isDevMode: boolean;
  setIsDevMode: () => void;
  user: User | null;
  authTokenExpiresAt: string | null;
  signIn: (signInInput: SignInRequest) => Promise<void>;
  signOut: () => void;
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
      authTokenExpiresAt: null,
      isDevMode: false,
      signIn: async (signInInput: SignInRequest) => {
        try {
          const {
            data: { user, security },
          } = await api.post<SignInResponse>("user/sign-in", signInInput);

          Cookies.set("authToken", security.token.authToken, {
            expires: new Date(security.token.expiresAt),
            secure: true,
            sameSite: "strict",
          });

          Cookies.set("privateKey", security.privateKey, {
            expires: new Date(security.token.expiresAt),
            secure: true,
            sameSite: "strict",
          });

          set({
            isLoggedIn: true,
            user,
          });
        } catch (error) {
          toast.error(`${error}`);
        }
      },
      signOut: () => {
        // Vymažeme auth token z cookies
        Cookies.remove("authToken");

        set({
          isLoggedIn: false,
          user: null,
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
          const { status } = await api.post(
            `user/finish-verification/${id}`,
            body,
          );

          if (status === 404) {
            toast.error("Kód expiroval.");
          }

          set((state) => ({
            user: state.user ? { ...state.user, isVerified: true } : null,
          }));
          toast.success("Byl jste úspěšně verifikován.");
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
      getStorage: () => localStorage, // Použijeme localStorage pro ukládání uživatele
    },
  ),
);

export default useUserStore;
