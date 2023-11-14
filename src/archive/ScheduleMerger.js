/**
 * ScheduleMerger.js v0.9
 * Szary (Plemiona: AGH Szary)
 * GitHub: https://github.com/Szaroslav
 * 
 * Skrypt łączący kilka rozpisek z plemiona-planer.pl w jedną, sortujący od najwcześniejszych do najpóźniejszych rozkazów,
 * jeśli rozpiska jest zbyt duża, skrypt dzieli je na kilka notatek.
 * Dopuszczalne formaty rozpisek: tekst prosty, rozszerzony lub dla zastąpcy - skrypt aktualnie nie obsługuje tabel.
 */

// import _Memo from './common/Memo.js';

(function () {

const _Memo = {
    MAX_MEMO_SIZE: typeof char_limit === 'number' ? char_limit : 6e4,
    MSG_DURATION: 1400,
    createdMemoIds: [],

    create: function (schedule) {
        const contents = this.splitSchedule(schedule);

        if (contents === null) {
            UI.ErrorMessage('Nie udało się utworzyć rozpiski.', this.MSG_DURATION);
            return;
        }
        UI.SuccessMessage('Tworzę rozpiskę, może to zająć kilka sekund.', this.MSG_DURATION);

        let p = $.Deferred().resolve();
        for (let i = 0; i < contents.length; i++) {
            p = p
                .then(() => Memo.addTab())
                .then(() => this.renameTab(`Rozpiska [${i + 1}]`))
                .then(() => this.setContent(contents[i]));
        }
        p.then(() => {
            Memo.selectTab(this.createdMemoIds[0]);
            UI.SuccessMessage('Rozpiska została utworzona. Odświeżam stronę.', this.MSG_DURATION);
            setTimeout(() => location.reload(), this.MSG_DURATION + 600);
        })
    },

    getSchedule: function (scheduleText, format) {
        if (format === 'text') {
            return scheduleText
                .split('\n')
                .filter(line => line !== '')
                .filter(line => /^[0-9]{1,}./.test(line) || /^\[b\][0-9]{4}-[0-9]{2}-[0-9]{2}/.test(line) || /Wyślij \w+\[\/url]$/.test(line))
                .map(line => line + '\r\n');
        }
        else if (format === 'table') {

        }
    },

    addTab: function () {
        if (Memo.tabs.length >= 10) {
            UI.ErrorMessage(s(_("3531dec6f954a7d15f46b4cf644c5bfe"), Memo.tabs.length), this.MSG_DURATION);
            return;
        }

        Memo.mobile && Memo.checkArrow(Memo.tabs.length);
        
        return $.ajax({
            url: $("#add_tab_url").val(),
            type: "POST",
            dataType: "json",
            data: {},
            success: function (e) {
                if (e && e.id) {
                    if ((Memo.tabs.push(e) >= Memo.max_tabs && $("#memo-add-tab-button").hide(), $("div.memo-tab").length >= 1)) var t = $("div.memo-tab").first().clone();
                    else location.reload();
                    Memo.editTabElement(t, e.id, e.title, !0), t.appendTo($("#tab-bar")), $(".memo-tab-button-close").show();
                    var a = $("div.memo_container").first().clone(),
                        o = a.attr("id").substr(5);
                    a.attr("id", "memo_" + e.id),
                        $("input[name='tab_id']", a).val(e.id),
                        $("tr.show_row > td", a).empty(),
                        $("textarea", a)
                            .val("")
                            .last()
                            .attr("id", "message_" + e.id),
                        $("tr.bbcodes > td", a).empty(),
                        a.insertAfter($("div.memo_container").last()),
                        Memo.Memory.toggle[o] && $(".show_row, .edit_link, .edit_row, .submit_row, .bbcodes", $("#memo_" + e.id)).toggle(),
                        Memo.selectTab(e.id);
                }
            },
        }).then(res => this.createdMemoIds.push(res.id));
    },
    
    renameTab: function (title) {
        const memo = Memo.tabs[Memo.findTab(Memo.selectedTab)];
        memo.title = title;

        if (memo.title && memo.length > 16) {
            UI.ErrorMessage(Memo.messages.tabNameLength, this.MSG_DURATION);
        }
        else if (title.length == 0) {
            UI.ErrorMessage(Memo.messages.tabNameEmpty, this.MSG_DURATION);
        }
        else {
            return $.ajax({
                url: $("#rename_tab_url").val(),
                type: "POST",
                dataType: "json",
                data: { id: memo.id, newTitle: memo.title },
                success: function (e) {
                    e.title && ((Memo.tabs[Memo.findTab(Memo.selectedTab)].title = e.title), Memo.selectTab()), Dialog.close();
                }
            });
        }
    },

    setContent: function (content) {
        document.querySelector(`#message_${Memo.selectedTab}`).value = content;
        const form = document.querySelector(`#memo_${Memo.selectedTab} form`);
        const requestData = {memo: form.elements.memo.value, tab_id: form.elements.tab_id.value, h: form.elements.h.value};

        return $.ajax(form.action, {method: 'POST', data: requestData})
            .then((res, status) => {
                if (status !== 'success') {
                    UI.ErrorMessage('Nie udało się utworzyć rozpiski.', this.MSG_DURATION);
                }
            });
    },

    splitSchedule: function (schedule) {
        if (schedule instanceof Array === false)
            return null;
        
        const newSchedule = [];
        const newLine = '\r\n';
        let memoText = '';

        schedule.forEach(order => {
            const orderText = order.join('');
            if (memoText.length + orderText.length + newLine.length > this.MAX_MEMO_SIZE) {
                newSchedule.push(memoText);
                memoText = '';
            }

            if (memoText !== '') memoText += newLine;
            memoText += orderText;
        });
        if (memoText !== '') newSchedule.push(memoText);

        return newSchedule;
    }
};

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

})();
