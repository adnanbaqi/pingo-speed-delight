
import { cn } from "@/lib/utils";

interface PerformanceGradeProps {
  value: number;
  type: "ping" | "download" | "upload";
}

const PerformanceGrade = ({ value, type }: PerformanceGradeProps) => {
  // Determine grade based on type and value
  const getGrade = () => {
    if (type === "ping") {
      if (value < 20) return { grade: "A+", color: "text-green-500" };
      if (value < 50) return { grade: "A", color: "text-green-500" };
      if (value < 80) return { grade: "B", color: "text-lime-500" };
      if (value < 120) return { grade: "C", color: "text-yellow-500" };
      if (value < 200) return { grade: "D", color: "text-orange-500" };
      return { grade: "F", color: "text-red-500" };
    } else if (type === "download") {
      if (value > 150) return { grade: "A+", color: "text-green-500" };
      if (value > 100) return { grade: "A", color: "text-green-500" };
      if (value > 50) return { grade: "B", color: "text-lime-500" };
      if (value > 25) return { grade: "C", color: "text-yellow-500" };
      if (value > 10) return { grade: "D", color: "text-orange-500" };
      return { grade: "F", color: "text-red-500" };
    } else { // upload
      if (value > 100) return { grade: "A+", color: "text-green-500" };
      if (value > 50) return { grade: "A", color: "text-green-500" };
      if (value > 25) return { grade: "B", color: "text-lime-500" };
      if (value > 10) return { grade: "C", color: "text-yellow-500" };
      if (value > 5) return { grade: "D", color: "text-orange-500" };
      return { grade: "F", color: "text-red-500" };
    }
  };

  const { grade, color } = getGrade();
  
  return (
    <div className="flex items-center gap-2">
      <span className={cn("font-bold text-2xl", color)}>{grade}</span>
      <span className="text-xs text-muted-foreground">Grade</span>
    </div>
  );
};

export default PerformanceGrade;
