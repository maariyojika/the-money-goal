(() => {
  const routes = {
    home: "/",
    learn: "/learn",
    "mutual-funds": "/mutual-funds",
    "financial-freedom": "/financial-freedom",
    calculators: "/financial-freedom#simulator",
    "financial-health": "/financial-health",
    "knowledge-hub": "/knowledge-hub",
    "start-learning": "/learn",
    "money-mistakes": "/money-mistakes",
    login: "/account?mode=login",
    profile: "/account?mode=login",
    "partner-program": "/alice-blue-partner"
  };

  const currentPath = window.location.pathname.replace(/\/$/, "") || "/";
  const header = document.querySelector("header");
  if (header) {
    const navItems = [
      ["Home", "/"],
      ["Learn", "/learn"],
      ["Mutual Funds", "/mutual-funds"],
      ["Financial Freedom", "/financial-freedom"],
      ["Money Mistakes", "/money-mistakes"],
      ["Financial Health", "/financial-health"],
      ["Knowledge Hub", "/knowledge-hub"]
    ];
    const logo = `<img class="site-logo-image" src="/assets/moneygoal-logo.png" alt="The MoneyGoal">`;
    header.className = "mg-header";
    header.innerHTML = `<div class="mg-nav-shell">
      <a class="mg-brand site-logo-lockup" data-path="home" href="/" aria-label="The MoneyGoal home">${logo}</a>
      <nav class="mg-nav-links" aria-label="Primary navigation">${navItems.map(([label, href]) => `<a href="${href}"${currentPath === href ? ' aria-current="page"' : ""}>${label}</a>`).join("")}</nav>
      <div class="mg-header-actions">
        <a class="mg-partner-link" data-path="partner-program" href="/alice-blue-partner"${currentPath === "/alice-blue-partner" ? ' aria-current="page"' : ""}><span></span>Alice Blue Partner</a>
        <a class="mg-login-link" data-path="login" href="/account?mode=login"${currentPath === "/account" ? ' aria-current="page"' : ""}>Login</a>
        <a class="mg-header-cta" data-path="start-learning" href="/learn">Start Learning</a>
      </div>
    </div>`;
    header.dataset.uniformHeader = "true";
  }

  const footer = document.querySelector("footer");
  if (footer) {
    footer.className = "site-footer";
    footer.innerHTML = `<div class="mg-container">
      <div class="site-footer-grid">
        <div class="site-footer-brand">
          <a class="site-logo-lockup" data-path="home" href="/" aria-label="The MoneyGoal home"><img class="site-logo-image" src="/assets/moneygoal-logo.png" alt="The MoneyGoal"></a>
          <p>Practical, beginner-friendly financial education for better everyday decisions.</p>
        </div>
        <nav class="site-footer-group" aria-label="Learn links">
          <h2>Learn</h2>
          <a data-path="learn" href="/learn">Start Learning</a>
          <a data-path="money-mistakes" href="/money-mistakes">Money Mistakes</a>
          <a data-path="knowledge-hub" href="/knowledge-hub">Knowledge Hub</a>
        </nav>
        <nav class="site-footer-group" aria-label="Planning links">
          <h2>Plan &amp; Grow</h2>
          <a data-path="mutual-funds" href="/mutual-funds">Mutual Funds</a>
          <a data-path="financial-freedom" href="/financial-freedom">Financial Freedom</a>
          <a data-path="financial-health" href="/financial-health">Financial Health</a>
        </nav>
        <nav class="site-footer-group" aria-label="Partner links">
          <h2>Alice Blue Partner</h2>
          <a data-path="partner-program" href="/alice-blue-partner">Partner Information</a>
          <a data-partner-link href="#referral-link-required">Open Alice Blue Account</a>
          <span>Sub-broker / authorized partner</span>
        </nav>
      </div>
      <div class="site-footer-disclosure"><span class="material-symbols-outlined">info</span><p><strong>Educational and partner disclosure:</strong> The MoneyGoal provides general financial education, not personalized investment advice. We are an Alice Blue sub-broker/authorized partner and may receive permitted compensation from eligible accounts opened through our referral link. Securities investments are subject to market risk. Read all related documents carefully.</p></div>
      <div class="site-footer-bottom"><span>Copyright © 2026 The MoneyGoal. All rights reserved.</span><span>EDUCATION ONLY • NOT FINANCIAL ADVICE</span></div>
    </div>`;
    footer.dataset.uniformFooter = "true";
  }

  const sharedLogo = `<img class="site-logo-image" src="/assets/moneygoal-logo.png" alt="The MoneyGoal">`;
  const logoHosts = new Set(
    [...document.querySelectorAll(".moneygoal-brand-mark, .mg-brand-mark, .site-logo-image")]
      .map((mark) => mark.closest("a") || mark.parentElement)
      .filter(Boolean)
  );
  logoHosts.forEach((host) => {
    host.className = "site-logo-lockup";
    if (host.tagName === "A") {
      host.setAttribute("aria-label", "The MoneyGoal home");
    }
    host.innerHTML = sharedLogo;
  });

  document.querySelectorAll("a[data-path]").forEach((link) => {
    const path = link.dataset.path;
    if (routes[path]) link.href = routes[path];
  });

  document.querySelectorAll('a[data-path="partner-program"]').forEach((link) => {
    if (/open (a |your )?(demat|account)/i.test(link.textContent)) {
      link.dataset.partnerLink = "";
    }
  });

  const referralUrl = window.MONEYGOAL_CONFIG?.aliceBlueReferralUrl?.trim();
  document.querySelectorAll("[data-partner-link]").forEach((link) => {
    if (referralUrl) {
      link.href = referralUrl;
      link.target = "_blank";
      link.rel = "noopener sponsored";
      return;
    }
    link.href = "#referral-link-required";
    link.addEventListener("click", (event) => {
      event.preventDefault();
      window.alert("Alice Blue referral link configuration is pending.");
    });
  });

  const headerInner = document.querySelector("header > div");
  const desktopNav = document.querySelector("header nav");
  if (headerInner && desktopNav) {
    const button = document.createElement("button");
    button.className = "mobile-menu-button";
    button.type = "button";
    button.setAttribute("aria-label", "Open navigation");
    button.setAttribute("aria-expanded", "false");
    button.innerHTML = '<span class="material-symbols-outlined">menu</span>';
    headerInner.append(button);

    const drawer = document.createElement("nav");
    drawer.className = "mobile-drawer";
    drawer.setAttribute("aria-label", "Mobile navigation");
    drawer.innerHTML = [...desktopNav.querySelectorAll("a")]
      .map((link) => `<a href="${link.href}" ${link.getAttribute("aria-current") ? 'aria-current="page"' : ""}>${link.textContent}</a>`)
      .join("");
    document.body.append(drawer);

    button.addEventListener("click", () => {
      const open = drawer.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(open));
      button.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      button.firstElementChild.textContent = open ? "close" : "menu";
    });
  }

  const searchTrigger = document.querySelector('header [aria-label="Search"]');
  if (searchTrigger) {
    const pages = [
      ["Home", "/"],
      ["Learn personal finance", "/learn"],
      ["Mutual funds for beginners", "/mutual-funds"],
      ["Financial freedom planner", "/financial-freedom"],
      ["Money mistakes", "/money-mistakes"],
      ["Financial health assessment", "/financial-health"],
      ["Knowledge hub", "/knowledge-hub"],
      ["Open an Alice Blue account", "/alice-blue-partner"]
    ];
    const dialog = document.createElement("div");
    dialog.className = "search-dialog";
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-label", "Search The MoneyGoal");
    dialog.innerHTML = `<div class="search-panel"><input class="search-field" type="search" placeholder="Search topics and tools…" aria-label="Search topics"><div class="search-results"></div></div>`;
    document.body.append(dialog);
    const input = dialog.querySelector("input");
    const results = dialog.querySelector(".search-results");
    const render = () => {
      const query = input.value.toLowerCase();
      results.innerHTML = pages.filter(([name]) => name.toLowerCase().includes(query)).map(([name, href]) => `<a href="${href}">${name}</a>`).join("");
    };
    searchTrigger.addEventListener("click", () => {
      dialog.classList.add("is-open");
      render();
      input.focus();
    });
    input.addEventListener("input", render);
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.classList.remove("is-open");
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") dialog.classList.remove("is-open");
    });
  }

  const freedomMain = document.querySelector('#expense-reduction-slider');
  if (freedomMain) freedomMain.closest("section")?.setAttribute("id", "simulator");
})();
