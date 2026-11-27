#!/usr/bin/env bash
# Join one or more phone screen recordings into a web-optimised demo video
# (H.264, 720x1558, 30fps, silent, faststart) — the format every mobile
# card uses — plus a first-frame poster PNG to convert to WebP.
#
#   scripts/encode-demo.sh <output-name> <clip1> [clip2 ...]
#   scripts/encode-demo.sh whole-health media-src/whole-health-part1.mov media-src/whole-health-part2.mov
#
# Writes public/videos/<output-name>.mp4 and media-src/<output-name>-poster.png.
# Keep originals in media-src/ (git-ignored); anything in public/ is deployed.
set -euo pipefail

if [ "$#" -lt 2 ]; then
  echo "usage: $0 <output-name> <clip1> [clip2 ...]" >&2
  exit 1
fi

name="$1"; shift
inputs=()
filters=""
labels=""
i=0
for clip in "$@"; do
  inputs+=(-i "$clip")
  filters+="[$i:v]fps=30,scale=720:1558:flags=lanczos,setsar=1[v$i];"
  labels+="[v$i]"
  i=$((i + 1))
done
filters+="${labels}concat=n=$i:v=1:a=0,format=yuv420p[out]"

out="public/videos/$name.mp4"
ffmpeg -v error -y "${inputs[@]}" -filter_complex "$filters" -map "[out]" \
  -c:v libx264 -preset slow -crf 28 -maxrate 900k -bufsize 1800k -profile:v high \
  -movflags +faststart -an "$out"
ffmpeg -v error -y -ss 0.3 -i "$out" -frames:v 1 "media-src/$name-poster.png"

echo "$out ($(du -h "$out" | cut -f1)), poster: media-src/$name-poster.png"
