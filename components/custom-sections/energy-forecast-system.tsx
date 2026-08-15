import type { Project } from "@/data/projects"

/**
 * One picture: the seven zones the model has to forecast, and how they hang
 * together. A chain from north to south, with Sardinia branching off the
 * centre and Sicily hanging at the end by a single link.
 *
 * Nothing here was measured. Zone composition and interconnections come from
 * Terna, Allegato A.24 al Codice di Rete, in force since 1 January 2021.
 */

const ZONES = [
  {
    code: "NORD",
    regions: "Valle d'Aosta, Piemonte, Liguria, Lombardia, Trentino-Alto Adige, Veneto, Friuli-Venezia Giulia, Emilia-Romagna",
    spine: "start" as const,
  },
  { code: "CNOR", regions: "Toscana, Marche", spine: "mid" as const },
  { code: "CSUD", regions: "Lazio, Abruzzo, Umbria, Campania", spine: "mid" as const },
  {
    code: "SARD",
    regions: "Sardegna",
    spine: "branch" as const,
    note: "island, reached by the SAPEI submarine cable",
  },
  { code: "SUD", regions: "Molise, Puglia, Basilicata", spine: "mid" as const },
  { code: "CALA", regions: "Calabria", spine: "mid" as const },
  {
    code: "SICI",
    regions: "Sicilia",
    spine: "end" as const,
    note: "island, one link to the rest of Italy",
  },
]

export function EnergyForecastSystem({ project: _project }: { project: Project }) {
  return (
    <div>
      <p className="max-w-measure text-body text-ref">
        Since January 2025 Italian buyers no longer settle at one national price. They settle at the
        price of their zone, so the model has seven targets, not one.
      </p>

      <ol className="mt-6">
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

            <div className="grid gap-x-6 sm:grid-cols-[4.5rem_1fr]">
              <p className="font-mono text-body text-ink">{zone.code}</p>
              <div>
                <p className="max-w-measure text-body text-ref">{zone.regions}</p>
                {zone.note && (
                  <p className="font-mono text-meta text-ref">{zone.note}</p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-5 max-w-measure border-t border-rail pt-4 font-mono text-meta text-ref">
        Zones and links from Terna, Allegato A.24 al Codice di Rete, in force since 1 January 2021.
        Nothing on this page has been measured: the ENTSO-E backfill waits on an API token, so no
        forecast has yet been scored against a real price.
      </p>
    </div>
  )
}
