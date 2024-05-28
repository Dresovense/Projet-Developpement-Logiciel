
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
   if (test_data.intervenants.includes(selection.value)){
    return;
   }
   else{
    let intervEle = document.createElement("div")
    intervEle.className = "intervEle"
    intervEle.addEventListener("click", function(){
      delet(intervEle, test_data.intervenants)
    })
    intervEle.innerText = selection.value
    let z = button.parentNode.querySelector("div")
    z.appendChild(intervEle)
    test_data.intervenants.push(selection.value)
    console.log(test_data.intervenants)
   }  
 }

function ajoutBranche(button){
  let selection = button.parentNode.querySelector("select")
  if (test_data.branches.includes(selection.value)){
   return;
  }
  else{
   let brancheEle = document.createElement("div")
   brancheEle.className = "brancheEle"
   brancheEle.addEventListener("click", function(){
     delet(brancheEle, test_data.branches)
   })
   brancheEle.innerText = selection.value
   let z = button.parentNode.querySelector("div")
   z.appendChild(brancheEle)
   test_data.branches.push(selection.value)
   console.log(test_data)
  } 
}

function createDefaultHoraires(jsonData){
  horaireListe = jsonData.horaires;

  for(let i = 0; i < filtred_data.horaire.length; i++){
    let horaireEle = document.createElement("div")
    horaireEle.className = "horaireEle prevent-select"
    horaireEle.id = horaireListe[i][0]
    horaireEle.innerHTML = `${horaireListe[i][1]} ${horaireListe[i][2]}`
    horaireEle.addEventListener("click", function(){
      let index = filtred_data.horaire.indexOf(parseInt(this.id));
      if (index !== -1) {
          filtred_data.horaire.splice(index, 1);
      }
      this.remove();
    })
    let z = document.getElementById("horaireSelec")
    z.appendChild(horaireEle)
  }
}

function ajoutHoraire(button){
  let selection = button.parentNode.querySelector("select")
  let selectedId = selection.options[selection.selectedIndex].id
  console.log(selectedId)
  console.log(selection)
  if (filtred_data.horaire.includes(parseInt(selectedId))){
   return;
  }
  else{
   let horaireEle = document.createElement("div")
   horaireEle.className = "horaireEle prevent-select"
   horaireEle.id = selectedId
   horaireEle.addEventListener("click", function(){
    let index = filtred_data.horaire.indexOf(parseInt(this.id));
    if (index !== -1) {
        filtred_data.horaire.splice(index, 1);
    }
    this.remove();
   })
   horaireEle.innerText = selection.value
   let z = button.parentNode.querySelector("div")
   z.appendChild(horaireEle)
   filtred_data.horaire.push(selectedId)
   console.log(filtred_data.horaire)
  } 
}

function changeValueMin(credit_input){
  value_max = document.getElementById("max-value").value
  if (parseInt(value_max) < parseInt(credit_input.value)){
    credit_input.value = value_max
  }
  filtred_data.credits[0] = credit_input.value
}

function changeValueMax(credit_input){
  value_min = document.getElementById("min-value").value
  if (parseInt(value_min) > parseInt(credit_input.value)){
    credit_input.value = value_min
  }
  filtred_data.credits[1] = credit_input.value
}

function checkSemester(){
  semPrint = document.getElementById("semPrint")
  semAut = document.getElementById("semAut")
  if(semPrint.checked == true && semAut.checked == false){
    filtred_data.semester = ["printemps"]
  }
  else if(semPrint.checked == false && semAut.checked == true){
    filtred_data.semester = ["automne"]
  }
  else if(semPrint.checked == true && semAut.checked == true){
    filtred_data.semester = ["printemps", "automne", "Annuel"]
  }
  else{
    filtred_data.semester = []
  }
  console.log(filtred_data.semester)
}

function checkLanguages(inputLang){
  if(inputLang.checked == true){
    filtred_data.languages.push(inputLang.value)
  }
  else{
    let index = filtred_data.languages.indexOf(inputLang.value);
    if (index !== -1) {
        filtred_data.languages.splice(index, 1);
    }
  }
  console.log(filtred_data.languages)
}

function changeSim(sim_div){
  test_data.similarity_type = sim_div.value
  console.log(test_data)
}

//fonction qui supprime les éléments ajoutés
function delet(div, list) {
  let index = list.indexOf(div.innerText);
  if (index !== -1) {
      list.splice(index, 1);
  }
  div.remove();
}
