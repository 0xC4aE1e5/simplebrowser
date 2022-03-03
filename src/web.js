let autoURL = () => {
  document.querySelector("#url").value = document
    .querySelector("#browser")
    .getAttribute("src");
};
let interval = setInterval(autoURL, 0);
let i = 0;
document.querySelector("#url").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    clearInterval(interval);
    if (document.querySelector("#url").value.startsWith("http")) {
      document.querySelector("#browser").src =
        document.querySelector("#url").value;
    } else if (!document.querySelector("#url").value.includes(".")) {
      document.querySelector(
        "#browser"
      ).src = `http://duckduckgo.com/?q=${encodeURIComponent(
        document.querySelector("#url").value
      )}`;
    } else {
      document.querySelector("#browser").src = `http://${
        document.querySelector("#url").value
      }`;
    }
  }
});
document.querySelector("#url").addEventListener("input", (e) => {
  clearInterval(interval);
});
document.querySelector("#url").addEventListener("change", (e) => {
  interval = setInterval(autoURL, 0);
});
if (new URLSearchParams(window.location.search).has("url")) {
  document
    .querySelector("#browser")
    .addEventListener("did-stop-loading", () => {
      if (i === 0) {
        let args = [new URLSearchParams(window.location.search).get("url")];
        clearInterval(interval);
        document.querySelector("#url").value = args[0];
        document.querySelector("#browser").src = args[0];
        interval = setInterval(autoURL, 0);
        i += 1;
      }
    });
}
