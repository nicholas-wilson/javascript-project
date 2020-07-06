// Urls
const BASE_URL = 'http://localhost:3000';
const UNITS_URL = `${BASE_URL}/units`;

// Player and Enemy Classes
class Player {
  constructor() {
    this.characters = [];
  }
  addCharacter(character) {
    this.characters.push(character);
  }
}

function displayEnemyStats() {

}
// EventListeners
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#fight").addEventListener("click", () => {
    fetchEnemy();
  })
})

// Fetch Functions/ Render Functions

function fetchEnemy() {
  fetch(UNITS_URL, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      level: "weak"
    })
  })
  .then(response => response.json())
  .then(unitJson => renderEnemy(unitJson))
}

function renderEnemy(unitJson) {                                              // TODO display name and current_hp/max_hp
  document.querySelector("#e-atk").innerHTML = `Attack  ${unitJson.atk}`;
  document.querySelector("#e-def").innerHTML = `Defense ${unitJson.def}`;
  document.querySelector("#e-hp").innerHTML = `Health ${unitJson.max_hp}`;
  document.querySelector("#e-speed").innerHTML = `Speed ${unitJson.speed}`;
}