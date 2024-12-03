"use client";

import Form from 'next/form';

export default function HomePage() {
  return (
    <div className="container mx-auto">
      <h1 className="font-bold text-xl my-4">Search</h1>
        <Form action="/search">
          <input name="query" />
          <div>
            <button type="submit">Search</button>
          </div>
        </Form>
    </div>
  );
}
