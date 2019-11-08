require 'test_helper'

class MatchesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @match = matches(:one)
    @player2_turn_match = matches(:player_two_turn_match)
    @finished_match = matches(:finished_match)
    @user1 = users(:one)
    @user2 = users(:two)
    @user3 = users(:three)
    @game_configuration = game_configurations(:one)
  end

  test "should get index" do
    get matches_url, as: :json
    assert_response :success
  end

  test "should create match" do
    assert_difference('Match.count') do
      post matches_url, params: { match: { user1_id: @user1.id, user2_id: @user2.id, game_configuration_id: @game_configuration.id } }, as: :json
    end
    assert_response 201
  end

  test "should show match" do
    get match_url(@match), as: :json
    assert_response :success
  end

  test "should update match" do
    patch match_url(@match), params: { match: { input_set_1: @match.input_set_1, input_set_2: @match.input_set_2 } }, as: :json
    assert_response 200
  end

  test "should destroy match" do
    assert_difference('Match.count', -1) do
      delete match_url(@match), as: :json
    end

    assert_response 204
  end

  test "should play one move" do
    patch match_url(@match) + '/play', params: { player_id: 1, game_input: 'Rock' }, as: :json
    assert_response 201
  end

  test "should not allow other users to play" do
    patch match_url(@match) + '/play', params: { player_id: 3, game_input: 'Rock' }, as: :json
    assert_response 401
    assert response.body.include?('Not a valid player_id')
  end

  test "should not allow invalid inputs" do
    patch match_url(@match) + '/play', params: { player_id: 1, game_input: 'Bazoooka' }, as: :json
    assert_response 422
    assert response.body.include?('Not a valid input')
  end

  test "should not turn desync" do
    patch match_url(@player2_turn_match) + '/play', params: { player_id: 1, game_input: 'Rock' }, as: :json
    assert_response 401
    assert response.body.include?('Not your turn')
    patch match_url(@player2_turn_match) + '/play', params: { player_id: 2, game_input: 'Rock' }, as: :json
    assert_response 201
  end

  test "should not allow moves when move cap reached" do
    patch match_url(@finished_match) + '/play', params: { player_id: 1, game_input: 'Rock' }, as: :json
    assert_response 401
    assert response.body.include?('Maximum number of turns exceeded')
    patch match_url(@finished_match) + '/play', params: { player_id: 2, game_input: 'Rock' }, as: :json
    assert_response 401
    assert response.body.include?('Maximum number of turns exceeded')
  end
end
