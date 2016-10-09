#!/usr/bin/env bash
docker run --rm -v $(pwd):/usr/src/app -w /usr/src/app node:4.3.2 npm init --yes