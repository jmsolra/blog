#!/usr/bin/env bash
docker-compose up -d
docker-compose logs -f
docker-compose down
