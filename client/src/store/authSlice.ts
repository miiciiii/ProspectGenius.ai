import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserProfile = {
  id: string;
  email?: string;
  name?: string;
  [key: string]: any;
};

type Subscription = {
  planId?: string;
  status?: string;
  trialEndsAt?: string | null;
  [key: string]: any;
};

type AuthState = {
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  subscription: Subscription | null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  userProfile: null,
  subscription: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(
      state,
      action: PayloadAction<{
        userProfile: UserProfile;
        subscription?: Subscription;
      }>
    ) {
      state.isAuthenticated = true;
      state.userProfile = action.payload.userProfile;
      // Only overwrite subscription if caller provided it explicitly.
      // This avoids clearing an existing subscription when loginSuccess
      // is re-dispatched during rehydration or auth-state events without
      // subscription data.
      if (
        Object.prototype.hasOwnProperty.call(action.payload, "subscription")
      ) {
        state.subscription = action.payload.subscription ?? null;
      }
    },
    logout(state) {
      state.isAuthenticated = false;
      state.userProfile = null;
      state.subscription = null;
    },
    updateProfile(state, action: PayloadAction<UserProfile>) {
      state.userProfile = { ...(state.userProfile ?? {}), ...action.payload };
    },
    updateSubscription(state, action: PayloadAction<Subscription>) {
      state.subscription = { ...(state.subscription ?? {}), ...action.payload };
    },
  },
});

export const { loginSuccess, logout, updateProfile, updateSubscription } =
  authSlice.actions;

export default authSlice.reducer;
