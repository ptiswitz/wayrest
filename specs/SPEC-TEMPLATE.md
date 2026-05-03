# SPEC-XXX — Component Name

## Context
<!-- What this component does and why it exists. -->
<!-- What it does NOT handle — explicitly state boundaries. -->
<!-- Who calls it and what it calls. -->

## TypeScript Interface
<!-- The exact contract — no ambiguity on types, optional fields, or unions. -->
<!-- The agent cannot invent an interface that is not specified here. -->

```typescript
interface ComponentNameProps {
  // define props here
}

interface ComponentNameEmits {
  // define emits here
}
```

## Expected Behaviors
<!-- Numbered list — each item maps to one test case. -->
<!-- Use "When X then Y" format. No "should" — state facts. -->

1. When ... then ...
2. When ... then ...
3. When ... then ...

## Edge Cases & Errors
<!-- What the code must do when things go wrong. -->
<!-- More important than the happy path. -->

- When ... then ...
- When ... then ...

## Technical Constraints
<!-- What the agent cannot decide alone. -->
<!-- Stack, patterns, dependencies imposed by the constitution. -->

- Use Tailwind CSS for all styling — no inline styles
- Follow Composition API conventions from the constitution
- No external dependencies beyond the constitution's stack

## Expected Tests
<!-- Named test cases to cover — the agent implements them. -->
<!-- No coverage percentage — named cases only. -->

- [ ] happy path: ...
- [ ] edge case: ...
- [ ] error case: ...