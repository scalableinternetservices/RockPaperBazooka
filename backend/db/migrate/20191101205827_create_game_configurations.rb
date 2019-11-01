class CreateGameConfigurations < ActiveRecord::Migration[6.0]
  def change
    create_table :game_configurations do |t|
      t.string :name
      t.integer :num_matches
      t.string :input_set

      t.timestamps
    end
  end
end
