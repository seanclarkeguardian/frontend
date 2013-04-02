class JsError
  include MongoMapper::Document

  key :timestamp,  Time
  key :url, String
  key :message, String
  key :file, String
  key :line_no, Integer
  key :ua_name, String
  key :ua_device, String
  key :ua_os, String

  def self.group_occurrences(column, options = {})
    map_function = "function() { emit( this.#{column}, 1); }"
    
    reduce_function = %Q( function(key, values) { 
      var total = 0;
      for (var i = 0; i < values.length; i++) {
        total += values[i];
      }
      return total;
    })
    
    occurrences = collection.map_reduce(map_function, reduce_function, options.merge({ :out => 'grouped_results'})).find
    Hash[occurrences.map { |group| [group['value'].to_i, group['_id']] }].sort_by { |k, v| -k }
  end
end