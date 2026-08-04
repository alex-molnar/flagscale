import { capitalize } from 'https://assets.kak.im/api/javascript/stringUtils.js'
import { getRandomSelectionForToday, getItemForToday, getDirection, mathDistance } from 'https://assets.kak.im/api/javascript/mathHelpers.js'
import { format } from 'https://assets.kak.im/api/javascript/stringUtils.js'
import { loadGame } from 'https://assets.kak.im/api/javascript/gameHandler.js'

import { solutions, solutionsData, explanations } from './data.js'

let gameTitle = PARAM_GAME_TITLE
let alreadyGuessed = [] 
let currentDate = new Date().toJSON().slice(0, 10);
let todaysSolutionName = getRandomSelectionForToday(solutions, gameTitle)
let todaysSolution = solutionsData[todaysSolutionName]
let selectedSuggestionIndex = -1

function formatGuessItem(name, distance, direction, additionalClassList = "") {
    return format(`
            <div class="guess-item guess-name{3}">{0}</div>
            <div class="guess-item guess-distance{3}">{1}km</div>
            <div class="guess-item guess-direction{3}">{2}</div>
        `, 
        name, 
        distance, 
        direction, 
        ` ${additionalClassList}`
    )
}

function displayRowsCallback(guessName, rowNumber, initial) {
    if (!initial) {
        showFeedbackPopup(guessName)
    }

    if (guessName === todaysSolutionName) {
        displayWinningGuessRow(guessName, rowNumber)
    } else if (rowNumber >= 6) {
        displayNewGuessRow(guessName, rowNumber)
        displayGameOverRow()
    } else {
        displayNewGuessRow(guessName, rowNumber)
    }
}

function onLoadGame() {
    loadGame(gameTitle, todaysSolutionName, solutions, displayRowsCallback)
    document.getElementById("game-description").textContent = explanations[gameTitle] || ""
    document.getElementById("flag-image").src = `https://assets.kak.im/assets/${gameTitle}/${todaysSolutionName.toLowerCase().replaceAll(' ', '-')}.png`
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
    flag.src = `https://assets.kak.im/assets/original/${guess.toLowerCase().replaceAll(' ', '-')}.png`
    
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

    const directionEmoji = getDirection(Math.atan2(guessData.longitude - todaysData.longitude, guessData.latitude - todaysData.latitude) * 180 / Math.PI).directionIcon

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
    console.log("Game over! The answer was:", todaysSolutionName)
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
window.onload = onLoadGame