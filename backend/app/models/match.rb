class Match < ApplicationRecord
    validates :user1_id, allow_blank: false
    validates :game_configuration_id, allow_blank: false
end
