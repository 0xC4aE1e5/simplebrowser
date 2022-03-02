let autoURL = () => {
  document.querySelector("#url").value = document
    .querySelector("#browser")
    .getAttribute("src");
};
let interval = setInterval(autoURL, 0);
document.querySelector("#url").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    clearInterval(interval);
    if (document.querySelector("#url").value.startsWith("http")) {
      document.querySelector("#browser").src =
        document.querySelector("#url").value;
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
