// Urls
const BASE_URL = 'http://localhost:3000';
const UNITS_URL = `${BASE_URL}/units`;

// Player and Enemy Classes
class Battle {
  constructor(playerUnit, enemyUnit) {
    this.player = playerUnit;
    this.enemy = enemyUnit;
  }
  fight() {
    if (this.player.speed >= this.enemy.speed) {
      this.player.attack(this.enemy);
    } else {
      this.enemy.attack(this.player);
    }
  }

  isOver() {
  
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