pnpm dlx shadcn@latest init


 pnpm dlx shadcn@latest add -a
pnpm approve-builds //pnpmは現在、ビルドスクリプトの実行に明示的な承認を要求します。以下のコマンドを実行してください:​
same@same:~/Developer/pmesystem/pmesystem$ pnpm approve-builds
✔ Choose which packages to build (Press <space> to select, <a> to toggle all, <i> to invert selection) · msw
✔ The next packages will now be built: msw.
Do you approve? (y/N) · true

scr core folder　を作成して、そこにShadcn関連をあつめ、components.jsonを修正

pnpm add supabase --save-dev --allow-build=supabase
pnpx supabase init
pnpx supabase start

pnpm add drizzle-orm dotenv postgres
pnpm add -D drizzle-kit
.env DATABASE_URL
Started supabase local development setup.

         API URL: http://127.0.0.1:54331
     GraphQL URL: http://127.0.0.1:54331/graphql/v1
  S3 Storage URL: http://127.0.0.1:54331/storage/v1/s3
         MCP URL: http://127.0.0.1:54331/mcp
    Database URL: postgresql://postgres:postgres@127.0.0.1:54332/postgres
      Studio URL: http://127.0.0.1:54333
     Mailpit URL: http://127.0.0.1:54334
 Publishable key: sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH
      Secret key: sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz
   S3 Access Key: 625729a08b95bf1b7ff351a663f3a23c
   S3 Secret Key: 850181e4652dd023b7a98c58ae0d2d34bd487ee0cc3254aed6eda37307425907
       S3 Region: local

