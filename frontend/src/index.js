// URLs
const BASE_URL = 'http://localhost:3000';
const UNITS_URL = `${BASE_URL}/units`;
const TEAMS_URL = `${BASE_URL}/teams`;

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
      // battle will end
    } else if (this.enemy.speed - this.playersUnit.speed <= 5){
      if (Math.round(Math.random())) {
        // battle will end
      } else {
        this.enemy.attack(this.playersUnit);
      }
    } else {
      this.enemy.attack(this.playersUnit);
    }
    this.endBattle();
  }

  fight() {
    if (this.playersUnit.speed >= this.enemy.speed) {
      this.playersUnit.attack(this.enemy);
      if (this.isOver()) {
        this.endBattle();
      } else {
        this.enemy.attack(this.playersUnit);
      }
    } else {
      this.enemy.attack(this.playersUnit);
      if (this.isOver()) {
        this.endBattle();
      } else {
        this.playersUnit.attack(this.enemy);
      }
    }
    if (this.isOver()) {
      this.endBattle();
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
      Display.hp = playerOrEnemy.current_hp;
    } else {
      Display.enemyHp = playerOrEnemy.current_hp;
    }
  }

  endBattle() {
    Display.clearEnemy();
    // if (this.enemy.isDead()) remove them from the api DB
    Display.clearPlayersUnit();
    // if (this.playersUnit.isDead()) remove them from the api DB
    Display.showElement("find-enemy");
    Display.hideElement("fight");
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
    if (this.current_hp <= 0) {
      death = true;
    }
    return death;
  }
}

class Display {
  static set enemyHp(value) {
    document.querySelector("#e-hp").innerHTML = `Health ${value}`;
  }

  static set enemyAtk(value) {
    document.querySelector("#e-atk").innerHTML = `Attack ${value}`;
  }

  static set enemySpeed(value) {
    document.querySelector("#e-speed").innerHTML = `Speed ${value}`;
  }

  static set enemyDef(value) {
    document.querySelector("#e-def").innerHTML = `Defense ${value}`;
  }

  static set hp(value) {
    document.querySelector("#hp").innerHTML = `Health ${value}`;
  }

  static set atk(value) {
    document.querySelector("#atk").innerHTML = `Attack ${value}`;
  }

  static set speed(value) {
    document.querySelector("#speed").innerHTML = `Speed ${value}`;
  }

  static set def(value) {
    document.querySelector("#def").innerHTML = `Defense ${value}`;
  }

  static clearEnemy() {
    Display.enemySpeed = "?";
    Display.enemyAtk = "?";
    Display.enemyDef = "?";
    Display.enemyHp = "?";
  }

  static clearPlayersUnit() {
    Display.speed = "?";
    Display.atk = "?";
    Display.def = "?";
    Display.hp = "?";
  }

  static hideElement(elementId) {
    document.querySelector(`#${elementId}`).className = "hidden";
  }

  static showElement(elementId) {
    document.querySelector(`#${elementId}`).className = "";
  }
}

// EventListeners
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#find-enemy").addEventListener("click", () => {
    fetchEnemy();
    Display.hideElement("find-enemy");
  })
  document.querySelector("#recruit").addEventListener("click", () => {
    // only allow this to work if the team isn't full already
    recruitUnit();
  })
  document.querySelector("#fight").addEventListener("click", () => {
    battle.fight();
  })
  // team buttons
  document.querySelector("#load-team").addEventListener("click", function(event) {
    // send fetch request to api to find team based on an id
    event.preventDefault();
    const teamId = parseInt(document.querySelector("#team-id").value);
    findTeam(teamId);
  })
  document.querySelector("#new-team").addEventListener("click", () => {
    newTeam();
  })
})

// Fetch Functions/ Render Functions
function findTeam(teamId) {
  fetch(`${TEAMS_URL}/${teamId}`)
  .then(response => response.json())
  .then(teamJson => renderTeam(teamJson))
}

function newTeam() {
  fetch(TEAMS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "content/json"
    },
    body: ""
  })
  .then(response => response.json())
  .then(teamJson => renderTeam(teamJson))
}

function renderTeam(teamJson) {
  console.log(teamJson);
}

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
  Display.atk = unitJson.atk;
  Display.def = unitJson.def;
  Display.hp = unitJson.max_hp;
  Display.speed = unitJson.speed;
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
  Display.enemyAtk = unitJson.atk;
  Display.enemyDef = unitJson.def;
  Display.enemyHp = unitJson.max_hp;
  Display.enemySpeed = unitJson.speed;
  battle.enemy = new Unit(unitJson);
}
// game constants
const player = new Player();
const battle = new Battle(player);