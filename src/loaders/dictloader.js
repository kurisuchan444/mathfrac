module.exports = function(csv) {
  //const options = getOptions(this);
  var chars = csv.split(''), c = 0, cc = chars.length, start, end, table = [], row, rownum = 0;
  var result = {
    languages: [''],
    dict: {}
  }
  while (c < cc) {
    row = [];
    rownum++;
    while (c < cc && '\r' !== chars[c] && '\n' !== chars[c]) {
      start = end = c;
      if ('"' === chars[c]) {
        start = end = ++c;
        while (c < cc) {
          if ('"' === chars[c]) {
            if ('"' !== chars[c+1]) { break; }
            else { chars[++c] = ''; } // unescape ""
          }
          end = ++c;
        }
        if ('"' === chars[c]) { ++c; }
        while (c < cc && '\r' !== chars[c] && '\n' !== chars[c] && ',' !== chars[c]) { ++c; }
      } else {
        while (c < cc && '\r' !== chars[c] && '\n' !== chars[c] && ',' !== chars[c]) { end = ++c; }
      }
      row.push(chars.slice(start, end).join(''));
      if (',' === chars[c]) { ++c; }
    }
    if ('\r' === chars[c]) { ++c; }
    if ('\n' === chars[c]) { ++c; }
    if (rownum == 1) { 
      // First row has: Language, en, es, ...
      for (var i = 1; i < row.length; i++) {
        result.languages.push(row[i]);
        result.dict[row[i]] = {};
      }
    } else {
      var key = row[0];
      if (key.length > 0 && key[0] != '#') {
        for (var i = 1; i < row.length; i++) {
          var lang = result.languages[i];
          if (row[i] != '') {
            result.dict[result.languages[i]][key] = row[i];
          }
        }
      }
    }    
  }
  return `module.exports = ${ JSON.stringify(result) }`;
}
