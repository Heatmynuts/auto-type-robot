// ==UserScript==
// @name         Candy Auto-Chat
// @namespace    auto-type-robot
// @version      1.0.0
// @description  Envoie automatiquement une liste de phrases dans le chat "Live Actions" de candy.ai (ordre aléatoire, attente de la réponse + délai réglable).
// @match        https://candy.ai/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Phrases (ordre aléatoire, sans répétition). Modifiables librement.
  // ---------------------------------------------------------------------------
  const PHRASES = [
    // Humeur / quotidien
    "Salut ! Comment vas-tu aujourd'hui ?",
    "Qu'est-ce que tu as fait de beau ce matin ?",
    "Tu as bien dormi cette nuit ?",
    "Comment s'est passée ta journée ?",
    "Tu es plutôt du matin ou du soir ?",
    "Qu'est-ce qui te met de bonne humeur en général ?",
    "Tu as des projets pour ce week-end ?",
    "Quel temps fait-il chez toi en ce moment ?",
    "Tu préfères la pluie ou le soleil ?",
    "Quelle est ta saison préférée, et pourquoi ?",
    "Qu'est-ce qui t'a fait sourire aujourd'hui ?",
    "Tu te sens comment en ce moment, honnêtement ?",
    "Tu as pris un bon petit-déjeuner ?",
    "Tu bois plutôt du café ou du thé ?",
    "À quelle heure tu te lèves d'habitude ?",
    "C'est quoi ta routine du soir ?",
    "Tu es plutôt calme ou énergique aujourd'hui ?",
    "Raconte-moi un bon moment de ta semaine.",
    "Qu'est-ce qui t'a occupé l'esprit ces derniers jours ?",
    "Tu as eu une journée chargée ?",
    // Loisirs
    "Qu'est-ce que tu aimes faire pendant ton temps libre ?",
    "Tu fais du sport ?",
    "Quel est ton sport préféré à regarder ?",
    "Tu aimes marcher en forêt ?",
    "Tu préfères la mer ou la montagne ?",
    "Tu as déjà fait de la randonnée ?",
    "Tu sais nager ?",
    "Tu fais du vélo de temps en temps ?",
    "Tu aimes danser ?",
    "Tu joues d'un instrument de musique ?",
    "Tu aimes les jeux de société ?",
    "Tu joues aux jeux vidéo ?",
    "Quel est ton jeu vidéo préféré ?",
    "Tu aimes jardiner ?",
    "Tu fais de la photo ?",
    "Tu dessines ou tu peins ?",
    "Tu as un hobby un peu original ?",
    "Qu'est-ce que tu aimerais apprendre cette année ?",
    "Tu préfères les activités en intérieur ou en extérieur ?",
    "Tu aimes faire du shopping ?",
    "Tu fais du yoga ou de la méditation ?",
    "Tu aimes les puzzles ?",
    "Tu as déjà essayé l'escalade ?",
    "Tu aimes te balader sur la plage ?",
    "C'est quoi ton passe-temps du dimanche ?",
    // Musique / films / livres
    "Quel genre de musique tu écoutes ?",
    "Quel artiste tu écoutes le plus en ce moment ?",
    "Tu as une chanson qui te donne toujours la pêche ?",
    "Quel est le meilleur concert que tu aies vu ?",
    "Tu écoutes de la musique en travaillant ?",
    "Tu aimes la musique classique ?",
    "Tu chantes sous la douche ?",
    "Quel est ton film préféré ?",
    "Tu préfères les comédies ou les films d'action ?",
    "Tu as vu un bon film récemment ?",
    "Tu aimes les films d'horreur ?",
    "Quelle série tu regardes en ce moment ?",
    "Tu es plutôt cinéma ou soirée film à la maison ?",
    "Quel film pourrais-tu revoir cent fois ?",
    "Tu aimes les dessins animés ?",
    "Quel acteur ou quelle actrice t'impressionne le plus ?",
    "Tu lis beaucoup ?",
    "Quel est le dernier livre que tu as lu ?",
    "Tu préfères les romans ou les bandes dessinées ?",
    "Tu as un livre préféré ?",
    "Tu aimes les histoires policières ?",
    "Tu lis plutôt le soir avant de dormir ?",
    "Tu écoutes des podcasts ?",
    "Tu aimes la science-fiction ?",
    "Tu préfères le livre ou son adaptation au cinéma ?",
    "Quel personnage de fiction aimerais-tu rencontrer ?",
    "Tu regardes des documentaires ?",
    "Tu as une série à me conseiller ?",
    "Tu aimes les comédies musicales ?",
    "Quelle musique mettrais-tu pour une soirée entre amis ?",
    // Cuisine
    "Quel est ton plat préféré ?",
    "Tu aimes cuisiner ?",
    "Quelle est ta spécialité en cuisine ?",
    "Tu préfères le sucré ou le salé ?",
    "Tu aimes la cuisine épicée ?",
    "Quel est ton dessert préféré ?",
    "Tu aimes le chocolat ?",
    "Plutôt pizza ou burger ?",
    "Tu aimes les sushis ?",
    "Quel fromage tu préfères ?",
    "Tu aimes la cuisine italienne ?",
    "Tu as déjà goûté la cuisine japonaise ?",
    "Quel est le meilleur repas de ta vie ?",
    "Tu préfères manger au restaurant ou à la maison ?",
    "Tu aimes les croissants ?",
    "Tu as une recette à me partager ?",
    "Tu manges plutôt léger le soir ?",
    "Tu aimes les fruits de mer ?",
    "Quel est ton fruit préféré ?",
    "Tu aimes les crêpes ?",
    "Tu es plutôt glace à la vanille ou au chocolat ?",
    "Tu bois du vin de temps en temps ?",
    "Quelle est ta boisson préférée ?",
    "Tu aimes les pique-niques ?",
    "Tu préfères le brunch ou le dîner ?",
    // Voyages
    "Quel pays aimerais-tu visiter ?",
    "Quel est ton plus beau voyage ?",
    "Tu préfères voyager en groupe ou à deux ?",
    "Tu aimes prendre l'avion ?",
    "Plutôt vacances à la plage ou week-end en ville ?",
    "Tu as déjà visité Paris ?",
    "Quelle ville te fait rêver ?",
    "Tu aimes le camping ?",
    "Tu parles d'autres langues ?",
    "Quelle langue aimerais-tu apprendre ?",
    "Tu préfères le train ou la voiture pour voyager ?",
    "Tu fais ta valise à la dernière minute ?",
    "Tu aimes découvrir la cuisine locale en voyage ?",
    "Tu rapportes des souvenirs de voyage ?",
    "Quel endroit reste ton meilleur souvenir ?",
    "Tu préfères l'hôtel ou la location ?",
    "Tu aimerais faire un road trip ?",
    "Tu as déjà vu des aurores boréales ?",
    "Tu aimerais faire le tour du monde ?",
    "Quelle est la destination de tes rêves ?",
    "Tu aimes les musées ?",
    "Tu préfères la campagne ou la ville ?",
    "Tu aimerais vivre à l'étranger ?",
    "Tu aimes les îles tropicales ?",
    "Quel est ton moyen de transport préféré ?",
    // Personnalité / rêves
    "Quel est ton plus grand rêve ?",
    "Qu'est-ce qui te procure le plus de bonheur ?",
    "Tu te décrirais comment en trois mots ?",
    "Quelle est ta plus grande qualité ?",
    "Et ton petit défaut, c'est quoi ?",
    "Tu te sens plus à l'aise en petit comité ou en grande fête ?",
    "Qu'est-ce qui te fait rire ?",
    "Quel est ton meilleur souvenir d'enfance ?",
    "Quel métier rêvais-tu de faire enfant ?",
    "Tu crois au destin ?",
    "Tu crois aux porte-bonheur ?",
    "Quelle est ta couleur préférée ?",
    "Tu as un animal préféré ?",
    "Tu préfères les chats ou les chiens ?",
    "Tu as un animal de compagnie ?",
    "Quel super-pouvoir aimerais-tu avoir ?",
    "Si tu gagnais au loto, que ferais-tu ?",
    "Quelle époque aurais-tu aimé connaître ?",
    "Tu fais des listes pour t'organiser ?",
    "Qu'est-ce qui te stresse le plus ?",
    "Comment tu te détends après une longue journée ?",
    "Tu as de la patience en général ?",
    "Quel conseil donnerais-tu à la personne que tu étais il y a dix ans ?",
    "Qu'est-ce qui te motive le matin ?",
    "Tu aimes les surprises ?",
    "Quelle est la chose la plus folle que tu aies faite ?",
    "Tu as peur de quelque chose ?",
    "Tu préfères écouter ou parler ?",
    "Qu'est-ce que tu apprécies chez tes amis ?",
    "Tu gardes facilement les secrets ?",
    "Quel est ton mot préféré en français ?",
    "Tu as une citation qui t'inspire ?",
    "Quelle est ta plus belle réussite ?",
    "Tu préfères planifier ou improviser ?",
    "Tu aimes prendre des décisions sur un coup de tête ?",
    // Conversation
    "Qu'est-ce que tu aimes dans nos conversations ?",
    "Tu te souviens de ce dont on a parlé tout à l'heure ?",
    "Tu me poses une question à ton tour ?",
    "Qu'est-ce que tu aimerais savoir sur moi ?",
    "Comment imagines-tu un rendez-vous parfait ?",
    "Tu préfères un dîner aux chandelles ou une balade au parc ?",
    "Quel est ton compliment préféré ?",
    "Tu crois au coup de foudre ?",
    "Qu'est-ce qui compte le plus pour toi dans une relation ?",
    "Tu aimes recevoir des messages le matin ?",
    "Raconte-moi une anecdote amusante.",
    "Tu connais une bonne blague ?",
    "Tu veux jouer à un petit jeu de questions ?",
    "Choisis un sujet de conversation, je te suis.",
    "Tu préfères parler de toi ou de moi ?",
    "Si on passait une journée ensemble, on ferait quoi ?",
    "Tu aimes les longues discussions le soir ?",
    "Quel serait notre plan idéal pour un dimanche ?",
    "Tu préfères les appels ou les messages ?",
    "Dis-moi quelque chose que peu de gens savent sur toi.",
    "Qu'est-ce que tu penses de moi jusqu'ici ?",
    "Tu es de bonne humeur quand je t'écris ?",
    "Tu me racontes ta journée idéale ?",
    "Quelle question aimerais-tu qu'on te pose plus souvent ?",
    "Tu as une question bizarre à me poser ?",
    // Divers
    "Tu aimes l'odeur de la pluie ?",
    "Tu aimes regarder les étoiles ?",
    "Tu te lèves tôt le week-end ?",
    "Tu aimes les feux de cheminée en hiver ?",
    "Tu fais des bonshommes de neige en hiver ?",
    "Quelle invention trouves-tu la plus utile ?",
    "Tu t'intéresses à l'astronomie ?",
    "Tu aimes la technologie ?",
    "Tu utilises beaucoup ton téléphone ?",
    "Tu envoies souvent des photos à tes proches ?",
    "Quelle application tu ne pourrais pas quitter ?",
    "Tu aimes l'art moderne ?",
    "Tu aimes les fleurs ? Laquelle préfères-tu ?",
    "Tu préfères les levers ou les couchers de soleil ?",
    "Qu'est-ce que tu as appris récemment ?",
  ];

  // Sélecteurs relevés dans le code de la page candy.ai (Live Actions).
  const SEL = {
    textarea: 'textarea[data-live-actions-chat-input-target="textarea"]',
    send: 'button[data-live-actions-chat-input-target="sendButton"]',
    typing: '#live-actions-typing-indicator',
  };

  const STORE_KEY = 'candyAutoChat.v1';
  const $ = (s) => document.querySelector(s);

  // ---------------------------------------------------------------------------
  // État persistant (localStorage)
  // ---------------------------------------------------------------------------
  function shuffledIndexes() {
    const a = PHRASES.map((_, i) => i);
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(STORE_KEY));
      if (s && Array.isArray(s.queue) && s.total === PHRASES.length) return s;
    } catch (e) { /* stockage vide ou illisible */ }
    return { interval: 10, maxWait: 120, queue: shuffledIndexes(), total: PHRASES.length };
  }

  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* ignoré */ }
  }

  const state = load();
  let running = false;
  let runToken = 0;

  // ---------------------------------------------------------------------------
  // Attente / envoi
  // ---------------------------------------------------------------------------
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // Attend cond() == true. Retourne true, false (timeout) ou null (arrêt demandé).
  async function waitFor(cond, timeoutMs, token) {
    const end = Date.now() + timeoutMs;
    while (Date.now() < end) {
      if (token !== runToken) return null;
      if (cond()) return true;
      await sleep(250);
    }
    return cond();
  }

  // Bot prêt = bouton d'envoi actif et pas d'indicateur "en train d'écrire".
  function botReady() {
    const btn = $(SEL.send);
    return !!(btn && $(SEL.textarea) && !btn.disabled && !$(SEL.typing));
  }

  async function sendText(text, token) {
    const ta = $(SEL.textarea);
    const btn = $(SEL.send);
    if (!ta || !btn) return false;
    ta.focus();
    ta.value = text;
    ta.dispatchEvent(new Event('input', { bubbles: true }));
    btn.click();
    // Le site vide le champ quand l'envoi est accepté.
    return (await waitFor(() => ta.value === '', 3000, token)) === true;
  }

  async function run(token) {
    while (token === runToken) {
      if (state.queue.length === 0) {
        pause('Terminé : toutes les phrases ont été envoyées.');
        return;
      }

      setStatus('Attente que le bot soit prêt…');
      let r = await waitFor(botReady, state.maxWait * 1000, token);
      if (r === null) return;
      if (!r) { pause(`Bot pas prêt après ${state.maxWait} s → pause.`); return; }

      const text = PHRASES[state.queue[0]];
      const ok = await sendText(text, token);
      if (token !== runToken) return;
      if (!ok) { pause('Échec de l\'envoi (êtes-vous connecté ? une fenêtre est-elle ouverte ?) → pause.'); return; }

      state.queue.shift();
      save();
      ui.last.textContent = text;
      render();

      setStatus('Envoyé. Attente de la réponse du bot…');
      r = await waitFor(botReady, state.maxWait * 1000, token);
      if (r === null) return;
      if (!r) { pause(`Pas de réponse après ${state.maxWait} s → pause.`); return; }

      const end = Date.now() + state.interval * 1000;
      for (let left = end - Date.now(); left > 0; left = end - Date.now()) {
        if (token !== runToken) return;
        setStatus(`Réponse reçue. Prochaine phrase dans ${Math.ceil(left / 1000)} s…`);
        await sleep(Math.min(1000, left));
      }
    }
  }

  function start() {
    if (running) return;
    readSettings();
    running = true;
    runToken++;
    render();
    run(runToken);
  }

  function pause(msg) {
    running = false;
    runToken++;
    render();
    setStatus(msg || 'En pause.');
  }

  function reset() {
    pause('Liste remélangée, prête à démarrer.');
    state.queue = shuffledIndexes();
    state.total = PHRASES.length;
    save();
    ui.last.textContent = '—';
    render();
  }

  // Le site émet cet événement quand il affiche la fenêtre d'abonnement.
  document.addEventListener('upgrade-modal:displayed', () => {
    if (running) pause('Fenêtre d\'abonnement affichée par le site → pause.');
  });

  // ---------------------------------------------------------------------------
  // Panneau de contrôle
  // ---------------------------------------------------------------------------
  const ui = {};

  function buildPanel() {
    const p = document.createElement('div');
    p.id = 'cac-panel';
    p.innerHTML = `
      <style>
        #cac-panel{position:fixed;left:16px;bottom:16px;z-index:2147483647;width:280px;
          background:#1e1e24;color:#eee;border:1px solid #444;border-radius:10px;
          font:13px/1.4 system-ui,sans-serif;box-shadow:0 4px 16px rgba(0,0,0,.5)}
        #cac-panel .h{display:flex;justify-content:space-between;align-items:center;
          padding:8px 10px;background:#2b2b35;border-radius:10px 10px 0 0;cursor:pointer;font-weight:600}
        #cac-panel .b{padding:10px;display:grid;gap:8px}
        #cac-panel.min .b{display:none}
        #cac-panel label{display:flex;justify-content:space-between;align-items:center;gap:8px}
        #cac-panel input{width:70px;background:#111;color:#eee;border:1px solid #555;border-radius:4px;padding:3px 5px}
        #cac-panel .row{display:flex;gap:6px}
        #cac-panel button{flex:1;padding:6px;border:0;border-radius:6px;color:#fff;cursor:pointer;font-weight:600}
        #cac-panel button:disabled{opacity:.4;cursor:default}
        #cac-start{background:#2e7d32}#cac-pause{background:#e65100}#cac-reset{background:#455a64}
        #cac-panel .st{color:#9ecbff;min-height:2.8em}
        #cac-panel .last{color:#aaa;font-style:italic;word-break:break-word}
      </style>
      <div class="h"><span>🤖 Auto-Chat</span><span id="cac-prog"></span></div>
      <div class="b">
        <label>Délai entre phrases (s)<input id="cac-int" type="number" min="1" step="1"></label>
        <label>Attente max réponse (s)<input id="cac-max" type="number" min="10" step="5"></label>
        <div class="row">
          <button id="cac-start">▶ Démarrer</button>
          <button id="cac-pause">⏸ Pause</button>
          <button id="cac-reset" title="Remélanger et repartir de zéro">↺</button>
        </div>
        <div class="st" id="cac-st">Prêt.</div>
        <div>Dernière phrase : <span class="last" id="cac-last">—</span></div>
      </div>`;
    ui.panel = p;
    ui.prog = p.querySelector('#cac-prog');
    ui.int = p.querySelector('#cac-int');
    ui.max = p.querySelector('#cac-max');
    ui.start = p.querySelector('#cac-start');
    ui.pause = p.querySelector('#cac-pause');
    ui.reset = p.querySelector('#cac-reset');
    ui.st = p.querySelector('#cac-st');
    ui.last = p.querySelector('#cac-last');

    ui.int.value = state.interval;
    ui.max.value = state.maxWait;
    ui.int.addEventListener('change', readSettings);
    ui.max.addEventListener('change', readSettings);
    ui.start.addEventListener('click', start);
    ui.pause.addEventListener('click', () => pause());
    ui.reset.addEventListener('click', reset);
    p.querySelector('.h').addEventListener('click', () => p.classList.toggle('min'));
    render();
  }

  function readSettings() {
    const i = parseFloat(ui.int.value);
    const m = parseFloat(ui.max.value);
    state.interval = Number.isFinite(i) && i >= 1 ? i : 1;
    state.maxWait = Number.isFinite(m) && m >= 10 ? m : 10;
    ui.int.value = state.interval;
    ui.max.value = state.maxWait;
    save();
  }

  function render() {
    if (!ui.panel) return;
    const sent = state.total - state.queue.length;
    ui.prog.textContent = `${sent} / ${state.total}`;
    ui.start.disabled = running;
    ui.pause.disabled = !running;
    ui.start.textContent = sent > 0 && state.queue.length > 0 ? '▶ Reprendre' : '▶ Démarrer';
  }

  function setStatus(t) {
    if (ui.st) ui.st.textContent = t;
  }

  // Le site navigue sans recharger la page (Turbo) : on surveille la présence du chat.
  // Le panneau est attaché à <html> pour ne pas être supprimé lors d'un changement de <body>.
  buildPanel();
  setInterval(() => {
    const chat = !!$(SEL.textarea);
    const shown = ui.panel.isConnected;
    if (chat && !shown) document.documentElement.appendChild(ui.panel);
    if (!chat && shown) {
      if (running) pause('Chat introuvable (page changée) → pause.');
      ui.panel.remove();
    }
  }, 1000);
})();
