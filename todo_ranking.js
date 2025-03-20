var lis = [];
var todos;
var rank = 1;
document.addEventListener("DOMContentLoaded", () => {
  todos = document.getElementById("todos").getElementsByTagName("li");
  initLis();
  setHeightofContainer();
});

function setHeightofContainer() {
  var container = document.getElementById("listcontainer");
  var listheight = document.getElementById("todos").offsetHeight;
  console.log(listheight);

  container.style.height = listheight + 80 + "px";
}

function initLis() {
  lis = [];
  Array.from(todos).forEach((element) => {
    if (!element.classList.contains("visited")) {
      lis.push(element.innerHTML);
    }
  });
  if (lis.length <= 1) {
    finishRanking();
  }
}

async function finishRanking() {
  selectTodo();
  await sortEntriesByRank()
    .then(() => sleep(2000))
    .then(() => handleButtons());
}

function handleButtons() {
  document.getElementById("rollbutton").classList.add("removed");
  document.getElementById("resetbutton").classList.remove("hidden");
}

async function sortEntriesByRank() {
  ul = document.getElementById("todos");
  ul.classList.add("sorted");
  var new_ul = ul.cloneNode(false);

  // Add all lis to an array
  var lis = [];
  for (var i = 0; i < ul.childNodes.length; i++) {
    if (ul.childNodes[i].nodeName === "LI") lis.push(ul.childNodes[i]);
  }

  // Sort the lis in descending order
  lis.sort(function (a, b) {
    return (
      parseInt(a.childNodes[0].data, 10) - parseInt(b.childNodes[0].data, 10)
    );
  });

  // Add them into the ul in order
  for (var i = 0; i < lis.length; i++) new_ul.appendChild(lis[i]);
  ul.parentNode.replaceChild(new_ul, ul);
}

async function rankTheseTodos() {
  document.getElementById("rollbutton").classList.add("hidden");
  await visitTodos();
}

async function visitTodos() {
  while (lis.length > 1) {
    await doBubbling()
      .then(async () => selectTodo())
      .then(() => sleep(2000));
  }
}

async function selectTodo() {
  removeHighlights();
  highlight(lis[getRandomInt(lis.length)], Highlighter.Selected);
}

async function doBubbling() {
  for (let step = 0; step < 10; step++) {
    const a = await bubble();
  }
}

async function bubble() {
  await sleep(200).then(() => {
    removeHighlights();
    highlight(lis[getRandomInt(lis.length)], Highlighter.Bubble);
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function removeHighlights() {
  for (let member of todos) {
    member.classList.remove("selected", "bubble");
  }
}

function highlight(member, highlighter) {
  for (let item of todos) {
    if (item.innerHTML == member) {
      item.classList.add(highlighter.name);
      if (highlighter == Highlighter.Selected) {
        setVisited(item);
      }
    }
  }
}

function setVisited(item) {
  item.classList.add("visited");
  let innerHtml = item.innerHTML;
  item.innerHTML = `${rank++} - ${innerHtml}`;
  initLis();
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function reset() {
  location.reload();
}

class Highlighter {
  static Bubble = new Highlighter("bubble");
  static Selected = new Highlighter("selected");

  constructor(name) {
    this.name = name;
  }
  toString() {
    return this.name;
  }
}
