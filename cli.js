#!/usr/bin/env node
import inquirer from "inquirer";

import { execSync } from "child_process";
import fs from "fs";
const clipackage = `{
    "name": "rum",
    "version": "1.0.0",
    "description": "",
    "main": "entry.js",
    "type": "module",
    "scripts": {
        "test": "echo \'Error: no test specified\' && exit 1",
        "clibuild": "yarn tsc || node ./dist/cli.js"
    },
    "keywords": [],
    "author": ""
}
`;
function runsr() {
  execSync("node ./entry.js");
}
function Newproject(inp1) {
  fs.mkdir(`./${inp1}`, function (err) {
    if (err) {
      throw err;
    }
  });
  fs.writeFile(`./${inp1}/package.json`, clipackage, function (err) {
    if (err) {
      throw err;
    }
  });
  fs.writeFile(`./${inp1}/entry.js`, "console.log(gobal)", function (err) {
    if (err) {
      throw err;
    }
  });
}


console.log("GUM CLI");
const gumcli = [
  {
    type: "list",
    name: "OPER",
    message: "What Do you want to do",
    choices: ["Run", "Create"],
    filter(val) {
      return val.toLowerCase();
    },
  },
  {
    type: "confirm",
    name: "CNP",
    message: "Create New project",
  },
];
inquirer.prompt(gumcli).then((answers) => {
  let var1 = JSON.parse(JSON.stringify(answers));
  if (var1.OPER == "run") {
    runsr();
  }
  if (var1.CNP == true) {
    Newproject("Gum Project");
  }
  console.log("Cd Gum Project");
});
