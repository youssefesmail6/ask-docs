class CreateDocuments < ActiveRecord::Migration[8.1]
  def change
    create_table :documents do |t|
      t.string :title, null: false
      t.string :filename, null: false
      t.references :uploaded_by, null: false, foreign_key: { to_table: :users }
      t.string :upload_status, null: false, default: "pending"
      t.string :ai_document_id, null: false
      t.string :ai_job_id

      t.timestamps
    end

    add_index :documents, :upload_status
    add_index :documents, :ai_document_id, unique: true
  end
end
