#!/bin/bash

cd /storage/emulated/0/Web

# Vérifier s'il y a des changements
if git status --porcelain | grep -q .; then
    echo "📝 Changements détectés..."
    
    # Ajouter tous les changements
    git add .
    
    # Créer un commit avec la date
    git commit -m "🔄 Mise à jour automatique $(date '+%Y-%m-%d %H:%M')"
    
    # Pousser vers GitHub
    git push
    
    echo "✅ Changements envoyés avec succès !"
else
    echo "✅ Aucun changement à envoyer."
fi
