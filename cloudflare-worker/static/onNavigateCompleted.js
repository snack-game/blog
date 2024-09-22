// Observer for prefetch
const callback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const href = entry.target.getAttribute("href");
            window.next.router.prefetch(href);
            observer.unobserve(entry.target);
        }
    });
};
const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};
const observer = new IntersectionObserver(callback, options);

function onNagivateCompleted() {
    document.dispatchEvent(new Event('onNagivateCompleted'));

    const links = document.querySelectorAll('a.notion-link[href]');
    Array.from(links)
        .filter(link => link.getAttribute("href").startsWith("/"))
        .forEach(link => observer.observe(link));
}
document.addEventListener("DOMContentLoaded", () => setTimeout(onNagivateCompleted, 500));

// Hook Navigates
const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;
history.pushState = function () {
    observer.disconnect();
    const result = originalPushState.apply(history, arguments);
    setTimeout(onNagivateCompleted, 500);
    return result;
};
history.replaceState = function () {
    observer.disconnect();
    const result = originalReplaceState.apply(history, arguments);
    setTimeout(onNagivateCompleted, 500);
    return result;
};