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
  notifyYesClick();
  question.textContent = 'Yay, Praghnya! Which Sunday moment feels right?';
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
  question.textContent = `It’s a plan, Praghnya! See you Sunday at ${time} ♡`;
  gif.src = 'https://media.giphy.com/media/UMon0fuimoAN9ueUNP/giphy.gif';
  timeChoices.remove();
  notifySlotSelection(time);
}

function notifySlotSelection(time) {
  sendNotification({
    _subject: 'A Sunday plan was selected ♡',
    event_type: 'slot_selected',
    selected_time: time,
    message: `Sunday plan selected: ${time}`
  });
}

function notifyYesClick() {
  sendNotification({
    _subject: 'Praghnya clicked Yes ♡',
    event_type: 'yes_clicked',
    no_clicks_before_yes: noClicks,
    message: `Praghnya pressed Yes after ${noClicks} No response${noClicks === 1 ? '' : 's'}.`
  });
}

function sendNotification(details) {
  fetch(FORMSPREE_ENDPOINT, {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ selected_on: new Date().toLocaleString(), ...details })
  }).catch(() => console.warn('Notification could not be sent.'));
}

function handleNoClick() {
  noClicks += 1;
  if (noClicks === 1) {
    question.textContent = 'Are you sure? I was really hoping for a yes 🥺';
    yesBtn.textContent = 'Okay, yes ♡';
    noBtn.textContent = 'Hmm… no';
    return;
  }

  question.textContent = 'You have no choice 😌';
  yesBtn.textContent = 'Yes, let’s do it ♡';
  noBtn.remove();
}

yesBtn.addEventListener('click', handleYesClick);
noBtn.addEventListener('click', handleNoClick);
