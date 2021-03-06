# Rock Paper Bazooka

Authors: Scott Chow, David Halman, Aditya Wadaskar, Andrew Thompson

## Backend

Instructions assume you're in `backend/`.

### How to set it up:

#### Docker:

- `docker-compose build`
- `docker-compose up`
- `docker-compose run web rails db:create`
  - This needs to be run while both the database and backend container are running.
  - Note: Not running this command means you run the risk of the "rockpaperbazooka_development database not found" error.

#### Plain Rails

- `bundle install`
- `rake db:create`

### How to run it:

- `docker-compose up`

#### Plain Rails

- `rails s`

## Frontend

Instructions assume you're in `frontend/`.

### How to set it up:

Make sure you have `yarn` installed.

- `yarn install`

### How to run it:

- `yarn start`

## AWS

### Creating your environment for small tests:

From the `backend/` directory of the app on the AWS jumpbox:

`eb create -db.engine postgres -db.i db.t3.micro --database.password rockpaper -db.user u --envvars SECRET_KEY_BASE=RANDOM_SECRET --single ENVIRONMENTNAME -i t3.micro`

### Running Tsung Tests:

From anywhere on the jumpbox:

`launch_tsung.sh`
