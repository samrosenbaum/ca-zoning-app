"use client"

import { useRef, useEffect, useState } from "react"
import { Clock, AlertTriangle, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { TimelineStage } from "@/lib/types"

interface ApprovalTimelineProps {
  stages: TimelineStage[]
  adjustmentFactor: number
}

export default function ApprovalTimeline({ stages, adjustmentFactor }: ApprovalTimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (timelineRef.current) {
      observer.observe(timelineRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  // Calculate cumulative days for each stage
  let cumulativeDays = 0
  const stagesWithCumulative = stages
    .sort((a, b) => a.order - b.order)
    .map((stage) => {
      const adjustedDuration = Math.round(stage.avgDuration * adjustmentFactor)
      cumulativeDays += adjustedDuration
      return {
        ...stage,
        adjustedDuration,
        cumulativeDays,
      }
    })

  const totalDuration =
    stagesWithCumulative.length > 0 ? stagesWithCumulative[stagesWithCumulative.length - 1].cumulativeDays : 0

  return (
    <div ref={timelineRef} className="relative">
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

      <div className="space-y-10">
        {stagesWithCumulative.map((stage, index) => (
          <div
            key={index}
            className={`relative pl-14 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
            }`}
            style={{ transitionDelay: `${index * 200}ms` }}
          >
            <div
              className={`absolute left-0 top-0 w-12 h-12 rounded-full flex items-center justify-center ${
                stage.riskLevel === "high"
                  ? "bg-red-100 text-red-600"
                  : stage.riskLevel === "medium"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-green-100 text-green-600"
              }`}
            >
              {index === stagesWithCumulative.length - 1 ? (
                <Check className="h-6 w-6" />
              ) : stage.riskLevel === "high" ? (
                <AlertTriangle className="h-6 w-6" />
              ) : (
                <Clock className="h-6 w-6" />
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <h3 className="text-lg font-medium">{stage.name}</h3>
                <div className="flex items-center ml-3 space-x-2">
                  <Badge
                    className={`${
                      stage.riskLevel === "high"
                        ? "bg-red-500"
                        : stage.riskLevel === "medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                  >
                    {stage.riskLevel.toUpperCase()} RISK
                  </Badge>
                  <Badge variant="outline" className="ml-2">
                    {stage.adjustedDuration} days
                  </Badge>
                </div>
              </div>
              <p className="text-gray-600 text-sm">{stage.description}</p>

              <div className="relative h-2 bg-gray-100 rounded-full w-full max-w-3xl mt-2">
                <div
                  className="absolute left-0 h-2 bg-blue-500 rounded-full"
                  style={{ width: `${(stage.cumulativeDays / totalDuration) * 100}%` }}
                ></div>
                <div className="absolute -bottom-6 text-xs text-gray-500">
                  Day {stage.cumulativeDays - stage.adjustedDuration + 1} - Day {stage.cumulativeDays}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 pt-6 border-t flex justify-between text-sm text-gray-500">
        <div>Day 1</div>
        <div>Estimated Completion: Day {totalDuration}</div>
      </div>
    </div>
  )
}
