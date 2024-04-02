#!/usr/bin/env bash
set -eou pipefail

mkdir model

pushd model

curl -OL https://github.com/infinitered/nsfwjs/raw/master/models/inception_v3/group1-shard1of6
curl -OL https://github.com/infinitered/nsfwjs/raw/master/models/inception_v3/group1-shard2of6
curl -OL https://github.com/infinitered/nsfwjs/raw/master/models/inception_v3/group1-shard3of6
curl -OL https://github.com/infinitered/nsfwjs/raw/master/models/inception_v3/group1-shard4of6
curl -OL https://github.com/infinitered/nsfwjs/raw/master/models/inception_v3/group1-shard5of6
curl -OL https://github.com/infinitered/nsfwjs/raw/master/models/inception_v3/group1-shard6of6
curl -OL https://github.com/infinitered/nsfwjs/raw/master/models/inception_v3/model.json
