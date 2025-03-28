// Enables max character limit on desc for games & apps
var i;
var divs = document.getElementsByClassName('description');
for (i = 0; i < divs.length; i++) {
  if (divs[i].className == 'description') {
    divs[i].innerHTML = divs[i].innerHTML.substring(0, 45) + '...';
  }
}
