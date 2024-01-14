/**
 * ScheduleMerger.js v0.9.2
 * Szary (Plemiona: AGH Szary)
 * GitHub:       https://github.com/Szaroslav
 * Kod źródłowy: https://github.com/Szaroslav/twscripts
 *
 * Skrypt łączący kilka rozpisek z plemiona-planer.pl w jedną,
 * sortujący od najwcześniejszych do najpóźniejszych rozkazów,
 * jeśli rozpiska jest zbyt duża, skrypt dzieli je na kilka notatek.
 * Dopuszczalne formaty rozpisek:
 *   - tekst prosty,
 *   - (nowy) tekst rozszerzony,
 *   - stary tekst rozszerzony,
 *   - dla zastąpcy.
 * Skrypt aktualnie nie obsługuje tabel.
 */

import GreyMemo from "./common/Memo.js";

(function () {

const ScheduleMerger = {
    MSG_DURATION: 1400,
    memo: null,
    baseSettings: {
        scheduleFormat: 'extendedText',
    },
    settings: {},

    init: function () {
        console.log('%cScheduleMerger.js %cv0.9.2', 'display: inline-block; padding: 4px 0', 'display: inline-block; padding: 4px; background-color: #2151ae; color: white');
        console.log('Skrypt stworzony przez %cSzary %c(Plemiona: %cAGH Szary%c)', 'font-weight: bold', 'font-weight: normal', 'font-weight: bold', 'font-weight: normal');

        if (typeof Memo !== 'undefined') {
            this.memo = new GreyMemo(Memo);
            this.MSG_DURATION = this.memo.msgDurationMs;

            const s = window.settings;
            if (!s || !s.scheduleFormat) {
                this.settings.scheduleFormat = this.baseSettings.scheduleFormat;
            }
            else {
                this.settings.scheduleFormat = s.scheduleFormat;
            }

            const schedule = this.getSchedule();

            this.memo.create(schedule);
        }
        else {
            UI.ErrorMessage('Nie jesteś w notatkach. Przenoszę.');
            setTimeout(() => location.href = `${location.origin}/game.php?screen=memo`, this.MSG_DURATION + 600);
        }
    },

    getSchedule: function () {
        const schedule = [];
        const memoElements = document.querySelectorAll('.memo_container');

        memoElements.forEach(memoElement => {
            const filteredSchedule = this.filterSchedule(memoElement.querySelector('textarea[name="memo"]').value)
                .map(line => line + '\r\n');

            let step = 4;
            const scheduleFormat = this.settings.scheduleFormat
            if (scheduleFormat === 'oldExtendedText' || scheduleFormat === 'basicText') {
                step = 3;
            }

            for (let i = 0; i < filteredSchedule.length; i += step) {
                if (i + step - 1 >= filteredSchedule.length) return;
                schedule.push(filteredSchedule.slice(i, i + step));
            }
        });

        schedule.sort((a, b) => {
            const dateA = new Date(`${a[1].match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/)}T${a[1].match(/[0-9]{2}:[0-9]{2}:[0-9]{2}/)}`);
            const dateB = new Date(`${b[1].match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/)}T${b[1].match(/[0-9]{2}:[0-9]{2}:[0-9]{2}/)}`);
            return dateA - dateB;
        });
        schedule.forEach((order, i) => order[0] = order[0].replace(/^[0-9]{1,}\./, `${i + 1}.`))

        return schedule;
    },

    filterSchedule: function (scheduleText) {
        switch (this.settings.scheduleFormat) {
            case 'extendedText':
            case 'sittersText': {
                return scheduleText
                    .split('\n')
                    .filter(line => line !== '')
                    .filter(line => /^[0-9]+\./.test(line)
                        || /^\[b\][0-9]{4}-[0-9]{2}-[0-9]{2}/.test(line)
                        || /^[0-9]{3}\|[0-9]{3}.*?[0-9]{3}\|[0-9]{3}$/.test(line)
                        || /^\[url=.*?\]Wyślij.*?\[\/url\]$/.test(line));
            }
            case 'basicText':
            case 'oldExtendedText': {
                return scheduleText
                    .split('\n')
                    .filter(line => line !== '')
                    .filter(line => /^[0-9]+\./.test(line)
                        || /^\[b\][0-9]{4}-[0-9]{2}-[0-9]{2}/.test(line)
                        || /Wyślij \w+\[\/url]$/.test(line));
            }
            case 'table': {
                // TODO
            }
        }
    },
};

ScheduleMerger.init();

})();
