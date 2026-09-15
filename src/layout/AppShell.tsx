import { FileArchive } from "lucide-react";
import type { ReactNode } from "react";
import { type StepDefinition, Stepper } from "../components/Stepper";

type AppShellProps = {
  steps: StepDefinition[];
  stepIndex: number;
  completed: boolean[];
  maxStepReached: number;
  onSelectStep: (index: number) => void;
  showZipButton: boolean;
  zipLabel: string;
  isZipping: boolean;
  onDownloadZip: () => void;
  children: ReactNode;
};

export function AppShell({
  steps,
  stepIndex,
  completed,
  maxStepReached,
  onSelectStep,
  showZipButton,
  zipLabel,
  isZipping,
  onDownloadZip,
  children,
}: AppShellProps) {
  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Frame, início">
          <span className="brand-symbol" aria-hidden="true">
            ✣
          </span>
          <span>FRAME</span>
        </a>

        <Stepper
          steps={steps}
          currentIndex={stepIndex}
          completed={completed}
          maxReachedIndex={maxStepReached}
          onSelect={onSelectStep}
        />

        {showZipButton ? (
          <div className="topbar-actions">
            <button
              className="header-zip-button"
              type="button"
              onClick={onDownloadZip}
              disabled={isZipping}
            >
              <FileArchive size={15} />
              {zipLabel}
            </button>
          </div>
        ) : null}
      </header>

      {children}
    </main>
  );
}
