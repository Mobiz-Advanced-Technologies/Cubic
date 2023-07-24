document.getElementById("paper").addEventListener("input", function () {
  document.getElementById("charmeter").innerText = document.getElementById("paper").textContent.split("").length

  document.getElementById("wordmeter").innerText = document.getElementById("paper").textContent.split(" ").length
}, false);

function savedoc() {
  const blob = new Blob([document.getElementById("paper").innerHTML], { type: "application/json" });
  const fileName = "Document.html";

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
}

function saveAs(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
}

function exportRTF() {
  const blob = new Blob([htmlToRtf(document.getElementById("paper").innerHTML)], { type: "application/json" });
  const fileName = "Document.rtf";

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
}

function exportTXT() {
  const blob = new Blob([document.getElementById("paper").textContent], { type: "application/json" });
  const fileName = "Document.txt";

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
}

function importDoc() {
  var input = document.getElementById("file-input");
  const file = input.files[0];

  const reader = new FileReader();
  reader.onload = function (event) {
    const contents = event.target.result;
    document.getElementById("paper").innerHTML = "";
    document.getElementById("paper").innerHTML = contents;
  };

  reader.readAsText(file);
}

async function loadTemplate(fileURL) {
  const get = await fetch(fileURL);
  const res = await get.text();
  document.getElementById("paper").innerHTML = "";
  document.getElementById("paper").innerHTML = res;
}

const urlParams = new URLSearchParams(window.location.search);
const template = urlParams.get('template')
if (template) {
  loadTemplate(template)
}