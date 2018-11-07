const util = require('util')
const exec = util.promisify(require('child_process').exec)

async function lsExample (i) {
  const {stdout, stderr} = await exec('dir', {windowsHide: true})
  //console.log('stdout:', stdout)
  //console.log('stderr:', stderr)
  console.log('完成', i)
}

let i = 6
while (i > 0) {
  lsExample(i)
  i--
}
