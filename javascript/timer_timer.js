let Expire;

function updateTimer(el, endTime) {
  const a = (i) => (i < 10 ? "0" + i : i);
  const b = (x) => Math.floor(x);
  let c = endTime - b(Date.now() / 1000);
  m = a(b(c / 60));
  s = a(b(c % 60));
  el.innerText = m + ":" + s;
  if (c <= 0) return void (el.innerText = "00:00");
  Expire = setTimeout(() => updateTimer(el, endTime), 1000);
}

function checkAllowedUrl() {
  const allowedHREF = ".a.free.pinggy.link";
  return window.location.href.includes(allowedHREF);
}

refreshTimer = (timerEL, notext = false) => {
  Expire && (clearTimeout(Expire), Expire = null);
  if (!notext) timerEL.innerText = "Connecting...";

  fetch("file=asd/pinggytimer.txt", { cache: "no-store" })
    .then((response) => {
      if (response.status == 404) {
        timerEL.innerText = "Disconnected";
        return;
      }
      response.text().then((text) => {
        const endTime = parseInt(text);
        if (isNaN(endTime))
          timerEL.innerText = "Maybe Network Error";
        else updateTimer(timerEL, endTime);
      });
    })
    .catch((err) => {
      console.log(err);
      timerEL.innerText = "ERROR" + err;
    });
};

onUiLoaded(function () {
  const quickSettings = gradioApp().querySelector("#quicksettings");

  if (gradioApp().querySelector("#nocrypt-timer") != null) return;

  let mainEL = document.createElement("div");
  mainEL.id = "nocrypt-timer";
  mainEL.className = "justify-start";
  mainEL.style = `
    gap: 5px;
    user-select: none;
    margin-block: -15px;
    transform-origin: left center;
    scale: 0.8;
    display: flex;
  `;

  let buttonEL = document.createElement("div");
  buttonEL.className = "gr-box";
  buttonEL.style = `
    gap: 0.5rem; 
    display: flex; 
    align-items: center; 
    border-color: transparent;
    cursor: pointer; 
    padding-block: 3px; 
    width: fit-content; 
    padding-inline: 5px; 
    z-index: 999; 
    background-color: transparent !important;
  `;
  buttonEL.title = "Refresh!";

  let timerEL = document.createElement("div");
  timerEL.style = `
    font-family: 'Roboto Mono', monospace;
    font-size: 18px;
    color: orange;
  `;
  timerEL.innerText = "Connecting...";

  let tunnelEL = document.createElement("div");
  tunnelEL.innerText = "pinggy";
  tunnelEL.style = `
    font-family: 'Roboto Mono', monospace;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    margin-top: -5px;
    display: flex;
  `;

  buttonEL.appendChild(tunnelEL);
  checkAllowedUrl() && (buttonEL.appendChild(timerEL), mainEL.appendChild(buttonEL));
  buttonEL.onclick = () => refreshTimer(timerEL);

  quickSettings.parentNode.insertBefore(mainEL, quickSettings.nextSibling);
  if (checkAllowedUrl()) refreshTimer(timerEL);
});
