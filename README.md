<p align="center">
  <a href="https://snakepit.roscoe.dev">
    <img alt="Snakepit" src="./src/favicon.ico" width="64" />
  </a>
</p>
<h1 align="center">
  Snakepit
</h1>

<div align="center">
  <a href="https://snakepit.roscoe.dev/" marginRight="20px">Visit Site</a>
</div>
<br />

Snakepit is an experiment in genetic algorithms.

Snakes traverse a 2D grid in search for food and sometimes lay eggs. Each time a snake moves, it consumes energy. If energy reaches zero, the snake will die and leave behind some food. Snakes can consume the following types of food:

Green - Replenishes large amount of energy AND increases length of snake.
Blue - Replenishes small amount of energy AND decreases length of snake.
Red - Drains a small amount of energy.
Each of the snakes have genes which control the following attributes:

Attraction to GREEN, BLUE and RED food
Attraction to other snakes
Egg laying rate
When a snake lays an egg, its DNA is passed down to the child with a small chance of mutation. Snakes with good genes are more likely to survive longer and therefore lay more eggs.

<hr>

## 🚀 Quick start

1.  **Install dependencies**

    ```shell
    yarn
    ```

2.  **Start developing.**

    Navigate into the site’s directory and start it up.

    ```shell
    cd snakepit/
    yarn develop
    ```

3.  **Open the code and start customizing!**

    The site is now running at http://localhost:4444!
