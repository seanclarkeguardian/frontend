#!/usr/bin/env ruby

require 'rubygems'
require 'bundler/setup'

Bundler.require

# db connection
conn = PG.connect(dbname: 'frontend-dashboard')
# drop existing tables
conn.exec('DELETE FROM js_errors')

s3 = Fog::Storage.new(
  :provider => 'AWS',
  :aws_access_key_id  => ENV['AWSAccessKeyId'],
  :aws_secret_access_key  => ENV['AWSSecretKey']
)

s3.get_bucket('aws-frontend-logs', {
  'prefix' => 'PROD/access.log/%s/frontend-diagnostics' % [Chronic.parse('yesterday').strftime('%Y/%m/%d')],
  'max-keys' => 100
}).body['Contents'].each { |file|
    s3.directories.get('aws-frontend-logs').files.get(file['Key']).body.force_encoding('utf-8').split(/\n/).each{ |line| 
      if (line.include? 'GET /px.gif?js/') 
        # pull out data
        puts line
        line.scan(/- \[([^\]]*).*px\.gif\?js\/([^\s]*)(?:[^,]*,){3}\s([^,]*),"([^"]*)"/) { |timestamp, msg, url, ua| 
          # assume message doesn't have a comma
          msg_parts = /([^,]*),(.*),(\d)*/.match(URI.decode(msg))
          next if msg_parts.nil?
          ua = UserAgentParser.parse(ua)
          conn.exec(
            'INSERT INTO js_errors VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [timestamp, msg_parts[1], url, ua.os.to_s, ua.name.to_s, ua.device.to_s, msg_parts[2], msg_parts[3]]
          )
        }
      end
    }
  }