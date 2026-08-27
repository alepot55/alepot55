import type { Project } from "@/data/projects"

/**
 * Every upstream change, with its real state. Merged is merged; open is open;
 * a bug a maintainer fixed from my reproducer is credited to the report, not
 * claimed as a landed patch. Verified against the GitHub API on 2026-08-27.
 */

interface Entry {
  repo: string
  number: string
  title: string
  href: string
  note: string
}

const MERGED: Entry[] = [
  {
    repo: "triton-lang/triton",
    number: "11324",
    title: "Treat the warp_specialize terminators as CTA sync points",
    href: "https://github.com/triton-lang/triton/pull/11324",
    note: "30 redundant barriers removed from an H100 build",
  },
  {
    repo: "llvm/llvm-project",
    number: "216851",
    title: "Fix a mem2reg crash on a zero-extent alloca",
    href: "https://github.com/llvm/llvm-project/pull/216851",
    note: "mlir-opt no longer asserts on a zero-sized memref",
  },
  {
    repo: "llvm/llvm-project",
    number: "217392",
    title: "Do not read non-constant loop bounds when unrolling",
    href: "https://github.com/llvm/llvm-project/pull/217392",
    note: "three shapes where the trip count answered but the bounds were not constant",
  },
  {
    repo: "llvm/llvm-project",
    number: "216854",
    title: "Verify multi_reduction reduction dimensions",
    href: "https://github.com/llvm/llvm-project/pull/216854",
    note: "an out-of-bounds write reachable from a malformed op",
  },
  {
    repo: "triton-lang/triton",
    number: "11311",
    title: "Make the Example 4 plugin block in the docs parse",
    href: "https://github.com/triton-lang/triton/pull/11311",
    note: "documentation",
  },
]

const REPORTED: Entry[] = [
  {
    repo: "triton-lang/triton",
    number: "11328",
    title: "Multicast TMA into a memdesc view misses its cluster barrier",
    href: "https://github.com/triton-lang/triton/issues/11328",
    note: "fixed by Jokeren",
  },
  {
    repo: "triton-lang/triton",
    number: "11404",
    title: "A relaxed cluster_barrier is treated as a full cluster sync point",
    href: "https://github.com/triton-lang/triton/issues/11404",
    note: "fixed by lezcano",
  },
  {
    repo: "triton-lang/triton",
    number: "11407",
    title: "predicateOp drops the predicate on NotSpeculatable arithmetic",
    href: "https://github.com/triton-lang/triton/issues/11407",
    note: "fixed by lezcano",
  },
]

const OPEN: Entry[] = [
  {
    repo: "triton-lang/triton",
    number: "10766",
    title: "Fold split(join(a, b)) and join(split(x))",
    href: "https://github.com/triton-lang/triton/pull/10766",
    note: "shared memory 16,384 B to 0, SASS 224 to 72 instructions",
  },
  {
    repo: "triton-lang/triton",
    number: "11325",
    title: "Key subslice offset comparison on the value they came from",
    href: "https://github.com/triton-lang/triton/pull/11325",
    note: "soundness fix in Membar",
  },
  {
    repo: "llvm/llvm-project",
    number: "218226",
    title: "Only convert an scf.yield that terminates an scf.for",
    href: "https://github.com/llvm/llvm-project/pull/218226",
    note: "a cast abort on vector.contract inside scf.if",
  },
  {
    repo: "llvm/llvm-project",
    number: "216853",
    title: "Do not coalesce when an inner loop reads an outer iter_arg",
    href: "https://github.com/llvm/llvm-project/pull/216853",
    note: "four more MLIR fixes are open alongside this one",
  },
  {
    repo: "EleutherAI/sparsify",
    number: "143",
    title: "Shard the latent dimension across ranks",
    href: "https://github.com/EleutherAI/sparsify/pull/143",
    note: "two more sparsify patches are open alongside this one",
  },
]

function Group({
  label,
  entries,
  count,
}: {
  label: string
  entries: Entry[]
  /** the real total, when the list below is a selection from it */
  count?: string
}) {
  return (
    <div className="pt-6 first:pt-0">
      <p className="font-mono text-meta text-ref">
        {label} <span className="tnum">{count ?? entries.length}</span>
      </p>
      <ul role="list" className="mt-2">
        {entries.map((e) => (
          <li
            key={e.href}
            className="group grid grid-cols-1 gap-x-8 gap-y-1 border-t border-rail py-3 sm:grid-cols-[11rem_1fr]"
          >
            <a
              href={e.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-meta text-ref tnum underline decoration-rail underline-offset-4 transition-colors hover:text-ink hover:decoration-accent"
            >
              {e.repo.split("/")[1]} #{e.number}
            </a>
            <div>
              <p className="max-w-measure text-body text-ink">{e.title}</p>
              <p className="font-mono text-meta text-ref">{e.note}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function UpstreamContributions({ project: _project }: { project: Project }) {
  return (
    <div>
      <Group label="Merged" entries={MERGED} />
      <Group label="Reported, fixed by a maintainer" entries={REPORTED} />
      <Group label="Open" entries={OPEN} count="10, five shown" />

      <p className="mt-6 max-w-measure border-t border-rail pt-4 font-mono text-meta text-ref">
        States verified against the GitHub API on 27 August 2026. The three reported issues were
        fixed by Triton maintainers, not by a patch of mine: the credit there is for the report and
        the reproducer.
      </p>
    </div>
  )
}
