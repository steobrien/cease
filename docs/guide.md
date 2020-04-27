# Guide

- [Installation](#installation)
- [Styling simple components](#styling-simple-components)
- [How isolation works](#how-isolation-works)
- [Styling dynamic components](#styling-dynamic-components)
- [Performance](#performance)
- [Processing & vendor prefixing](#processing--vendor-prefixing)
- [Caveats](#caveats)
- [Prior art](#prior-art)

## Installation

Install with your package manager of choice:

```bash
npm install --save cease
```

Now you can import the helper function into your React app:

```js
import css from "cease"
```

## Styling simple components

Cease decorates your component with a static stylesheet. Let’s apply it to a simple component used to render a list of items.

##### → [Run this example](https://lvkeg.csb.app/) or [edit on CodeSandbox](https://codesandbox.io/s/simple-lvkeg?file=/src/List.js)

```js
import React from "react"
import css from "cease"

const List = ({ labels }) => (
  <ul>
    {labels.map(label => (
      <li key={label}>{label}</li>
    ))}
  </ul>
)

const styled = css`
  ul {
    border: 2px solid;
    padding: 0;
    width: 150px;
    border-radius: 15px;
  }

  li {
    list-style: none;
    padding: 10px 0;
    border-top: 2px solid;
    font: bold 20px sans-serif;
    text-align: center;
  }
  li:first-of-type {
    border: 0;
  }
`(List)

export { styled as List }
```

## How isolation works

A Cease styled component is insulated both from parent and child contexts, as well as document stylesheets. In the following example, **`Root`** renders **`Child`**, which in turn renders **`GrandChild`**. **`Child`** is unaffected by the styling above and below it.

The implementation is that each component decorated with `css` is rendered in its own [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) root. Its styles are applied using a [Constructable Stylesheet](https://wicg.github.io/construct-stylesheets/) for convenience, if available (currently Google Chrome and Opera), falling back to a scoped `<style>` block otherwise. (**Important note**: no significant performance difference is expected between these approaches due to browser caching tactics. Sources: [Apple engineer](https://github.com/w3c/webcomponents/issues/800#issuecomment-511239483), [Google engineer](https://medium.com/@ebidel/nice-write-up-815f17e78937), [Mozilla engineer](https://github.com/whatwg/dom/issues/831#issuecomment-585489960).).

##### → [Run this example](https://sje4w.csb.app/) or [edit on CodeSandbox](https://codesandbox.io/s/isolation-sje4w?file=/src/Demo.js)

```js
import React from "react"
import css from "cease"

const Grandchild = css`
  p {
    background: #aff !important;
  }
`(({ children }) => (
  <>
    <p>Grandchild paragraph</p>
    {children}
  </>
))

const Child = css`
  p {
    font-weight: bold;
  }
`(({ children }) => (
  <>
    <p>
      Child paragraph – <em>unaffected by surroundings</em>
    </p>
    {children}
  </>
))

const Root = css`
  p {
    background: #ffa !important;
  }
`(() => (
  <>
    <p>Root paragraph</p>
    <Child>
      <Grandchild />
    </Child>
  </>
))

export default Root
```

## Styling dynamic components

Unlike other CSS-in-JS libraries, the CSS strings you provide Cease are _always_ static – that is, they can't change while the app is running. Instead, just interpolate constants, leverage HTML attributes, and sprinkle inline styles (for precise or volatile states like animation).

Let's take a look at a configurable, stateful component for producing buttons of different kinds, with displayed counter state tracking how many times it’s been pressed.

##### → [Run this example](https://u0xg2.csb.app/) or [edit on CodeSandbox](https://codesandbox.io/s/dynamic-u0xg2?file=/src/Button.js)

```js
import React, { useState } from "react"
import css from "cease"
import { colors, sizes } from "./designSystem"

const Button = ({ type, label, big, disabled }) => {
  const [pressCount, setPressCount] = useState(0)
  return (
    <button
      onClick={() => setPressCount(n => n + 1)}
      data-big={big}
      data-primary={type === "primary"}
      data-destructive={type === "destructive"}
      disabled={disabled}
    >
      {label}
      <span
        className="counter"
        style={{ width: `${(pressCount * 10) % 110}%` }}
      />
    </button>
  )
}

const styled = css`
  button {
    outline: 0;
    margin: 0;
    padding: 0;
    background: ${colors.green};
    color: ${colors.white};
    font: bold 16px sans-serif;
    border: 0;
    padding: ${sizes.s}px ${sizes.l}px;
    border-radius: 5px;
    cursor: pointer;
    transform: scale(1);
    transition: all 100ms ease-in-out;
    position: relative;
  }

  button:not([disabled]):hover {
    box-shadow: 0 0 15px ${colors.fade};
    transform: scale(1.05);
  }

  .counter {
    position: absolute;
    max-width: 100%;
    left: 0;
    top: calc(50% - ${sizes.xs / 2}px);
    display: block;
    height: ${sizes.xs}px;
    background: ${colors.fade};
    transition: all 200ms ease-in-out;
    z-index: -1;
  }

  button[data-big="true"] {
    font-size: 20px;
    padding: ${sizes.m}px ${sizes.xl}px;
  }

  button[data-destructive="true"] {
    background: ${colors.red};
  }

  button[data-primary="true"] {
    background: ${colors.blue};
  }

  button:hover:active {
    transform: scale(1.07);
  }

  button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`(Button)

export { styled as Button }
```

Another option for dynamic styles is to place such rules in a `<style>`: all rules there will also be scoped to the component.

## Performance

There is a performance cost to mounting the Shadow DOM nodes: because these can’t be described ahead of time in JSX/markup, we have to render host elements _and then_ insert the shadow roots.

However, based on some quick comparisons, its performance seems to stack up reasonably against leading alternatives. [Here’s a demonstration](https://xxc2m.sse.codesandbox.io/) of Cease versus Emotion and Styled Components, rendering a large number of simple components, and Cease tends to be a little faster overall.

Cease remains experimental – you should carefully check the performance of any app you use it in.

## Processing & vendor prefixing

Cease does not process the CSS you give it whatsoever, in keeping with the philosophy of "conventional CSS without gimmicks".

One longstanding process pattern is _vendor prefixing_, used to ensure that older browsers which experimented with a then-upcoming CSS property receive styles. For example, the `flex` property was initially implemented as `-webkit-flex` and `-moz-flex` in Safari and Firefox respectfully.

However, browsers have moved away from this approach. [From MDN](https://developer.mozilla.org/en-US/docs/Glossary/Vendor_Prefix):

> Browser vendors are working to stop using vendor prefixes for experimental features. […] Lately, the trend is to add experimental features behind user-controlled flags or preferences, and to create smaller specifications which can reach a stable state much more quickly.

So, first, ensure that you _need_ prefixing! If you do – or would like to process your CSS for some other reason, e.g. to support [Sass syntax](https://sass-lang.com/) – a sister package, [cease-processed](todo), is available. This offers a [Babel macro](https://github.com/kentcdodds/babel-plugin-macros) which you can configure to run a series of functions against at build time.

Configure, e.g. in `package.json`:

```json
{
  "babelMacros": {
    "reactScopedCss": {
      "processors": [
        "../../src/utils/vendorPrefix.js",
        "../../src/utils/sass.js"
      ]
    }
  }
}
```

Then import from the macro and use as normal:

```js
import css from "cease-processed/macro"

const ExampleComponent = () => <p>Example</p>

export default css`
  p {
    color: red;
  }
`(ExampleComponent)
```

## Caveats

- Cease requires browser support for Shadow DOM. All recent browsers [support this](https://caniuse.com/#feat=shadowdomv1), but some older ones do not, such as Internet Explorer 11. [Polyfills are available](https://github.com/search?q=shadow+dom+polyfill) but expect performance issues.
- Shadow DOM is attached to an element in the parent document, and each element can only have one such shadow root. Thus each Cease-styled component is wrapped in a `<cease-scope>` custom element, which behaves like a `<div>`. You can target this container for styling with the [`:host`](https://developer.mozilla.org/en-US/docs/Web/CSS/:host) CSS selector.
- My initial tests suggest that the performance overhead of many instances of Shadow DOM is minimal. However, this hasn't been properly established and such use is not super widespread on the web, so be cautious.
- There is no good answer for server side rendering (SSR). Currently, Shadow DOM can not be serialized to HTML. However, there is [work ongoing here](https://github.com/mfreed7/declarative-shadow-dom) with the probability of a good, cross-browser solution quite soon.
- As well as insulating styles, Shadow DOM makes global DOM manipulation more difficult. For instance `document.querySelectorAll("h1")` will _not_ match a `h1` inside a Cease styled component. This may complicate the use of testing tools, although many apparently already have an answer, like [`dom-testing-library`](https://github.com/testing-library/dom-testing-library/issues/413) and [`js-dom`](https://github.com/jsdom/jsdom/commit/88e72ef028913e78266b8105493fd6d973c68e38).
- There are two exceptions to style isolation in Shadow DOM:

  1. Inheritance from parents outside of the Shadow DOM context still applies. Here’s a [list of heritable properties](https://www.w3.org/TR/CSS21/propidx.html), which most significantly includes `color` and various `font-` properties.
  2. You can use [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) (aka variables) defined in the document.

  In practice, both of these feel positive and natural – indeed, they are deliberate, specced behaviors.

## Prior art

- [react-shade](https://github.com/apearce/react-shade): fully-featured shadow DOM for React
- [react-shadow](https://github.com/Wildhoney/ReactShadow): use shadow DOM in React with CSS, [Styled Components](https://styled-components.com/), and [Emotion](https://emotion.sh/)
- [react-shadow-root](https://github.com/apearce/react-shadow-root): declarative shadow DOM element for React
