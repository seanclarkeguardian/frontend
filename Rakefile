require 'rubygems'
require 'bundler'

Bundler.require

require 'sinatra/activerecord/rake'
require './frontend_dashboard'

namespace :db do

  desc 'load seed data from db/seeds.rb'
  task :seed do
    seed_file = './db/seeds.rb'
    load(seed_file) if File.exist?(seed_file)
  end

end