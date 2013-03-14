class CreateJsError < ActiveRecord::Migration
  def self.up
    create_table :js_errors do |t|
      t.timestamp :timestamp
      t.text :url
      t.text :message
      t.text :file
      t.integer :line_no
      t.string :ua_name
      t.string :ua_device
      t.string :ua_os
    end
  end

  def self.down
    drop_table :js_errors
  end
end
