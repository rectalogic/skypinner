"use client";

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

export function useOAuthClient() {
  const [client, setClient] = useState<BrowserOAuthClient>();
  useEffect(() => {
    setClient(
      new BrowserOAuthClient({
        clientMetadata:
          process.env.NODE_ENV === "production"
            ? oauthClientMetadataSchema.parse(clientMetadata)
            : atprotoLoopbackClientMetadata(
                `http://localhost?redirect_uri=${encodeURIComponent(
                  "http://127.0.0.1:3000/login/"
                )}`
              ),
        handleResolver: "https://bsky.social",
      })
    );
  }, []);
  return client;
}

export function signOut(agent: Agent, client: BrowserOAuthClient) {
  if (agent.sessionManager.did) client.revoke(agent.sessionManager.did);
}

export function useOAuthAgent(handle?: string, referrer?: string) {
  const router = useRouter();
  const client = useOAuthClient();
  const [agent, setAgent] = useState<Agent>();
  const [state, setState] = useState<string | null | undefined>(referrer);

  useEffect(() => {
    client
      ?.init()
      .then(
        (
          result: undefined | { session: OAuthSession; state?: string | null }
        ) => {
          if (result && result.session) {
            setAgent(new Agent(result.session));
            setState(result.state);
          } else {
            if (handle && !result) {
              client
                .signIn(handle, {
                  state: referrer,
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
  }, [router, handle, client]);
  return { agent, state };
}
