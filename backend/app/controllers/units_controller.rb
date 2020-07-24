class UnitsController < ApplicationController

  def create
    dude = Unit.new
    dude.random_stats(params["level"])
    if params["teamId"]
      dude.team_id = params["teamId"]
      dude.save
    end
    render json: dude
  end

  def update
    dude = Unit.find_by(id: params["id"])
    puts params
  end

  def destroy
    Unit.find_by(id: params["id"]).delete
  end
end
