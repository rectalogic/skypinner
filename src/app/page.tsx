'use client';

import { useEffect, useState } from 'react';
import { agent } from "@/lib/api";
import { AppBskyUnspeccedGetPopularFeedGenerators } from "@atproto/api";

export default function Homepage() {
  const [feeds, setFeeds] = useState<AppBskyUnspeccedGetPopularFeedGenerators.Response | null>(null);
  useEffect(() => {
    const fetchFeeds = async () => {
      const result = await agent.app.bsky.unspecced.getPopularFeedGenerators({
        limit: 10,
      });
      setFeeds(result);
    };

    fetchFeeds();
  }, []);

  return (
    <div className="container mx-auto">
      <h1 className="font-bold text-xl my-4">Top Feeds</h1>
      <ul>
        {feeds?.data.feeds.map((feed) => (
          <li key={feed.displayName}>{feed.displayName}</li>
        ))}
      </ul>
    </div>
  );
}
