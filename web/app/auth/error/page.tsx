import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import Link from "next/link";
import Wordmark from "@/components/wordmark";

async function ErrorContent({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      {params?.error ? (
        <p className="text-sm text-muted-foreground">
          Code error: {params.error}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">
          An unspecified error occurred.
        </p>
      )}
    </>
  );
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Wordmark className="justify-center" />
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Sorry, something went wrong.
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Suspense>
                <ErrorContent searchParams={searchParams} />
              </Suspense>
              <Link
                href="/"
                className="inline-block text-sm font-medium underline-offset-4 hover:underline"
              >
                Back to sign in
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
