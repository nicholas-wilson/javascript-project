class Unit < ApplicationRecord
  belongs_to :team
  
  ATK_RANGES = {
    weak: [2, 5],
    average: [6, 10],
    strong: [11, 15]
  }
  DEF_RANGES = {
    weak: [1, 3],
    average: [4, 7],
    strong: [8, 10]
  }

  HP_RANGES = {
    weak: [5, 10],
    average: [11, 15],
    strong: [16, 20]
  }

  SPEED_RANGES = {
    weak: [1, 10],
    average: [11, 15],
    strong: [16, 25]
  }

  def random_stats(strength)
    random_atk(strength)
    random_def(strength)
    random_hp(strength)
    random_speed(strength)
    self.name = Faker::Name.first_name
  end

  def random_atk(strength)
    self.atk = rand ATK_RANGES[:"#{strength}"][0]..ATK_RANGES[:"#{strength}"][1]
  end

  def random_def(strength)
    self.def = rand DEF_RANGES[:"#{strength}"][0]..DEF_RANGES[:"#{strength}"][1]
  end

  def random_hp(strength)
    hp = rand HP_RANGES[:"#{strength}"][0]..HP_RANGES[:"#{strength}"][1]
    self.max_hp = hp
    self.current_hp = hp
  end

  def random_speed(strength)
    self.speed = rand SPEED_RANGES[:"#{strength}"][0]..SPEED_RANGES[:"#{strength}"][1]
  end
end
