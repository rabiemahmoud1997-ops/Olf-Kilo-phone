export type ConstraintSeverity = "hard" | "soft";

export interface VariantConstraint {
  id: string;
  severity: ConstraintSeverity;
  predicate: () => boolean;
  violationMessage: string;
}

export interface ConstraintEvaluation {
  constraintId: string;
  severity: ConstraintSeverity;
  passed: boolean;
  violation?: string;
}

export function evaluateConstraints(constraints: VariantConstraint[]): ConstraintEvaluation[] {
  return constraints.map((c) => {
    const passed = c.predicate();
    const result: ConstraintEvaluation = {
      constraintId: c.id,
      severity: c.severity,
      passed
    };
    if (!passed) result.violation = c.violationMessage;
    return result;
  });
}

export function hasHardViolation(evaluations: ConstraintEvaluation[]): boolean {
  return evaluations.some((e) => e.severity === "hard" && !e.passed);
}

export function isFeasible(evaluations: ConstraintEvaluation[]): boolean {
  return !hasHardViolation(evaluations);
}
