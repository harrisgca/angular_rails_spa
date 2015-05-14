module API
  class DogsController < ApplicationController

    def index
      render json: Dog.all
    end

    def show
      render json: Dog.find(params[:id])
    end

    def update
      @dog = Dog.find(params[:id])

      if @dog.update(dog_params)
        render json: @dog, status: 200
      else
        render json: {errors: @dog.errors}, status: 422
      end
    end

    def create
      @dog = Dog.new(dog_params)

      if @dog.save
        render json: @dog, status: 201
      else
        render json: {errors: @dog.errors}, status: 422
      end
    end

    def destroy
      @dog = Dog.find(params[:id])
      @dog.destroy
      render json: :no_content
    end

    private
      def dog_params
        params.require(:dog).permit(:name,:breed,:age)
      end
  end
end