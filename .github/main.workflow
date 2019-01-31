workflow "Run tests & release" {
  on = "push"
  resolves = [
    "Release",
  ]
}

action "Install Dependencies" {
  uses = "CultureHQ/actions-yarn@master"
  args = "install"
}

action "Test" {
  uses = "CultureHQ/actions-yarn@master"
  needs = ["Install Dependencies"]
  args = "jest"
}

action "Lint" {
  uses = "CultureHQ/actions-yarn@master"
  needs = ["Install Dependencies"]
  args = "lint"
}

action "Only Branch Pushes" {
  uses = "actions/bin/filter@master"
  needs = ["Test"]
  args = "branch"
}

action "Push Coverage" {
  uses = "docker://node:11"
  needs = ["Only Branch Pushes"]
  secrets = ["CODECOV_TOKEN"]
  runs = "bash -c"
  args = ["npx codecov --disable=detect --commit=$GITHUB_SHA --branch=${GITHUB_REF#refs/heads/}"]
}


action "Only master branch" {
  uses = "actions/bin/filter@master"
  args = "branch master"
}

action "Release" {
  uses = "docker://node:11"
  needs = [
    "Push Coverage",
    "Lint",
    "Only master branch",
  ]
  secrets = ["NPM_TOKEN", "GITHUB_TOKEN"]
  runs = "bash -c"
  args = ["npx semantic-release"]
}
