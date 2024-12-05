import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Agent } from "@atproto/api";
import {
  BrowserOAuthClient,
  oauthClientMetadataSchema,
  OAuthSession,
  atprotoLoopbackClientMetadata,
} from "@atproto/oauth-client-browser";
import clientMetadata from "../../public/client-metadata.json";

const client = new BrowserOAuthClient({
  clientMetadata:
    process.env.NODE_ENV === "production"
      ? oauthClientMetadataSchema.parse(clientMetadata)
      : atprotoLoopbackClientMetadata(
          `http://localhost?redirect_uri=${encodeURIComponent(
            "http://127.0.0.1:3000/login/"
          )}`
        ),
  handleResolver: "https://bsky.social",
});

export function signOut(agent: Agent) {
  if (agent.sessionManager.did) client.revoke(agent.sessionManager.did);
}

export function useOAuthAgent({ handle }: { handle?: string }) {
  const router = useRouter();
  const [agent, setAgent] = useState<Agent>();

  useEffect(() => {
    client
      .init()
      .then(
        (
          result: undefined | { session: OAuthSession; state?: string | null }
        ) => {
          if (result && result.session) {
            setAgent(new Agent(result.session));
          } else {
            if (!handle) {
              router.push("/login");
            } else if (!result) {
              client
                .signIn(handle, {
                  state: document.location.href,
                  signal: new AbortController().signal, // Optional, allows to cancel the sign in (and destroy the pending authorization, for better security)
                })
                .then(() => {
                  // This line never reached
                })
                .catch(console.error);
            }
          }
        }
      );
  }, [router, handle]);
  return agent;
}
