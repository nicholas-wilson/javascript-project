class UnitsController < ApplicationController

  def create
    dude = Unit.new
    dude.random_stats(params["level"])
    render json: dude
  end
end
