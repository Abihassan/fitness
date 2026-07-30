import React, { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { Exercise } from "../types";

interface PendingSelectionValue {
  pendingExercise: Exercise | null;
  offerExercise: (exercise: Exercise) => void;
  clearPendingExercise: () => void;
}

const Ctx = createContext<PendingSelectionValue | null>(null);

export function PendingSelectionProvider({ children }: { children: ReactNode }) {
  const [pendingExercise, setPendingExercise] = useState<Exercise | null>(null);

  const offerExercise = useCallback((exercise: Exercise) => setPendingExercise(exercise), []);
  const clearPendingExercise = useCallback(() => setPendingExercise(null), []);

  return (
    <Ctx.Provider value={{ pendingExercise, offerExercise, clearPendingExercise }}>
      {children}
    </Ctx.Provider>
  );
}

/** Add Exercise calls offerExercise() then router.back(); whichever screen
 * requested it (currently only Edit Routine) reads pendingExercise on
 * refocus and calls clearPendingExercise() once it's consumed it. */
export function usePendingSelection(): PendingSelectionValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePendingSelection() must be called within <PendingSelectionProvider>");
  return ctx;
}
