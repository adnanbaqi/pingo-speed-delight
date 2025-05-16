
import { cn } from "@/lib/utils";
import { memo } from 'react';

interface PerformanceGradeProps {
  value: number;
  type: "ping" | "download" | "upload";
}

// Memoized component for better performance
const PerformanceGrade = memo(({ value, type }: PerformanceGradeProps) => {
  // Determine grade based on type and value with more realistic thresholds
  const getGrade = () => {
    if (type === "ping") {
      if (value < 20) return { grade: "A+", color: "text-green-500" };
      if (value < 40) return { grade: "A", color: "text-green-500" };
      if (value < 60) return { grade: "B", color: "text-lime-500" };
      if (value < 100) return { grade: "C", color: "text-yellow-500" };
      if (value < 150) return { grade: "D", color: "text-orange-500" };
      return { grade: "F", color: "text-red-500" };
    } else if (type === "download") {
      if (value > 100) return { grade: "A+", color: "text-green-500" };
      if (value > 50) return { grade: "A", color: "text-green-500" };
      if (value > 25) return { grade: "B", color: "text-lime-500" };
      if (value > 10) return { grade: "C", color: "text-yellow-500" };
      if (value > 5) return { grade: "D", color: "text-orange-500" };
      return { grade: "F", color: "text-red-500" };
    } else { // upload
      if (value > 50) return { grade: "A+", color: "text-green-500" };
      if (value > 25) return { grade: "A", color: "text-green-500" };
      if (value > 10) return { grade: "B", color: "text-lime-500" };
      if (value > 5) return { grade: "C", color: "text-yellow-500" };
      if (value > 2) return { grade: "D", color: "text-orange-500" };
      return { grade: "F", color: "text-red-500" };
    }
  };

  const { grade, color } = getGrade();
  
  return (
    <div className="flex items-center gap-2">
      <div className={cn("font-bold text-2xl flex items-center justify-center w-10 h-10 rounded-full border", color, "border-white/10")}>
        {grade}
      </div>
    </div>
  );
});

PerformanceGrade.displayName = 'PerformanceGrade';

export default PerformanceGrade;
