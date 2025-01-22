from flask import Flask, render_template, request, session
import random
from hangman_logic import read_file, select_random_word, random_fill_word, is_missing_char, do_correct_answer, run_game_loop

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'  # Secret key needed for sessions

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        guess = request.form.get("guess", "").strip().lower()  # Get the user's guess and normalize
        word = session.get("word", "")
        answer = session.get("answer", "")
        number_guess = session.get("number_guess", 0)

        # Handle exit or quit command
        if guess in ["exit", "quit"]:
            session.clear()
            return render_template(
                "index.html",
                message="Game exited. Refresh to start a new game.",
                word="",
                guesses_left=0,
                is_game_over=True
            )

        # Validate input: only one letter is allowed
        if len(guess) != 1 or not guess.isalpha():
            return render_template(
                "index.html",
                message="Please enter a valid single letter.",
                word=answer,
                guesses_left=number_guess,
                is_game_over=False
            )

        # Run the game loop logic and get the game state
        game_message, word, answer, number_guess = run_game_loop(word, answer, guess, number_guess)

        # Store updated game state in session
        session["word"] = word
        session["answer"] = answer
        session["number_guess"] = number_guess

        # Check if the game is over
        if game_message:
            session.clear()  # Clear session after game ends
            return render_template(
                "index.html",
                message=game_message,
                word=answer,
                guesses_left=number_guess,
                is_game_over=True
            )

        return render_template(
            "index.html",
            word=answer,
            guesses_left=number_guess,
            is_game_over=False
        )

    # Initialize a new game for a GET request
    words = read_file("short_words.txt")  # Replace with your word list file name
    selected_word = select_random_word(words)
    current_answer = random_fill_word(selected_word)

    # Initialize session variables
    session["word"] = selected_word
    session["answer"] = current_answer
    session["number_guess"] = 5

    return render_template(
        "index.html",
        word=current_answer,
        guesses_left=5,
        is_game_over=False
    )


if __name__ == "__main__":
    app.run(debug=True)
