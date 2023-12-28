import fs from "node:fs";
import mri from "mri";

const coordsRegExp = /^[0-9]{3}\|[0-9]{3}$/;
const numberRegExp = /^[0-9]+$/;

function parseCoords(coordsStr) {
  if (!coordsRegExp.test(coordsStr)) {
    throw new Error(`Value "${coordsStr}" isn't coordinates.`);
  }

  const [x, y] = coordsStr.split("|").map(coord => Number(coord));
  return { x, y };
}

function coordsToString(coords) {
  return `${coords.x}|${coords.y}`;
}

const args = mri(process.argv.slice(2));
args.offs    = args.offs    ?? false;
args.archers = args.archers ?? false;
args.militia = args.militia ?? false;

const minCatas = args["min-catas"] ?? 0;

const coordsBoundaries = {
  upperLeft: args["upper-left"]
    ? parseCoords(args["upper-left"])
    : { x: Number.MIN_SAFE_INTEGER, y: Number.MIN_SAFE_INTEGER },
  upperRight: args["upper-right"]
    ? parseCoords(args["upper-right"])
    : { x: Number.MAX_SAFE_INTEGER, y: Number.MIN_SAFE_INTEGER },
  bottomRight: args["bottom-right"]
    ? parseCoords(args["bottom-right"])
    : { x: Number.MAX_SAFE_INTEGER, y: Number.MAX_SAFE_INTEGER },
  bottomLeft: args["bottom-left"]
    ? parseCoords(args["bottom-left"])
    : { x: Number.MIN_SAFE_INTEGER, y: Number.MAX_SAFE_INTEGER },
};

let columns = [
  { name: "coords",   type: "coords" },
  { name: "spear",    type: "int"    },
  { name: "sword",    type: "int"    },
  { name: "axe",      type: "int"    },
  { name: "archer",   type: "int"    },
  { name: "spy",      type: "int"    },
  { name: "light",    type: "int"    },
  { name: "marcher",  type: "int"    },
  { name: "heavy",    type: "int"    },
  { name: "ram",      type: "int"    },
  { name: "catapult", type: "int"    },
  { name: "knight",   type: "int"    },
  { name: "snob",     type: "int"    },
  { name: "militia",  type: "int"    },
];
if (!args.archers) {
  columns = columns.filter(column => !/archer/.test(column.name));
}
if (!args.militia) {
  columns = columns.filter(column => !/militia/.test(column.name));
}

function main() {
  const results = [];
  const inputPaths = args._;

  for (const path of inputPaths) {
    const inputCsv = fs.readFileSync(path)
      .toString()
      .replaceAll("\r\n", "\n")
      .split(",\n")
      .slice(0, -1);

    for (const row of inputCsv) {
      const parsedRow = parseRow(row);
      if (args.offs && !(parsedRow.axe >= 5000 && parsedRow.light >= 2200 && parsedRow.ram >= 250)) {
        continue;
      }
      if (areCoordsInBoundaries(parsedRow.coords) && parsedRow.catapult >= minCatas) {
        results.push(parsedRow);
      }
    }
  }

  for (const village of results) {
    console.log(coordsToString(village.coords));
  }
}

function areCoordsInBoundaries(coords) {
  const cb = coordsBoundaries;
  return coords.x >= cb.upperLeft.x   && coords.y >= cb.upperLeft.y
      && coords.x <= cb.upperRight.x  && coords.y >= cb.upperRight.y
      && coords.x <= cb.bottomRight.x && coords.y <= cb.bottomRight.y
      && coords.x >= cb.bottomLeft.x  && coords.y <= cb.bottomLeft.y;
}

function parseRow(row) {
  const rowSplit = row.split(',');
  if (rowSplit.length < columns.length) {
    throw new Error("Invalid number of columns.");
  }

  const obj = {};
  for (const [i, column] of columns.entries()) {
    if (column.type === "coords") {
      if (!coordsRegExp.test(rowSplit[i])) {
        throw new Error(`Column of index ${i} with value "${rowSplit[i]}" doesn't contain coordinates.`);
      }

      obj[column.name] = parseCoords(rowSplit[i]);
    }
    else if (column.type === "int") {
      if (!numberRegExp.test(rowSplit[i])) {
        throw new Error(`Column of index ${i} with value "${rowSplit[i]}" doesn't contain an integer.`);
      }

      obj[column.name] = Number(rowSplit[i]);
    }
  }

  return obj;
}

main();
