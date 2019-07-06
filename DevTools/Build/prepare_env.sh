#!/usr/bin/env bash

unset npm_config_prefix
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[[ -s "$NVM_DIR/nvm.sh" ]] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[[ -s "$NVM_DIR/bash_completion" ]] && \. "$NVM_DIR/bash_completion"

NODE=$(jq '.engines.node' package.json | sed 's/^.*[^0-9]\([0-9]*\.[0-9]*\.[0-9]*\).*$/\1/')
NPM=$(jq '.engines.npm' package.json | sed 's/^.*[^0-9]\([0-9]*\.[0-9]*\.[0-9]*\).*$/\1/')
PACKAGES=$(jq '.devDependencies' package.json | grep -E '"(rimraf|eslint|prettier|less|stylelint|webpack)"' | sed  's/"\([^",]*\)": "\([^",]*\)",/\1@\2/' | xargs echo)

nvm install $NODE
npm install -g npm@$NPM
npm install -g $PACKAGES
