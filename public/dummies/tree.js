var SCREEN_SPEC_MD_TREE_DATA = JSON.parse(`{
  "path": "/",
  "rootPath": "/index.html",
  "filename": "index.html",
  "title": "画面仕様書",
  "children": [
    {
      "path": "error/",
      "rootPath": "/error/index.html",
      "filename": "index.html",
      "title": "エラー画面 共通事項",
      "children": [
        {
          "rootPath": "/error/error-404.html",
          "filename": "error-404.html",
          "title": "404 Error画面"
        },
        {
          "rootPath": "/error/error-500.html",
          "filename": "error-500.html",
          "title": "500 Error画面"
        }
      ]
    },
    {
      "path": "login/",
      "rootPath": "/login/index.html",
      "filename": "index.html",
      "title": "ログイン画面",
      "children": [
        {
          "rootPath": "/login/change-password.html",
          "filename": "change-password.html",
          "title": "パスワード変更画面"
        }
      ]
    },
    {
      "path": "product/",
      "rootPath": "/product/index.html",
      "filename": "index.html",
      "title": "商品一覧画面",
      "children": [
        {
          "path": "detail/",
          "rootPath": "/product/detail/index.html",
          "filename": "index.html",
          "title": "商品詳細編集画面",
          "children": [
            {
              "rootPath": "/product/detail/prodcut-category-select-dIalog.html",
              "filename": "prodcut-category-select-dIalog.html",
              "title": "商品カテゴリー選択ダイアログ"
            }
          ]
        },
        {
          "rootPath": "/product/product-edit.html",
          "filename": "product-edit.html",
          "title": "商品編集画面"
        },
        {
          "rootPath": "/product/product-new.html",
          "filename": "product-new.html",
          "title": "商品追加画面"
        }
      ]
    },
    {
      "path": "settings/",
      "rootPath": "/settings/index.html",
      "filename": "index.html",
      "title": "設定画面",
      "children": []
    },
    {
      "path": "common/",
      "rootPath": "",
      "filename": "",
      "title": "",
      "children": [
        {
          "path": "header/",
          "rootPath": "",
          "filename": "",
          "title": "",
          "children": [
            {
              "rootPath": "/common/header/common-header-menu.html",
              "filename": "common-header-menu.html",
              "title": "共通ヘッダーのサブメニュー"
            },
            {
              "rootPath": "/common/header/common-header.html",
              "filename": "common-header.html",
              "title": "共通ヘッダー"
            }
          ]
        }
      ]
    },
    {
      "rootPath": "/structure.html",
      "filename": "structure.html",
      "title": "全体構成"
    }
  ]
}`)
