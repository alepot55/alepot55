import { ValueCell } from "./value-cell"
import { ROW_GRID, VALUE_SLOT } from "@/lib/constants"
import type { Achievement } from "@/lib/constants"

interface AchievementItemProps {
  achievement: Achievement
}

export function AchievementItem({ achievement }: AchievementItemProps) {
  return (
    <li className={`border-t border-rail py-3.5 ${ROW_GRID}`}>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="font-mono text-lead font-semibold tracking-snug text-ink">
          {achievement.title}
        </h3>
        <p className="font-mono text-meta text-ref">
          {achievement.organization} · {achievement.date}
        </p>
      </div>

      <ValueCell
        value={achievement.value}
        unit={achievement.unit}
        artifact={achievement.artifact}
        className={VALUE_SLOT}
      />

      <p className="max-w-measure text-body text-ref">{achievement.summary}</p>
    </li>
  )
}
