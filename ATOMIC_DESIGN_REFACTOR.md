# Metabolic Debugger - Atomic Design Refactoring

## Overview

This project has been refactored using **Atomic Design principles** as described in Brad Frost's article [Atomic Web Design](https://bradfrost.com/blog/post/atomic-web-design/). The original monolithic `page.tsx` has been broken down into a hierarchical component structure that promotes reusability, maintainability, and scalability.

## Component Structure

### 🧪 Atoms (Basic Building Blocks)

The smallest functional units that can't be broken down further.

**Location**: `src/app/_components/atoms/`

#### Components Created:

- **`Button.tsx`** - Interactive button with multiple variants and themes
- **`Icon.tsx`** - Centralized icon management system
- **`StatusIndicator.tsx`** - Visual status indicators for steps
- **`Label.tsx`** - Text labels with different variants and styling
- **`InputField.tsx`** - Form input components (text, time, textarea)

**Benefits:**

- Reusable across the entire application
- Consistent styling and behavior
- Easy to maintain and test in isolation

### 🧬 Molecules (Groups of Atoms)

Simple groups of atoms working together as a unit.

**Location**: `src/app/_components/molecules/`

#### Components Created:

- **`SleepInput.tsx`** - Sleep duration input with time selectors
- **`SelectorInput.tsx`** - Option selection component
- **`MealTimeItem.tsx`** - Individual meal timing input

**Benefits:**

- Encapsulate complex form logic
- Handle specific use cases
- Bridge between atoms and organisms

### 🧠 Organisms (Complex UI Sections)

Complex, distinct sections of an interface composed of molecules and atoms.

**Location**: `src/app/_components/organisms/`

#### Components Created:

- **`AccordionStep.tsx`** - Complete step component with header, input, and education
- **`TopStepper.tsx`** - Progress navigation component

**Benefits:**

- Self-contained functional units
- Manage complex state and interactions
- Easy to test as complete components

### 📱 Templates (Page Layouts)

Page-level objects that provide context for organisms.

**Location**: `src/app/_components/templates/`

#### Components Created:

- **`MainLayout.tsx`** - Overall page layout and structure

**Benefits:**

- Consistent page structure
- Easy to modify layout without changing content
- Clear separation of layout and content

## Key Improvements

### 1. **Modularity**

- Each component has a single responsibility
- Components can be developed, tested, and maintained independently
- Easy to swap out components without affecting others

### 2. **Reusability**

- Atoms can be used anywhere in the application
- Molecules solve common UI patterns
- Organisms can be reused across different pages

### 3. **Maintainability**

- Changes to styling or behavior only need to be made in one place
- Clear component hierarchy makes debugging easier
- TypeScript interfaces ensure consistency

### 4. **Scalability**

- New features can be built by combining existing components
- Easy to add new atoms without breaking existing functionality
- Clear patterns for extending the design system

### 5. **Developer Experience**

- Better code organization
- Easier to understand component relationships
- Improved development workflow

## File Structure

```
src/app/_components/
├── atoms/
│   ├── Button.tsx
│   ├── Icon.tsx
│   ├── InputField.tsx
│   ├── Label.tsx
│   ├── StatusIndicator.tsx
│   └── index.ts
├── molecules/
│   ├── MealTimeItem.tsx
│   ├── SelectorInput.tsx
│   ├── SleepInput.tsx
│   └── index.ts
├── organisms/
│   ├── AccordionStep.tsx
│   ├── TopStepper.tsx
│   └── index.ts
├── templates/
│   ├── MainLayout.tsx
│   └── index.ts
└── README.md (this file)
```

## Usage Examples

### Using Atoms

```tsx
import { Button, Icon, Label } from '../atoms';

<Button
  onComplete={handleClick}
  label="Submit"
  theme="emerald"
  variant="primary"
/>

<Icon name="moon" size={20} className="text-emerald-400" />

<Label variant="title">Welcome</Label>
```

### Using Molecules

```tsx
import { SleepInput, SelectorInput } from '../molecules';

<SleepInput onValidate={handleSleepValidation} isIssue={false} />

<SelectorInput
  options={mealOptions}
  onValidate={handleSelection}
  isIssue={false}
/>
```

### Using Organisms

```tsx
import { AccordionStep } from "../organisms";

<AccordionStep
  step={stepData}
  status="active"
  onAnswer={handleAnswer}
  index={0}
/>;
```

### Using Templates

```tsx
import { MainLayout } from "../templates";

<MainLayout
  title="Metabolic Debugger"
  subtitle="Identify bottlenecks in your biology"
  showStepper={true}
  stepperProps={{ currentStep: 0, totalSteps: 6, steps: steps }}
>
  {/* Page content */}
</MainLayout>;
```

## Migration Guide

To migrate existing components to use the atomic design system:

1. **Identify the level** - Determine if it's an atom, molecule, organism, or template
2. **Extract shared logic** - Move reusable logic to appropriate level
3. **Update imports** - Use the new component structure
4. **Test thoroughly** - Ensure functionality is preserved
5. **Update documentation** - Keep component docs current

## Benefits Achieved

✅ **Separation of Concerns** - Clear hierarchy and responsibilities  
✅ **Reusability** - Components can be used across the application  
✅ **Maintainability** - Changes are localized and predictable  
✅ **Scalability** - Easy to add new features and components  
✅ **Developer Experience** - Better organization and development workflow  
✅ **Type Safety** - TypeScript interfaces ensure consistency  
✅ **Testing** - Components can be tested in isolation

## Next Steps

1. **Complete remaining molecules** - Add AIProteinInput, MealLogInput
2. **Add comprehensive testing** - Unit tests for all components
3. **Create storybook** - Component documentation and examples
4. **Implement theming** - Support for light/dark modes
5. **Add accessibility** - ARIA labels and keyboard navigation
6. **Performance optimization** - Memoization and lazy loading

## References

- [Atomic Design by Brad Frost](https://bradfrost.com/blog/post/atomic-web-design/)
- [Atomic Design Methodology](https://atomicdesign.bradfrost.com/chapter-2/)
- [Design Systems](https://www.designsystems.com/)

---

This refactoring demonstrates how a complex, monolithic component can be transformed into a maintainable, scalable design system following atomic design principles.
