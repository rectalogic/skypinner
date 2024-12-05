"use client";

import Form from "next/form";

async function onSubmit(data: FormData) {
  console.log(data);
}

export default function Post() {
  return (
    <Form className="grid place-content-center rounded" action={onSubmit}>
      <div className="flex w-full flex-col lg:flex-row">
        XXX add bookmark form
      </div>
      <button className="btn btn-neutral">Post</button>
    </Form>
  );
}
