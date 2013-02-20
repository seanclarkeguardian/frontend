class FrontendDashboard < Sinatra::Base
  
  get '/' do
    haml :index, :locals => { :type => '' }
  end

  get '/js-errors' do
    haml :js_errors
  end

  get '/yesterday' do
    errors = get_js_errors('yesterday')
    errors.sort! { |a, b| b[0] <=> a[0] }
    if params[:dir] === 'asc'
      errors.reverse!
    end
    haml :yesterday, :locals => { :errors => errors, :type => 'yesterday' }
  end

  get '/occurrences' do
    errors = get_js_errors('yesterday')
    # group by
    grouped_errors = errors.group_by { |error| error[1] }.map { |k, v| [k, v.length] }.sort { |a, b| b[1] - a[1] }
    if params[:dir] === 'asc'
      grouped_errors.reverse!
    end
    haml :occurrences, :locals => { :errors => grouped_errors, :type => 'occurrences' }
  end

  get '/user-agents' do
    errors = get_js_errors('yesterday')
    grouped_errors = errors.group_by { |error| 
      error[3]
    }.map { |k, v| 
      [k, v.length] 
    }.sort { |a, b| 
      b[1] - a[1] 
    }
    if params[:dir] === 'asc'
      grouped_errors.reverse!
    end

    haml :user_agents, :locals => { :errors => grouped_errors, :type => 'user-agents' }
  end

  get '/graphs' do
    errors = get_js_errors('yesterday')
    haml :graphs, :locals => { :errors => errors, :type => 'graphs'}, :cdata => true
  end


  ##########
  ## HELPERS
  ##########

  attr_accessor :s3
  @@s3 = Fog::Storage.new(:provider => 'AWS')

  def get_js_errors(date)
    errors = []
    # get all the files for the data
   @@s3.get_bucket('aws-frontend-logs', {
         'prefix' => 'PROD/access.log/%s/frontend-diagnostics' % [Chronic.parse(date).strftime("%Y/%m/%d")],
         'max-keys' => 1
      }).body['Contents'].each { |file|
        log_name = file['Key']
        puts 'Retriving %s' % [log_name]
        file_name = retireve(log_name)
        IO.foreach(file_name) { |line|
          errors << line.chomp().split(',')
        }
    }
    errors
  end

  def retireve(log_name)
    file_name = 'data/' + log_name.gsub('/', '-')
    if (!File.exists? file_name)  
      File.open(file_name, 'w') { |f| 
        @@s3.directories.get('aws-frontend-logs').files.get(log_name).body.split('/n').each{ |line| 
          if (line.include? 'GET /px.gif?js/') 
            line.scan(/- \[([^\]]*).*px\.gif\?js\/([^\s]*)(?:[^,]*,){3}\s([^,]*),"([^"]*)"/) { |date, msg, url, ua| 
              # get timestamp in mlliseconds
              timestamp = DateTime.strptime(date, "%d/%b/%Y:%H:%M:%S %Z").to_time.to_i * 1000
              ua = UserAgentParser.parse(ua)
              f.puts [timestamp, msg, url, ua.os.to_s, ua.name.to_s, ua.device.to_s].join(',')
            }
          end
        }
      }
    end
    file_name
  end
    
end