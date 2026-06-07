class AddNameToUsers < ActiveRecord::Migration[8.1]
  def change
    return if column_exists?(:users, :name)

    add_column :users, :name, :string, null: false, default: "User"
    change_column_default :users, :name, from: "User", to: nil
  end
end
