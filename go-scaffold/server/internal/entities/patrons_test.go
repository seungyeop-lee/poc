package entities

import (
	"testing"
	"time"
)

func TestPatrons_FindByIDValidate(t *testing.T) {
	type fields struct {
		ID        uint
		LoginID   string
		Password  string
		Email     string
		DeletedAt time.Time
	}
	tests := []struct {
		name    string
		fields  fields
		wantErr bool
	}{
		{
			name: "success",
			fields: fields{
				ID: 1,
			},
			wantErr: false,
		},
		{
			name:    "fail-id is empty",
			fields:  fields{},
			wantErr: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			p := Patrons{
				ID:        tt.fields.ID,
				LoginID:   tt.fields.LoginID,
				Password:  tt.fields.Password,
				Email:     tt.fields.Email,
				DeletedAt: tt.fields.DeletedAt,
			}
			if err := p.FindByIDValidate(); (err != nil) != tt.wantErr {
				t.Errorf("FindByIDValidate() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestPatrons_SaveValidate(t *testing.T) {
	type fields struct {
		ID        uint
		LoginID   string
		Password  string
		Email     string
		DeletedAt time.Time
	}
	tests := []struct {
		name    string
		fields  fields
		wantErr bool
	}{
		{
			name: "success",
			fields: fields{
				LoginID: "test login id",
				Password: "test password",
				Email:   "test email",
			},
			wantErr: false,
		},
		{
			name: "fail-empty LoginID",
			fields: fields{
				Email: "test email",
			},
			wantErr: true,
		},
		{
			name: "fail-empty Email",
			fields: fields{
				LoginID: "test login id",
			},
			wantErr: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			p := Patrons{
				ID:        tt.fields.ID,
				LoginID:   tt.fields.LoginID,
				Password:  tt.fields.Password,
				Email:     tt.fields.Email,
				DeletedAt: tt.fields.DeletedAt,
			}
			if err := p.SaveValidate(); (err != nil) != tt.wantErr {
				t.Errorf("SaveValidate() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestPatrons_UpdateValidate(t *testing.T) {
	type fields struct {
		ID        uint
		LoginID   string
		Password  string
		Email     string
		DeletedAt time.Time
	}
	tests := []struct {
		name    string
		fields  fields
		wantErr bool
	}{
		{
			name: "success",
			fields: fields{
				ID: 1,
			},
			wantErr: false,
		},
		{
			name:    "fail-id is empty",
			fields:  fields{},
			wantErr: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			p := Patrons{
				ID:        tt.fields.ID,
				LoginID:   tt.fields.LoginID,
				Password:  tt.fields.Password,
				Email:     tt.fields.Email,
				DeletedAt: tt.fields.DeletedAt,
			}
			if err := p.UpdateValidate(); (err != nil) != tt.wantErr {
				t.Errorf("UpdateValidate() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestPatrons_DeleteValidate(t *testing.T) {
	type fields struct {
		ID        uint
		LoginID   string
		Password  string
		Email     string
		DeletedAt time.Time
	}
	tests := []struct {
		name    string
		fields  fields
		wantErr bool
	}{
		{
			name: "success",
			fields: fields{
				ID: 1,
			},
			wantErr: false,
		},
		{
			name:    "fail-id is empty",
			fields:  fields{},
			wantErr: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			p := Patrons{
				ID:        tt.fields.ID,
				LoginID:   tt.fields.LoginID,
				Password:  tt.fields.Password,
				Email:     tt.fields.Email,
				DeletedAt: tt.fields.DeletedAt,
			}
			if err := p.DeleteValidate(); (err != nil) != tt.wantErr {
				t.Errorf("DeleteValidate() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}
