document.getElementById("paper").addEventListener("input", function () {
  document.getElementById("charmeter").innerText = document.getElementById('myTable').rows[0].cells.length
}, false);

function addRowAndColumn(amount) {
  for (let index = 0; index < amount; index++) {
    var table = document.getElementById("myTable");
    var rowCount = table.rows.length;
    var columnCount = table.rows[0].cells.length;
    for (var i = 0; i < rowCount; i++) {
      var row = table.rows[i];
      var cell = row.insertCell(columnCount);
      cell.contentEditable = "true";
    }
    var row = table.insertRow(rowCount);
    for (var i = 0; i < columnCount + 1; i++) {
      var cell = row.insertCell(i);
      cell.contentEditable = "true";
    }
    document.getElementById("charmeter").innerText = document.getElementById('myTable').rows[0].cells.length
  }
}
addRowAndColumn(47)

function savedoc() {
  const blob = new Blob([document.getElementById("paper").innerHTML], { type: "application/json" });
  const fileName = "Document.html";

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