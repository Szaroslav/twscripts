export default class Units {
  /**
   * Defines custom options.
   * @typedef {object} UnitOptions
   * @property {number} [cache]
   */

  /**
   * Defines the properties of the particular unit type.
   * @typedef {Object} UnitData
   * @property {number} recruitmentTimeSec
   * @property {number} population
   * @property {number} movementSpeedSec
   * @property {number} attack
   * @property {number} defense
   * @property {number} defenseAgainstCavalry
   * @property {number} defenseAgainstArchers
   * @property {number} capacity
   */

  /**
   * @type {Object.<string, UnitData> | undefined}
   */
  data;
  /**
   * @type {number}
   */
  #cache;

  /**
   * @param {UnitOptions} [options = {}]
   */
  constructor(options = {}) {
   this.#cache = typeof options.cache === "number"
      ? 1000 * options.cache
      : 0;
  }

  /**
   * Fetches information about units from the remote configuration.
   */
  async fetch() {
    const url           = `${window.location.origin}/interface.php?func=get_unit_info`;
    const response      = await fetch(url),
          responseText  = await response.text(),
          responseArray = responseText
            .split("\n")
            .map(line => line.trim());

    this.data = {};

    for (let i = 2; i < responseArray.length - 1; i++) {
      i = this.#processUnitData(responseArray, i);
    }
  }

  /**
   * Processes all data of certain unit type.
   * @param {string} response - A fetched configuration.
   * @param {number} i - Current line position of processing.
   * @returns {number} Line position after processing.
   */
  #processUnitData(response, i) {
    const unitName = this.#getOpeningMarkupName(response[i++]);
    this.data[unitName] = {};
    const unitData = this.data[unitName];

    while (this.#isUnitDataOver(response[i], unitName)) {
      const line = response[i++],
            markupName = this.#getMarkupName(line);
      switch (markupName) {
        case "build_time": {
          unitData.recruitmentTimeSec = this.#getMarkupValue(line);
          break;
        }
        case "pop": {
          unitData.population = this.#getMarkupValue(line);
          break;
        }
        case "speed": {
          unitData.movementSpeedSec = this.#getMarkupValue(line) * 60;
          break;
        }
        case "attack": {
          unitData.attack = this.#getMarkupValue(line);
          break;
        }
        case "defense": {
          unitData.defense = this.#getMarkupValue(line);
          break;
        }
        case "defense_cavalry": {
          unitData.defenseAgainstCavalry = this.#getMarkupValue(line);
          break;
        }
        case "defense_archer": {
          unitData.defenseAgainstArchers = this.#getMarkupValue(line);
          break;
        }
        case "carry": {
          unitData.capacity = this.#getMarkupValue(line);
          break;
        }
      }
    }

    return i;
  }

  /**
   * Verifies, whether processing of certain unit type is finished.
   * Line and markup name must be a string
   * and markup name must be different than `unitName`.
   * @param {string | undefined} line - Currently processed line.
   * @param {string} unitName - Currently processed unit name.
   * @returns {boolean}
   */
  #isUnitDataOver(line, unitName) {
    let markupName;
    return line
      && (markupName = this.#getMarkupName(line)) !== unitName
      && typeof markupName === "string";
  }

  /**
   * Gets a name of markup, based on mode.
   * @param {string} markup - Markup from which extracting the name.
   * @param {"opening" | "closing" | "any"} [mode = "any"] - Desired markup type.
   * @returns {string | null} - The first occurance of markup name, null otherwise.
   */
  #getMarkupName(markup, mode = "any") {
    let markupRegex = /<\/?(.*?)>/;
    if (mode === "opening") {
      markupRegex = /<([^/].*?)>/;
    }
    else if (mode === "closing") {
      markupRegex = /<\/(.*?)>/;
    }

    const markupMatch = markup.match(markupRegex);
    return (markupMatch && markupMatch[1]) ?? null;
  }

  /**
   * Gets a name of opening markup.
   * @param {string} markup - Markup from which extracting the name.
   * @returns {string | null} - The first occurance of opening markup name, null otherwise.
   */
  #getOpeningMarkupName(markup) {
    return this.#getMarkupName(markup, "opening");
  }

  /**
   * Gets a name of closing markup.
   * @param {string} markup - Markup from which extracting the name.
   * @returns {string | null} - The first occurance of closing markup name, null otherwise.
   */
  #getMarkupValue(markup) {
    const markupValueRegex = /<(.*?)>(.*?)<\/\1>/,
          markupMatch      = markup.match(markupValueRegex),
          markupValue      = (markupMatch && markupMatch[2]) ?? null;

    if (markupValue === null) {
      return null;
    }
    return !isNaN(Number(markupValue)) ? Number(markupValue) : markupValue;
  }

  /**
   * Saves the data into local storage.
   */
  save() {
    localStorage.setItem("jsUnits:data", JSON.stringify({
      timestamp: Date.now(),
      ...this.data,
    }));
  }

  /**
   * Load the data from local storage.
   */
  async load() {
    try {
      const cache                        = this.#cache;
      const { timestamp, ...storedData } = JSON.parse(
        localStorage.getItem("jsUnits:data"));

      if (Date.now() <= timestamp + cache) {
        console.info("Load the data from local storage.");
        this.data = storedData;
      }
      else {
        console.info("Fetching and saving the data from remote configuration...");
        await this.fetch();
        this.save();
      }
    }
    catch {
      // Invalid JSON, set data to undefined.
      this.data = undefined;
    }
  }
}
