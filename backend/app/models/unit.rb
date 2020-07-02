class Unit < ApplicationRecord
  ATK_RANGES = {
    weak: [1, 10],
    average: [11, 25],
    strong: [26, 40]
  }
  DEF_RANGES = {
    weak: [1, 5],
    average: [6, 10],
    strong: [11, 25]
  }

  HP_RANGES = {
    weak: [5, 15],
    average: [16, 25],
    strong: [26, 40]
  }

  SPEED_RANGES = {
    weak: [1, 10],
    average: [11, 25],
    strong: [26, 40]
  }

  def random_stats(strength)
    random_atk(strength)
    random_def(strength)
    random_hp(strength)
    random_speed(strength)
  end

  def random_atk(strength)
    self.atk = rand ATK_RANGES[strength][0]..ATK_RANGES[strength][1]
  end

  def random_def(strength)
    self.def = rand DEF_RANGES[strength][0]..DEF_RANGES[strength][1]
  end

  def self.random_hp(strength)
    hp = rand HP_RANGES[strength][0]..HP_RANGES[strength][1]
    self.max_hp = hp
    self.current_hp = hp
  end

  def self.random_speed(strength)
    self.speed = rand SPEED_RANGES[strength][0]..SPEED_RANGES[strength][1]
  end
end
