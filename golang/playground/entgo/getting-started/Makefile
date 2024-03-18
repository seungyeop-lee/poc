.PHONY:new-user
new-user:
	go run -mod=mod entgo.io/ent/cmd/ent new User

.PHONY:gen
gen:
	go generate ./ent

.PHONY:new-car-group
new-car-group:
	go run -mod=mod entgo.io/ent/cmd/ent new Car Group

.PHONY:schema
schema:
	atlas schema inspect \
      -u "ent://ent/schema" \
      --dev-url "sqlite://file?mode=memory&_fk=1" \
      -w

.PHONY:generate-migrations
generate-migrations:
	atlas migrate diff migration_name \
      --dir "file://ent/migrate/migrations" \
      --to "ent://ent/schema" \
      --dev-url "sqlite://file?mode=memory&_fk=1"

.PHONY:apply-migrations
apply-migrations:
	atlas migrate apply \
      --dir "file://ent/migrate/migrations" \
      --url "sqlite://file.db?_fk=1"
