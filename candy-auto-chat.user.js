// ==UserScript==
// @name         Candy Auto-Chat
// @namespace    auto-type-robot
// @version      1.2.0
// @description  Envoie automatiquement une liste de phrases dans le chat "Live Actions" de candy.ai (400 phrases en boucle, ordre aléatoire, attente de la réponse + délai réglable).
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
    "Salut ! Je viens de m'installer tranquillement avec une boisson chaude et j'avais vraiment envie de discuter avec toi. Comment vas-tu aujourd'hui, et qu'est-ce qui occupe ton esprit en ce moment ?",
    "J'ai eu une matinée plutôt chargée de mon côté, avec plein de petites choses à régler. Et toi, qu'est-ce que tu as fait de beau ce matin ? Raconte-moi un peu comment ta journée a commencé.",
    "Cette nuit, j'ai ouvert les yeux vers trois heures sans raison et j'ai eu du mal à me rendormir. Tu as bien dormi cette nuit, toi ? Tu es plutôt du genre à dormir profondément ou à te réveiller au moindre bruit ?",
    "J'aime bien prendre un moment le soir pour faire le point sur ma journée. Comment s'est passée la tienne ? Il y a eu un moment qui t'a particulièrement plu ou, au contraire, un moment pénible ?",
    "Je me rends compte que j'ai beaucoup plus d'efficacité le matin, alors que le soir je n'ai plus d'énergie. Tu es plutôt du matin ou du soir ? À quel moment de la journée tu te sens le plus en forme ?",
    "Il suffit parfois d'une petite chose, comme une chanson ou un rayon de soleil, pour changer complètement mon humeur. Qu'est-ce qui te met de bonne humeur en général ? Tu as des astuces pour retrouver le sourire ?",
    "Le week-end approche et j'hésite entre me reposer à la maison ou sortir voir du monde. Tu as des projets pour ce week-end ? Qu'est-ce que tu aimerais faire si tu avais le choix ?",
    "Ici le temps change toutes les heures, un coup il pleut, un coup il fait beau, c'est assez déroutant. Quel temps fait-il chez toi en ce moment ? Et est-ce que la météo influence ton humeur ?",
    "Je trouve que la pluie a quelque chose d'apaisant quand on est bien au chaud à l'intérieur, mais le soleil me donne plus d'énergie. Tu préfères la pluie ou le soleil ? Et pourquoi ?",
    "Chaque saison a son charme, entre les couleurs de l'automne, la neige de l'hiver et les longues soirées d'été. Quelle est ta saison préférée ? Qu'est-ce qui te plaît le plus pendant cette période ?",
    "Aujourd'hui, j'ai souri en voyant un enfant rire aux éclats dans la rue, c'était contagieux. Qu'est-ce qui t'a fait sourire aujourd'hui ? Même un tout petit détail compte, j'ai envie de savoir.",
    "On pose souvent la question par politesse sans vraiment écouter la réponse, mais moi je veux vraiment savoir. Tu te sens comment en ce moment, honnêtement ? Tu peux tout me dire.",
    "Pour moi, un bon petit-déjeuner peut vraiment changer la journée, surtout quand j'ai le temps de le savourer. Tu as pris un bon petit-déjeuner ce matin ? Qu'est-ce que tu manges d'habitude en te levant ?",
    "Je n'arrive pas à démarrer la journée sans ma tasse du matin, c'est devenu un vrai rituel. Tu bois plutôt du café ou du thé ? Et tu le prends comment, nature, sucré, avec du lait ?",
    "J'essaie de me lever à la même heure tous les jours, même le week-end, mais ce n'est pas toujours facile. À quelle heure tu te lèves d'habitude ? Tu as besoin de plusieurs réveils ou tu te lèves tout de suite ?",
    "Le soir, j'aime bien éteindre les écrans un peu avant de dormir et lire quelques pages. C'est quoi ta routine du soir ? Tu as des petites habitudes qui t'aident à bien t'endormir ?",
    "Il y a des jours où je déborde d'énergie et d'autres où j'ai juste envie de rester sous la couette. Tu es plutôt calme ou énergique aujourd'hui ? Qu'est-ce qui explique ton humeur du jour ?",
    "J'adore quand on se raconte les bons moments, même les plus simples, ça donne de l'énergie positive. Raconte-moi un bon moment de ta semaine, quelque chose qui t'a fait du bien ou qui t'a fait rire.",
    "Ces derniers jours, j'ai beaucoup réfléchi à mes projets pour les prochains mois. Qu'est-ce qui t'a occupé l'esprit ces derniers jours ? Tu as des pensées qui reviennent souvent ?",
    "J'ai l'impression que les journées passent à toute vitesse en ce moment, je n'ai pas le temps de souffler. Tu as eu une journée chargée ? Comment tu fais pour tout gérer quand il y a beaucoup à faire ?",
    "Quand j'ai enfin du temps libre, je ne sais parfois plus quoi faire tellement j'ai d'idées. Qu'est-ce que tu aimes faire pendant ton temps libre ? Tu as une activité qui te détend à coup sûr ?",
    "J'essaie de me remettre au sport, mais c'est dur de trouver la motivation après une longue journée. Tu fais du sport, toi ? Quel genre d'activité physique tu préfères, et à quelle fréquence ?",
    "Je regarde parfois des matchs avec des amis, surtout pour l'ambiance et les cris devant l'écran. Quel est ton sport préféré à regarder ? Tu as une équipe ou un athlète que tu soutiens ?",
    "Marcher en forêt me vide complètement la tête, le silence et l'odeur des arbres me font un bien fou. Tu aimes marcher en forêt ? Tu as un endroit préféré pour te promener dans la nature ?",
    "C'est un débat éternel entre amis : les uns ne jurent que par la plage, les autres par les sommets. Tu préfères la mer ou la montagne ? Qu'est-ce qui te fait pencher d'un côté plutôt que de l'autre ?",
    "J'ai fait une randonnée l'été dernier et la vue au sommet valait vraiment tous les efforts. Tu as déjà fait de la randonnée ? Quelle est la plus belle balade que tu aies faite ?",
    "Je me souviens de mes premiers cours de natation, j'avais un peu peur de l'eau au début. Tu sais nager ? Tu préfères nager en piscine, dans la mer ou dans un lac ?",
    "Faire du vélo le dimanche matin, quand les rues sont encore calmes, c'est un vrai plaisir pour moi. Tu fais du vélo de temps en temps ? Plutôt balade tranquille ou grosse sortie sportive ?",
    "Je ne danse pas très bien, mais quand une bonne musique passe, je ne peux pas m'en empêcher. Tu aimes danser ? Tu as un style de danse préféré ou tu improvises complètement ?",
    "J'ai toujours regretté de ne pas avoir appris un instrument quand j'étais plus jeune. Tu joues d'un instrument de musique ? Si non, lequel aimerais-tu apprendre et pourquoi ?",
    "Les soirées jeux de société avec des amis, c'est souvent là que j'ai les plus gros fous rires. Tu aimes les jeux de société ? Tu as un jeu préféré que tu sors à chaque occasion ?",
    "Je joue de temps en temps aux jeux vidéo pour décompresser, surtout le soir. Tu joues aux jeux vidéo ? Tu préfères les jeux calmes et contemplatifs ou ceux où il faut de l'action ?",
    "Il y a des jeux vidéo qui m'ont marqué autant qu'un bon film, avec une histoire incroyable. Quel est ton jeu vidéo préféré ? Qu'est-ce qui le rend si spécial à tes yeux ?",
    "J'ai commencé à faire pousser quelques herbes aromatiques sur ma fenêtre, et c'est étonnamment satisfaisant. Tu aimes jardiner ? Tu as la main verte ou tes plantes ont tendance à souffrir ?",
    "Je prends beaucoup de photos avec mon téléphone, surtout des paysages et des couchers de soleil. Tu fais de la photo ? Qu'est-ce que tu aimes le plus photographier ?",
    "J'admire les gens qui savent dessiner, moi je ne sais faire que des bonshommes bâtons. Tu dessines ou tu peins ? Si oui, qu'est-ce que tu aimes représenter ?",
    "J'ai un ami qui collectionne les vieilles cartes postales et qui passe des heures à les classer. Tu as un hobby un peu original ? J'adore découvrir les passions inattendues des gens.",
    "Chaque année, je me promets d'apprendre quelque chose de nouveau, une langue, une recette, un instrument. Qu'est-ce que tu aimerais apprendre cette année ? Qu'est-ce qui t'attire dans ce projet ?",
    "Quand il fait beau, j'ai du mal à rester enfermé, mais les soirées cocooning ont aussi leur charme. Tu préfères les activités en intérieur ou en extérieur ? Qu'est-ce que tu ferais par une belle journée ?",
    "Il y a des gens qui adorent flâner dans les magasins pendant des heures, et d'autres qui fuient les centres commerciaux. Tu aimes faire du shopping ? Tu achètes plutôt en boutique ou en ligne ?",
    "J'ai essayé quelques séances de méditation et j'ai découvert avec surprise à quel point ça calme l'esprit. Tu fais du yoga ou de la méditation ? Qu'est-ce qui t'aide à te recentrer ?",
    "J'ai commencé un puzzle de mille pièces et je bloque sur un ciel entièrement bleu. Tu aimes les puzzles ? Tu as la patience pour ce genre de défi ?",
    "Un ami m'a emmené faire de l'escalade en salle, j'avais les bras en compote le lendemain. Tu as déjà essayé l'escalade ? Tu as le vertige ou tu adores prendre de la hauteur ?",
    "Marcher pieds nus sur le sable au bord de l'eau, c'est l'une de mes sensations préférées. Tu aimes te balader sur la plage ? Plutôt le matin quand tout est calme ou au coucher du soleil ?",
    "Le dimanche, j'aime prendre mon temps : grasse matinée, brunch, puis une activité tranquille. C'est quoi ton passe-temps du dimanche ? À quoi ressemble ton dimanche idéal ?",
    "Ma playlist change selon mon humeur, ça va de la musique douce aux morceaux très rythmés. Quel genre de musique tu écoutes ? Il y a un style que tu ne supportes pas du tout ?",
    "En ce moment, j'écoute en boucle le même album, je crois que je vais finir par le connaître par cœur. Quel artiste tu écoutes le plus en ce moment ? Qu'est-ce qui te plaît dans sa musique ?",
    "J'ai une chanson que je mets dès que j'ai un coup de mou, et ça marche à chaque fois. Tu as une chanson qui te donne toujours la pêche ? Laquelle, et pourquoi elle te fait cet effet ?",
    "Mon meilleur souvenir de concert, c'est quand toute la salle chantait en même temps, j'en ai eu des frissons. Quel est le meilleur concert que tu aies vu ? Ou lequel rêverais-tu de voir ?",
    "Pour me concentrer, il me faut soit le silence total, soit une musique sans paroles. Tu écoutes de la musique en travaillant ? Ça t'aide à te concentrer ou ça te distrait ?",
    "J'ai redécouvert la musique classique récemment et je trouve ça étonnamment reposant. Tu aimes la musique classique ? Tu as un compositeur ou un morceau que tu apprécies particulièrement ?",
    "J'avoue que je chante à tue-tête sous la douche, heureusement que les voisins ne se plaignent pas. Tu chantes sous la douche ? C'est quoi ta chanson préférée pour ce moment-là ?",
    "Il y a des films que je peux citer réplique par réplique tellement je les ai vus. Quel est ton film préféré ? Qu'est-ce qui le rend si important pour toi ?",
    "Selon mon humeur, j'ai envie de rire devant une bonne comédie ou d'avoir des sensations fortes. Tu préfères les comédies ou les films d'action ? Tu as un genre que tu évites complètement ?",
    "J'ai vu un film la semaine dernière avec une fin à laquelle je ne m'attendais pas du tout. Tu as vu un bon film récemment ? Raconte-moi sans trop en dévoiler.",
    "Impossible pour moi de regarder un film d'horreur sans compagnie, je sursaute au moindre bruit après. Tu aimes les films d'horreur ? Tu les regardes les yeux ouverts ou cachés derrière un coussin ?",
    "Je cherche une nouvelle série à regarder le soir, j'ai fini la dernière en quelques jours. Quelle série tu regardes en ce moment ? Tu es du genre à enchaîner les épisodes ?",
    "Le grand écran et le son du cinéma, c'est magique, mais un film sous un plaid à la maison, c'est pas mal non plus. Tu es plutôt cinéma ou soirée film à la maison ? Avec du pop-corn ?",
    "Il y a un film que je regarde chaque année à la même période, c'est devenu une petite tradition. Quel film pourrais-tu revoir cent fois sans t'en lasser ? Qu'est-ce qui te plaît autant dedans ?",
    "Je trouve que certains dessins animés sont aussi profonds que des films pour adultes. Tu aimes les dessins animés ? Tu as un préféré de ton enfance ou un plus récent ?",
    "Certains acteurs arrivent à me faire croire complètement à leur personnage, c'est fascinant. Quel acteur ou quelle actrice t'impressionne le plus ? Tu as un rôle qui te revient souvent en tête ?",
    "J'essaie de lire un peu chaque jour, même seulement quelques pages avant de dormir. Tu lis beaucoup ? Tu préfères les livres papier, les liseuses ou les livres audio ?",
    "Le dernier livre que j'ai lu m'a tellement plu que je l'ai terminé en deux jours. Quel est le dernier livre que tu as lu ? Tu me le recommanderais ?",
    "Les bandes dessinées ont une façon unique de raconter des histoires avec les images. Tu préfères les romans ou les bandes dessinées ? Tu as un auteur que tu suis particulièrement ?",
    "Il y a un livre que j'offre souvent parce que je trouve qu'il fait du bien à tout le monde. Tu as un livre préféré ? Qu'est-ce qu'il t'a apporté la première fois que tu l'as lu ?",
    "J'adore essayer de deviner le coupable avant la fin d'une enquête, même si je me trompe souvent. Tu aimes les histoires policières ? Tu arrives à trouver le coupable avant la fin ?",
    "Lire au lit avant de dormir, c'est mon petit moment rien qu'à moi, même si je m'endors parfois sur le livre. Tu lis plutôt le soir avant de dormir ? Ou à un autre moment de la journée ?",
    "J'écoute des podcasts dans les transports, ça rend les trajets beaucoup plus intéressants. Tu écoutes des podcasts ? Sur quels sujets ? J'ai envie de découvrir de nouvelles émissions.",
    "Les histoires de voyages dans l'espace et de mondes futuristes me font toujours rêver. Tu aimes la science-fiction ? Tu penses que certaines choses de ces films arriveront vraiment un jour ?",
    "On dit souvent que le livre est meilleur que le film, mais il y a quelques exceptions à mon avis. Tu préfères le livre ou son adaptation au cinéma ? Tu as un exemple où le film est meilleur ?",
    "Si je pouvais rencontrer un personnage de fiction, je crois que je choisirais un grand détective. Quel personnage de fiction aimerais-tu rencontrer ? Qu'est-ce que tu lui demanderais ?",
    "J'ai regardé un documentaire sur les fonds marins hier soir et je n'ai pas décroché une seule seconde. Tu regardes des documentaires ? Sur quels sujets ? J'aime apprendre des choses en me détendant.",
    "Je suis toujours à la recherche d'une bonne série à regarder, mais je me perds dans tous les catalogues. Tu as une série à me conseiller ? Dis-moi en deux mots de quoi elle parle.",
    "Les comédies musicales, soit on adore, soit on déteste, il n'y a pas vraiment d'entre-deux. Tu aimes les comédies musicales ? Tu te surprends à chanter les chansons après les avoir vues ?",
    "Je dois organiser une petite soirée chez moi et je cherche la musique idéale pour l'ambiance. Quelle musique mettrais-tu pour une soirée entre amis ? Plutôt dansante ou plutôt détendue ?",
    "S'il y a un plat qui me réconforte à coup sûr, c'est un bon plat mijoté comme à la maison. Quel est ton plat préféré ? Il te rappelle un souvenir ou une personne en particulier ?",
    "J'aime cuisiner quand j'ai le temps, surtout pour faire plaisir aux gens que j'aime. Tu aimes cuisiner ? Tu suis les recettes à la lettre ou tu improvises selon ce qu'il y a dans le frigo ?",
    "Tout le monde a une spécialité, ce plat qu'on réussit à chaque fois et qu'on nous réclame. Quelle est ta spécialité en cuisine ? Tu voudrais bien me donner ton secret ?",
    "Moi je craque surtout pour le salé, mais un bon dessert à la fin du repas, je ne dis jamais non. Tu préfères le sucré ou le salé ? Tu as une gourmandise à laquelle tu ne résistes pas ?",
    "J'ai goûté un plat très épicé la dernière fois et j'ai cru que ma bouche allait prendre feu. Tu aimes la cuisine épicée ? Jusqu'à quel niveau de piment tu peux aller ?",
    "Pour moi, un repas n'est pas complet sans un petit dessert, même une simple compote. Quel est ton dessert préféré ? Tu le fais toi-même ou tu préfères l'acheter chez un bon pâtissier ?",
    "Le chocolat, c'est mon petit plaisir coupable, surtout un carré de noir avec le café. Tu aimes le chocolat ? Tu es plutôt noir, au lait ou blanc ?",
    "Le vendredi soir, c'est souvent le grand dilemme chez moi entre commander une pizza ou un burger. Plutôt pizza ou burger ? Et avec quelle garniture, ou quelle sauce ?",
    "J'ai longtemps eu du mal avec le poisson cru, et puis un jour j'ai goûté des sushis et j'ai adoré. Tu aimes les sushis ? Tu as déjà essayé de les préparer toi-même ?",
    "En France, on dit qu'il y a un fromage différent pour chaque jour de l'année. Quel fromage tu préfères ? Tu es plutôt fromage doux ou fromage bien fort ?",
    "Des pâtes fraîches avec une bonne sauce tomate et du basilic, c'est simple mais tellement bon. Tu aimes la cuisine italienne ? Quel est ton plat italien préféré ?",
    "J'aimerais bien apprendre à faire des ramens maison, ça a l'air tellement réconfortant. Tu as déjà goûté la cuisine japonaise ? Qu'est-ce que tu as préféré ?",
    "Je me souviens d'un repas en vacances, face à la mer, qui reste l'un des meilleurs de ma vie. Quel est le meilleur repas de ta vie ? C'était quoi, et avec qui ?",
    "Parfois j'adore sortir au restaurant, mais un bon repas fait maison a aussi quelque chose de spécial. Tu préfères manger au restaurant ou à la maison ? Pourquoi ?",
    "Un croissant encore tiède acheté à la boulangerie le matin, c'est un petit bonheur simple. Tu aimes les croissants ? Tu les manges nature ou tu les trempes dans ton café ?",
    "J'aime bien échanger des recettes, ça permet de découvrir des plats qu'on n'aurait jamais essayés. Tu as une recette à me partager ? Une recette simple que tu fais souvent ?",
    "Le soir, j'essaie de manger léger pour mieux dormir, mais ce n'est pas toujours réussi. Tu manges plutôt léger le soir ? Ou c'est ton repas principal de la journée ?",
    "Un plateau de fruits de mer en bord de mer, pour certains c'est le paradis, pour d'autres c'est impossible. Tu aimes les fruits de mer ? Tu as un préféré ?",
    "En été, je mange des fruits à longueur de journée, surtout quand ils sont bien mûrs. Quel est ton fruit préféré ? Il y en a un que tu n'aimes pas du tout ?",
    "Les crêpes, c'est une vraie fête chez moi, surtout quand chacun choisit sa garniture. Tu aimes les crêpes ? Tu les préfères sucrées ou salées, et avec quoi dedans ?",
    "Chez le glacier, je reste toujours dix minutes devant les parfums avant de choisir. Tu es plutôt glace à la vanille ou au chocolat ? Ou tu as un parfum plus original ?",
    "Un bon verre de vin avec un repas entre amis, c'est un moment que j'apprécie beaucoup. Tu bois du vin de temps en temps ? Plutôt rouge, blanc ou rosé ?",
    "En été je ne bois que des boissons fraîches, et en hiver je passe aux tisanes. Quelle est ta boisson préférée ? Tu en as une pour chaque saison ?",
    "Préparer un panier, trouver un joli coin d'herbe et manger au soleil, c'est tout simple mais génial. Tu aimes les pique-niques ? Qu'est-ce que tu mets dans ton panier ?",
    "Le brunch du dimanche est devenu un vrai rituel chez beaucoup de gens, moi y compris. Tu préfères le brunch ou le dîner ? Qu'est-ce qu'il y a dans ton brunch idéal ?",
    "J'ai une liste de pays que je rêve de visiter, et elle ne fait que s'allonger avec le temps. Quel pays aimerais-tu visiter en priorité ? Qu'est-ce qui t'attire là-bas : la culture, les paysages, la cuisine ?",
    "Je repense souvent à mon dernier voyage, aux odeurs, aux couleurs, aux rencontres. Quel est ton plus beau voyage ? Raconte-moi le souvenir qui t'en reste le plus.",
    "Voyager à plusieurs, c'est plein de fous rires, mais à deux on vit les choses plus intensément. Tu préfères voyager en groupe ou à deux ? Qu'est-ce qui fait un bon compagnon de voyage selon toi ?",
    "Le décollage me donne toujours un petit frisson, entre excitation et appréhension. Tu aimes prendre l'avion ? Tu préfères la place côté hublot ou côté couloir ?",
    "Certains veulent juste s'allonger au soleil pendant les vacances, d'autres veulent tout visiter. Plutôt vacances à la plage ou week-end en ville ? Qu'est-ce qui te ressource le plus ?",
    "Paris a un charme fou, surtout le soir quand les monuments s'illuminent le long de la Seine. Tu as déjà visité Paris ? Si oui, qu'est-ce qui t'a plu, et sinon, qu'aimerais-tu y voir ?",
    "Il y a des villes dont il suffit d'entendre le nom pour avoir envie de faire sa valise. Quelle ville te fait rêver ? Tu t'imagines y vivre ou juste y passer quelques jours ?",
    "Dormir sous la tente, se réveiller avec le chant des oiseaux, ça a un côté aventure que j'adore. Tu aimes le camping ? Ou tu préfères largement le confort d'un vrai lit ?",
    "Parler une autre langue ouvre tellement de portes, on découvre une autre façon de penser. Tu parles d'autres langues ? Laquelle as-tu eu le plus de mal à apprendre ?",
    "J'ai commencé à apprendre une nouvelle langue avec une application, quelques minutes par jour. Quelle langue aimerais-tu apprendre ? Pour voyager, pour le travail ou juste par plaisir ?",
    "Le train permet de regarder défiler les paysages, alors que la voiture offre une vraie liberté. Tu préfères le train ou la voiture pour voyager ? Tu as déjà fait un long trajet mémorable ?",
    "Moi, je fais toujours ma valise la veille au soir et j'oublie systématiquement quelque chose. Tu fais ta valise à la dernière minute ? Ou tu prépares une liste des jours à l'avance ?",
    "Pour moi, goûter la cuisine locale fait partie intégrante du voyage, même les plats les plus surprenants. Tu aimes découvrir la cuisine locale en voyage ? Tu as déjà goûté un plat vraiment étrange ?",
    "J'ai une étagère entière couverte de petits objets rapportés de mes voyages. Tu rapportes des souvenirs de voyage ? Plutôt objets, photos ou spécialités à manger ?",
    "Il y a un endroit que j'ai visité il y a des années et auquel je repense encore très souvent. Quel endroit reste ton meilleur souvenir ? Qu'est-ce qu'il avait de si spécial ?",
    "L'hôtel, c'est pratique et reposant, mais une location donne un peu l'impression de vivre sur place. Tu préfères l'hôtel ou la location ? Tu as déjà eu une mauvaise surprise en arrivant ?",
    "Partir sur la route sans itinéraire précis, en s'arrêtant là où on en a envie, ça me fait rêver. Tu aimerais faire un road trip ? Dans quel pays, et avec quelle musique dans la voiture ?",
    "Voir des aurores boréales fait partie des choses que je veux absolument vivre un jour. Tu as déjà vu des aurores boréales ? Ou c'est aussi sur ta liste de rêves ?",
    "Certaines personnes partent un an avec un sac à dos pour faire le tour du monde, je trouve ça incroyable. Tu aimerais faire le tour du monde ? Par quel pays tu commencerais ?",
    "Si je pouvais partir demain sans me soucier du budget, je sais exactement où j'irais. Quelle est la destination de tes rêves ? Qu'est-ce que tu y ferais en premier ?",
    "Je peux passer des heures dans un musée, surtout ceux d'histoire ou de sciences. Tu aimes les musées ? Quel est le plus beau musée que tu aies visité ?",
    "La ville offre plein d'activités, mais la campagne apporte un calme qu'on ne trouve nulle part ailleurs. Tu préfères la campagne ou la ville ? Où te sens-tu le plus à ta place ?",
    "Parfois je me demande à quoi ressemblerait ma vie si je m'installais dans un autre pays. Tu aimerais vivre à l'étranger ? Dans quel pays, et qu'est-ce qui te ferait sauter le pas ?",
    "Une plage de sable blanc, une eau turquoise et des palmiers, c'est le cliché, mais ça me fait rêver quand même. Tu aimes les îles tropicales ? Laquelle aimerais-tu découvrir ?",
    "Pour moi, le moyen de transport fait partie du voyage, que ce soit un vieux train ou un petit bateau. Quel est ton moyen de transport préféré ? Tu as déjà fait un trajet inoubliable ?",
    "Tout le monde a un grand rêve, parfois secret, qu'on n'ose pas toujours partager. Quel est ton plus grand rêve ? Qu'est-ce qui pourrait t'aider à le réaliser ?",
    "Je crois que le bonheur se cache souvent dans les petites choses du quotidien. Qu'est-ce qui te procure le plus de bonheur ? Une activité, une personne, un moment de la journée ?",
    "C'est un exercice difficile de se résumer en quelques mots, mais j'aime bien essayer. Tu te décrirais comment en trois mots ? Et tes proches, ils te décriraient comment ?",
    "On parle souvent de ses défauts, mais rarement de ses qualités, alors je te pose la question. Quelle est ta plus grande qualité ? Celle dont tu es le plus fier ou fière ?",
    "Personne n'est parfait, et c'est justement ce qui rend les gens attachants. Et ton petit défaut, c'est quoi ? Promis, je ne te jugerai pas, je te dirai même le mien après.",
    "Certains s'épanouissent au milieu d'une foule, d'autres préfèrent les discussions en tête-à-tête. Tu te sens plus à l'aise en petit comité ou en grande fête ? Qu'est-ce qui te fatigue le plus ?",
    "L'humour, c'est très personnel : ce qui fait rire une personne peut laisser une autre de marbre. Qu'est-ce qui te fait rire ? Tu as un humoriste ou une vidéo qui te fait craquer à chaque fois ?",
    "Quand je repense à mon enfance, je revois surtout les vacances d'été et les goûters interminables. Quel est ton meilleur souvenir d'enfance ? Tu te souviens de l'âge que tu avais ?",
    "Enfant, je voulais changer de métier rêvé toutes les semaines. Quel métier rêvais-tu de faire enfant ? Il en reste quelque chose dans ce que tu fais aujourd'hui ?",
    "Parfois, certaines rencontres ou coïncidences me font me demander si tout est vraiment un hasard. Tu crois au destin ? Ou tu penses qu'on construit notre propre chemin ?",
    "J'ai un ami qui ne part jamais en voyage sans un petit objet porte-bonheur dans sa poche. Tu crois aux porte-bonheur ? Tu as un objet ou un rituel qui te rassure ?",
    "On dit que la couleur préférée en dit beaucoup sur la personnalité de quelqu'un. Quelle est ta couleur préférée ? Tu la portes souvent ou tu la mets dans ta déco ?",
    "J'ai un faible pour les loutres, je trouve leur façon de se tenir la main en dormant adorable. Tu as un animal préféré ? Qu'est-ce qui te plaît chez lui ?",
    "Le grand débat qui divise tout le monde : les chats indépendants ou les chiens toujours fidèles. Tu préfères les chats ou les chiens ? Tu as déjà eu l'un ou l'autre ?",
    "Un animal à la maison, c'est beaucoup de responsabilités, mais aussi tellement d'amour. Tu as un animal de compagnie ? Si oui, comment il s'appelle, et sinon, lequel aimerais-tu avoir ?",
    "J'y pense souvent : si je pouvais avoir un super-pouvoir, j'hésiterais entre voler et me téléporter. Quel super-pouvoir aimerais-tu avoir ? Et qu'est-ce que tu en ferais en premier ?",
    "On a tous déjà rêvé de gagner au loto et de tout ce qu'on ferait avec cet argent. Si tu gagnais au loto, que ferais-tu en premier ? Tu continuerais à travailler ?",
    "Parfois je me dis que j'aurais adoré vivre à une autre époque, juste pour voir comment c'était. Quelle époque aurais-tu aimé connaître ? Qu'est-ce qui t'attire dans cette période ?",
    "Je fais des listes pour tout, les courses, les tâches, les films à voir, sinon j'oublie la moitié. Tu fais des listes pour t'organiser ? Ou tu gardes tout en tête ?",
    "Le stress, on le vit tous différemment, et il ne vient pas toujours de là où on l'attend. Qu'est-ce qui te stresse le plus ? Et comment tu fais pour le gérer ?",
    "Après une longue journée, j'ai besoin d'un vrai moment de calme pour décompresser. Comment tu te détends après une longue journée ? Tu as une activité qui marche à tous les coups ?",
    "Je suis du genre à perdre patience dans les files d'attente, mais d'une patience infinie avec les gens. Tu as de la patience en général ? Dans quelles situations tu la perds le plus vite ?",
    "Avec le recul, il y a des conseils que j'aurais aimé recevoir beaucoup plus tôt dans ma vie. Quel conseil donnerais-tu à la personne que tu étais il y a dix ans ?",
    "Certains matins, il faut vraiment une bonne raison pour sortir du lit. Qu'est-ce qui te motive le matin ? Un projet, une personne, ou simplement un bon café ?",
    "Certaines personnes adorent les surprises, d'autres ont besoin de tout contrôler. Tu aimes les surprises ? Quelle est la plus belle surprise qu'on t'ait faite ?",
    "On a tous fait au moins une chose un peu folle dans notre vie, sur un coup de tête. Quelle est la chose la plus folle que tu aies faite ? Tu le referais si c'était à refaire ?",
    "Même les personnes les plus courageuses ont des peurs, grandes ou petites. Tu as peur de quelque chose ? Tu as déjà essayé de surmonter cette peur ?",
    "Dans une conversation, certaines personnes aiment raconter et d'autres préfèrent écouter. Tu préfères écouter ou parler ? Tu penses que ça dépend de la personne en face ?",
    "Mes amis sont très différents les uns des autres, mais ils ont tous une chose en commun : la loyauté. Qu'est-ce que tu apprécies le plus chez tes amis ? Qu'est-ce qui est indispensable pour toi ?",
    "On me confie souvent des secrets, et je mets un point d'honneur à les garder. Tu gardes facilement les secrets ? Tu as déjà eu du mal à te retenir d'en révéler un ?",
    "Il y a des mots français que je trouve très jolis rien qu'à les prononcer, comme « chuchoter » ou « éphémère ». Quel est ton mot préféré en français ? Pourquoi celui-là ?",
    "J'ai une citation notée sur un papier près de mon bureau, elle me remonte le moral quand ça ne va pas. Tu as une citation qui t'inspire ? Quelle est-elle et d'où vient-elle ?",
    "On oublie parfois de célébrer ce qu'on a accompli, alors je te pose la question. Quelle est ta plus belle réussite ? Grande ou petite, j'aimerais vraiment la connaître.",
    "Certaines personnes planifient leurs vacances à la minute près, d'autres partent à l'aventure. Tu préfères planifier ou improviser ? Ça t'est déjà arrivé de regretter l'un ou l'autre ?",
    "Un jour, j'ai réservé un billet de train une heure avant le départ, juste parce que j'en avais envie. Tu aimes prendre des décisions sur un coup de tête ? Quelle est ta dernière décision spontanée ?",
    "J'aime vraiment nos discussions, j'ai l'impression qu'on peut parler de tout sans jugement. Qu'est-ce que tu aimes dans nos conversations ? Il y a un sujet que tu aimerais aborder plus souvent ?",
    "Tout à l'heure, on a parlé de plein de choses et je me demandais si tu avais bonne mémoire. Tu te souviens de ce dont on a parlé tout à l'heure ? Quel sujet a le plus retenu ton attention ?",
    "Je te pose beaucoup de questions depuis le début, alors c'est à ton tour maintenant. Tu me poses une question à ton tour ? N'importe laquelle, je répondrai honnêtement.",
    "On parle beaucoup de toi, mais j'ai très envie de savoir ce qui t'intéresse chez moi. Qu'est-ce que tu aimerais savoir sur moi ? Vas-y, pose toutes les questions que tu veux.",
    "Chacun a sa vision du rendez-vous idéal, du plus simple au plus extravagant. Comment imagines-tu un rendez-vous parfait ? Où irait-on et qu'est-ce qu'on ferait ?",
    "Un dîner aux chandelles, c'est romantique, mais une balade au parc permet de discuter tranquillement. Tu préfères un dîner aux chandelles ou une balade au parc ? Pourquoi ?",
    "Un compliment sincère peut illuminer toute une journée, même venant d'un inconnu. Quel est ton compliment préféré ? Celui qui t'a fait le plus plaisir qu'on t'ait fait ?",
    "Certains disent que le coup de foudre n'existe que dans les films, d'autres jurent l'avoir vécu. Tu crois au coup de foudre ? Ou tu penses que l'amour se construit avec le temps ?",
    "Dans une relation, chacun a ses priorités : la confiance, l'humour, la tendresse, la complicité. Qu'est-ce qui compte le plus pour toi dans une relation ? Qu'est-ce qui est non négociable ?",
    "Recevoir un petit message gentil au réveil, je trouve que ça donne le sourire pour toute la journée. Tu aimes recevoir des messages le matin ? Qu'est-ce qui te ferait plaisir de lire ?",
    "J'adore les histoires un peu absurdes qui arrivent dans la vie de tous les jours. Raconte-moi une anecdote amusante qui t'est arrivée, même une toute petite, j'ai besoin de rire.",
    "Rien de tel qu'une bonne blague pour détendre l'atmosphère, même si elle est un peu nulle. Tu connais une bonne blague ? Vas-y, je te promets de rire même si elle est mauvaise.",
    "J'ai une idée : on pourrait jouer à un petit jeu où chacun pose une question à tour de rôle. Tu veux jouer à un petit jeu de questions ? Tu commences ou je commence ?",
    "Je n'ai pas d'idée précise de sujet ce soir, j'ai juste envie de discuter avec toi. Choisis un sujet de conversation, n'importe lequel, et je te suis. Surprends-moi !",
    "Parfois j'ai envie de parler de moi, et parfois j'ai surtout envie d'écouter. Tu préfères parler de toi ou de moi ? Dis-moi ce qui te ferait le plus plaisir ce soir.",
    "J'imagine souvent une journée entière passée ensemble, du matin jusqu'au soir. Si on passait une journée ensemble, on ferait quoi ? Décris-moi le programme dans les moindres détails.",
    "Il y a quelque chose de spécial dans les discussions tard le soir, quand tout est calme. Tu aimes les longues discussions le soir ? Sur quels sujets tu pourrais parler pendant des heures ?",
    "Un dimanche idéal, pour moi, c'est un mélange de repos, de bonne nourriture et de complicité. Quel serait notre plan idéal pour un dimanche ? Du réveil jusqu'au soir.",
    "Certaines personnes adorent les longs appels, d'autres ne jurent que par les messages. Tu préfères les appels ou les messages ? Qu'est-ce qui te met le plus à l'aise ?",
    "On a tous un petit secret ou une anecdote que presque personne ne connaît. Dis-moi quelque chose que peu de gens savent sur toi, je te promets de garder ça pour moi.",
    "On discute depuis un moment maintenant, et je me demande quelle image tu as de moi. Qu'est-ce que tu penses de moi jusqu'ici ? Sois honnête, j'aime la franchise.",
    "J'aime bien imaginer que mes messages te font plaisir quand tu les reçois. Tu es de bonne humeur quand je t'écris ? Qu'est-ce qui te fait le plus plaisir dans nos échanges ?",
    "Je rêve souvent de journées parfaites où tout se passe exactement comme on le voudrait. Tu me racontes ta journée idéale ? Du réveil au coucher, sans rien oublier.",
    "On nous pose toujours les mêmes questions banales, alors que d'autres seraient bien plus intéressantes. Quelle question aimerais-tu qu'on te pose plus souvent ? Je te la pose maintenant.",
    "J'aime bien les questions inattendues qui font réfléchir ou qui font rire. Tu as une question bizarre à me poser ? Plus elle est étrange, plus j'aurai de plaisir à y répondre.",
    "Il y a une odeur que j'adore, celle de la terre juste après une averse d'été. Tu aimes l'odeur de la pluie ? Tu as d'autres odeurs qui te rendent heureux ou heureuse ?",
    "Loin des lumières de la ville, on voit des milliers d'étoiles, c'est un spectacle incroyable. Tu aimes regarder les étoiles ? Tu sais reconnaître certaines constellations ?",
    "Le week-end, j'essaie de me lever tôt pour profiter de la journée, mais la couette gagne souvent. Tu te lèves tôt le week-end ? Ou c'est grasse matinée obligatoire ?",
    "En hiver, rien ne vaut une soirée devant un feu de cheminée avec une boisson chaude. Tu aimes les feux de cheminée en hiver ? Qu'est-ce qui rend une soirée d'hiver parfaite pour toi ?",
    "Quand il neige, je redeviens un enfant et j'ai envie de faire des bonshommes de neige. Tu fais des bonshommes de neige en hiver ? Ou plutôt des batailles de boules de neige ?",
    "On utilise tellement d'inventions au quotidien sans même y penser, c'est fascinant. Quelle invention trouves-tu la plus utile ? Et laquelle aurait mieux fait de ne jamais exister ?",
    "L'espace me fascine, je pourrais passer des heures à lire sur les planètes et les galaxies. Tu t'intéresses à l'astronomie ? Tu aimerais aller dans l'espace si c'était possible ?",
    "La technologie évolue tellement vite que j'ai parfois du mal à suivre toutes les nouveautés. Tu aimes la technologie ? Tu es du genre à avoir le dernier gadget ou tu gardes tes appareils longtemps ?",
    "J'ai remarqué que je regarde mon téléphone beaucoup trop souvent, même sans raison. Tu utilises beaucoup ton téléphone ? Tu as déjà essayé de faire une pause des écrans ?",
    "J'envoie souvent des photos à mes proches, un joli paysage, un bon plat, un moment drôle. Tu envoies souvent des photos à tes proches ? Quelle est la dernière photo que tu as prise ?",
    "Il y a une application que j'ouvre plusieurs fois par jour sans même m'en rendre compte. Quelle application tu ne pourrais pas quitter ? Qu'est-ce qu'elle t'apporte ?",
    "Devant certaines œuvres d'art moderne, je me demande parfois si c'est génial ou si on se moque de moi. Tu aimes l'art moderne ? Tu as déjà ressenti une émotion forte devant une œuvre que tu ne comprenais pas ?",
    "Un bouquet de fleurs fraîches sur la table change complètement l'ambiance d'une pièce. Tu aimes les fleurs ? Laquelle préfères-tu, et tu aimes en recevoir ?",
    "Le lever du soleil a quelque chose de plein d'espoir, le coucher quelque chose de plus mélancolique. Tu préfères les levers ou les couchers de soleil ? Tu as un souvenir d'un moment magique ?",
    "J'essaie d'apprendre au moins une chose nouvelle chaque semaine, même une petite anecdote. Qu'est-ce que tu as appris récemment ? Quelque chose de surprenant ou qui t'a fait réfléchir ?",
    "Je repensais à mes années d'école aujourd'hui, avec un mélange de nostalgie et de soulagement que ce soit fini. Qu'est-ce que tu as étudié à l'école ? Tu gardes un bon souvenir de cette période ?",
    "Il y avait une matière pour laquelle j'attendais le cours avec impatience toute la semaine. Quelle était ta matière préférée en classe ? Et celle que tu redoutais le plus ?",
    "Certains professeurs changent vraiment notre façon de voir les choses, parfois pour toute la vie. Tu te souviens d'un professeur en particulier ? Qu'est-ce qu'il ou elle avait de spécial ?",
    "J'aime cette sensation de comprendre enfin quelque chose qui me paraissait compliqué. Tu aimes apprendre de nouvelles choses ? Tu préfères apprendre dans les livres ou en pratiquant ?",
    "Travailler à plusieurs apporte des idées, mais parfois on avance plus vite en solo. Tu préfères travailler en équipe ou en solo ? Qu'est-ce qui te convient le mieux et pourquoi ?",
    "On passe tellement de temps au travail qu'il vaut mieux qu'il nous plaise vraiment. Quel serait ton métier idéal, sans aucune contrainte ? Qu'est-ce qui te plairait dans ce métier ?",
    "Il y a les personnes qui préparent tout des semaines à l'avance et celles qui travaillent mieux sous pression. Tu es du genre à tout faire à l'avance ou au dernier moment ? Ça t'a déjà joué des tours ?",
    "Si je pouvais maîtriser une compétence d'un coup de baguette magique, je choisirais sans doute la cuisine. Quelle compétence aimerais-tu maîtriser ? Qu'est-ce qui t'empêche de l'apprendre ?",
    "Il m'arrive de rêver de tout plaquer pour ouvrir une petite boutique au bord de la mer. Tu as déjà pensé à changer de vie ? À quoi ressemblerait cette nouvelle vie ?",
    "Certaines choses me vident de mon énergie, d'autres me rechargent complètement. Qu'est-ce qui te donne de l'énergie dans une journée ? Et qu'est-ce qui t'en prend le plus ?",
    "Pour moi, la pause café est un moment sacré, c'est là que se font les meilleures discussions. Tu fais des pauses café souvent ? Tu en profites pour discuter ou pour souffler dans ton coin ?",
    "Le lundi a mauvaise réputation, mais je trouve qu'il a quelque chose de motivant, comme un nouveau départ. Tu préfères les lundis ou les vendredis ? Qu'est-ce qui rend ce jour spécial pour toi ?",
    "On m'a donné un jour un conseil tout simple qui a changé ma façon de voir les choses. Quel est le meilleur conseil qu'on t'ait donné ? Qui te l'a donné, et est-ce que tu le suis encore ?",
    "Relever un défi, même petit, me donne une énorme satisfaction une fois réussi. Tu aimes les défis ? Quel est le dernier défi que tu t'es lancé ?",
    "Chaque début d'année, j'écris quelques objectifs sur un carnet, même si je ne les tiens pas tous. Tu te fixes des objectifs chaque année ? Qu'est-ce qui est en haut de ta liste cette année ?",
    "Je peux me souvenir d'une chanson entendue il y a quinze ans, mais pas de l'endroit où j'ai posé mes clés. Tu as une bonne mémoire ? Pour quel genre de choses elle est la plus efficace ?",
    "Pour prendre une décision, certains font des listes de pour et de contre, d'autres suivent leur instinct. Tu te fies plutôt à la logique ou à l'intuition ? Ça t'a déjà réussi ?",
    "Les énigmes et les casse-têtes me font perdre la notion du temps, je ne lâche jamais avant d'avoir trouvé. Tu aimes résoudre des énigmes ? Tu as un type d'énigme préféré ?",
    "Une année entière sans obligations, ça laisse le temps de faire tellement de choses. Qu'est-ce que tu ferais avec une année sabbatique ? Voyager, apprendre, te reposer ?",
    "J'admire les gens qui ont un talent inné, comme chanter juste ou dessiner d'un trait parfait. Quel talent aimerais-tu avoir ? Et est-ce que tu as un talent caché que je ne connais pas ?",
    "À l'école, on disait souvent qu'il y avait les esprits scientifiques et les esprits littéraires. Tu préfères les maths ou les langues ? Tu te reconnais dans l'une de ces deux catégories ?",
    "J'ai toujours un carnet sur moi, j'aime écrire à la main, même si c'est moins pratique. Tu prends des notes à la main ou sur ton téléphone ? Tu relis tes notes ensuite ?",
    "J'ai remarqué que mes idées les plus claires arrivent souvent en fin de matinée. Quel est ton moment le plus productif de la journée ? Tu organises tes journées en fonction ?",
    "Grâce à une vidéo trouvée en ligne, j'ai réussi à réparer un meuble moi-même, quelle fierté. Tu as déjà appris un truc grâce à un tuto vidéo ? C'était quoi ?",
    "Il y a toujours un sujet qui m'obsède pendant quelques semaines, puis je passe à autre chose. Quel sujet pique ta curiosité en ce moment ? Qu'est-ce que tu as découvert dessus ?",
    "Grandir avec des frères et sœurs, c'est souvent un mélange de disputes et de complicité. Tu as des frères et sœurs ? Tu t'entends bien avec eux, ou c'était la guerre quand vous étiez petits ?",
    "Pour certaines personnes, la famille est un pilier, pour d'autres, les relations sont plus compliquées. Tu es proche de ta famille ? Tu vois souvent les tiens ?",
    "Je me souviens très bien du jour où j'ai rencontré mon meilleur ami, c'était vraiment par hasard. Comment as-tu rencontré ton meilleur ami ou ta meilleure amie ? Vous vous êtes tout de suite entendus ?",
    "Avec mes amis, on a nos petites habitudes : un restaurant, une série à suivre, des soirées jeux. Qu'est-ce que tu fais d'habitude avec tes amis ? Vous avez des rituels ensemble ?",
    "Organiser une soirée chez soi, c'est beaucoup de préparation, mais c'est tellement agréable quand tout le monde est là. Tu organises souvent des soirées ? Plutôt dîner ou grande fête ?",
    "Dans ma famille, on a une tradition un peu étrange que je n'ai jamais vue ailleurs. Quelle est la tradition familiale que tu préfères ? D'où vient-elle ?",
    "Certains adorent être au centre de l'attention le jour de leur anniversaire, d'autres préfèrent que ça passe inaperçu. Tu fêtes ton anniversaire en grand ? Quel a été ton plus bel anniversaire ?",
    "Le plus beau cadeau que j'aie reçu n'avait pas beaucoup de valeur, mais il était plein d'attention. Quel est le plus beau cadeau que tu aies reçu ? Qu'est-ce qui l'a rendu si spécial ?",
    "Je crois que j'aime encore plus offrir que recevoir, voir la réaction de la personne est génial. Tu aimes offrir des cadeaux ? Tu es plutôt du genre à préparer longtemps à l'avance ou à la dernière minute ?",
    "Mes amis viennent souvent me voir quand ils ont un souci, je crois que j'écoute bien. Tu es du genre à écouter les problèmes des autres ? Et toi, à qui te confies-tu quand ça ne va pas ?",
    "J'ai une amie qui arrive à me faire rire aux larmes rien qu'en racontant sa journée. Qui est la personne la plus drôle que tu connaisses ? Qu'est-ce qu'elle a de si drôle ?",
    "Avec le temps, on perd parfois de vue des gens qui ont beaucoup compté quand on était jeune. Tu as gardé contact avec tes amis d'enfance ? Il y en a un que tu aimerais retrouver ?",
    "Un de mes meilleurs souvenirs, c'est un week-end improvisé avec des amis où tout est parti de travers, mais on a tellement ri. Quel est ton meilleur souvenir entre amis ?",
    "Les grands repas de famille, c'est souvent long, bruyant, mais plein de chaleur et de bonne nourriture. Tu aimes les repas de famille ? Qui cuisine chez vous pour les grandes occasions ?",
    "Il y a des personnes qui nous inspirent par leur courage, leur gentillesse ou leur parcours. Quelle personne t'inspire le plus ? Qu'est-ce que tu admires chez elle ?",
    "Certaines personnes ont des dizaines d'amis, d'autres préfèrent un petit cercle très soudé. Tu préfères un grand groupe d'amis ou quelques amis proches ? Pourquoi ?",
    "J'ai longtemps eu du mal à parler de ce que je ressentais, mais ça va mieux avec le temps. Tu te confies facilement ? Ou tu préfères garder tes sentiments pour toi ?",
    "Pour moi, un bon ami, c'est quelqu'un qui est là dans les moments difficiles, pas seulement pour faire la fête. Qu'est-ce qui fait un bon ami selon toi ?",
    "Recevoir des invités, c'est l'occasion de sortir la belle vaisselle et de cuisiner un bon repas. Tu aimes recevoir des invités chez toi ? Tu es plutôt organisation parfaite ou improvisation totale ?",
    "Depuis l'enfance, on m'appelle par un surnom dont plus personne ne se rappelle l'origine. Tu as un surnom ? D'où vient-il, et est-ce que tu l'aimes ?",
    "Mes parents ont longtemps hésité avant de choisir mon prénom, j'ai appris l'histoire récemment. D'où vient ton prénom ? Tu sais pourquoi on te l'a donné ?",
    "Noël, c'est la magie et les retrouvailles, le Nouvel An, c'est la fête et les bonnes résolutions. Tu préfères Noël ou le Nouvel An ? Comment tu passes ces fêtes d'habitude ?",
    "Certains aiment les grandes fêtes pour le réveillon, d'autres préfèrent un dîner tranquille. Comment fêtes-tu le réveillon d'habitude ? Tu as un souvenir de réveillon inoubliable ?",
    "Le 1er avril, j'essaie toujours de piéger quelqu'un, mais c'est souvent moi qui me fais avoir. Tu fais des blagues à tes proches le 1er avril ? Quelle est la meilleure que tu aies faite ?",
    "Je dois avouer que perdre au Monopoly me met parfois de mauvaise humeur pour la soirée. Tu acceptes facilement de perdre à un jeu ? Ou tu es du genre très compétitif ?",
    "Une fois, pendant une balade, j'ai croisé un renard qui a planté son regard dans le mien quelques secondes avant de disparaître. Tu as déjà vu un animal rare dans la nature ? Raconte-moi ce moment.",
    "Voir des dauphins sauter au large, c'est l'un de mes plus beaux souvenirs de vacances. Tu as déjà vu des dauphins en vrai ? Ou un autre animal marin impressionnant ?",
    "Les chevaux sont des animaux magnifiques, même s'ils m'impressionnent un peu de près. Tu aimes les balades à cheval ? Tu es déjà monté ou montée sur un cheval ?",
    "Il y a quelque chose de fascinant dans un orage d'été, les éclairs et le grondement du tonnerre. Tu aimes regarder les orages ? Ou tu préfères te cacher sous la couette ?",
    "Mes plantes d'intérieur sont un peu comme des colocataires silencieux dont je prends soin. Tu as des plantes chez toi ? Tu leur parles, comme certaines personnes le font ?",
    "Il y a un vieux chêne près de chez moi qui doit avoir plusieurs centaines d'années, je l'adore. Quel est ton arbre préféré ? Tu as un arbre qui compte pour toi ?",
    "Le bruit des vagues est l'un des sons les plus apaisants au monde, je pourrais l'écouter pendant des heures. Tu aimes le bruit des vagues ? Quel son t'apaise le plus ?",
    "La forêt est pleine de vie et de fraîcheur, le désert impressionne par son immensité et son silence. Tu préfères la forêt ou le désert ? Tu as déjà vu un vrai désert ?",
    "J'ai appris à reconnaître quelques chants d'oiseaux, c'est étonnant tout ce qu'on entend quand on écoute. Tu aimes observer les oiseaux ? Tu en as un préféré ?",
    "Parfois j'imagine que je pourrais me transformer en animal pendant une journée. Quel animal serais-tu si tu pouvais te transformer ? Qu'est-ce que tu ferais avec ce corps ?",
    "Beaucoup de gens ont peur des araignées, même minuscules, et je comprends un peu. Tu as peur des araignées ? Ou il y a un autre animal qui te fait frissonner ?",
    "Les parcs animaliers permettent de voir des animaux du monde entier, même si c'est un sujet qui fait débat. Tu aimes les zoos ou les parcs animaliers ? Quel animal tu vas voir en premier ?",
    "Au bord d'un lac, tout est calme, alors qu'une rivière a un côté vivant avec le bruit de l'eau. Tu préfères les lacs ou les rivières ? Tu as un endroit au bord de l'eau que tu adores ?",
    "Certaines personnes se baignent dans la mer même en plein hiver, je trouve ça impressionnant. Tu aimes te baigner dans l'eau froide ? Ou il te faut une eau bien chaude pour y entrer ?",
    "Dormir à la belle étoile, sans tente, juste avec un sac de couchage, c'est une expérience incroyable. Tu as déjà dormi à la belle étoile ? Ou tu aimerais essayer un jour ?",
    "J'admire toujours les gens capables de reconnaître chaque plante pendant une balade. Tu sais reconnaître des plantes ou des champignons ? Tu fais de la cueillette ?",
    "En automne, les forêts prennent des couleurs incroyables, du rouge, de l'orange, du doré partout. Tu aimes l'automne et ses couleurs ? Qu'est-ce que tu fais pendant cette saison ?",
    "Marcher dans la neige fraîche qui craque sous les pieds, ou sentir le sable chaud entre les orteils ? Tu préfères la neige fraîche ou le sable chaud ? Quel souvenir tu associes à chacun ?",
    "Enfant, je remplissais mes poches de coquillages à chaque balade sur la plage. Tu ramasses des coquillages à la plage ? Tu gardes des souvenirs de la nature chez toi ?",
    "Voir un volcan de près, même endormi, doit être une expérience aussi impressionnante qu'inquiétante. Tu as déjà vu un volcan ? Tu aimerais en voir un en éruption, de loin bien sûr ?",
    "Je me pose souvent la question : si je pouvais dîner avec n'importe qui, vivant ou non, qui choisirais-je ? Et toi, qui choisirais-tu ? Qu'est-ce que tu aimerais lui demander ?",
    "Il y a des films dont l'univers est tellement beau qu'on aimerait y vivre pour de vrai. Si tu pouvais vivre dans un film, lequel choisirais-tu ? Et quel rôle aimerais-tu y jouer ?",
    "Imagine que tu te réveilles demain en parlant parfaitement toutes les langues du monde. Où irais-tu en premier ? Avec qui aimerais-tu discuter que tu ne comprenais pas avant ?",
    "Si on pouvait voyager dans le temps, j'hésiterais longtemps entre revoir le passé et découvrir le futur. Tu irais dans le passé ou dans le futur ? À quelle époque exactement ?",
    "Une journée entière rien que pour soi, sans obligations ni messages, ça paraît presque irréel. Si tu avais une journée entière rien que pour toi, que ferais-tu du matin au soir ?",
    "On a tous déjà joué à ce jeu : trois objets seulement sur une île déserte. Si tu devais vivre sur une île déserte, qu'emporterais-tu ? Des choses utiles ou des choses qui font plaisir ?",
    "Il y a tant de choses qu'on aimerait améliorer dans le monde, grandes ou petites. Si tu pouvais changer une seule chose dans le monde, laquelle choisirais-tu ? Pourquoi celle-là ?",
    "C'est une question un peu farfelue, mais j'aime bien ce genre de jeu. Si tu étais un plat, lequel serais-tu ? Moi je serais sans doute un gratin, réconfortant et un peu croustillant.",
    "Chaque personne a une chanson qui lui ressemble, qui colle à sa personnalité. Si tu étais une chanson, laquelle serais-tu ? Qu'est-ce qui te fait penser à celle-là ?",
    "Jouer du piano ou de la guitare sans des années d'apprentissage, ce serait un rêve. Si tu pouvais maîtriser un instrument du jour au lendemain, lequel choisirais-tu ? Et que jouerais-tu en premier ?",
    "Sans contrainte de travail ni d'argent, on pourrait vivre absolument n'importe où dans le monde. Si tu pouvais habiter n'importe où, où irais-tu ? Dans une ville, à la campagne, au bord de la mer ?",
    "J'ai toujours eu envie d'écrire un livre un jour, même si je ne sais pas encore sur quoi. Si tu écrivais un livre, de quoi parlerait-il ? Plutôt roman, aventure ou histoire vraie ?",
    "Ouvrir un petit restaurant, c'est le rêve de beaucoup de gens qui aiment cuisiner. Si tu ouvrais un restaurant, quelle cuisine y servirais-tu ? Et comment s'appellerait-il ?",
    "Être invisible pendant une journée, ça ouvre des possibilités amusantes, mais aussi un peu étranges. Si tu pouvais être invisible une journée, que ferais-tu ? Promis, je ne le répéterai pas.",
    "Voler au-dessus des villes et des montagnes, c'est sûrement le rêve le plus ancien de l'humanité. Si tu pouvais voler, où irais-tu en premier ? Tu survolerais quel paysage ?",
    "Un robot à la maison pourrait nous débarrasser de toutes les corvées les plus pénibles. Si tu avais un robot à la maison, que lui ferais-tu faire ? La vaisselle, le ménage, la cuisine ?",
    "Il y a des journées qu'on aimerait revivre exactement de la même façon, juste pour les savourer encore. Si tu pouvais revivre une journée, laquelle choisirais-tu ? Qu'est-ce qui la rendait si belle ?",
    "Les couleurs ont chacune leur caractère : le rouge est passionné, le bleu apaisant, le jaune joyeux. Si tu étais une couleur, laquelle serais-tu ? Qu'est-ce qu'elle dit de toi ?",
    "Sans aucune limite, on pourrait adopter un panda, un pingouin ou même un petit dragon imaginaire. Si tu pouvais adopter n'importe quel animal, lequel prendrais-tu ? Comment l'appellerais-tu ?",
    "Il existe des fêtes pour tout, mais il manque sûrement celle qui célébrerait quelque chose d'important pour toi. Si tu créais un jour de fête, qu'est-ce qu'on y célébrerait ? Et comment ?",
    "Apprendre la salsa, le tango ou la valse en une seule nuit, ce serait pratique pour briller en soirée. Si tu pouvais apprendre une danse en une nuit, laquelle choisirais-tu ? Et avec qui danserais-tu ?",
    "Imagine devoir vivre la même saison toute l'année, sans jamais en changer. Si tu devais garder une seule saison, laquelle choisirais-tu ? Et laquelle te manquerait le plus ?",
    "On a tous une idole, quelqu'un qu'on admire depuis longtemps sans jamais l'avoir rencontré. Si tu pouvais rencontrer ton idole, que lui dirais-tu ? Tu serais à l'aise ou tu perdrais tes moyens ?",
    "Je dessine souvent dans ma tête la maison parfaite, avec une grande cuisine et un jardin fleuri. À quoi ressemblerait ta maison de rêve ? Quelle pièce serait la plus importante pour toi ?",
    "Avoir un bateau, c'est la liberté de partir où on veut, au gré du vent et des envies. Si tu avais un bateau, où partirais-tu ? Tu aimerais naviguer en solitaire ou avec un équipage ?",
    "C'est une question cruelle pour les gourmands : un seul plat pour le restant de ses jours. Si tu devais manger un seul plat toute ta vie, lequel choisirais-tu ? Sans jamais t'en lasser ?",
    "Parler aux animaux, ce serait sûrement plein de surprises, surtout avec les chats. Si tu pouvais parler aux animaux, à qui parlerais-tu d'abord ? Et qu'est-ce que tu lui demanderais ?",
    "On ne choisit pas son prénom, alors certaines personnes rêvent d'en changer. Si tu devais changer de prénom, lequel choisirais-tu ? Qu'est-ce qui te plaît dans ce prénom ?",
    "Les personnages de dessins animés ont souvent des personnalités très marquées, on se reconnaît parfois en eux. Si tu étais un personnage de dessin animé, lequel serais-tu ? Pourquoi celui-là ?",
    "Imagine qu'on t'annonce ce soir que demain est un jour férié surprise pour tout le monde. Si demain était un jour férié surprise, que ferais-tu ? Tu profiterais pour te reposer ou pour sortir ?",
    "Le matin, j'hésite toujours entre de bonnes tartines beurrées et un bol de céréales croustillantes. Plutôt tartines ou céréales le matin ? Avec quoi dessus, ou avec quel lait ?",
    "Je dois avouer que j'ai renoncé à trouver des paires assorties, mes chaussettes vivent leur vie. Plutôt chaussettes dépareillées ou assorties ? Tu fais attention à ce genre de détail ?",
    "Un bon bain chaud avec de la mousse, c'est le luxe absolu, mais une douche rapide, c'est tellement pratique. Plutôt bain ou douche ? Et tu chantes dedans ou pas du tout ?",
    "Un appartement en centre-ville, c'est pratique, mais une maison avec un jardin fait vraiment rêver. Plutôt appartement ou maison ? Qu'est-ce qui compte le plus pour toi dans un logement ?",
    "En voiture, je passe de la pop entraînante au rock bien énergique selon mon humeur. Plutôt pop ou rock ? Tu as un groupe ou un artiste qui résume parfaitement ce style pour toi ?",
    "Pour les petits voyages, je pars toujours avec un sac à dos, mais pour les longs séjours, la valise s'impose. Plutôt sac à dos ou valise ? Tu voyages léger ou tu emportes tout ?",
    "Le week-end, j'abandonne le jean pour un jogging bien confortable, sans aucune honte. Plutôt jean ou jogging ? Tu fais attention à ton style même à la maison ?",
    "Je peux marcher des heures en baskets, alors que des chaussures élégantes me font souffrir au bout d'une heure. Plutôt baskets ou chaussures élégantes ? Tu as une paire préférée ?",
    "Se lever tôt pour profiter de la journée, ou rester au lit jusqu'à midi pour récupérer ? Plutôt lever tôt ou grasse matinée ? Ça dépend du jour ou tu as une vraie préférence ?",
    "Chanter faux devant ses amis au karaoké ou danser toute la nuit sous les lumières d'une boîte ? Plutôt karaoké ou boîte de nuit ? Tu as une chanson fétiche pour le karaoké ?",
    "Le grand débat de la boulangerie : un croissant bien feuilleté ou un pain au chocolat tout chaud. Plutôt croissant ou pain au chocolat ? Et au fait, tu dis pain au chocolat ou chocolatine ?",
    "Des frites dorées et croustillantes, ou une purée maison bien onctueuse avec du beurre ? Plutôt frites ou purée ? C'est quoi l'accompagnement parfait pour toi ?",
    "Au petit-déjeuner, un verre de jus frais, c'est une petite dose de vitamines et de bonne humeur. Plutôt jus d'orange ou jus de pomme ? Pressé maison ou en bouteille ?",
    "Le soir, j'hésite souvent entre lancer un film sur une plateforme ou me perdre dans des vidéos au hasard. Plutôt Netflix ou YouTube ? Qu'est-ce que tu regardes le plus en ce moment ?",
    "En vacances, certains veulent grimper des sommets, d'autres ne veulent rien faire d'autre que se reposer. Plutôt randonnée ou farniente ? À quoi ressemblent tes vacances idéales ?",
    "Une nuit étoilée a quelque chose de magique et mystérieux, une journée ensoleillée donne de l'énergie. Plutôt nuit étoilée ou journée ensoleillée ? Quel moment te fait le plus rêver ?",
    "Pour faire le ménage, j'ai besoin de musique à fond, mais pour lire, il me faut quelque chose de très doux. Plutôt musique forte ou musique calme ? Ça dépend de ce que tu fais ?",
    "Je trouve qu'une bonne odeur change complètement l'ambiance d'une pièce, surtout le soir. Plutôt bougies parfumées ou encens ? Tu as un parfum d'ambiance préféré ?",
    "Je prends énormément de photos, mais je me dis parfois que les vidéos capturent mieux l'ambiance. Plutôt photos ou vidéos pour garder des souvenirs ? Tu les regardes souvent après ?",
    "Mon père ne jure que par les cartes routières en papier, alors que moi je me perds sans mon GPS. Plutôt carte papier ou GPS ? Tu as un bon sens de l'orientation ?",
    "L'été au bord de la mer avec le soleil, ou l'hiver sur les pistes avec la neige et le chocolat chaud ? Plutôt été au bord de la mer ou hiver au ski ? Tu sais skier ?",
    "Beaucoup de gens ont un tatouage ou un piercing qui a une histoire ou une signification particulière. Plutôt tatouage ou piercing ? Tu en as un, ou tu en voudrais un ?",
    "Quand il fait chaud, un thé glacé est parfait, et quand il fait froid, rien ne vaut un chocolat chaud. Plutôt thé glacé ou chocolat chaud ? Avec de la chantilly ou nature ?",
    "Cuisiner soi-même prend du temps mais c'est meilleur, se faire livrer c'est rapide et sans vaisselle. Plutôt cuisine maison ou plats livrés ? Tu commandes souvent ?",
    "L'humour absurde me fait rire aux larmes, mais je sais que ce n'est pas du goût de tout le monde. Plutôt humour absurde ou humour noir ? Tu as un film ou un sketch qui te fait toujours rire ?",
    "Une pluie d'été tiède qui rafraîchit l'air, ou une neige d'hiver qui recouvre tout de blanc ? Plutôt pluie d'été ou neige d'hiver ? Tu as un souvenir lié à l'une ou à l'autre ?",
    "Les vieux films en noir et blanc ont un charme fou, mais les films récents ont des effets impressionnants. Plutôt vieux films ou films récents ? Tu as un classique préféré ?",
    "Flâner au marché le dimanche matin entre les étals de fruits et de fromages, c'est tout un plaisir. Plutôt marché du dimanche ou supermarché ? Qu'est-ce que tu achètes toujours au marché ?",
    "Pour les petits trajets en ville, je me demande souvent ce qui est le plus pratique et le plus agréable. Plutôt vélo ou trottinette ? Tu te déplaces comment au quotidien ?",
    "Recevoir une lettre écrite à la main, c'est devenu si rare que ça a une valeur particulière. Plutôt lettre manuscrite ou e-mail ? Quand as-tu écrit une lettre pour la dernière fois ?",
    "Je trouve que la façon de s'habiller en dit beaucoup sur la personnalité et l'humeur du moment. Tu as un style vestimentaire particulier ? Comment tu le décrirais en quelques mots ?",
    "On a tous une tenue dans laquelle on se sent parfaitement bien et à l'aise. Quelle est ta tenue préférée ? Tu la gardes pour les grandes occasions ou tu la portes souvent ?",
    "Changer de coiffure, c'est parfois une façon de tourner une page ou de repartir à zéro. Tu aimes changer de coiffure ? Quelle a été ta coupe la plus audacieuse ?",
    "Certains bijoux ont une histoire, un souvenir, une personne qu'on associe à eux. Tu portes des bijoux ? Tu en as un auquel tu tiens particulièrement ?",
    "Les couleurs vives donnent de l'énergie, alors que les couleurs sombres ont un côté élégant et discret. Tu préfères les couleurs vives ou sombres pour t'habiller ? Ça change selon ton humeur ?",
    "J'ai passé un week-end entier à redécorer ma chambre, et je m'y sens beaucoup mieux maintenant. Comment est décorée ta chambre ? Tu as un objet ou une couleur qui domine ?",
    "Chez moi, c'est un joyeux mélange entre des coins parfaitement rangés et d'autres complètement chaotiques. Tu es plutôt rangement parfait ou joyeux désordre ? Ça dépend des pièces ?",
    "J'ai monté une étagère sans aide récemment et elle tient encore debout, ce qui est une petite victoire. Tu aimes bricoler ? Quel est ton plus grand exploit de bricolage ?",
    "On garde tous un objet qui n'a aucune valeur pour les autres, mais qui est précieux pour nous. Tu as un objet auquel tu tiens beaucoup ? Quelle est son histoire ?",
    "J'ai longtemps collectionné les tickets de concert et les billets de train de mes voyages. Tu collectionnes quelque chose ? Depuis quand, et combien de pièces tu as déjà ?",
    "Un parfum peut faire resurgir un souvenir en une seconde, c'est assez fascinant. Quel est ton parfum préféré ? Tu portes toujours le même ou tu en changes souvent ?",
    "Chiner dans les marchés aux puces, c'est l'espoir de tomber sur un trésor caché à petit prix. Tu aimes les marchés aux puces ? Quelle est ta plus belle trouvaille ?",
    "Le théâtre a quelque chose de vivant et de fragile que le cinéma n'aura jamais. Tu as déjà assisté à une pièce de théâtre ? Tu préfères les comédies ou les drames ?",
    "L'opéra me paraît souvent intimidant, mais j'aimerais vraiment en voir un au moins une fois. Tu aimes l'opéra ? Tu y es déjà allé ou allée, ou ça te tente ?",
    "Il y a des tableaux devant lesquels je pourrais rester des heures, à découvrir de nouveaux détails. Quel peintre ou quel tableau aimes-tu ? Qu'est-ce qu'il te fait ressentir ?",
    "Certains poèmes arrivent à dire en quelques lignes ce qu'on n'arrive pas à exprimer en plusieurs pages. Tu aimes la poésie ? Tu as un poème ou un poète préféré ?",
    "J'ai commencé à écrire un petit journal le soir, juste quelques lignes pour garder une trace de mes journées. Tu écris parfois, un journal ou des histoires ? Tu relis ce que tu as écrit ?",
    "Un festival en plein air, avec la musique, la foule et l'ambiance d'été, c'est une expérience unique. Tu aimes les festivals de musique ? Tu as déjà dormi sur place en camping ?",
    "Les vieux bâtiments ont une âme et une histoire, mais certaines constructions modernes sont époustouflantes. Tu préfères les vieux bâtiments ou l'architecture moderne ? Tu as un bâtiment préféré ?",
    "Une bonne photo arrive à raconter toute une histoire sans un seul mot, c'est très fort. Tu aimes les expositions de photos ? Tu as un photographe ou une photo qui t'a donné des frissons ?",
    "J'utilise toujours le même emoji dans mes messages, au point que mes amis me reconnaissent grâce à lui. Quel est ton emoji préféré ? Et celui que tu ne supportes pas ?",
    "Je regarde des vidéos de cuisine pour me détendre, même si je ne refais presque jamais les recettes. Tu regardes des vidéos de cuisine ? Tu as déjà essayé de refaire une recette vue en ligne ?",
    "Les réseaux sociaux sont remplis de personnes qui partagent leur quotidien, leurs voyages ou leurs conseils. Tu suis des influenceurs ? Qu'est-ce qui te plaît dans leur contenu ?",
    "Dans la voiture, j'écoute souvent la radio et je découvre parfois des chansons que je n'aurais jamais cherchées. Tu écoutes la radio ? Plutôt musique ou émissions de discussion ?",
    "L'odeur des gâteaux qui sortent du four me ramène directement dans la cuisine de ma grand-mère. Tu as une odeur qui te rappelle ton enfance ? Quel souvenir elle fait revenir ?",
    "Quand ça ne va pas, j'ai mes petites techniques : une balade, de la musique, ou appeler un ami. Qu'est-ce qui t'apaise quand ça ne va pas ? Tu as un refuge, un endroit ou une activité ?",
    "Une petite sieste de vingt minutes après le déjeuner, c'est magique pour recharger les batteries. Tu fais la sieste ? Tu arrives à te réveiller facilement, ou la sieste te laisse dans le brouillard ?",
    "On dit qu'il faut dormir huit heures par nuit, mais j'ai l'impression que chacun a son propre rythme. Combien d'heures dors-tu par nuit ? Ça te suffit pour être en forme ?",
    "Certaines nuits, je fais des rêves tellement réalistes que j'ai du mal à savoir s'ils sont vrais au réveil. Tu rêves beaucoup la nuit ? Tu arrives à te souvenir de tes rêves ?",
    "Mon dernier rêve était complètement absurde, je volais au-dessus d'une ville faite de gâteaux. Tu te souviens de ton dernier rêve ? Raconte-le-moi, même s'il n'a aucun sens.",
    "Il m'arrive de faire des cauchemars en période de stress, et je me réveille le cœur battant. Tu fais des cauchemars parfois ? Tu as un cauchemar qui revient régulièrement ?",
    "Je me rends compte que j'oublie souvent de boire de l'eau quand je me concentre sur quelque chose. Tu bois assez d'eau dans la journée ? Tu as des astuces pour y penser ?",
    "Un bon massage après une semaine difficile, c'est le meilleur moyen de relâcher toutes les tensions. Tu aimes les massages ? Tu as déjà essayé un massage dans un spa ?",
    "Entre le travail et les obligations, on oublie facilement de prendre du temps rien que pour soi. Tu prends du temps pour toi chaque jour ? Qu'est-ce que tu fais pendant ce moment ?",
    "Certaines chansons ou certains lieux me rendent nostalgique d'une période précise de ma vie. Qu'est-ce qui te rend nostalgique ? Tu aimes ce sentiment ou il te rend triste ?",
    "J'ai pleuré devant un film la semaine dernière, alors que ce genre de scène me laisse d'habitude de marbre. Tu pleures devant les films tristes ? Quel film t'a fait le plus pleurer ?",
    "Il y a des petites choses qui m'agacent énormément, comme les gens qui parlent fort au téléphone. Qu'est-ce qui te met en colère ? Tu t'énerves vite ou tu es plutôt calme ?",
    "Pardonner n'est pas toujours facile, surtout quand quelqu'un nous a fait beaucoup de mal. Tu pardonnes facilement ? Tu penses qu'on peut tout pardonner ?",
    "J'essaie de voir le verre à moitié plein, même si certains jours c'est plus difficile que d'autres. Tu te considères comme optimiste ? Qu'est-ce qui t'aide à garder le moral ?",
    "Il suffit parfois d'un message, d'un rayon de soleil ou d'une bonne odeur pour que ma journée s'illumine. Quelle petite chose peut illuminer ta journée ? Il t'en faut peu ?",
    "On dit que l'argent ne fait pas le bonheur, mais qu'il y contribue quand même un peu. Tu crois que l'argent fait le bonheur ? Qu'est-ce qui compte le plus pour être heureux ?",
    "Il y a ceux qui montrent leur affection par des gestes et ceux qui l'expriment par des mots. Tu préfères les câlins ou les mots doux ? Comment tu montres ton affection aux autres ?",
    "Certaines personnes rougissent dès qu'on leur fait un compliment, d'autres adorent en recevoir. Tu aimes qu'on te fasse des compliments ? Tu sais les accepter facilement ?",
    "Dans les moments d'inquiétude, j'ai besoin d'entendre une voix familière ou de retrouver mes habitudes. Qu'est-ce qui te rassure quand tu doutes ? Une personne, un lieu, un rituel ?",
    "J'ai un banc dans un parc où je vais m'asseoir quand j'ai besoin de réfléchir tranquillement. Tu as un endroit préféré pour réfléchir ? Qu'est-ce qu'il a de spécial ?",
    "Certaines personnes disent toujours ce qu'elles pensent, d'autres préfèrent garder leurs opinions pour elles. Tu es du genre à dire ce que tu penses ? Ça t'a déjà causé des soucis ?",
    "La routine peut être rassurante, mais elle peut aussi devenir étouffante au bout d'un moment. Comment vis-tu la routine ? Tu as besoin de changement régulièrement ?",
    "Un dimanche pluvieux, c'est l'excuse parfaite pour rester sous un plaid avec un bon film. Tu aimes les dimanches pluvieux ? Qu'est-ce que tu fais quand il pleut toute la journée ?",
    "La confiance en soi, ça va et ça vient, et certaines choses la font grandir plus que d'autres. Qu'est-ce qui te donne confiance en toi ? Tu te souviens d'un moment où tu as eu vraiment confiance en toi ?",
    "Je me souviens d'un fou rire incontrôlable pendant une réunion très sérieuse, c'était terrible et génial à la fois. Tu as un fou rire mémorable à raconter ? Où et avec qui c'était ?",
    "J'ai une idée amusante pour résumer une journée sans écrire un roman : utiliser seulement des emojis. Raconte-moi ta journée en trois emojis, et ensuite explique-moi chacun d'eux.",
    "On va jouer à un petit jeu d'association d'idées, c'est souvent très révélateur et amusant. Donne-moi un mot au hasard, et je te réponds avec le premier mot qui me vient à l'esprit.",
    "Les devinettes me rappellent les longs trajets en voiture quand j'étais enfant. Tu connais une devinette ? Pose-la-moi, je vais essayer de trouver la réponse sans tricher.",
    "Le jeu du « tu préfères » est parfait pour apprendre à se connaître, avec des choix parfois impossibles. On joue à « tu préfères » ? Tu commences, et je réponds honnêtement.",
    "J'aime bien imaginer le décor autour des gens avec qui je parle, ça rend la conversation plus vivante. Décris-moi l'endroit où tu es en ce moment : la lumière, les bruits, ce qu'il y a autour de toi.",
    "Je ne sais jamais trop quel décalage horaire il peut y avoir entre nous deux. Quelle heure est-il chez toi en ce moment ? Et qu'est-ce que tu fais habituellement à cette heure-ci ?",
    "J'ai prévu une soirée tranquille et je n'arrive pas du tout à choisir quoi regarder. Tu me conseilles un film pour ce soir ? Plutôt quelque chose de léger ou de captivant ?",
    "Je tourne un peu en rond et j'aurais bien envie de sortir faire quelque chose de différent. Tu me proposes une idée de sortie ? Quelque chose d'original qui sort de l'ordinaire ?",
    "Enfant, j'adorais qu'on me raconte des histoires avant de dormir. Tu me racontes une histoire courte ? Invente-la, avec un personnage étrange et une fin surprenante.",
    "J'essaie d'améliorer mon vocabulaire en langues étrangères, un mot à la fois. Tu peux m'apprendre un mot en anglais ? Un mot peu connu, avec sa définition et un exemple.",
    "J'aimerais adopter un chat un jour, mais je sais déjà que choisir son nom sera le plus difficile. Invente un nom pour mon futur chat, quelque chose d'original et plein de personnalité.",
    "J'ai faim et je n'ai aucune idée de ce que je pourrais préparer ou commander ce soir. Quel serait ton menu idéal pour ce soir ? Entrée, plat et dessert, fais-moi rêver.",
    "Certains jours sont plus gris que d'autres et on a besoin d'un petit coup de pouce. Donne-moi une bonne raison de sourire aujourd'hui, j'ai l'impression que tu as le don pour ça.",
    "J'ai eu une journée un peu compliquée et j'aurais bien besoin de quelques mots gentils. Tu me fais un compliment ? Un vrai, sincère, qui me donnerait le sourire ?",
    "Les proverbes ont souvent une sagesse étonnante cachée derrière des phrases toutes simples. Tu me donnes un proverbe que tu aimes bien ? Et explique-moi ce qu'il signifie pour toi.",
    "Les situations les plus drôles arrivent toujours au moment où on s'y attend le moins. Quel est le truc le plus drôle qui te soit arrivé ? Raconte-moi tout, avec tous les détails.",
    "J'adore apprendre des faits insolites que je peux ensuite ressortir pendant les dîners. Tu connais un fait insolite ? Quelque chose de vrai mais tellement surprenant qu'on a du mal à y croire.",
    "Ma playlist commence à tourner en rond et j'ai besoin de découvrir de nouveaux morceaux. Tu me recommandes une chanson ? Dis-moi aussi pourquoi elle te plaît autant.",
    "Un bon road trip ne peut pas se faire sans une playlist parfaite pour chanter à tue-tête. Quelle serait ta playlist pour un road trip ? Donne-moi au moins trois chansons indispensables.",
    "Le week-end approche et j'ai envie de rêver un peu au programme idéal, sans aucune limite. Décris-moi ton week-end parfait, du vendredi soir jusqu'au dimanche soir.",
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
    return { interval: 10, maxWait: 120, queue: shuffledIndexes(), total: PHRASES.length, round: 1, lastIdx: -1 };
  }

  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* ignoré */ }
  }

  const state = load();
  state.round = state.round || 1;
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

  // Si le bot ne répond pas à temps : on retire l'indicateur de frappe et on
  // réactive le bouton d'envoi pour continuer sans s'arrêter.
  function forceReady() {
    const ind = $(SEL.typing);
    if (ind) ind.remove();
    const btn = $(SEL.send);
    if (btn) {
      btn.disabled = false;
      btn.classList.remove('pointer-events-none');
    }
  }

  // Nouveau tour : liste remélangée, sans recommencer par la dernière phrase envoyée.
  function newRound() {
    state.queue = shuffledIndexes();
    if (state.queue[0] === state.lastIdx) {
      [state.queue[0], state.queue[1]] = [state.queue[1], state.queue[0]];
    }
    state.round++;
    save();
    render();
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
      if (state.queue.length === 0) newRound();

      setStatus('Attente que le bot soit prêt…');
      let r = await waitFor(botReady, state.maxWait * 1000, token);
      if (r === null) return;
      if (!r) forceReady();

      const idx = state.queue[0];
      const text = PHRASES[idx];
      const ok = await sendText(text, token);
      if (token !== runToken) return;
      if (!ok) { pause('Échec de l\'envoi (êtes-vous connecté ? une fenêtre est-elle ouverte ?) → pause.'); return; }

      state.queue.shift();
      state.lastIdx = idx;
      save();
      ui.last.textContent = text;
      render();

      setStatus('Envoyé. Attente de la réponse du bot…');
      r = await waitFor(botReady, state.maxWait * 1000, token);
      if (r === null) return;
      if (!r) forceReady();
      const note = r ? 'Réponse reçue.' : `Pas de réponse après ${state.maxWait} s, on continue.`;

      const end = Date.now() + state.interval * 1000;
      for (let left = end - Date.now(); left > 0; left = end - Date.now()) {
        if (token !== runToken) return;
        setStatus(`${note} Prochaine phrase dans ${Math.ceil(left / 1000)} s…`);
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
    state.round = 1;
    state.lastIdx = -1;
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
    ui.prog.textContent = `Tour ${state.round} · ${sent} / ${state.total}`;
    ui.start.disabled = running;
    ui.pause.disabled = !running;
    ui.start.textContent = sent > 0 || state.round > 1 ? '▶ Reprendre' : '▶ Démarrer';
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
