import type { Project } from "@/data/projects"

/**
 * This section used to plot a forecast curve and an rMAE bar built from the
 * synthetic development set. Those read as measurements and were not, so they
 * are gone.
 *
 * Everything drawn here is true before a single price is fetched: the shape of
 * the market, the cadence of the jobs, the stages of the pipeline, and the
 * rules a change has to satisfy to merge. No value on this page was measured.
 *
 * Zone composition and interconnections: Terna, Allegato A.24 al Codice di
 * Rete, configuration in force since 1 January 2021.
 */

const COUNTS = [
  { value: "7", label: "bidding zones" },
  { value: "3", label: "upstream sources" },
  { value: "5", label: "scheduled jobs" },
  { value: "1 h", label: "stored resolution" },
]

/** canonical market order, north to south, islands last */
const ZONE_CODES = ["NORD", "CNOR", "CSUD", "SUD", "CALA", "SICI", "SARD"]

/**
 * Listed in spine order rather than market order: SARD is a branch off CSUD,
 * so it is drawn between CSUD and SUD where its connector belongs.
 */
const ZONES = [
  {
    code: "NORD",
    regions:
      "Valle d'Aosta, Piemonte, Liguria, Lombardia, Trentino-Alto Adige, Veneto, Friuli-Venezia Giulia, Emilia-Romagna",
    borders: "FRAN SVIZ AUST SLOV",
    spine: "start" as const,
    notes: ["380 kV to CNOR"],
  },
  {
    code: "CNOR",
    regions: "Toscana, Marche",
    borders: "CORS",
    spine: "mid" as const,
    notes: ["380 kV to CSUD"],
  },
  {
    code: "CSUD",
    regions: "Lazio, Abruzzo, Umbria, Campania",
    borders: "MONT",
    spine: "mid" as const,
    notes: ["380 kV to SUD"],
  },
  {
    code: "SARD",
    regions: "Sardegna",
    borders: "CORS",
    spine: "branch" as const,
    notes: [
      "island",
      "SAPEI, 500 kV DC submarine cable, to CSUD",
      "SACOI, 200 kV DC, reaches CNOR only through the Corsica virtual zone, so it is not a direct continental link",
    ],
  },
  {
    code: "SUD",
    regions: "Molise, Puglia, Basilicata",
    borders: "GREC",
    spine: "mid" as const,
    notes: ["380 kV to CALA"],
  },
  {
    code: "CALA",
    regions: "Calabria",
    borders: "",
    spine: "mid" as const,
    notes: ["Sorgente-Rizziconi, 380 kV, part submarine cable, to SICI"],
  },
  {
    code: "SICI",
    regions: "Sicilia",
    borders: "MALT",
    spine: "end" as const,
    notes: ["island", "the only link between Sicily and the rest of Italy"],
  },
]

/** log(hours) / log(168), so the ruler carries declared periods and nothing else */
const PERIODS = [
  { period: "1 h", label: "prices", pos: "left-0", align: "text-left" },
  { period: "6 h", label: "weather", pos: "left-[34.97%] -translate-x-1/2", align: "text-center" },
  {
    period: "24 h",
    label: "gas, forecast",
    pos: "left-[62.02%] -translate-x-1/2",
    align: "text-center",
  },
  { period: "168 h", label: "retrain", pos: "right-0", align: "text-right" },
]

const CADENCES = [
  { period: "1 h", detail: "prices, load and generation from ENTSO-E" },
  { period: "6 h", detail: "weather from Open-Meteo, forecast plus ERA5 archive" },
  { period: "24 h", detail: "gas from TTF futures" },
  { period: "24 h", detail: "day-ahead forecast, declared at 10:30" },
  { period: "168 h", detail: "model retrain, Monday" },
]

const PIPELINE = [
  {
    index: "01",
    stage: "Ingest",
    detail:
      "ENTSO-E prices, load and generation. Open-Meteo forecast plus ERA5 archive. TTF gas futures.",
    notes: ["every task retries with exponential backoff"],
  },
  {
    index: "02",
    stage: "Store",
    detail:
      "TimescaleDB hypertables. UTC in the database, Europe/Rome only at render time.",
    notes: [
      "incoming 15 minute data is resampled to 1 hour before persisting",
      "chunks compressed past 30 days",
    ],
  },
  {
    index: "03",
    stage: "Model",
    detail:
      "LightGBM over price lags, rolling statistics, residual demand, calendar encoding, gas and weather.",
    notes: ["LEAR, the daily-recalibrated LASSO, as the baseline"],
  },
  {
    index: "04",
    stage: "Serve",
    detail: "Async FastAPI. A Streamlit dashboard reads the same API.",
    notes: ["Docker Compose, with an nginx and Let's Encrypt overlay in production"],
  },
]

const RULES = [
  {
    rule: "rMAE = MAE(model) / MAE(naive)",
    detail:
      "The naive forecast for hour t is the price at hour t minus 168, one week back. MAPE is not used: these prices reach zero and go below it.",
  },
  {
    rule: "Diebold-Mariano against the seasonal naive",
    detail: "Whether the edge is statistically real or luck.",
  },
]

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h4 className="font-mono text-meta text-ref">{children}</h4>
}

export function EnergyForecastSystem({ project: _project }: { project: Project }) {
  return (
    <div className="space-y-10">
      {/* counts */}
      <dl className="flex flex-wrap gap-x-12 gap-y-4">
        {COUNTS.map((c) => (
          <div key={c.label}>
            <dt className="sr-only">{c.label}</dt>
            <dd className="font-mono text-value-s font-medium text-ink tnum">{c.value}</dd>
            <p className="mt-1 font-mono text-meta text-ref">{c.label}</p>
          </div>
        ))}
      </dl>

      {/* one price, then seven */}
      <div>
        <SectionTitle>One price, then seven</SectionTitle>

        <div className="mt-3 grid grid-cols-1 gap-y-3 sm:grid-cols-[9rem_1fr] sm:gap-x-8">
          <p className="font-mono text-meta text-ref">to 31 Dec 2024</p>
          <p className="font-mono text-value-s text-ink">PUN</p>

          <div className="col-span-full border-t border-rail" />

          <p className="font-mono text-meta text-ref">from 1 Jan 2025</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {ZONE_CODES.map((code) => (
              <span key={code} className="font-mono text-value-s text-ink">
                {code}
              </span>
            ))}
          </div>
        </div>

        <p className="mt-4 max-w-measure text-body text-ref">
          On 1 January 2025 the uniform national purchase price stopped being how Italian buyers
          settle on the day-ahead market. Demand now clears at the price of its own zone, and GME
          still publishes PUN Index GME after each session as a volume-weighted average of the
          zonal prices.
        </p>
        <p className="mt-2 font-mono text-meta text-ref">
          ARERA delibera 304/2024/R/eel, in force 1 January 2025
        </p>
      </div>

      {/* the seven zones */}
      <div>
        <SectionTitle>The seven zones, and what connects them</SectionTitle>

        <ol className="mt-3">
          {ZONES.map((zone) => (
            <li key={zone.code} className="grid grid-cols-[1.5rem_1fr] py-2">
              <div className="relative" aria-hidden="true">
                <span
                  className={`absolute left-[3px] w-px bg-rail ${
                    zone.spine === "start"
                      ? "bottom-0 top-[20px]"
                      : zone.spine === "end"
                        ? "top-0 h-[20px]"
                        : "bottom-0 top-0"
                  }`}
                />
                {zone.spine === "branch" ? (
                  <>
                    <span className="absolute left-[3px] top-[20px] h-px w-[10px] bg-rail" />
                    <span className="absolute left-[13px] top-[16px] h-[7px] w-[7px] rounded bg-ink" />
                  </>
                ) : (
                  <span className="absolute left-0 top-[16px] h-[7px] w-[7px] rounded bg-ink" />
                )}
              </div>

              <div className="grid gap-x-6 gap-y-1 sm:grid-cols-[4.5rem_1fr_8rem]">
                <p className="font-mono text-body text-ink">{zone.code}</p>
                <p className="max-w-measure text-body text-ref">{zone.regions}</p>
                {zone.borders && (
                  <p className="col-span-2 font-mono text-meta text-ref sm:col-span-1 sm:text-right">
                    borders {zone.borders}
                  </p>
                )}
                {zone.notes.map((note) => (
                  <p
                    key={note}
                    className="col-span-full font-mono text-meta text-ref sm:col-span-2 sm:col-start-2"
                  >
                    {note}
                  </p>
                ))}
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-4 max-w-measure border-t border-rail pt-3 font-mono text-meta text-ref">
          Six domestic links, no ring: one chain with one branch. Configuration in force since 1
          January 2021 (Terna, Allegato A.24 al Codice di Rete). Edges carry voltage only: no
          transit limit, no direction and no price level is drawn. FRAN, SVIZ, AUST, SLOV, CORS,
          MONT, GREC and MALT are foreign interconnection zones, not forecast targets.
        </p>
      </div>

      {/* cadences */}
      <div>
        <SectionTitle>What runs, and how often</SectionTitle>

        <div className="relative mt-4 hidden h-16 sm:block" aria-hidden="true">
          <span className="absolute left-0 right-0 top-0 h-px bg-rail" />
          {PERIODS.map((p) => (
            <span key={p.period} className={`absolute top-0 h-2 w-px bg-ink ${p.pos}`} />
          ))}
          {PERIODS.map((p) => (
            <div key={p.period} className={`absolute top-4 ${p.pos} ${p.align}`}>
              <p className="font-mono text-unit text-ink tnum">{p.period}</p>
              <p className="font-mono text-meta text-ref">{p.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 sm:sr-only">
          {CADENCES.map((c) => (
            <div key={`${c.period}-${c.detail}`} className="grid grid-cols-[5rem_1fr] py-1">
              <p className="font-mono text-meta text-ref tnum">{c.period}</p>
              <p className="text-body text-ref">{c.detail}</p>
            </div>
          ))}
        </div>

        <p className="mt-3 max-w-measure font-mono text-meta text-ref">
          Cadences declared under Celery beat, with exponential-backoff retry on every task. Only
          the day-ahead job carries a declared clock time; the axis shows how often a job runs,
          never at which hour, and never that one ran. 168 hours is also the lag of the naive
          forecast every model is scored against.
        </p>
      </div>

      {/* pipeline */}
      <div>
        <SectionTitle>Pipeline</SectionTitle>

        <ol className="mt-3">
          {PIPELINE.map((step, i) => (
            <li key={step.index} className="grid grid-cols-[2rem_1fr] gap-x-4 py-2">
              <div className="relative">
                <span
                  className={`absolute left-[calc(2rem-1px)] w-px bg-rail ${
                    i === 0
                      ? "bottom-0 top-[20px]"
                      : i === PIPELINE.length - 1
                        ? "top-0 h-[20px]"
                        : "bottom-0 top-0"
                  }`}
                  aria-hidden="true"
                />
                <p className="font-mono text-meta text-ref tnum">{step.index}</p>
              </div>

              <div>
                <p className="font-mono text-body text-ink">{step.stage}</p>
                <p className="max-w-measure text-body text-ref">{step.detail}</p>
                {step.notes.map((note) => (
                  <p key={note} className="font-mono text-meta text-ref">
                    {note}
                  </p>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* merge gates */}
      <div>
        <SectionTitle>What has to pass before a merge</SectionTitle>

        <div className="mt-4 space-y-8">
          <div>
            <p className="font-mono text-meta text-ref">empirical coverage must land inside</p>
            <p className="sr-only">
              A merge fails when empirical coverage falls outside 0.78 to 0.82.
            </p>
            <div className="relative mt-2 h-14" aria-hidden="true">
              <span className="absolute bottom-6 left-0 right-0 h-px bg-rail" />
              <span className="absolute bottom-6 left-0 h-px w-[40%] bg-accent" />
              <span className="absolute bottom-6 left-[60%] right-0 h-px bg-accent" />
              <span className="absolute bottom-6 left-[40%] top-0 w-[20%] border-x border-ink bg-ink/[0.05]">
                <span className="absolute inset-x-0 top-1 text-center font-mono text-meta text-ink">
                  accept
                </span>
              </span>
              <span className="absolute bottom-0 left-0 font-mono text-meta text-ref tnum">0.70</span>
              <span className="absolute bottom-0 left-[40%] -translate-x-1/2 font-mono text-meta text-ink tnum">
                0.78
              </span>
              <span className="absolute bottom-0 left-[60%] -translate-x-1/2 font-mono text-meta text-ink tnum">
                0.82
              </span>
              <span className="absolute bottom-0 right-0 font-mono text-meta text-ref tnum">0.90</span>
            </div>
            <p className="mt-1 font-mono text-meta text-accent">
              outside the window, the merge fails
            </p>
          </div>

          <div>
            <p className="font-mono text-meta text-ref">per-horizon MAE regression</p>
            <p className="sr-only">
              A merge fails when per-horizon mean absolute error regresses by more than 5 percent.
            </p>
            <div className="relative mt-2 h-14" aria-hidden="true">
              <span className="absolute bottom-6 left-0 right-0 h-px bg-rail" />
              <span className="absolute bottom-6 left-[50%] right-0 h-px bg-accent" />
              <span className="absolute bottom-6 left-0 top-0 w-[50%] border-x border-ink bg-ink/[0.05]">
                <span className="absolute inset-x-0 top-1 text-center font-mono text-meta text-ink">
                  accept
                </span>
              </span>
              <span className="absolute bottom-0 left-0 font-mono text-meta text-ref tnum">0</span>
              <span className="absolute bottom-0 left-[50%] -translate-x-1/2 font-mono text-meta text-ink tnum">
                +5%
              </span>
            </div>
            <p className="mt-1 font-mono text-meta text-accent">past 5 percent, the merge fails</p>
          </div>
        </div>

        <div className="mt-8">
          {RULES.map((r) => (
            <div key={r.rule} className="border-t border-rail py-3">
              <p className="font-mono text-body text-ink">{r.rule}</p>
              <p className="max-w-measure text-body text-ref">{r.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="max-w-measure border-t border-rail pt-4 font-mono text-meta text-ref">
        No accuracy is claimed on this page, and nothing above has been measured. The ENTSO-E
        backfill waits on an API token, so no forecast has yet been scored against a real price.
        What is drawn here is market structure, schedule, pipeline and merge rules: all of it is
        true before a single price is fetched.
      </p>
    </div>
  )
}
