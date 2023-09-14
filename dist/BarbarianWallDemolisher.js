/**
 * BarbarianWallDemolisher.js v1.0
 * Szary (Plemiona: AGH Szary) i howcio
 * GitHub:       https://github.com/Szaroslav
 * Kod źródłowy: https://github.com/Szaroslav/twscripts
 * 
 * Zmodyfikowany i rozbudowany skrypt napisany przez howcio.
 * Umożliwia wysyłanie ataków burzących, za pomocą przycisku placu w panelu Asystenta Farmera.
 * Skrypt analizuje ostatnie raporty znajdujące się w Asystencie Farmera pod kątem 3 aspektów:
 * - poziom muru wykryty przez zwiadowców;
 * - częściowe straty (żółta kropka);
 * - pełne straty (czerwona kropka).
 */

(function () {
  'use strict';

  const BarbarianWallDemolisher = {
    // Modifikowalne ustawienia skryptu
    settings: {
      // Ukrywanie wiosek bez murków do zbicia [true/false]
      hideOthers:         true,
      // Ukrywanie wiosek po wysłaniu ataku [true/false]
      hideOnClick:        true,
      // Zakładany poziom muru, jeśli atak poniósł częściowe straty (żółta kropka)
      yellowDotWallLevel: 1,
      // Zakładany poziom muru, jeśli atak poniósł całkowite straty (czerwona kropka)
      redDotWallLevel:    1, 
      // Szablony wojsk na poszczególne poziomy murów
      // axes   - topornicy
      // scouts - zwiadowcy
      // lights - lekka
      // rams   - tarany
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

    /////////////////////////////////////////
    //    Nie edytuj zawartości poniżej    //
    /////////////////////////////////////////
    version:   "v1.0",
    observer:  null,
    activeRow: null,

    exec() {
      if (typeof userSettings !== "undefined") {
        this.initSettings(userSettings);
      }
      else {
        this.initSettings({});
      }

      // Verify, if user is in the Loot Assitant panel.
      if (game_data.screen === "am_farm") {
        if (this.settings.hideOnClick) {
          // Observe the DOM, whenever it changes.
          // Find the button and add onclick event handler function
          // to remove a row after sending the attack.
          this.observer = new MutationObserver(this.handleDocumentChange.bind(this));
          this.observer.observe(document, { childList: true, subtree: true }); 
        }

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

    handleDocumentChange(mutationNodeList, observer) {
      // Hide the row right after clicking the attack confirmation button. 
      let confirmAttackButton = $("#troop_confirm_submit")[0];
      if (confirmAttackButton) {
        const row = this.activeRow;
        confirmAttackButton.onclick = () => row.style.display = "none";
      }

      // Remove active row after closing the popup.
      const popupCommand = $("#popup_box_popup_command")[0]; 
      if (!popupCommand) {
        this.activeRow = null;
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

        const commandButton   = row.cells[11].getElementsByTagName("a")[0];
        commandButton.removeAttribute("onclick");
        commandButton.href   += $.param(commandParameters);
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
        // Disable redirection and render the command popup.
        event.preventDefault();
        CommandPopup.openRallyPoint(parameters);
      }
      
      if (this.settings.hideOnClick) {
        this.activeRow = row;
      }
    }
  };

  BarbarianWallDemolisher.exec();

})();
