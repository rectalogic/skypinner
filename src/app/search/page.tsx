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
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">{embed.title}</h2>
          <p>{embed.description}</p>
          <div className="card-actions">
            <a className="link link-primary" href={embed.uri}>
              {embed.uri}
            </a>
          </div>
        </div>
      </div>
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
    contents = data?.data.posts.map((post) => (
      <Post key={post.uri} post={post} />
    ));

  return (
    <>
      <h1 className="font-bold text-xl my-4">Search Results</h1>
      {contents}
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <Search />
    </Suspense>
  );
}
