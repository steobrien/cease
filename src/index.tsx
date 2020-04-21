import React, { forwardRef, useRef, useState, useLayoutEffect } from "react"
import { createPortal } from "react-dom"

export default (strings, ...vars) => Component => {
  const css = strings.flatMap((string, i) => [string, vars[i]]).join("")

  let sheet
  if ("adoptedStyleSheets" in ShadowRoot.prototype) {
    sheet = new CSSStyleSheet()
    sheet.replace(css)
  }

  const createRoot = node => {
    const root = node.attachShadow({ mode: "open" })
    sheet
      ? (root.adoptedStyleSheets = [sheet])
      : (root.innerHTML += `<style>${css}</style>`)
    return root
  }

  return forwardRef(function CeaseScope(props, ref) {
    const [root, set] = useState()
    const node = useRef()
    useLayoutEffect(() => node.current && set(createRoot(node.current)), [node])

    return (
      <div ref={node}>
        {root && createPortal(<Component {...props} ref={ref} />, root)}
      </div>
    )
  })
}
