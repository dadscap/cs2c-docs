(function () {
  function text(node) {
    return (node.textContent || "").replace(/\s+/g, " ").trim();
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
      Array.from(row.children).map((cell) => text(cell).replace(/\|/g, "\\|")),
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

  function blockToMarkdown(node) {
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
      const value = text(node);
      return value ? `${value}\n\n` : "";
    }

    if (tag === "UL") {
      const items = Array.from(node.children)
        .filter((child) => child.tagName === "LI")
        .map((child) => `- ${text(child)}`)
        .join("\n");
      return items ? `${items}\n\n` : "";
    }

    if (tag === "OL") {
      const items = Array.from(node.children)
        .filter((child) => child.tagName === "LI")
        .map((child, index) => `${index + 1}. ${text(child)}`)
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

    if (tag === "HR") {
      return "---\n\n";
    }

    if (tag === "DIV" || tag === "SECTION") {
      return Array.from(node.children).map(blockToMarkdown).join("");
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
    const blocks = Array.from(clone.children).map(blockToMarkdown).join("");
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

  function installTools() {
    removeDuplicateApiReferenceBlock();

    const typeset = document.querySelector(".md-content .md-typeset");
    const title = typeset ? typeset.querySelector("h1") : null;
    if (!typeset || !title || typeset.querySelector(".cs2c-page-tools")) {
      return;
    }

    const tools = document.createElement("div");
    tools.className = "cs2c-page-tools";

    const button = document.createElement("button");
    button.className = "cs2c-page-tools__button";
    button.type = "button";
    button.textContent = "Copy for LLM";

    const status = document.createElement("span");
    status.className = "cs2c-page-tools__status";
    status.setAttribute("aria-live", "polite");

    button.addEventListener("click", async () => {
      const payload = copyPageForLlm();
      if (!payload) {
        status.textContent = "Nothing to copy";
        return;
      }

      try {
        await navigator.clipboard.writeText(payload);
        status.textContent = "Copied";
      } catch (error) {
        status.textContent = "Clipboard blocked";
      }
    });

    tools.appendChild(button);
    tools.appendChild(status);
    title.insertAdjacentElement("afterend", tools);
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
