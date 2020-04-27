# API reference

`cease` default exports a single function, `css`.

---

### `css`

<code language="javascript">css\`_stylesheet_\`(_Component_) → StyledComponent</code>

##### Parameters

<dl>
<dt><code>stylesheet</code></dt>
<dd>A CSS string</dd>
<dt><code>Component</code></dt>
<dd>Your React component (class or function)</dd>
<dl>

##### Return value

<dl>
<dt><code>StyledComponent</code></dt>
<dd>A new React component rendering the passed <code>Component</code> in a Shadow DOM root attached to a new wrapping <code>div</code>, with CSS rules from <code>stylesheet</code> applied</dd>
<dl>

##### Example

```js
const StyledButton = css`
  button {
    color: red;
  }
  button .icon {
    color: black;
  }
`(Button)
```
