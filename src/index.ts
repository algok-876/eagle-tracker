import Tracker from "./lib/js-tracker";

Tracker.init({
  sampling: 0.9,
  report(errorList) {
    console.table(errorList)
  }
})
