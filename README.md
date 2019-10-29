<p align="center" style="background-color:#0f396e; padding: 30px;">
  <img src="https://ui-spec-md.netlify.com/assets/img/logo.png" width="120px" /></br>
  Efficient markdown compiler for Application screen documentation.
</p>

# UI Spec MD

This is the successor to [ui\-spec\-md](https://github.com/pxgrid/ui-spec-md).

UI Spec MD is the efficient markdown compiler for Application screen documentation with [UI Flows](https://signalvnoise.com/posts/1926-a-shorthand-for-designing-ui-flows) Graph.
UI Spec MD compiles special markdown with following features

-   YAML header consists of the title and screen capture image path
-   Github-flavored Markdown
-   UI Flows code blocks

## Example

-   [Top](https://ui-spec-md-example.netlify.com/)
-   [Product List](https://ui-spec-md-example.netlify.com/product/index.html)

## UI Flow codeblock

When you make app screen documentation, you may need to have UI Flows Graph

UI Spec MD arrows to contain special code blocks to draw UI Flows with markdown friendly easy syntax.
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

ui-spec-md [options]

Generate spec files from markdown

Commands:
ui-spec-md dev-template-server [options] Serve server for developing
templates.
ui-spec-md edit-server [options] Serve editable server to edit spec
markdown.
ui-spec-md generate [options] Generate spec files from markdown
[default]
ui-spec-md theme-init [dirName] Copy theme directory to working
directory.

Options:
--help Show help [boolean]
--version Show version number [boolean]
-m, --mdDir Path of the source(markdown) directory [string][required]
-d, --destDir Path of directory to write out converted html
[string][required]
-t, --themeDir Path of theme directory that include template files [string]

### package.json scripts examples

```
  "scripts": {
    "generate": "ui-spec-md generate -m md -d dist/public -t theme/standard",
    "edit-server": "ui-spec-md edit-server -m md -d dist/edit",
  },
```
