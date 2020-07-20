class AddDefaultValueToTeamsMoney < ActiveRecord::Migration[6.0]
  def change
    change_column :teams, :money, :integer, default: 0
  end
end
