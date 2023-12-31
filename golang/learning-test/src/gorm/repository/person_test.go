package repository

import (
	"database/sql"
	"github.com/DATA-DOG/go-sqlmock"
	"github.com/go-test/deep"
	"github.com/jinzhu/gorm"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
	"learning-test/src/gorm/model"
	"regexp"
	"testing"
)

type Suite struct {
	suite.Suite
	DB   *gorm.DB
	mock sqlmock.Sqlmock

	repository Repository
	person     *model.Person
}

func (s *Suite) SetupSuite() {
	var (
		db  *sql.DB
		err error
	)

	db, s.mock, err = sqlmock.New()
	require.NoError(s.T(), err)

	s.DB, err = gorm.Open("postgres", db)
	require.NoError(s.T(), err)

	s.DB.LogMode(true)

	s.repository = CreateRepository(s.DB)
}

func (s *Suite) AfterTest(_, _ string) {
	require.NoError(s.T(), s.mock.ExpectationsWereMet())
}

func TestInit(t *testing.T) {
	suite.Run(t, new(Suite))
}

func (s *Suite) Test_repository_Create() {
	var (
		id   = uint(123)
		name = "test-name"
	)

	s.mock.ExpectBegin()
	s.mock.ExpectQuery(regexp.QuoteMeta(
		`INSERT INTO "person" ("id","name") VALUES ($1,$2) RETURNING "person"."id"`)).
		WithArgs(id, name).
		WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(id))
	s.mock.ExpectCommit()

	err := s.repository.Create(id, name)

	require.NoError(s.T(), err)
}

func (s *Suite) Test_repository_Get() {
	var (
		id   = uint(123)
		name = "test-name"
	)

	s.mock.ExpectQuery(regexp.QuoteMeta(
		`SELECT * FROM "person" WHERE (id = $1)`)).
		WithArgs(id).
		WillReturnRows(sqlmock.NewRows([]string{"id", "name"}).
			AddRow(id, name))

	res, err := s.repository.Get(id)

	require.NoError(s.T(), err)
	require.Nil(s.T(), deep.Equal(&model.Person{
		ID:   id,
		Name: name,
	}, res))
}
