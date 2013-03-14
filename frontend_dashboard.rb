require './config/environments'
require './models/js_error'

class FrontendDashboard < Sinatra::Base
  
  get '/' do
    haml :index, :locals => { :type => '' }
  end

  get '/yesterday' do
    haml :yesterday, :locals => { :errors => JsError.all(:order => 'timestamp DESC'), :type => 'yesterday' }
  end

  get '/occurrences' do 
    if (params[:file] || params[:message])
      groupBy = (params[:file]) ? 'message' : 'file';
      errors = JsError.select("#{groupBy} as by, count(#{groupBy}) as occurrences").where((groupBy === 'file' ? 'message' : 'file') + '=?', params[:file] || params[:message]).group(groupBy).order('occurrences DESC')
    else
      errors = JsError.select("#{params[:by]} as by, count(#{params[:by]}) as occurrences").group(params[:by]).order('occurrences DESC')
    end
    haml :occurrences, :locals => { :errors => errors, :type => 'occurrences' }
  end

  get '/user-agents' do
    haml :'user_agents', :locals => { :errors => JsError.all, :type => 'user-agents'}, :cdata => true
  end
    
end