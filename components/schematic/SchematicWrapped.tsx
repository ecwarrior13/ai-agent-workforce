"use client";

import { createClient } from "@/utils/supabase/client";
import { useSchematicEvents } from "@schematichq/schematic-react";
import { useEffect } from "react";

const SchematicWrapped = ({ children }: { children: React.ReactNode }) => {
  const { identify } = useSchematicEvents();
  const supabase = createClient();

  useEffect(() => {
    const initializeAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Identify the user in Schematic with their Supabase user data
        identify({
          company: {
            keys: {
              id: user.id,
            },
            name: user.user_metadata?.full_name || user.email,
          },
          keys: {
            id: user.id,
          },
          name: user.user_metadata?.full_name || user.email,
        });
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        identify({
          company: {
            keys: {
              id: session.user.id,
            },
            name: session.user.email,
          },
          keys: {
            id: session.user.id,
          },
          name: session.user.email,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [identify, supabase]);

  return children;
};

export default SchematicWrapped;
