import {
  createVDomNode,
  renderVDomToDom,
  reRenderElement,
} from "./core/vdom.js";

// Usage Example:
const vNode = createVDomNode("div", { id: "app" }, [
  "Hello, Virtual DOM!",
  createVDomNode("p", {}, ["This is a paragraph."]),
]);

const container = document.getElementById("app");
renderVDomToDom(vNode, container);

// Assume an update happens here
const updatedVNode = createVDomNode("div", { id: "app" }, [
  "Updated content!",
  createVDomNode("p", {}, ["This paragraph has changed."]),
]);

setTimeout(() => {
  reRenderElement(updatedVNode, container);
}, 5000);
