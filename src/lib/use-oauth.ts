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

export default function useOAuthAgent({ handle }: { handle?: string }) {
  const router = useRouter();
  const [agent, setAgent] = useState<Agent>();

  useEffect(() => {
    const client = new BrowserOAuthClient({
      clientMetadata:
        process.env.NODE_ENV === "production"
          ? oauthClientMetadataSchema.parse(clientMetadata)
          : atprotoLoopbackClientMetadata(
              `http://localhost?redirect_uri=${encodeURIComponent(
                "http://127.0.0.1:3000/post"
              )}`
            ),
      handleResolver: "https://bsky.social",
    });

    client
      .init()
      .then(
        (
          result: undefined | { session: OAuthSession; state?: string | null }
        ) => {
          if (result) {
            if (result.session) {
              setAgent(new Agent(result.session));
            } else {
              if (!handle) {
                router.push("/login");
              } else if (result.state) {
                client
                  .signIn(handle, {
                    state: result.state,
                    prompt: "none", // Attempt to sign in without user interaction (SSO)
                    signal: new AbortController().signal, // Optional, allows to cancel the sign in (and destroy the pending authorization, for better security)
                  })
                  .then(() => {
                    // This line never reached
                  })
                  .catch(console.error);
              }
            }
          }
        }
      )
      .catch(console.error);
  }, [router, handle]);
  return agent;
}
