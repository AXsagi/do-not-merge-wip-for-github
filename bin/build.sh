#!/bin/bash
set -euv

npm run build
ls -a package/
echo "ziped!"
