import { Agent } from "@atproto/api";
import {
  BrowserOAuthClient,
  oauthClientMetadataSchema,
  OAuthSession,
} from "@atproto/oauth-client-browser";
import clientMetadata from "../../public/client-metadata.json";

export const TAG = "🦋sky📌pinner";

export const publicAgent = new Agent(new URL("https://api.bsky.app"));

// XXX manage this via useContext etc. https://github.com/bluesky-social/atproto/blob/main/packages/oauth/oauth-client-browser-example/src/auth/auth-provider.tsx#L88
// XXX see https://github.com/bluesky-social/atproto/tree/main/packages/oauth/oauth-client-browser
export const initializeAuthenticatedAgent = async (handle: string) => {
  const client = new BrowserOAuthClient({
    clientMetadata: oauthClientMetadataSchema.parse(clientMetadata),
    handleResolver: "https://bsky.social",
  });
  const result: undefined | { session: OAuthSession; state?: string | null } =
    await client.init();
  if (result) {
    const { session, state } = result;
    // If state is null, we restored a session
    if (state === null) return new Agent(session);

    try {
      await client.signIn(handle, {
        state: state,
        prompt: "none", // Attempt to sign in without user interaction (SSO)
        signal: new AbortController().signal, // Optional, allows to cancel the sign in (and destroy the pending authorization, for better security)
      });
      // This line never reached
    } catch (_err) {
      // The user aborted the authorization process by navigating "back"
      return undefined;
    }
  }
  return undefined;
};
