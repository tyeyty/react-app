import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
export const isPortfolioAdmin = (user: {id: string} | null | undefined) => user?.id === "16a998ca-2ad3-4088-8ad9-65171dc0c055";
export function usePortfolioAdmin() {
  const [admin, setAdmin] = useState<boolean | null>(null);
  useEffect(() => {
    let active = true;
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setAdmin(isPortfolioAdmin(session?.user));
    });
    return () => { active = false; data.subscription.unsubscribe(); };
  }, []);
  return admin;
}
