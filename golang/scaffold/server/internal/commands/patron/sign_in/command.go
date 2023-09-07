package signIn

import (
	"context"

	"github.com/seungyeop-lee/go-scaffold/server/internal/aggregates/patron"
	"github.com/seungyeop-lee/go-scaffold/server/tools/datasource"
	"github.com/seungyeop-lee/go-scaffold/server/tools/password"
)

type Command struct {
	patron   *patron.Aggregate
	txWrap   datasource.TxWrapper
	password password.Helper
}

func NewCommand(
	patron *patron.Aggregate,
	txWrap datasource.TxWrapper,
	password password.Helper,
) *Command {
	return &Command{
		patron:   patron,
		txWrap:   txWrap,
		password: password,
	}
}

func (c Command) Do(ctx context.Context, input Patron) error {
	if err := input.Validate(); err != nil {
		return err
	}

	if err := c.txWrap.Do(ctx, c.do(input)); err != nil {
		return err
	}

	return nil
}

func (c Command) do(input Patron) datasource.TxWrapFunc {
	return func(tx datasource.TxCommitter) error {
		_, err := c.patron.Save(*input.NewPatron(c.password), tx)
		if err != nil {
			return err
		}
		return nil
	}
}
