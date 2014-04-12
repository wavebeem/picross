#!/bin/bash
files=(
    textures
    ui-icons
    fonts
    src
    lib
    bg

    *.css
    index.html
)
rm -rf dist
mkdir dist
cp -r "${files[@]}" dist/
s3cmd sync -P dist/ s3://mockbrian-picross/
