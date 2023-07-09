/**
 * BarbarianWallDemolisher.js v1.0
 * Szary (Plemiona: AGH Szary) and howcio
 * GitHub:      https://github.com/Szaroslav
 * Source code: https://github.com/Szaroslav/twscripts/tree/master/scripts/build/BarbarianWallDemolisher.js
 * 
 * Modified and extended script written by howcio.
 * Allows sending the demolishing attack commands
 * via rally point button in the Loot Assistant panel.
 * Script bases on the recent reports located in the Loot Assistant panel,
 * it evaluates or estimates level of the wall relying on 3 conditions:
 * - level of the wall spotted by scouts;
 * - partial losses (yellow dot);
 * - full losses (red dot).
 */

(function() {
const BarbarianWallDemolisher = {
  // Base of the user customisable settings
  baseSettings: {
    // Hide all villages without built wall [true/false]
    hideOthers:         true,
    // Hide a village after sending the command [true/false]
    hideOnClick:        true,
    // Assumed level of the wall, if the attack suffered partial losses (yellow dot)
    yellowDotWallLevel: 1,
    // Assumed level of the wall, if the attack suffered full losses (red dot)
    redDotWallLevel:    1, 
    // Templates of troops per wall level
    templates: {
      1:  { "axes": 10, "scouts": 1, "lights": 2,  "rams": 2 },
      2:  { "axes": 10, "scouts": 1, "lights": 4,  "rams": 4 },
      3:  { "axes": 10, "scouts": 1, "lights": 8,  "rams": 8 },
      4:  { "axes": 15, "scouts": 1, "lights": 15, "rams": 10 },
      5:  { "axes": 25, "scouts": 1, "lights": 20, "rams": 15 },
      6:  { "axes": 0,  "scouts": 0, "lights": 0,  "rams": 0 },
      7:  { "axes": 0,  "scouts": 0, "lights": 0,  "rams": 0 },
      8:  { "axes": 0,  "scouts": 0, "lights": 0,  "rams": 0 },
      9:  { "axes": 0,  "scouts": 0, "lights": 0,  "rams": 0 },
      10: { "axes": 0,  "scouts": 0, "lights": 0,  "rams": 0 },
      11: { "axes": 0,  "scouts": 0, "lights": 0,  "rams": 0 },
      12: { "axes": 0,  "scouts": 0, "lights": 0,  "rams": 0 },
      13: { "axes": 0,  "scouts": 0, "lights": 0,  "rams": 0 },
      14: { "axes": 0,  "scouts": 0, "lights": 0,  "rams": 0 },
      15: { "axes": 0,  "scouts": 0, "lights": 0,  "rams": 0 },
      16: { "axes": 0,  "scouts": 0, "lights": 0,  "rams": 0 },
      17: { "axes": 0,  "scouts": 0, "lights": 0,  "rams": 0 },
      18: { "axes": 0,  "scouts": 0, "lights": 0,  "rams": 0 },
      19: { "axes": 0,  "scouts": 0, "lights": 0,  "rams": 0 },
      20: { "axes": 0,  "scouts": 0, "lights": 0,  "rams": 0 }
    }
  },
  settings: {},
  //////////////////////////////////////////////////////////////////////////////

  version: "v1.0",

  exec() {
    if (typeof userSettings !== "undefined") {
      this.initSettings(userSettings);
    }
    else {
      this.initSettings({});
    }
    console.log(this.settings);

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

  initSettings(settings) {
    for (const prop in this.baseSettings) {
      this.settings[prop] = settings[prop]
                          ? settings[prop]
                          : this.baseSettings[prop];
    }

    const baseTemplates = this.baseSettings.templates;
    for (const wallLevel in baseTemplates) {
      if (!this.settings.templates[wallLevel]) {
        this.settings.templates[wallLevel] = baseTemplates[wallLevel];
      }
    }
  },

  handlePlunderRow(i, row) {
    if (i < 2) {
      return;
    }
    
    const dotImage = row.cells[1].querySelector("img");
    // Estaminate level of wall, based on respectively:
    // - spotted level;
    // - yellow dot;
    // - red dot.
    let wallLevel = 0;
    const rowWallLevel = Number(row.cells[6].innerHTML);
    if (rowWallLevel)
      wallLevel = Math.max(wallLevel, rowWallLevel);
    const isYellow = /dots\/yellow\.[a-z]+$/.test(dotImage.src);
    if (wallLevel === 0 && isYellow)
      wallLevel = this.settings.yellowDotWallLevel;
    const isRed = /dots\/red\.[a-z]+$/.test(dotImage.src);
    if (wallLevel === 0 && isRed)
      wallLevel = this.settings.redDotWallLevel;

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
      // Disable redirection and render the command popup
      event.preventDefault();
      CommandPopup.openRallyPoint(parameters);
    }
    if (this.settings.hideOnClick) {
      // Hide the row right after clicking the attack confirmation button.
      // Observe the DOM, whenever it's change
      // to find the button and add onclick event handler function.
      const mutationObserver = new MutationObserver((_, observer) => {
        const confirmAttackButton = $("#troop_confirm_submit")[0];
        if (confirmAttackButton) {
          confirmAttackButton.onclick = () => row.style.display = "none";
          observer.disconnect();
        }

        const popupCommand = $("#popup_box_popup_command")[0]; 
        if (!popupCommand) {
          observer.disconnect();
        }
      });
      mutationObserver.observe(document, { childList: true, subtree: true });
    }
  }
}

BarbarianWallDemolisher.exec();
})();
