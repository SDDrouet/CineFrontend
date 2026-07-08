import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepperProps {
  steps: string[];
  currentStep: number; // 1-indexado
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <ol className="mb-10 flex items-center">
      {steps.map((label, idx) => {
        const stepNumber = idx + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;
        const isLast = idx === steps.length - 1;

        return (
          <li key={label} className={cn("flex items-center", !isLast && "flex-1")}>
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition",
                  isCompleted && "border-amber-500 bg-amber-500 text-white",
                  isActive && "border-amber-500 text-amber-600",
                  !isCompleted && !isActive && "border-zinc-300 text-zinc-400"
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : stepNumber}
              </div>
              <span
                className={cn(
                  "whitespace-nowrap text-xs font-medium",
                  isCompleted || isActive ? "text-zinc-800" : "text-zinc-400"
                )}
              >
                {label}
              </span>
            </div>

            {!isLast && (
              <div className={cn("mx-3 h-0.5 flex-1", isCompleted ? "bg-amber-500" : "bg-zinc-200")} />
            )}
          </li>
        );
      })}
    </ol>
  );
}