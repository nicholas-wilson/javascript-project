// Urls
const BASE_URL = 'http://localhost:3000';
const UNITS_URL = `${BASE_URL}/units`;

// Player and Enemy Classes
class Battle {
  constructor(playerUnit, enemyUnit) {
    this.player = playerUnit;
    this.enemy = enemyUnit;
  }
  run() {
    // handle escaping from an enemy
    if (this.player.speed > this.enemy.speed) {
      // end battle
    } else if (this.enemy.speed - this.player.speed <= 5){
      if (Math.round(Math.random())) {
        // end battle 
      } else {
        this.enemy.attack(this.player);
      }
    }
  }

  fight() {
    if (this.player.speed >= this.enemy.speed) {
      this.player.attack(this.enemy); // update hp on screen after attack
      if (this.isOver()) {
        // End battle
      } else {
        this.enemy.attack(this.player);
        if (this.isOver()) {
          // endBattle();
        } 
        // update hp on screen after an attack 
      }
    } else {
      this.enemy.attack(this.player);
    }
  }

  isOver() {
    let over = false;
    if (this.player.isDead() || this.enemy.isDead()) {
      over = true;
    }
    return over;
  }
}

class Player {
  constructor() {
    this.units = [];
  }
  addUnit(unit) {
    this.units.push(unit);
  }
}

class Unit {
  constructor(unitJson) {
    this.name = unitJson.name;
    this.atk = unitJson.atk;
    this.max_hp = unitJson.max_hp;
    this.current_hp = unitJson.max_hp;
    this.def = unitJson.def;
    this.speed = unitJson.speed;
  }
  attack(enemyUnit) {
    if (self.atk <= enemyUnit.def) {
      enemyUnit.current_hp -= 1;
    } else {
      enemyUnit.current_hp -= (self.atk - enemyUnit.def) * 3;
    }
  }
  isDead() {
    let death = false;
    if (self.current_hp === 0) {
      death = true;
    }
    return death;
  }
}

function displayEnemyStats() {

}
// EventListeners
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#find-enemy").addEventListener("click", () => {
    fetchEnemy();
  })
  document.querySelector("#recruit").addEventListener("click", () => {
    recruitUnit();
  })
})

// Fetch Functions/ Render Functions
function recruitUnit() {
  fetch(UNITS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      level: "weak"
    })
  })
  .then(response => response.json())
  .then(unitJson => renderRecruit(unitJson))
}

function renderRecruit(unitJson) {                                              // TODO display name and current_hp/max_hp
  document.querySelector("#atk").innerHTML = `Attack  ${unitJson.atk}`;
  document.querySelector("#def").innerHTML = `Defense ${unitJson.def}`;
  document.querySelector("#hp").innerHTML = `Health ${unitJson.max_hp}`;
  document.querySelector("#speed").innerHTML = `Speed ${unitJson.speed}`;
}

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