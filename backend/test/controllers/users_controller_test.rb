require 'test_helper'

class UsersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
  end

  test "should get index" do
    get users_url, as: :json
    assert_response :success
  end

  test "should create user" do
    assert_difference('User.count') do
      post users_url, params: { user: { name: 'new user' } }, as: :json
    end

    assert_response 201
  end

  test "should show user" do
    get user_url(@user), as: :json
    assert_response :success
  end

  test "should update user" do
    patch user_url(@user), params: { user: { name: @user.name } }, as: :json
    assert_response 200
  end

  test "should not create new user on login if user exists" do
    assert_no_difference('User.count') do
      post '/login', params: { user: { name: @user.name } }, as: :json
    end
    assert_response 200
  end

  test "should create new user on login if user does not exist" do
    assert_difference('User.count') do
      post '/login', params: { user: { name: "new guy" } }, as: :json
    end
    assert_response 200
  end
end
