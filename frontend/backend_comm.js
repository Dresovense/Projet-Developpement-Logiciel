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
    // Check if the xhr object is not already created
    if (!xhr) {
        // Create a new instance of XMLHttpRequest and assign it to xhr
        xhr = new XMLHttpRequest();
    }
    // Return the XMLHttpRequest object
    return xhr;
}

function getStartData() {
    // Log to console that the process of getting start data has begun
    console.log("Getting start data ...");

    // Create a new XMLHttpRequest object
    xhr = getXmlHttpResquestObject();

    // Define the callback function that will handle the response
    xhr.onreadystatechange = startDataCallback;

    // Initialize a GET request to the specified URL with asynchronous operation
    xhr.open("GET", "http://localhost:6969/startingData", true);

    // Send the request to the server
    xhr.send(null);
}

function startDataCallback() {
    // Check if the request is complete (readyState 4) and was successful (status 200)
    if (xhr.readyState == 4 && xhr.status == 200) {
        // Log to console that data has been received successfully
        console.log("Data received!");
        
        // Parse the JSON response from the server
        jsonData = JSON.parse(xhr.responseText);
        
        // Call functions to create various UI elements with the received data
        createBrancheChoice(jsonData); // Function to create branch choices
        createIntervenantChoice(jsonData); // Function to create intervenant (participant) choices
        createHoraireChoice(jsonData); // Function to create schedule choices
        
        // Call a function to create default schedules
        createDefaultHoraires(jsonData);
    }
}


function createBrancheChoice(jsonData) {
    // Extract the list of courses from the JSON data
    cours_list = jsonData.cours;

    // Get all elements with the class name "filtre_branche"
    selectList = document.body.getElementsByClassName("filtre_branche");

    // Loop through each select element found
    for (let j = 0; j < selectList.length; j++) {
        // Create a default option element
        let base_option = document.createElement("option");
        base_option.text = "-----------------";
        base_option.id = "unselected";

        // Add the default option to the current select element
        selectList[j].add(base_option);

        // Loop through each course in the course list
        for (let i = 0; i < cours_list.length; i++) {
            // Check if the course name is not "Autres" (Others)
            if (cours_list[i][0] != "Autres") {
                // Create a new option element for the course
                var option = document.createElement("option");
                option.text = cours_list[i][0]; // Set the option text to the course name
                option.id = cours_list[i][1]; // Set the option id to the course id

                // Add the new option to the current select element
                selectList[j].add(option);
            }
        }
    }
}


function createIntervenantChoice(jsonData) {
    // Extract the list of intervenants (participants) from the JSON data
    intervenantList = jsonData.intervenants;

    // Get all elements with the class name "filtre_intervenant"
    intervFiltre = document.body.getElementsByClassName("filtre_intervenant");

    // Log the retrieved elements to the console for debugging
    console.log(intervFiltre);

    // Loop through each select element found
    for (let j = 0; j < intervFiltre.length; j++) {
        // Loop through each intervenant in the intervenant list
        for (let i = 0; i < intervenantList.length; i++) {
            // Create a new option element for the intervenant
            var option = document.createElement("option");
            option.text = intervenantList[i][0]; // Set the option text to the intervenant name
            option.id = intervenantList[i][1]; // Set the option id to the intervenant id

            // Add the new option to the current select element
            intervFiltre[j].add(option);
        }
    }
}


function createHoraireChoice(jsonData) {
    // Extract the horaires array from the jsonData object
    horaireListe = jsonData.horaires;
    
    // Map the horaires array to get the first element of each sub-array
    filtred_data.horaire = jsonData.horaires.map(x => x[0]);
    
    // Select all elements with the class name "filtre_horaire"
    horaireFiltre = document.getElementsByClassName("filtre_horaire");
    
    // Log the selected elements to the console
    console.log(horaireFiltre);
    
    // Loop through each element with the class "filtre_horaire"
    for(let j = 0; j < horaireFiltre.length; j++) {
        // Loop through each element in the horaireListe array
        for (let i = 0; i < horaireListe.length; i++) {
            // Create a new option element
            var option = document.createElement("option");
            
            // Set the text of the option to be the concatenation of the second and third elements of the current horaire
            option.text = `${horaireListe[i][1]}${horaireListe[i][2]}`;
            
            // Set the id of the option to be the first element of the current horaire
            option.id = horaireListe[i][0];
            
            // Add the option to the current "filtre_horaire" select element
            horaireFiltre[j].add(option);
        }
    }
}



function changeSelectedBranche1(branche1_selected) {
    // Check if the selected branch's id is not "unselected"
    if(branche1_selected.id != "unselected"){
        // Update the first branch in test_data with the selected branch
        test_data.branches[0] = branche1_selected;
        // Log the updated first branch to the console
        console.log(test_data.branches[0])
    }
    else{
        // If the selected branch's id is "unselected", set the first element of test_data to null
        test_data[0] = null
    }
}


// Function to change the selected branch in the test data
function changeSelectedBranche2(branche2_selected) {
    // Check if the selected branch is not "unselected"
    if(branche2_selected.id != "unselected"){
        // Update the second branch in the test data
        test_data.branches[1] = branche2_selected;
        // Log the updated branch to the console
        console.log(test_data.branches[1])
    }
    // If the selected branch is "unselected", set the second branch data to null
    else{
        test_data[1] = null
    }
}

// Function to calculate similarity
function getSimilarity() {
    // Check if no branches or intervenants are selected
    if (JSON.stringify(test_data.branches) == JSON.stringify([null, null]) && test_data.intervenants == null) {
        alert("Tu n'as pas sélectionné d'intervenants ou de branches!");
    } else {
        // Check if the current test data is the same as the last test data
        if (JSON.stringify(last_test_data) == JSON.stringify(test_data)) {
            // Generate course buttons based on similarity data
            createCourses_Buttons(similarity_data, 10);
        } else {
            // Deactivate search button and initiate similarity calculation
            desactivButtonSearch();
            console.log("Getting similarity ...");
            xhr = getXmlHttpResquestObject();
            xhr.onreadystatechange = similarityCallback;
            xhr.open("POST", "http://localhost:6969/similarity", true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            // Send the request over the network
            xhr.send(JSON.stringify(test_data));
        }
        console.log("here");
        // Update last test data with current test data
        last_test_data = JSON.parse(JSON.stringify(test_data));
    }
}


// Callback function to handle the response from the server
function similarityCallback() {
    // Check if the request is completed and successful
    if(xhr.readyState == 4 && xhr.status == 200){
        // Define the maximum number of displayed elements
        const maxDiv = 10;
        // Log that data has been received
        console.log("Data received!");
        // Parse the received JSON response
        similarity_data = JSON.parse(xhr.responseText);
        // Log the parsed data
        console.log(similarity_data)
        // Sort the data based on similarity in descending order
        similarity_data = similarity_data.sort(function(a, b) {return b.similarity - a.similarity})
        // Call a function to create buttons for each course
        createCourses_Buttons(similarity_data, maxDiv)
        // Activate button search functionality
        activButtonSearch()
    }
}

// Function to create buttons for courses
function createCourses_Buttons(similarity_data, maxDiv){
    // Call a function to create course divs and get the length of courses
    let length_courses = createCourseDiv(similarity_data, maxDiv, 0)
    // Call a function to create page navigation buttons
    createPageButtons(length_courses, maxDiv)
}


let pageList = [];
pageList.className = "numPagination";

const littleDot = document.createElement("li");
const littleDot2 = document.createElement("li");
const selectPageButton = document.createElement("button");


// Function to create page navigation buttons
function createPageButtons(numberEntry, maxDiv) {
    // Get the footer element where page buttons will be appended
    const footer = document.getElementById("pageNumber");
    // Clear any existing content in the footer
    footer.innerHTML = ""
    // Log the number of entries received
    console.log(numberEntry)
    // Check if there are entries to display
    if(numberEntry > 0){
        // Create and configure a littleDot element for visual separation
        littleDot.style.display = "None";
        littleDot.innerHTML = "(...)";
        littleDot2.innerHTML = "(...)";
        littleDot.classList.add("littleDot", "prevent-select");
        littleDot2.classList.add("littleDot", "prevent-select");
        footer.appendChild(littleDot); // Append the littleDot to the footer
        // Create a button to allow jumping to a specific page
        selectPageButton.innerHTML = "Aller à";
        selectPageButton.addEventListener("click", function(){redirectToPage()});
        selectPageButton.className = "w3-btn w3-xlarge w3-dark-grey w3-hover-light-grey";
        // Create a select element to act as a scrollbar for page numbers
        var scrollbarPageNumber = document.createElement("select");
        scrollbarPageNumber.id = "scrollbarPageNumber";
        // Loop through pages and create buttons for each
        for (let i = 0; i < Math.ceil(numberEntry/10); i++){
            // Create a button for the page
            const page = document.createElement("button");
            page.className = "w3-btn w3-xlarge w3-dark-grey w3-hover-light-grey prevent-select";
            page.innerHTML = i+1;
            // Add event listener to load courses for the selected page
            page.addEventListener("click", function () {
                createCourseDiv(similarity_data, maxDiv, i*maxDiv);
                updateButtonPage(i);
                window.scrollTo(0, document.body.scrollHeight);
            })
            page.id = i;
            pageList.push(page); // Add the page button to the pageList array
            footer.appendChild(page); // Append the page button to the footer
            // Hide pages after the first two
            if (i > 1) {
                page.style.display = "None";
            }
        }
        // Add options to the scrollbar for each page
        for (let i = 0; i < pageList.length; i++){
            var option = document.createElement("option");
            option.text = i+1;
            option.id = i+1;
            scrollbarPageNumber.add(option);
        }
        // Append the second littleDot, jump-to-page button, and scrollbar to the footer
        footer.appendChild(littleDot2);
        footer.appendChild(selectPageButton)
        footer.appendChild(scrollbarPageNumber);
    }
}



// Function to update page buttons based on the current page number
function updateButtonPage(pageNumber) {
    // Loop through each page in the list
    for (i = 0; i < pageList.length; i++) {
        // If current page number is greater than 1, display the first little dot
        if (pageNumber > 1) {
            littleDot.style.display = "flex";
        }
        // If current page number is less than 1, hide the first little dot
        if (pageNumber < 1) {
            littleDot.style.display = "None";
        }
        // If current page number is greater than or equal to the length of page list minus 3, hide the second little dot
        if (pageNumber > pageList.length - 3) {
            littleDot2.style.display = "None";
        }
        // If current page number is less than the length of page list minus 3, display the second little dot
        if (pageNumber < pageList.length - 3) {
            littleDot2.style.display = "flex";
        }
        // If the index is within 2 pages before or after the current page number, display the page
        if (i > pageNumber - 2 && i < pageNumber + 2) {
            pageList[i].style.display = "flex";
        } else {
            // Otherwise, hide the page
            pageList[i].style.display = "None";
        }
    }
}



// Function to create course divs based on filtered course data
function createCourseDiv(coursesData, maxDivPerPage, firstDiv) { 
    // Log the original courses data
    console.log(coursesData);

    // Filter the courses data based on selected filters
    var coursesDataFiltered = filtre_credit(coursesData, filtred_data.credits);
    console.log(coursesDataFiltered);
    coursesDataFiltered = filtre_horaire(coursesDataFiltered, filtred_data.horaire);
    console.log(coursesDataFiltered);
    coursesDataFiltered = filtre_semestre(coursesDataFiltered, filtred_data.semester);
    console.log(coursesDataFiltered);
    coursesDataFiltered = filtre_langue(coursesDataFiltered, filtred_data.languages);
    console.log(coursesDataFiltered);

    // Get the div to which the course divs will be appended
    let divCourse = document.getElementById("Pizza");
    // Display the div
    divCourse.style.display = "block";
    // Clear the div's inner HTML
    divCourse.innerHTML = "";

    try {
        // Loop through the courses to create divs
        for (let i = firstDiv; i < maxDivPerPage + firstDiv; i++) {
            console.log("test");
            // Create a new div for each course
            const maDiv = document.createElement("div");
            maDiv.className = "courseDiv";

            // Create elements for course information
            const title = document.createElement("h1");
            title.innerText = `${coursesDataFiltered[i].nom}`;

            const information = document.createElement("h4");
            information.className = "affichage";

            const teacher = document.createElement("p");
            teacher.innerHTML = "Intervenant(s): <br>";
            for (let j = 0; j < coursesDataFiltered[i].intervenants.length; j++) {
                teacher.innerHTML += `${coursesDataFiltered[i].intervenants[j]}<br>`;
            }
            information.appendChild(teacher);

            const schedule = document.createElement("p");
            schedule.innerHTML = "Horaire: <br>";
            for (let r = 0; r < coursesDataFiltered[i].horaires.length; r++) {
                var startCourse = coursesDataFiltered[i].horaires[r] - 1;
                schedule.innerHTML += jsonData.horaires[startCourse][1];
                schedule.innerHTML += " ";
                schedule.innerHTML += jsonData.horaires[startCourse][2];
                schedule.innerHTML += "<br>";
            }
            information.appendChild(schedule);

            const credits = document.createElement("p");
            credits.innerText = `Crédits: ${coursesDataFiltered[i].credits}`;
            information.appendChild(credits);

            const similarity = document.createElement("p");
            similarity.innerText = `Similarité: ${Math.round(((coursesDataFiltered[i].similarity * 100) + Number.EPSILON) * 100) / 100}%`;
            information.appendChild(similarity);

            const urlCourse = document.createElement("a");
            urlCourse.innerText = `Voir plus`;
            urlCourse.href = `${coursesDataFiltered[i].url}`;
            urlCourse.target = "_blank";
            urlCourse.rel = "noopener noreferrer";
            information.appendChild(urlCourse);

            // Append elements to the div
            maDiv.appendChild(title);
            maDiv.appendChild(information);
            // Append the div to the main div
            divCourse.appendChild(maDiv);
        }
    } catch (err) {
        // If there's an error, log it and alert the user
        console.error(err);
        alert("Les paramètres choisis ne renvoient aucun cours");
    }
    // Return the length of filtered course data
    return coursesDataFiltered.length;
}


// Filter function to filter courses based on credit range
function filtre_credit(coursesData, filter_list) {
    // Filter courses based on the specified credit range
    return coursesData.filter(x => filter_list[0] <= x.credits && x.credits <= filter_list[1]);
}

// Filter function to filter courses based on selected schedule(s)
function filtre_horaire(coursesData, filter_list) {
    // Filter courses based on whether every schedule in the course is included in the filter list
    return coursesData.filter(x => x.horaires.every(horaire => filter_list.includes(horaire)));
}

// Filter function to filter courses based on selected semester(s)
function filtre_semestre(coursesData, filter_list) {
    // Filter courses based on whether their semester is included in the filter list
    return coursesData.filter(x => filter_list.includes(x.semestre));
}

// Filter function to filter courses based on selected language(s)
function filtre_langue(coursesData, filter_list) {
    // Filter courses based on whether their language is included in the filter list
    return coursesData.filter(x => filter_list.includes(x.langage));
}



// Function to deactivate the search button
function desactivButtonSearch() {
    // Get the search button element
    var buttonSearchInactiv = document.getElementById("searchButton");
    // Replacement text to indicate button is in process
    var replacementText = "En cours...";
    // Change button text
    buttonSearchInactiv.innerHTML = replacementText;
    // Disable the button
    buttonSearchInactiv.disabled = true;
}

// Function to activate the search button
function activButtonSearch() {
    // Get the search button element
    var buttonSearchActiv = document.getElementById("searchButton");
    // Replacement text to indicate normal state
    var replacementText2 = "Rechercher";
    // Change button text
    buttonSearchActiv.innerHTML = replacementText2;
    // Enable the button
    buttonSearchActiv.disabled = false;
}

// Function to redirect to a specific page and update course display accordingly
function redirectToPage() {
    // Scroll to the bottom of the page
    window.scrollTo(0, document.body.scrollHeight);
    // Get the page number input value
    let pageNumber = document.getElementById("scrollbarPageNumber").value;
    // Log the adjusted page number
    console.log(pageNumber - 1);
    // Update course display based on the selected page
    createCourseDiv(similarity_data, 10, (pageNumber - 1) * 10);
    // Update pagination buttons based on the selected page
    updateButtonPage(pageNumber - 1);
}


getStartData()

