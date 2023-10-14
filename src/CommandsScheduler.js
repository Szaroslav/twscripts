if (!$("#planer_klinow").length) {
  var konfiguracja = konfiguracjaSwiata();

  var dane = {
    predkosc_gry: Number($(konfiguracja).find("config speed").text()),
    predkosc_jednostek: Number($(konfiguracja).find("config unit_speed").text()),
    lucznicy: Number($(konfiguracja).find("game archer").text()),
    rycerz: Number($(konfiguracja).find("game knight").text()),
    linkDoWojska: "/game.php?&village=" + game_data.village.id + "&type=own_home&mode=units&group=0&page=-1&screen=overview_villages",
    linkDoPrzegladuWioski: "/game.php?",
    linkDorozkazu: "/game.php?",
    predkosci: [18, 22, 18, 9, 10, 11, 30, 30, 10, 35],
    nazwyWojsk: ["Pikinier", "Miecznik", "Topornik", "Zwiadowca", "LK", "CK", "Taran", "Katapulta", "Rycerz", "Szlachcic"]
  };

  var pobieram = true;
  var pobraneGrupy = false;
  var sort_malejaco = true;
  var img_wojsk = image_base + "unit/";
  var minimalna_ilosc_wojsk = [];
  var czasWyjscia = [];
  var omijane = [];
  var id = [];
  var wojska = [];
  var mojeWioski = [];
  var nazwyWiosek = [];
  var pokazWies = [];
  var tabelkaBB = [];
  var obrazki = "spear,sword,axe,spy,light,heavy,ram,catapult,knight,snob".split(",");
  var aktywneJednostki = ("111" + (dane.rycerz ? "10" : "0")).split("");

  if (!dane.rycerz) {
    dane.predkosci.splice(obrazki.indexOf("knight"), 1);
    dane.nazwyWojsk.splice(obrazki.indexOf("knight"), 1);
    obrazki.splice(obrazki.indexOf("knight"), 1);
  }
  ciacho = getCookie("atkjed");
  if (ciacho != "") {
    aktywneJednostki = parseInt(ciacho, 36).toString(2).split("");
    while (aktywneJednostki.length < dane.predkosci.length) aktywneJednostki.splice(0, 0, "0");
  }
  var t = $('#serverTime').html().match(/\d+/g);
  var d = $('#serverDate').html().match(/\d+/g);
  var obecnyCzas = new Date(d[2], d[1] - 1, d[0], t[0], t[1], t[2]);
  if (game_data.player.sitter != 0) {
    dane.linkDoWojska = "/game.php?t=" + game_data.player.id + "&village=" + game_data.village.id + "&type=own_home&mode=units&group=0&page=-1&screen=overview_villages";
    dane.linkDoPrzegladuWioski += "t=" + game_data.player.id + "&village=" + game_data.village.id + "&screen=info_village&id=";
    dane.linkDorozkazu += "t=" + game_data.player.id + "&village=";
  } else {
    dane.linkDoPrzegladuWioski += "village=" + game_data.village.id + "&screen=info_village&id=";
    dane.linkDorozkazu += "village=";
  }
  var wszystkieWojska = dane.linkDoWojska;
  var predkosc_swiata = Number((dane.predkosc_gry * dane.predkosc_jednostek).toFixed(5));
  for (i = 0; i < dane.predkosci.length; i++) {
    minimalna_ilosc_wojsk[i] = 0;
    dane.predkosci[i] /= predkosc_swiata;
  }
  rysujPlaner();
  pobierzDane();
} else
  $("#planer_klinow").remove();
void 0;

function wypiszMozliwosci() {
  if (pobieram) {
    $("#ladowanie").html("Czekaj, muszę pobrać...");
    setTimeout(wypiszMozliwosci, 500);
    return;
  }
  if ($("#wyborWojsk").is(":visible")) {
    zmienStrzalke();
    $("#wyborWojsk").hide();
    $("#lista_wojska").show();
    zapiszWybrane();
  }
  var html = [];
  var htmlTmp = [];

  var najwJednostka = -1;
  var cel = document.getElementById('wspolrzedneCelu').value.match(/\d+/g);
  var godzinaWejscia = document.getElementById('godzina_wejscia').value.match(/\d+/g);
  var dataWejscia = document.getElementById('data_wejscia').value.match(/\d+/g);

  $('#lista_wojska th').each(function(i) {
    if (i > dane.predkosci.length) return;
    if (i && $(this).hasClass("faded")) aktywneJednostki[i - 1] = "0";
    else if (i) aktywneJednostki[i - 1] = "1";
  });
  setCookie("atkjed", (parseInt(aktywneJednostki.join(""), 2).toString(36)), 360);
  var t = $('#serverTime').html().match(/\d+/g);
  var d = $('#serverDate').html().match(/\d+/g);
  var obecnyCzas = new Date(d[2], d[1] - 1, d[0], t[0], t[1], t[2]);
  var czasWejscia = new Date(dataWejscia[2], dataWejscia[1] - 1, dataWejscia[0], godzinaWejscia[0], godzinaWejscia[1], godzinaWejscia[2]);
  var roznicaSekund = (czasWejscia - obecnyCzas) / 1000;

  var ilosc_wiosek = 0;
  for (i = 0; i < mojeWioski.length; i++) {
    if (!pokazWies[i]) continue;
    htmlTmp[i] = "<tr><td><a href=" + dane.linkDoPrzegladuWioski + id[i] + ">" + nazwyWiosek[i].replace(/\s+/g, "\u00A0"); + "</a>";
    najwolniejsza = 0;
    mozliwewojska = "&from=simulator";

    for (j = 0; j < dane.predkosci.length; j++) {
      if (aktywneJednostki[j] == "0" || wojska[i][j] < 1) {

        htmlTmp[i] += "<td class='hidden'>" + wojska[i][j];
        //mozliwewojska += "&att_"+obrazki[j]+"="+0;
        continue;
      }
      a = Math.abs(Number(cel[0]) - mojeWioski[i][mojeWioski[i].length - 3]);
      b = Math.abs(Number(cel[1]) - mojeWioski[i][mojeWioski[i].length - 2]);
      czasPrzejscia = Math.sqrt((a * a) + (b * b)) * dane.predkosci[j] * 60;

      if (czasPrzejscia <= roznicaSekund) {
        if (czasPrzejscia > najwolniejsza) {
          najwolniejsza = czasPrzejscia;
          najwJednostka = j;
        }
        mozliwewojska += "&att_" + obrazki[j] + "=" + wojska[i][j];
        htmlTmp[i] += "<td style='background-color: #C3FFA5;'>" + wojska[i][j];
      } else {
        //mozliwewojska += "&att_"+obrazki[j]+"="+0;
        htmlTmp[i] += "<td>" + wojska[i][j];
      }
    }
    if (najwolniejsza != 0) {
      tmp = new Date(czasWejscia);
      tmp.setSeconds(tmp.getSeconds() - najwolniejsza);
      czasWyjscia[ilosc_wiosek] = new Date(tmp);
      ddd = tmp.getDate() + "." + (tmp.getMonth() + 1) + "\u00A0" + tmp.getHours() + ":" + tmp.getMinutes() + ":" + tmp.getSeconds();
      html[ilosc_wiosek] = htmlTmp[i] + "<td>" + ddd + "<td>" + 0 + "<td><a href='" + dane.linkDorozkazu + id[i] + "&screen=place&x=" + cel[0] + "&y=" + cel[1] + mozliwewojska + "'>Wykonaj</a>";
      tabelkaBB[ilosc_wiosek] = "[*]" + dane.nazwyWojsk[najwJednostka] + "[|] " + mojeWioski[i][mojeWioski[i].length - 3] + "|" + mojeWioski[i][mojeWioski[i].length - 2] + " [|] " + cel[0] + "|" + cel[1] + " [|] " + ddd + " [|] [url=https://" + document.URL.split("/")[2] + dane.linkDorozkazu + id[i] + "&screen=place&x=" + cel[0] + "&y=" + cel[1] + mozliwewojska + "]Wykonaj\n";
      ilosc_wiosek++;
    } else {
      htmlTmp[i] = "";
    }
  }
  if (ilosc_wiosek == 0) UI.InfoMessage('Nie zmieszczę żadnego rozkazu w podany termin :( ', 1500, 'error');
  $("#ilosc_mozliwosci").html("<b>" + ilosc_wiosek + "/" + mojeWioski.length + "</b>");

  for (i = 0; i < html.length - 1; i++) {
    min = i;
    for (j = i + 1; j < html.length; j++)
      if (czasWyjscia[min] > czasWyjscia[j])
        min = j;

    tmp = html[min];
    html[min] = html[i];
    html[i] = tmp;
    tmp = czasWyjscia[min];
    czasWyjscia[min] = czasWyjscia[i];
    czasWyjscia[i] = tmp;
    tmp = tabelkaBB[min];
    tabelkaBB[min] = tabelkaBB[i];
    tabelkaBB[i] = tmp;
  }
  tabelkaBB.splice(ilosc_wiosek, tabelkaBB.length - ilosc_wiosek);
  $('#lista_wojska tbody').html(html.join("\n") + (ilosc_wiosek ? "<tr><td id='export_bb' colspan=" + (dane.predkosci.length + 4) + "><a href='#' onclick=\"$('#export_bb').html('<textarea cols=100 rows=2 onclick=\\'this.select()\\'>[table][**]Jednostka[||]Źródło[||]Cel[||]Czas wyjścia[||]Rozkaz[/**]\\n'+tabelkaBB.join('')+'[/table]</textarea>');\" ><img src='" + image_base + "igm/export.png' > Eksportuj rozpiskę</a>" : ''));
  $('#lista_wojska tbody tr').each(function(i) {
    $(this).addClass(i % 2 ? "row_a" : "row_b");
  });
  $("#ladowanie").html("");
  odliczaj();
}

function odliczaj() {
  var t = $('#serverTime').html().match(/\d+/g);
  var d = $('#serverDate').html().match(/\d+/g);
  var obecnyCzas = new Date(d[2], d[1] - 1, d[0], t[0], t[1], t[2]);

  $('#lista_wojska tbody>tr').each(function(i) {
    roznicaSekund = (czasWyjscia[i] - obecnyCzas) / 1000;
    if (roznicaSekund > 60) $(this).find("td").eq(dane.predkosci.length + 2).html(formatujCzas(roznicaSekund));
    else $(this).find("td").eq(dane.predkosci.length + 2).html("<font color='red'>" + roznicaSekund + "</font>");
  });

  setTimeout(odliczaj, 1000);
}

function formatujCzas(s) {
  var h = Math.floor(s / 3600);
  s = s - h * 3600;
  var m = Math.floor(s / 60);
  s = s - m * 60;
  return (h) + ":" + (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
}

function zmienGrupe() {
  $("#ladowanie").html("<img src='" + image_base + "throbber.gif' />");
  wojska = [];
  id = [];
  mojeWioski = [];
  nazwyWiosek = [];
  dane.linkDoWojska = document.getElementById('listGrup').value;
  pobierzDane();
}

function zaznaczWszystko(source) {
  checkboxes = document.getElementsByName('wybierz');
  for (var i = 0, n = checkboxes.length; i < n; i++) {
    checkboxes[i].checked = source.checked;
  }
}

function ustaw_min(n) {
  el = document.getElementById("wyborWojsk");
  el = el.getElementsByTagName("input");
  for (i = 0; i < dane.predkosci.length; i++) {
    el[i].value = n;
    minimalna_ilosc_wojsk[i] = n;
  }
}

function chowaj_wojska(ktory, ile) {
  ile = Number(ile);
  minimalna_ilosc_wojsk[ktory] = ile;
  $("#wyborWojsk tr:has(td)").each(function(i) {
    tt = 0;
    if ($(this).find("td").eq(ktory + 1).text() < ile) {
      $(this).hide();
      $(this).find("input").prop('checked', false);
    } else
      for (j = 0; j < minimalna_ilosc_wojsk.length; j++)
        if ($(this).find("td").eq(j + 1).text() >= minimalna_ilosc_wojsk[j])
          tt++;
    if (tt == dane.predkosci.length) {
      $(this).show();
      $(this).find("input").prop('checked', true);
    } else {
      $(this).hide();
      $(this).find("input").prop('checked', false);
    }
  });
}

function sortowanie_przegladu(ktory) {
  ktory++;
  var zaznaczone = [];
  var tabela = document.getElementById("wyborWojsk");
  if (x = tabela.rows[1].cells[ktory].getElementsByTagName("img")[!ktory || ktory == (dane.predkosci.length + 1) ? 0 : 1]) {
    x.src = sort_malejaco ? image_base + "list-up.png" : image_base + "list-down.png";
    sort_malejaco = sort_malejaco ? false : true;
  } else {
    tabela.rows[1].cells[ktory].innerHTML += "<img src='" + image_base + "list-down.png' >";
    sort_malejaco = true;
  }
  for (i = 0; i < tabela.rows[1].cells.length; i++) {
    if (i == ktory) continue;
    if (x = tabela.rows[1].cells[i].getElementsByTagName("img")[!i || i == (dane.predkosci.length + 1) ? 0 : 1])
      x.remove();
  }

  $('[name="wybierz"]').each(function() {
    zaznaczone.push($(this).is(':checked'));
  });
  for (i = 2; i < tabela.rows.length - 1; i++) {
    if (tabela.rows[i].style.display == "none") continue;
    min = i;
    for (j = i + 1; j < tabela.rows.length; j++) {
      if (tabela.rows[j].style.display == "none") continue;
      if (ktory == 0)
        if (tabela.rows[sort_malejaco ? j : min].cells[ktory].textContent > tabela.rows[sort_malejaco ? min : j].cells[ktory].textContent)
          min = j;
      if (Number(tabela.rows[sort_malejaco ? j : min].cells[ktory].textContent) > Number(tabela.rows[sort_malejaco ? min : j].cells[ktory].textContent))
        min = j;
    }
    tmp = tabela.rows[min].innerHTML;
    tabela.rows[min].innerHTML = tabela.rows[i].innerHTML;
    tabela.rows[i].innerHTML = tmp;
    tmp2 = zaznaczone[i - 2];
    zaznaczone[i - 2] = zaznaczone[min - 2];
    zaznaczone[min - 2] = tmp2;
  }
  $('[name="wybierz"]').each(function(i) {
    $(this).prop('checked', zaznaczone[i]);
  });
}

function wybieranieWiosek() {
  var wiersz;

  okienko = "<tr><th style=\"cursor:pointer;\" onclick=\"ustaw_min(0); $('#wyborWojsk tr:has(td)').each(function(i){$(this).show();}); \">Minimalna\u00A0ilość\u00A0wojsk:";
  for (i = 0; i < dane.predkosci.length; i++)
    okienko += "<th><input onchange=\"chowaj_wojska(" + i + ",this.value);\" type='text' value=" + minimalna_ilosc_wojsk[i] + " size='1'>";

  okienko += "<th colspan=2><tr><th style=\"cursor:pointer;\" onclick=\"sortowanie_przegladu(" + (-1) + ");\" ><span class='icon header village' ></span>";
  for (i = 0; i < obrazki.length; i++) {
    okienko += "<th style=\"cursor:pointer;\" onclick=\"sortowanie_przegladu(" + i + ");\" ><img src='" + img_wojsk + "unit_" + obrazki[i] + ".png'>";
  }
  okienko += "<th style=\"cursor:pointer;\" onclick=\"sortowanie_przegladu(" + (obrazki.length) + ");\" >Odl<th><input type='checkbox' onClick='zaznaczWszystko(this)'\" >";
  for (i = 0; i < wojska.length; i++) {
    ukryty = false;
    komorki = "<a href=" + dane.linkDoPrzegladuWioski + id[i] + ">" + nazwyWiosek[i].replace(/\s+/g, "\u00A0") + "</a>";
    for (j = 0; j < obrazki.length; j++) {
      komorki += "<td>" + wojska[i][j];
      if (!ukryty && wojska[i][j] < minimalna_ilosc_wojsk[i]) ukryty = true;
    }
    if (!ukryty) wiersz = "<tr class='" + (i % 2 ? 'row_a' : 'row_b') + "'><td>";
    else wiersz = "<tr class='" + (i % 2 ? 'row_a' : 'row_b') + "' style=\"display: none;\"><td>";
    okienko += wiersz + komorki;

    okienko += "<td><td><input name='wybierz' type='checkbox' " + (pokazWies[i] ? 'checked' : "disabled") + ">";
  }
  $('#wyborWojsk').html(okienko);
  pokazOdleglosc();
}

function pokazOdleglosc() {
  document.getElementById('wspolrzedneCelu').value = document.getElementById('wspolrzedneCelu').value.match(/\d+\|\d+/);
  var cel = document.getElementById('wspolrzedneCelu').value.match(/\d+/g);
  $("#wyborWojsk tr:has(td) td:nth-child(" + (dane.predkosci.length + 2) + ")").each(function(i) {
    a = Math.abs(Number(cel[0]) - mojeWioski[i][mojeWioski[i].length - 3]);
    b = Math.abs(Number(cel[1]) - mojeWioski[i][mojeWioski[i].length - 2]);
    $(this).html(Number((Math.sqrt((a * a) + (b * b))).toFixed(1)));
  });
}

function zapiszWybrane() {
  $('#wyborWojsk input:checkbox').each(function(i) {
    if (i)
      pokazWies[i - 1] = $(this).is(':checked');
  });
  $('#wyborWojsk').hide();
  $("#lista_wojska").show();
}

function zmienStrzalke() {
  if ($("#strzaleczka").hasClass('arr_down')) {
    $("#strzaleczka").removeClass('arr_down');
    $("#strzaleczka").addClass('arr_up');
  } else {
    $("#strzaleczka").removeClass('arr_up');
    $("#strzaleczka").addClass('arr_down');
  };
}

function rysujPlaner() {
  var cel = game_data.village.x + "|" + game_data.village.y;
  if (game_data.screen == "info_village") {
    if (!mobile) {
      var tabela = document.getElementById("content_value").getElementsByClassName('vis')[0];
      tabela.getElementsByTagName("table")[0];
      cel = tabela.rows[2].cells[1].textContent;
    } else {
      tabela = document.getElementsByClassName('mobileKeyValue')[0].getElementsByTagName("div")[0];
      cel = tabela.textContent.match(/\d+\|\d+/);
    }
  }
  var pobralemCzas = false;
  if ($(".no_ignored_command").length)
    $(".no_ignored_command").each(function(i) {
      if (x = $(this).html().match("snob.png") && !pobralemCzas) {
        czas_wejscia_grubego = $(this).find("td:eq(2)").text().match(/\d+/g);
        obecnyCzas.setSeconds(obecnyCzas.getSeconds() + Number(czas_wejscia_grubego[2]) + (60 * Number(czas_wejscia_grubego[1])) + (3600 * Number(czas_wejscia_grubego[0])));
        pobralemCzas = true;
        return;
      }
    });
  var elem = `
    <div id="planer_klinow" class="vis vis_item" style="overflow: auto; height: 300px;">
      <table width="100%">
        <tr>
          <td width="300">
            <table style="border-spacing: 3px; border-collapse: separate;">
              <tr>
                <th>Cel</th>
                <th>Data</th>
                <th>Godzina</th>
                <th>Grupa</th>
                <th></th>
                <th></th>
              </tr>
              <tr>
                <td>
                  <input id="wspolrzedneCelu" size=8 type="text" onchange="pokazOdleglosc();" value="${cel}">
                </td>
                <td>
                  <input
                    id="data_wejscia"
                    size=8
                    type="text"
                    value="${obecnyCzas.getDate()}.${obecnyCzas.getMonth() + 1}.${obecnyCzas.getFullYear()}"
                    onchange="poprawDate(this, ".");"
                  >
                </td>
                <td>
                  <input
                    id="godzina_wejscia"
                    size=8
                    type="text"
                    value="${obecnyCzas.getHours()}:${obecnyCzas.getMinutes()}:${obecnyCzas.getSeconds()}"
                    onchange="poprawDate(this, ":");"
                  >
                </td>
                <td>
                  <select id="listGrup" onchange="zmienGrupe();">
                    <option value="${wszystkieWojska}">Wszystkie</option>
                  </select>
                </td>
                <td onclick="
                  zmienStrzalke();
                  if($("#wyborWojsk").is(":visible")) {
                    $("#wyborWojsk").hide();
                    $("#lista_wojska").show();
                    zapiszWybrane();
                    return;
                  }
                  else {
                    $("#lista_wojska").hide();
                    $("#wyborWojsk").show();
                  }
                "
                  style="cursor: pointer"
                >
                  <span id="strzaleczka" class="icon header arr_down" ></span>
                </td>
                <td>
                  <input id="przycisk" type="button" class="btn" value="Oblicz" onclick="wypiszMozliwosci();">
              </table>
            <td id="ladowanie">
              <img src="${image_base}throbber.gif">
  `;
  elem += "<tr><td colspan=2 width='100%'><table style=\"display: none; border-spacing: 3px; border-collapse: separate;\" id='wyborWojsk' width='100%'></table><table style=\"border-spacing: 3px; border-collapse: separate;\" id='lista_wojska' width='100%'><thead><tr><th id='ilosc_mozliwosci'><span class='icon header village' ></span>";

  for (i = 0; i < obrazki.length; i++)
    elem += "<th style=\"cursor:pointer;\" class='" + (aktywneJednostki[i] == "0" ? "faded" : "") + "' onClick=\"if(this.className == 'faded') this.className=''; else this.className='faded';\"><img title='" + dane.nazwyWojsk[i] + "' src='" + img_wojsk + "unit_" + obrazki[i] + ".png'>";
  elem += "<th>Czas\u00A0wyjścia<th><span class=\'icon header time\'><th><b>Rozkaz</b></thead>";
  elem += "<tbody></table></table></div>";
  $(mobile ? "#mobileContent" : "#contentContainer").prepend(elem);
}

function poprawDate(elem, sep) {
  x = elem.value.match(/\d+/g);
  elem.value = x[0] + sep + x[1] + sep + x[2];
}

function pobierzDane() {
  pobieram = true;
  var r;
  r = new XMLHttpRequest();
  r.open('GET', dane.linkDoWojska, true);

  function processResponse() {
    if (r.readyState == 4 && r.status == 200) {
      requestedBody = document.createElement("body");
      requestedBody.innerHTML = r.responseText;
      var tabela = $(requestedBody).find('#units_table').get()[0];

      var grupy = $(requestedBody).find('.vis_item').get()[0].getElementsByTagName(mobile ? 'option' : 'a');
      if (!tabela) {
        $("#ladowanie").html("W\u00A0wybranej\u00A0grupie nie\u00A0ma\u00A0wiosek\u00A0:/ Wybierz\u00A0inną");
        pobieram = false;
        return;
      }
      for (i = 1; i < tabela.rows.length; i++) {
        pokazWies[i - 1] = true;
        wojska[i - 1] = [];
        pustaWioska = 0;
        for (j = 2; j < tabela.rows[i].cells.length - 1; j++) {
          wojska[i - 1].push(tabela.rows[i].cells[j].textContent);
          if (!Number(wojska[i - 1][j - 2])) pustaWioska++;
        }
        if (pustaWioska > dane.predkosci.length) pokazWies[i - 1] = false;
        id.push(tabela.rows[i].cells[0].getElementsByTagName('span')[0].getAttribute("data-id"));
        mojeWioski.push(tabela.rows[i].cells[0].getElementsByTagName('span')[2].textContent.match(/\d+/g));
        nazwyWiosek.push(tabela.rows[i].cells[0].getElementsByTagName('span')[2].textContent);
      }
      wybieranieWiosek();
      if (pobraneGrupy && $('#lista_wojska').is(':visible')) wypiszMozliwosci();
      if (!pobraneGrupy) {
        for (i = 0; i < grupy.length; i++) {
          nazwa = grupy[i].textContent;
          if (mobile && grupy[i].textContent == "wszystkie") continue;
          $("#listGrup").append($('<option>', {
            value: grupy[i].getAttribute(mobile ? "value" : "href") + "&page=-1",
            text: mobile ? nazwa : nazwa.slice(1, nazwa.length - 1)
          }));
        }

        pobraneGrupy = true;
      }

      $("#ladowanie").html("");
      pobieram = false;
    };
  }
  r.onreadystatechange = processResponse;
  r.send(null);
}

function konfiguracjaSwiata() {
  var dt;
  $.ajax({
    'async': false,
    'url': '/interface.php?func=get_config',
    'dataType': 'xml',
    'success': function(data) {
      dt = data;
    }
  });
  return dt;
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1);
    if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
  }
  return "";
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toGMTString();
  if (exdays == 0) expires = "";
  document.cookie = cname + "=" + cvalue + "; " + expires;
}
