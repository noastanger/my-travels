import { create } from 'zustand';

export type SocialPlatform = 'instagram' | 'tiktok' | 'facebook' | 'google-maps';

export interface ConnectedAccount {
  platform: SocialPlatform;
  connected: boolean;
  handle?: string;
}

export interface UserProfile {
  email: string;
  username: string;
  connections: ConnectedAccount[];
  onboardingComplete: boolean;
}

const STORAGE_KEY = 'my-travels:profile';

const DEFAULT_CONNECTIONS: ConnectedAccount[] = [
  { platform: 'instagram', connected: false },
  { platform: 'tiktok', connected: false },
  { platform: 'facebook', connected: false },
  { platform: 'google-maps', connected: false },
];

function load(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function save(profile: UserProfile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

interface ProfileStore {
  profile: UserProfile | null;
  setProfile: (data: Pick<UserProfile, 'email' | 'username'>) => void;
  toggleConnection: (platform: SocialPlatform, handle?: string) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export const useProfileStore = create<ProfileStore>((set, get) => ({
  profile: load(),

  setProfile({ email, username }) {
    const existing = get().profile;
    const profile: UserProfile = {
      email,
      username,
      connections: existing?.connections ?? DEFAULT_CONNECTIONS,
      onboardingComplete: existing?.onboardingComplete ?? false,
    };
    save(profile);
    set({ profile });
  },

  toggleConnection(platform, handle) {
    const existing = get().profile;
    if (!existing) return;
    const connections = existing.connections.map((c) =>
      c.platform === platform
        ? { ...c, connected: !c.connected, handle: !c.connected ? handle : undefined }
        : c
    );
    const profile = { ...existing, connections };
    save(profile);
    set({ profile });
  },

  completeOnboarding() {
    const existing = get().profile;
    if (!existing) return;
    const profile = { ...existing, onboardingComplete: true };
    save(profile);
    set({ profile });
  },

  resetOnboarding() {
    localStorage.removeItem(STORAGE_KEY);
    set({ profile: null });
  },
}));
