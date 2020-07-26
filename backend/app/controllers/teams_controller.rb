class TeamsController < ApplicationController
  def create
    team = Team.create
    render json: team
  end

  def show
    team = Team.find_by(:id => params[:id])
    render json: team, include: [:units]
  end

  def update
    team = Team.find_by(:id => params[:id])
    team.update(money: params[:money])
    params[:units].each do |unit|
      current_unit = Unit.find_by(:id => unit[:id])
      current_unit.update(name: unit["name"], atk: unit["atk"], def: unit["def"], speed: unit["speed"], max_hp: unit["max_hp"], current_hp: unit["current_hp"])
    end
  end
end
