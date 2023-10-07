function fetchCommandsPerPlayer(inputData, minPopulation, maxPopulation) {
  const populationPerUnit = {
    spear:    1,
    sword:    1,
    axe:      1,
    archer:   1,
    spy:      2,
    light:    4,
    marcher:  5,
    heavy:    6,
    ram:      5,
    catapult: 8,
    knight:   10,
    snob:     100
  };

  const coordinates = inputData.split(" ");

  function calculateCommandStrength(commandTable) {
    const unitCells = commandTable.querySelectorAll("td.unit-item");

    let strength = 0;
    for (const unitCell of unitCells) {
      const classNameMatch = unitCell.className.match(/unit-item-(\w+)/);
      if (classNameMatch === null || classNameMatch.length < 2)
        continue;
      const unitName = classNameMatch[1];
      const unitsNumber = Number(unitCell.textContent);
      if (isNaN(unitsNumber))
        continue;
      strength += unitsNumber * populationPerUnit[unitName];
    }

    return strength;
  }

  async function fetchVillageData(villageId, coordinates) {
    const url = `https://${game_data.world}.plemiona.pl/game.php?village=${game_data.village.id}&screen=info_village&id=${villageId}#${coordinates}`;

    try {
      const response = await fetch(url);
      const html = await response.text();
      const tempContainer = document.createElement("div");
      tempContainer.innerHTML = html;
      const container = tempContainer.querySelector("#commands_outgoings");
      const commandLinks = Array.from(tempContainer.querySelectorAll("#commands_outgoings .quickedit-content > a"))
        .filter(element => element.className === "")
        .filter(element =>
          element.querySelector("[data-command-type]").getAttribute("data-command-type") !== "support");

      const counts = {};
      for (const element of commandLinks) {
        const url = element.href;
        const response = await fetch(url);
        const html = await response.text();
        const tempContainer = document.createElement("div");
        tempContainer.innerHTML = html;

        const commandTables = tempContainer.querySelectorAll("#content_value > .vis");
        if (commandTables === null || commandTables.length < 2)
          continue;

        const attackerRow = commandTables[0].querySelector("tr:nth-child(2)"),
              attackerCell = attackerRow.querySelector("td:last-child"),
              nickname = attackerCell.textContent;

        const commmandStrength = calculateCommandStrength(commandTables[1]);
        if (commmandStrength < minPopulation || commmandStrength > maxPopulation)
          continue;

        if (!counts[nickname]) {
          counts[nickname] = 1;
        }
        else {
          counts[nickname]++;
        }
      }

      return counts;
    } catch (error) {
      console.warn(`Brak ataków dla wioski o ID ${villageId}: ${error}`);
      return null;
    }
  }

  // Function to introduce a pause
  function pause(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Function to download a file
  function downloadFile(filename, content) {
    const element = document.createElement("a");
    element.setAttribute("href", `data:text/csv;charset=utf-8,${encodeURIComponent(content)}`);
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  // URL for the request
  const url = `https://${game_data.world}.plemiona.pl/map/village.txt`;

  // Making the request using fetch
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    })
    .then(async body => {
      const rows = body.split("\n");
      const villageData = {};

      // Parsing the response and extracting the IDs based on coordinates
      rows.forEach(row => {
        const values = row.split(",");

        if (values.length >= 5) {
          const x = parseInt(values[2]);
          const y = parseInt(values[3]);

          coordinates.forEach(coord => {
            const [cx, cy] = coord.split("|");
            if (x === parseInt(cx) && y === parseInt(cy)) {
              const id = parseInt(values[0]);
              villageData[coord] = id;
            }
          });
        }
      });

      // Fetching attack nicknames for each village with pause
      const combinedData = {};
      UI.Notification.show("https://help.plemiona.pl/images/2/26/Star.PNG", "Zbieranie ataków", "Zbieranie ataków - <b>dane graczy</b>. <br />Czekaj!")
      for (const coord in villageData) {
        const id = villageData[coord];
        // await pause(200); // Introduce a 200ms pause before each request
        const result = await fetchVillageData(id, coord);
        for (const nickname in result) {
          if (!combinedData[nickname]) {
            combinedData[nickname] = result[nickname];
          } else {
            combinedData[nickname] += result[nickname];
          }
        }
        const villageCount = Object.keys(combinedData).length;
        const totalVillages = Object.keys(villageData).length;
        UI.InfoMessage(`Zebrano dane z ${villageCount} wiosek`);
      }

      // Generate CSV from combined data (attack count summary)
      let summaryCsv = "Nazwa gracza,Liczba atakow (suma)\n";

      for (const nickname in combinedData) {
        const count = combinedData[nickname];
        summaryCsv += `${nickname},${count}\n`;
      }

      // Download the attack count summary CSV file
      const summaryFilename = "gracze.csv";
      downloadFile(summaryFilename, summaryCsv);

      // Generate CSV from individual village data
      let villageCsv = "Koordy,Nazwa gracza,Liczba ataków (suma)\n";
      UI.Notification.show("https://help.plemiona.pl/images/2/26/Star.PNG", "Zbieranie ataków", "Zbieranie ataków - <b>dane z wiosek</b>. <br />Czekaj!")
      for (const coord in villageData) {
        const id = villageData[coord];
        // await pause(200); // Introduce a 200ms pause before each request
        const result = await fetchVillageData(id, coord);
        for (const nickname in result) {
          const count = result[nickname];
          villageCsv += `${coord},${nickname},${count}\n`;
        }
      }

      // Download the individual village data CSV file
      const villageFilename = "wioski.csv";
      downloadFile(villageFilename, villageCsv);
    })
    .catch(error => {
      console.error("Error:", error);
    });
}

function main() {
  const MainTemplate = document.createElement("div");
  MainTemplate.innerHTML = `
    <div class="content-border">
      <div style="padding: 2px; border 1px solid #f9e1a8">
        <div style="padding: 10px; width: 100%">
          <form id="temporary-popup">
            <textarea name="inputCoords" placeholder="Lista z koordynatami (oddzielona spacjami)"></textarea>
            <input name="minPopulationInput" type="number" placeholder="Minimalna liczba jednostek">
            <input name="maxPopulationInput" type="number" placeholder="Maksymalna liczba jednostek">
            <input class="btn" type="submit" value="Wyciągnij rozkazy">
          </form>
        </div>
      </div>
    </div>
  `;
  const mainCell = document.querySelector("#main_layout .maincell");
  const quickbar = mainCell.querySelector("#quickbar_outer");
  if (quickbar instanceof Element) {
    quickbar.after(MainTemplate);
  }
  else {
    mainCell.firstChild.before(MainTemplate);
  }

  const simplePopup = document.getElementById("temporary-popup");
  simplePopup.onsubmit = e => {
    e.preventDefault();

    const minPopulationValue = simplePopup.elements.minPopulationInput.value,
          maxPopulationValue = simplePopup.elements.maxPopulationInput.value;
    const inputCoords        = simplePopup.elements.inputCoords.value,
          minPopulation      = minPopulationValue !== "" ? Number(maxPopulationValue) : 0,
          maxPopulation      = maxPopulationValue !== "" ? Number(maxPopulationValue) : Infinity;
    fetchCommandsPerPlayer(inputCoords, minPopulation, maxPopulation);
  }
}

main();
