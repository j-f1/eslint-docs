workflow "Lint & run tests" {
  on = "push"
  resolves = [
    "Push Coverage",
    "Lint",
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

workflow "Release" {
  on = "push"
  resolves = ["Publish Release"]
}

action "Only master branch" {
  uses = "actions/bin/filter@master"
  args = "branch master"
}

action "Publish Release" {
  uses = "docker://node:11"
  needs = [
    "Install Dependencies",
    "Only master branch",
  ]
  # GH_TOKEN has the right permissions
  secrets = [
    "NPM_TOKEN",
    "GH_TOKEN",
  ]
  runs = "bash -c"
  args = ["npx semantic-release"]
}
