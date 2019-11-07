require 'test_helper'

class GameConfigurationsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @game_configuration = game_configurations(:one)
  end

  test "should get index" do
    get game_configurations_url, as: :json
    assert_response :success
  end

  test "should create game_configuration 1" do
    local_game_configuation = GameConfiguration.new(
      :name => 'Success1',
      :num_matches => 1,
      :input_set => 'Correct Horse Battery Stapple'
    )
    assert_difference('GameConfiguration.count') do
      post game_configurations_url, params: { game_configuration: { input_set: local_game_configuation.input_set, name: local_game_configuation.name, num_matches: local_game_configuation.num_matches } }, as: :json
    end

    assert_response 201
  end

  test "should create game_configuration 2" do
    local_game_configuation = GameConfiguration.new(
      :name => 'Success2',
      :num_matches => 1,
      :input_set => 'Now With Numbers1'
    )
    assert_difference('GameConfiguration.count') do
      post game_configurations_url, params: { game_configuration: { input_set: local_game_configuation.input_set, name: local_game_configuation.name, num_matches: local_game_configuation.num_matches } }, as: :json
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

  test "should not be able to create invalid input_sets: too few strings" do
    local_game_configuation = GameConfiguration.new(
      :name => 'Test2',
      :num_matches => 1,
      :input_set => 'test2 test2'
    )
    post game_configurations_url, params: { game_configuration: { input_set: local_game_configuation.input_set, name: local_game_configuation.name, num_matches: local_game_configuation.num_matches } }, as: :json
    
    assert_response 422
  end

  test "should not be able to create invalid input_sets: non alpha numeric strings" do
    local_game_configuation = GameConfiguration.new(
      :name => 'Test3',
      :num_matches => 1,
      :input_set => 'test3 test3 test3 test3__$'
    )
    post game_configurations_url, params: { game_configuration: { input_set: local_game_configuation.input_set, name: local_game_configuation.name, num_matches: local_game_configuation.num_matches } }, as: :json
    
    assert_response 422
  end

  test "should not be able to create invalid input_sets: trailing whitespace" do
    local_game_configuation = GameConfiguration.new(
      :name => 'Test4',
      :num_matches => 1,
      :input_set => 'test4 test4 test4 test4  '
    )
    post game_configurations_url, params: { game_configuration: { input_set: local_game_configuation.input_set, name: local_game_configuation.name, num_matches: local_game_configuation.num_matches } }, as: :json
    
    assert_response 422
  end

  test "should not be able to create invalid input_sets: empty set" do
    local_game_configuation = GameConfiguration.new(
      :name => 'Test5',
      :num_matches => 2,
      :input_set => ''
    )
    post game_configurations_url, params: { game_configuration: { input_set: local_game_configuation.input_set, name: local_game_configuation.name, num_matches: local_game_configuation.num_matches } }, as: :json
    
    assert_response 422
  end

  test "should not be able to create a duplicate" do
    local_game_configuation = GameConfiguration.new(
      :name => 'FirstFixture',
      :num_matches => 1,
      :input_set => 'Rock Paper Scissors'
    )
    post game_configurations_url, params: { game_configuration: { input_set: local_game_configuation.input_set, name: local_game_configuation.name, num_matches: local_game_configuation.num_matches } }, as: :json
    
    assert_response 422
  end
end
