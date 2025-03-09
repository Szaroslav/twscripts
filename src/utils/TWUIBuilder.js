function TWUIBuilder() {
  const rootContainer = document.createElement("div");
  rootContainer.classList.add("content-border");
  let innerContainer;

  innerContainer = document.createElement("div");
  innerContainer.style = "padding: 2px; border: 1px solid #f9e1a8";
  rootContainer.append(innerContainer);

  innerContainer = document.createElement("div");
  innerContainer.style = "padding: 10px; width: 100%";
  rootContainer.append(innerContainer);

  const componentContent = document.createElement("div");
  componentContent.classList.add("component-content", "vis-item");
  componentContent.style = "padding: .5rem";
  rootContainer.append(componentContent);

  const t = {};

  t.build = function () {
    return rootContainer;
  };

  t.header = function (title = undefined) {
    if (title) {
      const heading = document.createElement("h2");
      heading.classList.add("component-heading");
      heading.textContent = title;
      componentContent.append(heading);
    }

    delete t.header;
    return t;
  };

  return t;
}

TWUIBuilder();
