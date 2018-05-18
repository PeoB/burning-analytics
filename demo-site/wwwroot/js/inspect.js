// Write your Javascript code.

document.addEventListener('DOMContentLoaded', function () {

  const canvas = document.createElement("canvas");
  canvas.setAttribute("height", document.body.clientHeight);
  canvas.setAttribute("width", document.body.clientWidth);
  canvas.setAttribute("style", "position:absolute;top:0;z-index: 1000000");
  document.body.appendChild(canvas);
  const heat = simpleheat(canvas);
  let selectorMap = {};
  let heatData = [];
  const update = () => {
    let css = document.getElementById("inspect-css");
    if (!css) {
      css = document.createElement("style");
      css.setAttribute("id", "inspect-css");

      document.body.appendChild(css);
    }
    css.innerHTML = Object.keys(selectorMap).map((selector) =>
      `${selector}:before {content: '${selectorMap[selector]}';background: yellow; color: black; position: absolute; }`
    ).join("\n");
    heat.data(heatData).draw()
  };

  function onConnected(connection) {
    // Call the broadcastMessage method on the hub.

    connection.on('echo', (selector, position) => {
      if (!(position instanceof Array)) {
        selectorMap[selector] = selectorMap[selector] ? selectorMap[selector] + 1 : 1;
        const pos = document.querySelector(selector).getBoundingClientRect();

        heatData.push([pos.x + position.x, pos.y + position.y, 1 / heatData.length]);
        heatData = heatData.map(([x, y]) => [x, y, 1 / heatData.length])
      } else {
        selectorMap = selector;
        heatData = position.map(({x, y, selector}) => {
          const pos = document.querySelector(selector).getBoundingClientRect();

          return [pos.x + x, pos.y + y, 1 / position.length]
        });
      }
      update();
    });
    connection.on('deecho', (selector, position) => {
      selectorMap[selector] = selectorMap[selector] > 1 ? selectorMap[selector] - 1 : 0;
      const pos = document.querySelector(selector).getBoundingClientRect();

      const index = heatData.findIndex(([x, y, selector]) => selector === selector && x === pos.x + position.x && y === pos.y + position.y);
      if (index !== -1) {
        heatData.splice(index,  1);
      }
      heatData = heatData.map(([x, y]) => [x, y, 1 / heatData.length]);
    });

    connection.send('inspect', window.location.search.includes("old"));
  }


  const connection = new signalR.HubConnectionBuilder()
    .withUrl('/chat')
    .build();
  connection.start()
    .then(() => onConnected(connection))
    .catch((error) => console.error(error.message));
});