"use client";

import { Button } from "@/ds/atoms/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col gap-8">
        <h1 className="text-4xl font-bold text-center mb-4">
          Welcome to Jaseci Forge
        </h1>
        <p className="text-xl text-center text-gray-600 mb-8">
          Your starting point for building powerful applications with Jaseci
        </p>
        <Link href="https://docs.jaseci.org" target="_blank">
          <Button size="lg" className="text-lg">
            Learn about Jaseci Forge
          </Button>
        </Link>
      </div>
    </main>
  );
}
