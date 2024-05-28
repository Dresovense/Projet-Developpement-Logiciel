
let checkList = []
  
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
console.log(checkList)
 function ajoutInterv(button){
   let selection = button.parentNode.querySelector("select")
   if (checkList.includes(selection.value)){
    return;
   }
   else{
    let intervEle = document.createElement("div")
    intervEle.className = "intervEle"
    intervEle.addEventListener("click", function(){
      delet(intervEle)
    })
    intervEle.innerText = selection.value
    let z = button.parentNode.querySelector("div")
    z.appendChild(intervEle)
    checkList.push(selection.value)
    console.log(checkList)
   }  
 }

function ajoutBranche(button){
  let selection = button.parentNode.querySelector("select")
  if (checkList.includes(selection.value)){
   return;
  }
  else{
   let brancheEle = document.createElement("div")
   brancheEle.className = "brancheEle"
   brancheEle.addEventListener("click", function(){
     delet(brancheEle)
   })
   brancheEle.innerText = selection.value
   let z = button.parentNode.querySelector("div")
   z.appendChild(brancheEle)
   checkList.push(selection.value)
   console.log(checkList)
  } 
}

function ajoutHoraire(button){
  let selection = button.parentNode.querySelector("select")
  if (checkList.includes(selection.value)){
   return;
  }
  else{
   let horaireEle = document.createElement("div")
   horaireEle.className = "brancheEle"
   horaireEle.addEventListener("click", function(){
     delet(horaireEle)
   })
   horaireEle.innerText = selection.value
   let z = button.parentNode.querySelector("div")
   z.appendChild(horaireEle)
   checkList.push(selection.value)
   console.log(checkList)
  } 
}


//fonction qui supprime les éléments ajoutés
function delet(div) {
  let index = checkList.indexOf(div.innerText);
  if (index !== -1) {
      checkList.splice(index, 1);
  }
  div.remove();
}
