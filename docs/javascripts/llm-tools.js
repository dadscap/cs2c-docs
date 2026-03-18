(function () {
  function text(node) {
    return (node.textContent || "").replace(/\s+/g, " ").trim();
  }

  function normalizeInline(value) {
    return value.replace(/[ \t]+\n/g, "\n").replace(/\n[ \t]+/g, "\n").replace(/[ \t]{2,}/g, " ").trim();
  }

  function absoluteHref(href) {
    try {
      return new URL(href, window.location.href).toString();
    } catch (error) {
      return href;
    }
  }

  function inlineToMarkdown(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return (node.textContent || "").replace(/\s+/g, " ");
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return "";
    }

    const tag = node.tagName;

    if (tag === "CODE") {
      return `\`${text(node)}\``;
    }

    if (tag === "A") {
      const label = normalizeInline(Array.from(node.childNodes).map(inlineToMarkdown).join("")) || text(node);
      const href = node.getAttribute("href");
      if (!href) {
        return label;
      }
      return `[${label}](${absoluteHref(href)})`;
    }

    if (tag === "STRONG" || tag === "B") {
      return `**${normalizeInline(Array.from(node.childNodes).map(inlineToMarkdown).join(""))}**`;
    }

    if (tag === "EM" || tag === "I") {
      return `*${normalizeInline(Array.from(node.childNodes).map(inlineToMarkdown).join(""))}*`;
    }

    if (tag === "BR") {
      return "  \n";
    }

    return Array.from(node.childNodes).map(inlineToMarkdown).join("");
  }

  function codeLanguage(code) {
    if (!code) {
      return "";
    }

    for (const cls of code.classList) {
      if (cls.startsWith("language-")) {
        return cls.replace("language-", "");
      }
    }

    return "";
  }

  function tableToMarkdown(table) {
    const rows = Array.from(table.querySelectorAll("tr"));
    if (!rows.length) {
      return "";
    }

    const matrix = rows.map((row) =>
      Array.from(row.children).map((cell) =>
        normalizeInline(Array.from(cell.childNodes).map(inlineToMarkdown).join("")).replace(/\|/g, "\\|"),
      ),
    );

    const header = matrix[0];
    const divider = header.map(() => "---");
    const body = matrix.slice(1);
    const lines = [
      `| ${header.join(" | ")} |`,
      `| ${divider.join(" | ")} |`,
      ...body.map((row) => `| ${row.join(" | ")} |`),
    ];

    return `${lines.join("\n")}\n\n`;
  }

  function listItemToMarkdown(item, depth, index, ordered) {
    const prefix = `${"  ".repeat(depth)}${ordered ? `${index + 1}.` : "-"} `;
    const nestedBlocks = [];
    let inlineValue = "";

    Array.from(item.childNodes).forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE && (child.tagName === "UL" || child.tagName === "OL")) {
        nestedBlocks.push(blockToMarkdown(child, depth + 1));
        return;
      }
      inlineValue += inlineToMarkdown(child);
    });

    const line = `${prefix}${normalizeInline(inlineValue)}`.trimEnd();
    const nested = nestedBlocks.filter(Boolean).join("");
    return nested ? `${line}\n${nested}` : `${line}\n`;
  }

  function blockToMarkdown(node, depth) {
    const tag = node.tagName;
    if (!tag) {
      return "";
    }

    if (node.classList.contains("cs2c-page-tools")) {
      return "";
    }

    if (tag === "H1" || tag === "H2" || tag === "H3" || tag === "H4" || tag === "H5" || tag === "H6") {
      const level = Number(tag.substring(1));
      return `${"#".repeat(level)} ${text(node)}\n\n`;
    }

    if (tag === "P") {
      const value = normalizeInline(Array.from(node.childNodes).map(inlineToMarkdown).join(""));
      return value ? `${value}\n\n` : "";
    }

    if (tag === "UL") {
      const items = Array.from(node.children)
        .filter((child) => child.tagName === "LI")
        .map((child, index) => listItemToMarkdown(child, depth || 0, index, false))
        .join("\n");
      return items ? `${items}\n\n` : "";
    }

    if (tag === "OL") {
      const items = Array.from(node.children)
        .filter((child) => child.tagName === "LI")
        .map((child, index) => listItemToMarkdown(child, depth || 0, index, true))
        .join("\n");
      return items ? `${items}\n\n` : "";
    }

    if (tag === "PRE") {
      const code = node.querySelector("code");
      const language = codeLanguage(code);
      const value = code ? code.innerText.replace(/\n+$/, "") : node.innerText.replace(/\n+$/, "");
      return `\`\`\`${language}\n${value}\n\`\`\`\n\n`;
    }

    if (tag === "TABLE") {
      return tableToMarkdown(node);
    }

    if (tag === "BLOCKQUOTE") {
      const value = normalizeInline(Array.from(node.childNodes).map(inlineToMarkdown).join(""));
      return value ? `> ${value}\n\n` : "";
    }

    if (tag === "HR") {
      return "---\n\n";
    }

    if (tag === "DIV" || tag === "SECTION") {
      return Array.from(node.children).map((child) => blockToMarkdown(child, depth || 0)).join("");
    }

    return "";
  }

  function copyPageForLlm() {
    const container = document.querySelector(".md-content .md-typeset");
    if (!container) {
      return "";
    }

    const clone = container.cloneNode(true);
    clone.querySelectorAll(".headerlink, .cs2c-page-tools, .md-button").forEach((node) => node.remove());
    const blocks = Array.from(clone.children).map((child) => blockToMarkdown(child, 0)).join("");
    return blocks.trim();
  }

  function removeDuplicateApiReferenceBlock() {
    const duplicateStartHeading = document.getElementById("post-v1accountalerts");
    const schemasHeading = document.getElementById("schemas");
    if (!duplicateStartHeading || !schemasHeading) {
      return;
    }

    let startNode = duplicateStartHeading;
    while (startNode.previousElementSibling) {
      const prev = startNode.previousElementSibling;
      if (
        (prev.tagName === "H4" && prev.id === "get-accountalertsevents") ||
        prev.tagName === "H3" ||
        prev.tagName === "H2"
      ) {
        break;
      }
      startNode = prev;
    }

    const removedIds = new Set();
    let node = startNode;
    while (node && node !== schemasHeading) {
      if (/^H[1-6]$/.test(node.tagName || "") && node.id) {
        removedIds.add(node.id);
      }
      const next = node.nextElementSibling;
      node.remove();
      node = next;
    }

    document.querySelectorAll('.md-nav__link[href^="#"]').forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) {
        return;
      }
      const targetId = href.slice(1);
      if (!removedIds.has(targetId)) {
        return;
      }
      const item = link.closest(".md-nav__item");
      if (item) {
        item.remove();
      } else {
        link.remove();
      }
    });
  }

  function setStatus(status, message) {
    status.textContent = message;
    window.clearTimeout(status._cs2cTimer);
    status._cs2cTimer = window.setTimeout(() => {
      status.textContent = "";
    }, 2200);
  }

  function installSidebarTools() {
    const sidebarInner = document.querySelector(".md-sidebar--secondary .md-sidebar__inner");
    const drawerToggle = document.getElementById("__drawer");
    if (!sidebarInner || !drawerToggle || sidebarInner.querySelector(".cs2c-sidebar-tools")) {
      return;
    }

    const navTitle = sidebarInner.querySelector(".md-nav--secondary > .md-nav__title");
    if (navTitle) {
      navTitle.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          child.textContent = "";
        }
      });
      if (!navTitle.dataset.cs2cRelabeled) {
        navTitle.append(document.createTextNode("On this page"));
        navTitle.dataset.cs2cRelabeled = "true";
      }
    }

    const tools = document.createElement("div");
    tools.className = "cs2c-sidebar-tools";

    const label = document.createElement("div");
    label.className = "cs2c-sidebar-tools__label";
    label.textContent = "Docs";

    const button = document.createElement("button");
    button.className = "cs2c-sidebar-tools__button";
    button.type = "button";
    button.setAttribute("aria-label", "Browse docs navigation");
    button.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>';
    button.addEventListener("click", () => {
      drawerToggle.checked = !drawerToggle.checked;
    });

    tools.appendChild(label);
    tools.appendChild(button);
    sidebarInner.prepend(tools);
  }

  function installPageTools() {
    const typeset = document.querySelector(".md-content .md-typeset");
    const title = typeset ? typeset.querySelector("h1") : null;
    if (!typeset || !title || typeset.querySelector(".cs2c-page-tools")) {
      return;
    }

    const tools = document.createElement("div");
    tools.className = "cs2c-page-tools";

    const copyButton = document.createElement("button");
    copyButton.className = "cs2c-page-tools__button";
    copyButton.type = "button";
    copyButton.textContent = "Copy for LLM";

    const shareButton = document.createElement("button");
    shareButton.className = "cs2c-page-tools__button";
    shareButton.type = "button";
    shareButton.textContent = "Share";

    const status = document.createElement("span");
    status.className = "cs2c-page-tools__status";
    status.setAttribute("aria-live", "polite");

    copyButton.addEventListener("click", async () => {
      const payload = copyPageForLlm();
      if (!payload) {
        setStatus(status, "Nothing to copy");
        return;
      }

      try {
        await navigator.clipboard.writeText(payload);
        setStatus(status, "Markdown copied");
      } catch (error) {
        setStatus(status, "Clipboard blocked");
      }
    });

    shareButton.addEventListener("click", async () => {
      try {
        if (navigator.share) {
          await navigator.share({
            title: document.title,
            url: window.location.href,
          });
          setStatus(status, "Shared");
          return;
        }

        await navigator.clipboard.writeText(window.location.href);
        setStatus(status, "Link copied");
      } catch (error) {
        setStatus(status, "Share unavailable");
      }
    });

    tools.appendChild(copyButton);
    tools.appendChild(shareButton);
    tools.appendChild(status);
    title.insertAdjacentElement("afterend", tools);
  }

  function installTools() {
    removeDuplicateApiReferenceBlock();
    installSidebarTools();
    installPageTools();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", installTools);
  } else {
    installTools();
  }

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(() => {
      installTools();
    });
  }
})();
