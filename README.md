# Fetch Coding Exercise - SDET

## How to Install

With Node.js installed, from the project directory run:

`npm install`

## How to Run

To run the exercise:

`npm test` or `npx playwright test`

To open the last HTML report:

`npx playwright show-report`

## Design

The Scale class in the src/scale.ts file is used in the tests/fetch-coding-exercise.spec.ts file to interact with the page and complete the assignment.

The "Find fake bar in one or three weighs" test in the tests/fetch-coding-exercise.spec.ts file calls a helper method to find the fake bar and click it.

The test asserts the dialog pop up text is as expected when clicking the correct bar. The test also asserts it takes at most 3 weighs to find the fake bar.

The left and right bowls as well as the weighing results and fake bar are logged to the console.

For brevity's sake, I kept the getFakeBar method in the tests/fetch-coding-exercise.spec.ts file. But this could be refactored into another class if desired.

## Contact

Salvatore Rosa

salrosa91@gmail.com
