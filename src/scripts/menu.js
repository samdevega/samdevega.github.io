document
.querySelector('header button')
.addEventListener('click', function() {
  document.querySelector('body').classList.toggle('locked')
  document.querySelector('header nav').classList.toggle('expanded')
})
