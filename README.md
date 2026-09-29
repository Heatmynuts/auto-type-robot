# Candy Auto-Chat (Tampermonkey)

Ce script envoie automatiquement 400 phrases de conversation dans le chat **Live Actions** de candy.ai, **en boucle et sans arrêt**.

- L'ordre est **aléatoire, sans répétition** au sein d'un tour.
- Une fois les 400 phrases envoyées, la liste est remélangée et un nouveau tour commence automatiquement.
- Avant chaque phrase, le script **attend la réponse du bot**, puis un **délai X** (réglable).

## Pourquoi pas une app web avec webview ?

Le site renvoie l'en-tête `X-Frame-Options: DENY`. Il ne peut donc pas s'afficher dans une page web tierce (iframe). Le script tourne à la place directement dans votre navigateur, sur la page candy.ai.

## Version Mac sans extension (recommandée)

Un petit programme ouvre sa propre fenêtre de navigateur sur candy.ai et y ajoute le panneau Auto-Chat. Vous n'avez rien à installer dans votre navigateur.

1. Installez **Python 3** depuis https://www.python.org/downloads/ (une seule fois).
2. Téléchargez ce dossier sur votre Mac.
3. Double-cliquez sur **`Lancer-robot.command`**.
   - Si macOS bloque l'ouverture : faites clic droit → **Ouvrir** → **Ouvrir**.
   - Si le double-clic ne fait rien : ouvrez l'application **Terminal**, tapez `bash ` (avec un espace), glissez le fichier dans la fenêtre, puis appuyez sur Entrée.
4. Le premier lancement installe les composants nécessaires, ce qui prend quelques minutes. Si Google Chrome n'est pas installé, un navigateur Chromium est téléchargé.
5. Dans la fenêtre du navigateur qui s'ouvre, **connectez-vous**. La connexion est mémorisée pour les fois suivantes.
6. Réglez le délai dans le panneau en bas à gauche, puis cliquez sur **▶ Démarrer**.

Pour quitter, fermez la fenêtre du navigateur.

Si la connexion avec Google est refusée dans cette fenêtre, utilisez la connexion par e-mail et mot de passe.

## Installation via Tampermonkey (alternative : Chrome, Edge ou Firefox)

1. Installez l'extension **Tampermonkey** depuis la boutique d'extensions de votre navigateur.
2. Sous Chrome ou Edge : ouvrez les détails de l'extension Tampermonkey et activez **« Autoriser les scripts utilisateur »** si l'option est proposée.
3. Cliquez sur l'icône Tampermonkey, puis sur **Créer un nouveau script…**.
4. Effacez le contenu proposé, collez tout le contenu de `candy-auto-chat.user.js`, puis faites **Fichier → Enregistrer** (ou Ctrl+S).

## Utilisation

1. Ouvrez https://candy.ai/fr/ai-girlfriend/bree-whitlock/live-actions et **connectez-vous**.
2. Un panneau **🤖 Auto-Chat** apparaît en bas à gauche.
3. Réglez les deux paramètres :
   - **Délai entre phrases (s)** : pause après la réponse du bot, avant la phrase suivante (minimum 1 s).
   - **Attente max réponse (s)** : si le bot ne répond pas dans ce délai, le script réactive le bouton d'envoi et passe à la phrase suivante.
4. Cliquez sur **▶ Démarrer**. **⏸ Pause** arrête le script, et **▶ Reprendre** continue là où il s'était arrêté.
5. **↺** remélange la liste et remet le compteur à zéro (tour 1).

Le panneau affiche le numéro du tour et la progression, par exemple « Tour 2 · 57 / 400 ».

Cliquez sur l'en-tête du panneau pour le réduire ou le déplier.

La progression et les réglages sont conservés si vous rechargez la page.

## Pause automatique

Le script tourne sans arrêt. Il se met en pause uniquement quand il ne peut pas continuer :

- l'envoi est refusé (par exemple si vous n'êtes pas connecté) ;
- le site affiche sa fenêtre d'abonnement ;
- vous quittez la page du chat.

## Remarques

- Laissez l'onglet **visible** : les navigateurs ralentissent les minuteurs des onglets en arrière-plan, et les délais réels peuvent alors être plus longs.
- Pour modifier les phrases, éditez la liste `PHRASES` en haut du script. Après une modification du nombre de phrases, la progression repart à zéro.
- Le script repère le chat grâce à ses attributs HTML (`data-live-actions-chat-input-target`). Si candy.ai modifie sa page, il faudra peut-être adapter ces sélecteurs (constante `SEL`).
