const { program } = require('commander');
program.version(require("../package.json").version);


program
  .option('-cd, --createdemo', 'Crete a example bot file')

  if(program.createdemo)console.log("test")