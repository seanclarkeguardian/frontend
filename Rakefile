require 'rubygems'
require 'bundler'

Bundler.require

require './frontend_dashboard'

namespace :db do

  desc 'remove errors from database'
  task :delete_errors do
    JsError.destroy_all
  end

  desc 'import yesterday\'s js errors into database'
  task :import_errors => :delete_errors do
    import_file = './db/import_logs.rb'
    load(import_file) if File.exist?(import_file)
  end

end