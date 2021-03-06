import $ from 'jquery';
import jQuery from 'jquery';

// export for others scripts to use
window.$ = $;
window.jQuery = jQuery;

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000

require('../lib/slick.min.js')
require('bootstrap')

$('#main-section').slick({
  autoplay: true,
  autoplaySpeed: 60000,
  arrows: false,
  appendDots: '#dots-container',
  dots: true,
})

const pages = ['attendance', 'calendar', 'top-article']

// Technically making functions in a loop is bad
// but I need to use a variable 'pageName' and 'id'
// and you can't inject variables into function scopes
// in javascript.  so I'm going to do this instead
/* jshint ignore: start */
for (const pageName of pages) {
  const id = `section-${ pageName }`
  fetch(`pages/${ pageName }.html`)
    .then((response) => response.text())
    .then((htmlText) => {
      $('#main-section').slick(
        'slickAdd',
        `<section id="${ id }">${ htmlText }</section>`
      )
    })
    .then(() => {
      $.getScript(`build/${ pageName }.js`)
    })
    .then(() => {
      $('head').append(`<link rel="stylesheet" href="css/${ pageName }.css" type="text/css"/>`);
    })
    .then(() => $('.slick-list')[0].style = '')
}
/* jshint ignore: end */

// Spaghetti code below here
// Navbar Date
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function updateDate() {
  let date = new Date(Date.now())
  $('#nav-date').text(`${ DAYS[date.getDay()] }, ${ MONTHS[date.getMonth()] } ${ date.getDate() }, ${ date.getFullYear() }`)
  setTimeout(updateDate, ONE_DAY_IN_MS + 10)
}

updateDate()
let date = new Date(Date.now())
let midnightTomorrow = (new Date(`${ date.getMonth() + 1 } ${ date.getDate() + 1 } ${ date.getFullYear() }`)).valueOf()
setTimeout(updateDate, midnightTomorrow - Date.now())

updateTime()
setInterval(updateTime, 1000)
function updateTime() {
  let $hours = $('#nav-hours')
  let $minutes = $('#nav-minutes')
  let $amOrPm = $('#nav-am-pm')

  let date = new Date(Date.now())
  let hours = date.getHours()
  let minutes = date.getMinutes()
  let hoursText = 0

  if (hours > 12) hoursText = hours - 12
  else hoursText = hours
  if (hoursText === 0) hoursText = 12

  $hours.text(hoursText)

  $minutes.text((minutes + '').length > 1 ? minutes : '0' + minutes )

  $amOrPm.text((hours < 12) ? 'am' : 'pm')
}
