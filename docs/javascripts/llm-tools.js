(function () {
  const DESKTOP_QUERY = "(min-width: 76.25em)";

  function clearPinnedSidebar(sidebar) {
    if (!sidebar) {
      return;
    }

    delete sidebar.dataset.cs2cPinned;
    sidebar.style.removeProperty("--cs2c-sidebar-left");
    sidebar.style.removeProperty("--cs2c-sidebar-width");
    sidebar.style.removeProperty("--cs2c-sidebar-height");
    sidebar.style.removeProperty("--cs2c-sidebar-top");
    sidebar.style.minHeight = "";
  }

  function pinSidebar(sidebar) {
    const scrollwrap = sidebar ? sidebar.querySelector(".md-sidebar__scrollwrap") : null;
    if (!sidebar || !scrollwrap) {
      return;
    }

    const rect = sidebar.getBoundingClientRect();
    const header = document.querySelector(".md-header");
    const headerRect = header ? header.getBoundingClientRect() : null;
    const topOffset = Math.round(headerRect ? headerRect.bottom : 97);
    const viewportGap = 16;
    const sidebarHeight = Math.max(280, Math.floor(window.innerHeight - topOffset - viewportGap));

    sidebar.dataset.cs2cPinned = "true";
    sidebar.style.setProperty("--cs2c-sidebar-left", `${Math.round(rect.left)}px`);
    sidebar.style.setProperty("--cs2c-sidebar-width", `${Math.round(rect.width)}px`);
    sidebar.style.setProperty("--cs2c-sidebar-height", `${sidebarHeight}px`);
    sidebar.style.setProperty("--cs2c-sidebar-top", `${topOffset}px`);
    sidebar.style.minHeight = `${sidebarHeight}px`;
  }

  function syncPinnedSidebars() {
    const isDesktop = window.matchMedia(DESKTOP_QUERY).matches;
    const sidebars = [".md-sidebar--primary", ".md-sidebar--secondary"].map((selector) =>
      document.querySelector(selector),
    );

    sidebars.forEach((sidebar) => {
      if (!sidebar || !isDesktop) {
        clearPinnedSidebar(sidebar);
        return;
      }
      pinSidebar(sidebar);
    });
  }

  function schedulePinnedSidebars() {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(syncPinnedSidebars);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", schedulePinnedSidebars);
  } else {
    schedulePinnedSidebars();
  }

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(() => {
      schedulePinnedSidebars();
    });
  }

  window.addEventListener("load", schedulePinnedSidebars);
  window.addEventListener("resize", schedulePinnedSidebars);
})();
