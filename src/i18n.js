var moment = require('moment');
var i18n = require('./i18n.csv');
//
// i18ndata = {
//   languages: ['', 'en','es',...],
//   dict: {
//     en: {
//       decsep: ',',
//       thousep: '.',
//       numregex: ...
//     }
//   }
// }
var language = 'en';
if (localStorage.language) 
  language = localStorage.language;
else if (navigator.language) 
  language = navigator.language.substring(0, 2);
else if (navigator.browserLanguage)
  language = navigator.browserLanguage.substring(0, 2);
if (language == "an" || language == "eu" || language == "gl") 
  language = "es";
else if (i18n.languages.indexOf(language) == -1) 
  language = "en";

var dict = i18n.dict[language];
var dsep = i18n.dict[language]['decsep'];
var tsep = i18n.dict[language]['thousep'];
console.log("I18N: language=" + language + " dsep=" + dsep + " tsep=" + tsep);

export function setLanguage(l) {
  if (i18n.languages.indexOf(l) != -1) {
    language = l;
    dict = i18n.dict[language];
    dsep = i18n.dict[language]['decsep'];
    tsep = i18n.dict[language]['thousep'];
    moment.locale(language);
    console.log("set language=" + l + " dsep=" + dsep + " tsep=" + tsep);
  } else {
    console.log("unsupported language: "+l);
  }
}
export function getLanguage() {
  return language;
}

String.prototype.translate = function() {
  var s = this.valueOf();
  if (dict[s]) return dict[s];
  console.log("*** UNTRANSLATED: '" + s + "'' (for " + language + ") ****");
  return s;
}
String.prototype.tr = function() {
  var s = this.valueOf();
  if (dict[s]) return dict[s];
  console.log("*** UNTRANSLATED: '" + s + "' (for " + language + ") ****");
  return s;
}
function translate(x, defaultvalue) {
  if (dict[x]) return dict[x];
  console.log("*************** UNTRANSLATED for " + language + ": '" + x + "' (" + defaultvalue + ")");
  return defaultvalue ? defaultvalue : x;
}
// addtranslations({ en: {'foo':'foo'}, es: {'foo':'efoo'}});
function addTranslations(hash) {
  for (var lang in hash) {
    var globaldict = i18n.dict[lang];
    var localdict = dict[lang];
    for (var key in localdict) {
      if (globaldict[key] && globaldict[key] != localdict[key]) {
        console.log("****************** TRANSLATION CONFLICT: addtranslation says '"+localdict[key]+"' for key '"+key+"', but global says '"+globaldict[key]+"'");
      }
      globaldict[key] = localdict[key];
    }
  }
}
export function getRegex() {
  return i18n.dict[language].numregex;
}
export function getDecimalSeparator() {
  return dsep;
}
export function getThousandSeparator() {
  return tsep;
}

export function parseNumber(s) {
  var t = '';
  for (var i = 0; i < s.length; i++)
    if (s[i] != tsep)
      t += s[i];
  console.log("parseNumber: " + t);
  if (t == '' || t == dsep) return 0;
  return parseFloat(t);
}

function formatNumber_(n, decimals, zero) {
  if (n == 0 && zero) return zero;
  let s = n.toString();
  let a = s.split('.');
  if (a.length == 0) return '';
  let l = a[0].length;
  var r = '';
  for (var i = 0; i < l; i++) {
    let b = l - i;
    if (b % 3 == 0 && i != 0)
      r += tsep;
    r += a[0][i];
  }
  if (a.length > 1) {
    if (typeof decimals == 'number') {
      if (decimals > 0) {
        r += dsep;
        var p = a[1].substring(0, decimals);
        while (p.length < decimals) p += '0';
        r += p;
      }
    } else {
      r += dsep;
      r += a[1];
    }
  }
  return r;
}
export function formatNumber(n, decimals, zero) {
  // because formatNumber encloses dsep/tsep, we'll enclose
  // formatNumber_ instead to be able to handle language changes
  return formatNumber_(n, decimals, zero);
}
export function formatPercent(n, decimals, zero) {
  // because formatNumber encloses dsep/tsep, we'll enclose
  // formatNumber_ instead to be able to handle language changes
  return formatNumber_(100 * n, decimals, zero) + '%';
}

export function utc2local(s) {
  var d = new Date(s + " UTC");
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toJSON();
}

export function formatDateTime(s) {
  if (!s) return '-';
  if (s.length < 19) return s;
  //2017-02-10T15:41:49.000Z
  //2017-03-10 15:21:00
  //1234567890123456789
  //let d = s.substring(0, 10);
  let y = s.substring(0, 4);
  let m = s.substring(5, 7);
  let d = s.substring(8, 10);
  let t = s.substring(11, 19);
  return d + '-' + m + '-' + y + ' ' + t;
}

export function formatDate(s) {
  if (!s) return '-';
  if (s.length != 24) return s;
  //2017-02-10T15:41:49.000Z
  //let d = s.substring(0, 10);
  let y = s.substring(0, 4);
  let m = s.substring(5, 7);
  let d = s.substring(8, 10);
  return d + '-' + m + '-' + y;
}

export function formatDateTimeUTC(s, fmt="DD/MM/YYYY HH:mm:ss") {
  if (!s) return '-';
  if (s.length < 19) return s;
  var m = moment.utc(s)
  return m.local().format(fmt)
}

export function formatDateUTC(s, fmt="DD/MM/YYYY") {
  if (!s) return '-';
  if (s.length < 19) return s;
  var m = moment.utc(s)
  return m.local().format(fmt)
}

