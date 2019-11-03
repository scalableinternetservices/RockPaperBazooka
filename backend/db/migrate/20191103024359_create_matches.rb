class CreateMatches < ActiveRecord::Migration[6.0]
  def change
    create_table :matches do |t|
      t.string :input_set_1
      t.string :input_set_2

      t.timestamps
    end
  end
end
