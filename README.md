# Screen Spec MD

This is the successor to [ui\-spec\-md](https://github.com/pxgrid/ui-spec-md).

Screen Spec MD is the efficient markdown compiler for Application screen documentation with [UI Flows](https://signalvnoise.com/posts/1926-a-shorthand-for-designing-ui-flows) Graph.
Screen Spec MD compiles special markdown with following features

-   YAML header consists of the title and screen capture image path
-   Github-flavored Markdown
-   UI Flows code blocks

## Example

-   [Top](https://screen-spec-md-example.netlify.com/)
-   [Product List](https://screen-spec-md-example.netlify.com/product/index.html)

## UI Flow codeblock

When you make app screen documentation, you may need to have UI Flows Graph

Screen Spec MD arrows to contain special code blocks to draw UI Flows with markdown friendly easy syntax.
Here is a markdown example with the code block for UI Flows.

    ---
    title: doc title
    screen: ./screen1.png?highlight=[[216,193,150,70],[720,140,130,50]]
    ---

    Write docs with markdown.
    You can also contain uiflow code block.

    ```uiflows
    [What the user sees]
    What they do
    ==> What the user sees 2

    [What the user sees 2]
    What they do A
    ==> What the user sees 3
    What they do B
    ==> What the user sees 4
    ```

    | awesome | table |
    | ---     | ---   |
    | data    | data  |

## Compile MD to HTML with cli

screen-spec-md [options]

Generate screen spec documentation files from markdown

Commands:
screen-spec-md edit-server [options] Serve editable server to edit spec markdown.
screen-spec-md generate [options] Generate spec files from markdown [default]

Options:
--help Show help [boolean]
--version Show version number [boolean]
-m, --mdDir Path of the source(markdown) directory [string][required]
-d, --destDir Path of directory to generated spec files [string][required]

### package.json scripts examples

```
  "scripts": {
    "generate": "screen-spec-md -m ./markdown -d ./spec",
    "edit-server": "screen-spec-md edit-server -m ./markdown -d ./_spec"
  },
```
