/**
 * Memo.js v0.8
 * Szary (Plemiona: AGH Szary)
 * GitHub: https://github.com/Szaroslav
 */

function Memo(external) {
    this.maxMemoSize   = typeof char_limit === "number" ? char_limit : 6e4;
    this.msgDurationMs = 1400;

    this.external       = external;
    this.tabs           = external.tabs;
    this.maxNoTabs      = external.max_tabs;
    this.isMobile       = external.mobile;

    this.create = async function (schedule) {
        const contents = this.splitSchedule(schedule);

        if (contents === null) {
            UI.ErrorMessage("Nie udało się utworzyć rozpiski.", this.msgDurationMs);
            return;
        }
        UI.SuccessMessage("Tworzę rozpiskę, może to zająć kilka sekund.", this.msgDurationMs);

        const noAlreadyExistingMemos = this.tabs.length;

        for (let i = 0; i < contents.length; i++) {
            const tab = await this.addTab();
            await this.renameTab(tab.id, `Rozpiska [${i + 1}]`);
            await this.setContent(contents[i]);
        }

        this.external.selectTab(this.tabs[noAlreadyExistingMemos].id);
        UI.SuccessMessage(
            "Rozpiska została utworzona. Odświeżam stronę.", this.msgDurationMs);
        setTimeout(() => location.reload(), this.msgDurationMs + 600);
    };

    this.getSchedule = function (scheduleText, format) {
        if (format === "text") {
            return scheduleText
                .split("\n")
                .filter(line => line !== "")
                .filter(line => /^[0-9]+./.test(line)
                    || /^\[b\][0-9]{4}-[0-9]{2}-[0-9]{2}/.test(line)
                    || /Wyślij \w+\[\/url]$/.test(line))
                .map(line => line + "\r\n");
        }
        else if (format === "table") {
          // TODO
        }
    };

    this.addTab = function () {
        const handleResponse = (function (response, deferred) {
            if (!response || !response.id) {
                return;
            }
            if (this.tabs.push(response) >= this.maxNoTabs) {
                $("#memo-add-tab-button").hide();
            }
            if ($("div.memo-tab").length === 0) {
                location.reload();
                return;
            }

            const memoTab = $("div.memo-tab").first().clone();
            this.external.editTabElement(memoTab, response.id, response.title, true);
            memoTab.appendTo($("#tab-bar"));
            $(".memo-tab-button-close").show();

            const memoContainer = $("div.memo_container").first().clone(),
                  memoId        = memoContainer.attr("id").substr(5);

            memoContainer.attr("id", "memo_" + response.id);
            $("input[name=\"tab_id\"]", memoContainer).val(response.id);
            $("tr.show_row > td", memoContainer).empty();
            $("textarea", memoContainer)
                .val("")
                .last()
                .attr("id", "message_" + response.id);
            $("tr.bbcodes > td", memoContainer).empty();
            memoContainer.insertAfter($("div.memo_container").last());

            if (this.external.Memory.toggle[memoId]) {
                const selectorOfMemoElements
                    = ".show_row, .edit_link, .edit_row, .submit_row, .bbcodes";
                $(selectorOfMemoElements, $("#memo_" + response.id)).toggle();
            }

            this.external.selectTab(response.id);

            deferred.resolve(response);
        }).bind(this);


        return $.Deferred(deferred => {
            const external = this.external;

            if (this.tabs.length >= this.maxNoTabs) {
                UI.ErrorMessage(s(
                    _("3531dec6f954a7d15f46b4cf644c5bfe"),
                    this.tabs.length
                ));
                deferred.reject();
            }

            TribalWars.post(
                "memo",
                { ajaxaction: "add_tab" },
                {},
                response => handleResponse(response, deferred)
            );

            if (this.isMobile) {
                external.checkArrow(this.tabs.length);
            }
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
            url:      $("#rename_tab_url").val(),
            type:     "POST",
            dataType: "json",
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

        return $.ajax(requestUrl, { method: "POST", data: requestData })
            .then(((_, status) => {
                if (status !== "success") {
                    UI.ErrorMessage(
                        "Nie udało się utworzyć rozpiski.", this.msgDurationMs);
                    throw new Error();
                }
            }).bind(this));

    };

    this.splitSchedule = function (schedule) {
        if (schedule instanceof Array === false)
            return null;

        const newSchedule = [];
        const newLine = "\r\n";
        let memoText = "";

        schedule.forEach(order => {
            const orderText = order.join("");
            if (memoText.length + orderText.length + newLine.length > this.maxMemoSize) {
                newSchedule.push(memoText);
                memoText = "";
            }

            if (memoText !== "") memoText += newLine;
            memoText += orderText;
        });
        if (memoText !== "") newSchedule.push(memoText);

        return newSchedule;
    };
};

export default Memo;
