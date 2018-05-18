// Write your Javascript code.
const numOlderSiblings = (el, tagName, i = 0) => el
  ? numOlderSiblings(el.previousElementSibling, tagName || el.tagName, i + 1)
  : i;

const selector = ([head, ...tail]) => {
  if (head === document.body) {
    return "body";
  }
  if (!head || head === document) {
    return "";
  }
  if (head.id) {
    return `#${head.id}`;
  }
  return `${selector(tail)}>${head.tagName.toLowerCase()}:nth-child(${numOlderSiblings(head)})`;
};


document.addEventListener('DOMContentLoaded', function () {

  function onConnected(connection) {
    // Call the broadcastMessage method on the hub.
    document.addEventListener('click', ev => {
      const sel = selector(ev.path);
      console.log(sel);
      console.log(ev);
      connection.send('click', '__GENERAL__', {selector: sel, y: ev.offsetY, x: ev.offsetX});
    }, true);
  }

  const connection = new signalR.HubConnectionBuilder()
    .withUrl('/chat')
    .build();
  connection.start()
    .then(() => onConnected(connection))
    .catch((error) => console.error(error.message));
});