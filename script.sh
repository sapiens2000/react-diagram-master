#!/bin/bash

directory="./packages"

# 복사 대상 폴더 경로
target_folder="./prototype/node_modules/@projectstorm"

# 폴더 이름 배열 초기화
folders=()

# 디렉토리 경로의 하위 디렉토리 목록을 배열로 가져오기
for folder_path in $directory/*/; do
  # 디렉토리 경로에서 실제 폴더 이름만 추출하기
  folders=$(basename "$folder_path")
  # 폴더 이름을 배열에 추가하기
  folders+=("$folders")
done

# 각 폴더에 대해서 반복문 실행
for folder in "${folders[@]}"; do
  # 폴더 내의 모든 dist 디렉토리 내 파일의 리스트를 얻음
  files=$(find "$folder/dist" -type f)

  # 파일이 존재하는 경우 복사
  if [ -n "$files" ]; then
    cp -r "$folder/dist"/* "$target_folder/"
  fi
done
