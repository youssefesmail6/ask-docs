namespace :askdocs do
  desc "Seed demo HR and technical documents into Rails metadata and the AI RAG service"
  task seed_demo_documents: :environment do
    admin = User.find_by!(role: "admin")
    rag_service = RagService.new

    demo_documents = [
      {
        title: "HR Employee Questions FAQ",
        filename: "hr-employee-questions-faq.txt",
        content: <<~TEXT
          HR Employee Questions FAQ

          Question: How do employees request paid time off?
          Answer: Employees request paid time off through the HR portal. Requests should be submitted at least five business days before the planned absence unless the leave is urgent or medical. Managers review requests based on team coverage and project needs.

          Question: How are reimbursement requests submitted?
          Answer: Employees submit reimbursement requests through the finance form in the HR portal. Receipts must be attached, the business reason must be included, and requests should be submitted within 30 days of the expense.

          Question: What is the remote work policy?
          Answer: Employees may work remotely up to three days per week when their manager approves the schedule. Team ceremonies, customer meetings, onboarding activities, and security-sensitive work may require office attendance.

          Question: What happens during onboarding?
          Answer: New employees complete account setup, security training, HR paperwork, team introductions, and a first-week onboarding checklist. Managers are responsible for assigning a buddy and confirming required tool access.

          Question: When are performance reviews held?
          Answer: Performance reviews happen twice per year. Employees prepare a self-review, managers provide written feedback, and both sides agree on goals for the next cycle.

          Question: How should workplace concerns be reported?
          Answer: Employees should report workplace concerns to HR or their manager. Urgent safety, harassment, discrimination, or retaliation concerns should be escalated directly to HR immediately.
        TEXT
      },
      {
        title: "Technical Company Questions FAQ",
        filename: "technical-company-questions-faq.txt",
        content: <<~TEXT
          Technical Company Questions FAQ

          Question: What is required before a production deployment?
          Answer: Production deployments require a reviewed pull request, passing CI checks, database migration review when applicable, release notes, monitoring confirmation, and a rollback plan.

          Question: How should incidents be handled?
          Answer: Incidents are assigned a severity level. The incident lead opens a response channel, posts regular status updates, coordinates mitigation, and schedules a post-incident review after service is stable.

          Question: What is the code review policy?
          Answer: Every production change requires at least one approving review from a qualified engineer. Security-sensitive changes, database changes, and infrastructure changes require an additional reviewer from the owning team.

          Question: How are access requests approved?
          Answer: Access requests must include the business reason, requested system, access level, and expiration date. Managers approve business need, and system owners approve technical access.

          Question: How are vulnerabilities handled?
          Answer: Critical vulnerabilities must be triaged immediately and patched or mitigated within 24 hours. High severity vulnerabilities require an owner, remediation plan, and target date.

          Question: What is the backup and recovery policy?
          Answer: Production databases are backed up daily. Recovery procedures are tested quarterly, and critical systems must document recovery time objectives and recovery point objectives.
        TEXT
      }
    ]

    demo_documents.each do |attrs|
      document = Document.find_or_initialize_by(title: attrs[:title])
      document.assign_attributes(
        filename: attrs[:filename],
        uploaded_by: admin,
        upload_status: "processing"
      )
      document.save!

      response = rag_service.upload_document(
        document: document,
        content: attrs[:content]
      )

      document.update!(
        ai_job_id: response["job_id"],
        upload_status: response["status"].presence || "ready"
      )

      puts "Seeded #{document.title} into RAG as #{document.ai_document_id}"
    rescue RagService::Error => error
      document&.update(upload_status: "failed")
      abort "Could not seed #{attrs[:title]}: #{error.message}"
    end
  end
end
