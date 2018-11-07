目录结构
```
sass/
|
|– abstracts/
|   |– _variables.less    # Sass Variables
|   |– _functions.less    # Sass Functions
|   |– _mixins.less       # Sass Mixins
|   |– _placeholders.less # Sass Placeholders
|
|– base/
|   |– _reset.less        # Reset/normalize
|   |– _typography.less   # Typography rules
|   …                     # Etc.
|
|– components/
|   |– _buttons.less      # Buttons
|   |– _carousel.less     # Carousel
|   |– _cover.less        # Cover
|   |– _dropdown.less     # Dropdown
|   …                     # Etc.
|
|– layout/
|   |– _navigation.less   # Navigation
|   |– _grid.less         # Grid system
|   |– _header.less       # Header
|   |– _footer.less       # Footer
|   |– _sidebar.less      # Sidebar
|   |– _forms.less        # Forms
|   …                     # Etc.
|
|– pages/
|   |– _home.less         # Home specific styles
|   |– _contact.less      # Contact specific styles
|   …                     # Etc.
|
|– themes/
|   |– _theme.less        # Default theme
|   |– _admin.less        # Admin theme
|   …                     # Etc.
|
|– vendors/
|   |– _bootstrap.less    # Bootstrap
|   |– _jquery-ui.less    # jQuery UI
|   …                     # Etc.
|
`– main.less              # Main Sass file
```
# BASE文件夹
`base/`文件夹存放项目中的模板文件。在这里，可以找到重置文件、排版规范文件或者一个样式表——定义一些 HTML 元素公认的标准样式（我喜欢命名为_base.less）。
- _base.less
- _reset.less
- _typography.less  

# LAYOUT文件夹
- _grid.less
- _header.less
- _footer.less
- _sidebar.less
- _forms.less
- _navigation.less

# COMPONENTS文件夹
对于小型组件来说，有一个 components/ 文件夹来存放。相对于 layout/ 的宏观（定义全局线框结构），components/ 更专注于局部组件。该文件夹包含各类具体模块，基本上是所有的独立模块，比如一个滑块、一个加载块、一个部件……由于整个网站或应用程序主要由微型模块构成，components/ 中往往有大量文件。

# PAGES文件夹
如果页面有特定的样式，最好将该样式文件放进 pages/ 文件夹并用页面名字。例如，主页通常具有独特的样式，因此可以在 pages/ 下包含一个 _home.less 以实现需求。

# THEMES文件夹
在大型网站和应用程序中，往往有多种主题。虽有多种方式管理这些主题，但是我个人更喜欢把它们存放在 themes/ 文件夹中。

# ABSTRACTS 文件夹
abstracts/ 文件夹包含了整个项目中使用到的 Sass 辅助工具，这里存放着每一个全局变量、函数、混合宏和占位符。

该文件夹的经验法则是，编译后这里不应该输出任何 CSS，单纯的只是一些 Sass 辅助工具。

# VENDORS文件夹
最后但并非最终的是，大多数的项目都有一个 vendors/ 文件夹，用来存放所有外部库和框架（Normalize, Bootstrap, jQueryUI, FancyCarouselSliderjQueryPowered……）的 CSS 文件。将这些文件放在同一个文件中是一个很好的说明方式:”嘿，这些不是我的代码，无关我的责任。”

# 入口文件
主文件（通常写作 main.less）应该是整个代码库中唯一开头不用下划线命名的 Sass 文件。除 @import 和注释外，该文件不应该包含任何其他代码。

文件应该按照存在的位置顺序依次被引用进来：

1. abstracts/
2. vendors/
3. base/
4. layout/
5. components/
6. pages/
7. themes/   

为了保持可读性，主文件应遵守如下准则：

每个 @import引用一个文件；  
每个 @import单独一行；  
从相同文件夹中引入的文件之间不用空行；  
从不同文件夹中引入的文件之间用空行分隔；  
忽略文件扩展名和下划线前缀。  

```sass
@import 'abstracts/variables';
@import 'abstracts/functions';
@import 'abstracts/mixins';
@import 'abstracts/placeholders';

@import 'vendors/bootstrap';
@import 'vendors/jquery-ui';

@import 'base/reset';
@import 'base/typography';

@import 'layout/navigation';
@import 'layout/grid';
@import 'layout/header';
@import 'layout/footer';
@import 'layout/sidebar';
@import 'layout/forms';

@import 'components/buttons';
@import 'components/carousel';
@import 'components/cover';
@import 'components/dropdown';

@import 'pages/home';
@import 'pages/contact';

@import 'themes/theme';
@import 'themes/admin';
```
