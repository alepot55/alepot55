import Link from "next/link"

export default function NotFound() {
  return (
    <main
      id="main"
      tabIndex={-1}
      className="mx-auto flex min-h-screen max-w-content flex-col justify-center px-5 sm:px-8"
    >
      <p className="font-mono text-meta text-ref">404</p>

      <h1 className="mt-2 font-mono text-[clamp(1.5rem,3.6vw,2.25rem)] font-semibold leading-[1.1] tracking-snug text-ink">
        Page not found
      </h1>

      <p className="mt-5 max-w-measure text-body leading-relaxed text-ink sm:text-lead">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <div className="mt-6">
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center font-mono text-nav text-ref underline decoration-rail underline-offset-4 transition-colors hover:text-ink hover:decoration-limit"
        >
          Back to portfolio
        </Link>
      </div>
    </main>
  )
}
