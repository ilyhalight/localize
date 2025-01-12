import BaseAction from "./base";

export default class ExitAction extends BaseAction {
  // eslint-disable-next-line @typescript-eslint/require-await
  async run() {
    console.log("See you next time! 👋");
    process.exit(0);
  }
}
