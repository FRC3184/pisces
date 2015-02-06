function getPageArgs() {
  if (!(location.hash) || !(location.hash.indexOf("?"))) {
    return {};
  }
  var argsUnsplit = location.hash.substring(location.hash.indexOf("?") + 1);
  var pairs = argsUnsplit.split("&");
  var args = {};
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split('=');
      if (pair.length === 2) {
        if (pair[0].length >= 1 & pair[1].length >= 1) {
        args[pair[0]] = pair[1];
      }
    } 
  }
  return args;
}
function sortObject(obj) {
    var arr = [];
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            arr.push({
                'key': prop,
                'value': obj[prop]
            });
        }
    }
    arr.sort(function(a, b) { return b.value - a.value; });
    //arr.sort(function(a, b) { a.value.toLowerCase().localeCompare(b.value.toLowerCase()); }); //use this to sort as strings
    return arr; // returns array
}