function format(str, ...values) {
  return str.replace(/{(\d+)}/g, function(match, index) {
    return typeof values[index] !== 'undefined' ? values[index] : match;
  });
}

let guessItem = `
            <div class="guess-item guess-name{3}">{0}</div>
            <div class="guess-item guess-distance{3}">{1}km</div>
            <div class="guess-item guess-direction{3}">{2}</div>
        `

function formatGuessItem(name, distance, direction, additionalClassList = "") {
    return format(guessItem, name, distance, direction, ` ${additionalClassList}`)
}

Object.defineProperty(String.prototype, 'capitalize', {
  value: function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  enumerable: false
});