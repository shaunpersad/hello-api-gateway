#!/usr/bin/env bash
docker-compose -f docker-compose.yml -f ../hello-ecosystem/docker-compose.yml -f docker-compose.yml up --force-recreate
