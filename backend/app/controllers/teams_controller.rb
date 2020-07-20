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
    # use this when I recruit new unit or earn more money
  end
end
