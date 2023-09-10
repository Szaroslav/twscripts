/**
 * ScheduleMerger.js v0.9
 * Szary (Plemiona: AGH Szary)
 * GitHub: https://github.com/Szaroslav
 * 
 * Skrypt łączący kilka rozpisek z plemiona-planer.pl w jedną, sortujący od najwcześniejszych do najpóźniejszych rozkazów,
 * jeśli rozpiska jest zbyt duża, skrypt dzieli je na kilka notatek.
 * Dopuszczalne formaty rozpisek: tekst prosty, rozszerzony lub dla zastąpcy - skrypt aktualnie nie obsługuje tabel.
 */

import _Memo from './common/Memo.js';

const ScheduleMerger = {
    MSG_DURATION: 1400,

    init: function () {
        console.log('%cScheduleMerger.js %cv0.9', 'display: inline-block; padding: 4px 0', 'display: inline-block; padding: 4px; background-color: #2151ae; color: white');
        console.log('Skrypt stworzony przez %cSzary %c(Plemiona: %cAGH Szary%c)', 'font-weight: bold', 'font-weight: normal', 'font-weight: bold', 'font-weight: normal');

        if (typeof Memo !== 'undefined') {
            this.MSG_DURATION = _Memo.MSG_DURATION;
            const schedule = this.getSchedule();
            
            _Memo.create(schedule);
        }
        else {
            UI.ErrorMessage('Nie jesteś w notatkach. Przenoszę.');
            setTimeout(() => location.href = `${location.origin}/game.php?screen=memo`, this.MSG_DURATION + 600);
        }
    },



    getSchedule: function () {
        const schedule = [];
        const memos = document.querySelectorAll('.memo_container');

        memos.forEach(memo => {
            const d = _Memo.getSchedule(memo.querySelector('textarea[name="memo"]').value, 'text');
            for (let i = 0; i < d.length; i += 3) {
                if (i + 2 >= d.length) return;
                schedule.push([d[i], d[i + 1], d[i + 2]]);
            }
        });

        schedule.sort((a, b) => {
            const dateA = new Date(`${a[1].match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/)}T${a[1].match(/[0-9]{2}:[0-9]{2}:[0-9]{2}/)}`);
            const dateB = new Date(`${b[1].match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/)}T${b[1].match(/[0-9]{2}:[0-9]{2}:[0-9]{2}/)}`);
            return dateA - dateB;
        });
        schedule.forEach((order, i) => order[0] = order[0].replace(/^[0-9]{1,}./, `${i + 1}.`))

        return schedule;
    }
};

ScheduleMerger.init();
