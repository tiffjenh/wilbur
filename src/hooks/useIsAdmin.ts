import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { requireAdmin } from "@/lib/supabase/adminLessons";

/**
 * Returns whether the current user is in the admin allowlist.
 * Use for conditionally showing Admin link in Profile dropdown.
 */
export function useIsAdmin(): { isAdmin: boolean; loading: boolean } {
  const { user, loading: authLoading } = useAuth();
  const [adminChecked, setAdminChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) {
      setAdminChecked(true);
      setIsAdmin(false);
      return;
    }
    requireAdmin(user.id).then((ok) => {
      setAdminChecked(true);
      setIsAdmin(ok);
    });
  }, [user?.id]);

  return {
    isAdmin: !!user && isAdmin,
    loading: authLoading || (!!user && !adminChecked),
  };
}
