# deno
curl -fsSL https://deno.land/install.sh | sh -s -- -y

# bun
curl -fsSL https://bun.sh/install | bash

# node
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
nvm install 22


git clone https://github.com/serebano/debuno.git $HOME/.debuno

_BIN=$HOME/.debuno/bin/debuno
_DENO_BIN=$HOME/.deno/bin/debuno

if [ -L $_DENO_BIN ]; 
    then rm $_DENO_BIN; fi

if ! [ -L $_DENO_BIN ]; 
    then ln -s $_BIN $_DENO_BIN; fi

exec debuno check