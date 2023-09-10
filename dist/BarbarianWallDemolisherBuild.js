/**
 * BarbarianWallDemolisher.js v1.0
 * Szary (Plemiona: AGH Szary) and howcio
 * GitHub:      https://github.com/Szaroslav
 * Source code: https://github.com/Szaroslav/twscripts/tree/master/scripts/build/BarbarianWallDemolisher.js
 * 
 * Modified and extended script written by howcio.
 * Allows sending the demolishing attack commands
 * via rally point button in the Loot Assistant panel.
 * Script bases on the recent reports located in the Loot Assistant panel,
 * it evaluates or estimates level of the wall relying on 3 conditions:
 * - level of the wall spotted by scouts;
 * - partial losses (yellow dot);
 * - full losses (red dot).
 */
/******/(function(){// webpackBootstrap
var s={};(function(){const s={
// Base of the user customisable settings
baseSettings:{
// Hide all villages without built wall [true/false]
hideOthers:true,
// Hide a village after sending the command [true/false]
hideOnClick:true,
// Assumed level of the wall, if the attack suffered partial losses (yellow dot)
yellowDotWallLevel:1,
// Assumed level of the wall, if the attack suffered full losses (red dot)
redDotWallLevel:1,
// Templates of troops per wall level
templates:{1:{axes:10,scouts:1,lights:2,rams:2},2:{axes:10,scouts:1,lights:4,rams:4},3:{axes:10,scouts:1,lights:8,rams:8},4:{axes:15,scouts:1,lights:15,rams:10},5:{axes:25,scouts:1,lights:20,rams:15},6:{axes:0,scouts:0,lights:0,rams:0},7:{axes:0,scouts:0,lights:0,rams:0},8:{axes:0,scouts:0,lights:0,rams:0},9:{axes:0,scouts:0,lights:0,rams:0},10:{axes:0,scouts:0,lights:0,rams:0},11:{axes:0,scouts:0,lights:0,rams:0},12:{axes:0,scouts:0,lights:0,rams:0},13:{axes:0,scouts:0,lights:0,rams:0},14:{axes:0,scouts:0,lights:0,rams:0},15:{axes:0,scouts:0,lights:0,rams:0},16:{axes:0,scouts:0,lights:0,rams:0},17:{axes:0,scouts:0,lights:0,rams:0},18:{axes:0,scouts:0,lights:0,rams:0},19:{axes:0,scouts:0,lights:0,rams:0},20:{axes:0,scouts:0,lights:0,rams:0}}},settings:{},
//////////////////////////////////////////////////////////////////////////////
version:"v1.0",observer:null,activeRow:null,exec(){if(typeof userSettings!=="undefined"){this.initSettings(userSettings)}else{this.initSettings({})}if(game_data.screen==="am_farm"){if(this.settings.hideOnClick){this.observer=new MutationObserver(this.handleDocumentChange.bind(this));this.observer.observe(document,{childList:true,subtree:true})}const s=$("#plunder_list")[0].rows;for(let t=0;t<s.length;t++){this.handlePlunderRow(t,s[t])}}else{if(UI){UI.ErrorMessage("Nie jeste\u015b w panelu Asystenta Farmera",3e3,null,null)}}},initSettings(s){for(const t in this.baseSettings){this.settings[t]=s[t]?s[t]:this.baseSettings[t]}const t=this.baseSettings.templates;for(const s in t){if(!this.settings.templates[s]){this.settings.templates[s]=t[s]}}},handleDocumentChange(s,t){let e=$("#troop_confirm_submit")[0];if(e){const s=this.activeRow;e.onclick=()=>s.style.display="none"}const i=$("#popup_box_popup_command")[0];if(!i){this.activeRow=null}},handlePlunderRow(s,t){if(s<2){return}const e=t.cells[1].querySelector("img");let i=0;const a=Number(t.cells[6].innerHTML);if(a)i=Math.max(i,a);const l=/dots\/yellow\.[a-z]+$/.test(e.src);if(i===0&&l)i=this.settings.yellowDotWallLevel;const n=/dots\/red\.[a-z]+$/.test(e.src);if(i===0&&n)i=this.settings.redDotWallLevel;if(i>0){const s=this.settings.templates;const e={target_village_id:t.cells[11].getElementsByTagName("a")[0].href.split("target=")[1],from:"simulator",att_axe:s[i]["axes"],att_spy:s[i]["scouts"],att_light:s[i]["lights"],att_ram:s[i]["rams"]};const a=t.cells[11].getElementsByTagName("a")[0];a.removeAttribute("onclick");a.href+=$.param(e);a.onclick=this.handleCommandClick.bind(this,e,t)}else{if(this.settings.hideOthers){t.style.display="none"}}},handleCommandClick(s,t,e){if(!e.ctrlKey&&!e.shiftKey){e.preventDefault();CommandPopup.openRallyPoint(s)}if(this.settings.hideOnClick){this.activeRow=t}}};s.exec()})();
/******/})();