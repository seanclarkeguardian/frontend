s3 = Fog::Storage.new(
  :provider => 'AWS',
  :aws_access_key_id  => ENV['AWSAccessKeyId'],
  :aws_secret_access_key  => ENV['AWSSecretKey']
)

s3.get_bucket('aws-frontend-logs', {
  'prefix' => 'PROD/access.log/%s/frontend-diagnostics' % [Chronic.parse('yesterday').strftime('%Y/%m/%d')]
}).body['Contents'].each { |file|
    puts "Reading file #{file['Key']}"
    s3.directories.get('aws-frontend-logs').files.get(file['Key']).body.force_encoding('utf-8').split(/\n/).each{ |line| 
      if (line.include? 'GET /px.gif?js/') 
        # pull out data
        line.scan(/- \[([^\]]*).*px\.gif\?js\/([^\s]*)(?:[^,]*,){3}\s([^,]*),"([^"]*)"/) { |timestamp, msg, url, ua| 
          msg_parts = CGI::parse(msg)
          next unless msg_parts.has_key?('message')
          ua = UserAgentParser.parse(ua)
          JsError.create(
            :timestamp => DateTime.strptime(timestamp, '%d/%b/%Y:%H:%M:%S %z'),
            :url => url,
            :message => URI.decode(msg_parts['message'][0]),
            :file => URI.decode(msg_parts['filename'][0]),
            :line_no => URI.decode(msg_parts['lineno'][0]),
            :ua_name => ua.name.to_s,
            :ua_device => ua.device.to_s,
            :ua_os => ua.os.to_s
          )
        }
      end
    }
  }