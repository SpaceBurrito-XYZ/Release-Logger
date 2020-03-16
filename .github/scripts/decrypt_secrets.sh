#!/bin/sh

mkdir $HOME/secrets
gpg --quiet --batch --yes --decrypt --passphrase="$DECRYPTION_PASSPHRASE" \
--output $HOME/secrets/service_account.json service_account.json.gpg