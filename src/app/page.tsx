"use client";

import useSWR from "swr";
import { agent } from "@/lib/api";

export default function Homepage() {
  const { data, error, isLoading } = useSWR("getPopularFeedGenerators", () =>
    agent.app.bsky.unspecced.getPopularFeedGenerators({
      limit: 10,
    })
  );

  let contents;
  if (error) contents = <div>failed to load</div>;
  else if (isLoading) contents = <div>loading...</div>;
  else
    contents = (
      <ul>
        {data?.data.feeds.map((feed) => (
          <li key={feed.displayName}>{feed.displayName}</li>
        ))}
      </ul>
    );

  return (
    <div className="container mx-auto">
      <h1 className="font-bold text-xl my-4">Top Feeds</h1>
      {contents}
    </div>
  );
}
