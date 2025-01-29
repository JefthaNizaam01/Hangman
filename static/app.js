const words = [
  { word: "loadshedding", hint: "When the lights take a break" },
  { word: "gatsby", hint: "The only meal that matters" },
  { word: "taxi", hint: "The real kings of the road" },
  { word: "minibus", hint: "Where 'full' means there's still space" },
  { word: "boerewors", hint: "Braai essential" },
  { word: "braai", hint: "Every Saturday’s main event" },
  { word: "table mountain", hint: "The only flat peak" },
  { word: "penguins", hint: "Chilling in Simon’s Town" },
  { word: "seagull", hint: "Professional chip thief" },
  { word: "robot", hint: "No, it’s just a traffic light" },
  { word: "bakkie", hint: "The ultimate workhorse" },
  { word: "kak", hint: "Every Capetonian’s favorite word" },
  { word: "ouens", hint: "The Cape Town squad" },
  { word: "aweh", hint: "Cape Town’s ‘hello’" },
  { word: "dop", hint: "One for the weekend" },
  { word: "lekker", hint: "The ultimate compliment" },
  { word: "snoek", hint: "Fish with attitude" },
  { word: "weskus", hint: "Colder water, bigger waves" },
  { word: "camps bay", hint: "Beach where you flex" },
  { word: "muizenberg", hint: "Colorful huts and first surf" },
  { word: "stellenbosch", hint: "Wine, students, and more wine" },
  { word: "kaapse klopse", hint: "New Year’s main event" },
  { word: "six to six", hint: "Only true jol warriors survive" },
  { word: "hadedas", hint: "Your 5AM alarm" },
  { word: "siff", hint: "When something is just... no" },
  { word: "fynbos", hint: "Smells better than your cologne" },
  { word: "clifton", hint: "Colder than your ex’s heart" },
  { word: "bo-kaap", hint: "Most colorful street in SA" },
  { word: "signal hill", hint: "Best sunset views" },
  { word: "bunny chow", hint: "Half a loaf, all the flavor" },
  { word: "kombuis", hint: "Where the magic happens" },
  { word: "tjommies", hint: "Cape Town’s besties" },
  { word: "tjips", hint: "Slap and lekker" },
  { word: "safari", hint: "When tourists think lions roam here" },
  { word: "rugby", hint: "More important than politics" },
  { word: "stormers", hint: "Cape Town's pride" },
  { word: "springboks", hint: "Our national superheroes" },
  { word: "woolies", hint: "Where broke people shop fancy" },
  { word: "spaza", hint: "Neighborhood convenience store" },
  { word: "koeksister", hint: "Sunday morning happiness" },
  { word: "milnerton", hint: "Wind so strong it moves you" },
  { word: "cpt", hint: "The only place that matters" },
  { word: "chappies", hint: "Bubblegum with knowledge" },
  { word: "parow", hint: "Jack’s hometown" },
  { word: "tokai forest", hint: "Where joggers and ghosts meet" },
  { word: "papsak", hint: "Poor man’s bottle service" },
  { word: "sundowners", hint: "Cape Town’s favorite sport" },
  { word: "waves", hint: "Surfers’ playground" },
  { word: "dop system", hint: "The OG happy hour" },
  { word: "karate water", hint: "Home-brewed Cape brandy" },
  { word: "blouberg", hint: "Postcard views, icy water" },
  { word: "long street", hint: "Where the party never ends" },
  { word: "stellenbosch", hint: "Where wine flows like water" },
  { word: "climate change", hint: "Four seasons in a day" },
  { word: "mountain goat", hint: "People hiking in Jordans" }
];

  // svg data to draw the hangman (from last to first)
  const hangman = [
    { from: [70, 38], to: [72, 46] },
    { from: [70, 38], to: [68, 46] },
    { from: [70, 45], to: [72, 55] },
    { from: [70, 45], to: [68, 55] },
    { from: [70, 35], to: [70, 45] },
    { circle: [70, 30], radius: 2 },
    { from: [70, 5], to: [70, 25] },
    { from: [30, 5], to: [70, 5] },
    { from: [30, 95], to: [30, 5] },
    { from: [1, 95], to: [99, 95] },
  ]
  
  // get stats
  let stats = { streak: 0, scores: [] }
  if (typeof Storage !== "undefined" && localStorage.hangman !== undefined) {
    stats = JSON.parse(localStorage.hangman)
    setScore()
  }
  
  // play again
  document.querySelector("button").addEventListener("click", generateWord)
  document.addEventListener("keydown", (e) => {
    if (document.querySelector("input").style.display !== "none") return
    if (e.key === "Enter") generateWord()
  })
  
  // hints
  document.querySelector("#hints").addEventListener("change", (e) => {
    if (e.target.checked) showHint()
    else document.querySelector(".hint").innerHTML = ""
  })
  function showHint() {
    document.querySelector(".hint").innerHTML = game.hint
  }
  
  // reveal mode
  document.querySelector("#reveal").addEventListener("change", (e) => {
    if (e.target.checked) revealMode()
  })
  function revealMode() {
    checkLetter(game.word[0])
    checkLetter(game.word.slice(-1))
  }
  
  // initialize
  let game = {}
  generateWord()
  
  function generateWord() {
    let data = {}
  
    // get random word
    let randomIndex = Math.floor(Math.random() * words.length)
    data.word = words[randomIndex].word
    data.hint = words[randomIndex].hint
  
    setWord(data)
  }
  
  // set a word
  // {word: "", hint: ""}
  function setWord(data) {
    game = {
      word: "",
      hint: "",
      currentWord: [],
      guessesLeft: 10,
      guessed: [],
    }
  
    game.word = data.word.toLowerCase()
    game.hint = data.hint
  
    // generate word lines in html
    let html = ""
    for (let i = 0; i < game.word.length; i++) {
      let isSpace = game.word[i] === " " ? 'style="border:none;"' : ""
      if (isSpace) game.currentWord[i] = game.word[i]
      html += '<span class="hidden" ' + isSpace + "></span>"
    }
  
    // update data
    document.querySelector(".guessesLeft").querySelector("span").innerHTML = game.guessesLeft
    document.querySelector(".guessed").querySelector("span").innerHTML = ""
    document.querySelector("input").style.display = null
    document.querySelector("button").style.display = "none"
    document.querySelector(".hangman").innerHTML = ""
    document.querySelector(".word").innerHTML = html
  
    // reveal mode
    if (document.querySelector("#reveal").checked) revealMode()
  
    // hints
    if (document.querySelector("#hints").checked) showHint()
  
    // place caret on input
    document.querySelector("input").focus()
  }
  
  // listen for inputs
  document.querySelector("input").addEventListener("change", (e) => {
    checkValue(e.target.value)
    e.target.value = ""
  })
  
  function checkValue(value) {
    value = value.trim().toLowerCase()
    if (!value) return
  
    checkInput(value)
  
    if (!game.guessesLeft) gameOver()
  
    document.querySelector(".guessesLeft").querySelector("span").innerHTML = game.guessesLeft
  }
  
  function checkInput(value) {
    // invalid input
    var notAllowed = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~0-9]/
    if (value.match(notAllowed)) return alert("Input invalid")
    // only 1 letter
    if (value.length === 1) return checkLetter(value)
    // not correct length (multiple letters)
    if (value.length !== game.word.length) return value.split("").forEach(checkLetter)
  
    checkWord(value)
  }
  
  function checkWord(word) {
    if (word === game.word) {
      for (let i = 0; i < game.word.length; i++) {
        document.querySelector(".word").querySelectorAll("span")[i].innerHTML = game.word[i]
      }
      finish()
      return
    }
  
    // double punishment for getting the word wrong
    drawHangman()
    drawHangman()
    fadeColor("#ff2929")
  }
  
  function checkLetter(letter) {
    let alreadyGuessed = game.guessed.includes(letter)
    if (alreadyGuessed) return
  
    game.guessed.push(letter)
  
    let inWord = false
    // add all letters in word
    for (let i = 0; i < game.word.length; i++) {
      if (game.word[i] === letter) {
        inWord = true
        document.querySelector(".word").querySelectorAll("span")[i].innerHTML = game.word[i]
        game.currentWord[i] = game.word[i]
      }
    }
  
    // correct letter
    if (inWord) {
      fadeColor("#35c435")
      if (game.currentWord.join("") === game.word) finish()
      return
    }
  
    drawHangman()
    fadeColor("#ff2929")
  
    let guessedElem = document.querySelector(".guessed").querySelector("span")
    let wrongLetters = game.guessed.filter((l) => !game.word.includes(l))
    guessedElem.innerHTML = wrongLetters.join(", ")
  }
  
  function fadeColor(color) {
    document.body.style.background = color
    setTimeout(() => (document.body.style.background = null), 200)
  }
  
  function finish() {
    // calculate score
    let wrongGuesses = game.guessed.filter((letter) => !game.word.includes(letter)).length
    let averageCorrectGuesses = (game.word.length / (wrongGuesses + game.word.length)) * 100
    let score = Math.floor(averageCorrectGuesses)
  
    alert("Congratulations! Score: " + score + "%")
    fadeColor("lime")
  
    // set score
    stats.streak++
    stats.scores.push(score)
    setScore()
  
    // play again
    document.querySelector("input").style.display = "none"
    document.querySelector("button").style.display = null
  }
  
  function gameOver() {
    for (let i = 0; i < game.word.length; i++) {
      let letterElem = document.querySelector(".word").querySelectorAll("span")[i]
      if (!letterElem.innerHTML) {
        letterElem.style.color = "red"
        letterElem.innerHTML = game.word[i]
      }
    }
  
    alert("You lost!")
    fadeColor("red")
  
    // set score
    stats.streak = 0
    stats.scores.push(0)
    setScore()
  
    // play again
    document.querySelector("input").style.display = "none"
    document.querySelector("button").style.display = null
  }
  
  function setScore() {
    // calculate average score
    let score = null
    if (stats.scores.length) {
      score = 0
      for (let i = 0; i < stats.scores.length; i++) score += stats.scores[i]
      score = Math.floor(score / stats.scores.length) + "%"
    }
  
    // update data
    document.querySelector(".streak").innerHTML = stats.streak
    document.querySelector(".score").innerHTML = score ?? "-"
    localStorage.hangman = JSON.stringify(stats)
  }
  
  function drawHangman() {
    if (!game.guessesLeft) return
    game.guessesLeft--
  
    let part = hangman[game.guessesLeft]
    if (!part) return
  
    let hangmanLines = document.querySelector(".hangman").querySelectorAll("svg")
    for (let i = 0; i < hangmanLines.length; i++) {
      hangmanLines[i].children[0].classList.remove("draw")
    }
  
    let svg = ""
    if (part.circle) {
      svg = '<svg><circle class="draw" cx="' + part.circle[0] + '%" cy="' + part.circle[1] + '%" r="' + part.radius + '%"/></svg>'
    } else {
      svg = '<svg><line class="draw" x1="' + part.from[0] + '%" y1="' + part.from[1] + '%" x2="' + part.to[0] + '%" y2="' + part.to[1] + '%"/></svg>'
    }
  
    document.querySelector(".hangman").innerHTML += svg
  }