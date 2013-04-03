# load YAML and connect
database_yaml = YAML::load(File.read('./config/database.yml'))
puts 'Initializing mongodb'
if database_yaml[settings.environment.to_s] && database_yaml[settings.environment.to_s]['adapter'] == 'MongoDB'
  mongo_database = database_yaml[settings.environment.to_s]
  mongo_database_url = ENV['MONGO_DATABASE_URL'] || mongo_database['url']
  MongoMapper.setup({'production' => {'uri' => "mongodb://#{mongo_database_url}/#{mongo_database['name']}"}}, 'production')
end