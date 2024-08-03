"use client";

import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitButton } from "./submit-button";

export default function ProtectedPage({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const [message, setMessage] = useState<string>();
  const supabase = createClient();

  useEffect(() => {
    const func = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return redirect("/login");
      }
    };
    func();
  }, []);

  const updatePassword = async (formData: FormData) => {
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setMessage(`Code : ${error.code}\nMessage : ${error.message}`);
    } else {
      setMessage("Ok!");
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{" "}
        Back
      </Link>

      <form className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          type="password"
          name="password"
          placeholder="same password here"
          required
        />
        <SubmitButton
          formAction={updatePassword}
          className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
          pendingText="Signing In..."
        >
          Update Password
        </SubmitButton>
        {searchParams?.message && (
          <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
            {searchParams.message}
          </p>
        )}
        <h1 className="whitespace-pre-wrap">{message}</h1>
      </form>
    </div>
  );
}
