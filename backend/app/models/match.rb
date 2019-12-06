class Match < ApplicationRecord
    validates :user1_id, allow_blank: false, :numericality => { :greater_than_or_equal_to => 0 }
    validates :user2_id, allow_blank: true, allow_nil: true, :numericality => { :greater_than_or_equal_to => 0 }
    validates :game_configuration_id, allow_blank: false, :numericality => { :greater_than_or_equal_to => 0 }
    has_many :messages
    belongs_to :user1, class_name: "User", foreign_key: "user1_id"
    belongs_to :user2, class_name: "User", foreign_key: "user2_id"
    belongs_to :game_configuration, class_name: "GameConfiguration", foreign_key: "game_configuration_id"
end
