(async function() {

const modal = $("#check_villages");

const cvData = {
  mobileContent:       "#mobileContent",
  desktopContent:      "#contentContainer",
  checkVillagesForm:   ".check-villages--form",
  villagesCoordsInput: ".villages-coords--input",
  maxAttacksInput:     ".max-attacks--input",
  tribeIdsInput:       ".tribe-ids--input",
  villagesOutputDiv:   ".villages-output--div",
  removedVillagesDiv:  ".removed-villages--div",
  counter:             ".counter",
  commandRow:          "tr.command-row",
  dataCommandType:     "command-type"
};

const BARBARIANS_ID = "0";

const fetchRemoteData = async function (url, objectSchema) {
  const response = await fetch(url);
  const responseData = await response.text();
  const data = responseData.split("\n").map(line => line.split(","));

  if (data.length === 0) {
    return null;
  }
  if (!objectSchema && data[0].length !== Object.keys(objectSchema).length) {
    return responseData;
  }

  const objectsData = [];
  const schemaKeys = Object.keys(objectSchema);
  for (const line of data) {
    const lineObject = {};
    for (let i = 0; i < schemaKeys.length; i++) {
      const key = schemaKeys[i];
      lineObject[key] = line[i];
      if (schemaKeys[key] === "number") {
        lineObject[key] = Number(lineObject[key]);
      }
    }
    objectsData.push(lineObject);
  }

  return objectsData;
};

const arrayToMap = function (array, key) {
  if (array.length === 0 && !array[0][key]) {
    return {};
  }

  return array.reduce((accumulator, currentValue) => {
    accumulator[currentValue[key]] = currentValue;
    return accumulator;
  }, {});
};

const villagesData = arrayToMap(await fetchRemoteData("/map/village.txt", {
  id:       "string",
  name:     "string",
  x:        "number",
  y:        "number",
  playerId: "string",
  points:   "number",
  rank:     "number"
}), "id");
const playersData = arrayToMap(await fetchRemoteData("/map/player.txt", {
  id:       "string",
  name:     "string",
  tribeId:  "string",
  villages: "number",
  points:   "number",
  rank:     "number"
}), "id");

const checkVillages = function(event) {
  event.preventDefault();

  const targetElement = $(event.target);

  const villagesCoords = targetElement.find(cvData.villagesCoordsInput).val().split(" ");
  const tribeIds = [ BARBARIANS_ID, ...targetElement.find(cvData.tribeIdsInput).val().replace(" ", "").split(",") ];

  let maxAttacks = targetElement.find(cvData.maxAttacksInput).val();
  if (maxAttacks === "") {
    maxAttacks = Number.MAX_SAFE_INTEGER;
  }
  else if (maxAttacks < 1) {
    maxAttacks = 1;
  }

  const villages = {};
  // const incomings = {};
  // const attacksPerVillage = {};
  // const outputVillages = {};

  const villageCoordsUnique = [...new Set(villagesCoords)];

  villageCoordsUnique.forEach((item) => {
    const village = getVillageData(item);
    if (null !== village) {
      villages[village.id] = village;
    }
  });

  // Remove all villages, which tribe ID contains in tribe IDs input.
  const villagesToRemove = Object.entries(villages)
    .filter(([ _, village ]) => tribeIds.includes(village.tribeId));
  villagesToRemove
    .forEach(([ villageId, _ ]) => delete villages[villageId]);
  const removedVillages = villagesToRemove.map(([ _, village ]) => village);

  const removedVillagesNumber = removedVillages.length;

  // let tempCounter = 1;
  // for (const value of Object.values(villages)) {
  //   displayCounter(tempCounter++, allVillages);
  //   incomings[value.id] = getVillageAttacks(value.id);
  //   attacksPerVillage[value.id] = 0;
  // }

  // for (const [id, value] of Object.entries(incomings)) {
  //   const item = $(new DOMParser().parseFromString(value, 'text/html')).find('table');
  //   const commands = item.find(cvData.commandRow);

  //   commands.each((_, item) => {
  //     const commandType = $(item).find('span[data-command-type]').data('command-type');
  //     if (commandType === 'attack') {
  //       attacksPerVillage[id]++;
  //     }
  //   });
  // }

  // for (const key of Object.keys(attacksPerVillage)) {
  //   if(attacksPerVillage[key] >= maxAttacks) {
  //     delete attacksPerVillage[key];
  //   }
  // }

  // for (const key of Object.keys(attacksPerVillage)) {
  //   outputVillages[key] = villages[key];
  // }

  displayOutputVillages(villages);
  displayRemovedVillages(removedVillages, removedVillagesNumber);

  return false;
};

const openModal = function () {
  const modalHtml = `
    <div id="check_villages" class="vis vis_item" style="overflow: auto; overflow-x: hidden; height: 300px;">
      <h3>Wioski do sprawdzenia</h3>
      <div class="row">
        <h4>Dane z fejkomatu</h4>
        <form class="check-villages--form">
          <div style="display: flex; gap: 1rem">
            <label style="width: 256px">Wioski z fejkomatu</label>
            <textarea class="villages-coords--input" placeholder="213|700 330|012" style="width: 400px; height: 128px"></textarea>
          </div>
          <div style="display: flex; gap: 1rem">
            <label style="width: 256px">Maksymalna liczba ataków</label>
            <input class="max-attacks--input" style="margin: 0" type="number" step="1" min="1" max="100">
          </div>
          <div style="display: flex; gap: 1rem">
            <label style="width: 256px">Identyfikatory plemion (oddzielone przecinkami)</label>
            <input class="tribe-ids--input" style="margin: 0" type="text" placeholder="2137,100,3300">
          </div>
          <button type="submit" class="btn" style="margin-bottom: 5px;">Sprawdź wioski</button>
        </form>
      </div>
      <div class="row">
        <h4>Przefiltrowane dane</h4>
        <div class="counter"></div>
        <div class="villages-output--div"></div>
        <div class="removed-villages--div"></div>
      </div>
    </div>
  `;

  $(mobile ? cvData.mobileContent : cvData.desktopContent).prepend(modalHtml);
  $("#check_villages").find(cvData.checkVillagesForm).on("submit", checkVillages);
};

const getVillageData = function(coordsStr) {
  const coords = coordsStr.split("|"),
        x      = coords[0],
        y      = coords[1];

  const village = Object.values(villagesData).find(v => v.x === x && v.y === y);
  if (!village) {
    return null;
  }

  const playerId = villagesData[village.id].playerId;
  const tribeId = playerId !== "0" ? playersData[playerId].tribeId : "0";
  village.tribeId = tribeId;

  console.log("Sprawdziłem wioskę o koordach " + coordsStr);

  return village;
};

// const getVillageAttacks = function(id) {
//   let data;

//   $.ajax({
//     async: false,
//     url: "/game.php?village="+game_data.village.id+"&screen=map&ajax=map_info&source="+game_data.village.id+"&target="+id,
//     dataType: "json",
//     success: function(d) { data = d.incoming_html;},
//     timeout: 500
//   });

//   console.log("Sprawdziłem ataki na " + id);

//   return data;
// };

// const displayCounter = function(temp, all) {
//   if(temp < 1 && all < 1) {
//     $(cvData.counter).html("Poczekaj chwilę, ładuję wioski.");
//   }

//   if(temp<all) {
//     $(cvData.counter).html("Poczekaj chwilę, sprawdziłem "+temp+"/"+all+" wiosek.");
//   } else {
//     $(cvData.counter).html("Sprawdziłem "+temp+"/"+all+".");
//   }
// };

const displayOutputVillages = function(outputVillages) {
  let outputStr = "<textarea style=\"width: 100%\">";
  for (const village of Object.values(outputVillages)) {
    outputStr += village.x +"|" + village.y + " ";
  }
  outputStr += "</textarea>";

  $(cvData.villagesOutputDiv).html(outputStr);
};

const displayRemovedVillages = function (removedVillages, number) {
  let outputStr = "<textarea style=\"width: 100%\">";
  for (const village of Object.values(removedVillages)) {
    outputStr  += village.x +"|" + village.y + " ";
  }
  outputStr    += "</textarea>";

  outputStr    += "<p style=\"margin: 0; padding: .5rem\">Usunięto <b>" + number + "</b> wiosek.</p>";

  $(cvData.removedVillagesDiv).html(outputStr);
};

const closeModal = function() {
  $(modal).remove();
};

if (modal.length) {
  closeModal();
} else {
  openModal();
}

})();
