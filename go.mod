// +heroku goVersion go1.15
// +heroku install ./cmd/...

module github.com/dhcmrlchtdj/feedbox

go 1.15

require (
	github.com/PuerkitoBio/goquery v1.6.1 // indirect
	github.com/andybalholm/brotli v1.0.1 // indirect
	github.com/andybalholm/cascadia v1.2.0 // indirect
	github.com/bradleyjkemp/cupaloy/v2 v2.6.0
	github.com/cespare/xxhash/v2 v2.1.1
	github.com/gofiber/fiber/v2 v2.5.0
	github.com/golang-migrate/migrate/v4 v4.14.1
	github.com/hashicorp/errwrap v1.1.0 // indirect
	github.com/jackc/pgproto3/v2 v2.0.7 // indirect
	github.com/jackc/pgx/v4 v4.10.1
	github.com/joho/godotenv v1.3.0
	github.com/klauspost/compress v1.11.7 // indirect
	github.com/lib/pq v1.9.0 // indirect
	github.com/mmcdole/gofeed v1.1.0
	github.com/mmcdole/goxpp v0.0.0-20200921145534-2f3784f67354 // indirect
	github.com/modern-go/concurrent v0.0.0-20180306012644-bacd9c7ef1dd // indirect
	github.com/modern-go/reflect2 v1.0.1 // indirect
	github.com/pkg/errors v0.9.1
	github.com/rollbar/rollbar-go v1.2.0
	github.com/rs/zerolog v1.20.0
	github.com/valyala/fasthttp v1.21.0 // indirect
	golang.org/x/crypto v0.0.0-20210218145215-b8e89b74b9df
	golang.org/x/net v0.0.0-20210119194325-5f4716e94777 // indirect
	golang.org/x/oauth2 v0.0.0-20210218202405-ba52d332ba99
	golang.org/x/sys v0.0.0-20210218155724-8ebf48af031b // indirect
	golang.org/x/text v0.3.5 // indirect
	google.golang.org/appengine v1.6.7 // indirect
)

replace github.com/mmcdole/gofeed v1.1.0 => github.com/dhcmrlchtdj/gofeed v1.1.1-0.20201206234710-f0de7bc88afd
