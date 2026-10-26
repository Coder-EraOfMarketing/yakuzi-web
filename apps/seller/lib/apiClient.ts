import axios from "axios";
import toast from "react-hot-toast";
import { decideOn401 } from "@yukizi/utils";
import { useSellerAuth } from "@/store";
import {
  readAccessToken,
  readRefreshToken,
  writeAccessToken,
  writeRefreshToken,
  clearTokens,
} from "./tokenStorage";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
});

/**
 * Token refresh, ported from the buyer app (packages/api-client/src/api.ts).
 *
 * This file used to answer every 401 by clearing the session and sending the
 * seller to /auth — no refresh attempt, no message. That is what produced
 * "I enter the OTP and it just shows the login page again": the access token
 * aged out mid-session and the seller was bounced to a blank form with no
 * explanation. Admins were handed a longer token to paper over the same hole.
 *
 * The pieces were always there — the API issues a 7d refresh token on login
 * and /auth/refresh rotates both tokens — this app simply discarded the
 * refresh token and never called the endpoint.
 */
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (reason: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  for (const { resolve, reject } of failedQueue) {
    if (error || !token) reject(error);
    else resolve(token);
  }
  failedQueue = [];
}

function endSession() {
  if (typeof window === "undefined") return;
  clearTokens();
  useSellerAuth.getState().logout();
  window.location.href = "/auth";
}

apiClient.interceptors.request.use((config: any) => {
  if (typeof window !== "undefined") {
    // readAccessToken() migrates a session still stored under the legacy
    // pb_access_token / pb_token names, so the rename cannot sign a
    // seller out mid-session.
    const token = readAccessToken();
    if (token && config.headers) {
      const cleanToken = token.replace(/^(Bearer\s+)+/i, "");
      config.headers.Authorization = `Bearer ${cleanToken}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (res: any) => res,
  async (error: any) => {
    const status = error?.response?.status;
    const serverMsg = error?.response?.data?.message || error?.response?.data?.error;
    const originalRequest = error?.config as
      | (Record<string, any> & { _retry?: boolean })
      | undefined;

    if (status === 401 && typeof window !== "undefined") {
      // The branching lives in @yukizi/utils so it can be tested without a
      // browser or a live API — see session-refresh.spec.ts.
      const decision = decideOn401({
        status,
        url: originalRequest?.url,
        alreadyRetried: originalRequest?._retry,
        hasRequestConfig: !!originalRequest,
        hasRefreshToken: !!readRefreshToken(),
        isRefreshing,
      });

      if (decision === "end-session") {
        endSession();
        return Promise.reject(error);
      }

      if (decision === "queue" && originalRequest) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest as any);
        });
      }

      if (decision !== "refresh" || !originalRequest) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const rt = readRefreshToken();
        // Sessions created before this shipped have no stored refresh token.
        // Nothing to do but log out — once, on their next 401.
        if (!rt) throw new Error("No refresh token");

        // Bare axios on purpose: going through apiClient would re-enter this
        // interceptor and loop if the refresh itself 401s.
        const { data } = await axios.post(
          `${BASE_URL}/auth/refresh`,
          { refreshToken: rt },
          { timeout: 30_000 },
        );

        // /auth/refresh returns the TokenPair unwrapped, but every other
        // endpoint here wraps in { data }. Accept both rather than depend on
        // which convention this one follows.
        const inner = (data as any)?.data ?? data;
        const newAccess: string | undefined = inner?.accessToken;
        const newRefresh: string | undefined = inner?.refreshToken;
        if (!newAccess) throw new Error("Refresh returned no access token");

        writeAccessToken(newAccess);
        // The API rotates the refresh token too; keeping the old one would
        // strand the session at the 7d mark instead of rolling it forward.
        if (newRefresh) writeRefreshToken(newRefresh);

        processQueue(null, newAccess);

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return apiClient(originalRequest as any);
      } catch (refreshError) {
        // Genuinely expired, revoked, or the account was blocked — the API
        // rejects refresh for BLOCKED users. Now a logout is correct.
        processQueue(refreshError, null);
        endSession();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (status === 403) {
      toast.error(serverMsg || "You do not have permission to perform this action.");
    } else if (status && status >= 500) {
      toast.error(serverMsg || "Something went wrong. Please try again.");
    } else if (!error?.response && error?.request) {
      toast.error("Network error. Please check your connection.");
    }

    return Promise.reject(error);
  }
);
