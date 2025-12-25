# Metabolic Debugger: Atomic Design Refactor Plan

## Current State Analysis

### Existing Architecture Issues

1. **Monolithic Structure**: 1570-line `page.tsx` with inline component definitions
2. **Duplicate Components**: Multiple versions of FinalReport across directories
3. **Mixed Concerns**: Business logic, UI rendering, and data handling all together
4. **Incomplete Atomic Design**: Some components exist but lack consistency
5. **No Logic Separation**: Complex simulation logic embedded in UI components

### Current Technology Stack

- Next.js 15.2.3 with App Router
- React 19.0.0
- Tailwind CSS v4 (using `@theme` directive)
- tRPC for API layer
- Lucide React for icons
- Bun package manager

## Refactoring Strategy

### Phase 1: Foundation & Configuration

#### 1.1 Update Global Styles (Tailwind v4)

- Move custom animations from inline `<style>` to `@theme` directive
- Add shake animation keyframes
- Ensure animate classes work properly

#### 1.2 Enhanced Utilities

- Update `src/lib/utils.ts` with cn() function for class merging
- Add type-safe utility functions

#### 1.3 Extract Steps Configuration

- Move STEPS array from page.tsx to `src/config/steps.ts`
- Create proper TypeScript interfaces

### Phase 2: Type System Enhancement

#### 2.1 Comprehensive Type Definitions

- Extract all types from monolithic components
- Create proper interfaces for all data structures
- Ensure type safety across component boundaries

#### 2.2 Validation Types

- Standardize ValidateFn type across all components
- Create specific payload types for each step

### Phase 3: Logic Layer Separation

#### 3.1 Business Logic Extraction

- **Protein Analysis Logic**: Extract to `src/lib/analysis/protein.ts`
- **Meal Timing Logic**: Extract to `src/lib/analysis/meal-timing.ts`
- **Sleep Calculation Logic**: Extract to `src/lib/analysis/sleep.ts`
- **Validation Logic**: Extract to `src/lib/validation/`

#### 3.2 Data Processing Services

- Create service layer for complex calculations
- Separate AI simulation logic from UI components
- Preserve all regex patterns and business rules exactly

### Phase 4: Atomic Design Implementation

#### 4.1 Atoms Layer (Primitive Components)

```
src/components/atoms/
├── Button.tsx (Enhanced HoldButton)
├── Icon.tsx (Lucide wrapper)
├── Input.tsx (Time/text inputs)
├── Label.tsx (Form labels)
├── StatusIndicator.tsx (Step status circles)
├── Chip.tsx (Protein tags)
└── index.ts (Barrel export)
```

#### 4.2 Molecules Layer (Composite Components)

```
src/components/molecules/
├── TimeField.tsx (Label + time input)
├── MealGapConnector.tsx (Visual connector)
├── StepHeader.tsx (Number + title + status)
├── BottleneckAlert.tsx (Red alert container)
├── ProteinTag.tsx (Interactive tag)
├── SelectorOption.tsx (Individual option)
└── index.ts
```

#### 4.3 Organisms Layer (Feature Components)

```
src/components/organisms/
├── SleepCalculator.tsx (Time calculation logic)
├── MealTimeline.tsx (3-meal timeline)
├── ProteinAnalyzer.tsx (AI analysis interface)
├── StepAccordion.tsx (Main step container)
├── TopStepper.tsx (Progress indicator)
└── index.ts
```

#### 4.4 Templates Layer (Layouts)

```
src/components/templates/
├── WizardLayout.tsx (2-column step layout)
├── FinalReport.tsx (Results view)
├── AppLayout.tsx (Main app wrapper)
└── index.ts
```

### Phase 5: Component Migration

#### 5.1 Preserve Critical Functionality

- **Vibration API**: Ensure navigator.vibrate works in HoldButton
- **Animation System**: Maintain all animate-in, shake, zoom effects
- **Scroll Logic**: Preserve auto-scroll to fix sections
- **State Persistence**: Maintain all form data and validation states
- **Regex Logic**: Exact preservation of protein analysis patterns

#### 5.2 Progressive Migration

1. **Extract Atoms First**: Start with primitive components
2. **Build Molecules**: Combine atoms into functional units
3. **Create Organisms**: Implement feature logic with proper state management
4. **Design Templates**: Create reusable layouts
5. **Refactor Page**: Clean up main orchestration

### Phase 6: Page Orchestration Cleanup

#### 6.1 Simplified Page Component

- Extract all inline components to separate files
- Create clean state management hooks
- Implement proper error boundaries
- Add loading states and user feedback

#### 6.2 Custom Hooks

- `useMetabolicDebugger()`: Main state management
- `useStepValidation()`: Validation logic
- `useProteinAnalysis()`: AI analysis hook
- `useReportGeneration()`: Final report logic

### Phase 7: Quality Assurance

#### 7.1 Functionality Verification

- [ ] All animations work (shake, fade-in, zoom-in)
- [ ] Vibration API triggers on button hold
- [ ] Auto-scroll to bottleneck sections
- [ ] Protein analysis regex patterns work exactly
- [ ] State persistence across step navigation
- [ ] Final report generates correctly

#### 7.2 Performance Optimization

- [ ] Code splitting by atomic layers
- [ ] Lazy loading for heavy components
- [ ] Memoization for expensive calculations
- [ ] Bundle size optimization

#### 7.3 Type Safety

- [ ] No `any` types in production code
- [ ] Proper error handling with typed errors
- [ ] Strict null checking enabled
- [ ] Interface segregation principle

## Implementation Order

### Week 1: Foundation

1. Update global styles and utilities
2. Extract type definitions
3. Create steps configuration
4. Set up basic atomic structure

### Week 2: Logic Separation

1. Extract business logic to services
2. Create analysis modules
3. Build validation layer
4. Test logic in isolation

### Week 3: Component Migration

1. Build atoms layer
2. Create molecules
3. Implement organisms
4. Design templates

### Week 4: Integration & Testing

1. Refactor page orchestration
2. Add custom hooks
3. Comprehensive testing
4. Performance optimization

## Success Metrics

### Code Quality

- **Maintainability**: Each component < 200 lines
- **Reusability**: Atoms used across multiple molecules
- **Testability**: Logic separated from UI concerns
- **Type Safety**: 100% TypeScript coverage

### Performance

- **Bundle Size**: Reduce initial load by 30%
- **Code Splitting**: Lazy load heavy components
- **Render Performance**: Optimize re-renders with memo

### Developer Experience

- **Component Discovery**: Clear atomic hierarchy
- **API Consistency**: Standardized props interfaces
- **Documentation**: Inline docs for complex logic
- **Error Handling**: Graceful degradation

## Risk Mitigation

### Breaking Changes

- **Feature Parity**: Every existing feature must work identically
- **User Experience**: No regression in UX flow
- **Performance**: Maintain or improve current performance
- **Accessibility**: Preserve all a11y features

### Technical Risks

- **State Management**: Careful migration of complex state
- **Animation Preservation**: Test all motion design elements
- **API Compatibility**: Maintain existing data structures
- **Browser Support**: Ensure vibration API and animations work

This refactor will transform the metabolic debugger from a monolithic prototype into a production-ready, scalable application following industry best practices.
