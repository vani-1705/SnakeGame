import tkinter as tk
import random
import pygame

# Initialize Pygame mixer
pygame.mixer.init()
pygame.mixer.music.load("/home/rgukt/Downloads/background.mp3")
pygame.mixer.music.play(-1)

eat_sound = pygame.mixer.Sound("/home/rgukt/Downloads/eat.wav")
hit_sound = pygame.mixer.Sound("/home/rgukt/Downloads/hit.wav")

# Constants
WIDTH, HEIGHT = 600, 400
CELL = 20
SPEED = 100

class SnakeGame:
    def __init__(self, root):
        self.root = root
        self.canvas = tk.Canvas(root, bg="black", width=WIDTH, height=HEIGHT)
        self.canvas.pack()

        self.snake = [(100, 100), (80, 100), (60, 100)]
        self.food = self.get_new_food()
        self.direction = "Right"
        self.running = True
        self.score = 0
        self.hearts = 5
        self.muted = False

        self.root.bind("<Up>", lambda e: self.change_dir("Up"))
        self.root.bind("<Down>", lambda e: self.change_dir("Down"))
        self.root.bind("<Left>", lambda e: self.change_dir("Left"))
        self.root.bind("<Right>", lambda e: self.change_dir("Right"))
        self.root.bind("p", self.pause)
        self.root.bind("r", self.resume)
        self.root.bind("m", self.toggle_music)

        self.draw()
        self.update()

    def get_new_food(self):
        while True:
            x = random.randint(0, (WIDTH - CELL) // CELL) * CELL
            y = random.randint(0, (HEIGHT - CELL) // CELL) * CELL
            if (x, y) not in self.snake:
                return (x, y)

    def draw(self):
        self.canvas.delete("all")

        # Draw snake
        for i, (x, y) in enumerate(self.snake):
            color = "gold" if i == 0 else "green"
            self.canvas.create_rectangle(x, y, x + CELL, y + CELL, fill=color)

        # Draw food
        fcolor = random.choice(["red", "blue", "pink", "cyan", "white"])
        fx, fy = self.food
        self.canvas.create_oval(fx, fy, fx + CELL, fy + CELL, fill=fcolor)

        # Score & lives
        self.canvas.create_text(50, 10, fill="white", font="Arial 12 bold", text=f"Score: {self.score}")
        self.canvas.create_text(550, 10, fill="white", font="Arial 12 bold", text=f"❤️ x {self.hearts}")

    def update(self):
        if not self.running:
            return

        head_x, head_y = self.snake[0]
        if self.direction == "Up":
            head_y -= CELL
        elif self.direction == "Down":
            head_y += CELL
        elif self.direction == "Left":
            head_x -= CELL
        elif self.direction == "Right":
            head_x += CELL

        # Wrap-around
        head_x %= WIDTH
        head_y %= HEIGHT
        new_head = (head_x, head_y)

        if new_head in self.snake:
            self.hearts -= 1
            if not self.muted:
                hit_sound.play()
            if self.hearts == 0:
                self.game_over()
                return
            else:
                self.snake = [(100, 100), (80, 100), (60, 100)]
                self.direction = "Right"
        else:
            self.snake.insert(0, new_head)
            if new_head == self.food:
                self.score += 1
                self.food = self.get_new_food()
                if not self.muted:
                    eat_sound.play()
            else:
                self.snake.pop()

        self.draw()
        self.root.after(SPEED, self.update)

    def change_dir(self, new_dir):
        opposite = {"Up": "Down", "Down": "Up", "Left": "Right", "Right": "Left"}
        if new_dir != opposite.get(self.direction):
            self.direction = new_dir

    def pause(self, event=None):
        self.running = False

    def resume(self, event=None):
        if not self.running:
            self.running = True
            self.update()

    def toggle_music(self, event=None):
        self.muted = not self.muted
        if self.muted:
            pygame.mixer.music.pause()
        else:
            pygame.mixer.music.unpause()

    def game_over(self):
        pygame.mixer.music.stop()
        self.canvas.create_text(WIDTH // 2, HEIGHT // 2, fill="white", font="Arial 20 bold", text="💀 Game Over 💀")
        self.canvas.create_text(WIDTH // 2, HEIGHT // 2 + 30, fill="white", font="Arial 12", text=f"Final Score: {self.score}")
        self.running = False

root = tk.Tk()
root.title("Python Snake Game 🐍")
game = SnakeGame(root)
root.mainloop()
