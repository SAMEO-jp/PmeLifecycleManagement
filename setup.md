pnpm dlx shadcn@latest init


 pnpm dlx shadcn@latest add -a
pnpm approve-builds //pnpmは現在、ビルドスクリプトの実行に明示的な承認を要求します。以下のコマンドを実行してください:​
same@same:~/Developer/pmesystem/pmesystem$ pnpm approve-builds
✔ Choose which packages to build (Press <space> to select, <a> to toggle all, <i> to invert selection) · msw
✔ The next packages will now be built: msw.
Do you approve? (y/N) · true

pnpm add supabase --save-dev --allow-build=supabase
pnpx supabase init
pnpx supabase start