class FrontendDashboard < Sinatra::Base
  
  get '/' do
    haml :index, :locals => { :type => '' }
  end

  get '/yesterday' do
    errors = @@pg.exec('SELECT * FROM js_errors ORDER BY timestamp ' + (params[:dir] === 'asc' ? 'ASC' : 'DESC'))
    haml :yesterday, :locals => { :errors => errors, :type => 'yesterday' }
  end

  get '/occurrences' do 
    if (!params[:file].nil?) 
      errors = @@pg.exec('SELECT %{by} AS by, count(%{by}) AS occurrences FROM js_errors WHERE file=$1 GROUP BY %{by} ORDER BY occurrences DESC' % { 
        :by => params[:by] || ((!params[:file].nil?) ? 'message' : 'file')
      }, [params[:file]])
    elsif (!params[:message].nil?) 
      errors = @@pg.exec('SELECT %{by} AS by, count(%{by}) AS occurrences FROM js_errors WHERE message=$1 GROUP BY %{by} ORDER BY occurrences DESC' % { 
        :by => params[:by] || ((!params[:file].nil?) ? 'message' : 'file')
      }, [params[:message]])
    else
      errors = @@pg.exec('SELECT %{by} AS by, count(%{by}) AS occurrences FROM js_errors GROUP BY %{by} ORDER BY occurrences DESC' % { 
        :by => params[:by] || ((!params[:file].nil?) ? 'message' : 'file')
      })
    end
    haml :occurrences, :locals => { :errors => errors, :type => 'occurrences' }
  end

  get '/user-agents' do
    errors = @@pg.exec('SELECT * FROM js_errors')
    haml :'user_agents', :locals => { :errors => errors, :type => 'user-agents'}, :cdata => true
  end


  ##########
  ## HELPERS
  ##########

  attr_accessor :s3, :pg
  @@pg = PG.connect(dbname: 'frontend-dashboard')
    
end