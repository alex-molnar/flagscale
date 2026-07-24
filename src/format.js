function format(str, ...values) {
  return str.replace(/{(\d+)}/g, function(match, index) {
    return typeof values[index] !== 'undefined' ? values[index] : match;
  });
}

let guessItem = `
            <div class="guess-item guess-name">{0}</div>
            <div class="guess-item guess-distance">{1}km</div>
            <div class="guess-item guess-direction">{2}</div>
        `

function formatGuessItem(name, distance, direction) {
    return format(guessItem, name, distance, direction)
}