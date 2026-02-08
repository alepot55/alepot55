import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
          404
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          Page not found
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:opacity-90 transition-opacity"
        >
          Back to Portfolio
        </Link>
      </div>
    </div>
  )
}
