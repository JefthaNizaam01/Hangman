from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)

# List of words and their hints
words = [
    { "word": "america", "hint": "The states of ?" },
    { "word": "animal", "hint": "There are many of them" },
    { "word": "apple", "hint": "Take a byte" },
    { "word": "bag", "hint": "It can hold stuff" },
    # Add more words here
]

# Initial game state
game_data = {}

@app.route('/')
def index():
    # Choose a random word from the list
    word_data = random.choice(words)
    game_data['word'] = word_data['word']
    game_data['hint'] = word_data['hint']
    game_data['guesses_left'] = 10
    game_data['guessed_letters'] = []
    game_data['streak'] = 0
    game_data['score'] = 0
    
    # Generate blank spaces for the word
    game_data['blank_word'] = ['_'] * len(word_data['word'])
    
    return render_template('index.html', game_data=game_data)

@app.route('/guess', methods=['POST'])
def guess():
    letter = request.form['letter'].lower()
    word = game_data['word']
    
    if letter in word and letter not in game_data['guessed_letters']:
        # Correct guess
        for i, char in enumerate(word):
            if char == letter:
                game_data['blank_word'][i] = letter
        game_data['guessed_letters'].append(letter)
    else:
        # Incorrect guess
        game_data['guesses_left'] -= 1
        game_data['guessed_letters'].append(letter)
    
    # Check if game is won
    if '_' not in game_data['blank_word']:
        game_data['streak'] += 1
        game_data['score'] += game_data['guesses_left']
        game_data['guesses_left'] = 10  # Reset guesses for the next round
        return jsonify({"result": "win", "game_data": game_data})
    
    # Check if game is over
    if game_data['guesses_left'] <= 0:
        game_data['streak'] = 0
        game_data['score'] = 0
        return jsonify({"result": "lose", "game_data": game_data})
    
    return jsonify({"result": "continue", "game_data": game_data})

@app.route('/reset', methods=['POST'])
def reset():
    return index()  # Reset the game by reloading the index

if __name__ == '__main__':
    app.run(debug=True)
