class Units {
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

  #isUnitDataOver(line, unitName) {
    let markupName;
    return line
      && (markupName = this.#getMarkupName(line)) !== unitName
      && typeof markupName === "string";
  }

  #getMarkupName(markup, mode = "any") {
    let markupRegex = /<\/?(.*?)>/;
    if (mode === "opening") {
      markupRegex = /<([^\/].*?)>/;
    }
    else if (mode === "closing") {
      markupRegex = /<\/(.*?)>/;
    }

    const markupMatch = markup.match(markupRegex);
    return (markupMatch && markupMatch[1]) ?? null;
  }

  #getOpeningMarkupName(markup) {
    return this.#getMarkupName(markup, "opening");
  }

  #getMarkupValue(markup) {
    const markupValueRegex = /<(.*?)>(.*?)<\/\1>/,
          markupMatch      = markup.match(markupValueRegex),
          markupValue      = (markupMatch && markupMatch[2]) ?? null;

    if (markupValue === null) {
      return null;
    }
    return !isNaN(Number(markupValue)) ? Number(markupValue) : markupValue;
  }
}
