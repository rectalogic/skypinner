"use client";

import { useEffect } from "react";
import Form from "next/form";
import { useRouter } from "next/navigation";
import { useOAuthAgent } from "@/lib/use-oauth";

export default function Post() {
  const router = useRouter();
  const { agent } = useOAuthAgent();
  useEffect(() => {
    if (!agent) router.push("/login");
  }, [agent, router]);

  async function onSubmitPost(data: FormData) {
    console.log(data);
  }

  // XXX add tags to form
  return (
    <Form className="grid place-content-center rounded" action={onSubmitPost}>
      <div className="flex w-full flex-col lg:flex-row">
        <input
          name="title"
          type="text"
          placeholder="Title"
          className="input input-bordered w-full max-w-xs"
        />
        <textarea
          name="description"
          className="textarea textarea-bordered"
          placeholder="Description"
        ></textarea>
        <input
          name="url"
          type="text"
          placeholder="URL"
          className="input input-bordered w-full max-w-xs"
        />
      </div>
      <button className="btn btn-neutral">Post</button>
    </Form>
  );
}
