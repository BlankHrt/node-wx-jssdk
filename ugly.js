var fs = require('fs');

//get a reference to the uglify-js module
var UglifyJS = require('uglify-js');

//get a reference to the minified version of file-1.js, file-2.js and file-3.js
const code = fs.readFileSync('./index.js', { encoding: 'utf8' })
// console.log(code)
var result = UglifyJS.minify(code);

//view the output
// console.log(result);

fs.writeFile("index.min.js", result.code, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("File was successfully saved.");
    }
});