class ChangeTypeToUnitTypeInUnits < ActiveRecord::Migration[6.0]
  def change
    rename_column :units, :type, :unit_type
  end
end
