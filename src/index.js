let gameTitle = "greyscale" // PARAM_GAME_TITLE
let alreadyGuessed = [] 
let currentDate = new Date().toJSON().slice(0, 10);
let todaysSolutionName = getRandomSolutionForToday()
let todaysSolution = solutionsData[todaysSolutionName]
let selectedSuggestionIndex = -1

function getRandomSolutionForToday() {
  let seed = parseInt(currentDate.replaceAll("-", ""));
  // LCG using GCC's constants
  m = 0x80000000; // 2**31;
  a = 1103515245;
  c = 12345;

  return solutions[Math.floor((((a * seed + c) % m) / m) * solutions.length)]
}

function getAlreadyGuessedToday() {
    if (localStorage.getItem(`${gameTitle}-${currentDate}`) != null) {
        alreadyGuessed = JSON.parse(localStorage.getItem(`${gameTitle}-${currentDate}`))
    } else {
        localStorage.clear()
        alreadyGuessed = []
        localStorage.setItem(`${gameTitle}-${currentDate}`, JSON.stringify(alreadyGuessed))
    }
}

function loadGame() {
    getAlreadyGuessedToday()
    alreadyGuessed
        .filter(guess => guess !== todaysSolutionName)
        .forEach((guess, index) => displayNewGuessRow(guess, index + 1))
    if (alreadyGuessed.includes(todaysSolutionName)) {
        // displayWinningGuessRow()
        console.log("You already guessed the solution today!")
    } else {
        let guessInput = document.getElementById("guess-input")
        guessInput.addEventListener("input", searchForSolution)
        guessInput.addEventListener("keydown", handleKeyboardNavigation)
        // guessInput.addEventListener("keypress", (e) => {
        //     if (e.key === "Enter") {
        //         submitGuess(e)
        //     }
        // })
        guessInput.addEventListener("blur", () => {
            setTimeout(hideSuggestions, 150) // Delay to allow click on suggestion
        })
        guessInput.focus()
        guessInput.select()
        // document.getElementById("submit-button").addEventListener("click", submitGuess)
        document.getElementById("flag-image").src = `assets/grayscale/${todaysSolutionName.toLowerCase().replaceAll(' ', '-')}.png`
    }
}

function searchForSolution(e) {
    let guess = e.target.value
    let suggestionsContainer = document.getElementById("suggestions-container")
    selectedSuggestionIndex = -1
    
    if (guess.length > 0 && !solutions.includes(guess)) {
        let filteredSolutions = solutions
            .filter(solution => solution.toLowerCase().startsWith(guess.toLowerCase().trim()) || solution.toLowerCase().includes(`(${guess.toLowerCase().trim()}`))
            .filter(solution => !alreadyGuessed.includes(solution))
            .slice(0, 8) // Limit to 8 suggestions
        
        if (filteredSolutions.length > 0) {
            console.log("Filtered Solutions:", filteredSolutions)
            suggestionsContainer.innerHTML = filteredSolutions.map((solution, index) => 
                `<div class="suggestion-item" data-value="${solution}" data-index="${index}">${solution}</div>`
            ).join('')
            suggestionsContainer.classList.add("show")
            
            // Add click handlers to suggestions
            suggestionsContainer.querySelectorAll(".suggestion-item").forEach(item => {
                item.addEventListener("click", () => selectSuggestion(item.dataset.value))
            })
        } else {
            console.log("No suggestions found.")
            hideSuggestions()
        }
    } else {
        hideSuggestions()
    }
}

function hideSuggestions() {
    let suggestionsContainer = document.getElementById("suggestions-container")
    suggestionsContainer.innerHTML = ""
    suggestionsContainer.classList.remove("show")
    selectedSuggestionIndex = -1
}

function selectSuggestion(value) {
    document.getElementById("guess-input").value = value
    hideSuggestions()
}

function handleKeyboardNavigation(e) {
    let suggestionsContainer = document.getElementById("suggestions-container")
    let items = suggestionsContainer.querySelectorAll(".suggestion-item")
    
    if (!suggestionsContainer.classList.contains("show") || items.length === 0) return
    
    if (e.key === "ArrowDown") {
        e.preventDefault()
        selectedSuggestionIndex = Math.min(selectedSuggestionIndex + 1, items.length - 1)
        updateSelectedSuggestion(items)
    } else if (e.key === "ArrowUp") {
        e.preventDefault()
        selectedSuggestionIndex = Math.max(selectedSuggestionIndex - 1, 0)
        updateSelectedSuggestion(items)
    } else if (e.key === "Escape") {
        hideSuggestions()
    }
}

function updateSelectedSuggestion(items) {
    items.forEach((item, index) => {
        item.classList.toggle("selected", index === selectedSuggestionIndex)
    })
    if (selectedSuggestionIndex >= 0) {
        document.getElementById("guess-input").value = items[selectedSuggestionIndex].dataset.value
    }
}

window.onload = loadGame