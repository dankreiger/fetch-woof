
#!/usr/bin/env sh
npm run clean
echo "┏━━━ 📦 $PACKAGE_NAME: build ━━━━━━━━━━━━━━━━━━━"
tsc && rollup -c