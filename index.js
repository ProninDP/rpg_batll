const readlineSync = require('readline-sync');
var enemy = require("./monster.js"); //параметры монстра
var hero = require("./mag.js"); //параметры мага
let cooldownMag = 4; //очки действий
let cooldownMonster = 4; //очки действий
function movesMonster() { //ходы монстра
  let moves = [];
  while(true){
    if(cooldownMonster > 0){
      let move = Math.floor(Math.random() * 3); //генерируем случайное действие
        if(enemy.monster.moves[move].cooldown <= cooldownMonster){
          moves.push(move);
          cooldownMonster -= enemy.monster.moves[move].cooldown;
          console.log(`Компьютер делает ход: ${enemy.monster.moves[move].name}`);
          if(moves.length==1){ //сколько действий за ход можно сделать пока есть очки хода
            return moves;
          }
        }
    }else{
      return moves;
    }
  }
}
function movesGamer() { //ходы игрока
  let moves = [];
  while(true){
    if(cooldownMag > 0){
      for(key in hero.mag.moves){
        if(hero.mag.moves[key].cooldown <= cooldownMag){
          console.log(`Доступные действия: ${key} - ${hero.mag.moves[key].name}`);
        }
      }
      let move = readlineSync.questionInt('Делайте ход: '); //запрос на действие
      if(hero.mag.moves[move].cooldown <= cooldownMag){
        moves.push(move);
        cooldownMag -= hero.mag.moves[move].cooldown;
        console.log(`Ход игрока: ${hero.mag.moves[move].name}`);
        if(moves.length==1){ //сколько действий за ход можно сделать пока есть очки хода
          return moves;
        }
      }
    }else{
      return moves;
    }
  }
}
function game(health){ //функция просчитывания хода игры
    let mag_health = health;
    let monster_health = enemy.monster.maxHealth;
  while(true){
      if (mag_health > 0 && monster_health > 0){
      let monster_moves = movesMonster();
      let mag_moves = movesGamer();
      // временные параметры для суммирования действий
      var temp_monster = {  "physicalDmg": 0, // физический урон
                            "magicDmg": 0,    // магический урон
                            "physicArmorPercents": 0, // физическая броня
                            "magicArmorPercents": 0 // магическая броня
      };
      var temp_mag = {  "physicalDmg": 0,
                        "magicDmg": 0,
                        "physicArmorPercents": 0,
                        "magicArmorPercents": 0
      };
      //суммирование действий за ход
      for(let move of monster_moves){
        temp_monster.physicalDmg += enemy.monster.moves[move].physicalDmg;
        temp_monster.magicDmg += enemy.monster.moves[move].magicDmg;
        temp_monster.physicArmorPercents += enemy.monster.moves[move].physicArmorPercents;
        temp_monster.magicArmorPercents += enemy.monster.moves[move].magicArmorPercents;
      }
      for(let move of mag_moves){
        temp_mag.physicalDmg += hero.mag.moves[move].physicalDmg;
        temp_mag.magicDmg += hero.mag.moves[move].magicDmg;
        temp_mag.physicArmorPercents += hero.mag.moves[move].physicArmorPercents;
        temp_mag.magicArmorPercents += hero.mag.moves[move].magicArmorPercents;
      }
      //вычисляем полученый урон, конец хода
      mag_health = mag_health - (temp_monster.physicalDmg - ((temp_monster.physicalDmg/100)*temp_mag.physicArmorPercents) + temp_monster.magicDmg - ((temp_monster.magicDmg/100)*temp_mag.magicArmorPercents));
      monster_health = monster_health - (temp_mag.physicalDmg - ((temp_mag.physicalDmg/100)*temp_monster.physicArmorPercents) + temp_mag.magicDmg - ((temp_mag.magicDmg/100)*temp_monster.magicArmorPercents));
      cooldownMonster += 1;
      cooldownMag += 1;
      console.log(`Осталось жизней у Вас: ${mag_health}`);
      console.log(`Осталось жизней у врага: ${monster_health}`);
    }else{
          if (mag_health > 0) {
            console.log('Вы победили!');
            break;
          } else if (monster_health > 0) {
            console.log('Вы проиграли!');
            break;
        }
      break;
    }
  }
}


console.log(`Компьютер управляет монстром: ${enemy.monster.name}`);
console.log(`Игрок управляет боевым магом: ${hero.mag.name}`);
const health = readlineSync.questionInt('Для игры введите начальное здоровье Евстафия: ');

game(health);
