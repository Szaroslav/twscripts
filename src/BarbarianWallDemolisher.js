/**
 * BarbarianWallDemolisher.js v1.2.1
 * Szary (Plemiona: AGH Szary) and howcio
 * GitHub:      https://github.com/Szaroslav
 * Source code: https://github.com/Szaroslav/twscripts
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

class BarbarianWallDemolisher {

  // Base of the user customisable settings
  baseSettings = {
    // Hide all villages without built wall [true/false]
    hideOthers:          true,
    // Hide a village after sending the command [true/false]
    hideOnClick:         true,
    // Only scan [true/false],
    // if don't have any information about a village
    // (overwrites yellow and red dot setting)
    scanIfNoInformation: false,
    // Assumed level of the wall, if the attack suffered partial losses (yellow dot)
    yellowDotWallLevel:  1,
    // Assumed level of the wall, if the attack suffered full losses (red dot)
    redDotWallLevel:     1,
    // Templates of troops per wall level
    templates: {
      1:  { "axes": 10, "scouts": 1, "lights": 2,  "rams": 2,  "catapults": 0 },
      2:  { "axes": 10, "scouts": 1, "lights": 4,  "rams": 4,  "catapults": 0 },
      3:  { "axes": 10, "scouts": 1, "lights": 8,  "rams": 8,  "catapults": 0 },
      4:  { "axes": 15, "scouts": 1, "lights": 15, "rams": 10, "catapults": 0 },
      5:  { "axes": 25, "scouts": 1, "lights": 20, "rams": 15, "catapults": 0 },
      6:  { "axes": 0,  "scouts": 0, "lights": 0,  "rams": 0,  "catapults": 0 },
      7:  { "axes": 0,  "scouts": 0, "lights": 0,  "rams": 0,  "catapults": 0 },
      8:  { "axes": 0,  "scouts": 0, "lights": 0,  "rams": 0,  "catapults": 0 },
      9:  { "axes": 0,  "scouts": 0, "lights": 0,  "rams": 0,  "catapults": 0 },
      10: { "axes": 0,  "scouts": 0, "lights": 0,  "rams": 0,  "catapults": 0 },
      11: { "axes": 0,  "scouts": 0, "lights": 0,  "rams": 0,  "catapults": 0 },
      12: { "axes": 0,  "scouts": 0, "lights": 0,  "rams": 0,  "catapults": 0 },
      13: { "axes": 0,  "scouts": 0, "lights": 0,  "rams": 0,  "catapults": 0 },
      14: { "axes": 0,  "scouts": 0, "lights": 0,  "rams": 0,  "catapults": 0 },
      15: { "axes": 0,  "scouts": 0, "lights": 0,  "rams": 0,  "catapults": 0 },
      16: { "axes": 0,  "scouts": 0, "lights": 0,  "rams": 0,  "catapults": 0 },
      17: { "axes": 0,  "scouts": 0, "lights": 0,  "rams": 0,  "catapults": 0 },
      18: { "axes": 0,  "scouts": 0, "lights": 0,  "rams": 0,  "catapults": 0 },
      19: { "axes": 0,  "scouts": 0, "lights": 0,  "rams": 0,  "catapults": 0 },
      20: { "axes": 0,  "scouts": 0, "lights": 0,  "rams": 0,  "catapults": 0 },
    }
  };
  settings = {};

  version                   = "v1.2.1";
  gameData                  = game_data ?? { screen: undefined };
  observer                  = null;
  activeRow                 = null;
  activeConfirmAttackButton = null;
  confirmationHandler       = null;

  constructor(settings = {}) {
    this.#initSettings(settings);
  }

  exec() {
    // Verify, if user is in the Loot Assitant panel.
    if (this.gameData.screen === "am_farm") {
      if (this.settings.hideOnClick) {
        // Observe the DOM, whenever it changes.
        // Find the button and add onclick event handler function
        // to remove a row after sending the attack.
        this.observer = new MutationObserver(this.#handleDocumentChange.bind(this));
        this.observer.observe(document.body, { childList: true, subtree: true });
      }

      const plunderList = $("#plunder_list")[0].rows;
      for (let i = 0; i < plunderList.length; i++) {
        this.#processPlunderRow(i, plunderList[i]);
      }
    }
    else {
      if (UI) {
        UI.ErrorMessage("Nie jesteś w panelu Asystenta Farmera", 3000, null, null);
      }
    }
  }

  #initSettings(settings) {
    for (const prop in this.baseSettings) {
      this.settings[prop] = settings[prop] !== undefined
                          ? settings[prop]
                          : this.baseSettings[prop];
    }

    const templates = this.baseSettings.templates;
    for (const wallLevel in templates) {
      this.settings.templates[wallLevel] = this.settings.templates[wallLevel] ?? templates[wallLevel];
    }
  }

  #handleDocumentChange(mutationNodeList, observer) {
    // Hide the row right after clicking the attack confirmation button.
    const confirmAttackButton = $("#troop_confirm_submit")[0];
    if (confirmAttackButton && confirmAttackButton !== this.activeConfirmAttackButton) {
      if (this.activeConfirmAttackButton) {
        this.activeConfirmAttackButton.removeEventListener(
          "click", this.confirmationHandler);
      }

      this.confirmationHandler = this.#handleConfirmation.bind(this);
      confirmAttackButton.addEventListener(
        "click",
        this.confirmationHandler,
        { once: true });

      this.activeConfirmAttackButton = confirmAttackButton;
    }
  }

  #handleConfirmation() {
    if (this.activeRow instanceof HTMLElement) {
      this.activeRow.style.display = "none";
    }
    this.activeRow = null;
  }

  #processPlunderRow(i, row) {
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

    const needToScan = this.settings.scanIfNoInformation && (isYellow || isRed);

    if (wallLevel > 0 || needToScan) {
      this.#addHandlerToCommandButton(row, wallLevel, needToScan);
    }
    else {
      if (this.settings.hideOthers) {
        row.style.display = "none";
      }
    }
  }

  #addHandlerToCommandButton(row, wallLevel, needToScan) {
    const sendManuallyCommandCell = row.cells[row.cells.length - 1];
    const target = sendManuallyCommandCell.getElementsByTagName("a")[0].href.split("target=")[1];
    const commonCommandParameters = {
      target,
    };
    let unitsCommandParameters = {
      axe:      0,
      spy:      1,
      light:    0,
      ram:      0,
      catapult: 0,
    };
    if (!needToScan) {
      const templates = this.settings.templates;
      unitsCommandParameters = {
        axe:      templates[wallLevel].axes,
        spy:      templates[wallLevel].scouts,
        light:    templates[wallLevel].lights,
        ram:      templates[wallLevel].rams,
        catapult: templates[wallLevel].catapults,
      };
    }
    const commandParameters = { ...commonCommandParameters, ...unitsCommandParameters };

    const commandButton   = sendManuallyCommandCell.getElementsByTagName("a")[0];
    commandButton.removeAttribute("onclick");
    commandButton.href   += `&${$.param(unitsCommandParameters)}`;
    commandButton.addEventListener(
      "click",
      this.#handleCommandClick.bind(this, commandParameters, row));
  }

  #handleCommandClick(parameters, row, event) {
    if (!event.ctrlKey && !event.shiftKey) {
      // Disable redirection and render the command popup.
      event.preventDefault();
      CommandPopup.openRallyPoint(parameters);
    }

    if (this.settings.hideOnClick) {
      this.activeRow = row;
    }
  }

}

new BarbarianWallDemolisher(window.settings || window.userSettings).exec();
