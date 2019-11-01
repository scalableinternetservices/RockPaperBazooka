require 'test_helper'

class GameConfigurationsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @game_configuration = game_configurations(:one)
  end

  test "should get index" do
    get game_configurations_url, as: :json
    assert_response :success
  end

  test "should create game_configuration" do
    assert_difference('GameConfiguration.count') do
      post game_configurations_url, params: { game_configuration: { input_set: @game_configuration.input_set, name: @game_configuration.name, num_matches: @game_configuration.num_matches } }, as: :json
    end

    assert_response 201
  end

  test "should show game_configuration" do
    get game_configuration_url(@game_configuration), as: :json
    assert_response :success
  end

  test "should update game_configuration" do
    patch game_configuration_url(@game_configuration), params: { game_configuration: { input_set: @game_configuration.input_set, name: @game_configuration.name, num_matches: @game_configuration.num_matches } }, as: :json
    assert_response 200
  end

  test "should destroy game_configuration" do
    assert_difference('GameConfiguration.count', -1) do
      delete game_configuration_url(@game_configuration), as: :json
    end

    assert_response 204
  end
end
