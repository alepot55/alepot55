/**
 * The live site is served from https://alepot55.github.io/alepot55, so the
 * production build needs that prefix. Anywhere else, including Vercel preview
 * deployments and local dev, the site sits at the root and the prefix would
 * break every asset URL.
 */
const isGitHubPages = process.env.NODE_ENV === "production" && !process.env.VERCEL
const basePath = isGitHubPages ? "/alepot55" : ""

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath ? `${basePath}/` : "",
  images: {
    unoptimized: true,
  },
  // the client needs the same prefix the build used, for assets it requests
  // itself (the chess piece SVGs), so it is not guessed twice
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  trailingSlash: true,
}

export default nextConfig
