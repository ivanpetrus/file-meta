const fs = require('fs');
const path = require('path');
const main = require('./index');

const testDocx = async (fileName) => {
  const filePath = path.join(__dirname, 'test', 'files', fileName);
  const outFilePath = path.join(__dirname, 'test', 'files', `out_${fileName}`);
  let buffer = fs.readFileSync(filePath);
  const ext = fileName.split('.')[1];

  const data = await main.getMetadata(buffer, ext);
  console.log(data);

  buffer = fs.readFileSync(filePath);
  const updatedBuffer = await main.clearMetadata(buffer, ext);

  fs.writeFile(outFilePath, updatedBuffer, function (err) {
    if (err) return console.log(err);
    console.log(outFilePath);
  });
}

testDocx('test.pdf');
testDocx('test.docx');
testDocx('test.pptx');
testDocx('test.xlsx');
