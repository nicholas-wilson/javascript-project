// URLs
const BASE_URL = 'http://localhost:3000';
const UNITS_URL = `${BASE_URL}/units`;


// Player and Enemy Classes
class Battle {
  constructor(player, enemyUnit) {
    this.player = player;
    this.enemy = enemyUnit;
  }
  get playersUnit() {
    return this.player.currentUnit;
  }

  run() {
    // handle escaping from an enemy
    if (this.playersUnit.speed > this.enemy.speed) {
      // end battle
    } else if (this.enemy.speed - this.playersUnit.speed <= 5){
      if (Math.round(Math.random())) {
        // end battle 
      } else {
        this.enemy.attack(this.playersUnit);
      }
    }
  }

  fight() {
    if (this.playersUnit.speed >= this.enemy.speed) {
      this.playersUnit.attack(this.enemy);
      if (this.isOver()) {
        // End battle
      } else {
        this.enemy.attack(this.playersUnit);
        if (this.isOver()) {
          // endBattle();
        } 
        // update hp on screen after an attack 
      }
    } else {
      this.enemy.attack(this.playersUnit);
    }
  }

  isOver() {
    let over = false;
    if (this.playersUnit.isDead() || this.enemy.isDead()) {
      over = true;
    }
    return over;
  }

  updateHp(playerOrEnemy) {
    if (playerOrEnemy === this.playersUnit) {
      document.querySelector("#hp").innerHTML = `Health ${playerOrEnemy.current_hp}`;
    } else {
      document.querySelector("#e-hp").innerHTML = `Health ${playerOrEnemy.current_hp}`;
    }
  }
}

class Player {
  constructor() {
    this.units = [];
  }
  addUnit(unit) {
    this.units.push(unit);
  }
  get currentUnit() {
    return this.units[0]; // current unit for now will be the first unit in the array
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
    if (this.atk <= enemyUnit.def) {
      enemyUnit.current_hp -= 1;
    } else {
      enemyUnit.current_hp -= (this.atk - enemyUnit.def) * 3;
    }
    battle.updateHp(enemyUnit);
  }
  isDead() {
    let death = false;
    if (this.current_hp === 0) {
      death = true;
    }
    return death;
  }
}

// EventListeners
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#find-enemy").addEventListener("click", () => {
    fetchEnemy();
    // after displaying the enemy to User, we want to change the display of the find-enemy button to none until the battle is over
  })
  document.querySelector("#recruit").addEventListener("click", () => {
    // only allow this to work if the team isn't full already
    recruitUnit();
  })
  document.querySelector("#fight").addEventListener("click", () => {
    battle.fight();
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
  player.addUnit(new Unit(unitJson));
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
  battle.enemy = new Unit(unitJson);
}
// game constants
const player = new Player();
const battle = new Battle(player);