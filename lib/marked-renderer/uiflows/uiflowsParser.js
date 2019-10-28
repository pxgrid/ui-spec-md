'use strict'

const _ = require('lodash')

const HEAD = /^\s*\[([^\]]*)\](\([^)]+\))?\s*$/
const SEPARATOR = /^-+$/
const LINK = /^\s*==>\s*([^:\]]*):?([^:\]]+)?/
const BLANK = /^\s*$/

const parseByLine = function(line, num) {
  if (HEAD.test(line)) {
    return {
      type: 'head',
      content: RegExp.$1,
      href: RegExp.$2.replace(/(\(|\))/g, ''),
    }
  }

  if (SEPARATOR.test(line)) {
    return { type: 'separator' }
  }

  if (LINK.test(line)) {
    return { type: 'link', content: RegExp.$1, target: RegExp.$2 }
  }

  if (BLANK.test(line)) {
    return { type: 'blank' }
  }

  return { type: 'text', content: line }
}

const lexer = function(code) {
  return code.split(/\n/).map(parseByLine)
}

const DotNode = class {
  constructor(id) {
    this.id = id
    this.label = []
    this.href = null
  }

  addRecord(record) {
    this.label.push(record)
  }

  setLink(href) {
    this.href = href
  }
}

const DotRecord = class {
  constructor(port, record) {
    this.port = port
    this.record = record === undefined ? [] : record
  }

  addItem(item) {
    this.record.push(item)
  }
}

const DotLink = class {
  constructor(linkFrom, linkTo) {
    this.from = linkFrom
    this.to = linkTo
  }
}

const DotTree = function(tokens) {
  this.nodes = []
  this.links = []

  let portCount = 0
  let namePool = []

  for (let i = 0, l = tokens.length; i < l; i++) {
    let token = tokens[i]
    let tokenPrev = i !== 0 ? tokens[i - 1] : null

    switch (token.type) {
      case 'head': {
        portCount = 0

        if (namePool.indexOf(token.content) === -1) {
          namePool.push(token.content)
        }

        let nodeId = `node${namePool.indexOf(token.content)}`
        let node = new DotNode(nodeId)

        let record0 = new DotRecord(`port${portCount++}`, [token.content])
        node.addRecord(record0)

        if (!!token.href) {
          node.setLink(token.href)
        }

        this.nodes.push(node)
        break
      }

      case 'text': {
        let node = this.nodes[this.nodes.length - 1]
        if (!node) break
        //ひとつ前のトークンタイプに応じて
        //新規labelの追加か、recordの続きかを分岐
        if (
          (!!tokenPrev && tokenPrev.type === 'head') ||
          (!!tokenPrev && tokenPrev.type === 'separator') ||
          (!!tokenPrev && tokenPrev.type === 'link')
        ) {
          let emptyRecord = new DotRecord(`port${portCount++}`)
          node.addRecord(emptyRecord)
        }

        let record = node.label[node.label.length - 1]
        record.addItem(token.content)
        break
      }

      case 'separator': {
        break
      }

      case 'link': {
        let node = this.nodes[this.nodes.length - 1]
        if (!node) break

        if (namePool.indexOf(token.content) === -1) {
          namePool.push(token.content)
        }

        let linkFrom = `${node.id}:port${portCount - 1}`
        let linkTo = `node${namePool.indexOf(token.content)}:port0`
        let link = new DotLink(linkFrom, linkTo)

        this.links.push(link)
        break
      }
    }
  }

  // リンクされているが、
  // ↑の処理で一度も作られなかった node を生成する
  namePool.forEach(
    function(name, i) {
      let nodeid = `node${i}`
      let isExisted = this.nodes.some(function(o) {
        return o.id === nodeid
      })

      if (!isExisted) {
        this.nodes.push({
          id: nodeid,
          label: [
            {
              port: 'port0',
              record: [name],
            },
          ],
        })
      }
    }.bind(this),
  )

  return this
}

DotTree.prototype.getCode = function() {
  let template = _.template(`
		digraph "" {

		graph [ rankdir = "LR" ];
		node [
			fontsize = "16"
			shape = "record"
			tooltip = ""
		];
		edge [];

		<% _.each( nodes, function ( node ) {%>
			"<%= node.id %>" [
				<%if ( node.href ) { %>
					URL = "<%= node.href %>"
					tooltip = "<%= node.href %>"
				<% } else { %>
					tooltip = ""
				<% } %>
				label = "
					<% _.each( node.label, function ( label, i ) { %>
						<<%= label.port %>> <%= label.record.join( '|' ) %>
						<% if ( node.label.length - 1 !== i ) { %> | <% } %>
					<% } )%>
				"
			];
		<% } )%>

		<% _.each( links, function ( link ) {%>
			<%= link.from %> -> <%= link.to %>;
		<% } )%>
		}
	`)

  return template({ nodes: this.nodes, links: this.links })
}

const uiflowsParser = function(code) {
  let tokens = lexer(code)
  let dotTree = new DotTree(tokens)
  return dotTree.getCode()
}

module.exports = uiflowsParser
