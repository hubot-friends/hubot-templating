import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { Template } from './index.mjs'
describe('Templating Engine', () => {
    it('should render a string literal with the variables interpolated', async () => {
        const data = {
            name: 'John',
            time: 'today'
        }
        const template = new Template('Hello ${name}! How are you ${time}?', data)
        const expected = 'Hello John! How are you today?'
        const actual = await template.render()
        assert.equal(actual, expected)
    })

    it('should inject a file into a template with ${await file(path/to/file)}', async () => {
        const partials = new Map()
        partials.set('layout.html', await readFile('./layout.html', 'utf8'))
        const template =  new Template(await readFile('./test.html', 'utf8'), {}, partials)

        const expected = `<html>
<h1>This is a test html file</h1>
</html>`
        const actual = await template.render()
        assert.equal(actual, expected)
    })
    it('should loop over a list of items and render them in the template', async () => {
        const data = {
            items: [
                {
                    name: 'John'
                },
                {
                    name: 'Jane'
                }
            ]
        }
        const template = new Template(await readFile('./test-loop.html', 'utf8'), data)
        const expected = `<html>
<h1>John</h1>
<h1>Jane</h1>
</html>`
        const actual = await template.render()
        assert.equal(actual, expected)
    })
    it('should render complex objects in the template', async () => {
        const data = {
            users: [
                {
                    name: 'John',
                    address: {
                        street: '123 Main St',
                        city: 'Anytown',
                        state: 'CA'
                    }
                },
                {
                    name: 'Jane',
                    address: {
                        street: '456 Main St',
                        city: 'Anytown',
                        state: 'CA'
                    }
                }
            ]
        }
        const template = new Template(await readFile('./test-complex.html', 'utf8'), data)
        const expected = `
<h1>John</h1>
<p>123 Main St</p>
<p>Anytown</p>
<p>CA</p>
<h1>Jane</h1>
<p>456 Main St</p>
<p>Anytown</p>
<p>CA</p>`
        const actual = await template.render()
        assert.equal(actual, expected)
    })
    it('should allow custom functions to be used the template', async () => {
        const data = {
            name: 'John',
            time: 'today'
        }
        const template = new Template(await readFile('./test-custom-functions.html'), data, null, {
            customFunction: () => 'Hello'
        })
        const expected = 'Hello John! How are you today?'
        const actual = await template.render()
        assert.equal(actual, expected)
    })
    it('should output an error message in the console, but not crash', async () => {
        const data = {
            time: 'today'
        }
        const template = new Template('Hello ${name}! How are you ${time}?', data)
        const expected = 'Hello John! How are you today?'
        try {
            await template.render()
        } catch (e) {
            assert.match(e.stack, /result \= /)
            assert.equal(e.message, 'name is not defined')
        }
    })
})