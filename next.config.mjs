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
  trailingSlash: true,
}

export default nextConfig
