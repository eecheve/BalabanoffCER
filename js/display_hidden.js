function toggleDisplay(className, displayState){
    var elements = document.getElementsByClassName(className)
    for (var i = 0; i < elements.length; i++){
        elements[i].style.display = displayState;
    }
  }
  
  function toggle(){
    document.onclick = function(e) {
      if (e.target.tagName == 'BUTTON') {
        var href = e.target.getAttribute("href");
        toggleDisplay('page', 'none');
        document.getElementById(href).style.display = 'block';
      }
    }
  }