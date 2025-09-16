import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { authType } from "@/lib/auth";
export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  plugins: [inferAdditionalFields<authType>()],
});
