CodeMirror.defineSimpleMode("universal", {
    start: [
        { regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: "string" },
        {
            regex: /(function)(\s+)([a-z$][\w$]*)/,
            token: ["keyword", null, "variable-2"]
        },
        {
            regex: /(?:function|var|return|if|for|while|else|do|this)\b/,
            token: "keyword"
        },
        { regex: /true|false|null|undefined/, token: "atom" },
        {
            regex: /0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i,
            token: "number"
        },
        { regex: /\/\/.*/, token: "comment" },
        { regex: /\/(?:[^\\]|\\.)*?\//, token: "variable-3" },
        { regex: /\/\*/, token: "comment", next: "comment" },
        { regex: /[-+\/*=<>!]+/, token: "operator" },
        { regex: /[\{\[\(]/, indent: true },
        { regex: /[\}\]\)]/, dedent: true },
        { regex: /[a-z$][\w$]*/, token: "variable" },
        { regex: /<</, token: "meta", mode: { spec: "xml", end: />>/ } }
    ],
    comment: [
        { regex: /.*?\*\//, token: "comment", next: "start" },
        { regex: /.*/, token: "comment" }
    ],
    meta: {
        dontIndentStates: ["comment"],
        lineComment: "//"
    }
});

var mixedMode = {
    name: "htmlmixed",
    scriptTypes: [{
        matches: /\/x-handlebars-template|\/x-mustache/i,
        mode: null
    },
    {
        matches: /(text|application)\/(x-)?vb(a|script)/i,
        mode: "vbscript"
    }]
};

var codeEditor = CodeMirror.fromTextArea(document.getElementById("paper"), {
    lineNumbers: true,
    lineWrapping: true,
    theme: "monokai",
    mode: "universal",
    styleActiveLine: true,
    matchBrackets: true
});

var currentFontSize = parseInt(codeEditor.getOption("fontSize") || 14);
function fontBigger() {
    if (currentFontSize < 30) {
        currentFontSize += 1;
    }
    document.querySelector('.CodeMirror').style.fontSize = currentFontSize + 'px';
}

function fontSmaller() {
    if (currentFontSize > 1) {
        currentFontSize -= 1;
    }
    document.querySelector('.CodeMirror').style.fontSize = currentFontSize + 'px';
}