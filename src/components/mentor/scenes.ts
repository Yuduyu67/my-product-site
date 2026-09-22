export interface Hint {
  level: 1 | 2 | 3;
  text: string;
}

export interface ConversationEntry {
  role: "student" | "ai";
  content: string;
  hints?: Hint[];
  /** Supabase row id when this exchange is persisted */
  id?: string;
}

export interface Scene {
  id: string;
  name: string;
  description: string;
  language: string;
  defaultCode: string;
  defaultLog: string;
  conversation: ConversationEntry[];
}

interface LanguageScenes {
  python: Scene[];
  java: Scene[];
  cpp: Scene[];
  javascript: Scene[];
  htmlcss: Scene[];
  mysql: Scene[];
  php: Scene[];
}

export const SCENES: LanguageScenes = {
  // ────────────── Python ──────────────
  python: [
    {
      id: "py-keyerror",
      name: "KeyError 字典调试",
      description: "Python 字典访问不存在的 key 时的错误排查",
      language: "Python",
      defaultCode:
        'scores = {"Alice": 95, "Bob": 87}\n\n\ndef get_average(students):\n    total = 0\n    for s in students:\n        total += scores[s["name"]]\n    return total / len(students)\n\nprint(get_average([{"name": "Charlie"}]))',
      defaultLog:
        "Traceback (most recent call last):\n  File \"main.py\", line 6, in <module>\n    print(get_average([{\"name\": \"Charlie\"}]))\n  File \"main.py\", line 4, in get_average\n    total += scores[s[\"name\"]]\nKeyError: 'Charlie'",
      conversation: [
        {
          role: "student",
          content: "老师，我的 Python 程序运行时报了 KeyError，能帮我改一下吗？直接给我正确的代码吧。",
        },
        {
          role: "ai",
          content:
            "我理解你想快点让程序跑起来，但在动手之前，我们先一起理清思路会帮你真正掌握这个知识点。让我先问一个问题：",
          hints: [
            {
              level: 1,
              text: '看看第 6 行 `scores[s["name"]]`，当 `s["name"]` 的值是 "Charlie" 时，字典 `scores` 里真的有一个叫 "Charlie" 的键吗？报错信息里的 `KeyError: \'Charlie\'` 告诉了我们什么？',
            },
            {
              level: 2,
              text: "在 Python 中，访问字典时有几种方式可以安全处理不存在的 key？对比一下 `dict[key]` 和 `dict.get(key, default)` 的区别是什么？",
            },
            {
              level: 3,
              text: '试试把第 6 行改成 `total += scores.get(s["name"], 0)`，然后再次运行，观察结果有什么变化？你也可以考虑在函数开头给每个新出现的名字自动添加默认分数字段。',
            },
          ],
        },
        {
          role: "student",
          content: "哦！我看到问题了，Charlie 确实不在 scores 字典里。如果用 .get() 方法加个默认值是不是就可以了？",
        },
        {
          role: "ai",
          content:
            "完全正确！使用 `.get(key, default)` 是一种非常 Pythonic 的做法。这里 default 设为 0 意味着如果找不到 key，就按 0 分计算。但这只是一个应急方案——从工程角度看，你还会如何设计数据结构，确保每个学生都有对应的分数记录呢？",
          hints: [
            {
              level: 3,
              text: "考虑用 collections.defaultdict(int) 或者在函数入口处初始化新学生姓名，这样比手动设默认值更健壮。",
            },
          ],
        },
      ],
    },
    {
      id: "py-indentation",
      name: "缩进与语法错误",
      description: "Python 独特的缩进规则导致的 SyntaxError",
      language: "Python",
      defaultCode:
        'def calculate_sum(numbers):\nsum_total = 0\n    for num in numbers:\n        sum_total += num\nreturn sum_total\n\nresult = calculate_sum([1, 2, 3])\nprint(result)',
      defaultLog:
        "SyntaxError: expected an indented block after 'for' statement on line 3\nor unindent does not match any outer indentation level on line 5",
      conversation: [
        {
          role: "student",
          content: "我的 Python 代码报 SyntaxError，但看不出哪里错了，能帮我看看吗？",
        },
        {
          role: "ai",
          content: "报错信息提到 'expected an indented block'——这和 Python 的独特规则有关。让我们一步步来：",
          hints: [
            {
              level: 1,
              text: "仔细看第 2 行 `sum_total = 0`，它和前一行 `def calculate_sum` 以及后一行 `for num in numbers` 之间的缩进关系是怎样的？Python 对函数体内的代码有什么要求？",
            },
            {
              level: 2,
              text: "Python 和其他语言（如 C/Java）最大的区别之一是什么？它是用什么方式来界定代码块的？",
            },
            {
              level: 3,
              text: "现在你能试着调整第 2 行的缩进吗？记住 Python 推荐用 4 个空格作为一级缩进。调整后重新运行，看看效果。",
            },
          ],
        },
        {
          role: "student",
          content: "啊我明白了！第 2 行和第 5 行应该和 for 循环体对齐，都要缩进 4 个空格！",
        },
        {
          role: "ai",
          content: "很好！你已经识别出了问题。Python 是一门用缩进来表达作用域的语言，这意味着代码块的层级结构完全依赖缩进而不是花括号 {}。这是很多从 C/Java 转学 Python 的同学最容易踩的坑。记住一个原则：每进入一个新的作用域（函数体、if、for、while），下一行开始的所有内容都应该比上一行多缩进一级。",
        },
      ],
    },
  ],

  // ────────────── Java ──────────────
  java: [
    {
      id: "java-npe",
      name: "NullPointerException 排查",
      description: "Java 中最常见的空指针异常深度分析",
      language: "Java",
      defaultCode:
        'import java.util.List;\nimport java.util.ArrayList;\n\npublic class StudentManager {\n    private List<String> students;\n\n    public void addStudent(String name) {\n        students.add(name);\n    }\n\n    public String getName(int index) {\n        return students.get(index);\n    }\n\n    public static void main(String[] args) {\n        StudentManager mgr = new StudentManager();\n        mgr.addStudent("Alice");\n        System.out.println(mgr.getName(0));\n    }\n}',
      defaultLog:
        "Exception in thread \"main\" java.lang.NullPointerException:\n\tat StudentManager.addStudent(StudentManager.java:8)\n\tat StudentManager.main(StudentManager.java:16)",
      conversation: [
        {
          role: "student",
          content: "Java 报 NullPointerException 了，帮我看看到底怎么回事？直接告诉我怎么修吧。",
        },
        {
          role: "ai",
          content:
            "NPE 是 Java 开发中最经典的错误之一。与其直接给你修复代码，不如我们一起定位根因。先看这段代码：",
          hints: [
            {
              level: 1,
              text: '在第 5 行声明了 `private List<String> students;`，但它初始化为 null 了吗？注意第 5 行和第 7 行之间缺少了什么操作？报错发生在第 8 行 `students.add(name)`——谁调用的是 add() 却还没出生？',
            },
            {
              level: 2,
              text: "在 Java 中，对象的引用变量创建后它的内存空间一定被分配了吗？如果一个成员变量的值为 null，对它调用实例方法会发生什么？这和 C++ 中的 nullptr 有相似之处吗？",
            },
            {
              level: 3,
              text: "在构造函数或类初始化块中加上 `this.students = new ArrayList<>();`，问题就解决了。试试看——但更重要的是思考：为什么要在 constructor 里初始化？",
            },
          ],
        },
        {
          role: "student",
          content: "我明白了！我在第 5 行只是声明了一个引用，但没有给它分配内存。需要在构造方法里加 `students = new ArrayList<>()`。",
        },
        {
          role: "ai",
          content:
            "回答得非常准确！这就是 NPE 的根本原因：引用为 null 时就调用了它的方法。进阶思考一下——除了初始化外，还有哪些场景容易触发 NPE？你可以尝试在 getName 方法中加入 null-safe 的检查，比如判空后再访问，或者用 Optional<String> 来封装返回值。这也是 Java 8+ 推荐的最佳实践。",
        },
      ],
    },
    {
      id: "java-aoob",
      name: "数组越界 ArrayIndexOutOfBoundsException",
      description: "Java 数组操作中的边界条件错误",
      language: "Java",
      defaultCode:
        'public class ScoreProcessor {\n    private int[] scores;\n\n    public ScoreProcessor(int size) {\n        this.scores = new int[size];\n    }\n\n    public void setScore(int index, int score) {\n        scores[index] = score;\n    }\n\n    public int findMax() {\n        int max = scores[0];\n        for (int i = 0; i <= scores.length; i++) {\n            if (scores[i] > max) max = scores[i];\n        }\n        return max;\n    }\n}',
      defaultLog:
        "Exception in thread \"main\" java.lang.ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 5\n\tat ScoreProcessor.findMax(ScoreProcessor.java:14)\n\tat ScoreProcessor.main(ScoreProcessor.java:22)",
      conversation: [
        {
          role: "student",
          content: "程序报 ArrayIndexOutOfBoundsException，索引 5 超出了长度 5 的范围，但我不确定错在哪。",
        },
        {
          role: "ai",
          content: "ArrayIndexOutOfBoundsException 告诉我们访问数组时下标超出了合法范围。我们来分析一下：",
          hints: [
            {
              level: 1,
              text: "一个长度为 5 的数组，其合法索引是从多少到多少？再看看第 14 行的 for 循环条件 `i <= scores.length`——当 i 等于 scores.length 时，会发生什么？",
            },
            {
              level: 2,
              text: "<code>i <= scores.length</code> 和 <code>i < scores.length</code> 在循环结束时各会执行多少次迭代？哪种写法永远不会越界？",
            },
            {
              level: 3,
              text: '将 `<=` 改为 `<` 即可修复这个 bug。同时也建议检查 `setScore` 方法——传入的 index 参数有做边界检查吗？防御性编程在这里非常重要。',
            },
          ],
        },
        {
          role: "student",
          content: "`<=` 应该是 `<`！而且我还应该在 setScore 方法里检查 index 的范围。",
        },
        {
          role: "ai",
          content:
            "非常棒的双重发现！第一处是经典的 off-by-one 错误，第二处是防御性编程的思路——在生产环境中，setScore 应该检查 `index >= 0 && index < scores.length`，否则外部传入非法索引也会导致运行时崩溃。这种思维习惯是区分初级和中级开发者的重要标志。",
        },
      ],
    },
  ],

  // ────────────── C/C++ ──────────────
  cpp: [
    {
      id: "cpp-segfault",
      name: "Segmentation Fault 段错误排查",
      description: "C 语言野指针与内存管理问题的经典调试案例",
      language: "C/C++",
      defaultCode:
        '#include <stdio.h>\n#include <string.h>\n\nvoid print_student(char *name) {\n    printf("Student: %s\\n", name);\n}\n\nint main() {\n    char *name;  /* 未初始化！*/\n    strcpy(name, "Alice");\n    print_student(name);\n    free(name);  /* 对未分配的内存 free = UB */\n    return 0;\n}',
      defaultLog:
        "Segmentation fault (core dumped)",
      conversation: [
        {
          role: "student",
          content: "C 程序一运行就 Segmentation Fault，太烦了，直接给我能跑的代码吧！",
        },
        {
          role: "ai",
          content:
            "我理解段错误很让人沮丧，但这次我们换个方式——通过分析找出根因，以后你再遇到类似问题就能独立解决了。让我引导你一步步找：",
          hints: [
            {
              level: 1,
              text: '看第 9 行 `char *name;`——这行代码之后，`name` 指向哪块内存？注释里写着 "未初始化"，请回忆一下：未初始化的局部指针变量的值是不确定的，它可能指向任意位置。再看第 10 行 `strcpy(name, "Alice")`——它在做什么？是在向哪个地址写数据？',
            },
            {
              level: 2,
              text: "在 Linux 虚拟内存模型中，进程不能访问哪些内存区域？当程序向一个未经 malloc/calloc 分配的地址写入数据时，操作系统会发送什么信号？这个信号的中文名是什么？（提示：你在报错信息里见过它）",
            },
            {
              level: 3,
              text: '修复方案有两个：① 栈上分配 `char name[64];` 然后用 strcpy；② 堆上分配 `char *name = malloc(strlen("Alice") + 1);` 用完记得 free。你觉得哪种更安全？为什么？',
            },
          ],
        },
        {
          role: "student",
          content: "我知道了！name 没分配空间就直接往里面写数据，导致了段错误。应该用 char name[64] 在栈上分配。",
        },
        {
          role: "ai",
          content:
            "完全正确！栈上分配对于小字符串来说是最简单高效的选择。补充一个小知识点：`free(name)` 这一行在修复后也应该删除——因为栈上分配的内存不需要手动释放，只有 malloc/calloc/realloc 出来的才需要 free。你刚刚修复了两个 bug（未初始化 + 错误的 free）。下次遇到 segfault，可以先想想三个方向：① 指针是否初始化？② 数组是否越界？③ 内存是否重复释放？",
        },
      ],
    },
    {
      id: "cpp-makefile",
      name: "Makefile 编译环境调试",
      description: "Linux GCC/Make 编译系统的常见陷阱",
      language: "C/C++",
      defaultCode: "# Makefile\nCC = gcc\nCFLAGS = -Wall -g\n\nall: myapp\n\nmyapp: main.o utils.o\n\t$(CC) $(CFLAGS) -o myapp main.o utils.o\n\nmain.o: main.c\n\t$(CC) $(CFLAGS) -c main.c\n\nutils.o: utils.c\n\t$(CC) $(CFLAGS) -c utils.c\n\nclean:\n\trm -f *.o myapp",
      defaultLog:
        "make: *** No rule to make target 'utils.o', needed by 'myapp'.  Stop.\nor\nfatal error: stdio.h: No such file or directory\ncompilation terminated.",
      conversation: [
        {
          role: "student",
          content: "make 命令报错说找不到 utils.o 的规则，还有编译时说找不到 stdio.h，这是什么情况？",
        },
        {
          role: "ai",
          content: "Makefile 编译报错通常涉及两个层面：一是 Make 依赖图的问题，二是编译器环境问题。我们从 Make 的错误开始：",
          hints: [
            {
              level: 1,
              text: "看一下报错信息：`No rule to make target 'utils.o'`。查看你的 Makefile 目录结构中，真的有 `utils.c` 这个文件存在吗？Make 是按照文件名来找规则的——如果文件名拼写不对或缺失，它就会报这个错。",
            },
            {
              level: 2,
              text: "'stdio.h: No such file or directory' 这个错误说明 GCC 找不到标准库头文件。这可能意味着：你没有安装完整的 GCC 工具链，或者你在交叉编译环境中工作但没有指定 sysroot。检查一下 `gcc --version` 的输出是否正常？另外，你在 WSL 还是纯 Windows CMD 下运行这些命令？",
            },
            {
              level: 3,
              text: '修复步骤：① 确认 utils.c 存在于 Makefile 同级目录；② 如果是首次配置环境，运行 `sudo apt install build-essential`（Ubuntu）安装完整工具链；③ 在 Makefile 中验证 CC 变量是否正确指向了 g++ 或 gcc。完成后运行 `make clean && make` 重新构建。',
            },
          ],
        },
        {
          role: "student",
          content: "原来 utils.c 的文件名被我打成了 utis.c（少了一个 l）！环境变量也没配好，我装了 MinGW 但没加到 PATH。",
        },
        {
          role: "ai",
          content:
            "两个问题一次解决，效率很高！MinGW 的 PATH 配置是个经典坑点——很多人装了编译器但 shell 找不到可执行文件。建议你：① 在系统环境变量中将 MinGW 的 bin 目录（如 C:\\mingw64\\bin）加到 PATH 最前面；② 打开新的终端窗口验证 `gcc -v` 输出正确；③ 养成在项目目录里放 `.gitignore` 忽略 .o 文件的习惯，避免提交中间产物。这些都是工程实践中必备的习惯。",
        },
      ],
    },
  ],

  // ────────────── JavaScript ──────────────
  javascript: [
    {
      id: "js-closure",
      name: "闭包陷阱：循环中的 setTimeout",
      description: "JavaScript 事件循环和闭包的经典困惑",
      language: "JavaScript",
      defaultCode: 'console.log("Start");\n\nfor (var i = 1; i <= 3; i++) {\n    setTimeout(function () {\n        console.log(i);\n    }, i * 1000);\n}\n\nconsole.log("End");',
      defaultLog: "",
      conversation: [
        {
          role: "student",
          content: "我想让这个循环每隔一秒打印 1、2、3，但它每次都打印 3、3、3，为什么？",
        },
        {
          role: "ai",
          content:
            "这是一个经典的 JS 面试题，涉及到 JavaScript 的作用域机制。我们先来分析现象而不是急着给答案：",
          hints: [
            {
              level: 1,
              text: '注意你用的是 `var i` 而不是 `let i`。`var` 和 `let` 在作用域上有根本区别：var 是函数级作用域（所有循环共享同一个 i），let 是块级作用域（每次迭代创建独立的 i）。setTimeout 的回调函数是在 1s/2s/3s 后才执行的，那时 for 循环已经结束了。此时 i 的值是多少？',
            },
            {
              level: 2,
              text: "闭包的本质是什么？当一个内部函数引用了外层函数的变量时，它保存的是变量的当前值还是变量的引用？这就是所谓的 'closure over reference' 而非 'closure over value'。",
            },
            {
              level: 3,
              text: "解决方案有三种：① 把 var 换成 let（最简单）；② 用 IIFE 创建一个独立的作用域包裹每个回调；③ 用 setTimeout 的第三个参数传值 `setTimeout(fn, delay, i)`。试试方案①，看看输出变成了什么？",
            },
          ],
        },
        {
          role: "student",
          content: "我把 var 换成了 let，输出变成 1, 2, 3 了！原来每次迭代的 i 都是独立的变量。",
        },
        {
          role: "ai",
          content:
            "没错！这就是现代 JavaScript 推荐的写法。总结一下核心概念：`var` 只绑定到函数作用域，不管在哪个块里声明都共享同一个变量；而 `let`/`const` 绑定到块级作用域，每次 for/while 循环迭代都会创建新的绑定。这是 ES6 引入的最重要的语言特性之一，也是面试必考题。理解了这一点，你就理解了 JS 闭包的关键。",
        },
      ],
    },
  ],

  // ────────────── HTML/CSS ──────────────
  htmlcss: [
    {
      id: "css-flexbox",
      name: "Flexbox 垂直居中失败",
      description: "CSS Flexbox 布局中对齐和主轴方向的常见误解",
      language: "HTML/CSS",
      defaultCode: '.container {\n    display: flex;\n    width: 100%;\n    height: 400px;\n    background: #f0f0f0;\n}\n\n.item {\n    width: 100px;\n    height: 100px;\n    background: #3498db;\n}',
      defaultLog: '',
      conversation: [
        {
          role: "student",
          content: "我用 display: flex 了，但子元素始终靠左排列，没法上下左右居中，怎么办？",
        },
        {
          role: "ai",
          content:
            "Flexbox 居中是一个非常经典的需求。很多同学在这里卡住是因为搞混了主轴和交叉轴的方向。让我们一起理清楚：",
          hints: [
            {
              level: 1,
              text: "Flexbox 默认的主轴方向是什么？也就是说，如果不做任何额外设置，子元素默认是横向排列还是纵向排列？你希望它们居中的方向是哪几个？",
            },
            {
              level: 2,
              text: "水平居中用什么属性？垂直居中又需要什么额外的准备条件？注意 `justify-content: center` 控制的是主轴，`align-items: center` 控制的是交叉轴。要让垂直居中生效，父容器必须明确指定高度——检查一下 `.container` 的高度设置是否已经有了？",
            },
            {
              level: 3,
              text: '同时加上 `justify-content: center` 和 `align-items: center` 即可实现完美居中。但如果要应对所有场景（包括嵌套 flex 元素），还有一个终极方案：`margin: auto` 在 flex 子元素上会自动在所有方向上产生等距外边距从而实现居中。试试看哪种更适合你的场景。',
            },
          ],
        },
        {
          role: "student",
          content: "加上 justify-content 和 align-items 就成功了！原来默认主轴是水平的。",
        },
        {
          role: "ai",
          content:
            "正确！Flexbox 默认 `flex-direction: row`，所以子元素从左到右排列。记住这套记忆口诀：**horizontal → justify**，**vertical → align**。配合 flex 盒子的图示来理解主轴/交叉轴的概念，以后无论多么复杂的布局都能拆解开来逐步完成。",
        },
      ],
    },
  ],

  // ────────────── MySQL ──────────────
  mysql: [
    {
      id: "mysql-join-slow",
      name: "JOIN 查询性能优化",
      description: "MySQL 复杂 JOIN 查询的性能瓶颈分析与优化策略",
      language: "MySQL",
      defaultCode:
        "SELECT u.name, o.order_id, p.product_name, oi.quantity\nFROM users u\nJOIN orders o ON u.id = o.user_id\nJOIN order_items oi ON o.id = oi.order_id\nJOIN products p ON oi.product_id = p.id\nWHERE u.created_at > '2024-01-01'\nORDER BY o.created_at DESC;",
      defaultLog:
        "Query took 12.45 seconds (target: < 1s)\nSlow query log analysis:\n  Table scans detected on: orders, order_items\n  No covering index found for join keys",
      conversation: [
        {
          role: "student",
          content: "我的 SQL 查询跑得太慢了，JOIN 四张表后耗时超过 10 秒，怎么优化？",
        },
        {
          role: "ai",
          content:
            "多表 JOIN 慢是数据库优化中最常见的问题。我们先用诊断思维来分析，而不是盲目加索引：",
          hints: [
            {
              level: 1,
              text: "先运行 EXPLAIN 在你的 SELECT 语句前面（即 `EXPLAIN SELECT ...`），它会展示执行计划。关注四个指标：type 列（ALL 代表全表扫描）、key 列（NULL 表示没有用到索引）、rows 列（估算扫描行数）。哪些表的 type 是 ALL？",
            },
            {
              level: 2,
              text: "JOIN 的条件字段（user_id, order_id, product_id）是否都有索引？INNO DB 引擎中，外键本身不会自动创建索引，需要手动添加。覆盖索引（Covering Index）是什么？如果索引包含了查询所需的所有字段，就不需要回表查聚簇索引了。",
            },
            {
              level: 3,
              text: '优化方案：① 为 o.user_id、oi.order_id、oi.product_id 分别添加 INDEX；② WHERE 条件中的 u.created_at 也建索引；③ 如果只需要最近的数据，加 LIMIT 限制返回行数。建完索引后再次 EXPLAIN，验证 type 是否从 ALL 变成了 ref/range。',
            },
          ],
        },
        {
          role: "student",
          content: "加了索引后 EXPLAIN 显示 type 都变成了 ref，查询时间从 12 秒降到 0.3 秒！",
        },
        {
          role: "ai",
          content:
            "漂亮！这就是数据库优化的标准流程：**EXPLAIN → 分析执行计划 → 针对性加索引 → 验证效果**。记住一个黄金法则：在最常出现在 WHERE、JOIN ON、ORDER BY 中的字段上建立索引。但也别过度——每个索引都会增加 INSERT/UPDATE 的开销，找到平衡点才是关键。",
        },
      ],
    },
  ],

  // ────────────── PHP ──────────────
  php: [
    {
      id: "php-session-bug",
      name: "Session 管理与 Notice 错误排查",
      description: "PHP Session 未正确初始化导致的 Undefined 警告",
      language: "PHP",
      defaultCode: '<?php\n// page.php\n$user = $_SESSION["username"];\n$count = count($_SESSION["items"]);  // Notice: Undefined index\n$_SESSION["last_visit"] = date("Y-m-d H:i:s");\n?>',
      defaultLog: "PHP Warning:  Undefined index: items in /var/www/html/page.php on line 3\nPHP Notice: Undefined variable: SESSION",
      conversation: [
        {
          role: "student",
          content: "PHP 页面一直报 Warning 和 Notice，说 undefined index，但我不明白为什么。",
        },
        {
          role: "ai",
          content:
            "PHP 的 Warning/Notice 虽然不影响运行，但在生产环境中应该尽量避免。我们来排查根源：",
          hints: [
            {
              level: 1,
              text: '第 1 行直接使用了 `$_SESSION["username"]`，但在这一行之前有没有调用 `session_start()`？`$_SESSION` 是一个超全局数组，在 PHP 中即使开启了 session，首次访问某个 key 时如果不存在也会报 Undefined index。',
            },
            {
              level: 2,
              text: "了解 PHP 的错误级别差异：E_WARNING 是运行时警告，可能导致逻辑错误；E_NOTICE 是提示信息，表示可能有编程疏漏。`isset($_SESSION['key'])` 和 `array_key_exists('key', $_SESSION)` 有什么区别？哪种判断更安全？",
            },
            {
              level: 3,
              text: '修改方案：① 在文件顶部第一行加上 `session_start();`；② 使用 `$_SESSION["username"] ?? "Guest"` （null coalescing 运算符）提供默认值；③ 用 `count((array)$_SESSION["items"] ?? [])` 安全地计算数组长度。',
            },
          ],
        },
        {
          role: "student",
          content: "原来忘记写 session_start() 了！还用 ?? 运算符给默认值就很方便。",
        },
        {
          role: "ai",
          content:
            "总结：PHP 中有几个必须注意的惯例：① 凡是用到 Session/Cookie/SOAP 等全局状态，第一件事就是初始化（session_start / setcookie）；② 永远假设 $_GET/$_POST/$_SESSION 中的某个 key 可能不存在，用 ?? 三元运算符或 array_key_exists 做防护。这是防御性 PHP 编程的基本功。",
        },
      ],
    },
  ],
};

// Convenience accessor
export function getScenesByLanguage(lang: string): Scene[] {
  const map: Record<string, keyof typeof SCENES> = {
    python: "python",
    java: "java",
    cpp: "cpp",
    c: "cpp",
    javascript: "javascript",
    js: "javascript",
    htmlcss: "htmlcss",
    html: "htmlcss",
    css: "htmlcss",
    mysql: "mysql",
    php: "php",
  };
  const key = map[lang.toLowerCase()];
  return key ? SCENES[key] : [];
}
