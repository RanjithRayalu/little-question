// Based on github.com/hallowshaw/Will-you-go-out-with-me (MIT license),
// with a mobile-friendly, tap-based three-step choice flow.
const qs = (selector) => document.querySelector(selector);
const question = qs('.question');
const gif = qs('.gif');
const yesBtn = qs('.yes-btn');
const noBtn = qs('.no-btn');
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xrpgrvzw';
let noClicks = 0;

const times = ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM'];

function handleYesClick() {
  question.textContent = 'Yay, Praghnya! Pick a time for our first little adventure:';
  gif.src = 'https://media.giphy.com/media/UMon0fuimoAN9ueUNP/giphy.gif';
  noBtn.remove();

  const timeChoices = document.createElement('div');
  timeChoices.className = 'time-choices';
  times.forEach((time) => {
    const timeBtn = document.createElement('button');
    timeBtn.textContent = time;
    timeBtn.addEventListener('click', () => chooseTime(time, timeChoices));
    timeChoices.appendChild(timeBtn);
  });
  yesBtn.replaceWith(timeChoices);
}

function chooseTime(time, timeChoices) {
  question.textContent = `It’s a plan, Praghnya! Our first little adventure starts Sunday at ${time} ♡`;
  gif.src = 'https://media.giphy.com/media/UMon0fuimoAN9ueUNP/giphy.gif';
  timeChoices.remove();
  notifySlotSelection(time);
}

function notifySlotSelection(time) {
  const selectedOn = new Date().toLocaleString();
  fetch(FORMSPREE_ENDPOINT, {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      _subject: 'A Sunday plan was selected ♡',
      selected_time: time,
      selected_on: selectedOn,
      message: `Sunday plan selected: ${time}`
    })
  }).catch(() => console.warn('Slot notification could not be sent.'));
}

function handleNoClick() {
  noClicks += 1;
  if (noClicks === 1) {
    question.textContent = 'Are you sure? I was really hoping we could make a sweet first memory 🥺';
    yesBtn.textContent = 'Okay, yes ♡';
    noBtn.textContent = 'Hmm… no';
    return;
  }

  question.textContent = 'One last tiny question… will you give our first little adventure a chance? ✨';
  yesBtn.textContent = 'Yes, let’s do it ♡';
  noBtn.remove();
}

yesBtn.addEventListener('click', handleYesClick);
noBtn.addEventListener('click', handleNoClick);
