let inputData;

while (true) {
  inputData = prompt("Podaj coordy (np 555|555 111|234):");
  const pattern = /^(\d{3}\|\d{3} )*\d{3}\|\d{3}$/;
  if (pattern.test(inputData)) {
    break;
  }

  alert("NieprawidÅ‚owe coordy, wejÅ›cie: '111|111 222|222 333|333'.");
}
const coordinates = inputData.split(' ');
async function fetchVillageData(villageId, coordinates) {
  const url = `https://${game_data.world}.plemiona.pl/game.php?village=${game_data.village.id}&screen=info_village&id=${villageId}#${coordinates}`;

  try {
    const response = await fetch(url);
    const html = await response.text();
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = html;
    const container = tempContainer.querySelector('#commands_outgoings');
    const attackElements = container.querySelectorAll('.command-row');
    const nicknameCounts = Array.from(attackElements).reduce((counts, element) => {
      const nicknameElement = element.querySelector('.quickedit-label');
      if (nicknameElement) {
        const nicknameText = nicknameElement.textContent.trim();
        const colonIndex = nicknameText.indexOf(':');
        if (colonIndex !== -1) {
          const nickname = nicknameText.substring(0, colonIndex).trim();
          if (!counts[nickname]) {
            counts[nickname] = 1;
          } else {
            counts[nickname]++;
          }
        }
      }
      return counts;
    }, {});

    return nicknameCounts;
  } catch (error) {
    console.error(`Brak atakow dla wioski o ID ${villageId}: ${error}`);
    return null;
  }
}

// Function to introduce a pause
function pause(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to download a file
function downloadFile(filename, content) {
  const element = document.createElement('a');
  element.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURIComponent(content)}`);
  element.setAttribute('download', filename);
  element.style.display = 'none';
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
    const rows = body.split('\n');
    const villageData = {};

    // Parsing the response and extracting the IDs based on coordinates
    rows.forEach(row => {
      const values = row.split(',');

      if (values.length >= 5) {
        const x = parseInt(values[2]);
        const y = parseInt(values[3]);

        coordinates.forEach(coord => {
          const [cx, cy] = coord.split('|');
          if (x === parseInt(cx) && y === parseInt(cy)) {
            const id = parseInt(values[0]);
            villageData[coord] = id;
          }
        });
      }
    });

    // Fetching attack nicknames for each village with pause
    const combinedData = {};
    UI.Notification.show("https://help.plemiona.pl/images/2/26/Star.PNG", "Zbieranie atakÃ³w", "Zbieranie atakÃ³w - <b>dane graczy</b>. <br />Czekaj!")
    for (const coord in villageData) {
      const id = villageData[coord];
      await pause(200); // Introduce a 200ms pause before each request
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
    let summaryCsv = 'Nazwa gracza,Liczba atakow (suma)\n';

    for (const nickname in combinedData) {
      const count = combinedData[nickname];
      summaryCsv += `${nickname},${count}\n`;
    }

    // Download the attack count summary CSV file
    const summaryFilename = 'gracze.csv';
    downloadFile(summaryFilename, summaryCsv);

    // Generate CSV from individual village data
    let villageCsv = 'Koordy,Nazwa gracza,Liczba atakow (suma)\n';
    UI.Notification.show("https://help.plemiona.pl/images/2/26/Star.PNG", "Zbieranie atakÃ³w", "Zbieranie atakÃ³w - <b>dane z wiosek</b>. <br />Czekaj!")
    for (const coord in villageData) {
      const id = villageData[coord];
      await pause(200); // Introduce a 200ms pause before each request
      const result = await fetchVillageData(id, coord);
      for (const nickname in result) {
        const count = result[nickname];
        villageCsv += `${coord},${nickname},${count}\n`;
      }
    }

    // Download the individual village data CSV file
    const villageFilename = 'wioski.csv';
    downloadFile(villageFilename, villageCsv);
  })
  .catch(error => {
    console.error('Error:', error);
  });