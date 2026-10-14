import BaseAction from "./base";

export default class ExitAction extends BaseAction {
  async run() {
    console.log("See you next time! 👋");
    process.exit(0);
  }
}
