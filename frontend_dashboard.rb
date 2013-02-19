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
    haml :yesterday, :locals => { :error_msgs => error_msgs, :type => 'yesterday' }
  end

  get '/occurrences' do
    error_msgs = get_js_errors('yesterday')
    # group by
    grouped_error_msgs = error_msgs.group_by { |msg| msg[1] }.map { |k, v| [k, v.length] }.sort { |a, b| b[1] - a[1] }
    if params[:dir] === 'asc'
      grouped_error_msgs.reverse!
    end
    haml :occurrences, :locals => { :error_msgs => grouped_error_msgs, :type => 'occurrences' }
  end

  get '/user-agents' do
    errors = get_js_errors('yesterday')
    # group by param
    group_by = params[:'group-by'] || 'os'
    grouped_errors = errors.group_by { |msg| 
      msg[3].send(group_by).to_s 
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
        # have we already got this log
        puts 'Retriving %s' % [log_name]
        file_name = retireve(log_name)
        IO.foreach(file_name) { |line|
          line.scan(/([^,]*),([^,]*),([^,]*),([^,]*)/) { |date, msg, url, ua| 
            errors << [date, Base64.decode64(msg), url, UserAgentParser.parse(ua)] 
          }
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
            line.scan(/- \[([^\]]*).*px\.gif\?js\/([^\s]*)[^,]*,[^,]*,[^,]*,([^,]*),"([^"]*)"/) { |date, msg, url, ua| 
              f.puts [DateTime.strptime(date, "%d/%b/%Y:%H:%M:%S %Z").to_time.to_f, msg, url, ua].join(', ')
            }
          end
        }
      }
    end
    file_name
  end
    
end