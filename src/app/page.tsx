"use client";

import Form from "next/form";

export default function HomePage() {
  return (
    <div className="card bg-base-200 w-80">
      <div className="card-body">
        <Form action="/search">
          <div className="card-body">
            <input
              name="query"
              placeholder="query"
              className="input input-bordered"
            />
            <button className="btn btn-neutral">Search</button>
          </div>
        </Form>
      </div>
    </div>
  );
}
