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

    xhr.open("GET", "http://localhost:6969/", true);
    xhr.send(null)
}

function startDataCallback() {
    if(xhr.readyState == 4 && xhr.status == 200){
        console.log("Data received!");
        jsonData = JSON.parse(xhr.responseText);
        
        //création des options pour le choix des branches
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

        //création des options pour le choix des intervenants
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
}



getStartData()