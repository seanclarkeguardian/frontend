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
        line.scan(/- \[([^\]]*).*px\.gif\?js\/([^\s]*)(?:[^,]*,){3}\s([^,]*),"([^"]*)"/) { |timestamp, msg, url, ua| 
          # assume message doesn't have a comma 
          msg_parts = /([^,]*),(.*),(\d)*/.match(URI.decode(msg))
          next if msg_parts.nil?
          ua = UserAgentParser.parse(ua)
          JsError.create(
            :timestamp => DateTime.strptime(timestamp, '%m/%b/%Y:%H:%M:%S %z').iso8601,
            :url => url,
            :message => msg_parts[1],
            :file => msg_parts[2],
            :line_no => msg_parts[3],
            :ua_name => ua.name.to_s,
            :ua_device => ua.device.to_s,
            :ua_os => ua.os.to_s
          )
        }
      end
    }
  }