#!/bin/bash

while true; do
    cd /storage/emulated/0/Web
    if git status --porcelain | grep -q .; then
        echo "$(date): 📝 Changements détectés, push en cours..."
        git add .
        git commit -m "🔄 Auto-push $(date '+%Y-%m-%d %H:%M:%S')"
        git push
        echo "$(date): ✅ Push effectué"
    fi
    sleep 300  # Vérifier toutes les 5 minutes
done
