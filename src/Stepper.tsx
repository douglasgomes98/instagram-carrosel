import { Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type StepDefinition = {
  id: string;
  label: string;
  icon: LucideIcon;
};

type StepperProps = {
  steps: StepDefinition[];
  currentIndex: number;
  completed: boolean[];
  maxReachedIndex: number;
  onSelect: (index: number) => void;
};

export function Stepper({
  steps,
  currentIndex,
  completed,
  maxReachedIndex,
  onSelect,
}: StepperProps) {
  return (
    <nav className="stepper" aria-label="Etapas do carrossel">
      {steps.map((step, index) => {
        const isCurrent = index === currentIndex;
        const isDone = completed[index] && !isCurrent;
        const isReachable = index <= maxReachedIndex;
        const Icon = step.icon;

        return (
          <button
            key={step.id}
            type="button"
            className={`stepper-step${isCurrent ? " current" : ""}${isDone ? " done" : ""}`}
            onClick={() => isReachable && onSelect(index)}
            disabled={!isReachable}
            aria-current={isCurrent ? "step" : undefined}
          >
            <span className="stepper-index" aria-hidden="true">
              {isDone ? <Check size={14} /> : index + 1}
            </span>
            <span className="stepper-copy">
              <Icon size={15} strokeWidth={1.8} />
              {step.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
