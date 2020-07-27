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

  awardMoney(amount=100) {
    this.player.money += amount;
    return amount;
  }

  run() {
    // handle escaping from an enemy
    let html = "";
    if (this.playersUnit.speed > this.enemy.speed) {
      // battle will end
    } else if (this.enemy.speed - this.playersUnit.speed <= 5){
      if (Math.round(Math.random())) {
        // battle will end
      } else {
        html += `<li>${Display.attackDialog(this.enemy.name, this.playersUnit.name, this.enemy.attack(this.playersUnit))}</li>`;
      }
    } else {
      html += `<li>${Display.attackDialog(this.enemy.name, this.playersUnit.name, this.enemy.attack(this.playersUnit))}</li>`;
    }
    Display.changeBattleText(html);
    this.endBattle(false, true);
  }

  fight() {
    let html = "";
    if (this.playersUnit.speed >= this.enemy.speed) {
      html += `<li>${Display.attackDialog(this.playersUnit.name, this.enemy.name, this.playersUnit.attack(this.enemy))}</li>`;
      if (this.isOver()) {
        // battle ends add money when wins
      } else {
        html += `<li>${Display.attackDialog(this.enemy.name, this.playersUnit.name, this.enemy.attack(this.playersUnit))}</li>`;
      }
    } else {
      html += `<li>${Display.attackDialog(this.enemy.name, this.playersUnit.name, this.enemy.attack(this.playersUnit))}</li>`;
      if (this.isOver()) {
        // battle ends
      } else {
        html += `<li>${Display.attackDialog(this.playersUnit.name, this.enemy.name, this.playersUnit.attack(this.enemy))}</li>`;
      }
    }
    Display.changeBattleText(html);
    Display.teamUnitInfo();
    if (this.isOver()) {
      if(this.enemy.isDead()) {
        this.endBattle(true, false, this.awardMoney());
      } else {
        this.endBattle();
      }
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

  endBattle(won=false, ranAway=false, money=0) {
    Display.battleEnd(won, ranAway, money);
    if (this.playersUnit.isDead()) {
      removeUnitFromDb(this.playersUnit);
      this.player.units.shift();
    } else {
      Display.checkHealBtnStatus();
      Display.checkRecruitBtnStatus();
      updateTeamInDb();
      // give stats to unit after battle ends
    }
  }
}

class Player {
  constructor() {
    this.units = [];
    this.money = 0;
    this.teamId = "?";
    this.cost = 0;
  }
  addUnit(unit) {
    this.units.push(unit);
  }
  heal() {
    this.money -= this.healCost;
    this.currentUnit.current_hp = this.currentUnit.max_hp;
    Display.checkHealBtnStatus();
  }
  get currentUnit() {
    return this.units[0]; // current unit for now will be the first unit in the array
  }
  get recruitCost() {
    if (this.units.length === 1) {
      this.cost = 500;
    } else if (this.units.length === 2) {
      this.cost = 5000;
    } else {
      this.cost = 0;
    }
    return this.cost;
  }
  get healCost() {
    if (this.currentUnit) {
      return (this.currentUnit.max_hp - this.currentUnit.current_hp) * 10;
    } else {
      return 0;
    }
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

  static clearEnemy(hp="") {
    Display.enemyName = "";
    Display.enemyHp = hp;
    Display.enemySpeed = "";
    Display.enemyAtk = "";
    Display.enemyDef = "";
  }

  static playersCash() {
    Display.changeHTML("players-cash", `Your Team has: $${player.money}`);
  }

  static unitCost(amount) {
    Display.changeHTML("unit-cost", ` Cost: $${amount}`);
  }

  static healCost() {
    Display.changeHTML("heal-cost", ` Cost: $${player.healCost}`);
  }

  static updateMoneyAndCost() {
    Display.playersCash();
    Display.healCost();
  }

  static checkHealBtnStatus() {
    if (!player.currentUnit) {
      document.querySelector("#heal").disabled = true;
      return;
    }
    if (player.money < player.healCost || player.currentUnit.max_hp === player.currentUnit.current_hp) {
      document.querySelector("#heal").disabled = true;
    } else {
      document.querySelector("#heal").disabled = false;
    }
  }

  static checkRecruitBtnStatus() {
    if (player.units.length < 3 && player.money >= player.recruitCost) {
      document.querySelector("#recruit").disabled = false;
    } else {
      document.querySelector("#recruit").disabled = true;
    }
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
    Display.showElement("heal");
    Display.checkRecruitBtnStatus();
    Display.checkHealBtnStatus();
    Display.teamUnitInfo();
    if (player.currentUnit) {
      Display.showCurrentUnitsStats();
      Display.showElement("find-enemy");
    }
  }

  static battleStart() {
    Display.hideElement("find-enemy");
    Display.showElement("fight");
    Display.showElement("run");
    Display.showElement("player-img");
    Display.showElement("enemy-img");
    Display.showCurrentUnitsStats();
  }

  static attackDialog(unitName, targetName, damage) {
    return `${unitName} attacked ${targetName} and dealt ${damage} damage!`;
  }

  static changeBattleText(html) {
    Display.changeHTML("battle-text", html);
  }

  static battleEnd(won=false, ranAway=false, money=0) {
    Display.showElement("find-enemy");
    Display.hideElement("fight");
    Display.hideElement("run");
    if (won) {
      Display.clearEnemy("DEAD");
      Display.changeBattleText(`${player.currentUnit.name} has won the fight! You got $${money} for winning!`);
    } else if (ranAway) {
      Display.clearEnemy()
      Display.changeBattleText(`${player.currentUnit.name} successfully escaped from ${battle.enemy.name}!`);
    } else {
      Display.changeBattleText(`${player.currentUnit.name} has died in battle. You have lost. Rest in peace ${player.currentUnit.name}.`);
      Display.showCurrentUnitsStats();
    }
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
    Display.checkRecruitBtnStatus();
    Display.showElement("find-enemy");
  })
  document.querySelector("#heal").addEventListener("click", function(event) {
    player.heal();
    Display.teamUnitInfo();
    Display.showCurrentUnitsStats();
    updateTeamInDb();
  })
  document.querySelector("#fight").addEventListener("click", () => {
    battle.fight();
  })
  document.querySelector("#run").addEventListener("click", () => {
    battle.run();
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
  Display.unitCost(player.recruitCost);
  Display.healCost();
  Display.playersCash();
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
  player.addUnit(new Unit(unitJson));
  Display.name = player.currentUnit.name;
  Display.atk = player.currentUnit.atk;
  Display.def = player.currentUnit.def;
  Display.hp = player.currentUnit.max_hp;
  Display.speed = player.currentUnit.speed;
  Display.teamUnitInfo();
  Display.unitCost(player.recruitCost);
  updateTeamInDb();
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

function removeUnitFromDb(unit) {
  fetch(`${UNITS_URL}/${unit.id}`, {
    method: "DELETE"
  })
}

// function updateUnitInDb(unit) {
//   fetch(`${UNITS_URL}/${unit.id}`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//       "Accept": "application/json"
//     },
//     body: JSON.stringify(unit)
//   })
//   .then(updateTeamMoneyInDb())
// }

function updateTeamInDb() {
  fetch(`${TEAMS_URL}/${player.teamId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      money: player.money,
      units: player.units
    })
  })
  .then(Display.updateMoneyAndCost())
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