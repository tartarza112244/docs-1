---
id: overview
title: Overview
---

A Bit component is a super set of a node package.

```sh
account/login-form           # root directory for storing all component files
├── index.tsx                # barrel file to export modules
├── login-form.composite.tsx # examples and compositions for the component
├── login-form.docs.tsx      # component documentation
├── login-form.spec.tsx      # tests
└── login-form.tsx           # implementation
```

Each component in a Bit workspace must be contained within a single directory, including implementation, stylings, tests and documentation. Bit applies configurations and dependency policies for each component as defined in `workspace.json`.

## Different types of components

In a bird-eye view, components can boil down to these:

```javascript
// Atomic, presentational components
import { Card } from '@acme/base-ui.card'
// A composed components
import { CardGallery } from '@acme/gallery.card-gallery'
// A data-connected component
import { InvoiceList } from '@acme/billing.invoice-list'
// A page implemented as a component
import { HomePage } from '@acme/marketing-site.pages'
// Utilities and helpers
import { StandardizePath } from '@acme/modules.StandardizePath'
// Shared styles and themes
import { DarkMode } from '@acme/base-ui.themes.dark-mode'
```

## Supported frameworks

Framework support is implemented, and can be extended by implementing [Environments](/docs/environment/overview). **Environments** facilitate the entire development environment and workflow for a developer with a given framework.

You can find a list of available environments [here](/docs/environment/base).

### Set environment for components

As with any other tool, before you start writing code you need to set up your workspace' development environment. In Bit this is done by deciding which environment to use, as they implement a zero-config setup for building components.

Open your `workspace.json` and configure a specific [variant](/docs/workspace/variants) to use an environment. For example, this configures all components in the `./components` directory of your workspace to be configured with the [React](/docs/environment/base#teambitreact) environment.

```json
{
    "@teambit/variants": {
        "components/*": {
            "@teambit/envs": {
                "env": "@teambit/react"
            }
        }
    }
}
```

> **Multiple environments in a workspace**
>
> Use different variants to configure different sets of components with different environments. [Learn more](/docs/environment/overview#how-to-use-environments).

## Creating components

Aside from making sure all component files are in the same directory and making sure a component has a [barrel file](https://basarat.gitbook.io/typescript/main-1/barrel), Bit does not impose any rules. A component may have nested directories with more files, it may contain just a single file, it may only keep a shared style without any JS-specific functionality, etc.

So to add a new component to your workspace simply create a new directory and the required files for your implementation. If you need additional files like `scss` etc, create them as well.

```sh
$ mkdir ./components/base/button                   # root compoennt directory
$ touch ./components/base/button/index.ts          # barrel file
$ touch ./components/base/button/button.tsx        # component implementation
$ touch ./components/base/button/bottun.specs.tsx  # tests
```

Once the files are in place, use `bit add` command for Bit to track these files as a component.

```sh
$ bit add ./components/base/button
```

### Component ID

Each component has a unique identifier. The unique identifier is compound as follow: `<scope>/<namespace(s)>/<name>`. When you add a new component Bit generates the component ID.

- **Scope** - The component's scope as applied by the `workspace.json` file. It can be a `scope` property as defined for the component's `variant` or the `defaultScope` configured to the `@teambit/workspace` extension.
- **Namespaces**(optional) - Set with the `--namespace` flag when adding the component (supports nesting - `--namespace nesting/namespace/yay`).
- **Name** - The name of the component, according to the component's root directory name.

Bit uses these IDs when listing or running operations and commands on components.

### Component module

Bit creates a module from each component in the workspace' root `node_modules` directory. This module contains the component's transpiled code for other components to import.  
The module name is defined by the component ID. However, Node supports a single forward slash (`/`) in a module name (to set the module scope). Bit uses the `<scope>` defined for the components as such (with the `/` separator). All other `/` between namespaces (if found) are translated to dots (`.`).

For example the component ID `@design-system/components/base/button` will result in a module called `@design-system/components.base.button`.

> Why Bit does not keep the same module naming as node?
>
> The future of JavaScript development brings tools like ESM and Deno that have different approach for module consumption with namespacing support. As Bit components needs to be future-proof to support additional tooling it keeps its own naming scheme that can be translated according to the consumption method.

### Using a component

Bit does not permit using relative import statements beyond the boundaries of the component's root directory. This is important as a component should not be bound to the directory structure of its workspace.  
To depend on another component you must `import` the component using its module name.

```javascript
// Import the component module
import { Button } from '@design-system/form-elemens.button'

// Don't use relativ import statements
import { Button } from '../../form-elements/button'
```

## Bit component features

Managing components using Bit gives you more features to use for your implementation. All features are implemented as part of the Environment configured for the component. This means you can add new features for components by [composing and extending environments](/docs/environment/composing-environments).

### Compositions

Compositions are isolated component rendering environments you can use when building components. Use them to compose your components in many cases and scenarios.  
To add compositions to your component create a new file with the following convention:

```sh
$ touch ./components/base/button/button.composition.tsx
```

A sample composition might look like this, where each `export const` is a different composition to render.

```javascript
import React from "react";
import { Button } from "./button";

export const PrimaryButton = () => {
  return (
    <Button variant="primary">
        Click Me
    </Button>
  );
};

export const SecondaryButton = () => {
  return (
    <Button variant="secondary">
        Click Me
    </Button>
  );
};
```

[Learn more about compositions](/docs/compositions/develop-in-isolation).

### Documentation

Component documentation is auto-generated by its environment. The environment implements a documentation template it fills using automated tools like [react-docgen](http://reactcommunity.org/react-docgen/), [typedoc](https://typedoc.org) etc. You can also modify documentation by creating a dedicated file to compose and control the template:

```sh
$ touch ./components/base/button/button.docs.tsx
```

Then you can compose and use the documentation template using simple APIs.

```js
export const abstract = "An imperfect button"
export const tags = ["react", "button"]
```

[Learn more about using documentation templates](/docs/documentation/using-templates).

## Cascading Dependency Policies
## Ejecting the Component Configurations