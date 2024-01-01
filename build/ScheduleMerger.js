/**
 * ScheduleMerger.js v0.9.1
 * Szary (Plemiona: AGH Szary)
 * GitHub: https://github.com/Szaroslav
 *
 * Skrypt łączący kilka rozpisek z plemiona-planer.pl w jedną, sortujący od najwcześniejszych do najpóźniejszych rozkazów,
 * jeśli rozpiska jest zbyt duża, skrypt dzieli je na kilka notatek.
 * Dopuszczalne formaty rozpisek: tekst prosty, rozszerzony lub dla zastąpcy - skrypt aktualnie nie obsługuje tabel.
 */

(function () {
    'use strict';

    function Memo$1(external) {
        this.maxMemoSize   = typeof char_limit === 'number' ? char_limit : 6e4;
        this.msgDurationMs = 1400;

        this.external       = external;
        this.tabs           = external.tabs;
        this.maxNoTabs      = external.max_tabs;
        this.isMobile       = external.mobile;
        this.createdMemoIds = [];

        this.create = function (schedule) {
            const contents = this.splitSchedule(schedule);

            if (contents === null) {
                UI.ErrorMessage('Nie udało się utworzyć rozpiski.', this.msgDurationMs);
                return;
            }
            UI.SuccessMessage('Tworzę rozpiskę, może to zająć kilka sekund.', this.msgDurationMs);

            const noAlreadyExistingMemos = this.tabs.length;

            const deferreds = [];
            for (let i = 0; i < contents.length; i++) {
                deferreds.push(this.addTab()
                    .then(addedTab => this.renameTab(addedTab.id, `Rozpiska [${i + 1}]`))
                    .then(()       => this.setContent(contents[i]))
                );
            }

            $.when(...deferreds).done((() => {
                this.external.selectTab(this.tabs[noAlreadyExistingMemos].id);
                UI.SuccessMessage(
                    'Rozpiska została utworzona. Odświeżam stronę.', this.msgDurationMs);
                setTimeout(() => location.reload(), this.msgDurationMs + 600);
            }).bind(this));
        };

        this.getSchedule = function (scheduleText, format) {
            if (format === 'text') {
                return scheduleText
                    .split('\n')
                    .filter(line => line !== '')
                    .filter(line => /^[0-9]+./.test(line)
                        || /^\[b\][0-9]{4}-[0-9]{2}-[0-9]{2}/.test(line)
                        || /Wyślij \w+\[\/url]$/.test(line))
                    .map(line => line + '\r\n');
            }
        };

        this.addTab = function () {
            function handleResponse(response, deferred) {
                if (!response || !response.id) {
                    return;
                }
                if (this.tabs.push(response) >= this.maxNoTabs) {
                    $('#memo-add-tab-button').hide();
                }
                if ($('div.memo-tab').length === 0) {
                    location.reload();
                    return;
                }

                const memoTab = $('div.memo-tab').first().clone();
                this.external.editTabElement(memoTab, response.id, response.title, true);
                memoTab.appendTo($('#tab-bar'));
                $('.memo-tab-button-close').show();

                const memoContainer = $('div.memo_container').first().clone(),
                      memoId        = memoContainer.attr('id').substr(5);

                memoContainer.attr('id', 'memo_' + response.id);
                $('input[name="tab_id"]', memoContainer).val(response.id);
                $('tr.show_row > td', memoContainer).empty();
                $('textarea', memoContainer)
                    .val('')
                    .last()
                    .attr('id', 'message_' + response.id);
                $('tr.bbcodes > td', memoContainer).empty();
                memoContainer.insertAfter($('div.memo_container').last());

                if (this.external.Memory.toggle[memoId]) {
                    const selectorOfMemoElements
                        = '.show_row, .edit_link, .edit_row, .submit_row, .bbcodes';
                    $(selectorOfMemoElements, $('#memo_' + response.id)).toggle();
                }

                this.external.selectTab(response.id);

                deferred.resolve(response);
            }


            return $.Deferred(deferred => {
                const external = this.external;

                if (this.tabs.length >= this.maxNoTabs) {
                    UI.ErrorMessage(s(
                        _('3531dec6f954a7d15f46b4cf644c5bfe'),
                        this.tabs.length
                    ));
                    deferred.reject();
                }

                TribalWars.post(
                    'memo',
                    { ajaxaction: 'add_tab' },
                    {},
                    response => handleResponse.call(this, response, deferred)
                );

                if (this.isMobile) {
                    external.checkArrow(this.tabs.length);
                }
                // return ArrayUtils.last(this.external.tabs);
            });
        };

        this.renameTab = function (tabId, title) {
            const handleSuccess = (function (response) {
                const external = this.external;
                const title    = response.title;
                if (title) {
                    this.tabs[external.findTab(tabId)].title = title;
                    external.selectTab(tabId);
                }
            }).bind(this);

            return $.ajax({
                url:      $('#rename_tab_url').val(),
                type:     'POST',
                dataType: 'json',
                data: {
                    id:       tabId,
                    newTitle: title
                },
            })
                .done(handleSuccess);
        };

        this.setContent = function (content) {
            const selectedTab = this.external.selectedTab;

            $(`#message_${selectedTab}`).val(content);
            const form = $(`#memo_${selectedTab} form`)[0];
            const requestUrl = form.action;
            const requestData = {
                memo:   form.elements.memo.value,
                tab_id: form.elements.tab_id.value,
                h:      form.elements.h.value
            };

            return $.ajax(requestUrl, { method: 'POST', data: requestData })
                .then(((_, status) => {
                    if (status !== 'success') {
                        UI.ErrorMessage(
                            'Nie udało się utworzyć rozpiski.', this.msgDurationMs);
                        throw new Error();
                    }
                }).bind(this));

        };

        this.splitSchedule = function (schedule) {
            if (schedule instanceof Array === false)
                return null;

            const newSchedule = [];
            const newLine = '\r\n';
            let memoText = '';

            schedule.forEach(order => {
                const orderText = order.join('');
                if (memoText.length + orderText.length + newLine.length > this.maxMemoSize) {
                    newSchedule.push(memoText);
                    memoText = '';
                }

                if (memoText !== '') memoText += newLine;
                memoText += orderText;
            });
            if (memoText !== '') newSchedule.push(memoText);

            return newSchedule;
        };
    }

    (function () {

    const ScheduleMerger = {
        MSG_DURATION: 1400,
        memo: null,

        init: function () {
            console.log('%cScheduleMerger.js %cv0.9.1', 'display: inline-block; padding: 4px 0', 'display: inline-block; padding: 4px; background-color: #2151ae; color: white');
            console.log('Skrypt stworzony przez %cSzary %c(Plemiona: %cAGH Szary%c)', 'font-weight: bold', 'font-weight: normal', 'font-weight: bold', 'font-weight: normal');

            if (typeof Memo !== 'undefined') {
                this.memo = new Memo$1(Memo);
                this.MSG_DURATION = this.memo.msgDurationMs;

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
                const d = this.memo.getSchedule(memoElement.querySelector('textarea[name="memo"]').value, 'text');
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
            schedule.forEach((order, i) => order[0] = order[0].replace(/^[0-9]{1,}./, `${i + 1}.`));

            return schedule;
        }
    };

    ScheduleMerger.init();

    })();

})();
