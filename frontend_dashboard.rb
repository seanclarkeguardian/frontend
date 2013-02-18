class FrontendDashboard < Sinatra::Base
  
  get '/' do
    haml :index
  end

  get '/js-errors' do
    haml :js_errors
  end

  get '/yesterday' do
    error_msgs = get_js_errors('yesterday')
    error_msgs.sort! { |a, b| b[0] <=> a[0] }
    if params[:dir] === 'asc'
      error_msgs.reverse!
    end
    haml :yesterday, :locals => { :error_msgs => error_msgs }
  end

  get '/occurrences' do
    error_msgs = get_js_errors('yesterday')
    # group by
    grouped_error_msgs = error_msgs.group_by { |msg| msg[1] }.map { |k, v| [k, v.length] }.sort { |a, b| b[1] - a[1] }
    if params[:dir] === 'asc'
      grouped_error_msgs.reverse!
    end
    haml :occurrences, :locals => { :error_msgs => grouped_error_msgs }
  end

  def get_js_errors(date)
    s3 = Fog::Storage.new(:provider => 'AWS')
    logs = []
    # get all the files for that date
    s3.get_bucket('aws-frontend-logs', {
          'prefix' => 'PROD/access.log/%s/frontend-diagnostics' % [Chronic.parse(date).strftime("%Y/%m/%d")],
          'max-keys' => 100
      }).body['Contents'].each { |file|
        log_name = file['Key']
        # have we already got this log
        log = retireve(log_name)
        if !log 
          log = s3.directories.get('aws-frontend-logs').files.get(log_name).body
          # store log locally
          store(log_name, log)
        end
        logs << log
    }
    # pull out js errors (array of date and message)
    error_msgs = []
    logs.each { |log|
      log.scan(/- \[([^\]]*).*px\.gif\?js\/([^\s]*)[^,]*,[^,]*,[^,]*,([^,]*),"([^"]*)"/) { |date, msg, url, ua| 
        error_msgs << [DateTime.strptime(date, "%d/%b/%Y:%H:%M:%S %Z"), Base64.decode64(msg), url, ua] 
      }
    }
    error_msgs
  end

  def retireve(name)
    name = name.gsub('/', '-')
    (File.exists? 'data/' + name) ? File.open('data/' + name, 'r').read : false
  end

  def store(name, data)
    File.open('data/' + name.gsub('/', '-'), 'w') { |f| f.write(data) }
  end
    
end