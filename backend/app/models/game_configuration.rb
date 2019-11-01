class GameConfiguration < ApplicationRecord
    validates :name, uniqueness: true, length: { minimum: 1 }
    validates :num_matches, :numericality => { :greater_than => 0 }
    validates :input_set, uniqueness: { scope: :num_matches }
end
