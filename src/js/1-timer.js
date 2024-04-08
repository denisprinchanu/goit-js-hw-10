





import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const input = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');
const daysSpan = document.querySelector('[data-days]');
const hoursSpan = document.querySelector('[data-hours]');
const minutesSpan = document.querySelector('[data-minutes]');
const secondsSpan = document.querySelector('[data-seconds]');
let userSelectedDate = 0;

startBtn.disabled = true;

startBtn.addEventListener('click', onTimerStart);

flatpickr('input[type=text]', {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    const currentDate = new Date();
    if (selectedDates[0] - currentDate > 0) {
      startBtn.disabled = false;
    } else {
      startBtn.disabled = true;

      iziToast.error({
        message: 'Please choose a date in the future!',
      });
    }
    userSelectedDate = selectedDates[0];
  },
});

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, 0);
}

function updateTimerFields({ days, hours, minutes, seconds }) {
  daysSpan.textContent = addLeadingZero(days);
  hoursSpan.textContent = addLeadingZero(hours);
  minutesSpan.textContent = addLeadingZero(minutes);
  secondsSpan.textContent = addLeadingZero(seconds);
}

function onTimerStart() {
  const selectedDate = userSelectedDate;
  const timerId = setInterval(() => {
    const startDate = new Date();
    const countDown = selectedDate - startDate;
    startBtn.disabled = true;
    input.disabled = true;

    if (countDown < 1000) {
      clearInterval(timerId);
      return;
    }
    updateTimerFields(convertMs(countDown));
  }, 1000);
}