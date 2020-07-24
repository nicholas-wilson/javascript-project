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
      setTimeout(Display.attackDialog, 2000, this.playersUnit.name, this.enemy.name, this.playersUnit.attack(this.enemy));
      if (this.isOver()) {
        this.endBattle();
      } else {
        setTimeout(Display.attackDialog, 3000, this.enemy.name, this.playersUnit.name, this.enemy.attack(this.playersUnit));
      }
    } else {
      setTimeout(Display.attackDialog, 2000, this.enemy.name, this.playersUnit.name, this.enemy.attack(this.playersUnit));
      if (this.isOver()) {
        this.endBattle();
      } else {
        setTimeout(Display.attackDialog, 3000, this.playersUnit.name, this.enemy.name, this.playersUnit.attack(this.enemy));
      }
    }
    if (this.isOver()) {
      setTimeout(this.endBattle, 4000);
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
    Display.battleEnd();
    // if (this.enemy.isDead()) remove them from the api DB
    // if (this.playersUnit.isDead()) remove them from the api DB
  }
}

class Player {
  constructor() {
    this.units = [];
    this.money = 0;
    this.teamId = "?";
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
    this.current_hp = unitJson.current_hp;
    this.def = unitJson.def;
    this.speed = unitJson.speed;
    this.id = unitJson.id
  }
  attack(enemyUnit) {
    let damage = 1;
    if (this.atk <= enemyUnit.def) {
      enemyUnit.current_hp -= damage;
    } else {
      damage = this.atk - enemyUnit.def + 1;
      enemyUnit.current_hp -= damage;
    }
    battle.updateHp(enemyUnit);
    return damage;
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
  static set enemyName(value) {
    document.querySelector("#e-name").innerHTML = value;
  }
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

  static set name(value) {
    document.querySelector("#name").innerHTML = value;
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

  static showCurrentUnitsStats() {
    Display.name = `${player.currentUnit.name}`;
    Display.speed = `${player.currentUnit.speed}`;
    Display.atk = `${player.currentUnit.atk}`;
    Display.def = `${player.currentUnit.def}`;
    Display.hp = `${player.currentUnit.current_hp}`;
  }

  static hideElement(elementId) {
    document.querySelector(`#${elementId}`).className = "hidden";
  }

  static showElement(elementId) {
    document.querySelector(`#${elementId}`).className = "";
  }

  static changeHTML(elementId, html) {
    document.querySelector(`#${elementId}`).innerHTML = html;
  }

  static teamUnitInfo() {
    for (let i = 0; i < player.units.length; i++) {
      Display.changeHTML(`name-${i + 1}`, player.units[i].name);
      Display.changeHTML(`atk-${i + 1}`, `Attack ${player.units[i].atk}`);
      Display.changeHTML(`def-${i + 1}`, `Defence ${player.units[i].def}`);
      Display.changeHTML(`hp-${i + 1}`, `Health ${player.units[i].current_hp}/${player.units[i].max_hp}`);
      Display.changeHTML(`speed-${i + 1}`, `Speed ${player.units[i].speed}`);
    }
  }

  static loadTeam() {
    Display.hideElement("id-form");
    Display.hideElement("new-team");
    Display.showElement("recruit");
    if (player.units.length === 3) {
      document.querySelector("#recruit").disabled = true;
    }
    Display.teamUnitInfo();
    if (player.currentUnit) {
      Display.showCurrentUnitsStats();
      Display.showElement("find-enemy");
    }
    // add show for any other team options I add
  }

  static battleStart() {
    Display.hideElement("find-enemy");
    Display.showElement("fight");
    Display.showElement("run");
    Display.showElement("player-img");
    Display.showElement("enemy-img");
  }

  static attackDialog(unitName, targetName, damage) {
    Display.changeBattleText(`${unitName} attacked ${targetName} and dealt ${damage} damage!`);
  }

  static changeBattleText(text) {
    Display.changeHTML("battle-text", text);
  }

  static battleEnd() {
    Display.clearEnemy();
    Display.clearPlayersUnit();
    Display.showElement("find-enemy");
    Display.hideElement("fight");
    Display.hideElement("run");
  }
}

// EventListeners
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#find-enemy").addEventListener("click", () => {
    fetchEnemy();
    Display.battleStart();
  })
  document.querySelector("#recruit").addEventListener("click", function(event) {
    recruitUnit();
    if (player.units.length === 2) {
      event.target.disabled = true;
    }
    Display.showElement("find-enemy");
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
  .then(teamJson => renderTeamIfFound(teamJson))
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

function renderTeamIfFound(teamJson) {
  if (teamJson) {
    renderTeam(teamJson, true);
    player.teamId = teamJson.id;
  } else {
    Display.changeHTML("team-id-number", "Invalid team id, please try a Different id number or make a new team.");
  }
}

function renderTeam(teamJson, oldTeam=false) {
  if (oldTeam) {
    for (let i = 0; i < teamJson.units.length; i++) {
      let newUnit = new Unit(teamJson.units[i]);
      player.addUnit(newUnit);
    }
  }
  player.teamId = teamJson.id;
  Display.changeHTML("team-id-number", `Your team's id number is: ${teamJson.id}`);
  Display.loadTeam();
}

function recruitUnit() {
  fetch(UNITS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      level: "weak",
      teamId: `${player.teamId}`
    })
  })
  .then(response => response.json())
  .then(unitJson => renderRecruit(unitJson))
}

function renderRecruit(unitJson) {
  Display.name = unitJson.name;
  Display.atk = unitJson.atk;
  Display.def = unitJson.def;
  Display.hp = unitJson.max_hp;
  Display.speed = unitJson.speed;
  player.addUnit(new Unit(unitJson));
  Display.teamUnitInfo();
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

function renderEnemy(unitJson) {
  Display.enemyName = unitJson.name;
  Display.enemyAtk = unitJson.atk;
  Display.enemyDef = unitJson.def;
  Display.enemyHp = unitJson.max_hp;
  Display.enemySpeed = unitJson.speed;
  battle.enemy = new Unit(unitJson);
}
// game constants
const player = new Player();
const battle = new Battle(player);