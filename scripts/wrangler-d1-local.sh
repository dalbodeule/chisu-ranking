#!/bin/bash

# drizzle 폴더 내에서 가장 최근의 SQL 파일을 찾습니다.
# shellcheck disable=SC2012
latest_sql_file=$(ls -Art server/database/migrations/*.sql | tail -n 1)

# 찾은 SQL 파일로 wrangler 명령을 실행합니다.
wrangler d1 execute chisu-ranking --local --file "$latest_sql_file"