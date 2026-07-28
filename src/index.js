let gameTitle = PARAM_GAME_TITLE
let alreadyGuessed = [] 
let currentDate = new Date().toJSON().slice(0, 10);
let todaysSolutionName = getRandomSolutionForToday()
let todaysSolution = solutionsData[todaysSolutionName]
let selectedSuggestionIndex = -1

function getRandomSolutionForToday() {
  let seed = parseInt(currentDate.replaceAll("-", "") + gameTitle.length);
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
    document.getElementById("game-title").textContent = gameTitle.capitalize()
    document.getElementById("game-description").textContent = explanations[gameTitle] || ""
    document.getElementById("flag-image").src = `assets/${gameTitle}/${todaysSolutionName.toLowerCase().replaceAll(' ', '-')}.png`
    alreadyGuessed
        .filter(guess => guess !== todaysSolutionName)
        .forEach((guess, index) => displayNewGuessRow(guess, index + 1))
    if (alreadyGuessed.includes(todaysSolutionName)) {
        displayWinningGuessRow(todaysSolutionName, alreadyGuessed.length)
    } else if (alreadyGuessed.length >= 6) {
        displayGameOverRow()
    } else {
        let guessInput = document.getElementById("guess-input")
        guessInput.addEventListener("input", searchForSolution)
        guessInput.addEventListener("keydown", handleKeyboardNavigation)
        guessInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                submitGuess(e)
            }
        })
        guessInput.addEventListener("blur", () => {
            setTimeout(hideSuggestions, 150) // Delay to allow click on suggestion
        })
        guessInput.focus()
        guessInput.select()
        document.getElementById("submit-button").addEventListener("click", submitGuess)
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
            suggestionsContainer.innerHTML = filteredSolutions.map((solution, index) => 
                `<div class="suggestion-item" data-value="${solution}" data-index="${index}">${solution}</div>`
            ).join('')
            suggestionsContainer.classList.add("show")
            
            // Add click handlers to suggestions
            suggestionsContainer.querySelectorAll(".suggestion-item").forEach(item => {
                item.addEventListener("click", () => selectSuggestion(item.dataset.value))
            })
        } else {
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

function submitGuess(e) {
    let guessInput = document.getElementById("guess-input")
    let guess = guessInput.value
    if (!solutions.includes(guess)) {
        let firstChoice = solutions
            .filter(solution => !alreadyGuessed.includes(solution))
            .find(solution => solution.toLowerCase().startsWith(guess.toLowerCase().trim()) || solution.toLowerCase().includes(`(${guess.toLowerCase().trim()}`))
        if (firstChoice && guess.toLowerCase().trim().length > 0) {
            guessInput.value = firstChoice.trim()
            submitGuess(e)
        } else if (guess.toLowerCase().trim().length > 0) {
            alert(`Please select a valid ${gameTitle.unLe()} from the suggestions`)
        }
    } else if (alreadyGuessed.includes(guess)) {
        alert(`You have already guessed this ${gameTitle.unLe()}`)
    } else if (guess === todaysSolution.name) {
        alreadyGuessed.push(guess)
        localStorage.setItem(`${gameTitle}-${currentDate}`, JSON.stringify(alreadyGuessed))
        showFeedbackPopup(guess)
        displayWinningGuessRow(guess, alreadyGuessed.length)
        guessInput.value = ""
    } else if (alreadyGuessed.length >= 5) {
        // This is the 6th and final guess
        alreadyGuessed.push(guess)
        localStorage.setItem(`${gameTitle}-${currentDate}`, JSON.stringify(alreadyGuessed))
        guessInput.value = ""
        showFeedbackPopup(guess)
        displayNewGuessRow(guess, alreadyGuessed.length)
        displayGameOverRow()
    } else {
        alreadyGuessed.push(guess)
        localStorage.setItem(`${gameTitle}-${currentDate}`, JSON.stringify(alreadyGuessed))
        showFeedbackPopup(guess)
        displayNewGuessRow(guess, alreadyGuessed.length)
        guessInput.value = ""
    }
    hideSuggestions()
}

function launchConfetti() {
    let container = document.getElementById('confetti-container')
    if (!container) {
        container = document.createElement('div')
        container.id = 'confetti-container'
        document.body.appendChild(container)
    }
    
    const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181', '#aa96da', '#fcbad3', '#a8d8ea', '#00a629', '#0b74de']
    const shapes = ['square', 'circle', 'ribbon']
    const confettiCount = 150
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div')
            confetti.className = `confetti ${shapes[Math.floor(Math.random() * shapes.length)]}`
            confetti.style.left = Math.random() * 100 + '%'
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's'
            confetti.style.animationDelay = Math.random() * 0.5 + 's'
            confetti.style.setProperty('--random', Math.random())
            container.appendChild(confetti)
            
            setTimeout(() => confetti.remove(), 4500)
        }, i * 20)
    }
    
    setTimeout(() => container.innerHTML = '', 5000)
}

function showFeedbackPopup(guess) {
    const overlay = document.getElementById('feedback-overlay')
    const circle = document.getElementById('feedback-circle')
    const flag = document.getElementById('feedback-flag')
    
    // Set the original flag image from local assets
    flag.src = `assets/original/${guess.toLowerCase().replaceAll(' ', '-')}.png`
    
    // Set color based on guess result
    circle.classList.remove('correct', 'wrong')
    circle.classList.add(guess === todaysSolution.name ? 'correct' : 'wrong')
    
    // Show the popup
    overlay.classList.add('show')
    
    // Hide after a delay
    setTimeout(() => {
        overlay.classList.remove('show')
    }, 1200)
}

function displayNewGuessRow(guessName, rowNumber) {
    const guessData = solutionsData[guessName]
    const todaysData = todaysSolution

    // Calculate distance and direction
    const distance = mathDistance(
        guessData.latitude, guessData.longitude,
        todaysData.latitude, todaysData.longitude
    )

    const directionEmoji = getDirectionClass(Math.atan2(guessData.longitude - todaysData.longitude, guessData.latitude - todaysData.latitude) * 180 / Math.PI)

    // Get current active row and fill it
    const currentRow = document.querySelector(`.guess-row[data-row="${rowNumber}"]`)
    currentRow.innerHTML = formatGuessItem(guessName, distance, directionEmoji)
    currentRow.classList.remove("active")
    currentRow.classList.add("filled")

    // Make next row active (if exists)
    const nextRowNumber = rowNumber + 1
    if (nextRowNumber <= 6) {
        const nextRow = document.querySelector(`.guess-row[data-row="${nextRowNumber}"]`)
        nextRow.classList.add("active")
        nextRow.textContent = `Guess ${nextRowNumber} / 6`
    }
}

function displayWinningGuessRow(guessName, rowNumber) {
    const guessData = solutionsData[guessName]
    const todaysData = todaysSolution

    // Get current active row and fill it with winning state
    const currentRow = document.querySelector(`.guess-row[data-row="${rowNumber}"]`)
    currentRow.innerHTML = formatGuessItem(guessName, 0, "🎉", "correct")
    currentRow.classList.remove("active")
    currentRow.classList.add("filled", "correct")

    // Disable input and button
    const guessInput = document.getElementById("guess-input")
    const submitButton = document.getElementById("submit-button")
    
    guessInput.disabled = true
    guessInput.placeholder = "You won!"
    guessInput.value = ""
    submitButton.disabled = true

    launchConfetti()
}

function displayGameOverRow() {
    // Create message element above guess rows
    const guessesContainer = document.getElementById("guesses-container")
    const answerMessage = document.createElement("div")
    answerMessage.className = "answer-message"
    answerMessage.textContent = `Today's answer was ${todaysSolutionName}`
    guessesContainer.parentNode.insertBefore(answerMessage, guessesContainer)

    // Disable input and button
    const guessInput = document.getElementById("guess-input")
    const submitButton = document.getElementById("submit-button")
    
    guessInput.disabled = true
    guessInput.placeholder = "Game over!"
    guessInput.value = ""
    submitButton.disabled = true
}

document.title = gameTitle.capitalize()
window.onload = loadGame