(function () {

  const urlQuery = parseUrlSearchQuery();
  const columnIndexesToNamesMap = mapTableColumnIndexesToNames();
  const namesToColumnIndexesMap = mapNamesToTableColumnIndexes(columnIndexesToNamesMap);
  const namesAndColumnIndexesMap = { ...columnIndexesToNamesMap, ...namesToColumnIndexesMap };
  console.log(urlQuery, namesAndColumnIndexesMap);

  const supportRows = document.querySelectorAll("#units_table tbody > tr");
  for (const supportRow of supportRows) {
    if (supportRow.classList.contains("units_away")) {
      getVillageName(supportRow);
    }
    else {
      getPlayerName(supportRow);
    }
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

    const tableHeaders = Array.from(document.querySelectorAll("#units_table thead > tr:nth-child(2) th"));
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

  function getVillageName(rowElement) {
    const villageDetailsCell = rowElement.children[namesAndColumnIndexesMap["villageDetails"]];
    const villageLink = villageDetailsCell.querySelector("span > span > a");
    const rawVillageName = villageLink.querySelector("span").textContent.trim();
    const villageInfoSuffixIndex = rawVillageName.search(/ \(\d{3}\|\d{3}\) \w\d+$/);
    const villageName = rawVillageName.slice(0, villageInfoSuffixIndex);
    return villageName;
  }

  function getPlayerName(rowElement) {
    const villageDetailsCell = rowElement.children[namesAndColumnIndexesMap["villageDetails"]];
    const playerProfileLink = villageDetailsCell.querySelector("span[id^=label_text_] > a:first-of-type");
    if (!playerProfileLink) {
      // User's support row.
      return null;
    }
    const playerName = playerProfileLink.textContent;
    return playerName;
  }

})();