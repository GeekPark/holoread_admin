#! /bin/bash
ssh -t holoread "pwd && cd www/holoread-admin && git pull origin go && yarn && npm run build"
