import Units from "./common/Units";

class SupportManager {

  #units = new Units({ cache: 86_400 });
  #namesAndColumnIndexesMap;

  async init() {
    await this.#units.load();
    return this;
  }

  report(playerNames) {
    this.#units.data.spy.population = 0;

    const urlQuery                 = this.#parseUrlSearchQuery();
    const columnIndexesToNamesMap  = this.#mapTableColumnIndexesToNames();
    const namesToColumnIndexesMap  = this.#mapNamesToTableColumnIndexes(columnIndexesToNamesMap);
    this.#namesAndColumnIndexesMap = { ...columnIndexesToNamesMap, ...namesToColumnIndexesMap };

    const supportInVillagesByPlayer = {};
    const supportRows = document.querySelectorAll("#units_table tbody > tr");
    let currentVillageName = null;
    for (const supportRow of supportRows) {
      if (supportRow.classList.contains("units_away")) {
        currentVillageName = this.#getVillageName(supportRow);
      }
      else {
        const playerName = this.#getPlayerName(supportRow);
        if (!supportInVillagesByPlayer[currentVillageName]) {
          supportInVillagesByPlayer[currentVillageName] = {};
        }
        if (!supportInVillagesByPlayer[currentVillageName][playerName]) {
          supportInVillagesByPlayer[currentVillageName][playerName] = {};
        }

        this.#updateSupportUnitsOfVillageAndPlayer(
          supportInVillagesByPlayer[currentVillageName][playerName],
          supportRow
        );
      }
    }

    const filteredSupportInVillagesByPlayer = {};
    for (const villageName in supportInVillagesByPlayer) {
      for (const playerName of playerNames) {
        if (!supportInVillagesByPlayer[villageName][playerName]) {
          continue;
        }

        if (!filteredSupportInVillagesByPlayer[villageName]) {
          filteredSupportInVillagesByPlayer[villageName] = {};
        }
        filteredSupportInVillagesByPlayer[villageName][playerName]
          = supportInVillagesByPlayer[villageName][playerName];
      }
    }

    console.log(filteredSupportInVillagesByPlayer);
  }

  #parseUrlSearchQuery() {
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

  #mapTableColumnIndexesToNames() {
    let map = {
      0: "villageDetails",
      1: "distance"
    };

    const tableHeaders = Array.from(
      document.querySelectorAll("#units_table thead > tr:nth-child(2) th"));
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

  #mapNamesToTableColumnIndexes(columnIndexesToNamesMap) {
    return Object.entries(columnIndexesToNamesMap)
      .reduce((namesToColumnIndexesMap, [ index, name ]) => {
        namesToColumnIndexesMap[name] = parseInt(index);
        return namesToColumnIndexesMap;
      }, {});
  }

  #getVillageName(rowElement) {
    const villageDetailsCell = rowElement
      .children[this.#namesAndColumnIndexesMap["villageDetails"]];
    const villageLink = villageDetailsCell.querySelector("span > span > a");
    const rawVillageName = villageLink.querySelector("span").textContent.trim();
    const villageInfoSuffixIndex = rawVillageName.search(/ \(\d{3}\|\d{3}\) \w\d+$/);
    const villageName = rawVillageName.slice(0, villageInfoSuffixIndex);
    return villageName;
  }

  #getPlayerName(rowElement) {
    const villageDetailsCell = rowElement
      .children[this.#namesAndColumnIndexesMap["villageDetails"]];
    const playerProfileLink = villageDetailsCell
      .querySelector("span[id^=label_text_] > a:first-of-type");
    if (!playerProfileLink) {
      // User's support row.
      return null;
    }
    const playerName = playerProfileLink.textContent;
    return playerName;
  }

  #updateSupportUnitsOfVillageAndPlayer(supportInVillageOfPlayer, rowElement) {
    if (!supportInVillageOfPlayer.totalPopulation)
      supportInVillageOfPlayer.totalPopulation = 0;

    for (const unitName of Object.keys(this.#units.data)) {
      const unitsCell = rowElement.children[this.#namesAndColumnIndexesMap[unitName]];
      if (!unitsCell) {
        // This world disabled this specific unit type.
        continue;
      }
      const unitsCount = Number(unitsCell.textContent);
      if (!supportInVillageOfPlayer[unitName])
        supportInVillageOfPlayer[unitName] = 0;
      supportInVillageOfPlayer[unitName] += unitsCount;
      supportInVillageOfPlayer.totalPopulation
        += unitsCount * this.#units.data[unitName].population;
    }
  }

}

(async function() {
  (await new SupportManager().init()).report([ "DeSide", "Love Hate" ]);
})();
