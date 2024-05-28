var xhr = null

//Test données
let test_data = {
    branches: [null,null],
    intervenants: [],
    similarity_type: "median"
}

let last_test_data = {}

let filtred_data = {
    languages: ["français"],
    credits: [0, 10],
    semester: ["printemps","automne","Annuel"],
    horaire: null,
    progOption: true,
}

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
        createHoraireChoice(jsonData)

        createDefaultHoraires(jsonData)
        
    }
}

//création des options pour le choix des branches
function createBrancheChoice(jsonData) {
    cours_list = jsonData.cours;
    selectList = document.body.getElementsByClassName("filtre_branche");
    for(let j = 0; j< selectList.length; j++){
        let base_option = document.createElement("option")
        base_option.text = "-----------------"
        base_option.id = "unselected"
        selectList[j].add(base_option)
        for (let i = 0; i< cours_list.length; i++){
            if(cours_list[i][0] != "Autres"){
                var option = document.createElement("option");
                option.text = cours_list[i][0];
                option.id = cours_list[i][1];
                selectList[j].add(option);
            }
        }
    }
}

//création des options pour le choix des intervenants
function createIntervenantChoice(jsonData) {
    intervenantList = jsonData.intervenants;
        intervFiltre = document.body.getElementsByClassName("filtre_intervenant");
        console.log(intervFiltre);
        for(let j = 0; j< intervFiltre.length; j++){
            for (let i = 0; i< intervenantList.length; i++){
                var option = document.createElement("option");
                option.text = intervenantList[i][0];
                option.id = intervenantList[i][1];
                intervFiltre[j].add(option);
            }
        }
}

//création des options pour le filtre horaire
function createHoraireChoice(jsonData) {
    horaireListe = jsonData.horaires;
    filtred_data.horaire = jsonData.horaires.map(x => x[0])
    horaireFiltre = document.getElementsByClassName("filtre_horaire");
    console.log(horaireFiltre);
    for(let j = 0; j< horaireFiltre.length; j++){
        for (let i = 0; i< horaireListe.length; i++){
            var option = document.createElement("option");
            option.text = `${horaireListe[i][1]}${horaireListe[i][2]}`;
            option.id = horaireListe[i][0];
            horaireFiltre[j].add(option);
        }
    }
}


//Récupère la valeur de la 1ère branche selectionnée
function changeSelectedBranche1(branche1_selected) {
    if(branche1_selected.id != "unselected"){
        test_data.branches[0] = branche1_selected;
        console.log(test_data.branches[0])
    }
    else{
        test_data[0] = null
    }
}

//Récupère la valeur de la 2ème branche selectionnée
function changeSelectedBranche2(branche2_selected) {
    if(branche2_selected.id != "unselected"){
        test_data.branches[1] = branche2_selected;
        console.log(test_data.branches[1])
    }
    else{
        test_data[1] = null
    }
}

function getSimilarity(){
    if(JSON.stringify(test_data.branches) == JSON.stringify([null,null]) && test_data.intervenants == null){
        alert("Tu n'as pas sélectionné d'intervenants ou de branches!")
    }
    else{
        if(JSON.stringify(last_test_data) == JSON.stringify(test_data)){
            createCourses_Buttons(similarity_data, 10)
        }
        else{
            desactivButtonSearch();
            console.log("Getting similarity ...");
            xhr = getXmlHttpResquestObject();
            xhr.onreadystatechange = similarityCallback;
            xhr.open("POST", "http://localhost:6969/similarity", true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            // Send the request over the network
            xhr.send(JSON.stringify(test_data));
        }
        console.log("here")
        last_test_data = JSON.parse(JSON.stringify(test_data))
    }

}

function similarityCallback() {
    if(xhr.readyState == 4 && xhr.status == 200){
        const maxDiv = 10;
        console.log("Data received!");
        similarity_data = JSON.parse(xhr.responseText);
        console.log(similarity_data)
        similarity_data = similarity_data.sort(function(a, b) {return b.similarity - a.similarity})
        createCourses_Buttons(similarity_data, maxDiv)
        activButtonSearch()
    }
}

function createCourses_Buttons(similarity_data, maxDiv){
    let length_courses = createCourseDiv(similarity_data, maxDiv, 0)
    createPageButtons(length_courses, maxDiv)
}


//Définir liste pages
let pageList = [];
pageList.className = "numPagination";

//Définir littleDot
const littleDot = document.createElement("li");
const littleDot2 = document.createElement("li");
const selectPageButton = document.createElement("button");

//Créer boutons pour les pages
function createPageButtons(numberEntry, maxDiv) {
    const footer = document.getElementById("pageNumber");
    footer.innerHTML = ""
    console.log(numberEntry)
    if(numberEntry > 0){
        littleDot.style.display = "None";
        littleDot.innerHTML = "(...)";
        littleDot2.innerHTML = "(...)";
        littleDot.classList.add("littleDot", "prevent-select");
        littleDot2.classList.add("littleDot", "prevent-select");
        footer.appendChild(littleDot);
        selectPageButton.innerHTML = "Aller à";
        selectPageButton.addEventListener("click", function(){redirectToPage()});
        selectPageButton.className = "w3-btn w3-xlarge w3-dark-grey w3-hover-light-grey";
        var scrollbarPageNumber = document.createElement("select");
        scrollbarPageNumber.id = "scrollbarPageNumber";
        for (let i = 0; i < Math.ceil(numberEntry/10); i++){
            const page = document.createElement("button");
            page.className = "w3-btn w3-xlarge w3-dark-grey w3-hover-light-grey prevent-select";
            page.innerHTML = i+1;
            page.addEventListener("click", function () {
                createCourseDiv(similarity_data, maxDiv, i*maxDiv);
                updateButtonPage(i);
                window.scrollTo(0, document.body.scrollHeight);
            })
            page.id = i;
            pageList.push(page);
            footer.appendChild(page);
            if (i > 1) {
                page.style.display = "None";
            }
        }
        for (let i = 0; i < pageList.length; i++){
            var option = document.createElement("option");
            option.text = i+1;
            option.id = i+1;
            scrollbarPageNumber.add(option);
        }
        footer.appendChild(littleDot2);
        footer.appendChild(selectPageButton)
        footer.appendChild(scrollbarPageNumber);
    }
}

//Affiche et cache les numéros de page
function updateButtonPage(pageNumber) {
    for (i = 0;i < pageList.length;i++) {
        if (pageNumber > 1) {
            littleDot.style.display = "flex";
        }
        if (pageNumber < 1) {
            littleDot.style.display = "None";
        }
        if (pageNumber > pageList.length-3) {
            littleDot2.style.display = "None";
        }
        if (pageNumber < pageList.length-3) {
            littleDot2.style.display = "flex";
        }
        if (i > pageNumber-2 && i < pageNumber+2) {
            pageList[i].style.display = "flex";
        }
        else {pageList[i].style.display = "None";}
    }
}

//afficher les cours
function createCourseDiv(coursesData, maxDivPerPage, firstDiv) { 
    //APPELLER FONCTIONS DE FILTRES!!!
    console.log(coursesData)
    var coursesDataFiltered = filtre_credit(coursesData, filtred_data.credits)
    console.log(coursesDataFiltered)
    coursesDataFiltered = filtre_horaire(coursesDataFiltered, filtred_data.horaire)
    console.log(coursesDataFiltered)
    coursesDataFiltered = filtre_semestre(coursesDataFiltered, filtred_data.semester)
    console.log(coursesDataFiltered)
    coursesDataFiltered = filtre_langue(coursesDataFiltered, filtred_data.languages)
    console.log(coursesDataFiltered)

    let divCourse = document.getElementById("Pizza")
    divCourse.style.display = "block"
    divCourse.innerHTML = ""
    try{
        for (let i = firstDiv; i < maxDivPerPage+firstDiv; i++) {
            console.log("test")
          const maDiv = document.createElement("div");
            maDiv.className = "courseDiv"
    
          const title = document.createElement("h1");
          title.innerText = `${coursesDataFiltered[i].nom}`;
    
          const information = document.createElement("h4");
          information.className = "affichage";
          const teacher = document.createElement("p");
          teacher.innerHTML = "Intervenant(s): <br>"
          for(let j = 0; j < coursesDataFiltered[i].intervenants.length; j++){
            teacher.innerHTML += `${coursesDataFiltered[i].intervenants[j]}<br>`
          }
          information.appendChild(teacher);
    
          const schedule = document.createElement("p");
          schedule.innerHTML = "Horaire: <br>"
          for (let r = 0; r < coursesDataFiltered[i].horaires.length;r++) {
            var startCourse = coursesDataFiltered[i].horaires[r]-1;
            schedule.innerHTML += jsonData.horaires[startCourse][1];
            schedule.innerHTML += " ";
            schedule.innerHTML += jsonData.horaires[startCourse][2];
            schedule.innerHTML += "<br>";
          }
          //schedule.innerText = `Horaire: ${coursesData[i].horaires[0]}-${coursesData[i].horaires[1]}`;
          information.appendChild(schedule);
    
          const credits = document.createElement("p");
          credits.innerText = `Crédits: ${coursesDataFiltered[i].credits}`;
          information.appendChild(credits);
    
          const similarity = document.createElement("p");
          similarity.innerText = `Similarité: ${Math.round(((coursesDataFiltered[i].similarity*100) + Number.EPSILON) * 100) / 100}%`;
          information.appendChild(similarity);
    
          const urlCourse = document.createElement("a");
          urlCourse.innerText = `Voir plus`;
          urlCourse.href = `${coursesDataFiltered[i].url}`;
          urlCourse.target = `_blank`;
          urlCourse.rel = `noopener noreferrer`;
          information.appendChild(urlCourse);
    
          maDiv.appendChild(title);
          maDiv.appendChild(information);
          divCourse.appendChild(maDiv);
          
        }
    }
    catch(err){
        console.error(err)
        alert("Les paramètres choisis ne renvoient aucun cours")
    }
    return coursesDataFiltered.length
}

function filtre_credit(coursesData, filter_list){
    return coursesData.filter(x => filter_list[0]<=x.credits && x.credits<=filter_list[1])
}
    
function filtre_horaire(coursesData, filter_list){
    return coursesData.filter(x => x.horaires.every(horaire => filter_list.includes(horaire)))
}
    
function filtre_semestre(coursesData, filter_list){
    return coursesData.filter(x => filter_list.includes(x.semestre))
}
    
function filtre_langue(coursesData, filter_list){
    return coursesData.filter(x => filter_list.includes(x.langage))
}

//Remplacement texte de recherche + désactivation bouton pendant chargement
function desactivButtonSearch() {
    var buttonSearchInactiv = document.getElementById("searchButton");
    var replacementText = "En cours...";
    buttonSearchInactiv.innerHTML = replacementText;
    buttonSearchInactiv.disabled = true;
}

//Reactivation du bouton de recherche
function activButtonSearch() {
    var buttonSearchActiv = document.getElementById("searchButton");
    var replacementText2 = "Rechercher";
    buttonSearchActiv.innerHTML = replacementText2;
    buttonSearchActiv.disabled = false;
}

//Recréation de la liste des divs de chaque page en fonction du numéro de page choisi
function redirectToPage() {
    window.scrollTo(0, document.body.scrollHeight);
    let pageNumber = document.getElementById("scrollbarPageNumber").value;
    console.log(pageNumber-1);
    createCourseDiv(similarity_data, 10, (pageNumber-1)*10);
    updateButtonPage(pageNumber-1);
}

getStartData()

