Frontend Dashboard
==================

Requirements
------------

 * [Bundler](http://gembundler.com/)
 * [MongoDB](http://www.mongodb.org/)

Setup
-----

Install required gems

    $ bundle install

Populate database with yesterday's js error logs

    $ bundle exec rake db:import-errors

(will need environment variables `AWSAccessKeyId` and `AWSSecretKey`)

Running
---------

    $ bundle exec rackup

To run with auto-refresh

    $ bundle exec shotgun config.ru