// Tabbed Menu
function openMenu(evt, menuName) {
    var i, x, tablinks;
    x = document.getElementsByClassName("menu");
    for (i = 0; i < x.length; i++) {
       x[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < x.length; i++) {
       tablinks[i].className = tablinks[i].className.replace(" w3-red", "");
    }
    document.getElementById(menuName).style.display = "block";
    evt.currentTarget.firstElementChild.className += " w3-red";
  }
  document.getElementById("myLink").click();

  
  //montrer ou cacher les options de filtre
  function showFilter(div) {
   let x = div.parentNode.querySelectorAll("div")[1];
   console.log(x)
   if (x.style.display === "none") {
     x.style.display = "block";
   } else {
     x.style.display = "none";
   }
 }

 //fonction d'ajout des éléments des filtres
 function ajout(button){
   let selection = button.parentNode.querySelector("select")
   let intervEle = document.createElement("div")
   intervEle.innerText = selection.value
   let z = button.parentNode.querySelector("div")
   z.appendChild(intervEle)
 }


 //afficher les cours
 function create_space_course() { 
  let prout = document.getElementById("Pizza")
  for (let i = 0; i < 5; i++) {
    const maDiv = document.createElement("div");
    maDiv.innerText = "Je test des trucs";
    prout.appendChild(maDiv)
  }
}


