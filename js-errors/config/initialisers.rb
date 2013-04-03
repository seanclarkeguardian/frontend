# load YAML and connect
dbconfig = YAML.load(ERB.new(File.read('config/database.yml')).result)
if dbconfig[settings.environment.to_s] && dbconfig[settings.environment.to_s]['adapter'] == 'mongodb'
  puts 'Initializing mongodb'
  MongoMapper.setup(dbconfig, settings.environment.to_s)
end