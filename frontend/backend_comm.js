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
    xhr.onreadystatechange = dataCallback;

    xhr.open("GET", "http://localhost:6969/", true);
    xhr.send(null)
}

function dataCallback() {
    if(xhr.readyState == 4 && xhr.status == 200){
        console.log("Data received!")
        dataDiv = document.getElementsByTagName('div')[0];
        dataDiv.innerText = xhr.responseText;
    }
}

getStartData()