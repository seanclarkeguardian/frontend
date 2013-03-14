require 'rubygems'
require 'bundler'

Bundler.require

require 'sinatra/activerecord/rake'
require './frontend_dashboard'

desc 'Load the seed data from db/seeds.rb'
namespace :db do
  task :rollback do
    ActiveRecord::Base.logger = Logger.new(STDOUT)
    ActiveRecord::Migration.verbose = true
    ActiveRecord::Migrator.down('db/migrate')
  end

  task :seed do
    seed_file = './db/seeds.rb'
    load(seed_file) if File.exist?(seed_file)
  end
end