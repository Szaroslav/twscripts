/**
 * BarbarianWallDestroyer.js v0.8.5
 * Szary (Plemiona: AGH Szary)
 * GitHub:      https://github.com/Szaroslav
 * Source code: https://github.com/Szaroslav/twscripts
 * 
 * Zmodyfikowany i rozbudowany skrypt napisany przez howcio.
 */

!function () {
  const BarbarianWallDestroyer = {
    version: "v0.8.5",
    settings: {
      // Ukrywanie wiosek bez murków do zbicia [true/false]
      hideOthers: true,
      // Ukrywanie wiosek po kliknięciu w link do placu [true/false]
      hideOnClick: true,
      // Zakładany poziom muru, jeśli atak poniósł częściowe straty (żółta kropka)
      yellowDotWallLevel: 0,
      // Zakładany poziom muru, jeśli atak poniósł całkowite straty (czerwona kropka)
      redDotWallLevel: 1, 
      // Szablony wojsk na poszczególne poziomy murów
      templates: {
        1:  { "axes": 10, "scouts": 0, "lights": 2, "rams": 2 },
        2:  { "axes": 0, "scouts": 0, "lights": 4, "rams": 4 },
        3:  { "axes": 0, "scouts": 0, "lights": 10, "rams": 8 },
        4:  { "axes": 15, "scouts": 0, "lights": 15, "rams": 15 },
        5:  { "axes": 15, "scouts": 0, "lights": 20, "rams": 20 },
        6:  { "axes": 0, "scouts": 0, "lights": 0, "rams": 0 },
        7:  { "axes": 0, "scouts": 0, "lights": 0, "rams": 0 },
        8:  { "axes": 0, "scouts": 0, "lights": 0, "rams": 0 },
        9:  { "axes": 0, "scouts": 0, "lights": 0, "rams": 0 },
        10: { "axes": 0, "scouts": 0, "lights": 0, "rams": 0 },
        11: { "axes": 0, "scouts": 0, "lights": 0, "rams": 0 },
        12: { "axes": 0, "scouts": 0, "lights": 0, "rams": 0 },
        13: { "axes": 0, "scouts": 0, "lights": 0, "rams": 0 },
        14: { "axes": 0, "scouts": 0, "lights": 0, "rams": 0 },
        15: { "axes": 0, "scouts": 0, "lights": 0, "rams": 0 },
        16: { "axes": 0, "scouts": 0, "lights": 0, "rams": 0 },
        17: { "axes": 0, "scouts": 0, "lights": 0, "rams": 0 },
        18: { "axes": 0, "scouts": 0, "lights": 0, "rams": 0 },
        19: { "axes": 0, "scouts": 0, "lights": 0, "rams": 0 },
        20: { "axes": 0, "scouts": 0, "lights": 0, "rams": 0 }
      }
    },
  
    /////////////////////////////
    //    Do not edit below    //
    /////////////////////////////
    exec() {
      if (game_data.screen === "am_farm") {
        const plunderList = $("#plunder_list")[0].rows;
        for (let i = 0; i < plunderList.length; i++) {
          this.handlePlunderRow(i, plunderList[i]);
        }
      }
      else {
        if (UI) {
          UI.ErrorMessage("Nie jesteś w panelu Asystenta Farmera", 3000, null, null);
        }
      }
    },
  
    handlePlunderRow(i, row) {
      if (i < 2) {
        return;
      }
      
      const dotImage = row.cells[1].querySelector("img");
      const wallLevel = Number(row.cells[6].innerHTML)
                        || /dots\/yellow\.[a-z]+$/.test(dotImage.src) && this.settings.yellowDotWallLevel
                        || /dots\/red\.[a-z]+$/.test(dotImage.src) && this.settings.redDotWallLevel
                        || 0;
      if (wallLevel > 0) {
        const templates = this.settings.templates;
        const commandParameters = {
          target_village_id: row.cells[11].getElementsByTagName("a")[0].href.split("target=")[1],
          from:              "simulator",
          att_axe:           templates[wallLevel]["axes"],
          att_spy:           templates[wallLevel]["scouts"],
          att_light:         templates[wallLevel]["lights"],
          att_ram:           templates[wallLevel]["rams"]
        };
  
        const commandButton = row.cells[11].getElementsByTagName("a")[0];
        commandButton.removeAttribute("onclick");
        commandButton.href += $.param(commandParameters);
        commandButton.onclick = this.handleCommandClick.bind(this, commandParameters, row);
      }
      else {
        if (this.settings.hideOthers) {
          row.style.display = "none";
        }
      }
    },
  
    handleCommandClick(parameters, row, event) {
      if (!event.ctrlKey && !event.shiftKey) {
        event.preventDefault();
        CommandPopup.openRallyPoint(parameters);
      }
      if (this.settings.hideOnClick) {
        row.style.display = "none";
      }
    }
  }
  
  BarbarianWallDestroyer.exec();  
}();
