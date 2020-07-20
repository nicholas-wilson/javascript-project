class TeamsController < ApplicationController
  def show
    team = Team.find_by(:id => params[:id])
    render json: team, include: [:units]
  end
end
