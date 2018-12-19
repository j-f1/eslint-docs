workflow "Run tests" {
  on = "push"
  resolves = ["Test"]
}

action "Install Dependencies" {
  uses = "actions/bin/sh@master"
  args = "yarn"
}

action "Test" {
  uses = "actions/bin/sh@master"
  needs = ["Install Dependencies"]
  args = "yarn jest"
}
