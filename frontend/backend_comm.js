var xhr = null

console.log("HEYYYYYYYYYYYYYyy")

getXmlHttpResquestObject = function() {
    if(!xhr){
        xhr = new XMLHttpRequest()
    }
    return xhr
}

function getStartData(){
    console.log("Getting start data ...");
    xhr = getXmlHttpResquestObject();
    xhr.onreadystatechange = startDataCallback;

    xhr.open("GET", "http://localhost:6969/startingData", true);
    xhr.send(null)
}

function startDataCallback() {
    if(xhr.readyState == 4 && xhr.status == 200){
        console.log("Data received!");
        jsonData = JSON.parse(xhr.responseText);
        
        createBrancheChoice(jsonData)
        createIntervenantChoice(jsonData)
    }
}

//création des options pour le choix des branches
function createBrancheChoice(jsonData) {
    cours_list = jsonData.cours;
    selectList = document.body.getElementsByClassName("filtre_branche");
    for(let j = 0; j< selectList.length; j++){
        for (let i = 0; i< cours_list.length; i++){
            var option = document.createElement("option");
            option.text = cours_list[i][0];
            option.id = cours_list[i][1];
            selectList[j].add(option);
        }
    }
}

//création des options pour le choix des intervenants
function createIntervenantChoice(jsonData) {
    intervenant_list = jsonData.intervenants;
        intervFiltre = document.body.getElementsByClassName("filtre_intervenant");
        console.log(intervFiltre);
        for(let j = 0; j< intervFiltre.length; j++){
            for (let i = 0; i< intervenant_list.length; i++){
                var option = document.createElement("option");
                option.text = intervenant_list[i][0];
                option.id = intervenant_list[i][1];
                intervFiltre[j].add(option);
            }
        }
}

let test_data = {
    languages: null,
    branches: ["Informatique pour les sciences humaines", "Linguistique"],
    credits: null,
    intervenants: null,
    semester: null,
    horaires: null,
    similarity_type: "min"
}

function getSimilarity(){
    console.log("Getting similarity ...");
    xhr = getXmlHttpResquestObject();
    xhr.onreadystatechange = similarityCallback;
    xhr.open("POST", "http://localhost:6969/similarity", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    // Send the request over the network
    xhr.send(JSON.stringify(test_data));
}

function similarityCallback() {
    if(xhr.readyState == 4 && xhr.status == 200){
        console.log("Data received!");
        similarity_data = JSON.parse(xhr.responseText);
        console.log(similarity_data)
        similarity_data = similarity_data.sort(function(a, b) {return b.similarity - a.similarity})
        createCourseDiv(similarity_data)
        //CREER ICI L'INPUT DE LA SIMILARITé DANS LE CODE SELON CE QUE CA RENVOIT + IL FAUT TRIER PAR SIMILARITé
    }
}

 //afficher les cours
 function createCourseDiv(coursesData) { 
    let divCourse = document.getElementById("Pizza")
    divCourse.innerHTML = ""
    for (let i = 0; i < coursesData.length; i++) {
      const maDiv = document.createElement("div");

      const title = document.createElement("h1");
      title.innerText = `${coursesData[i].nom}`;

      const information = document.createElement("h4");
      information.className = "affichage";
      const teacher = document.createElement("p");
      teacher.innerText = `Intervenant: ${coursesData[i].intervenants}`;
      information.appendChild(teacher);

      const schedule = document.createElement("p");
      schedule.innerText = `Horaire: ${coursesData[i].horaires[0]}-${coursesData[i].horaires[1]}`;
      information.appendChild(schedule);

      const credits = document.createElement("p");
      credits.innerText = `Crédits: ${coursesData[i].credits}`;
      information.appendChild(credits);

      const similarity = document.createElement("p");
      similarity.innerText = `Similarité: ${Math.round(((coursesData[i].similarity*100) + Number.EPSILON) * 100) / 100}%`;
      information.appendChild(similarity);

      const urlCourse = document.createElement("a");
      urlCourse.innerText = `Voir plus`;
      urlCourse.href = `${coursesData[i].url}`;
      urlCourse.target = `_blank`;
      urlCourse.rel = `noopener noreferrer`;
      information.appendChild(urlCourse);

      maDiv.appendChild(title);
      maDiv.appendChild(information);
      divCourse.appendChild(maDiv);
    }
  }

getStartData()

