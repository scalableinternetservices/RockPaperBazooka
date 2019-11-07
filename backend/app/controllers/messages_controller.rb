class MessagesController < ApplicationController
  def index
    @match = Match.find(params[:match_id])
    render json: @match.messages
  end

  def create
    @message = Message.new(params.require(:message).permit(:content, :user_id, :match_id))
    if @message.save
      render json: @message, status: :created
    else
      render json: @message.errors, status: :unprocessable_entity
    end
  end
end