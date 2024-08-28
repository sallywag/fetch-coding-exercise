import { expect, Locator, Page } from "@playwright/test";

export type Bar = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
type Side = "left" | "right";

export class Scale {
  private readonly leftGameBoardRowInput: Locator = this.page
    .locator(".game-board")
    .filter({ hasText: "left" })
    .locator("input");
  private readonly result: Locator = this.page.locator(".result > button");
  private readonly rightGameBoardRowInput: Locator = this.page
    .locator(".game-board")
    .filter({ hasText: "right" })
    .locator("input");
  private readonly resetButton: Locator = this.page.locator("#reset").nth(1);
  private readonly weighButton: Locator = this.page.locator("#weigh");
  private readonly weighings: Locator = this.page.locator(".game-info li");
  private readonly bars: Locator = this.page.locator(".coins > button");
  private _totalWeighs: number = 0;

  constructor(private readonly page: Page) {}

  public get totalWeighs(): number {
    return this._totalWeighs;
  }

  async reset(): Promise<void> {
    await this.resetButton.click();
  }

  async clickBar(bar: Bar): Promise<void> {
    await this.bars.nth(Number(bar)).click();
  }

  async weighBars(): Promise<void> {
    await this.weighButton.click();
    this._totalWeighs++;
  }

  async waitForWeighingToBeComplete(): Promise<void> {
    await expect(this.weighings).toHaveCount(this.totalWeighs);
  }

  async getResult(): Promise<string | null> {
    return await this.result.textContent();
  }

  async addBarToBowl(bar: Bar, side: Side): Promise<void> {
    let rowInput =
      side === "left"
        ? this.leftGameBoardRowInput
        : this.rightGameBoardRowInput;
    for (const input of await rowInput.all()) {
      if ((await input.inputValue()) === "") {
        await input.fill(bar);
        break;
      }
    }
  }
}
