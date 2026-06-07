Query.destroy_all if defined?(Query)
Document.destroy_all if defined?(Document)
User.destroy_all

User.create!(
  name: "Admin User",
  email: "admin@askdocs.test",
  role: "admin"
)

User.create!(
  name: "Employee User",
  email: "employee@askdocs.test",
  role: "employee"
)

puts "Seeded users:"
User.order(:role).each do |user|
  puts "#{user.role}: #{user.email}"
end
