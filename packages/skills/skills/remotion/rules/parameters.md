---
name: parameters
description: Make a video parametrizable by adding a Zod schema
metadata:
  tags: parameters, zod, schema
---

To make a video parametrizable, a Zod schema can be added to a composition.

First, `zod` must be installed - it must be exactly version `3.22.3`.

Search the project for lockfiles and run the correct command depending on the package manager:

If `package-lock.json` is found, use the following command:

```bash
npm i zod@3.22.3
```

If `bun.lockb` is found, use the following command:

```bash
bun i zod@3.22.3
```

If `yarn.lock` is found, use the following command:

```bash
yarn add zod@3.22.3
```

If `pnpm-lock.yaml` is found, use the following command:

```bash
pnpm i zod@3.22.3
```

Then, a Zod schema can be defined alongside the component:

```tsx title="src/MyComposition.tsx"
import {z} from 'zod';

export const MyCompositionSchema = z.object({
  title: z.string(),
});

const MyComponent: React.FC<z.infer<typeof MyCompositionSchema>> = () => {
  return (
    <div>
      <h1>{props.title}</h1>
    </div>
  );
};
```

In the root file, the schema can be passed to the composition:

```tsx title="src/Root.tsx"
import {Composition} from 'remotion';
import {MycComponent, MyCompositionSchema} from './MyComposition';

export const RemotionRoot = () => {
  return <Composition id="MyComposition" component={MyComponent} durationInFrames={100} fps={30} width={1080} height={1080} defaultProps={{title: 'Hello World'}} schema={MyCompositionSchema} />;
};
```

Now, the user can edit the parameter visually in the sidebar.

All schemas that are supported by Zod are supported by Remotion.

Remotion requires that the top-level type is a z.object(), because the collection of props of a React component is always an object.

## Color picker

For adding a color picker, use `zColor()` from `@remotion/zod-types`.

If it is not installed, use the following command:

```bash
npx remotion add @remotion/zod-types # If project uses npm
bunx remotion add @remotion/zod-types # If project uses bun
yarn remotion add @remotion/zod-types # If project uses yarn
pnpm exec remotion add @remotion/zod-types # If project uses pnpm
```

Then import `zColor` from `@remotion/zod-types`:

```tsx
import {zColor} from '@remotion/zod-types';
```

Then use it in the schema:

```tsx
export const MyCompositionSchema = z.object({
  color: zColor(),
});
```

## CRITICAL: Props Panel UI Requirements

When creating compositions that should be editable in Remotion Studio's Props Panel, follow these rules:

### 1. Always Inline defaultProps

**CRITICAL**: `defaultProps` must be a hardcoded value directly in the JSX. Variable references will cause a "Can't save default props" error in the Studio.

```tsx
// ❌ WRONG - Using a variable reference
const myDefaultProps = {
  title: 'Hello',
  color: '#ff0000',
};

<Composition
  id="MyComp"
  component={MyComp}
  defaultProps={myDefaultProps}  // Will break save functionality!
  schema={mySchema}
/>

// ✅ CORRECT - Inline the values directly
<Composition
  id="MyComp"
  component={MyComp}
  defaultProps={{
    title: 'Hello',
    color: '#ff0000',
  }}
  schema={mySchema}
/>
```

### 2. Use Primitive Types for Theme/Config Props

Complex objects (like theme objects) cannot be edited in the Props Panel. Instead, use string identifiers and look up the object internally.

```tsx
// ❌ WRONG - Object prop that can't be edited in UI
type Props = {
  theme: { colors: { text: string; background: string } };
};

// ✅ CORRECT - String identifier that becomes dropdown in UI
const schema = z.object({
  themeName: z.enum(['dark', 'light', 'contrast', 'warm']),
});

type Props = {
  themeName: 'dark' | 'light' | 'contrast' | 'warm';
};

// Look up the theme object inside the component
const MyComponent: React.FC<Props> = ({ themeName = 'dark' }) => {
  const theme = themes[themeName];  // Internal lookup
  return <div style={{ color: theme.colors.text }} />;
};
```

### 3. Always Add Schema to New Compositions

Every new `<Composition>` should have a `schema` prop to enable Props Panel editing:

```tsx
import { z } from 'zod';

// Define schema with all props
const myCompSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  duration: z.number(),
  theme: z.enum(['dark', 'light']),
  showOverlay: z.boolean(),
});

// Use in composition with inline defaultProps
<Composition
  id="MyComp"
  component={MyComp}
  durationInFrames={90}
  fps={30}
  width={1920}
  height={1080}
  schema={myCompSchema}
  defaultProps={{
    title: 'Default Title',
    subtitle: undefined,
    duration: 60,
    theme: 'dark',
    showOverlay: true,
  }}
/>
```

### 4. Supported Schema Types for UI

| Zod Type | UI Control |
|----------|------------|
| `z.string()` | Text input |
| `z.number()` | Number input |
| `z.boolean()` | Checkbox |
| `z.enum(['a', 'b'])` | Dropdown select |
| `z.string().optional()` | Optional text input |
| `zColor()` | Color picker |

### 5. Schema Definition Pattern

Define schemas in the same file as the `<Composition>` (typically `Root.tsx`) for clarity:

```tsx
// Root.tsx
import { Composition, Folder } from 'remotion';
import { z } from 'zod';
import { MyScene } from './scenes/MyScene';

// Define all schemas at the top
const mySceneSchema = z.object({
  title: z.string(),
  showSubtitle: z.boolean(),
  themeName: z.enum(['dark', 'light']),
});

export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="Scenes">
      <Composition
        id="MyScene"
        component={MyScene}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
        schema={mySceneSchema}
        defaultProps={{
          title: 'My Title',
          showSubtitle: true,
          themeName: 'dark',
        }}
      />
    </Folder>
  );
};
```
