codeEditor.on('change', function () {
  document.querySelector('.CodeMirror').style.fontSize = currentFontSize + 'px';
  document.getElementById("charmeter").innerText = codeEditor.getValue().split("").length
  document.getElementById("wordmeter").innerText = codeEditor.getValue().split(" ").length
})

async function savedoc() {
  try {
    const handle = await window.showSaveFilePicker();
    const writable = await handle.createWritable();
    const contents = codeEditor.getValue();
    await writable.write(contents);
    await writable.close();
  } catch (error) {
    console.error('Error saving file:', error);
  }
}

async function readFile(fileHandle) {
  const file = await fileHandle.getFile();
  const contents = await file.text();
  codeEditor.setValue('')
  codeEditor.setValue(contents)
}

async function importDoc() {
  const [fileHandle] = await window.showOpenFilePicker();
  await readFile(fileHandle);
}

async function loadTemplate(fileURL) {
  const get = await fetch(fileURL);
  const res = await get.text();
  codeEditor.setValue('')
  codeEditor.setValue(res);
}

const urlParams = new URLSearchParams(window.location.search);
const template = urlParams.get('template')
if (template) {
  loadTemplate(template)
}

function deployhtml() {
  let opened = window.open('')
  opened.document.write(codeEditor.getValue())
}