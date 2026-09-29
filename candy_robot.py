"""Robot Candy Auto-Chat (macOS).

Ouvre un navigateur (Google Chrome s'il est installé, sinon Chromium) sur la
page du chat candy.ai et y ajoute le panneau "Auto-Chat" (script
candy-auto-chat.user.js). Vous vous connectez, réglez le délai et cliquez sur
Démarrer. La connexion est mémorisée dans le dossier "profil-navigateur" pour
les lancements suivants.
"""

import pathlib
import sys

from playwright.sync_api import Error, sync_playwright

HERE = pathlib.Path(__file__).resolve().parent
URL = "https://candy.ai/fr/ai-girlfriend/bree-whitlock/live-actions"
PROFILE_DIR = HERE / "profil-navigateur"

# Empêche le navigateur de ralentir les minuteurs quand la fenêtre est en arrière-plan.
ARGS = [
    "--start-maximized",
    "--disable-background-timer-throttling",
    "--disable-backgrounding-occluded-windows",
    "--disable-renderer-backgrounding",
]


def load_panel_script():
    script = (HERE / "candy-auto-chat.user.js").read_text(encoding="utf-8")
    # Exécuté dans la page principale uniquement, une fois le document prêt.
    return (
        "if (window.top === window) {"
        " const __cacRun = () => {\n" + script + "\n};"
        " if (document.readyState === 'loading')"
        "  document.addEventListener('DOMContentLoaded', __cacRun);"
        " else __cacRun();"
        "}"
    )


def launch(p):
    options = dict(headless=False, no_viewport=True, args=ARGS)
    for channel in ("chrome", "msedge"):
        try:
            return p.chromium.launch_persistent_context(
                str(PROFILE_DIR), channel=channel, **options
            )
        except Error:
            pass
    # Sinon : navigateur Chromium de Playwright (installé par le lanceur).
    return p.chromium.launch_persistent_context(str(PROFILE_DIR), **options)


def main():
    url = sys.argv[1] if len(sys.argv) > 1 else URL
    with sync_playwright() as p:
        ctx = launch(p)
        ctx.add_init_script(load_panel_script())
        page = ctx.pages[0] if ctx.pages else ctx.new_page()
        page.goto(url)
        print("Navigateur ouvert.")
        print("1. Connectez-vous sur candy.ai (une seule fois, la connexion est memorisee).")
        print("2. Reglez le delai dans le panneau 'Auto-Chat' en bas a gauche, puis Demarrer.")
        print("Fermez la fenetre du navigateur pour quitter.")
        # Sur macOS, fermer la dernière fenêtre ne quitte pas le navigateur :
        # on attend donc la fermeture de tous les onglets.
        try:
            while ctx.pages:
                ctx.pages[0].wait_for_event("close", timeout=0)
            ctx.close()
        except Error:
            pass  # navigateur quitté (Cmd+Q)


if __name__ == "__main__":
    main()
