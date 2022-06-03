#!/usr/bin/env sh

echo "┏━━━ 🕵️‍♀️ $PACKAGE_NAME lint ━━━━━━━"
eslint src --quiet --ext .ts 