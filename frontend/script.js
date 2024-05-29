
 
  
// Function to toggle display of a filter div
function showFilter(div) {
  let x = div.parentNode.querySelectorAll("div")[2]; // Get the third div element under the parent node
  console.log(x);
  if (x.style.display === "none") {
    x.style.display = "block"; // If currently hidden, display the div
  } else {
    x.style.display = "none"; // If currently displayed, hide the div
  }
}

// Function to add an intervenant element
function ajoutInterv(button) {
  let selection = button.parentNode.querySelector("select"); // Get the select element
  if (test_data.intervenants.includes(selection.value)) {
    return; // If value already exists in intervenants array, return
  } else {
    let intervEle = document.createElement("div"); // Create a new div element
    intervEle.className = "intervEle"; // Set class name
    intervEle.addEventListener("click", function () {
      delet(intervEle, test_data.intervenants); // Add click event listener to delete the intervenant
    });
    intervEle.innerText = selection.value; // Set text content of the div
    let z = button.parentNode.querySelector("div"); // Get the div under the parent node
    z.appendChild(intervEle); // Append the new div element
    test_data.intervenants.push(selection.value); // Add value to intervenants array
    console.log(test_data.intervenants);
  }
}

// Function to add a branche element
function ajoutBranche(button) {
  let selection = button.parentNode.querySelector("select"); // Get the select element
  if (test_data.branches.includes(selection.value)) {
    return; // If value already exists in branches array, return
  } else {
    let brancheEle = document.createElement("div"); // Create a new div element
    brancheEle.className = "brancheEle"; // Set class name
    brancheEle.addEventListener("click", function () {
      delet(brancheEle, test_data.branches); // Add click event listener to delete the branche
    });
    brancheEle.innerText = selection.value; // Set text content of the div
    let z = button.parentNode.querySelector("div"); // Get the div under the parent node
    z.appendChild(brancheEle); // Append the new div element
    test_data.branches.push(selection.value); // Add value to branches array
    console.log(test_data);
  }
}

// Function to create default horaires from JSON data
function createDefaultHoraires(jsonData) {
  horaireListe = jsonData.horaires;

  for (let i = 0; i < filtred_data.horaire.length; i++) {
    let horaireEle = document.createElement("div"); // Create a new div element
    horaireEle.className = "horaireEle prevent-select"; // Set class name
    horaireEle.id = horaireListe[i][0]; // Set id
    horaireEle.innerHTML = `${horaireListe[i][1]} ${horaireListe[i][2]}`; // Set inner HTML
    horaireEle.addEventListener("click", function () {
      let index = filtred_data.horaire.indexOf(parseInt(this.id));
      if (index !== -1) {
        filtred_data.horaire.splice(index, 1); // Remove horaire from filtred_data.horaire array
      }
      this.remove(); // Remove the clicked horaire element
    });
    let z = document.getElementById("horaireSelec"); // Get the element with id "horaireSelec"
    z.appendChild(horaireEle); // Append the new horaire element
  }
}

// Function to add horaire element
function ajoutHoraire(button) {
  let selection = button.parentNode.querySelector("select"); // Get the select element
  let selectedId = selection.options[selection.selectedIndex].id; // Get the id of selected option
  console.log(selectedId);
  console.log(selection);
  if (filtred_data.horaire.includes(parseInt(selectedId))) {
    return; // If selectedId already exists in filtred_data.horaire array, return
  } else {
    let horaireEle = document.createElement("div"); // Create a new div element
    horaireEle.className = "horaireEle prevent-select"; // Set class name
    horaireEle.id = selectedId; // Set id
    horaireEle.addEventListener("click", function () {
      let index = filtred_data.horaire.indexOf(parseInt(this.id));
      if (index !== -1) {
        filtred_data.horaire.splice(index, 1); // Remove horaire from filtred_data.horaire array
      }
      this.remove(); // Remove the clicked horaire element
    });
    horaireEle.innerText = selection.value; // Set text content of the div
    let z = button.parentNode.querySelector("div"); // Get the div under the parent node
    z.appendChild(horaireEle); // Append the new div element
    filtred_data.horaire.push(selectedId); // Add selectedId to filtred_data.horaire array
    console.log(filtred_data.horaire);
  }
}

// Function to change minimum value of credits
function changeValueMin(credit_input) {
  value_max = document.getElementById("max-value").value; // Get the value of max-value input
  if (parseInt(value_max) < parseInt(credit_input.value)) {
    credit_input.value = value_max; // If value_max is less than credit_input's value, set credit_input's value to value_max
  }
  filtred_data.credits[0] = credit_input.value; // Update minimum value in filtred_data.credits array
}

// Function to change maximum value of credits
function changeValueMax(credit_input) {
  value_min = document.getElementById("min-value").value; // Get the value of min-value input
  if (parseInt(value_min) > parseInt(credit_input.value)) {
    credit_input.value = value_min; // If value_min is greater than credit_input's value, set credit_input's value to value_min
  }
  filtred_data.credits[1] = credit_input.value; // Update maximum value in filtred_data.credits array
}

// Function to check semester selection
function checkSemester() {
  semPrint = document.getElementById("semPrint"); // Get the semPrint checkbox
  semAut = document.getElementById("semAut"); // Get the semAut checkbox
  if (semPrint.checked == true && semAut.checked == false) {
    filtred_data.semester = ["printemps"]; // If semPrint is checked and semAut is unchecked, set semester to "printemps"
  } else if (semPrint.checked == false && semAut.checked == true) {
    filtred_data.semester = ["automne"]; // If semPrint is unchecked and semAut is checked, set semester to "automne"
  } else if (semPrint.checked == true && semAut.checked == true) {
    filtred_data.semester = ["printemps", "automne", "Annuel"]; // If both are checked, set semester to "printemps", "automne", "Annuel"
  } else {
    filtred_data.semester = []; // Otherwise, set semester to an empty array
  }
  console.log(filtred_data.semester);
}

// Function to check language selection
function checkLanguages(inputLang) {
  if (inputLang.checked == true) {
    filtred_data.languages.push(inputLang.value); // If language checkbox is checked, add it to languages array
  } else {
    let index = filtred_data.languages.indexOf(inputLang.value);
    if (index !== -1) {
      filtred_data.languages.splice(index, 1); // If language checkbox is unchecked, remove it from languages array
    }
  }
  console.log(filtred_data.languages);
}

// Function to change similarity type
function changeSim(sim_div) {
  test_data.similarity_type = sim_div.value; // Update similarity_type in test_data
  console.log(test_data);
}

// Function to delete element from list
function delet(div, list) {
  let index = list.indexOf(div.innerText);
  if (index !== -1) {
    list.splice(index, 1); // Remove element from list
  }
  div.remove(); // Remove the div element from the DOM
}

// Function to show information box
function showInfoBox(element) {
  console.log("here");
  let infoBox = element.parentNode.getElementsByClassName("info_box")[0]; // Get the info_box element
  infoBox.style.display = 'block'; // Display the info box
  console.log(element.style);
  infoBox.style.left = `${element.offsetLeft + 15}px`; // Position the info box
  infoBox.style.top = `${element.offsetTop - 50}px`; // Position the info box
}

// Function to hide information box
function hideInfoBox(element) {
  const infoBox = element.parentNode.getElementsByClassName("info_box")[0]; // Get the info_box element
  infoBox.style.display = 'none'; // Hide the info box
}
