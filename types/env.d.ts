declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_SUPABASE_URL: string;
      EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
      EXPO_PUBLIC_MAPS_API_KEY: string;
      API_BASE_URL: string;
      AI_RISK_API_KEY: string;
    }
  }
}

export {};
