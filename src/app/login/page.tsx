"use client";

import { useState, useEffect } from "react";
import Form from "next/form";
import { useSearchParams, useRouter } from "next/navigation";
import { useOAuthAgent } from "@/lib/use-oauth";

export default function Login() {
  const [referrer, setReferrer] = useState<string>();
  useEffect(() => {
    setReferrer(document.referrer);
  }, []);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { agent, state } = useOAuthAgent(
    searchParams.get("handle") || undefined,
    referrer
  );
  if (agent && state) {
    router.push(state);
    return;
  }
  return (
    <Form className="grid place-content-center rounded" action="">
      <div className="card rounded-box grid h-32 flex-grow place-items-center">
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
          </svg>
          <input
            name="handle"
            type="text"
            className="grow"
            placeholder="BlueSky Handle"
          />
        </label>
      </div>
      <button className="btn btn-neutral">Authenticate</button>
    </Form>
  );
}
