"use client";

import { useSearchParams } from 'next/navigation'
import useSWR from "swr";
import { agent, TAG } from "@/lib/api";

export default function SearchPage() {
  const searchParams = useSearchParams()
  const params = {
    q: `#${TAG} ` + (searchParams.get("query") || ""), //XXX add #TAG to the query
    tag: [TAG],
    limit: 20,
  };
  const { data, error, isLoading } = useSWR(
    ["app.bsky.feed.searchPosts", params],
    ([_key, params]) => agent.app.bsky.feed.searchPosts(params)
  );

  let contents;
  if (error) contents = <div>failed to load</div>;
  else if (isLoading) contents = <div>loading...</div>;
  else
    contents = (
      <ul>
        {data?.data.posts.map(
          (
            post //XXX filter to posts with external embeds
          ) => (
            <li key={post.uri}>{post.uri}</li> //XXX render the external embed
          )
        )}
      </ul>
    );

  return (
    <div className="container mx-auto">
      <h1 className="font-bold text-xl my-4">Search Results</h1>
      {contents}
    </div>
  );
}
