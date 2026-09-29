# Candy Auto-Chat (Tampermonkey)

Ce script envoie automatiquement 200 phrases de conversation dans le chat **Live Actions** de candy.ai.

- L'ordre est **aléatoire, sans répétition**.
- Avant chaque phrase, le script **attend la réponse du bot**, puis un **délai X** (réglable).

## Pourquoi pas une app web avec webview ?

Le site renvoie l'en-tête `X-Frame-Options: DENY`. Il ne peut donc pas s'afficher dans une page web tierce (iframe). Le script tourne à la place directement dans votre navigateur, sur la page candy.ai.

## Installation (PC Windows / macOS : Chrome, Edge ou Firefox)

1. Installez l'extension **Tampermonkey** depuis la boutique d'extensions de votre navigateur.
2. Sous Chrome ou Edge : ouvrez les détails de l'extension Tampermonkey et activez **« Autoriser les scripts utilisateur »** si l'option est proposée.
3. Cliquez sur l'icône Tampermonkey, puis sur **Créer un nouveau script…**.
4. Effacez le contenu proposé, collez tout le contenu de `candy-auto-chat.user.js`, puis faites **Fichier → Enregistrer** (ou Ctrl+S).

## Utilisation

1. Ouvrez https://candy.ai/fr/ai-girlfriend/bree-whitlock/live-actions et **connectez-vous**.
2. Un panneau **🤖 Auto-Chat** apparaît en bas à gauche.
3. Réglez les deux paramètres :
   - **Délai entre phrases (s)** : pause après la réponse du bot, avant la phrase suivante (minimum 1 s).
   - **Attente max réponse (s)** : si le bot ne répond pas dans ce délai, le script se met en pause.
4. Cliquez sur **▶ Démarrer**. **⏸ Pause** arrête le script, et **▶ Reprendre** continue là où il s'était arrêté.
5. **↺** remélange la liste et remet le compteur à zéro.

Cliquez sur l'en-tête du panneau pour le réduire ou le déplier.

La progression et les réglages sont conservés si vous rechargez la page.

## Pause automatique

Le script se met en pause tout seul dans les cas suivants :

- l'envoi est refusé (par exemple si vous n'êtes pas connecté) ;
- le bot ne répond pas dans le délai maximum ;
- le site affiche sa fenêtre d'abonnement ;
- vous quittez la page du chat ;
- les 200 phrases ont été envoyées.

## Remarques

- Laissez l'onglet **visible** : les navigateurs ralentissent les minuteurs des onglets en arrière-plan, et les délais réels peuvent alors être plus longs.
- Pour modifier les phrases, éditez la liste `PHRASES` en haut du script. Après une modification du nombre de phrases, la progression repart à zéro.
- Le script repère le chat grâce à ses attributs HTML (`data-live-actions-chat-input-target`). Si candy.ai modifie sa page, il faudra peut-être adapter ces sélecteurs (constante `SEL`).
