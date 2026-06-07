require "securerandom"

class ReworkDocumentsForAiService < ActiveRecord::Migration[8.1]
  def change
    remove_column :documents, :content if column_exists?(:documents, :content)

    if column_exists?(:documents, :status) && !column_exists?(:documents, :upload_status)
      rename_column :documents, :status, :upload_status
    elsif !column_exists?(:documents, :upload_status)
      add_column :documents, :upload_status, :string, default: "pending"
    end

    add_column :documents, :filename, :string unless column_exists?(:documents, :filename)
    add_reference :documents, :uploaded_by, foreign_key: { to_table: :users } unless column_exists?(:documents, :uploaded_by_id)
    add_column :documents, :ai_document_id, :string unless column_exists?(:documents, :ai_document_id)
    add_column :documents, :ai_job_id, :string unless column_exists?(:documents, :ai_job_id)

    add_index :documents, :upload_status unless index_exists?(:documents, :upload_status)
    add_index :documents, :ai_document_id, unique: true unless index_exists?(:documents, :ai_document_id)

    reversible do |dir|
      dir.up do
        execute "UPDATE documents SET filename = title || '.txt' WHERE filename IS NULL"
        execute "UPDATE documents SET upload_status = 'ready' WHERE upload_status IS NULL"

        admin_id = select_value("SELECT id FROM users WHERE role = 'admin' ORDER BY id LIMIT 1")
        if admin_id.present?
          execute "UPDATE documents SET uploaded_by_id = #{admin_id.to_i} WHERE uploaded_by_id IS NULL"
        end

        select_values("SELECT id FROM documents WHERE ai_document_id IS NULL").each do |id|
          execute "UPDATE documents SET ai_document_id = #{quote(SecureRandom.uuid)} WHERE id = #{id.to_i}"
        end
      end
    end
  end
end
