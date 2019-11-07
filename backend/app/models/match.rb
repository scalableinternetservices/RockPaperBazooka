class Match < ApplicationRecord
    validates :user1_id, allow_blank: false, :numericality => { :greater_than_or_equal_to => 0 }
    validates :user2_id, :numericality => { :greater_than_or_equal_to => 0 }
    validates :game_configuration_id, allow_blank: false, :numericality => { :greater_than_or_equal_to => 0 }
    has_many :messages
end
