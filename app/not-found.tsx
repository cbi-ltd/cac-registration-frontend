import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh space-y-4">
      <Image src="/page-not-found.svg" alt="404" width={60} height={60} />
      <h1 className="text-4xl font-bold">Page Not Found</h1>
      <p className="text-lg text-muted-foreground">This page does not exist</p>
      <Link
        href="/"
        className={buttonVariants({ variant: "default", size: "lg" })}
      >
        Go to home
      </Link>
    </div>
  );
}
