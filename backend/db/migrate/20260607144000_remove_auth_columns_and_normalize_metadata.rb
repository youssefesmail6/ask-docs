class RemoveAuthColumnsAndNormalizeMetadata < ActiveRecord::Migration[8.1]
  def up
    remove_column :users, :api_token if column_exists?(:users, :api_token)
    remove_column :users, :password_digest if column_exists?(:users, :password_digest)

    change_column_null :users, :email, false
    change_column_null :users, :role, false

    change_column_default :documents, :upload_status, "pending"
    change_column_null :documents, :filename, false
    change_column_null :documents, :uploaded_by_id, false
    change_column_null :documents, :ai_document_id, false
  end

  def down
    add_column :users, :api_token, :string unless column_exists?(:users, :api_token)
    add_column :users, :password_digest, :string unless column_exists?(:users, :password_digest)

    change_column_null :users, :email, true
    change_column_null :users, :role, true
    change_column_default :documents, :upload_status, "ready"
    change_column_null :documents, :filename, true
    change_column_null :documents, :uploaded_by_id, true
    change_column_null :documents, :ai_document_id, true
  end
end
