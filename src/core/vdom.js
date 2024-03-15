/**
 * Creates a virtual DOM node.
 * @param {String} type - The type of the DOM node (e.g., 'div', 'span').
 * @param {Object} props - The properties/attributes of the node.
 * @param {Array<VNode>|String} children - Child nodes or text content.
 * @returns {VNode} - The virtual DOM node.
 */
function createVDomNode(type, props, children) {
  return { type, props, children };
}

/**
 * Renders a virtual DOM to the actual DOM.
 * @param {VNode|String} vNode - A virtual node or string to be rendered.
 * @param {HTMLElement} container - The DOM container where nodes are appended.
 */
function renderVDomToDom(vNode, container) {
  let domElement;
  if (isTextNode(vNode)) {
    domElement = document.createTextNode(vNode);
  } else {
    domElement = document.createElement(vNode.type);
    // Assuming this is where you initially set attributes on a newly created element
    const oldProps = {}; // No old props since the element is new
    updateDomAttributes(domElement, oldProps, vNode.props);

    vNode.children.forEach((child) => renderVDomToDom(child, domElement));
  }

  container && container.appendChild(domElement);
}

/**
 * Diff and update the real DOM to match the current virtual DOM state.
 * @param {Object|null} previousVNode - The previous virtual node.
 * @param {Object|null} currentVNode - The current virtual node.
 * @param {HTMLElement} parentDomElement - The parent DOM element.
 */
function diffAndUpdate(previousVNode, currentVNode, parentDomElement) {
  // If there's no current node, nothing to render or update.
  if (currentVNode === null) {
    parentDomElement.innerHTML = "";
    return;
  }

  // Case 1: Text node updates.
  if (isTextNode(previousVNode) || isTextNode(currentVNode)) {
    if (previousVNode !== currentVNode) {
      // Replace the whole text node if content has changed.
      const newDomElement = document.createTextNode(currentVNode);
      parentDomElement.replaceChild(newDomElement, parentDomElement.firstChild);
    }
    return;
  }

  // Case 2: Different element types.
  if (previousVNode.type !== currentVNode.type) {
    // Replace the old DOM node entirely.
    const newDomElement = renderVDomToDom(currentVNode);
    parentDomElement.replaceChild(newDomElement, parentDomElement.firstChild);
    return;
  }

  // Case 3: Same element type, check and update attributes.
  const domElement = getDomElementFromVNode(previousVNode, parentDomElement);
  updateAttributes(domElement, previousVNode.props, currentVNode.props);

  // Simplification: Directly re-render children.
  // Note: A more efficient approach would diff and update children individually.
  currentVNode.children.forEach((child, index) => {
    if (child !== previousVNode.children[index]) {
      diffAndUpdate(previousVNode.children[index], child, domElement);
    }
  });
}

/**
 * Updates or removes attributes on a DOM element based on the differences between
 * the old and new attributes.
 * @param {HTMLElement} domElement - The DOM element to update.
 * @param {Object} oldProps - The previous attributes.
 * @param {Object} newProps - The new attributes to apply.
 */
function updateDomAttributes(domElement, oldProps, newProps) {
  // Remove attributes that are no longer present in the new props
  Object.keys(oldProps).forEach((propName) => {
    if (!(propName in newProps)) {
      domElement.removeAttribute(propName);
    }
  });

  // Add new attributes or update existing ones
  Object.entries(newProps).forEach(([propName, propValue]) => {
    if (oldProps[propName] !== propValue) {
      domElement.setAttribute(propName, propValue);
    }
  });
}

/**
 * Retrieves the corresponding DOM element for a virtual node.
 * Note: This assumes a direct correspondence and is a simplification.
 * @param {Object} vNode - The virtual node.
 * @param {HTMLElement} parentDomElement - The parent DOM element.
 * @returns {HTMLElement} - The corresponding DOM element.
 */
function getDomElementFromVNode(vNode, parentDomElement) {
  // Simplified: In practice, you might need a more robust way to track DOM elements.
  return parentDomElement.firstChild;
}

/**
 * Checks if a virtual node is a text node.
 * @param {VNode} vNode - The virtual node to check.
 * @returns {Boolean} - True if the virtual node is a text node, false otherwise.
 */
function isTextNode(vNode) {
  return typeof vNode === "string" || vNode instanceof String;
}

/**
 * Re-renders an element in the DOM based on the updated virtual node.
 * @param {VNode} vNode - The updated virtual node.
 * @param {HTMLElement} parentDomElement - The parent DOM element where updates occur.
 */
function reRenderElement(vNode, parentDomElement) {
  while (parentDomElement && parentDomElement.firstChild) {
    parentDomElement.removeChild(parentDomElement.firstChild);
  }
  renderVDomToDom(vNode, parentDomElement);
}

export { createVDomNode, renderVDomToDom, reRenderElement };
