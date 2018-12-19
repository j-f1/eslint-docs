workflow "Run tests" {
  on = "push"
  resolves = ["Test"]
}

action "Install Dependencies" {
  uses = "CultureHQ/actions-yarn@master"
  args = []
}

action "Test" {
  uses = "CultureHQ/actions-yarn@master"
  needs = ["Install Dependencies"]
  args = ["jest"]
}
