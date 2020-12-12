npm install -g json
json -I -f package.json \
  -e 'this.name="react-awesome-query-builder-opti"' \
  -e 'this.repository.url="https://github.com/bbernovici/react-awesome-query-builder-opti.git"' \
  -e 'delete this.publishConfig'
