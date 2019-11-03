class AddGameConfigurationToMatch < ActiveRecord::Migration[6.0]
  def change
    change_table(:matches) do |m|
      m.references :user1, foreign_key: {to_table: 'users'}
      m.references :user2, foreign_key: {to_table: 'users'}
      m.references :game_configuration, foreign_key: {to_table: 'game_configurations'}
    end
  end
end
