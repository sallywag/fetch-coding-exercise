import { expect, test } from "@playwright/test";
import { Bar, Scale } from "../src/scale";

async function getFakeBar(scale: Scale): Promise<Bar | undefined> {
  let bars: Array<Bar> = Array("0", "1", "2", "3", "4", "5", "6", "7", "8");
  let leftBowl = bars.splice(0, 4);
  let rightBowl = bars.splice(0, 4);

  await addBarsToBowls(leftBowl, scale, rightBowl);
  await scale.weighBars();
  await scale.waitForWeighingToBeComplete();

  console.log(leftBowl, await scale.getResult(), rightBowl);

  if ((await scale.getResult()) === "=") {
    return bars[0];
  }

  while (leftBowl.length > 1) {
    if ((await scale.getResult()) === "<") {
      rightBowl = leftBowl.splice(0, Math.floor(leftBowl.length / 2));
    } else if ((await scale.getResult()) === ">") {
      leftBowl = rightBowl.splice(0, Math.floor(rightBowl.length / 2));
    }

    await scale.reset();
    await addBarsToBowls(leftBowl, scale, rightBowl);
    await scale.weighBars();
    await scale.waitForWeighingToBeComplete();

    console.log(leftBowl, await scale.getResult(), rightBowl);
  }

  if ((await scale.getResult()) === "<") {
    return leftBowl[0];
  } else if ((await scale.getResult()) === ">") {
    return rightBowl[0];
  }
}

async function addBarsToBowls(
  leftBowl: Bar[],
  scale: Scale,
  rightBowl: Bar[],
): Promise<void> {
  for (const bar of leftBowl) {
    await scale.addBarToBowl(bar, "left");
  }
  for (const bar of rightBowl) {
    await scale.addBarToBowl(bar, "right");
  }
}

test("Find fake bar in one or three weighs", async ({ page }) => {
  await page.goto("/");

  const scale = new Scale(page);
  const fakeBar = await getFakeBar(scale);

  if (fakeBar) {
    console.log(`Fake bar: ${fakeBar}`);

    page.on("dialog", async (dialog) => {
      expect(dialog.message()).toBe("Yay! You find it!");
      dialog.dismiss();
    });

    await scale.clickBar(fakeBar);

    expect(scale.totalWeighs === 1 || scale.totalWeighs === 3).toBeTruthy();
  }
});
