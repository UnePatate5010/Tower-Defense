# Tower-Defense

This is a school project done in early-mid 2023. The goal was to create from scratch a [tower defense](https://en.wikipedia.org/wiki/Tower_defense) game in TS. The twist was the (mandatory) use of functional programming which is, let's be honest, not really adapted to game.
Nonetheless, we did our best to respect the chosen paradigm. That is a reason why our code is messy and really difficult to read  (an other reason being us being bad :pepeKMS:). The game is displayed in the terminal.



## File

- `/dist` : build directory
- `/src`
  - `actor.ts` : defines the type `actor` used for both towers and monsters
  - `characters.ts` : generic entities (towers and monsters) created from `actor`
  - `display.ts` : display functions (in terminal)
  - `game.ts` : `main` function
  - `monster.ts` : all functions related to monsters
  - `structures.ts` : contains all custom data structures (all recursive of course) and their utilitary functions
  - `tower.ts` : all functions related to towers
  - `world.ts` : management of the game board
- `/tst` : contains all test files (please not that some tests in `world.test.ts` dont pass. Will probably never be fixed).
- `Makefile` : see below
- `jest.config.ts` : Jest configuration file (framework used for tests)
- `package.json` : dependencies files
- `tsconfig.json` : TypeScript configuration file




## How to Makefile

First, needed packages need to be installed. So please run `npm install` in the repository root (it will install all dependencies from `package.json`)

This project use a Makefile to compile and run executables. Run the following commands in the repository root depending on your needs.
- `make` : compile the whole project and runs it
- `make build` : compile only the main files (no tests)
- `make run` : compile only the main files and run the project (same as `make`)
- `make test` : compile the project and tests files and run all tests with Jest
- `make clean` : delete all compiled files (in `/dist`)






## Screenshot






## Authors 


[PotatOwO](https://github.com/UnePatate5010)

[Larwive](https://github.com/Larwive)

[GeekBoyBoss](https://github.com/GeeKboy2)

[Pyrhanox](https://github.com/Pyrhanox)
