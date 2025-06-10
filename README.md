# String Literal Templating Engine

## Installation

```sh
npm i @hubot-friends/hubot-templating
```

## Usage

```javascript
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Template } from '@hubot-friends/hubot-templating'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const WWW_FOLDER = `${path.resolve(__dirname, './www')}/`

// files like layout files to be leveraged in templates.
const partials = new Map()

// some functions to be used int the templates
const functions = {
    compare: (a, b)=> a == b,
    current: (a, b)=> a.endsWith(b) ? ' current' : '',
    difference: (posts, index)=> posts.length - index - 1,
    format: (date, format)=> date.toLocaleDateString(undefined, format),
    formatTime: (date, format)=> date.toLocaleTimeString(undefined, format),
    formatDate: (date, format)=> date.toLocaleDateString(undefined, format),
}

for await (let file of files){
    let data = await File.readFile(file, 'utf-8')
    let key = file.replace(`${WWW_FOLDER}/`, '').replace(/[\s|\-]/g, '_')
    if(key.indexOf('.html') > -1) {
        partials.set(key, data)
    }
}

const template = new Template('Some text with ${prop.content} in quotes', {prop: content = 'testing content'}, partials, functions)
const text = await template.render()

```

View [index.test.mjs](index.test.mjs) and [test.html](test.html) to see examples on how to create templates.
