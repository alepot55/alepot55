import { ValueCell } from "./value-cell"
import { ROW_GRID, VALUE_SLOT } from "@/lib/constants"
import type { Achievement } from "@/lib/constants"

interface AchievementItemProps {
  achievement: Achievement
}

export function AchievementItem({ achievement }: AchievementItemProps) {
  return (
    <li className={`${ROW_GRID} py-4`}>
      <p className="font-mono text-meta text-ref">
        {achievement.organization} · {achievement.date}
      </p>

      <h3 className="font-mono text-index font-semibold text-ink">{achievement.title}</h3>

      <ValueCell
        value={achievement.value}
        unit={achievement.unit}
        artifact={achievement.artifact}
        className={VALUE_SLOT}
      />

      <p className="max-w-measure text-body text-ink">{achievement.description}</p>
    </li>
  )
}
