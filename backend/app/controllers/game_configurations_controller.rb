class GameConfigurationsController < ApplicationController
  before_action :set_game_configuration, only: [:show, :update, :destroy]

  # GET /game_configurations
  def index
    @game_configurations = GameConfiguration.all

    paginate json: @game_configurations, per_page: 10, except: [:created_at, :updated_at]
  end

  # GET /game_configurations/1
  def show
    render json: @game_configuration, except: [:created_at, :updated_at]
  end

  # POST /game_configurations
  def create
    @game_configuration = GameConfiguration.new(game_configuration_params)

    if !(game_configuration_params[:input_set] =~ /\A([A-Za-z0-9]+ ){2,}[A-Za-z0-9]+\z/) then
      render json: {:error => "Unprocessable items"}, status: 422 and return
    end

    return render json: {:error => "Duplicate items"}, status: 422 if game_configuration_params[:input_set].split(' ').uniq!

    if @game_configuration.save
      render json: @game_configuration, status: :created, location: @game_configuration
    else
      render json: @game_configuration.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /game_configurations/1
  def update
    if @game_configuration.update(game_configuration_params)
      render json: @game_configuration, except: [:created_at, :updated_at]
    else
      render json: @game_configuration.errors, status: :unprocessable_entity
    end
  end

  # DELETE /game_configurations/1
  def destroy
    @game_configuration.destroy
  end

  def drop
    GameConfiguration.delete_all
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_game_configuration
      @game_configuration = GameConfiguration.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def game_configuration_params
      params.require(:game_configuration).permit(:name, :num_matches, :input_set)
    end
end
