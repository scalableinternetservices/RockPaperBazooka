FROM ruby

RUN apt-get update && apt-get install -y nodejs --no-install-recommends

RUN gem install rails

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add \
  && echo "deb https://dl.yarnpkg.com/debian/ stable main" > /etc/apt/sources.list.d/yarn.list

RUN apt-get update && apt-get install -y yarn --no-install-recommends

WORKDIR /app

COPY Gemfile Gemfile.lock /app/
RUN gem install bundler && bundle install --jobs 20 --retry 5
RUN bundle install

CMD ["/bin/bash"]