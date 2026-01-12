# Component Inventory - open-fit

## Overview

Total components: ~65 files across 9 categories

## UI Primitives (shadcn/ui)

Base building blocks using Radix UI + Tailwind CSS.

| Component | File | Description |
|-----------|------|-------------|
| Avatar | `ui/avatar.tsx` | User avatar display |
| Badge | `ui/badge.tsx` | Status/label badges |
| Button | `ui/button.tsx` | Action buttons with variants |
| Calendar | `ui/calendar.tsx` | Date picker calendar |
| Card | `ui/card.tsx` | Content container cards |
| Carousel | `ui/carousel.tsx` | Image/content carousel |
| Checkbox | `ui/checkbox.tsx` | Checkbox input |
| Collapsible | `ui/collapsible.tsx` | Expandable sections |
| Command | `ui/command.tsx` | Command palette (cmdk) |
| DateTimeField | `ui/date-time-field.tsx` | Date/time input field |
| DateTimePicker | `ui/date-time-picker.tsx` | Date/time picker |
| Dialog | `ui/dialog.tsx` | Modal dialogs |
| DropdownMenu | `ui/dropdown-menu.tsx` | Dropdown menus |
| DurationInput | `ui/duration-input.tsx` | Time duration input |
| Input | `ui/input.tsx` | Text input field |
| Label | `ui/label.tsx` | Form labels |
| Popover | `ui/popover.tsx` | Floating popover |
| ProgressCircle | `ui/progress-circle.tsx` | Circular progress |
| Select | `ui/select.tsx` | Dropdown select |
| Separator | `ui/separator.tsx` | Visual dividers |
| Sheet | `ui/sheet.tsx` | Slide-out panels |
| Switch | `ui/switch.tsx` | Toggle switch |
| Textarea | `ui/textarea.tsx` | Multi-line text input |

## Authentication Components

| Component | File | Purpose |
|-----------|------|---------|
| AuthGuard | `auth/AuthGuard.tsx` | Route protection wrapper |
| LoginForm | `auth/LoginForm.tsx` | Sign in/register form |

## Layout Components

| Component | File | Purpose |
|-----------|------|---------|
| AppWrapper | `layout/AppWrapper.tsx` | Main app shell |
| Header | `layout/Header.tsx` | Top navigation bar |
| AccountNavItem | `layout/AccountNavItem.tsx` | User account dropdown |

## Provider Components

| Component | File | Purpose |
|-----------|------|---------|
| ConvexClientProvider | `providers/ConvexClientProvider.tsx` | Convex client setup |
| ThemeProvider | `providers/ThemeProvider.tsx` | Dark/light theme |
| ThemeSync | `providers/ThemeSync.tsx` | Theme persistence |

## Exercise Components

| Component | File | Purpose |
|-----------|------|---------|
| AutocompleteExercise | `exercises/AutocompleteExercise.tsx` | Exercise search/select |
| ExerciseCard | `exercises/ExerciseCard.tsx` | Exercise display card |
| ExerciseDetailModal | `exercises/ExerciseDetailModal.tsx` | Exercise details popup |

## Routine Components

| Component | File | Purpose |
|-----------|------|---------|
| CreateRoutine | `routines/CreateRoutine.tsx` | New routine form |
| RoutineCard | `routines/RoutineCard.tsx` | Routine summary card |
| RoutineDayItem | `routines/RoutineDayItem.tsx` | Day within routine |
| AddExerciseRow | `routines/AddExerciseRow.tsx` | Add exercise to day |
| EditRoutineModal | `routines/EditRoutineModal.tsx` | Edit routine dialog |
| EditRoutineMenu | `routines/EditRoutineMenu.tsx` | Routine actions menu |
| EditDayModal | `routines/EditDayModal.tsx` | Edit day dialog |
| EditDayMenu | `routines/EditDayMenu.tsx` | Day actions menu |
| DeleteRoutineModal | `routines/DeleteRoutineModal.tsx` | Delete confirmation |
| DeleteDayModal | `routines/DeleteDayModal.tsx` | Delete day confirmation |
| DeleteSetGroupModal | `routines/DeleteSetGroupModal.tsx` | Delete exercise confirmation |

## Session Components

| Component | File | Purpose |
|-----------|------|---------|
| CreateSession | `sessions/CreateSession.tsx` | Start new session |
| CurrentSessionPage | `sessions/CurrentSessionPage.tsx` | Active workout view |
| SessionPage | `sessions/SessionPage.tsx` | Completed session view |
| SessionSummaryCard | `sessions/SessionSummaryCard.tsx` | Session preview card |
| RestTimer | `sessions/RestTimer.tsx` | Rest countdown timer |
| CurrentDuration | `sessions/CurrentDuration.tsx` | Session elapsed time |
| SelectTemplate | `sessions/SelectTemplate.tsx` | Choose routine template |
| ResumeSessionButton | `sessions/ResumeSessionButton.tsx` | Continue session |
| EditSessionModal | `sessions/EditSessionModal.tsx` | Edit session dialog |
| EditSessionMenu | `sessions/EditSessionMenu.tsx` | Session actions menu |
| DeleteSessionModal | `sessions/DeleteSessionModal.tsx` | Delete confirmation |

## Workout Set Components

| Component | File | Purpose |
|-----------|------|---------|
| WorkoutList | `workoutSet/WorkoutList.tsx` | Set groups container |
| WorkoutSetGroup | `workoutSet/WorkoutSetGroup.tsx` | Exercise with sets |
| BulkEditSetModal | `workoutSet/BulkEditSetModal.tsx` | Edit multiple sets |
| EditSetCommentModal | `workoutSet/EditSetCommentModal.tsx` | Set notes/comments |
| EditSetGroupMenu | `workoutSet/EditSetGroupMenu.tsx` | Set group actions |
| RepUnitMenu | `workoutSet/RepUnitMenu.tsx` | Rep unit selector |
| WeightUnitMenu | `workoutSet/WeightUnitMenu.tsx` | Weight unit selector |
| SetTypeMenu | `workoutSet/SetTypeMenu.tsx` | Set type selector |

## Profile Components

| Component | File | Purpose |
|-----------|------|---------|
| ProfileModal | `profile/ProfileModal.tsx` | User settings dialog |

## Component Patterns

### Modal Pattern
All modals follow the same structure:
```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    {/* Content */}
    <DialogFooter>
      {/* Actions */}
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Menu Pattern
Action menus use DropdownMenu:
```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon">
      <MoreVertical />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
    <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Card Pattern
Content cards use the Card component:
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

## Usage Examples

### Using AuthGuard
```tsx
<AuthGuard>
  <ProtectedContent />
</AuthGuard>
```

### Using ConvexClientProvider
```tsx
// In layout.tsx
<ConvexClientProvider>
  {children}
</ConvexClientProvider>
```

### Using ThemeProvider
```tsx
<ThemeProvider attribute="class" defaultTheme="system">
  {children}
</ThemeProvider>
```
