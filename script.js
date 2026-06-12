(() => {
  const burger = document.querySelector(".burger");
  const menu = document.getElementById("mobileMenu");
  const year = document.getElementById("year");

  if (year) year.textContent = new Date().getFullYear();

  function setMenu(open) {
    if (!burger || !menu) return;

    burger.setAttribute("aria-expanded", String(open));
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

    // zavřít menu po kliknutí na odkaz
    menu.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      setMenu(false);
    });

    // zavřít při změně velikosti (když přejdeš na desktop)
    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 721px)").matches) {
        burger.setAttribute("aria-expanded", "false");
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
