#!/bin/sh
set -eu

env_file=${1:-.env.deploy}
script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
frontend_root=$(CDPATH= cd -- "$script_dir/.." && pwd)

if [ ! -f "$env_file" ]; then
  echo "Không tìm thấy file cấu hình: $env_file" >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
. "$env_file"
set +a

: "${FRONTEND_REVISION:?Thiếu FRONTEND_REVISION trong $env_file}"
: "${BACKEND_REVISION:?Thiếu BACKEND_REVISION trong $env_file}"
: "${BACKEND_CONTEXT:?Thiếu BACKEND_CONTEXT trong $env_file}"

case "$BACKEND_CONTEXT" in
  /*) backend_root=$BACKEND_CONTEXT ;;
  *) backend_root=$frontend_root/$BACKEND_CONTEXT ;;
esac

verify_repo() {
  repo_name=$1
  repo_path=$2
  expected_revision=$3

  if [ -n "$(git -C "$repo_path" status --porcelain)" ]; then
    echo "$repo_name có thay đổi chưa commit: $repo_path" >&2
    exit 1
  fi

  actual_revision=$(git -C "$repo_path" rev-parse HEAD)
  if [ "$actual_revision" != "$expected_revision" ]; then
    echo "$repo_name đang ở $actual_revision, cần $expected_revision" >&2
    exit 1
  fi

  echo "$repo_name: $actual_revision"
}

verify_repo "Frontend" "$frontend_root" "$FRONTEND_REVISION"
verify_repo "Backend" "$backend_root" "$BACKEND_REVISION"
