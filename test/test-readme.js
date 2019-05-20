
// this test tests if the sample code from README.md is valid

const assert = require('assert');

describe("sample code from readme", () =>
{
    var code, html;

    before(async () => {
        await cleanup();
        code = await getCodeSampleFromReadme();
    });

    it("can be read", () => {
        assert(typeof code === 'string' && code.length != 0);
    })

    it("is valid javascript", () => {
        expectError(() => eval(code), /cannot find module.*?image-to-gradient/mi);
    })

    it("can be executed", async() => {
        const altered = rewrite(code, {
            "require('image-to-gradient')": "require('../')",
            "'testimage.jpg'": "'example.png'",
            "console.log(": "finishedExecution("
        });
        var promise = waitUntil("finishedExecution");
        eval(altered);
        await promise;
    })

    it("outputs a html file", async() => {
        html = await getFileContent("output.html");
    })

    it("output contains gradient", () => {
        assert(html.match(/background:linear-gradient(.*?)/));
    })

    after(async () => {
        await cleanup();
    })

    async function cleanup(){
        const path = "output.html";
        if (await fileExists(path)) {
            await removeFile(path);
        }
    }
})

const fs = require('fs');
const promisify = require('util').promisify;
const readFile = promisify(fs.readFile);
const removeFile = promisify(fs.unlink);

const fileExists = path => new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
        if (err) {
            resolve(false);
        } 
        resolve(true);
    })
});

async function getCodeSampleFromReadme(){
    const markdown = await getReadmeContent();
    const sections = markdown.split(/^\s*#+\s+/m);
    const usage = sections.filter(x => x.match(/^usage/mi))[0];
    const code = usage.split(/\r?\n/).filter(x => x.match(/^(\t|    )/m));
    return code.join('\n');
}

async function getReadmeContent(){
    return getFileContent("README.md");
}

async function getFileContent(path){
    const data = await readFile(path);
    return data.toString();
}

function expectError(fn, pattern) {
    try {
        fn()
    }
    catch (error){
        if (error.message == null || !error.message.match(pattern)){
            throw error;
        }
    }
}

function rewrite(code, patches){
    let patched = code;
    for (const i in patches){
        patched = patched.replace(i, patches[i]);
    }
    return patched;
}

function waitUntil(functionName){
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(reject, 3000);
        global[functionName] = (...args) => {
            clearTimeout(timeout);
            resolve();
        }
    });
}
