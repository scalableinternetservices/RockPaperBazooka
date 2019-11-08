class MatchesController < ApplicationController
  before_action :set_match, only: [:show, :join, :update, :destroy]

  # GET /matches
  def index
    @matches = Match.all

    render json: @matches
  end

  # GET /matches/1
  def show
    render json: @match
  end

  # POST /matches
  def create
    @match = Match.new(match_params)

    if @match.save
      render json: @match, status: :created, location: @match
    else
      render json: @match.errors, status: :unprocessable_entity
    end
  end

  def join
    if !@match.user2_id && (join_params.to_i != @match.user1_id) && @match.update_attribute(:user2_id, join_params)
      render json: @match
    else
      render json: @match.errors, status: :unprocessable_entity
    end
  end

  def play
    @match = Match.find(params[:id])
    # user_id field must be one of the users playing
    return render json: {}, status: 401 unless is_player?(@match, params[:player_id])
    # item being played must be a valid input item
    return render json: {}, status: 422 unless valid_input?(@match, params[:game_input])
    # input array of playing user can't be strictly greater than that of the other
    return render json: {}, status: 401 unless is_players_turn?(@match, params[:player_id])
    # can't play if you've already hit the round cap
    return render json: {}, status: 401 if round_cap?(@match, params[:player_id])

    if @match.user1_id == params[:player_id]
      @match.input_set_1 = @match.input_set_1.nil? ? params[:game_input] : @match.input_set_1 + ' ' + params[:game_input]
    else
      @match.input_set_2 = @match.input_set_2.nil? ? params[:game_input] : @match.input_set_2 + ' ' + params[:game_input]
    end

    if @match.save
      render json: @match, status: :created, location: @match
    else
      render json: @match.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /matches/1
  def update
    if @match.update(match_params)
      render json: @match
    else
      render json: @match.errors, status: :unprocessable_entity
    end
  end

  # DELETE /matches/1
  def destroy
    @match.destroy
  end

  private
    def is_player?(match, player_id)
      [match.user1_id, match.user2_id].include?(player_id)
    end

    def valid_input?(match, input)
      GameConfiguration.find(match.game_configuration_id).input_set.split(' ').include?(input)
    end

    def is_players_turn?(match, player_id)
      if match.user1_id == player_id
        (match.input_set_1 || '').split(' ').size <= (match.input_set_2 || '').split(' ').size
      else
        (match.input_set_2 || '').split(' ').size <= (match.input_set_1 || '').split(' ').size
      end
    end

    def round_cap?(match, player_id)
      if match.user1_id == player_id
        GameConfiguration.find(match.game_configuration_id).num_matches <= (match.input_set_1 || '').split(' ').size
      else
        GameConfiguration.find(match.game_configuration_id).num_matches <= (match.input_set_2 || '').split(' ').size
      end

    end
    # Use callbacks to share common setup or constraints between actions.
    def set_match
      @match = Match.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def match_params
      params.require(:match).permit(:user1_id, :user2_id, :game_configuration_id, :input_set_1, :input_set_2)
    end

    def join_params
      params.require(:user2_id)
    end
end
