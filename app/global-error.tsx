"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  ArrowLeft,
  CircleAlert,
  RefreshCcw,
  RotateCcw,
  VerifiedIcon,
} from "lucide-react";
import { Geist } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

interface GlobalErrorProps {
  error: Error;
  unstable_retry: () => void;
}

const _geistSans = Geist({ subsets: ["latin"] });

export default function GlobalError({
  error,
  unstable_retry,
}: GlobalErrorProps) {
  const isProduction = process.env.NODE_ENV === "production";
  const message = isProduction
    ? "We're experiencing technical difficulties. Please try again later."
    : error.message;

  return (
    <html>
      <body className={`${_geistSans.className} antialiased`}>
        <div className="max-w-7xl mx-auto min-h-dvh flex flex-col items-center justify-center">
          <main className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-5 flex flex-col items-center md:items-end justify-center relative">
              <div className="size-64 md:w-80 md:h-80 bg-muted flex items-center justify-center rounded-sm relative">
                <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
                  <Image
                    src="/error.png"
                    alt="Error"
                    width={320}
                    height={320}
                    loading="eager"
                  />
                </div>

                <div className="z-10 flex flex-col items-center">
                  <VerifiedIcon className="text-primary/20 size-30" />

                  <span className="absolute inset-0 flex items-center justify-center">
                    <CircleAlert className="text-destructive size-16 animate-pulse" />
                  </span>
                </div>
              </div>
            </div>

            <div className="md:col-span-7 flex flex-col gap-8">
              <div className="space-y-4">
                <p className="text-primary text-sm">ERROR 500</p>
                <h1 className="text-4xl md:text-5xl font-bold leading-none">
                  System Interruption
                  <br />
                  Detected
                </h1>
                <p className="text-lg text-primary leading-relaxed max-w-lg">
                  {message}
                </p>
              </div>

              <div className="flex gap-4">
                <Link
                  href="/"
                  className={buttonVariants({ variant: "default", size: "lg" })}
                >
                  <ArrowLeft className="size-4" />
                  Home
                </Link>

                <Button
                  variant="outline"
                  onClick={() => unstable_retry()}
                  size="lg"
                >
                  <RotateCcw className="size-4" />
                  Retry
                </Button>

                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  size="lg"
                >
                  <RefreshCcw className="size-4" />
                  Refresh
                </Button>
              </div>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
