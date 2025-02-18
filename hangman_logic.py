import random
from random import choice

# Read file and return list of words
def read_file(file_name):
    with open(file_name, 'r') as file:
        return file.readlines()

# Select a random word from the list
def select_random_word(words):
    random_index = random.randint(0, len(words) - 1)
    word = words[random_index].strip()
    return word

    

# Randomly fill in one character of the word
def random_fill_word(word):
    random_char = choice(word)
    add = ""
    for char in word:
        if char == random_char:
            add += random_char
        else:
            add += "_"
    return add

# Check if character is missing in the answer word
def is_missing_char(original_word, answer_word, char):
    return char in original_word and char not in answer_word

# Fill in character at correct positions in the answer word
def fill_in_char(original_word, answer_word, char):
    new_list = list(answer_word)
    for i in range(len(original_word)):
        if original_word[i] == char:
            new_list[i] = char
    return "".join(new_list)

# Update answer and return it
def do_correct_answer(original_word, answer, guess):
    return fill_in_char(original_word, answer, guess)

# Draw the hangman figure based on remaining guesses
def draw_figure(number_guesses):
    stages = [
        """
        /----
        |
        |
        |
        |
        _______
        """,
        """
        /----
        |   0
        |
        |
        |
        _______
        """,
        """
        /----
        |   0
        |  /|\\
        |
        |
        _______
        """,
        """
        /----
        |   0
        |  /|\\
        |   |
        |
        _______
        """,
        """
        /----
        |   0
        |  /|\\
        |   |
        |  / \\
        _______
        """
    ]
    return stages[5 - number_guesses]

# Game loop - checks user guesses and updates game state
def run_game_loop(word, answer, guess, number_guess):
    if guess == "exit" or guess == "quit":
        return "Game exited.", None, None, number_guess

    if is_missing_char(word, answer, guess):
        answer = do_correct_answer(word, answer, guess)
        if word == answer:
            return "Congratulations, you guessed the word!", word, answer, number_guess
    else:
        number_guess -= 1
        if number_guess == 0:
            return f"Sorry, you are out of guesses. The word was: {word}", word, answer, number_guess
        hangman_fig = draw_figure(number_guess)
        return hangman_fig, word, answer, number_guess
    
    return None, word, answer, number_guess
