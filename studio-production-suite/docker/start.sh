#!/usr/bin/env sh
set -e

if [ ! -d vendor ]; then
  composer install --no-interaction --prefer-dist
fi

if [ ! -f .env ]; then
  cp .env.example .env
fi

mkdir -p storage/sqlite
if [ ! -f storage/sqlite/database.sqlite ]; then
  touch storage/sqlite/database.sqlite
fi

php artisan config:clear >/dev/null 2>&1 || true
php artisan key:generate --force >/dev/null 2>&1 || true
php artisan migrate --force
php artisan db:seed --force

php artisan serve --host=0.0.0.0 --port=8000
