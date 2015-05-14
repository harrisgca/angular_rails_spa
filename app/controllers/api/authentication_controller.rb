module API
  class AuthenticationController < ApplicationController
    respond_to :json
    def sign_in
      user = User.find_by(email: params[:email])
      if user && user.authenticate(params[:password])
        render json: user
      else
        render json: { message: "email or password incorrect" }, status: 422
      end
    end
  end #end class
end #end module