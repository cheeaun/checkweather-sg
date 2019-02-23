workflow "Deploy to GitHub Pages" {
  on = "push"
  resolves = ["Deploy"]
}

action "Default Branch" {
  uses = "actions/bin/filter@24a566c2524e05ebedadef0a285f72dc9b631411"
  args = "branch master"
}

action "Install dependencies" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Default Branch"]
  args = "install"
}

action "Build" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Install dependencies"]
  args = "run build-prod"
}

action "Deploy" {
  uses = "JasonEtco/upload-to-gh-pages@master"
  needs = ["Build"]
  secrets = ["GITHUB_TOKEN"]
  args = "dist"
}
