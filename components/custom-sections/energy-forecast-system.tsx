import type { Project } from "@/data/projects"

/**
 * The earlier version of this section plotted a forecast curve and an rMAE bar
 * chart built from the synthetic development set, which read as a measured
 * result and was not one. What is actually true about this project is its
 * shape: where the data comes from, what runs on a schedule, and what has to
 * pass before a change merges. So that is what it shows.
 */

const SOURCES = [
  { name: "ENTSO-E", detail: "prices, load, generation, hourly" },
  { name: "Open-Meteo", detail: "forecast plus ERA5 archive, six-hourly" },
  { name: "TTF futures", detail: "gas, daily" },
]

const STAGES = [
  {
    step: "Ingest",
    detail: "Celery beat schedules every pull, each task with exponential-backoff retry",
  },
  {
    step: "Store",
    detail: "TimescaleDB hypertables, UTC throughout, chunks compressed past 30 days",
  },
  {
    step: "Model",
    detail: "LightGBM over price lags, residual demand, calendar, gas and weather",
  },
  {
    step: "Serve",
    detail: "Async FastAPI, with a Streamlit dashboard reading the same API",
  },
]

const GATES = [
  { rule: "rMAE against a weekly naive forecast", note: "MAPE is banned: prices go negative" },
  { rule: "Per-horizon MAE regression under 5 percent", note: "or the merge fails" },
  { rule: "Empirical coverage inside [0.78, 0.82]", note: "or the merge fails" },
  { rule: "Diebold-Mariano against the seasonal naive", note: "is the edge real or lucky" },
]

const SCOPE = [
  { value: "7", label: "bidding zones" },
  { value: "168 h", label: "horizon" },
  { value: "1 h", label: "resolution" },
]

export function EnergyForecastSystem({ project: _project }: { project: Project }) {
  return (
    <div className="space-y-8">
      <dl className="flex flex-wrap gap-x-12 gap-y-4">
        {SCOPE.map((s) => (
          <div key={s.label}>
            <dt className="sr-only">{s.label}</dt>
            <dd className="font-mono text-value-s font-medium text-ink tnum">{s.value}</dd>
            <p className="mt-1 font-mono text-meta text-ref">{s.label}</p>
          </div>
        ))}
      </dl>

      <div>
        <h4 className="font-mono text-meta text-ref">Sources</h4>
        <ul className="mt-2 space-y-1">
          {SOURCES.map((s) => (
            <li key={s.name} className="flex flex-wrap items-baseline gap-x-3">
              <span className="font-mono text-body text-ink">{s.name}</span>
              <span className="font-mono text-meta text-ref">{s.detail}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-mono text-meta text-ref">Pipeline</h4>
        <ol className="mt-2 space-y-2">
          {STAGES.map((s) => (
            <li
              key={s.step}
              className="grid grid-cols-1 gap-x-8 gap-y-0.5 sm:grid-cols-[9rem_1fr]"
            >
              <span className="font-mono text-body text-ink">{s.step}</span>
              <span className="max-w-measure text-body text-ref">{s.detail}</span>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <h4 className="font-mono text-meta text-ref">What has to pass before a merge</h4>
        <ul className="mt-2 space-y-2">
          {GATES.map((g) => (
            <li key={g.rule} className="max-w-measure">
              <p className="text-body text-ink">{g.rule}</p>
              <p className="font-mono text-meta text-ref">{g.note}</p>
            </li>
          ))}
        </ul>
      </div>

      <p className="max-w-measure border-t border-rail pt-4 font-mono text-meta text-ref">
        No measured accuracy is claimed here. The ENTSO-E backfill waits on an API token, so the
        only numbers so far come from a synthetic development set and stay in the write-up.
      </p>
    </div>
  )
}
