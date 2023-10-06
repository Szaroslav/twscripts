function main() {
  const urlQuery = parseUrlSearchQuery();
  const columnIndexesToNamesMap = mapTableColumnIndexesToNames();
  const namesToColumnIndexesMap = mapNamesToTableColumnIndexes(columnIndexesToNamesMap);
  const namesAndColumnIndexesMap = { ...columnIndexesToNamesMap, ...namesToColumnIndexesMap };
  console.log(urlQuery, namesAndColumnIndexesMap);
}

function parseUrlSearchQuery() {
  const rawUrlQuery = location.search;
  const urlQuery = rawUrlQuery
    .slice(1)
    .split("&")
    .reduce((urlParamsObject, currentRawParam) => {
      const [ key, value ] = currentRawParam
        .split("=")
        .map(v => decodeURIComponent(v));
      urlParamsObject[key] = value;
      return urlParamsObject;
    }, {});

    return urlQuery;
}

function mapTableColumnIndexesToNames() {
  let map = {
    0: "villageDetails",
    1: "distance"
  };

  const tableHeaders = Array.from(document.querySelectorAll("#units_table thead tr:nth-child(2) th"));
  const unitImagesWithIndex = tableHeaders
    .map((header, i) => [ i, header ])
    .filter(([ _, header ]) => header.querySelector("img"))
    .map(([ i, header ]) => [ i, header.querySelector("img") ]);
  const unitNamesMap = unitImagesWithIndex
    .reduce((unitNamesMap, [ i, img ]) => {
      unitNamesMap[i] = img.src.match(/\/unit_(\w+)\.\w+$/)[1];
      return unitNamesMap;
    }, {});

  map = { ...map, ...unitNamesMap };
  return map;
}

function mapNamesToTableColumnIndexes(columnIndexesToNamesMap) {
  return Object.entries(columnIndexesToNamesMap)
    .reduce((namesToColumnIndexesMap, [ index, name ]) => {
      namesToColumnIndexesMap[name] = parseInt(index);
      return namesToColumnIndexesMap;
    }, {});
}

main();
