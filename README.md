Strictly scoped CSS for React components

## Features

- **tiny**: [1.3kB compressed and minified](https://bundlephobia.com/result?p=react-scoped-css@0.0.5)
- **simple**: centered around native browser APIs, avoiding hacks
- **compilation-free**: no webpack, babel, etc required
- **standard syntax**: write normal CSS without gimmicks and casing differences

## Installation

Install with Yarn or NPM:

```
yarn add react-scoped-css
```

```
npm install --save react-scoped-css
```

## Usage

<table>
<tr>
<th> Code </th> <th> Output </th>
</tr>
<tr>
<td>

```js
import React from "react"
import { css } from "react-scoped-css"

const Example = css`
  h1 {
    color: red;
  }
`(({ children }) => <h1>{children}</h1>)

const App = () => (
  <div style={{ color: "blue", border: "1px solid" }}>
    <Example>Scoped</Example>
    <h1>Unscoped</h1>
  </div>
)

export default App
```

</td>
<td>
<img src="https://user-images.githubusercontent.com/1694410/79814804-2550e380-834d-11ea-992e-277a75c72fe6.png" />
</td>
</tr>
</table>

## Browser support

There is a hard requirement on [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM), which is [supported](https://caniuse.com/#feat=shadowdomv1) in all major browsers, but not in Internet Explorer 11.

[Constructable Stylesheets](https://developers.google.com/web/updates/2019/02/constructable-stylesheets) are used when available, for maximum performance, with a fallback for browsers which don’t support this yet.
