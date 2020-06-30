class CreateUnits < ActiveRecord::Migration[6.0]
  def change
    create_table :units do |t|
      t.string :type
      t.string :name
      t.integer :max_hp
      t.integer :current_hp
      t.integer :atk
      t.integer :def
      t.integer :speed

      t.timestamps
    end
  end
end
