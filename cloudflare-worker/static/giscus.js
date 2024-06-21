document.addEventListener('onNagivateCompleted', initializeGiscus);
function initializeGiscus() {
    var giscusDiv = document.createElement("div");
    giscusDiv.className = "giscus";
    if (!document.querySelector(".giscus")) {
        document.querySelector("article").appendChild(giscusDiv);
    }

    var script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", "snack-game/blog-comments");
    script.setAttribute("data-repo-id", "R_kgDOK3Nq-Q");
    script.setAttribute("data-category", "Comments");
    script.setAttribute("data-category-id", "DIC_kwDOK3Nq-c4CblXz");
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", "light");
    script.setAttribute("data-lang", "ko");
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;
    document.head.appendChild(script);
}
