#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Collecting static files..."
python manage.py collectstatic --no-input

echo "Running all migrations..."
python manage.py migrate

echo "Running special app migrations specifically..."
python manage.py migrate special --verbosity=2

echo "Build completed successfully!"