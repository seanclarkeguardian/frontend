Frontend Dashboard
==================

Requirements
------------

 * [Bundler](http://gembundler.com/)
 * [Postgres](http://www.postgresql.org/)

Setup
-----

Install required gems

    $ bundle install

Make sure `Postgres` is running and has a database called `frontend_dashboard`. To populate,

    $ bundle exec rake db:migrate
    $ bundle exec rake db:seed

(will need `ENV` variables `AWSAccessKeyId` and `AWSSecretKey` to seed)

To rollback migration, i.e. drop table

    $ bundle exec rake db:rollback

Running
---------

    $ bundle exec rackup

To run with auto-refresh

    $ bundle exec shotgun config.ru