import { useState } from "react"

type SeatGroupRule = {
  groupId: string
  matches: (id: string) => boolean
}

export function useSeatSelection(groupRules: SeatGroupRule[] = []) {
  const [activeGroup, setActiveGroup] = useState<string | null>(null)

  const handleSeatClick = (id: string) => {
    const matchingRule = groupRules.find((rule) => rule.matches(id))
    setActiveGroup(matchingRule?.groupId ?? id)
  }

  const getSelectedState = (id: string) => {
    const activeRule = groupRules.find((rule) => rule.groupId === activeGroup)

    if (activeRule?.matches(id)) {
      return id
    }

    return activeGroup === id ? id : null
  }

  return { activeGroup, handleSeatClick, getSelectedState }
}
