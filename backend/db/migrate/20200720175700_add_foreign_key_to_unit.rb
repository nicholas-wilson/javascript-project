class AddForeignKeyToUnit < ActiveRecord::Migration[6.0]
  def change
    add_reference :units, :team, foreign_key: true
  end
end
