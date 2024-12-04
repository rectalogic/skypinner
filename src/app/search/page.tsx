"use client";

import { useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import {
  AppBskyFeedPost,
  AppBskyEmbedExternal,
  AppBskyFeedDefs,
} from "@atproto/api";
import { publicAgent, TAG } from "@/lib/api";

function Post({ post }: { post: AppBskyFeedDefs.PostView }) {
  const embed = useMemo(
    () =>
      AppBskyFeedPost.isRecord(post.record) &&
      AppBskyFeedPost.validateRecord(post.record).success &&
      AppBskyEmbedExternal.isMain(post.record.embed)
        ? post.record.embed.external
        : undefined,
    [post]
  );
  if (embed) {
    return (
      <>
        <dt>{embed.title}</dt>
        <dd>
          <div>{embed.description}</div>
          <div>
            <a href={embed.uri}>{embed.uri}</a>
          </div>
        </dd>
      </>
    );
  }
  return null;
}

function Search() {
  const searchParams = useSearchParams();
  const params = {
    q: `#${TAG} ` + (searchParams.get("query") || ""), //XXX add #TAG to the query
    tag: [TAG],
    limit: 20,
  };
  //XXX handle pagination
  const { data, error, isLoading } = useSWR(
    ["app.bsky.feed.searchPosts", params],
    ([_key, params]) => publicAgent.app.bsky.feed.searchPosts(params)
  );

  let contents;
  if (error) contents = <div>failed to load</div>;
  else if (isLoading) contents = <div>loading...</div>;
  else
    contents = (
      <dl>
        {data?.data.posts.map((post) => (
          <Post key={post.uri} post={post} />
        ))}
      </dl>
    );

  return (
    <div className="container mx-auto">
      <h1 className="font-bold text-xl my-4">Search Results</h1>
      {contents}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <Search />
    </Suspense>
  );
}
