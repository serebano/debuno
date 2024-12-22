# deno
curl -fsSL https://deno.land/install.sh | sh -s -- -y

# bun
curl -fsSL https://bun.sh/install | bash

# node
# installs nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

nvm install 22

# install debuno
deno install npm:debuno --global -A