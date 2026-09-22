(() => {
  const burger = document.querySelector(".burger");
  const menu = document.getElementById("mobileMenu");
  const year = document.getElementById("year");

  if (year) year.textContent = new Date().getFullYear();

  // Úvod – scroll na začátek (mimo mobilní menu, to řeší svůj vlastní handler)
  document.querySelectorAll('a[href="#top"]').forEach(a => {
    if (menu && menu.contains(a)) return;
    a.addEventListener("click", e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // Dočasná tlačítka Rezervace (href="#") – nesmí stránku odskočit nahoru
  document.querySelectorAll('a[href="#"]').forEach(a => {
    a.addEventListener("click", e => {
      e.preventDefault();
    });
  });

  function setMenu(open) {
    if (!burger || !menu) return;

    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Zavřít menu" : "Otevřít menu");
    if (open) {
      menu.hidden = false;
      // malý “drop” efekt bez knihoven
      menu.animate(
        [
          { opacity: 0, transform: "translateY(-6px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 160, easing: "ease-out" },
      );
    } else {
      // animace zavření (až pak hidden)
      const anim = menu.animate(
        [
          { opacity: 1, transform: "translateY(0)" },
          { opacity: 0, transform: "translateY(-6px)" },
        ],
        { duration: 140, easing: "ease-in" },
      );
      anim.onfinish = () => {
        menu.hidden = true;
      };
    }
  }

  if (burger && menu) {
    burger.addEventListener("click", () => {
      const isOpen = burger.getAttribute("aria-expanded") === "true";
      setMenu(!isOpen);
    });

    // zavřít menu po kliknutí na odkaz, scroll až po animaci zavření
    menu.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const isInPageAnchor = href.startsWith("#");

      // odkaz mimo aktuální stránku (jiná stránka, mailto, tel, http…) –
      // necháme prohlížeč otevřít ho normálně, jen zavřeme menu
      if (!isInPageAnchor) {
        setMenu(false);
        return;
      }

      e.preventDefault();
      setMenu(false);

      // dočasné tlačítko Rezervace bez odkazu – jen zavřít menu
      if (href === "#") return;

      setTimeout(() => {
        if (href === "#top") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          const target = document.querySelector(href);
          if (target) target.scrollIntoView({ behavior: "smooth" });
        }
      }, 150);
    });

    // zavřít při změně velikosti (když přejdeš na desktop)
    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 721px)").matches) {
        burger.setAttribute("aria-expanded", "false");
        burger.setAttribute("aria-label", "Otevřít menu");
        menu.hidden = true;
      }
    });

    // zavřít při kliknutí mimo
    document.addEventListener("click", (e) => {
      const isOpen = burger.getAttribute("aria-expanded") === "true";
      if (!isOpen) return;
      if (e.target.closest(".site-header")) return;
      setMenu(false);
    });
  }
})();
