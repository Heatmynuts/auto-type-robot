#!/bin/bash
# Lanceur macOS du Robot Candy Auto-Chat (double-clic dans le Finder).
cd "$(dirname "$0")" || exit 1

fail() {
  echo
  echo "Une erreur est survenue (voir les messages ci-dessus)."
  read -r -p "Appuyez sur Entree pour fermer..."
  exit 1
}

if ! command -v python3 >/dev/null 2>&1; then
  echo "Python 3 est introuvable."
  echo "Installez-le depuis https://www.python.org/downloads/ puis relancez ce fichier."
  read -r -p "Appuyez sur Entree pour fermer..."
  exit 1
fi

if [ ! -f .venv/installe.txt ]; then
  echo "Premiere installation, patientez..."
  python3 -m venv .venv || fail
  .venv/bin/python -m pip install --upgrade playwright || fail
  if [ ! -d "/Applications/Google Chrome.app" ]; then
    echo "Google Chrome absent : telechargement de Chromium..."
    .venv/bin/python -m playwright install chromium || fail
  fi
  echo ok > .venv/installe.txt
fi

.venv/bin/python candy_robot.py || fail
