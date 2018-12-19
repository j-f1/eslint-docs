workflow "Run tests" {
  on = "push"
  resolves = ["Test"]
}

action "Install yarn" {
  uses = "actions/bin/sh@master"
  args = [
    "apt-get update",
    "apt-get install curl",
    "curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -",
    "echo \"deb https://dl.yarnpkg.com/debian/ stable main\" | tee /etc/apt/sources.list.d/yarn.list",
    "apt-get update",
    "apt-get install yarn"
  ]
}


action "Install Dependencies" {
  uses = "actions/bin/sh@master"
  needs = ["Install yarn"]
  args = "yarn"
}

action "Test" {
  uses = "actions/bin/sh@master"
  needs = ["Install Dependencies"]
  args = "yarn jest"
}
