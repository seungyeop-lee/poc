.PHONY:init
init:
	-git clone --depth 1 -b v1.25.04 https://github.com/supabase/supabase repo
	mkdir -p docker
	cp -rf repo/docker/* docker
	cp -f repo/docker/.env.example docker/.env
