require 'test_helper'

class MessagesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @match = matches(:one)
    @user1 = users(:one)
    @user2 = users(:two)
    @game_configuration = game_configurations(:one)
    @message1 = messages(:one)
    @message2 = messages(:two)
  end

  test 'should create message' do
    assert_difference('Message.count') do
      post match_url(@match) + '/messages', params: {
        message: {
          user_id: @user1.id,
          match_id: @match.id,
          content: 'new message!'
        }
      }
    end
    assert 201
  end

  test 'should retrieve messages on match' do
    get match_url(@match) + '/messages', as: :json
    assert :success
  end

end