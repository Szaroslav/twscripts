import BBCode from '../private/BBCode.js';

const ScheduleRemover = {
    init: function () {
        console.log('%cScheduleRemover.js %cv0.2', 'display: inline-block; padding: 4px 0', 'display: inline-block; padding: 4px; background-color: #2151ae; color: white');
        console.log('Skrypt stworzony przez %cSzary %c(Plemiona: %cAGH Szary%c)', 'font-weight: bold', 'font-weight: normal', 'font-weight: bold', 'font-weight: normal');
        
        const memoContent = document.querySelector('.memo_script .show_row > td');
        console.log(BBCode.fromHTML(memoContent));
        const schedule = this.parseSchedule(memoContent, memoContent.childNodes);
        this.createCheckboxes(memoContent, schedule);
    },

    parseSchedule: function (root, nodes) {
        const schedule = [];

        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].nodeType === 3) {
                const text = nodes[i].textContent.trim();

                if (/^\d+\./.test(text)) {
                    schedule.push([]);
                    while (i < nodes.length && (nodes[i].nodeType !== 1 || nodes[i].tagName !== 'A' || !/Wyślij \w+/.test(nodes[i].textContent))) {
                        schedule[schedule.length - 1].push(nodes[i++]);
                    }
                    nodes[i].setAttribute('data-index', schedule.length - 1);
                    nodes[i].addEventListener('click', e => root.querySelector(`#order${e.target.getAttribute('data-index')}`).checked = true);
                    schedule[schedule.length - 1].push(nodes[i]);
                }
                else {
                    root.removeChild(nodes[i--]);
                }
            }
            else {
                root.removeChild(nodes[i--]);
            }
        }

        console.log(schedule);
        return schedule;
    },

    createCheckboxes: function (root, schedule) {
        schedule.forEach((order, i) => {
            const main = document.createElement('div');
            main.classList.add('schedule-row');
            main.style.cssText = 'display: flex; align-items: center; padding: .5em 0';

            const checkboxCtn = document.createElement('div');
            checkboxCtn.classList.add('schedule-checkbox-container');
            checkboxCtn.innerHTML = `<input type="checkbox" id="order${i}">`;
            main.appendChild(checkboxCtn);

            const scheduleCtn = document.createElement('div');
            scheduleCtn.classList.add('schedule-content-container');
            order.forEach(element => scheduleCtn.appendChild(element));
            main.appendChild(scheduleCtn);

            root.appendChild(main);
        });
    }
};

ScheduleRemover.init();