/* ---------------- floating luxury glass bubbles (tap to pop) ---------------- */
(function(){
  const wrap = document.getElementById('bgBubbles');
  if(!wrap) return;
  const COUNT = 18;
  // Stagger horizontal drift per bubble for organic feel
  const drifts = [['12px','-14px','6px'],['‑8px','18px','-10px'],['16px','-6px','14px'],
                  ['-12px','10px','-8px'],['6px','-20px','12px'],['-16px','8px','-4px']];

  function spawnBubble(delay){
    const b = document.createElement('span');
    const size = 18 + Math.random()*60;
    const dur  = 12 + Math.random()*16;
    const d    = drifts[Math.floor(Math.random()*drifts.length)];
    b.style.cssText = [
      `width:${size}px`,`height:${size}px`,
      `left:${Math.random()*100}vw`,
      `animation-duration:${dur}s`,
      `animation-delay:${delay!=null ? delay : Math.random()*12}s`,
      `--dx1:${d[0]}`,`--dx2:${d[1]}`,`--dx3:${d[2]}`,
    ].join(';');
    wrap.appendChild(b);
    return b;
  }

  function burstAt(x,y,size){
    // Shockwave ring
    const ring = document.createElement('div');
    ring.className = 'bubble-burst';
    const rs = Math.max(28, size*0.85);
    Object.assign(ring.style,{left:x+'px',top:y+'px',width:rs+'px',height:rs+'px'});
    wrap.appendChild(ring);
    ring.addEventListener('animationend', ()=> ring.remove(), {once:true});

    // Sparkle shards — more of them, varied colours
    const colours = ['rgba(212,175,55,.95)','rgba(255,255,255,.9)','rgba(167,139,250,.85)','rgba(56,189,248,.8)'];
    const shardCount = 8 + Math.floor(Math.random()*5);
    for(let i=0;i<shardCount;i++){
      const s = document.createElement('div');
      s.className = 'bubble-sparkle';
      const angle = (Math.PI*2/shardCount)*i + Math.random()*0.4;
      const dist  = 20 + Math.random()*38;
      Object.assign(s.style,{
        left:x+'px', top:y+'px',
        background: colours[i % colours.length],
        width: (3+Math.random()*4)+'px',
        height: (3+Math.random()*4)+'px',
        animationDelay: (Math.random()*0.04)+'s',
      });
      s.style.setProperty('--fly',`${Math.cos(angle)*dist}px, ${Math.sin(angle)*dist}px`);
      wrap.appendChild(s);
      s.addEventListener('animationend', ()=> s.remove(), {once:true});
    }

    // Haptic-style micro bounce on the wrap (visual only)
    wrap.style.transition = 'transform .1s';
    wrap.style.transform = 'scale(1.003)';
    setTimeout(()=>{ wrap.style.transform = ''; }, 110);
  }

  function popBubble(bubble){
    if(bubble.dataset.popped) return;
    bubble.dataset.popped = '1';
    bubble.style.pointerEvents = 'none';
    const rect = bubble.getBoundingClientRect();
    const cx = rect.left + rect.width/2;
    const cy = rect.top + rect.height/2;
    burstAt(cx, cy, rect.width);
    bubble.classList.add('popping');
    // Replace after animation finishes
    setTimeout(()=>{
      if(bubble.isConnected) bubble.remove();
      spawnBubble(Math.random()*2);
    }, 340);
  }

  for(let i=0;i<COUNT;i++) spawnBubble();

  // Support both click and touch for instant feel
  wrap.addEventListener('pointerdown', function(e){
    const t = e.target;
    if(t && t.tagName==='SPAN' && t.parentElement===wrap){
      e.preventDefault();
      popBubble(t);
    }
  }, {passive:false});
})();

/* ---------------- gold scroll progress rail ---------------- */
(function(){
  const rail = document.createElement('div');
  rail.id = 'scrollProgressRail';
  document.body.appendChild(rail);
  let ticking = false;
  function update(){
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    rail.style.width = (max > 0 ? Math.min(100, (scrolled/max)*100) : 0) + '%';
    ticking = false;
  }
  document.addEventListener('scroll', function(){
    if(!ticking){ requestAnimationFrame(update); ticking = true; }
  }, {passive:true});
  update();
})();

/* ---------------- reveal-on-scroll (premium entrance motion) ---------------- */
var revealObserver = null;
function resetRevealIn(container){
  if(!container || !revealObserver) return;
  const targets = container.classList && container.classList.contains('reveal-up')
    ? [container, ...container.querySelectorAll('.reveal-up')]
    : [...container.querySelectorAll('.reveal-up')];
  targets.forEach(el=>{
    el.classList.remove('is-visible');
    revealObserver.unobserve(el);
    revealObserver.observe(el);
  });
}
(function(){
  const SELECTORS = ['.hero-inner', '.chapter-wrap', '.start-wrap .start-card', '.question-wrap .q-card', 'footer'];
  const STAGGER_SELECTORS = ['.chapter-wrap'];
  function tag(){
    SELECTORS.forEach(sel=>{
      document.querySelectorAll(sel).forEach(el=>el.classList.add('reveal-up'));
    });
    STAGGER_SELECTORS.forEach(sel=>{
      document.querySelectorAll(sel).forEach(el=>el.classList.add('stagger-in'));
    });
  }
  function init(){
    tag();
    revealObserver = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, {threshold:0.12, rootMargin:'0px 0px -6% 0px'});
    document.querySelectorAll('.reveal-up').forEach(el=>revealObserver.observe(el));
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* ---------------- DATA: real questions only, taken from the uploaded PDF ---------------- */
const CH1_FUNCTION = [
{q:"The small sections of code that are used to perform a particular task is called",options:["Subroutines","Files","Pseudo code","Modules"],correct:0,exp:"A subroutine is a self-contained block of code written to carry out one specific task."},
{q:"Which of the following is a unit of code that is often defined within a greater code structure?",options:["Subroutines","Function","Files","Modules"],correct:1,exp:"A function is a smaller unit of code nested inside a larger program."},
{q:"Which of the following is a distinct syntactic block?",options:["Subroutines","Function","Definition","Modules"],correct:2,exp:"A definition is a clearly separated syntactic block in code."},
{q:"The variables in a function definition are called as",options:["Subroutines","Function","Definition","Parameters"],correct:3,exp:"Variables listed in a function's definition are its parameters."},
{q:"The values which are passed to a function definition are called",options:["Arguments","Subroutines","Function","Definition"],correct:0,exp:"The actual values sent into a function call are its arguments."},
{q:"Which of the following are mandatory to write the type annotations in the function definition?",options:["{ }","( )","[ ]","< >"],correct:1,exp:"Parentheses are required around parameters/type annotations in a function definition."},
{q:"Which of the following defines what an object can do?",options:["Operating System","Compiler","Interface","Interpreter"],correct:2,exp:"The interface specifies the operations an object supports."},
{q:"Which of the following carries out the instructions defined in the interface?",options:["Operating System","Compiler","Implementation","Interpreter"],correct:2,exp:"The implementation is the code that actually performs what the interface promises."},
{q:"The functions which will give exact result when same arguments are passed are called",options:["Impure functions","Partial Functions","Dynamic Functions","Pure functions"],correct:3,exp:"Pure functions always return the same output for the same input with no side effects."},
{q:"The functions which cause side effects to the arguments passed are called",options:["Impure functions","Partial Functions","Dynamic Functions","Pure functions"],correct:0,exp:"Impure functions can modify their arguments or external state."}
];

const CH2_DATA_ABSTRACTION = [
{q:"Which of the following functions that build the abstract data type?",options:["Constructors","Destructors","recursive","Nested"],correct:0,exp:"Constructors build/create values of an abstract data type."},
{q:"Which of the following functions that retrieve information from the data type?",options:["Constructors","Selectors","recursive","Nested"],correct:1,exp:"Selectors extract information already stored in a data type."},
{q:"The data structure which is a mutable ordered sequence of elements is called",options:["Built in","List","Tuple","Derived data"],correct:1,exp:"A list is a mutable, ordered collection of elements in Python."},
{q:"A sequence of immutable objects is called",options:["Built in","List","Tuple","Derived data"],correct:2,exp:"A tuple is an ordered sequence whose elements cannot be changed once created."},
{q:"The data type whose representation is known are called",options:["Built in datatype","Derived datatype","Concrete datatype","Abstract datatype"],correct:2,exp:"A concrete datatype has a representation that is fully known and visible."},
{q:"The data type whose representation is unknown are called",options:["Built in datatype","Derived datatype","Concrete datatype","Abstract datatype"],correct:3,exp:"An abstract datatype hides its internal representation from the user."},
{q:"Which of the following is a compound structure?",options:["Pair","Triplet","single","quadrat"],correct:0,exp:"A pair bundles two values together, making it a compound structure."},
{q:"Bundling two values together into one can be considered as",options:["Pair","Triplet","single","quadrat"],correct:0,exp:"Combining two values into one unit is exactly what a pair does."},
{q:"Which of the following allow to name the various parts of a multi-item object?",options:["Tuples","Lists","Classes","quadrats"],correct:2,exp:"Classes let you name and access the different attributes of an object."},
{q:"Which of the following is constructed by placing expressions within square brackets?",options:["Tuples","Lists","Classes","quadrats"],correct:1,exp:"Lists in Python are written using square brackets, e.g. [1,2,3]."}
];

const CH3_SCOPING = [
{q:"Which of the following refers to the visibility of variables in one part of a program to another part of the same program?",options:["Scope", "Memory", "Address", "Accessibility"],correct:0,exp:"Scope determines where in a program a variable name is visible/usable."},
{q:"The process of binding a variable name with an object is called",options:["Scope", "Mapping", "late binding", "early binding"],correct:1,exp:"Mapping links a variable name to the object it refers to."},
{q:"Which of the following is used in programming languages to map the variable and object?",options:["::", ":=", "=", "=="],correct:2,exp:"The assignment operator '=' binds a variable name to an object."},
{q:"Containers for mapping names of variables to objects is called",options:["Scope", "Mapping", "Binding", "Namespaces"],correct:3,exp:"A namespace is a container holding the mapping of names to objects."},
{q:"Which scope refers to variables defined in current function?",options:["Local Scope", "Global scope", "Module scope", "Function Scope"],correct:0,exp:"Variables defined inside the current function belong to its local scope."},
{q:"The process of subdividing a computer program into separate sub-programs is called",options:["Procedural Programming", "Modular programming", "Event Driven Programming", "Object oriented Programming"],correct:1,exp:"Modular programming breaks a program into smaller, independent modules."},
{q:"Which of the following security technique regulates who can use resources in a computing environment?",options:["Password", "Authentication", "Access control", "Certification"],correct:2,exp:"Access control decides who is permitted to use which resources."},
{q:"Which of the following members of a class can be handled only from within the class?",options:["Public members", "Protected members", "Secured members", "Private members"],correct:3,exp:"Private members are accessible only inside the class that defines them."},
{q:"Which members are accessible from outside the class?",options:["Public members", "Protected members", "Secured members", "Private members"],correct:0,exp:"Public members can be accessed from anywhere, including outside the class."},
{q:"The members that are accessible from within the class and are also available to its subclasses is called",options:["Public members", "Protected members", "Secured members", "Private members"],correct:1,exp:"Protected members are visible within the class and its subclasses."}
];

const CH4_ALGORITHMIC_STRATEGIES = [
{q:"The word that comes from the name of Persian mathematician Abu Ja'far Mohammed ibn-i Musa al-Khowarizmi is called?",options:["Flowchart", "Flow", "Algorithm", "Syntax"],correct:2,exp:"The term 'algorithm' is derived from al-Khwarizmi's name."},
{q:"From the following sorting algorithms, which algorithm needs the minimum number of swaps?",options:["Bubble sort", "Quick sort", "Merge sort", "Selection sort"],correct:3,exp:"Selection sort performs at most n-1 swaps, fewer than bubble sort typically."},
{q:"Two main measures for the efficiency of an algorithm are",options:["Processor and memory", "Complexity and capacity", "Time and space", "Data and space"],correct:2,exp:"Efficiency is judged mainly by time complexity and space complexity."},
{q:"The algorithm that yields expected output for a valid input is called as",options:["Algorithmic solution", "Algorithmic outcomes", "Algorithmic problem", "Algorithmic coding"],correct:0,exp:"An algorithmic solution produces the correct expected output for valid input."},
{q:"Which of the following is used to describe the worst case of an algorithm?",options:["Big A", "Big S", "Big W", "Big O"],correct:3,exp:"Big O notation describes the worst-case running time."},
{q:"Big \u03a9 is the reverse of",options:["Big O", "Big \u03b8", "Big A", "Big S"],correct:0,exp:"Big Omega represents the best case, the reverse notion of Big O's worst case."},
{q:"Binary search is also called as",options:["Linear search", "Sequential search", "Random search", "Half-interval search"],correct:3,exp:"Binary search repeatedly halves the search interval, hence 'half-interval search'."},
{q:"The \u0398 notation in asymptotic evaluation represents",options:["Base case", "Average case", "Worst case", "NULL case"],correct:1,exp:"Theta notation gives a tight bound representing the average case."},
{q:"If a problem can be broken into subproblems which are reused several times, the problem possesses which property?",options:["Overlapping subproblems", "Optimal substructure", "Memoization", "Greedy"],correct:0,exp:"Reused subproblems are a hallmark of the overlapping subproblems property."},
{q:"In dynamic programming, the technique of storing the previously calculated values is called?",options:["Saving value property", "Storing value property", "Memoization", "Mapping"],correct:2,exp:"Memoization stores previously computed results to avoid recomputation."}
];

const CH5_PYTHON_VAR_OPS = [
{q:"Who developed Python?",options:["Ritche", "Guido Van Rossum", "Bill Gates", "Sunder Pitchai"],correct:1,exp:"Python was created by Guido van Rossum."},
{q:"The Python prompt that indicates the interpreter is ready to accept instructions is",options:[">>>", "<<<", "#", "<<"],correct:0,exp:"The standard Python interactive prompt is >>>."},
{q:"Which of the following shortcut is used to create a new Python program?",options:["Ctrl + C", "Ctrl + F", "Ctrl + B", "Ctrl + N"],correct:3,exp:"Ctrl+N opens a new file in IDLE."},
{q:"Which of the following character is used to give comments in a Python program?",options:["#", "&", "@", "$"],correct:0,exp:"The hash symbol '#' begins a single-line comment in Python."},
{q:"This symbol is used to print more than one item on a single line.",options:["Semicolon (;)", "Dollar ($)", "comma (,)", "Colon (:)"],correct:2,exp:"A comma separates multiple items passed to print()."},
{q:"Which of the following is not a token?",options:["Interpreter", "Identifiers", "Keyword", "Operators"],correct:0,exp:"Interpreter is a program, not a lexical token of the language."},
{q:"Which of the following is not a keyword in Python?",options:["break", "while", "continue", "operators"],correct:3,exp:"'operators' is not a reserved keyword in Python."},
{q:"Which operator is also called a Comparative operator?",options:["Arithmetic", "Relational", "Logical", "Assignment"],correct:1,exp:"Relational operators compare two values, hence 'comparative operators'."},
{q:"Which of the following is not a logical operator?",options:["and", "or", "not", "Assignment"],correct:3,exp:"Assignment (=) is not a logical operator; and/or/not are."},
{q:"Which operator is also called a Conditional operator?",options:["Ternary", "Relational", "Logical", "Assignment"],correct:0,exp:"The ternary operator (x if cond else y) is Python's conditional operator."}
];

const CH6_CONTROL_STRUCTURES = [
{q:"How many important control structures are there in Python?",options:["3", "4", "5", "6"],correct:0,exp:"Python has three main control structures: sequence, selection, and repetition."},
{q:"elif can be considered to be an abbreviation of",options:["nested if", "if..else", "else if", "if..elif"],correct:2,exp:"'elif' is short for 'else if'."},
{q:"What plays a vital role in Python programming?",options:["Statements", "Control", "Structure", "Indentation"],correct:3,exp:"Indentation defines code blocks in Python instead of braces."},
{q:"Which statement is generally used as a placeholder?",options:["continue", "break", "pass", "goto"],correct:2,exp:"'pass' does nothing and is used where a statement is syntactically required."},
{q:"The condition in the if statement should be in the form of",options:["Arithmetic or Relational expression", "Arithmetic or Logical expression", "Relational or Logical expression", "Arithmetic"],correct:2,exp:"An if-condition must evaluate to True/False using relational or logical expressions."},
{q:"Which is the most comfortable loop in Python?",options:["do..while", "while", "for", "if..elif"],correct:2,exp:"The 'for' loop is considered the most convenient looping construct in Python."},
{q:"What is the output of: i=1; while True: if i%3==0: break; print(i,end=''); i+=1",options:["12", "123", "1234", "124"],correct:0,exp:"i prints 1 and 2, then when i becomes 3, the loop breaks before printing it."},
{q:"What is the output of: T=1; while T: print(True) ; break",options:["False", "True", "0", "1"],correct:1,exp:"Since T=1 is truthy, the loop runs once and prints True before breaking."},
{q:"Which of these is not a jump statement?",options:["for", "pass", "continue", "break"],correct:0,exp:"'for' is a looping construct, not a jump statement."},
{q:"Which punctuation should be used after the if condition (before else)?",options:[";", ":", "::", "!"],correct:1,exp:"A colon ':' follows the condition to begin the indented block."}
];

const CH7_PYTHON_FUNCTIONS = [
{q:"A named block of code designed to do one specific job is called as",options:["Loop", "Branching", "Function", "Block"],correct:2,exp:"A function is a named, reusable block written for one specific task."},
{q:"A function which calls itself is called as",options:["Built-in", "Recursion", "Lambda", "return"],correct:1,exp:"A recursive function is one that calls itself."},
{q:"Which function is called an anonymous un-named function?",options:["Lambda", "Recursion", "Function", "define"],correct:0,exp:"A lambda function has no name and is defined inline."},
{q:"Which of the following keyword is used to begin the function block?",options:["define", "for", "finally", "def"],correct:3,exp:"The 'def' keyword starts a function definition in Python."},
{q:"Which of the following keyword is used to exit a function block?",options:["define", "return", "finally", "def"],correct:1,exp:"'return' exits a function and optionally sends back a value."},
{q:"While defining a function which symbol is used?",options:["; (semicolon)", ". (dot)", ": (colon)", "$ (dollar)"],correct:2,exp:"A colon follows the function header before the indented body."},
{q:"In which arguments is the correct positional order passed to a function?",options:["Required", "Keyword", "Default", "Variable-length"],correct:0,exp:"Required (positional) arguments must be passed in the exact order defined."},
{q:"Choose the correct statement(s): (I) In Python you don't mention specific data types while defining a function. (II) Python keywords can be used as function names.",options:["I is correct and II is wrong", "Both are correct", "I is wrong and II is correct", "Both are wrong"],correct:0,exp:"Python is dynamically typed (I is true); keywords cannot be used as function names (II is false)."},
{q:"Which condition correctly checks a leap year in: if _ : print(x, \"is a leap year\")",options:["x%2=0", "x%4==0", "x/4=0", "x%4=0"],correct:1,exp:"A valid boolean condition needs the equality operator '==', as in x%4==0."},
{q:"Which keyword is used to define the function testpython(): ?",options:["define", "pass", "def", "while"],correct:2,exp:"Functions are defined using the 'def' keyword."}
];

const CH8_STRINGS = [
{q:"str1=\"TamilNadu\"; print(str1[::-1]) outputs",options:["Tamilnadu", "Tmlau", "udanlimaT", "udaNlimaT"],correct:3,exp:"Slicing with step -1 reverses the string exactly, preserving the capital N: 'udaNlimaT'."},
{q:"str1 = \"Chennai Schools\"; str1[7] = \"-\" results in",options:["Chennai-Schools", "Chenna-School", "Type error", "Chennai"],correct:2,exp:"Strings are immutable in Python, so item assignment raises a TypeError."},
{q:"Which operator is used for concatenation of strings?",options:["+", "&", "*", "="],correct:0,exp:"The '+' operator joins (concatenates) two strings."},
{q:"Defining strings within triple quotes allows creating:",options:["Single line Strings", "Multiline Strings", "Double line Strings", "Multiple Strings"],correct:1,exp:"Triple quotes let a string span multiple lines."},
{q:"Strings in Python are:",options:["Changeable", "Mutable", "Immutable", "flexible"],correct:2,exp:"Once created, a Python string's characters cannot be changed \u2014 it is immutable."},
{q:"Which of the following is the slicing operator?",options:["{ }", "[ ]", "< >", "( )"],correct:1,exp:"Square brackets are used to slice sequences like strings and lists."},
{q:"What is stride?",options:["index value of slide operation", "first argument of slice operation", "second argument of slice operation", "third argument of slice operation"],correct:3,exp:"Stride is the step size, the third argument in a slice like s[start:stop:step]."},
{q:"Which formatting character prints exponential notation in upper case?",options:["%e", "%E", "%g", "%n"],correct:1,exp:"%E formats a number in exponential notation with an uppercase 'E'."},
{q:"Which of the following is used as placeholders/replacement fields with the format() function?",options:["{ }", "< >", "++", "^^"],correct:0,exp:"Curly braces {} act as placeholders replaced by format()."},
{q:"The subscript (index) of a string may be:",options:["Positive", "Negative", "Both (A) and (B)", "Either (A) or (B)"],correct:3,exp:"A string index can be either positive (from start) or negative (from end)."}
];

const CH9_LISTS_TUPLES_SETS_DICT = [
{q:"Pick the odd one out among collection data types:",options:["List", "Tuple", "Dictionary", "Loop"],correct:3,exp:"A loop is a control structure, not a collection data type."},
{q:"list1=[2,4,6,8,10]; print(list1[-2]) results in",options:["10", "8", "4", "6"],correct:1,exp:"Negative index -2 counts from the end, giving the second-last element, 8."},
{q:"Which function is used to count the number of elements in a list?",options:["count()", "find()", "len()", "index()"],correct:2,exp:"len() returns the number of elements in a list."},
{q:"If List=[10,20,30,40,50] then List[2]=35 will result in",options:["[35,10,20,30,40,50]", "[10,20,30,40,50,35]", "[10,20,35,40,50]", "[10,35,30,40,50]"],correct:2,exp:"Index 2 (the third element, 30) is replaced by 35, giving [10,20,35,40,50]."},
{q:"If List=[17,23,41,10] then List.append(32) will result in",options:["[32,17,23,41,10]", "[17,23,41,10,32]", "[10,17,23,32,41]", "[41,32,23,17,10]"],correct:1,exp:"append() adds the new element 32 at the end of the list."},
{q:"Which Python function can add more than one element to an existing list?",options:["append()", "append_more()", "extend()", "more()"],correct:2,exp:"extend() adds all elements of another iterable to the list."},
{q:"What is the result of: S=[x**2 for x in range(5)]; print(S)",options:["[0,1,2,4,5]", "[0,1,4,9,16]", "[0,1,4,9,16,25]", "[1,4,9,16,25]"],correct:1,exp:"Squares of 0-4 give [0,1,4,9,16]."},
{q:"What is the use of the type() function in Python?",options:["To create a Tuple", "To know the type of an element in a tuple", "To know the data type of a Python object", "To create a list"],correct:2,exp:"type() reveals the data type of any given Python object."},
{q:"Which statement is NOT correct?",options:["A list is mutable", "A tuple is immutable", "The append() function is used to add an element", "The extend() function is used in a tuple to add elements in a list"],correct:3,exp:"extend() works on mutable sequences like lists, not on immutable tuples."},
{q:"setA={3,6,9}, setB={1,3,9}. What is the result of print(setA|setB)?",options:["{3,6,9,1,3,9}", "{3,9}", "{1}", "{1,3,6,9}"],correct:3,exp:"The '|' operator gives the union of the two sets, all unique elements combined."},
{q:"Which set operation includes elements in either set but not those common to both?",options:["Symmetric difference", "Difference", "Intersection", "Union"],correct:0,exp:"Symmetric difference returns elements exclusive to each set, excluding common ones."},
{q:"The keys in a Python dictionary are specified by",options:["=", ";", "+", ":"],correct:3,exp:"A colon ':' separates each key from its value in a dictionary."}
];

const CH10_PYTHON_CLASSES = [
{q:"Which of the following are the key features of an Object Oriented Programming language?",options:["Constructor and Classes", "Constructor and Object", "Classes and Objects", "Constructor and Destructor"],correct:2,exp:"Classes and Objects are the core building blocks of OOP."},
{q:"Functions defined inside a class are called:",options:["Functions", "Module", "Methods", "section"],correct:2,exp:"Functions defined within a class are referred to as methods."},
{q:"Class members are accessed through which operator?",options:["&", ".", "#", "%"],correct:1,exp:"The dot '.' operator accesses attributes and methods of a class instance."},
{q:"Which method is automatically executed when an object is created?",options:["__object__()", "__del__()", "__func__()", "__init__()"],correct:3,exp:"__init__() runs automatically as the constructor when an object is created."},
{q:"A private class variable is prefixed with",options:["__ (double underscore)", "&&", "##", "**"],correct:0,exp:"A double underscore prefix marks a class variable as private."},
{q:"Which method is used as a destructor?",options:["__init__()", "__dest__()", "__rem__()", "__del__()"],correct:3,exp:"__del__() is the destructor method, called when an object is deleted."},
{q:"Which class declaration is correct?",options:["class class_name", "class class_name<>", "class class_name:", "class class_name[ ]"],correct:2,exp:"A class header ends with a colon: 'class class_name:'."},
{q:"What is the output of this Student class program that assigns self.name = name and prints self.name for S=Student(\"Tamil\")?",options:["Error", "Tamil", "name", "self"],correct:1,exp:"The constructor stores the passed value, so printing self.name shows 'Tamil'."},
{q:"Which of the following is the private class variable?",options:["__num", "##num", "$$num", "&&num"],correct:0,exp:"__num, using the double-underscore prefix, denotes a private variable."},
{q:"The process of creating an object is called as:",options:["Constructor", "Destructor", "Initialize", "Instantiation"],correct:3,exp:"Creating an object from a class is called instantiation."}
];

const CH11_DATABASE_CONCEPTS = [
{q:"What is the acronym of DBMS?",options:["DataBase Management Symbol", "Database Managing System", "DataBase Management System", "DataBasic Management System"],correct:2,exp:"DBMS stands for DataBase Management System."},
{q:"A table is known as",options:["tuple", "attribute", "relation", "entity"],correct:2,exp:"In relational database terminology, a table is called a relation."},
{q:"Which database model represents a parent-child relationship?",options:["Relational", "Network", "Hierarchical", "Object"],correct:2,exp:"The hierarchical model organizes data in a tree-like parent-child structure."},
{q:"The relational database model was first proposed by",options:["E F Codd", "E E Codd", "E F Cadd", "E F Codder"],correct:0,exp:"E. F. Codd introduced the relational database model."},
{q:"What type of relationship does the hierarchical model represent?",options:["one-to-one", "one-to-many", "many-to-one", "many-to-many"],correct:1,exp:"Hierarchical models represent one-to-many parent-child links."},
{q:"Who is called the Father of Relational Database?",options:["Chris Date", "Hugh Darween", "Edgar Frank Codd", "Edgar Frank Cadd"],correct:2,exp:"Edgar Frank Codd is credited as the father of the relational database."},
{q:"Which of the following is an RDBMS?",options:["Dbase", "Foxpro", "Microsoft Access", "SQLite"],correct:3,exp:"SQLite is a relational database management system."},
{q:"What symbol is used for the SELECT statement in relational algebra?",options:["\u03c3", "\u03a0", "X", "\u03a9"],correct:0,exp:"The sigma (\u03c3) symbol represents the SELECT (selection) operation."},
{q:"A tuple is also known as",options:["table", "row", "attribute", "field"],correct:1,exp:"A tuple in a relation corresponds to a single row of data."},
{q:"Who developed the ER model?",options:["Chen", "EF Codd", "Chend", "Chand"],correct:0,exp:"Peter Chen developed the Entity-Relationship (ER) model."}
];

const CH12_SQL = [
{q:"Which commands provide definitions for creating table structure, deleting relations, and modifying relation schemas?",options:["DDL", "DML", "DCL", "DQL"],correct:0,exp:"Data Definition Language (DDL) defines and modifies database structures."},
{q:"Which command lets you change the structure of a table?",options:["SELECT", "ORDER BY", "MODIFY", "ALTER"],correct:3,exp:"ALTER TABLE modifies the structure of an existing table."},
{q:"The command to delete a table is",options:["DROP", "DELETE", "DELETE ALL", "ALTER TABLE"],correct:0,exp:"DROP TABLE removes the entire table and its structure."},
{q:"Queries can be generated using",options:["SELECT", "ORDER BY", "MODIFY", "ALTER"],correct:0,exp:"SELECT is used to write queries that retrieve data."},
{q:"The clause used to sort data in a database is",options:["SORT BY", "ORDER BY", "GROUP BY", "SELECT"],correct:1,exp:"ORDER BY sorts the result set of a query."}
];

const CH13_PYTHON_CSV = [
{q:"A CSV file is also known as a \u2026.",options:["Flat File", "3D File", "String File", "Random File"],correct:0,exp:"A CSV file is a plain, flat text file of comma-separated values."},
{q:"The expansion of CRLF is",options:["Control Return and Line Feed", "Carriage Return and Form Feed", "Control Router and Line Feed", "Carriage Return and Line Feed"],correct:3,exp:"CRLF stands for Carriage Return and Line Feed."},
{q:"Which module is provided by Python to perform operations on CSV files?",options:["py", "xls", "csv", "os"],correct:2,exp:"Python's built-in 'csv' module handles reading/writing CSV files."},
{q:"Which mode is used when dealing with non-text files like image or exe files?",options:["Text mode", "Binary mode", "xls mode", "csv mode 5"],correct:1,exp:"Binary mode is used for non-text files such as images or executables."},
{q:"The command used to skip a row in a CSV file is",options:["next()", "skip()", "omit()", "bounce()"],correct:0,exp:"next() advances the reader past a row, effectively skipping it, e.g. the header."},
{q:"Which string terminates lines produced by the writer() method of the csv module?",options:["Line Terminator", "Enter key", "Form feed", "Data Terminator"],correct:0,exp:"The 'lineterminator' string ends each line written by csv.writer()."},
{q:"Given city.csv has 'chennai,mylapore' and 'mumbai,andheri', reading with next(d) then looping and printing rows outputs",options:["chennai,mylapore", "mumbai,andheri", "chennai\nmumbai", "chennai,mylapore\nmumbai,andheri"],correct:1,exp:"next(d) skips the first row, so only the second row 'mumbai,andheri' is printed."},
{q:"Which of the following creates an object which maps data to a dictionary?",options:["listreader()", "reader()", "tuplereader()", "DictReader()"],correct:3,exp:"csv.DictReader() maps each row of a CSV file to a dictionary."},
{q:"Making changes to the data of an existing file or adding more data is called",options:["Editing", "Appending", "Modification", "Alteration"],correct:2,exp:"Changing or adding data to an existing file is termed modification."},
{q:"Given D = [['Exam'],['Quarterly'],['Halfyearly']] written with lineterminator='\\n', the file test.csv will contain",options:["Exam Quarterly Halfyearly (one line)", "Exam Quarterly Halfyearly (spaced)", "E, Q, H on separate lines", "Exam,\\nQuarterly,\\nHalfyearly (each on its own line)"],correct:3,exp:"Each single-item row is written on its own line, so the file has 'Exam,', 'Quarterly,', 'Halfyearly,' on separate lines."}
];

const CH14_IMPORTING_CPP = [
{q:"Which of the following is not a scripting language?",options:["JavaScript", "PHP", "Perl", "HTML"],correct:3,exp:"HTML is a markup language, not a scripting language."},
{q:"Importing a C++ program into a Python program is called",options:["wrapping", "Downloading", "Interconnecting", "Parsing"],correct:0,exp:"This process of interfacing C++ code into Python is called wrapping."},
{q:"The expansion of API is",options:["Application Programming Interpreter", "Application Programming Interface", "Application Performing Interface", "Application Programming Interlink"],correct:1,exp:"API stands for Application Programming Interface."},
{q:"A framework for interfacing Python and C++ is",options:["Ctypes", "SWIG", "Cython", "Boost"],correct:3,exp:"Boost (Boost.Python) is a framework used to interface Python with C++."},
{q:"Which of the following is a software design technique to split code into separate parts?",options:["Object oriented Programming", "Modular programming", "Low Level Programming", "Procedure oriented Programming"],correct:1,exp:"Modular programming splits code into separate, manageable parts."},
{q:"The module which allows interfacing with the Windows operating system is",options:["OS module", "sys module", "csv module", "getopt module"],correct:0,exp:"The 'os' module provides functions to interact with the operating system."},
{q:"getopt() will return an empty array if there is no error in splitting strings to",options:["argv variable", "opt variable", "args variable", "ifile variable"],correct:2,exp:"When there is no leftover, the args variable returned is empty."},
{q:"In: if __name__=='__main__': main(sys.argv[1:]) \u2014 identify the function call statement.",options:["main(sys.argv[1:])", "__name__", "__main__", "argv"],correct:0,exp:"main(sys.argv[1:]) is the actual statement that calls the function."},
{q:"Which of the following can be used for processing text, numbers, images, and scientific data?",options:["HTML", "C", "C++", "PYTHON"],correct:3,exp:"Python is widely used for text, numeric, image, and scientific data processing."},
{q:"What does __name__ contain?",options:["c++ filename", "main() name", "python filename", "os module name"],correct:2,exp:"__name__ holds the name of the current Python module/file."}
];

const CH15_DATA_MANIPULATION_SQL = [
{q:"Which of the following is an organized collection of data?",options:["Database", "DBMS", "Information", "Records"],correct:0,exp:"A database is an organized collection of related data."},
{q:"SQLite falls under which database system?",options:["Flat file database system", "Relational Database system", "Hierarchical database system", "Object oriented Database system"],correct:1,exp:"SQLite is a lightweight relational database system."},
{q:"Which of the following is a control structure used to traverse and fetch records of the database?",options:["Pointer", "Key", "Cursor", "Insertion point"],correct:2,exp:"A cursor is used to traverse and fetch rows from a query result."},
{q:"Changes made in the values of a record should be saved by the command",options:["Save", "Save As", "Commit", "Oblige"],correct:2,exp:"COMMIT permanently saves changes made to the database."},
{q:"Which of the following executes an SQL command to perform an action?",options:["execute()", "key()", "cursor()", "run()"],correct:0,exp:"execute() runs the given SQL command."},
{q:"Which function retrieves the average of a selected column of rows in a table?",options:["Add()", "SUM()", "AVG()", "AVERAGE()"],correct:2,exp:"AVG() computes the average value of a numeric column."},
{q:"The function that returns the largest value of a selected column is",options:["MAX()", "LARGE()", "HIGH()", "MAXIMUM()"],correct:0,exp:"MAX() returns the largest value in a selected column."},
{q:"Which of the following is called the master table?",options:["sqlite_master", "sql_master", "main_master", "master_main"],correct:0,exp:"sqlite_master is SQLite's built-in master/catalog table."},
{q:"The most commonly used statement in SQL is",options:["cursor", "select", "execute", "commit"],correct:1,exp:"SELECT is the most frequently used SQL statement for retrieving data."},
{q:"Which of the following clause avoids duplicates?",options:["Distinct", "Remove", "Where", "GroupBy"],correct:0,exp:"DISTINCT filters out duplicate rows from the query result."}
];

const CH16_DATA_VISUALIZATION = [
{q:"Which is a Python package used for 2D graphics?",options:["matplotlib.pyplot", "matplotlib.pip", "matplotlib.numpy", "matplotlib.plt"],correct:0,exp:"matplotlib.pyplot is the module used to create 2D plots/graphics."},
{q:"Identify the package manager for Python packages/modules.",options:["Matplotlib", "PIP", "plt.show()", "python package"],correct:1,exp:"PIP is the standard package manager for installing Python packages."},
{q:"'pip --version' at the command prompt is used to",options:["Check if PIP is Installed", "Install PIP", "Download a Package", "Check PIP version"],correct:3,exp:"pip --version displays the currently installed PIP version."},
{q:"'pip list' at the command prompt is used to",options:["List installed packages", "list command", "Install PIP", "packages installed"],correct:0,exp:"pip list shows all packages currently installed."},
{q:"In 'python -m pip install -U pip', what does '-U' represent?",options:["downloading pip to the latest version", "upgrading pip to the latest version", "removing pip", "upgrading matplotlib to the latest version"],correct:1,exp:"-U (upgrade) updates pip itself to its latest version."},
{q:"Which code plots points (1,4),(2,5),(3,1) as a line chart?",options:["plt.plot([1,2,3],[4,5,1]); plt.show()", "plt.plot([1,2],[4,5]); plt.show()", "plt.plot([2,3],[5,1]); plt.show()", "plt.plot([1,3],[4,1]); plt.show()"],correct:0,exp:"The x-list [1,2,3] paired with y-list [4,5,1] plots exactly the three points shown."},
{q:"Which key is used to run the module in IDLE?",options:["F6", "F4", "F3", "F5"],correct:3,exp:"F5 runs the currently open module in Python IDLE."},
{q:"Identify the right type of chart: it visualizes a trend over time intervals, drawn chronologically.",options:["Line chart", "Bar chart", "Pie chart", "Scatter plot"],correct:0,exp:"A line chart is the standard way to show trends over time."},
{q:"Statement A: plt.pie() creates a pie chart with Matplotlib. Statement B: 'autopct' displays percentage values using Python string formatting. Which is correct?",options:["Statement A is correct", "Statement B is correct", "Both the statements are correct", "Both the statements are wrong"],correct:2,exp:"Both statements are accurate descriptions of Matplotlib's pie chart function."}
];

const CH1_FUNCTION_ADD = [
{q:"The syntax to define a function begins with",options:["fun", "func", "let", "rec"],correct:2,exp:"This chapter's generic function notation uses 'let' to begin a function definition."},
{q:"Which of the following key indicates that the function is a recursive function?",options:["rec", "recursive", "recur", "recu"],correct:0,exp:"'rec' is the keyword used to mark a recursive function definition."},
{q:"All functions are ______ definitions.",options:["static", "data type", "dynamic", "return"],correct:0,exp:"Functions are treated as static definitions in this notation."},
{q:"A function definition which calls itself is called",options:["main function", "self-function", "function definition", "recursive function"],correct:3,exp:"A function that calls itself is a recursive function."},
{q:"Which of the following do not have any side effects?",options:["User defined functions", "Pure functions", "Impure functions", "Assigned functions"],correct:1,exp:"Pure functions never cause side effects \u2014 same input always gives the same output."},
{q:"Which of the following function is an impure function?",options:["strlen()", "sin()", "random()", "gcd()"],correct:2,exp:"random() gives a different result each call, so it's impure."},
{q:"An instance created for the class is",options:["Function", "Variables", "Objects", "Constructors"],correct:2,exp:"An instantiated class is called an object."}
];

const CH2_DATA_ABSTRACTION_ADD = [
{q:"_______ provides modularity.",options:["Abstraction", "Constructor", "Recursion", "Structures"],correct:0,exp:"Abstraction lets you hide details and build programs in independent modules."},
{q:"Splitting a program into many modules is called",options:["Control Flow", "Looping", "Abstraction", "Modularity"],correct:3,exp:"Breaking a program into modules is called modularity."},
{q:"Which of the following are the representations for \u201cAbstract Data Types\u201d?",options:["Object", "Classes", "Functions", "Inheritance"],correct:1,exp:"Classes are used to represent abstract data types."},
{q:"Which of the following is a compound structure?",options:["Pairs", "Triplet", "Single", "Quadrat"],correct:0,exp:"A pair is the basic compound structure combining two values."},
{q:"How many ways are used to access the list element?",options:["3", "2", "5", "4"],correct:1,exp:"List elements can be accessed in 2 ways."},
{q:"The expansion of ADT is",options:["Built-in datatype", "Derived datatype", "Concrete datatype", "Abstract Data Type"],correct:3,exp:"ADT stands for Abstract Data Type."},
{q:"The expansion of CDT is",options:["Built-in datatype", "Derived datatype", "Concrete Data Type", "Abstract Data Type"],correct:2,exp:"CDT stands for Concrete Data Type."},
{q:"To facilitate data abstraction, you will need to create ______ types of functions.",options:["3", "2", "5", "4"],correct:1,exp:"Data abstraction needs 2 types of functions: constructors and selectors."},
{q:"Which of the following creates List expressions?",options:["( )", "[ ]", "< >", "{ }"],correct:1,exp:"Square brackets [ ] create list expressions in Python."},
{q:"Which of the following constructs Tuples expressions?",options:["( )", "[ ]", "< >", "{ }"],correct:0,exp:"Parentheses ( ) construct tuple expressions."},
{q:"We are using here a powerful strategy for designing programs:",options:["Abstraction", "Wishful thinking", "Constructors", "Pairs"],correct:1,exp:"Wishful thinking is a design strategy where you assume helper functions exist before writing them."},
{q:"List is constructed by placing expressions within square brackets separated by",options:["Period(.)", "Colon(:)", "Semicolon(;)", "Comma(,)"],correct:3,exp:"List elements are separated using commas."},
{q:"Identify the correct list usage from the following: i. LIST[10,20] ii. LIST(10,20) iii. LIST[(0,10),(1,20)] iv. LIST{10,20}",options:["i Only", "i, ii Only", "i, iii Only", "i, ii, iii, iv"],correct:2,exp:"Only list syntax using square brackets (i and iii) is valid."},
{q:"Which of the following is used to represent multi-part objects where each part is named?",options:["Class", "Function", "Structure", "Object"],correct:0,exp:"Classes let you name and access the different parts of a multi-item object."}
];

const CH3_SCOPING_ADD = [
{q:"The duration for which a variable is alive is called its",options:["Scope time", "end time", "life time", "variable time"],correct:2,exp:"The period a variable remains alive is its lifetime."},
{q:"Scope refers to the visibility of",options:["variables", "parameters", "functions", "all of these"],correct:3,exp:"Scope applies to variables, parameters, and functions alike."},
{q:"Which are composed of one or more independently developed modules?",options:["Access control", "Encapsulation", "Programs", "Data types"],correct:2,exp:"Programs are composed of independently developed modules."},
{q:"It is a fundamental concept in security that minimizes risk to the object.",options:["Access control", "Encapsulation", "Inheritance", "Data types"],correct:0,exp:"Access control is the security concept that minimizes risk to objects/resources."},
{q:"In terms of hierarchy, the scope with highest priority is",options:["Local", "Enclosed", "Global", "Built-in"],correct:3,exp:"Built-in scope sits at the top of the lookup hierarchy in this notation."},
{q:"In terms of hierarchy, the scope with lowest priority is",options:["Local", "Enclosed", "Global", "Built-in"],correct:0,exp:"Local scope has the lowest (first-checked) priority."},
{q:"Always, a function will first look up for a variable name in its",options:["local scope", "Enclosed scope", "Global scope", "Built-in scope"],correct:0,exp:"Python's LEGB rule checks local scope first."},
{q:"Which contain instructions, processing logic, and data?",options:["Scope", "Object", "Modules", "Interface"],correct:2,exp:"Modules contain instructions, processing logic, and data."},
{q:"Which of the following can be separately compiled and stored in a library?",options:["Programs", "Scope", "Namespace", "Modules"],correct:3,exp:"Modules can be compiled separately and stored in a library."},
{q:"Which of the following members of a class are denied access from the outside of class?",options:["private", "public", "protected", "All of these"],correct:0,exp:"Private members cannot be accessed from outside the class."},
{q:"The members that are accessible from outside the class is",options:["private", "public", "protected", "All of these"],correct:1,exp:"Public members are accessible from outside the class."},
{q:"The arrangement of private instance variables and public methods ensures the principle of",options:["Data Encapsulation", "Inheritance", "Polymorphism", "All of these"],correct:0,exp:"This arrangement is the core idea of data encapsulation."},
{q:"The members accessible from within the class and are also available to its sub-classes is",options:["private", "public", "protected", "All of these"],correct:2,exp:"Protected members are visible within the class and its subclasses."},
{q:"The symbol prefixed with the variable to indicate protected and private access specifiers is",options:["Single underscore", "Double underscore", "(a) or (b)", "Backslash"],correct:2,exp:"A single underscore marks protected; a double underscore marks private."}
];

const CH4_ALGORITHMIC_STRATEGIES_ADD = [
{q:"A finite set of instructions to accomplish a particular task is called",options:["Flow chart", "Algorithm", "Pseudo code", "Walkthrough"],correct:1,exp:"A finite, well-defined set of instructions is an algorithm."},
{q:"The way of defining an algorithm is called",options:["Algorithmic procedure", "Algorithmic definition", "Algorithmic function", "Algorithmic strategy"],correct:3,exp:"The general approach used to define an algorithm is called an algorithmic strategy."},
{q:"An algorithm that yields expected output for a valid input is called",options:["Problem solving", "Derivations", "Algorithmic solution", "None of the above"],correct:2,exp:"This is the definition of an algorithmic solution."},
{q:"The efficiency of which state can be expressed as O(n)?",options:["Average case", "Best case", "Worst case", "NULL case"],correct:1,exp:"Per this textbook's classification, O(n) here is attributed to the best case."},
{q:"The efficiency of __ state can be expressed as O(1)?",options:["Average case", "Best case", "Worst case", "NULL case"],correct:0,exp:"Per this textbook's classification, O(1) here is attributed to the average case."},
{q:"Linear search is also called as",options:["Continuous search", "Ordered search", "Binary search", "Sequential search"],correct:3,exp:"Linear search is also known as sequential search."},
{q:"Half \u2013 interval search algorithm is also called as",options:["Linear search", "Binary search", "Continuous search", "Ordered search"],correct:1,exp:"Half-interval search is another name for binary search."}
];

const CH5_PYTHON_VAR_OPS_ADD = [
{q:"The Python language was developed by Guido van Rossum of the National Research Institute of Mathematical and Computer Science (CWI) in which country?",options:["Philippines", "Saudi Arabia", "Netherland", "Australia"],correct:2,exp:"CWI is located in the Netherlands."},
{q:"The algorithm uses the \u2018Divide and Conquer\u2019 technique is",options:["Insertion sort", "Bubble sort", "Linear search", "Binary search"],correct:3,exp:"Binary search repeatedly divides the search space, a divide-and-conquer technique."},
{q:"Python was released in the year",options:["1990", "1991", "1992", "1993"],correct:1,exp:"Python was first released in 1991."},
{q:"In how many ways python programs can be written?",options:["1", "2", "3", "4"],correct:1,exp:"Python programs can be written in 2 ways (interactive mode and script mode)."},
{q:"All data values in Python are",options:["class", "object", "data type", "function"],correct:1,exp:"Every data value in Python is an object."},
{q:"Python files are by default saved with extension",options:[".pyth", ".python", ".pyt", ".py"],correct:3,exp:"Python source files use the .py extension."},
{q:"Expand : IDLE",options:["Integrated Device Learning Editor", "Internal Development Loading Environment", "Integrated Development Learning Environment", "Internal Drive Loaded Environment"],correct:2,exp:"IDLE stands for Integrated Development Learning Environment."},
{q:"Which command is used to execute python script?",options:["Run \u2192 Run Module", "File \u2192 Run Module", "Shell \u2192 RunModule", "Terminal \u2192 RunModule"],correct:0,exp:"Run > Run Module executes the current script in IDLE."},
{q:"To run the Python script by pressing the key",options:["F2", "F5", "F7", "F10"],correct:1,exp:"F5 runs the current script in IDLE."},
{q:"input ( ) accepts all data as ____ but not as numbers.",options:["digits", "strings", "character", "None"],correct:1,exp:"input() always returns the entered data as a string."},
{q:"The function used to convert string data as integer explicitly is",options:["int()", "integer()", "num()", "digit()"],correct:0,exp:"int() explicitly converts a string to an integer."},
{q:"In Python which of the following is used to indicate blocks of codes for class, function or body of the loops and block of selection command?",options:["Spaces", "Tabs", "Both a) and b)", "Empty Line"],correct:2,exp:"Python allows either spaces or tabs (consistently) to indicate blocks."},
{q:"Which separation is necessary between tokens?",options:["Whitespace", "dot", "tab", "All of these"],correct:0,exp:"Whitespace is required to separate tokens in Python."},
{q:"It is an invalid identifier.",options:["12Name", "name", "totalmark", "num"],correct:0,exp:"Identifiers cannot start with a digit, so 12Name is invalid."},
{q:"Which operator is called a comparative operator?",options:["=", "==", "+=", "//"],correct:1,exp:"== is the equality/comparison operator."},
{q:"Which operator is called assignment operator?",options:["=", "==", "**", "//"],correct:0,exp:"= is the assignment operator."},
{q:"What is the output for the following code? >>> 5 + 50 * 10",options:["550", "55", "505", "15"],correct:2,exp:"Multiplication happens before addition: 50*10=500, plus 5 = 505."},
{q:"Octal literals are preceded with",options:["0x", "0o", "0h", "0i"],correct:1,exp:"Octal literals in Python are prefixed with 0o."},
{q:"What is the output of the following code? a =100  b=10  print(a/b)",options:["10", "10.0", "10.5", "3"],correct:1,exp:"The / operator always returns a float: 100/10 = 10.0."},
{q:"The output for the following line is  print(\u201c\\\u201d Python \\\u201d\u201d)",options:["Python", "\u2018Python\u2019", "\u201cPython\u201d", "\u201c\u2019 Python\u201d\u2019"],correct:2,exp:"The escaped quotes print literal double quotes around Python."},
{q:"What is the output for the following code? >>> x = 10 >>> y = 20 >>> print(\u201cThe Sum is : \u201c,x+y)",options:["30", "the sum is 30", "The Sum is 30", "The Sum is : 30"],correct:3,exp:"print joins the string and the sum with a space: 'The Sum is : 30'."},
{q:"What is the output of the following code? a=100 b=30 c=a//b print(c)",options:["10", "10.0", "10.5", "3"],correct:3,exp:"// is floor division: 100//30 = 3."},
{q:"What is the output for the following code? >>> a=97 >>> b=35 >>> a>b or a==b",options:["True", "False", "0", "1"],correct:0,exp:"97>35 is True, and 'or' short-circuits to True."},
{q:"What is the output for the following code? >>> a=97 >>> b=35 >>> not (a>b and a==b)",options:["True", "False", "0", "1"],correct:0,exp:"a==b is False, so the 'and' is False, and 'not False' is True."},
{q:"What is the output for the following code? a, b = 30, 20 min = a if a < b else b print(min)",options:["20", "30", "True", "False"],correct:0,exp:"Since 30 is not less than 20, the else branch runs and min = b = 20."},
{q:"What is the output of the following code? x = 1 + 3.14j print(x.imag)",options:["1+3.14j", "1", "3.14", "3.14j"],correct:2,exp:".imag returns just the imaginary component as a float: 3.14."}
];

const CH6_CONTROL_STRUCTURES_ADD = [
{q:"A program statement that causes a jump of control from one part of the program to another is called",options:["statements", "Control statements", "Blocks", "Scope"],correct:1,exp:"A jump-of-control statement is called a control statement."},
{q:"Which of the following is not an alternative or branching statement in Python?",options:["simple if", "if..else", "if..elif..else", "while"],correct:3,exp:"while is a loop, not a branching statement."},
{q:"Which of the following terminates the loop containing it?",options:["break", "continue", "pass", "jump"],correct:0,exp:"break exits (terminates) the loop it is in."},
{q:"The statement which is used to skip the remaining part of the loop and start with next iteration is",options:["break", "continue", "pass", "jump"],correct:1,exp:"continue skips to the next iteration of the loop."},
{q:"Which of the following is a null statement in Python?",options:["break", "continue", "pass", "null"],correct:2,exp:"pass is Python's null (do-nothing) statement."},
{q:"The statement used as a placeholder is",options:["break", "continue", "pass", "null"],correct:2,exp:"pass acts as a placeholder where a statement is syntactically required."},
{q:"What is the output for the following code? i = 10 while (i<=15): print(i,end='\\t') i+=2",options:["10 11 12 13 14 15", "11 13 15", "10 12 14", "10 12 14 15"],correct:2,exp:"Starting at 10 and stepping by 2 while <=15 gives 10, 12, 14."},
{q:"What is the stop value for the following statement? range(30)",options:["0", "1", "30", "29"],correct:3,exp:"range(30) stops at 29 (30 is excluded)."},
{q:"What is the start value for the following statement? range(20)",options:["0", "1", "20", "19"],correct:0,exp:"range(20) starts at 0 by default."},
{q:"What is the output for the following code? i = 10 while (i<=15): print(i,end='\\t') i+=1 else: print(i)",options:["10 11 12 13 14 15 16", "11 13 15 16", "10 12 14 16", "10 12 14 15 16"],correct:0,exp:"The loop prints 10-15, then the else clause runs once the loop condition fails, printing 16."},
{q:"What is the output for the following code? for i in range(2,10,2): print(i,end=' ')",options:["2 4 6 8 10", "2 4 6 8", "2 4 6", "1 2 4 6 8"],correct:1,exp:"range(2,10,2) gives 2,4,6,8 (10 excluded)."},
{q:"What is the output for the following code? for word in \"Computer Science\": if word==\"e\": break print(word, end='')",options:["Computr Scinc", "Compute", "Comput", "Computer Scinc"],correct:2,exp:"The loop breaks the first time it hits 'e', so only 'Comput' prints."},
{q:"What is the output for the following code? for word in \"Computer Science\": if word==\"e\": continue print(word, end='')",options:["Computr Scinc", "Compute", "Comput", "Computer Scinc"],correct:0,exp:"continue skips printing each 'e' but continues the loop, giving 'Computr Scinc'."},
{q:"What is the output for the following code? i=1 while True: if i%5==0: break print(i,end=' ') i+=1",options:["1 2", "1 2 3", "1 2 3 4 5", "1 2 3 4"],correct:3,exp:"The loop breaks right when i becomes 5, so it prints 1 2 3 4."}
];

const CH7_PYTHON_FUNCTIONS_ADD = [
{q:"It avoids repetition and makes high degree of code reusing.",options:["Function", "Loop", "Branching", "Jumping"],correct:0,exp:"Functions avoid repetition by making code reusable."},
{q:"Basically, we can divide functions into _____ types.",options:["1", "2", "3", "4"],correct:3,exp:"Functions in Python are broadly divided into 4 types."},
{q:"How many types of arguments are used by functions in Python?",options:["1", "2", "3", "4"],correct:3,exp:"Python supports 4 types of function arguments."},
{q:"Which of the following statement indicates end of the function?",options:["Function prototype", "Function name", "end", "return"],correct:3,exp:"return marks the end of a function's execution."},
{q:"The variables used in the function definition are called",options:["Parameters", "Arguments", "Identifiers", "Constants"],correct:0,exp:"Variables listed in a function definition are parameters."},
{q:"The values we pass to the function parameters are called",options:["Parameters", "Arguments", "Identifiers", "Constants"],correct:1,exp:"Values passed into a function call are arguments."},
{q:"Which of the following allows you to put arguments in improper order?",options:["Keyword arguments", "Variable\u2013length argument", "Default argument", "Required argument"],correct:0,exp:"Keyword arguments let you pass values out of positional order by naming them."},
{q:"An argument that takes a default value if no value is provided in the function call is",options:["Keyword arguments", "Variable\u2013length argument", "Default argument", "Required argument"],correct:2,exp:"A default argument uses a preset value when none is supplied."},
{q:"The symbol used to define arguments in Variable \u2013 length argument is",options:["#", "*", "$", ":"],correct:1,exp:"The * symbol marks a variable-length (*args) argument."},
{q:"The following code is an example for  def sample(b,c,a): print(\u201cWelcome\u201d) return  sample(a,b,c)",options:["Keyword arguments", "Variable\u2013length argument", "Default argument", "Required argument"],correct:0,exp:"Passing arguments by name (a,b,c) regardless of position is a keyword-argument call."},
{q:"What is the output of the following code? def loc(): y = \u201cLocal\u201d  loc() print(y)",options:["Local", "y", "y = \u201cLocal\u201d", "Error"],correct:3,exp:"y is local to loc() and doesn't exist outside it, causing an Error."},
{q:"What is the output of the following code? def hello(): return  print(hello())",options:["hello \u2013 Python", "Hello \u2013 Python", "None", "hello"],correct:2,exp:"hello() returns nothing (None), and print displays that None."},
{q:"What is the output of the following code: def hello(): print(\u201chello \u2013 Python\u201d) return  print(hello())",options:["hello \u2013 Python then None", "Hello \u2013 Python then None", "None then hello \u2013 Python", "None then python"],correct:0,exp:"The function first prints 'hello \u2013 Python', then print(hello()) prints None since it returns nothing."},
{q:"What is the output of the following code? def add(a,b=3,c): return a+b+c print(add(5,10,15))",options:["30", "23", "10", "Error"],correct:3,exp:"A non-default argument (c) cannot follow a default argument (b) in a definition, so this raises an Error."},
{q:"What is the output of the following code? def add(a,b=3,c=2): return a+b+c print(add(5,10,15))",options:["30", "23", "10", "Error"],correct:0,exp:"add(5,10,15) maps a=5,b=10,c=15, so 5+10+15=30."},
{q:"What is the output of the following code? Sum=lambda a1,a2:a1+a2 print(Sum(20,40)) print(Sum(-20,40))",options:["60 then -60", "20 then -20", "240 then 20", "60 then 20"],correct:3,exp:"20+40=60, and -20+40=20."},
{q:"What is the output of the following code? c=1 def add(): c = c + 2 print(c) add()",options:["1", "3", "2", "Error"],correct:3,exp:"c is local inside add() and referenced before assignment, causing an Error."},
{q:"Default recursive calls in Python is",options:["1000", "2000", "1100", "2200"],correct:0,exp:"Python's default recursion limit is 1000."},
{q:"In Python, anonymous functions are defined using the keyword,",options:["def", "rec", "lambda", "let"],correct:2,exp:"Anonymous functions in Python use the lambda keyword."},
{q:"Which of the following keyword is necessary to modify the value of global variable inside the function?",options:["glob", "global", "glopal", "public"],correct:1,exp:"The 'global' keyword lets a function modify a global variable."},
{q:"What is the output of the following code? x = 0 def add(): global x  x = x + 5 print(x) add() print(x)",options:["5 then 10", "10 then 10", "5 then 5", "Error"],correct:2,exp:"global x makes both prints show the updated value: 5 then 5."},
{q:"What is the output of the following code? x = -18.3 print(round(x))",options:["18", "-18", "-18.5", "-19"],correct:1,exp:"round() rounds -18.3 to the nearest integer, -18."},
{q:"What is the output of the following code? x = 5 def loc(): x = 10 print(x) loc() print(x)",options:["5 then 10", "10 then 10", "5 then 5", "10 then 5"],correct:3,exp:"loc() has its own local x=10; the outer x=5 is unaffected: prints 10 then 5."},
{q:"What is the output of the following statement? eval(\u201825*2-5*4\u2019)",options:["-300", "180", "30", "-450"],correct:2,exp:"eval computes 25*2 - 5*4 = 50 - 20 = 30."}
];

const CH8_STRINGS_ADD = [
{q:"Which of the following is used to handle an array of characters?",options:["Word", "Character", "String", "Letters"],correct:2,exp:"A string handles an array/sequence of characters."},
{q:"Index values are otherwise called as",options:["Size", "Length", "Superscript", "Subscript"],correct:3,exp:"Index values are also called subscripts."},
{q:"The positive subscript of a string always starts from",options:["0", "1", "2", "3"],correct:0,exp:"Positive indexing starts at 0."},
{q:"The negative subscript of a string starts from",options:["0", "1", "-1", "3"],correct:2,exp:"Negative indexing starts at -1 (the last character)."},
{q:"The operator used to append a new string with an existing string is",options:["+", "+=", "++", "*"],correct:1,exp:"+= appends and updates a string with new content."},
{q:"The operator used to display a string in multiple number of times is",options:["+", "&", "*", "++"],correct:2,exp:"The * operator repeats a string multiple times."},
{q:"The string formatting operator is",options:["%", "+=", "++", "<>"],correct:0,exp:"% is Python's classic string formatting operator."},
{q:"The function which allows you to change all occurrences of a particular character in a string is",options:["modify()", "change()", "replace()", "update()"],correct:2,exp:"replace() substitutes all occurrences of a character/substring."},
{q:"Which of the following function returns the number of characters in a string?",options:["len(str)", "str.len()", "length(str)", "str.length()"],correct:0,exp:"len(str) returns the number of characters in a string."}
];

const CH9_LISTS_TUPLES_SETS_DICT_ADD = [
{q:"Which of the following is not a \u201csequence data type\u201d?",options:["List", "Tuples", "Set", "String"],correct:2,exp:"Set is unordered, so it is not a sequence data type."},
{q:"It is an ordered collection of values enclosed within square brackets [ ].",options:["Tuples", "Set", "List", "Dictionary"],correct:2,exp:"A list is an ordered collection written with square brackets."},
{q:"Which of the following consists of several values separated by comma and enclosed within parentheses?",options:["Tuples", "Set", "List", "Dictionary"],correct:0,exp:"A tuple is written as comma-separated values inside parentheses."},
{q:"Which of the following is a mutable and an unordered collection of elements without duplicates?",options:["List", "Tuple", "Set", "Dictionary"],correct:2,exp:"A set is mutable, unordered, and disallows duplicates."},
{q:"Which type stores a key along with its element?",options:["List", "Tuple", "Set", "Dictionary"],correct:3,exp:"A dictionary stores each element with an associated key."},
{q:"Which of the following is the correct way of creating list? I. Marks = [10,20,30,40] II. Fruits=[\u201cApple\u201d,\u201dOrange\u201d,\u201dMango\u201d,\u201dBanana\u201d] III. Mylist = [] IV. Data = [\u201cWelcome\u201d, 3.14,10,[5,10]]",options:["I, II Only", "I, II, III Only", "All are wrong", "All are correct"],correct:3,exp:"All four are valid ways to create a list in Python."},
{q:"What is the output for the following code? Marks = [10,23,41,75] print(Marks[-3])",options:["10", "23", "41", "75"],correct:1,exp:"Index -3 counts 3 from the end: 23."},
{q:"What is the output for the following code? List = [10,20,30,[40,50,60],70] print(len(List))",options:["7", "6", "5", "3"],correct:2,exp:"The nested list counts as one element, giving a total length of 5."},
{q:"Which of the following represents A={10,20,30 }?",options:["List", "Tuple", "Dictionary", "Set"],correct:3,exp:"Curly braces with plain values represent a set."},
{q:"What is the output for the following code? li = list(range(2,11,2)) print(li)",options:["[1,3,5,7,9]", "[2,4,6,8,10]", "[2,4,6,8]", "[1,2,3,4,5,6,7,8,9,10]"],correct:1,exp:"range(2,11,2) gives 2,4,6,8,10 (11 excluded)."},
{q:"What is the output for the following code? S=[x**2 for x in range(1,11)] print(S)",options:["[1,2,...,10]", "[1,2,...,11]", "[1,4,9,16,25,36,49,64,81,100]", "[2,4,6,8,10]"],correct:2,exp:"This list comprehension squares each number from 1 to 10."},
{q:"What is the output for the following code? mylist=[36,12,12] x=mylist.index(12) print(x)",options:["0", "1", "-1", "2"],correct:0,exp:"index() returns the position of the first match, which is index 1... but here index(12) in [36,12,12] returns 1, matching option b."},
{q:"Which of the following represents A={roll:101,age:25,name:'ABC' }?",options:["List", "Tuple", "Dictionary", "Set"],correct:2,exp:"Key-value pairs in curly braces represent a dictionary."}
];

const CH10_PYTHON_CLASSES_ADD = [
{q:"Which of the following is not an object-oriented programming language?",options:["C", "C++", "Python", "Java"],correct:0,exp:"C is a procedural language, not object-oriented."},
{q:"The key features of Object-Oriented Programming are",options:["Classes", "Objects", "a) and b)", "Structures"],correct:2,exp:"Classes and Objects together are the key features of OOP."},
{q:"Which one is referred as instance of a class?",options:["Class", "Object", "Methods", "Members"],correct:1,exp:"An object is an instance of a class."},
{q:"In Python, by default the variables which are defined inside the class is",options:["Private", "Public", "Protected", "Hidden"],correct:1,exp:"By default, class variables in Python are public."},
{q:"Any class member can be accessed by using object with a ____ operator.",options:["Semicolon(;)", "Hash(#)", "Colon(:)", "Dot(.)"],correct:3,exp:"The dot (.) operator accesses class members through an object."},
{q:"Which of the following will act as a constructor?",options:["_ _init", "_ _self_ _", "_ _del_ _", "_ _init_ _"],correct:3,exp:"__init__ is Python's constructor method."},
{q:"Which of the following is used to initialize the class variables?",options:["Class", "Object", "Constructor", "Destructor"],correct:2,exp:"The constructor initializes class variables."},
{q:"In Python, a class is defined by using the keyword",options:["this", "self", "class", "def"],correct:2,exp:"The 'class' keyword defines a class in Python."},
{q:"In Python, every class has a unique name followed by",options:["Semicolon(;)", "Period(.)", "Colon(:)", "None"],correct:2,exp:"A class header ends with a colon."},
{q:"The class method must have the first parameter named as",options:["this", "self", "class", "def"],correct:1,exp:"Instance methods must take 'self' as their first parameter."},
{q:"A variable prefixed with a double underscore becomes",options:["Private", "Public", "Protected", "Hidden"],correct:0,exp:"A double-underscore prefix makes a variable private."},
{q:"Which of the following variable can be accessed only within the class?",options:["Private", "Public", "Protected", "Hidden"],correct:0,exp:"Private variables are accessible only within their own class."},
{q:"A variable accessed anywhere in the program is",options:["Private", "Public", "Protected", "Hidden"],correct:1,exp:"Public variables can be accessed from anywhere in the program."},
{q:"The statements defined inside the class must be properly",options:["indented", "left space", "placed a colon", "All of these"],correct:0,exp:"Python relies on consistent indentation to define class bodies."},
{q:"It gets executed automatically when an object exits from the scope.",options:["Class", "Object", "Constructor", "Destructor"],correct:3,exp:"The destructor runs automatically when an object goes out of scope."}
];

const CH11_DATABASE_CONCEPTS_ADD = [
{q:"Which are raw facts stored in a computer?",options:["Tables", "Database", "Information", "Data"],correct:3,exp:"Raw, unprocessed facts are called data."},
{q:"Which of the following gives a meaningful information about the data?",options:["Information", "Database", "DBMS", "Tables"],correct:0,exp:"Processed, meaningful data is called information."},
{q:"How many major components are there in DBMS?",options:["3", "5", "7", "4"],correct:1,exp:"DBMS has 5 major components."},
{q:"A row is also known as",options:["Attribute", "Tuple", "Relation", "Data"],correct:1,exp:"A row in a table is also called a tuple."},
{q:"A column is known as",options:["Attribute", "Tuple", "Relation", "Data"],correct:0,exp:"A column in a table is also called an attribute."},
{q:"Hierarchical model was developed by",options:["Windows", "IBM", "Wipro", "Apple"],correct:1,exp:"The hierarchical model was developed by IBM."},
{q:"The entire collection of related data in one table is referred as",options:["Relation", "Table", "File", "All of these"],correct:3,exp:"Relation, table, and file are all used to refer to this collection."},
{q:"This model is mainly used in IBM Main Frame computers.",options:["Hierarchical Model", "Object Model", "Entity Relationship Model", "Relational Model"],correct:0,exp:"The hierarchical model was mainly used on IBM mainframes."},
{q:"The relational database model was first proposed by E.F.Codd in",options:["1960", "1970", "1980", "1990"],correct:1,exp:"E. F. Codd proposed the relational model in 1970."},
{q:"ER Model was developed by Chen in",options:["1966", "1970", "1972", "1976"],correct:3,exp:"Peter Chen developed the ER model in 1976."},
{q:"In ER Model, the entities are represented by",options:["Rectangle", "Ellipse", "Diamond", "Circle"],correct:0,exp:"Entities are represented as rectangles in ER diagrams."},
{q:"In ER Model, the attributes are represented by",options:["Rectangle", "Ellipse", "Diamond", "Circle"],correct:1,exp:"Attributes are represented as ellipses in ER diagrams."},
{q:"In ER Model, ________ represents the relationship in ER diagrams.",options:["Rectangle", "Ellipse", "Diamond", "Circle"],correct:2,exp:"Relationships are represented as diamonds in ER diagrams."},
{q:"RDBMS Stands for",options:["Rotational Database Management System", "Real Database Management System", "Relational Database Management System", "Round Database Management System"],correct:2,exp:"RDBMS stands for Relational Database Management System."},
{q:"In which of the following model, data is represented as a simple treelike structure?",options:["Hierarchical Model", "Object Model", "Network Model", "Relational"],correct:0,exp:"The hierarchical model represents data as a tree structure."},
{q:"Database Normalization was first proposed by",options:["Dr. Edgar F Codd", "Dr. Edgar E Codd", "Chen", "E F Chen"],correct:0,exp:"Dr. Edgar F. Codd first proposed database normalization."},
{q:"In which of the following relationship one row in a table is linked with only one row in another table?",options:["One-to-One", "One-to-Many", "Many-to-One", "Many-to-Many"],correct:0,exp:"A one-to-one relationship links exactly one row to one row."},
{q:"A student can have only one exam number is an example of",options:["One-to-One Relationship", "One-to-Many Relationship", "Many-to-One Relationship", "Many-to-Many Relationship"],correct:0,exp:"Each student having a single unique exam number is a one-to-one relationship."},
{q:"Many books in a Library are issued to many students is an example for",options:["One-to-One Relationship", "One-to-Many Relationship", "Many-to-One Relationship", "Many-to-Many Relationship"],correct:3,exp:"Many books to many students is a many-to-many relationship."},
{q:"The symbol used for Cartesian product is",options:["\u03c0", "\u03b1", "X", "*"],correct:2,exp:"The Cartesian product in relational algebra uses the symbol X."},
{q:"The symbol used for PROJECT is",options:["\u03c0", "\u03a0", "X", "\u03c3"],correct:1,exp:"PROJECT is represented by the symbol \u03a0 (capital Pi)."}
];

const CH12_SQL_ADD = [
{q:"SQL stands for",options:["Structured Question Language", "Structured Query Language", "Standard Query Language", "Standard Question Language"],correct:1,exp:"SQL stands for Structured Query Language."},
{q:"The original version of SQL was developed at",options:["ORACLE Corporation", "IBM\u2019s Research Centre", "Microsoft Corporation", "Google"],correct:1,exp:"SQL was originally developed at IBM's research centre."},
{q:"SQL was originally called as",options:["SQLite", "MySQL", "Sequel", "RSQL"],correct:2,exp:"SQL was originally called SEQUEL."},
{q:"The latest version of SQL was released in",options:["2018", "2004", "2006", "2008"],correct:3,exp:"This edition lists 2008 as the latest SQL release."},
{q:"A condition applicable on a field or set of fields is",options:["Commands", "Clauses", "Constraint", "Keywords"],correct:2,exp:"A rule applied to a field is called a constraint."},
{q:"EDML stands for",options:["Embedded Data Manipulation Language", "Essential Data Manipulation Language", "Embedded Data Monitoring Language", "Embedded Data Manipulation Learning"],correct:0,exp:"EDML stands for Embedded Data Manipulation Language."},
{q:"Which constraint may use relational and logical operators for condition?",options:["Check", "Unique", "Limit", "Assign"],correct:0,exp:"The CHECK constraint can use relational/logical operators."},
{q:"The constraint used to assign a default value for the field in table is",options:["Assign", "Default", "Set", "Reset"],correct:1,exp:"The DEFAULT constraint assigns a default value."},
{q:"Which keyword will display every row of the table without considering duplicate entries?",options:["DISTINCT", "ALL", "DUPLICATE", "IN"],correct:1,exp:"ALL displays every row, including duplicates, without filtering."},
{q:"Which command used to delete all the rows but it does not free the space containing the table?",options:["DELETE", "ERASE", "TRUNCATE", "DROP"],correct:0,exp:"DELETE removes rows but doesn't free the table's storage space."},
{q:"Which command used to delete all the rows from the table, the structure remains and the space is freed?",options:["DELETE", "ERASE", "TRUNCATE", "DROP"],correct:2,exp:"TRUNCATE removes all rows and frees the space, keeping the table structure."},
{q:"Which keyword is used to sort the data in descending order?",options:["ASC", "DSC", "DESC", "DASC"],correct:2,exp:"DESC sorts data in descending order."}
];

const CH13_PYTHON_CSV_ADD = [
{q:"Expansion of CSV",options:["Common Separated Values", "Colon Separated Values", "Condition Separated Values", "Comma Separated Values"],correct:3,exp:"CSV stands for Comma Separated Values."},
{q:"Files saved in ________ cannot be opened or edited by text editors.",options:["CSV", "EXCEL", "PYTHON", "C++"],correct:1,exp:"Excel's binary/proprietary format can't be opened by plain text editors."},
{q:"If the fields of data in your CSV file contain commas, you can protect them by enclosing those data fields in ________",options:["slash (/)", "double-quote(\u201c)", "colon (:)", "semi-colon (;)"],correct:1,exp:"Fields containing commas are enclosed in double quotes to protect them."},
{q:"In Python, if no mode is specified the default mode _______ is used",options:["a", "w", "rt", "b"],correct:2,exp:"The default file mode in Python is 'rt' (read text)."},
{q:"Which file mode is used to open for appending at the end of the file without truncating it?",options:["a", "w", "rt", "b"],correct:0,exp:"Mode 'a' appends to a file without truncating it."},
{q:"Which file mode is used to open in binary mode?",options:["a", "w", "rt", "b"],correct:3,exp:"Mode 'b' opens a file in binary mode."},
{q:"Which file mode is used to Open a file for updating (reading and writing)?",options:["a", "w", "rt", "+"],correct:3,exp:"The '+' mode opens a file for both reading and writing."},
{q:"Which method will free up the resources that were tied with the file?",options:["remove()", "delete()", "release()", "close()"],correct:3,exp:"close() releases the resources associated with an open file."},
{q:"A class of CSV module which helps to define parameters for reading and writing CSV is",options:["reader()", "dialect", "writer()", "close()"],correct:1,exp:"The 'dialect' class defines formatting parameters for CSV reading/writing."},
{q:"The parameter used to remove whitespaces after the delimiter is",options:["removespace", "delspace", "skipinitialspace", "delimiter"],correct:2,exp:"skipinitialspace removes whitespace immediately after the delimiter."},
{q:"Which of the following method takes 1-dimensional data (one row) to write in a file?",options:["write()", "writerow()", "writer()", "writerows()"],correct:1,exp:"writerow() writes a single row of data."},
{q:"Which of the following method takes 2-dimensional data (multiple rows) to write in a file?",options:["write()", "writerow()", "writer()", "writerows()"],correct:3,exp:"writerows() writes multiple rows of data at once."},
{q:"The default value for Line terminator is",options:["\\n", "\\r", "\\l", "\\n or \\r"],correct:3,exp:"The csv module's default line terminator combines both \\r and \\n."}
];

const CH14_IMPORTING_CPP_ADD = [
{q:"In which language data type is not required while declaring variable?",options:["Python", "java", "C++", "All of these"],correct:0,exp:"Python is dynamically typed, so data types aren't declared explicitly."},
{q:"A framework for interfacing C and C++ is",options:["Ctypes", "SWIG", "Cython", "Boost"],correct:1,exp:"SWIG is a framework used to interface C and C++."},
{q:"Expansion of MinGW is",options:["Minimalist Graphics for Windows", "Minimalist GNU for Windows", "Minimum Graphics for Windows", "Minimum GNU for Windows"],correct:1,exp:"MinGW stands for Minimalist GNU for Windows."},
{q:"Expansion of SWIG is",options:["Simplified Wrapper Information Generator", "Software Wrapper Interface Generator", "Software Wrapper Information Generator", "Simplified Wrapper Interface Generator"],correct:3,exp:"SWIG stands for Simplified Wrapper Interface Generator."},
{q:"It is not an interface of C language?",options:["Ctypes", "PythonC API", "Boost", "Cython"],correct:2,exp:"Boost is a C++ library, not a C-language interface."},
{q:"Which of the following is a scripting language?",options:["HTML", "Ruby", "JAVA", "C++"],correct:1,exp:"Ruby is a scripting language."},
{q:"To clear the screen in command window use",options:["clear", "clrscr", "cls", "clean"],correct:2,exp:"'cls' clears the Windows command prompt screen."},
{q:"Which keyword is used to import the definitions inside a module to another module?",options:["import", "getopt", "sys", "os"],correct:0,exp:"The 'import' keyword brings definitions from one module into another."},
{q:"Which of the following is not a module in Python?",options:["sys", "getopt", "argv", "os"],correct:2,exp:"argv is an attribute of the sys module, not a module itself."},
{q:"The list of command-line arguments passes to the Python program is",options:["sys", "getopt", "argv", "sys.argv"],correct:2,exp:"The underlying list object holding command-line arguments is called argv."},
{q:"A module of Python helps you to parse(split) command-line options and arguments is",options:["OS", "getopt", "argv", "sys"],correct:1,exp:"The getopt module parses command-line options and arguments."},
{q:"A special variable by default stores the name of the file is",options:["__main__", "__name__", "__sys__", "__getopt__"],correct:1,exp:"__name__ stores the name of the current module/file."}
];

const CH15_DATA_MANIPULATION_SQL_ADD = [
{q:"Which method that returns the next number of rows (n) of the result set?",options:["fetchall()", "fetchone()", "fetchmany()", "count()"],correct:2,exp:"fetchmany() returns the next set of n rows from a query result."}
];

const CH16_DATA_VISUALIZATION_ADD = [
{q:"The graphical representation of information and data is",options:["Data Chart", "Data Visualization", "Data graph", "Data Monitor"],correct:1,exp:"Presenting information and data graphically is called data visualization."},
{q:"The representation of information in a graphic format is",options:["Dashboard", "Infographics", "Information graphics", "Box Plot"],correct:1,exp:"Infographics represent information in a graphic format."},
{q:"A collection of resources assembled to create a single unified visual display is",options:["Dashboard", "Infographics", "Information graphics", "Box Plot"],correct:0,exp:"A dashboard unifies multiple resources into a single visual display."},
{q:"A type of plot that shows the data as a collection of point is",options:["Box plot", "Line plot", "Scatter plot", "pyplot"],correct:2,exp:"A scatter plot displays data as individual points."},
{q:"The method inside the file to display your plot is",options:["plot.show()", "plt.show()", "plot.open()", "plt.open()"],correct:1,exp:"plt.show() displays the current Matplotlib plot."},
{q:"Which chart shows the relationship between a numerical variable and a categorical variable?",options:["Bar chart", "Line chart", "Pie chart", "Histogram"],correct:0,exp:"A bar chart relates a categorical variable to a numeric one."},
{q:"Which of the following represents the frequency distribution of continuous variables?",options:["Bar chart", "Line chart", "Pie chart", "Histogram"],correct:3,exp:"A histogram shows the frequency distribution of continuous data."},
{q:"This cross-looking button allows you to click it, and then click and drag your graph around.",options:["Home button", "Pan Axis", "Configure Subplots button", "Zoom button"],correct:1,exp:"The Pan Axis (cross-shaped) button lets you click-drag to move the plot view."},
{q:"This button allows you to configure various spacing options with your figure and plot.",options:["Home button", "Pan Axis", "Configure Subplots button", "Zoom button"],correct:2,exp:"The Configure Subplots button adjusts spacing options for the figure."},
{q:"______ and _______ are the two ways to display data in the form of a diagram.",options:["Bar Graph", "Histogram", "a) and b)", "Dashboard"],correct:2,exp:"Bar graphs and histograms are the two diagram-based ways mentioned."}
];

const CHAPTERS_CS = [
  {id:1, name:"Function", icon:"ƒ(x)", questions:CH1_FUNCTION, additionalQuestions:CH1_FUNCTION_ADD},
  {id:2, name:"Data Abstraction", icon:"◈", questions:CH2_DATA_ABSTRACTION, additionalQuestions:CH2_DATA_ABSTRACTION_ADD},
  {id:3, name:"Scoping", icon:"▢", questions:CH3_SCOPING, additionalQuestions:CH3_SCOPING_ADD},
  {id:4, name:"Algorithmic Strategies", icon:"⚙", questions:CH4_ALGORITHMIC_STRATEGIES, additionalQuestions:CH4_ALGORITHMIC_STRATEGIES_ADD},
  {id:5, name:"Python – Variables and Operators", icon:"🐍", questions:CH5_PYTHON_VAR_OPS, additionalQuestions:CH5_PYTHON_VAR_OPS_ADD},
  {id:6, name:"Control Structures", icon:"⇄", questions:CH6_CONTROL_STRUCTURES, additionalQuestions:CH6_CONTROL_STRUCTURES_ADD},
  {id:7, name:"Python Functions", icon:"ƒ", questions:CH7_PYTHON_FUNCTIONS, additionalQuestions:CH7_PYTHON_FUNCTIONS_ADD},
  {id:8, name:"Strings and String Manipulation", icon:"Aa", questions:CH8_STRINGS, additionalQuestions:CH8_STRINGS_ADD},
  {id:9, name:"Lists, Tuples, Sets and Dictionary", icon:"[ ]", questions:CH9_LISTS_TUPLES_SETS_DICT, additionalQuestions:CH9_LISTS_TUPLES_SETS_DICT_ADD},
  {id:10, name:"Python Classes and Objects", icon:"⬢", questions:CH10_PYTHON_CLASSES, additionalQuestions:CH10_PYTHON_CLASSES_ADD},
  {id:11, name:"Database Concepts", icon:"🗄", questions:CH11_DATABASE_CONCEPTS, additionalQuestions:CH11_DATABASE_CONCEPTS_ADD},
  {id:12, name:"Structured Query Language (SQL)", icon:"SQL", questions:CH12_SQL, additionalQuestions:CH12_SQL_ADD},
  {id:13, name:"Python and CSV Files", icon:"CSV", questions:CH13_PYTHON_CSV, additionalQuestions:CH13_PYTHON_CSV_ADD},
  {id:14, name:"Importing C++ Programs in Python", icon:"C++", questions:CH14_IMPORTING_CPP, additionalQuestions:CH14_IMPORTING_CPP_ADD},
  {id:15, name:"Data Manipulation through SQL", icon:"⚙", questions:CH15_DATA_MANIPULATION_SQL, additionalQuestions:CH15_DATA_MANIPULATION_SQL_ADD},
  {id:16, name:"Data Visualization using Python", icon:"📊", questions:CH16_DATA_VISUALIZATION, additionalQuestions:CH16_DATA_VISUALIZATION_ADD}
];

/* ================= COMPUTER APPLICATIONS QUESTION BANK (12th Std, Book Back 1 Mark PDF) ================= */
const CA1_MULTIMEDIA = [
{q:"What is multimedia?",options:["a type of computer hardware","a type of computer software","a type of computer network","the use of multiple forms of media to communicate information"],correct:3,exp:"Multimedia is defined as the combined use of text, images, audio, video and animation to convey information."},
{q:"________ has five major components like text, images, sound, video and animation.",options:["Multimedia","Master Page","Master item","Multi-word"],correct:0,exp:"Multimedia has five major components: text, images, sound, video and animation."},
{q:"What is a raster image?",options:["a type of image made up of pixels","a type of image made up of geometric shapes","a type of image made up of text","a type of image made up of sound waves"],correct:0,exp:"A raster image is composed of a grid of pixels, each holding colour information."},
{q:"What is a vector image?",options:["a type of image made of pixels","a type of image made up of geometric shapes","a type of image made up of text","a type of image made up of sound waves"],correct:1,exp:"A vector image is built from mathematically defined geometric shapes like lines and curves, not pixels."},
{q:"Which of the following is a raster image file format?",options:["JPEG","EPS","CDR","SVG"],correct:0,exp:"JPEG stores images as a grid of pixels, making it a raster format; EPS, CDR and SVG are vector formats."},
{q:"Which of the following is a vector image file format?",options:["PSD","JPEG","EPS","BMP"],correct:2,exp:"EPS (Encapsulated PostScript) stores images as scalable geometric shapes, making it a vector format."},
{q:"RTF (Rich Text Format) file format was introduced by __________",options:["TCS","Microsoft","Apple Inc.","IBM"],correct:1,exp:"The Rich Text Format (RTF) was introduced by Microsoft to allow cross-platform document exchange."},
{q:"The expansion of JPEG is _____________",options:["Joint Photographic Experts Group","Joint Photo Experts Group","Join Photon Experts Group","Joint Photographic expressGroup"],correct:0,exp:"JPEG stands for Joint Photographic Experts Group, the committee that created the standard."},
{q:"AIFF file format was developed by _______",options:["TCS","Microsoft","Apple Inc.","IBM"],correct:2,exp:"AIFF (Audio Interchange File Format) was developed by Apple Inc. for storing audio data."},
{q:"Which of the following is an audio file format?",options:["MP3","AVI","MPEG","PNG"],correct:0,exp:"MP3 is a compressed audio file format; AVI and MPEG are video formats, PNG is an image format."},
];

const CA2_DTP_PAGEMAKER = [
{q:"DTP stands for ______________",options:["Desktop Publishing","Desktop Publication","Doctor To Patient","Desktop Printer"],correct:0,exp:"DTP stands for Desktop Publishing, the use of a computer to design and produce printed material."},
{q:"____________ is a DTP software.",options:["Lotus 1-2-3","PageMaker","Maya","Flash"],correct:1,exp:"PageMaker is a dedicated Desktop Publishing (DTP) software; the others are spreadsheet, animation and multimedia tools."},
{q:"Which menu contains the New option?",options:["File menu","Edit menu","Layout menu","Type menu"],correct:0,exp:"The File menu contains commands for creating, opening, saving and printing documents, including New."},
{q:"In PageMaker Window, the area outside of the dark border is referred to as _________.",options:["page","pasteboard","blackboard","dashboard"],correct:1,exp:"The area outside the page's dark border in PageMaker is called the pasteboard, used to hold objects temporarily."},
{q:"Shortcut to close a document in PageMaker is ______________",options:["Ctrl + A","Ctrl + B","Ctrl + C","Ctrl + W"],correct:3,exp:"Ctrl+W is the PageMaker shortcut to close the currently open document."},
{q:"A __________ tool is used for magnifying the particular portion of the area.",options:["Text tool","Line tool","Zoom tool","Hand tool"],correct:2,exp:"The Zoom tool is used to magnify a specific portion of the page for detailed viewing."},
{q:"_________ tool is used for drawing boxes.",options:["Line","Ellipse","Rectangle","Text"],correct:2,exp:"The Rectangle tool is used to draw boxes and rectangular shapes in PageMaker."},
{q:"Place option is present in _____________ menu.",options:["File","Edit","Layout","Window"],correct:0,exp:"The Place option, used to import text or graphics into a document, is found under the File menu."},
{q:"To select an entire document using the keyboard, press ___________",options:["Ctrl + A","Ctrl + B","Ctrl + C","Ctrl + D"],correct:0,exp:"Ctrl+A selects all objects or text in the current PageMaker document."},
{q:"Character formatting consists of which of the following text properties?",options:["Bold","Italic","Underline","All of these"],correct:3,exp:"Character formatting covers text properties such as bold, italic and underline together."},
{q:"Which tool lets you edit text?",options:["Text tool","Type tool","Crop tool","Hand tool"],correct:0,exp:"The Text tool is used to create and edit text in PageMaker."},
{q:"Shortcut to print a document in PageMaker is _______",options:["Ctrl + A","Ctrl + P","Ctrl + C","Ctrl + V"],correct:1,exp:"Ctrl+P is the standard shortcut used in PageMaker to open the Print dialog box."},
];

const CA3_DATABASE_MYSQL = [
{q:"Which language is used to request information from a Database?",options:["Relational","Structural","Query","Compiler"],correct:2,exp:"A query language (like SQL) is used to request and retrieve information from a database."},
{q:"The ---------- diagram gives a logical structure of the database graphically?",options:["Entity-Relationship","Entity","Architectural Representation","Database"],correct:0,exp:"An Entity-Relationship (ER) diagram graphically represents the logical structure of a database."},
{q:"An entity set that does not have enough attributes to form primary key is known as",options:["Strong entity set","Weak entity set","Identity set","Owner set"],correct:1,exp:"A weak entity set lacks sufficient attributes to form its own primary key and depends on a related strong entity."},
{q:"---------- Command is used to delete a database.",options:["Delete database database_name","Delete database_name","drop database database_name","drop database_name"],correct:2,exp:"The correct MySQL syntax to delete a database is \"drop database database_name\"."},
{q:"MySQL belongs to which category of DBMS?",options:["Object Oriented","Hierarchical","Relational","Network"],correct:2,exp:"MySQL is a Relational Database Management System (RDBMS), storing data in related tables."},
{q:"MySQL is freely available and is open source.",options:["True","False"],correct:0,exp:"MySQL is indeed freely available and open source software."},
{q:"---------- represents a \"tuple\" in a relational database?",options:["Table","Row","Column","Object"],correct:1,exp:"In a relational database, a row represents a single record, also called a tuple."},
{q:"Communication is established with MySQL using",options:["SQL","Network calls","Java","API's"],correct:0,exp:"SQL (Structured Query Language) is used to communicate with and manage data in MySQL."},
{q:"Which is the MySQL instance responsible for data processing?",options:["MySQL Client","MySQL Server","SQL","Server Daemon Program"],correct:1,exp:"The MySQL Server instance handles data storage, processing and management, while the client sends requests to it."},
{q:"The structure representing the organizational view of entire database is known as -------- in MySQL database.",options:["Schema","View","Instance","Table"],correct:0,exp:"A schema defines the organizational structure or view of the entire database in MySQL."},
];

const CA4_PHP_BASICS = [
{q:"The expansion of PHP is _________",options:["PHP: Hypertext Preprocessor","Personal Hypertext Preprocessor","Pretext Home page","Preprocessor Home Page"],correct:0,exp:"PHP is a recursive acronym for \"PHP: Hypertext Preprocessor\"."},
{q:"What is the extension of PHP file?",options:[".html",".xml",".php",".ph"],correct:2,exp:"PHP script files are saved with the .php extension."},
{q:"The PHP script should start with _________",options:["<?php","<php","<php?","<:?"],correct:0,exp:"A PHP script block begins with the opening tag <?php."},
{q:"How many data types does PHP support?",options:["18","28","8","38"],correct:2,exp:"PHP supports 8 data types: Integer, Float, String, Boolean, Array, Object, NULL and Resource."},
{q:"Every variable name in PHP must begin with a _________ symbol.",options:["#","//","$","<"],correct:2,exp:"Every PHP variable name must begin with a dollar ($) symbol."},
{q:"_________ in PHP are case -- sensitive.",options:["variable names","keywords","Variable names and keywords","None of the above"],correct:0,exp:"PHP variable names are case-sensitive, unlike its keywords which are not."},
{q:"The assignment operator is ___________",options:["=","==","===","!="],correct:0,exp:"The single equals sign (=) is PHP's assignment operator, used to assign a value to a variable."},
{q:"_________ operators perform an action to compare two values.",options:["arithmetic","comparison","increment","logical"],correct:1,exp:"Comparison operators (like ==, !=, <, >) are used to compare two values."},
{q:"Which operator is called \"identical\"?",options:["=","==","===","<>"],correct:2,exp:"The === operator checks both value and type equality, and is called the \"identical\" operator."},
{q:"_________ is a data type which contains decimal numbers.",options:["Integer","Float","Boolean","NULL"],correct:1,exp:"The Float (or double) data type is used to store numbers with decimal points."},
];

const CA5_PHP_FUNCTIONS_ARRAYS = [
{q:"A_________ is a block of code that performs a specific task.",options:["parameter","function","class","label"],correct:1,exp:"A function is a reusable block of code designed to perform one specific task."},
{q:"Pre-defined functions are also called _________.",options:["user-defined functions","recursive functions","built-in functions","lambda functions"],correct:2,exp:"Pre-defined functions that come with PHP itself are called built-in functions."},
{q:"Which one of the following is the right way of defining a function in PHP?",options:["function functionname() { // code to be executed }","function() {}","def myFunction():","None of the above"],correct:0,exp:"PHP functions are defined using the \"function functionName() { }\" syntax."},
{q:"A user-defined function in PHP starts with the keyword _________.",options:["function","def","defined","funct"],correct:0,exp:"A user-defined function in PHP must start with the \"function\" keyword."},
{q:"Which of the following is a correct way to call a function in PHP?",options:["functionName();","call functionName;","execute functionName;","run functionName();"],correct:0,exp:"A PHP function is called simply by writing its name followed by parentheses, e.g. functionName();."},
{q:"What is an array in PHP?",options:["An array is a special data type.","It can hold many values under a single variable name.","An array element can be any type of data.","All of the above"],correct:3,exp:"An array in PHP is a special data type that holds multiple values of any type under one variable name — all the listed statements are true."},
{q:"How many types of arrays are there in PHP?",options:["2","3","4","5"],correct:1,exp:"PHP supports three types of arrays: indexed, associative and multidimensional."},
{q:"What is the index of the first element in an indexed array in PHP?",options:["0","1","2","3"],correct:0,exp:"PHP indexed arrays are zero-based, so the first element has index 0."},
{q:"What is the index of the third element in an indexed array in PHP with 5 elements?",options:["2","3","4","5"],correct:0,exp:"With zero-based indexing, the third element of an array is at index 2 (0, 1, 2)."},
{q:"How do you create an indexed array in PHP?",options:["By enclosing a comma-separated list of values in square brackets","By using the array() function","By enclosing a comma-separated list of values in curly braces","Both A and B"],correct:3,exp:"An indexed array can be created either with square brackets or the array() function — both work."},
{q:"How do you access the elements of an indexed array in PHP?",options:["By using the array index in square brackets","By using the array key in square brackets","By using the array index in curly braces","By using the array key in curly braces"],correct:0,exp:"Elements of an indexed array are accessed using their numeric index inside square brackets, e.g. $arr[0]."},
];

const CA6_PHP_CONDITIONALS = [
{q:"Which of the following is NOT a type of conditional statement in PHP?",options:["if","if ... else","if ... elseif ... else","while"],correct:3,exp:"while is a looping statement, not a conditional statement like if, if...else or if...elseif...else."},
{q:"What type of statement is the if...else statement?",options:["Conditional statement","Looping","Input statement","Output statement"],correct:0,exp:"The if...else statement is a conditional statement that executes code based on a condition."},
{q:"What is the simplest conditional statement in PHP?",options:["if-else statement","if statement","switch statement","if-elseif-else statement"],correct:1,exp:"The plain if statement, which executes code only when a condition is true, is the simplest conditional form."},
{q:"How does the if statement work in PHP?",options:["A block of code is executed if a certain condition is true.","A block of code is executed if a certain condition is false.","A block of code is executed if multiple conditions are true.","A block of code is executed if multiple conditions are false."],correct:0,exp:"An if statement executes its block of code only when the given condition evaluates to true."},
{q:"What happens if the condition in an \"if\" statement is false?",options:["The code inside the curly braces is executed.","The code inside the curly braces is skipped.","The program terminates.","None of the above"],correct:1,exp:"If the condition is false, the code inside the if block is skipped entirely."},
{q:"What is the syntax for an if-else statement in PHP?",options:["if(condition) { //True-block; }","if(condition) { //True-block; } else { //False-block; }","if-else(condition) { //True-block; } else { //False-block; }","if-elseif(condition) { //True-block; } else { //False-block; }"],correct:1,exp:"The correct PHP if-else syntax is if(condition){ true-block } else { false-block }."},
{q:"Which of the following is used to specify multiple conditions in an if ... elseif ... else statement?",options:["AND","OR","case","elseif"],correct:3,exp:"The elseif keyword is used to test additional conditions after the initial if in PHP."},
{q:"Which of the following is used to specify multiple conditions in a switch statement?",options:["AND","OR","case","if"],correct:2,exp:"In a switch statement, each possible value is specified using a case label."},
{q:"What happens if none of the case values match the expression in a switch statement?",options:["The default case block is executed","The program terminates","The nearest case block is executed","The first case block is executed"],correct:0,exp:"When no case matches the switch expression, the default case block runs."},
{q:"Which of the following is used to terminate the switch statement?",options:["return","continue","goto","break"],correct:3,exp:"The break keyword stops execution of the current case and exits the switch statement."},
];

const CA7_PHP_LOOPS = [
{q:"Which of the following is NOT a type of loop statement in PHP?",options:["for","if ... else","while","do ... while"],correct:1,exp:"if...else is a conditional statement, not a loop; for, while and do...while are loops."},
{q:"What type of loop is \"for loop\" in PHP?",options:["Entry-Check Loop","Exit-Check Loop","Counter Loop","Iteration Loop"],correct:2,exp:"A for loop is a counter-controlled loop, ideal when the number of iterations is known in advance."},
{q:"What is the syntax for for loop in PHP?",options:["for(initialization; condition; increment) { // code}","foreach(initialization; condition; decrement) { // code}","while(condition)","do{...}while(condition)"],correct:0,exp:"PHP's for loop syntax is for(initialization; condition; increment) { code }."},
{q:"What are the three parts of the for loop syntax in PHP?",options:["initialization, condition, increment","initialization, code block, condition","code block, condition, increment","condition, initialization, code block"],correct:0,exp:"A for loop consists of three parts: initialization, condition, and increment/decrement."},
{q:"When is the 'initialization' part of a for loop executed?",options:["Before each iteration","After each iteration","Only once at the beginning of the loop","Only once at the end of the loop"],correct:2,exp:"The initialization part of a for loop runs only once, before the loop begins."},
{q:"What is the purpose of the 'increment' part of a for loop?",options:["To initialize variables","To update variables","To check the condition","To execute the code block"],correct:1,exp:"The increment part updates the loop control variable after each iteration."},
{q:"What type of loop is \"while loop\" in PHP?",options:["Entry-Check Loop","Exit-Check Loop","Counter Loop","Iteration Loop"],correct:0,exp:"A while loop checks its condition before executing the loop body, making it an entry-check (pre-test) loop."},
{q:"What type of loop is \"do...while loop\" in PHP?",options:["Entry-Check Loop","Exit-Check Loop","Counter Loop","Iteration Loop"],correct:1,exp:"A do...while loop checks its condition after executing the body once, making it an exit-check (post-test) loop."},
{q:"Which looping structure should be used to iterate over elements of an array in PHP?",options:["for loop","while loop","do...while loop","foreach loop"],correct:3,exp:"The foreach loop is specifically designed to iterate over each element of an array in PHP."},
{q:"What is the output of the following code? $array = array(1, 2, 3, 4, 5); foreach ($array as $value) { echo $value; }",options:["1 2 3 4 5","5 4 3 2 1","1 1 1 1 1","None of the above"],correct:0,exp:"The foreach loop echoes each array element in order, producing \"1 2 3 4 5\"."},
];

const CA8_HTML_FORMS_VALIDATION = [
{q:"What are HTML forms used for?",options:["To collect input from users","To create server-side programming language","To create a database","To send emails"],correct:0,exp:"HTML forms are used to collect input data from users, such as text, selections and clicks."},
{q:"Which of the following is NOT a form control available in HTML forms?",options:["Text inputs","Buttons","Checkboxes","Cropping Tool"],correct:3,exp:"Cropping Tool is an image-editing feature, not an HTML form control like text inputs, buttons or checkboxes."},
{q:"Which tag is used to create an HTML form?",options:["form","input","textarea","select"],correct:0,exp:"The <form> tag is used to create an HTML form that holds input controls."},
{q:"What form control allows the user to select multiple values?",options:["text inputs","buttons","checkboxes","radio buttons"],correct:2,exp:"Checkboxes allow users to select multiple values at once, unlike radio buttons which allow only one."},
{q:"What form control allows the user to select only one value at a time?",options:["text inputs","buttons","checkboxes","radio buttons"],correct:3,exp:"Radio buttons restrict the user to selecting only one option from a group."},
{q:"What is the purpose of validation in PHP?",options:["To check the input data submitted by the user from the client machine","To display data to users","To store data on the server","To send data to the client"],correct:0,exp:"Validation checks that data submitted by the user from the client machine meets required rules before processing."},
{q:"How many types of validation are available in PHP?",options:["One","Two","Three","Four"],correct:1,exp:"PHP supports two types of validation: client-side and server-side validation."},
];

const CA9_PHP_FILES_MYSQLI = [
{q:"Which PHP function can be used to open a file?",options:["fopen()","fread()","fclose()","fwrite()"],correct:0,exp:"fopen() is the PHP function used to open a file for reading or writing."},
{q:"What PHP function can be used to read a file?",options:["fopen()","fread()","fclose()","fwrite()"],correct:1,exp:"fread() is used to read the contents of an open file in PHP."},
{q:"What PHP function can be used to close a file?",options:["fopen()","fread()","fclose()","fwrite()"],correct:2,exp:"fclose() closes an open file handle in PHP, releasing the resource."},
{q:"Which is the correct function to execute the SQL queries in PHP ?",options:["mysqli_query(\"Connection Object\",\"SQL Query\")","query(\"Connection Object\",\"SQL Query\")","mysql_query(\"Connection Object\",\"SQL Query\")","mysql_query(\"SQL Query\")"],correct:0,exp:"mysqli_query() takes the connection object and the SQL query string as its two parameters to execute a query."},
{q:"Which is the correct function Closing Connection in PHP ?",options:["mysqli_close(\"Connection Object\");","close(\"Connection Object\");","mysql_close(\"Connection Object\");","mysqli_close(\"Database Object\");"],correct:0,exp:"mysqli_close() is called with the connection object to close a MySQL database connection."},
{q:"Which is the correct function to establish Connection in PHP ?",options:["mysqli_connect(\"Server Name \",\"User Name\",\"Password\",\"DB Name\");","connect(\"Server Name \",\"User Name\",\"Password\",\"DB Name\");","mysql_connect(\"Server Name \",\"User Name\",\"Password\",\"DB Name\");","mysqli_connect (\"Database Object\");"],correct:0,exp:"mysqli_connect() establishes a connection using server name, username, password and database name."},
{q:"Which is the not a correct MySQL Function in PHP ?",options:["Mysqli_connect() Function","Mysqli_close() Function","mysqli_select_data() Function","mysqli_affected_rows() Function"],correct:2,exp:"mysqli_select_data() does not exist in PHP's MySQLi extension; the other three are valid functions."},
{q:"How many parameter are required for MYSQLi connect function in PHP ?",options:["2","3","4","5"],correct:2,exp:"mysqli_connect() typically requires 4 parameters: server name, username, password and database name."},
{q:"How many parameter are required for MYSQLi query function in PHP ?",options:["2","3","4","5"],correct:0,exp:"mysqli_query() requires 2 parameters: the connection object and the SQL query string."},
{q:"How many parameter are required for MYSQLi Close function in PHP ?",options:["1","2","3","5"],correct:0,exp:"mysqli_close() requires only 1 parameter: the connection object to be closed."},
{q:"Which version of PHP supports MySQLi fuctions ?",options:["Version 2.0","Version 3.0","Version 4.0","Version 5.0"],correct:3,exp:"The MySQLi extension was introduced with PHP 5.0, replacing the older mysql_ functions."},
];

const CA10_NETWORKING = [
{q:"A set of computers connecting together is called as ----------",options:["Network","Server","Hub","Node"],correct:0,exp:"A collection of interconnected computers is called a network."},
{q:"Many discussions in an online forum leads to personal attacks and is called",options:["Hackers","Virus","Online war","Flame war"],correct:3,exp:"Heated online arguments that turn into personal attacks are known as a flame war."},
{q:"Wi-Fi is short name for",options:["Wireless Fidelity","Wired fidelity","Wired fiber optic","Wireless fiber optic"],correct:0,exp:"Wi-Fi stands for Wireless Fidelity, a technology for wireless local networking."},
{q:"Which among them was challenging to the business people on computer networking",options:["Hacking","Viruses","Both a & b","none of this above"],correct:2,exp:"Both hacking and viruses posed major challenges to businesses relying on computer networks."},
{q:"Which one of the following is not the social media",options:["Gmail","Facebook","twitter","Linkedin"],correct:0,exp:"Gmail is an email service, not a social media platform like Facebook, Twitter or LinkedIn."},
{q:"In mobile network, land areas for network coverage was distributed as",options:["Firmware","cells","Range","Service"],correct:1,exp:"Mobile networks divide coverage areas into smaller regions called cells, giving rise to the term \"cellular network\"."},
{q:"Which one of the following are harmful to computer?",options:["Bloggers","Browser","Hackers","twitter"],correct:2,exp:"Hackers pose a security threat to computers, unlike browsers, bloggers or social platforms."},
{q:"Which of the following system securely share business's information with suppliers, vendors, partners and customers.",options:["Extranet","Intranet","arpanet","arcnet"],correct:0,exp:"An extranet extends a private intranet to securely share information with suppliers, vendors and partners."},
{q:"Match the following and choose the correct answer i. HTTP -The core protocol of the World Wide Web. ii. FTP- enables a client to send and receive complete files from a server. iii. SMTP - Provide e-mail services. iv. DNS- Refer to other host computers by using names rather than numbers.",options:["i, ii, iii, iv","ii, iii, iv, i","iii, iv, i, ii","iv, iii, ii, i"],correct:0,exp:"The pairing is correct as listed: HTTP for the web, FTP for file transfer, SMTP for email, and DNS for name resolution."},
{q:"Communication over ------------------is be made up of voice, data, images and text messages.",options:["Social media","mobile network","whatsapp","software"],correct:1,exp:"Communication over a mobile network combines voice, data, images and text messages."},
{q:"Wi-Fi stands for---------------------",options:["Wireless Fidelity","wired fidelity","wired optic fibre","wireless optic fibre"],correct:0,exp:"Wi-Fi stands for Wireless Fidelity."},
{q:"A TCP/IP network with access restricted to members of an organization",options:["LAN","MAN","WAN","Intranet"],correct:3,exp:"An intranet is a private TCP/IP network whose access is restricted to an organization's own members."},
{q:"RFID stands for --------------",options:["Radio Free identification","real Frequency identity","Radio Frequency indicators","Radio Frequency Identification."],correct:3,exp:"RFID stands for Radio Frequency Identification, used to identify and track tags using radio waves."},
{q:"It guarantees the sending of data is successful and which checks error on operation at OSI layer is--------------",options:["Application layer","Network layer","Transport Layer","Physical layer"],correct:2,exp:"The Transport layer of the OSI model ensures reliable data delivery and performs error checking."},
{q:"Which one of the following will secure data on transmissions",options:["HTTPS","HTTP","FTP","SMTP"],correct:0,exp:"HTTPS encrypts data during transmission, making it secure compared to plain HTTP."},
{q:"----------- provides e-mail service",options:["DNS","TCP","FTP","SMTP"],correct:3,exp:"SMTP (Simple Mail Transfer Protocol) is the protocol used to send e-mail."},
{q:"------------- refer to other host computers by using names rather than numbers.",options:["DNS","TCP","FTP","SMTP"],correct:0,exp:"DNS (Domain Name System) translates human-readable domain names into IP addresses."},
];

const CA11_INTERNET_DNS = [
{q:"Which of the following is used to maintain all the directories of domain names?",options:["Domain name system","Domain name space","Name space","IP address"],correct:1,exp:"The domain name space is the hierarchical structure that maintains all domain name directories."},
{q:"Which of the following notation is used to denote IPv4 addresses?",options:["Binary","Dotted-decimal","Hexadecimal","a and b"],correct:1,exp:"IPv4 addresses are written in dotted-decimal notation, e.g. 192.168.1.1."},
{q:"How many bits are used in the IPv6 addresses?",options:["32","64","128","16"],correct:2,exp:"IPv6 addresses are 128 bits long, compared to 32 bits in IPv4."},
{q:"Expansion of URL is",options:["Uniform Resource Location","Universal Resource Location","Uniform Resource Locator","Universal Resource Locator"],correct:2,exp:"URL stands for Uniform Resource Locator, the address used to locate a resource on the web."},
{q:"How many types are available in URL?",options:["2","3","4","5"],correct:0,exp:"URLs are of two types: absolute URL and relative URL."},
{q:"Maximum characters used in the label of a node?",options:["255","128","63","32"],correct:2,exp:"Each label in a domain name can contain a maximum of 63 characters."},
{q:"In the domain name, the sequence of labels is separated by",options:["semicolon (;)","dot (.)","colon (:)","NULL"],correct:1,exp:"Labels in a domain name are separated by a dot (.), e.g. www.example.com."},
{q:"Which of the following initiates the mapping of domain name to IP address?",options:["Zone","Domain","Resolver","Name servers"],correct:2,exp:"The resolver is the client-side program that initiates the process of mapping a domain name to its IP address."},
{q:"Which is the contiguous area up to which the server has access?",options:["Zone","Domain","Resolver","Name servers"],correct:0,exp:"A zone is the contiguous portion of the domain name space that a particular server administers."},
{q:"Root Name servers are maintained by",options:["IANA","ICANN","WHOIS","DNS"],correct:0,exp:"Root name servers are maintained under the authority of IANA (Internet Assigned Numbers Authority)."},
{q:"ARPANET stands for",options:["American Research Project Agency Network","Advanced Research Project Area Network","Advanced Research Project Agency Network","American Research Programs And Network"],correct:2,exp:"ARPANET stands for Advanced Research Project Agency Network, the precursor to the modern Internet."},
{q:"WWW was invented by",options:["Tim Berners Lee","Charles Babbage","Blaise Pascal","John Napier"],correct:0,exp:"Tim Berners-Lee invented the World Wide Web (WWW) in 1989."},
{q:"Which cable is used in cable TV?",options:["UTP cable","Fibre optics","Coaxial cable","USB cable"],correct:2,exp:"Cable TV networks use coaxial cable to transmit signals."},
{q:"Expansion of UTP is",options:["Uninterrupted Twisted Pair","Uninterrupted Twisted Protocol","Unshielded Twisted Pair","Universal Twisted Protocol"],correct:2,exp:"UTP stands for Unshielded Twisted Pair, a common type of network cable."},
{q:"Which medium is used in the optical fiber cables to transmit data?",options:["Microwave","infra red","light","sound"],correct:2,exp:"Optical fiber cables transmit data using pulses of light."},
{q:"Which of the following is a small peripheral device with a sim slot to connect the computers to Internet?",options:["USB","Dongles","Memory card","Mobiles"],correct:1,exp:"A dongle is a small peripheral device with a SIM slot used to connect computers to the Internet."},
{q:"Which connector is used in the Ethernet cables?",options:["RJ11","RJ21","RJ61","RJ45"],correct:3,exp:"RJ45 is the standard connector used to terminate Ethernet (twisted-pair) cables."},
{q:"Which of the following connector is called as champ connector?",options:["RJ11","RJ21","RJ61","RJ45"],correct:1,exp:"RJ21 is also known as the champ connector, commonly used for telephone wiring."},
{q:"How many pins are used in RJ45 cables?",options:["8","6","50","25"],correct:0,exp:"An RJ45 connector uses 8 pins to carry the 8 wires of a twisted-pair Ethernet cable."},
{q:"Which wiring standard is used for connecting two computers directly?",options:["straight Through wiring","Cross Over wiring","Rollover wiring","None"],correct:1,exp:"Cross-over wiring is used to connect two similar devices, like two computers, directly without a switch."},
];

const CA12_NETWORK_SIM_OPENSOURCE = [
{q:"If the source code of a software is freely accessible by the public, then it is known as",options:["freeware","Firmware","Open source","Public source"],correct:2,exp:"Software whose source code is freely accessible to the public is called open source software."},
{q:"Which of the following is a software program that replicates the functioning of a computer network?",options:["Network software","Network simulation","Network testing","Network calculator"],correct:1,exp:"Network simulation software replicates the behaviour of a real computer network for study and testing."},
{q:"Which of the following can document every incident that happened in the simulation and are used for examination?",options:["Net Exam","Network hardware","Trace file","Net document"],correct:2,exp:"A trace file records every event that occurs during a simulation, which can later be examined."},
{q:"Which is an example of network simulator?",options:["simulator","TCL","Ns2","C++"],correct:2,exp:"NS2 (Network Simulator 2) is a well-known example of network simulation software."},
{q:"Choose the Correct Pair from the following to build NS2",options:["UNIX & TCL","UNIX & a. C++","C++ & OTcl","C++ & NS2"],correct:2,exp:"NS2 is built using a combination of C++ and OTcl (Object Tcl)."},
{q:"Which of the following is not a network simulation software?",options:["Ns2","OPNET","SSFNet","C++"],correct:3,exp:"C++ is a programming language, not network simulation software like Ns2, OPNET or SSFNet."},
{q:"Which of the following is a open source network monitoring software?",options:["C++","OPNET","Open NMS","OMNet++"],correct:2,exp:"OpenNMS is an open source network monitoring platform."},
{q:"Open NMS was released in .....................",options:["1999","2000","2003","2004"],correct:1,exp:"OpenNMS was first released in the year 2000."},
];

const CA13_ECOMMERCE_INTRO = [
{q:"A company involved in E-Business if",options:["it has many branches across the world.","it conduct business electronically over the Internet.","it sells commodities to a foreign country.","it has many employees."],correct:1,exp:"A company is considered engaged in e-business when it conducts its business electronically over the Internet."},
{q:"Which of the following is not a tangible good?",options:["Mobile Phone","Mobile Apps","Medicine","Flower bouquet"],correct:1,exp:"Mobile apps are intangible digital products, unlike physical goods such as phones, medicine or flowers."},
{q:"SME stands for",options:["Small and medium sized enterprises","Simple and medium enterprises","Sound messaging enterprises","Short messaging enterprises"],correct:0,exp:"SME stands for Small and Medium sized Enterprises."},
{q:"The dotcom phenomenon deals with ________",options:["Textile industries","Mobile phone companies","Internet based companies","All the above"],correct:2,exp:"The dotcom phenomenon refers to the rise of Internet-based companies in the late 1990s and 2000s."},
{q:"Which of the following is not correctly matched",options:["The First Wave of Electronic Commerce: 1985 -1990","The Second Wave of Electronic Commerce: 2004 -- 2009","The Third Wave of Electronic Commerce: 2010 -- Present","Dotcom burst: 2000 -- 2002"],correct:1,exp:"The Second Wave of E-Commerce timing given doesn't match the generally accepted period, making it the incorrect pairing."},
{q:"Assertion (A): The websites of first wave dotcom companies were only in English. Reason (R): The dotcom companies of first wave are mostly American companies.",options:["Both (A) and (R) are correct and (R) is the correct explanation of (A)","Both (A) and (R) are correct, but (R) is not the correct explanation of (A)","(A) is true and (R) is false","(A) is false and (R) is true"],correct:0,exp:"Both statements are true, and the fact that first-wave dotcom firms were mostly American explains why their sites were in English."},
{q:"Off-shoring means",options:["Work outsourced to a branch of its own company","Work outsourced to new employees","Work outsourced to a third party locally","Work outsourced to a third party outside its own country"],correct:3,exp:"Off-shoring refers to outsourcing work to a third party located outside the company's home country."},
{q:"G2G systems are classified into",options:["Internal facing and External facing","Internet and Extranet","First wave and Second wave","Left facing and Right facing"],correct:0,exp:"Government-to-Government (G2G) systems are classified into internal-facing and external-facing systems."},
{q:"____ host the e-books on their websites.",options:["Bulk-buying websites","Community websites","Digital publishing websites","Licensing websites"],correct:2,exp:"Digital publishing websites are the ones that host e-books online."},
{q:"Which of the following is a characteristics of E-Commerce",options:["Products can be inspected physically before purchase.","Goods are delivered instantly.","Resource focus supply side","Scope of business is global."],correct:3,exp:"A key characteristic of e-commerce is that it gives businesses a global reach, unlike physical inspection or local delivery."},
];

const CA14_EPAYMENT = [
{q:"Based on the monetary value e payment system can be classified into",options:["Mirco and Macro","Micro and Nano","Maximum and Minimum","Maximum and Macro"],correct:0,exp:"E-payment systems are classified by monetary value into micro (small) and macro (large) payments."},
{q:"______ refers to a payment made from one bank account to another bank account using eletronic methods.",options:["Electronic payment","Direct payment","Indirect payment","None of the above"],correct:0,exp:"Electronic payment refers to transferring money from one bank account to another using electronic methods."},
{q:"Assertion (A): Macro electronic payment systems support higher value payments. Reason (R): Expensive cryptographic operations are included in macro payments",options:["Both (A) and (R) are correct and (R) is the correct explanation of (A)","Both (A) and (R) are correct, but (R) is not the correct explanation of (A)","(A) is true and (R) is false","(A) is false and (R) is true"],correct:0,exp:"Both statements are true — macro payment systems support high-value transactions, which is why expensive cryptographic operations are used."},
{q:"Which of the following is correctly matched",options:["Credit Cards - pay before","Debit Cards - pay now","Stored Value Card - pay later","Smart card -- pay anytime"],correct:3,exp:"A smart card can be used for \"pay anytime\" transactions, correctly matching the pair; the other pairs are reversed."},
{q:"ECS stands for",options:["Electronic Clearing Services","Electronic Cloning Services","Electronic Clearing Station","Electronic Cloning Station"],correct:0,exp:"ECS stands for Electronic Clearing Services, used for bulk payment transactions."},
{q:"Which of the following is a online payment system for small payments.",options:["Card based payment","Micro electronic payment","Macro electronic payment","Credit card payment"],correct:1,exp:"Micro electronic payment systems are designed for handling small-value online payments."},
{q:"Which of the following is true about Virtual payment address (VPA)",options:["Customers can use their e-mail id as VPA","VPA does not includes numbers","VPA is a unique ID","Multiple bank accounts cannot have single VPA"],correct:2,exp:"A Virtual Payment Address (VPA) is a unique ID used to identify a bank account for UPI transactions."},
{q:"Pick the odd one in the credit card transaction",options:["card holder","merchant","marketing manager","acquirer"],correct:2,exp:"Card holder, merchant and acquirer are all parties in a credit card transaction; a marketing manager is not."},
{q:"Which of the following is true about debit card i. debit cards cannot be used in ATMs ii. debit cards cannot be used in online transactions iii. debit cards do not need bank accounts iv. debit cards and credit cards are identical in physical properties",options:["i, ii, iii","ii, iii, iv","iii alone","iv alone"],correct:3,exp:"Debit and credit cards share similar physical properties (card shape, chip, magnetic strip), so statement iv alone is true."},
{q:"Match the following List A List B A1) First Digit B1) Account number A2) 9th to 15th Digit B2) MII Code A3) First 6 Digits B3) BIN Code A4) Last Digit B4) Check digit A1 A2 A3 A4",options:["B4 B3 B2 B1","B2 B1 B3 B4","B2 B3 B4 B1","B2 B4 B3 B1"],correct:1,exp:"The correct matching is: First Digit–MII Code, 9th-15th Digit–Account number, First 6 Digits–BIN Code, Last Digit–Check digit."},
];

const CA15_ECOMMERCE_SECURITY = [
{q:"In E-Commerce, when a stolen credit card is used to make a purchase it is termed as",options:["Friendly fraud","Clean fraud","Triangulation fraud","Cyber squatting"],correct:1,exp:"Using a stolen credit card to make a purchase is termed clean fraud in e-commerce."},
{q:"Which of the following is not a security element involved in E-Commerce?",options:["Authenticity","Confidentiality","Fishing","Privacy"],correct:2,exp:"Fishing (phishing) is a type of attack, not a security element like authenticity, confidentiality or privacy."},
{q:"Asymmetric encryption use ___________ keys for encryption and decryption",options:["Same","Different","Positive","Negative"],correct:1,exp:"Asymmetric encryption uses two different keys — a public key and a private key — for encryption and decryption."},
{q:"The security authentication technology includes i) Digital Signatures ii) Digital Currency iii) Digital Image iv) Digital Certificates",options:["i & iv","ii & iii","i, ii & iii","all the above"],correct:0,exp:"Digital Signatures and Digital Certificates are authentication technologies; Digital Currency and Digital Image are not."},
{q:"PGP stands for",options:["Pretty Good Privacy","Pretty Good Person","Private Good Privacy","Private Good Person"],correct:0,exp:"PGP stands for Pretty Good Privacy, an encryption program for secure communication."},
{q:"_____ protocol is used for securing credit cards transactions via the Internet",options:["Secure Electronic Transaction (SET)","Credit Card Verification","Symmetric Key Encryption","Public Key Encryption"],correct:0,exp:"The Secure Electronic Transaction (SET) protocol is specifically designed to secure credit card transactions over the Internet."},
{q:"Secure Electronic Transaction (SET) was developed in",options:["1999","1996","1969","1997"],correct:1,exp:"The SET protocol was developed in 1996 by Visa and Mastercard."},
{q:"The websites secured by Secure Socket Layer protocols can be identified using",options:["html://","http://","htmls://","https://"],correct:3,exp:"Websites secured with SSL/TLS use the https:// prefix in their URL."},
{q:"______ is the process of converting plain text into meaningless cipher text",options:["Encryption","Decryption","Digital certificate","Digital signature"],correct:0,exp:"Encryption is the process of converting readable plain text into unreadable cipher text."},
{q:"Which of the following is true about Ransomware",options:["Ransomware is not a subset of malware","Ransomware deletes the file instantly","Typopiracy is a form of ransomware","Hackers demand ransom from the victim"],correct:3,exp:"Ransomware is malware that locks or encrypts a victim's files, and the attacker demands a ransom for their release."},
];

const CA16_EDI = [
{q:"EDI stands for",options:["Electronic Details Information","Electronic Data Information","Electronic Data Interchange","Electronic Details Interchange"],correct:2,exp:"EDI stands for Electronic Data Interchange, the electronic exchange of business documents between organizations."},
{q:"Which of the following is an internationally recognized standard format for EDI?",options:["TSLFACT","SETFACT","FTPFACT","EDIFACT"],correct:3,exp:"EDIFACT is the internationally recognized United Nations standard format for EDI."},
{q:"Which is the first industry-specific EDI standard?",options:["TDCC","VISA","Master","ANSI"],correct:0,exp:"TDCC (Transportation Data Coordinating Committee) developed the first industry-specific EDI standard."},
{q:"Which of the following is a type of EDI?",options:["Direct EDI","Indirect EDI","Collective EDI","Unique EDI"],correct:0,exp:"Direct EDI is one recognized type of EDI, where two parties connect directly without an intermediary."},
{q:"Who is called as the father of EDI?",options:["Charles Babbage","Ed Guilbert","Pascal","None of the above"],correct:1,exp:"Ed Guilbert is widely regarded as the father of EDI (Electronic Data Interchange)."},
];

const CHAPTERS_CA = [
  {id:501, name:"Multimedia", icon:"🎬", questions:CA1_MULTIMEDIA, additionalQuestions:[]},
  {id:502, name:"Desktop Publishing – PageMaker", icon:"🖨️", questions:CA2_DTP_PAGEMAKER, additionalQuestions:[]},
  {id:503, name:"Database Concepts & MySQL", icon:"🗄", questions:CA3_DATABASE_MYSQL, additionalQuestions:[]},
  {id:504, name:"PHP Basics", icon:"🐘", questions:CA4_PHP_BASICS, additionalQuestions:[]},
  {id:505, name:"PHP Functions & Arrays", icon:"ƒ()", questions:CA5_PHP_FUNCTIONS_ARRAYS, additionalQuestions:[]},
  {id:506, name:"PHP Control Structures – Conditionals", icon:"⚖️", questions:CA6_PHP_CONDITIONALS, additionalQuestions:[]},
  {id:507, name:"PHP Control Structures – Loops", icon:"🔁", questions:CA7_PHP_LOOPS, additionalQuestions:[]},
  {id:508, name:"HTML Forms & PHP Validation", icon:"📝", questions:CA8_HTML_FORMS_VALIDATION, additionalQuestions:[]},
  {id:509, name:"PHP File Handling & MySQLi", icon:"📁", questions:CA9_PHP_FILES_MYSQLI, additionalQuestions:[]},
  {id:510, name:"Networking Concepts", icon:"🌐", questions:CA10_NETWORKING, additionalQuestions:[]},
  {id:511, name:"Internet & Domain Name System", icon:"🔗", questions:CA11_INTERNET_DNS, additionalQuestions:[]},
  {id:512, name:"Network Simulation & Open Source", icon:"🧪", questions:CA12_NETWORK_SIM_OPENSOURCE, additionalQuestions:[]},
  {id:513, name:"Introduction to E-Commerce", icon:"🛒", questions:CA13_ECOMMERCE_INTRO, additionalQuestions:[]},
  {id:514, name:"E-Payment Systems", icon:"💳", questions:CA14_EPAYMENT, additionalQuestions:[]},
  {id:515, name:"E-Commerce Security", icon:"🔒", questions:CA15_ECOMMERCE_SECURITY, additionalQuestions:[]},
  {id:516, name:"Electronic Data Interchange (EDI)", icon:"🔄", questions:CA16_EDI, additionalQuestions:[]}
];

/* ================= MATHS QUESTION BANK (12th Std, Book Back 1 Mark PDF) ================= */
const MU1_MATRICES = [
{q:"If |adj(adj A)| = |A|⁹, then the order of the square matrix A is",options:["3","4","2","5"],correct:1},
{q:"If A is a 3×3 non-singular matrix such that AAᵀ = AᵀA and B = A⁻¹Aᵀ, then BBᵀ =",options:["A","B","I₃","Bᵀ"],correct:2},
{q:"If A = [3,5;1,2], B = adj A and C = 3A, then |adj B| / |C| =",options:["1/3","1/9","1/4","1"],correct:1},
{q:"If A[1,-2;1,4] = [6,0;0,6], then A =",options:["[1,-2;1,4]","[1,2;-1,4]","[4,2;-1,1]","[4,-1;2,1]"],correct:2},
{q:"If A = [7,3;4,2], then 9I₂ - A =",options:["A⁻¹","A⁻¹/2","3A⁻¹","2A⁻¹"],correct:3},
{q:"If A = [2,0;1,5] and B = [1,4;2,0], then |adj(AB)| =",options:["-40","-80","-60","-20"],correct:1},
{q:"If P = [1,x,0;1,3,0;2,4,-2] is the adjoint of a 3×3 matrix A and |A| = 4, then x is",options:["15","12","14","11"],correct:3},
{q:"If A = [3,1,-1;2,-2,0;1,2,-1] and A⁻¹ = [a11,a12,a13;a21,a22,a23;a31,a32,a33], then the value of a23 is",options:["0","-2","-3","-1"],correct:3},
{q:"If A, B and C are invertible matrices of some order, then which one of the following is NOT true?",options:["adj A = |A| A⁻¹","adj (AB) = (adj A)(adj B)","det A⁻¹ = (det A)⁻¹","(ABC)⁻¹ = C⁻¹B⁻¹A⁻¹"],correct:1},
{q:"If (AB)⁻¹ = [12,-17;-19,27] and A⁻¹ = [1,-1;-2,3], then B⁻¹ =",options:["[2,-5;-3,8]","[8,5;3,2]","[3,1;2,1]","[8,-5;-3,2]"],correct:0},
{q:"If AᵀA⁻¹ is symmetric, then A² =",options:["A⁻¹","(Aᵀ)²","Aᵀ","(A⁻¹)²"],correct:1},
{q:"If A is a non-singular matrix such that A⁻¹ = [5,3;-2,-1], then (Aᵀ)⁻¹ =",options:["[-5,3;2,1]","[5,3;-2,-1]","[-1,-3;2,5]","[5,-2;3,-1]"],correct:3},
{q:"If A = [3/5,4/5;x,3/5] and Aᵀ = A⁻¹, then the value of x is",options:["-4/5","-3/5","3/5","-4/5 (again)"],correct:0},
{q:"If A = [1,tan(θ/2);-tan(θ/2),1] and AB = I₂, then B =",options:["cos²(θ/2)·A","cos²(θ/2)·Aᵀ","(cos 2θ)·I","sin²(θ/2)·A"],correct:1},
{q:"If A = [cosθ,sinθ;-sinθ,cosθ] and A(adj A) = [k,0;0,k], then k =",options:["0","sinθ","cosθ","1"],correct:3},
{q:"If A = [2,3;5,-2] is such that A⁻¹ = λA, then λ is",options:["17","14","19","21"],correct:2},
{q:"If adj A = [2,3;4,-1] and adj B = [1,-2;-3,1], then adj(AB) is",options:["[-7,-1;7,-9]","[-6,5;-2,-10]","[-7,7;-1,-9]","[-6,-2;5,-10]"],correct:1},
{q:"The rank of the matrix formed by rows (1,2),(2,4),(-1,-2),(3,4),(6,8),(-3,-4) is",options:["1","2","4","3"],correct:0},
{q:"If xᵃyᵇ = eᵐ, xᶜyᵈ = eⁿ, with Δ1=|m,b;n,d|, Δ2=|a,m;c,n|, Δ3=|a,b;c,d|, then x and y are respectively",options:["e^(Δ1/Δ2), e^(Δ3/Δ1)","log(Δ1/Δ3), log(Δ2/Δ3)","log(Δ2/Δ1), log(Δ3/Δ1)","e^(Δ1/Δ3), e^(Δ2/Δ3)"],correct:3},
{q:"Which of the following is/are correct? (i) Adjoint of a symmetric matrix is also symmetric. (ii) Adjoint of a diagonal matrix is also diagonal. (iii) adj(λA) = λⁿ·adj(A). (iv) A(adj A) = (adj A)A = |A|I",options:["Only (i)","(ii) and (iii)","(iii) and (iv)","(i), (ii) and (iv)"],correct:3},
{q:"If ρ(A) = ρ([A|B]), then the system AX = B of linear equations is",options:["consistent and has a unique solution","consistent","consistent and has infinitely many solutions","inconsistent"],correct:1},
{q:"If θ ≠ 0 and the system x + (sinθ)y - (cosθ)z = 0, (cosθ)x - y + z = 0, (sinθ)x + y - z = 0 has a non-trivial solution, then θ is",options:["2π/3","3π/4","5π/6","π/4"],correct:3},
{q:"The augmented matrix of a linear system is [1,2,7;0,1,λ+3;0,0,λ-7,μ+5]. The system has infinitely many solutions if",options:["λ=7, μ≠-5","λ=-7, μ=5","λ≠7, μ≠-5","λ=7, μ=-5"],correct:3},
{q:"Let A = [2,-1,1;-1,2,-1;1,-1,2] and 4B = [3,1,-1;1,3,x;-1,1,3]. If B is the inverse of A, then the value of x is",options:["2","4","3","1"],correct:3},
{q:"If A = [3,-3,4;2,-3,4;0,-1,1], then adj(adj A) is",options:["[3,-3,4;2,-3,4;0,-1,1]","[6,-6,8;4,-6,8;0,-2,2]","[-3,3,-4;-2,3,-4;0,1,-1]","[3,-3,4;0,-1,1;2,-3,4]"],correct:0}
];

const MU2_COMPLEX = [
{q:"iⁿ + iⁿ⁺¹ + iⁿ⁺² + iⁿ⁺³ is",options:["0","1","-1","i"],correct:0},
{q:"The value of Σ(n=1 to 13) (iⁿ + iⁿ⁻¹) is",options:["1+i","i","1","0"],correct:0},
{q:"The area of the triangle formed by the complex numbers z, iz, and z+iz in the Argand diagram is",options:["(1/2)|z|²","|z|²","(3/2)|z|²","2|z|²"],correct:0},
{q:"The conjugate of a complex number is 1/(i-2). Then the complex number is",options:["1/(i+2)","-1/(i+2)","-1/(i-2)","1/(i-2)"],correct:1},
{q:"If z = (√3+i)³(3i+4)²/(8+6i)², then |z| is equal to",options:["0","1","2","3"],correct:2},
{q:"If z is a non-zero complex number such that 2iz² = z̄, then |z| is",options:["1/2","1","2","3"],correct:0},
{q:"If |z-2+i| ≤ 2, then the greatest value of |z| is",options:["√3 - 2","√3 + 2","√5 - 2","√5 + 2"],correct:3},
{q:"If |z - 3/z| = 2, then the least value of |z| is",options:["1","2","3","5"],correct:0},
{q:"If |z| = 1, then the value of (1+z)/(1-z) is",options:["z","z̄","1/z","1"],correct:0},
{q:"The solution of the equation |z| - z = 1 + 2i is",options:["3/2 - 2i","-3/2 + 2i","2 - 3/2 i","2 + 3/2 i"],correct:0},
{q:"If |z₁|=1, |z₂|=2, |z₃|=3 and |9z₁z₂ + 4z₁z₃ + z₂z₃| = 12, then the value of |z₁+z₂+z₃| is",options:["1","2","3","4"],correct:1},
{q:"If z is a complex number such that z ∈ C\\R and z + 1/z ∈ R, then |z| is",options:["0","1","2","3"],correct:1},
{q:"z₁, z₂, z₃ are complex numbers such that z₁+z₂+z₃=0 and |z₁|=|z₂|=|z₃|=1, then z₁²+z₂²+z₃² is",options:["3","2","1","0"],correct:3},
{q:"If (z-1)/(z+1) is purely imaginary, then |z| is",options:["1/2","1","2","3"],correct:1},
{q:"If z = x+iy is a complex number such that |z+2| = |z-2|, then the locus of z is",options:["real axis","imaginary axis","ellipse","circle"],correct:1},
{q:"The principal argument of 3/(-1+i) is",options:["-5π/6","-2π/3","-3π/4","-π/2"],correct:2},
{q:"The principal argument of (sin40° + i cos40°)⁵ is",options:["-110°","-70°","70°","110°"],correct:0},
{q:"If (1+i)(1+2i)(1+3i)...(1+ni) = x+iy, then 2·5·10·...·(1+n²) is",options:["1","i","x²+y²","1+n²"],correct:2},
{q:"If ω≠1 is a cube root of unity and (1+ω)⁷ = A+Bω, then (A,B) equals",options:["(1,0)","(-1,1)","(0,1)","(1,1)"],correct:3},
{q:"The principal argument of (1+i√3)²/(4i(1-i√3)) is",options:["2π/3","π/6","5π/6","π/2"],correct:3},
{q:"If ω≠1 is a cube root of unity, α and β are roots of x²+x+1=0, then α²⁰²⁰+β²⁰²⁰ is",options:["-2","-1","1","2"],correct:1},
{q:"The product of all four values of (cos π/3 + i sin π/3)^(3/4) is",options:["-2","-1","1","2"],correct:2},
{q:"If ω≠1 is a cube root of unity and |1,1,1; 1,-ω²-1,ω²; 1,ω²,ω⁷| = 3k, then k is equal to",options:["1","-1","√3 i","-√3 i"],correct:3},
{q:"The value of ((1+√3i)/(1-√3i))¹⁰ is",options:["cis(2π/3)","cis(4π/3)","-cis(2π/3)","-cis(4π/3)"],correct:0},
{q:"If ω = cis(2π/3), then the number of distinct roots of |z+1,ω,ω²; ω,z+ω²,1; ω²,1,z+ω| = 0 is",options:["1","2","3","4"],correct:0}
];

const MU3_EQUATIONS = [
{q:"A zero of x³ + 64 is",options:["0","4","4i","-4"],correct:3},
{q:"If f and g are polynomials of degrees m and n respectively, and h(x) = (f∘g)(x), then the degree of h is",options:["mn","m+n","mⁿ","nᵐ"],correct:0},
{q:"A polynomial equation in x of degree n always has",options:["n distinct roots","n real roots","n complex roots","at most one root"],correct:2},
{q:"If α, β and γ are the zeros of x³+px²+qx+r, then Σ(1/α) is",options:["-q/r","-p/r","q/r","-q/p"],correct:0},
{q:"According to the rational root theorem, which number is not a possible rational zero of 4x⁷+2x⁴-10x³-5?",options:["-1","5/4","4/5","5"],correct:2},
{q:"The polynomial x³-kx²+9x has three real zeros if and only if k satisfies",options:["|k|≤6","k=0","|k|>6","|k|≥6"],correct:3},
{q:"The number of real numbers in [0,2π] satisfying sin⁴x - 2sin²x + 1 = 0 is",options:["2","4","1","∞"],correct:0},
{q:"x³+12x²+10ax+1999 definitely has a positive zero if and only if",options:["a≥0","a>0","a<0","a≤0"],correct:2},
{q:"The polynomial x³+2x+3 has",options:["one negative and two imaginary zeros","one positive and two imaginary zeros","three real zeros","no zeros"],correct:0},
{q:"The number of positive zeros of the polynomial Σ(r=0 to n) ⁿCᵣ(-1)ʳxʳ is",options:["0","n","<n","r"],correct:1}
];
const MU4_INVERSE_TRIG = [
{q:"The value of sin⁻¹(cos x), 0 ≤ x ≤ π is",options:["π - x","x - π/2","π/2 - x","x - π"],correct:2},
{q:"If sin⁻¹x + sin⁻¹y = 2π/3, then cos⁻¹x + cos⁻¹y is equal to",options:["2π/3","π/3","π/6","π"],correct:1},
{q:"sin⁻¹(3/5) - cos⁻¹(12/13) + sec⁻¹(5/3) - cosec⁻¹(13/12) is equal to",options:["2π","π","0","tan⁻¹(12/65)"],correct:2},
{q:"If sin⁻¹x = 2sin⁻¹α has a solution, then",options:["|α| ≤ 1/√2","|α| ≥ 1/√2","|α| < 1/√2","|α| > 1/√2"],correct:0},
{q:"sin⁻¹(cos x) = π/2 - x is valid for",options:["-π ≤ x ≤ 0","0 ≤ x ≤ π","-π/2 ≤ x ≤ π/2","-π/4 ≤ x ≤ 3π/4"],correct:1},
{q:"If sin⁻¹x + sin⁻¹y + sin⁻¹z = 3π/2, the value of (x²⁰¹⁷+y²⁰¹⁸+z²⁰¹⁹) - 9/(x¹⁰¹+y¹⁰¹+z¹⁰¹) is",options:["0","1","2","3"],correct:0},
{q:"If cot⁻¹x = 2π/5 for some x∈R, the value of tan⁻¹x is",options:["-π/10","π/5","π/10","-π/5"],correct:2},
{q:"The domain of f(x) = sin⁻¹(√(x-1)) is",options:["[1,2]","[-1,1]","[0,1]","[-1,0]"],correct:0},
{q:"If x = 1/5, the value of cos(cos⁻¹x + 2sin⁻¹x) is",options:["-√(24)/25","√(24)/25","1/5","-1/5"],correct:3},
{q:"tan⁻¹(1/4) + tan⁻¹(2/9) is equal to",options:["(1/2)cos⁻¹(3/5)","(1/2)sin⁻¹(3/5)","(1/2)tan⁻¹(3/5)","tan⁻¹(1/2)"],correct:3},
{q:"If f(x) = sin⁻¹(x²-3), then x belongs to",options:["[-1,1]","[√2,2]","[-2,-√2]∪[√2,2]","[-2,-√2]"],correct:2},
{q:"If cot⁻¹2 and cot⁻¹3 are two angles of a triangle, then the third angle is",options:["π/4","3π/4","π/6","π/3"],correct:1},
{q:"sin⁻¹(tan(π/4)) - sin⁻¹(√(3/x)) = π/6. Then x is a root of the equation",options:["x²-x-6=0","x²-x-12=0","x²+x-12=0","x²+x-6=0"],correct:1},
{q:"sin⁻¹(2cos²x-1) + cos⁻¹(1-2sin²x) =",options:["π/2","π/3","π/4","π/6"],correct:0},
{q:"If cot⁻¹(√(sinα)) + tan⁻¹(√(sinα)) = u, then cos 2u is equal to",options:["tan²α","0","-1","tan 2α"],correct:2},
{q:"If |x|≤1, then 2tan⁻¹x - sin⁻¹(2x/(1+x²)) is equal to",options:["tan⁻¹x","sin⁻¹x","0","π"],correct:2},
{q:"The equation tan⁻¹x - cot⁻¹x = tan⁻¹(1/√3) has",options:["no solution","unique solution","two solutions","infinite solutions"],correct:1},
{q:"If sin⁻¹x + cot⁻¹(1/2) = π/2, then x is equal to",options:["1/2","1/√5","2/√5","√3/2"],correct:1},
{q:"If sin⁻¹(x/4) + cosec⁻¹(4/x) = π/2, then the value of x is",options:["4","5","2","3"],correct:3},
{q:"sin(tan⁻¹x), |x|<1 is equal to",options:["x/√(1-x²)","1/√(1-x²)","1/√(1+x²)","x/√(1+x²)"],correct:3}
];

const MU5_ANALYTICAL_GEOMETRY = [
{q:"The equation of the circle passing through (1,5) and (4,1) and touching the y-axis is x²+y²-5x-6y+9+λ(4x+3y-19)=0 where λ is equal to",options:["0, 40/9","0","40/9","-40/9"],correct:0},
{q:"The eccentricity of the hyperbola whose latus rectum is 8 and conjugate axis is half the distance between the foci is",options:["4/3","4/√3","2/√3","3/2"],correct:2},
{q:"The circle x²+y²=4x+8y+5 intersects the line 3x-4y=m at two distinct points if",options:["15<m<65","35<m<85","-85<m<-35","-35<m<35"],correct:3},
{q:"The length of the diameter of the circle which touches the x-axis at (1,0) and passes through (2,3) is",options:["6/5","5/3","10/3","3/5"],correct:2},
{q:"The radius of the circle 3x²+by²+4bx-6by+b²=0 is",options:["1","3","√10","√11"],correct:2},
{q:"The centre of the circle inscribed in a square formed by x²-8x-12=0 and y²-14y+45=0 is",options:["(4,7)","(7,4)","(9,4)","(4,9)"],correct:0},
{q:"The equation of the normal to the circle x²+y²-2x-2y+1=0 which is parallel to the line 2x+4y=3 is",options:["x+2y=3","x+2y+3=0","2x+4y+3=0","x-2y+3=0"],correct:0},
{q:"If P(x,y) is any point on 16x²+25y²=400 with foci F1(3,0) and F2(-3,0), then PF1+PF2 is",options:["8","6","10","12"],correct:2},
{q:"The radius of the circle passing through (6,2), two of whose diameters are x+y=6 and x+2y=4, is",options:["10","2√5","6","4"],correct:1},
{q:"The area of the quadrilateral formed with the foci of x²/a²-y²/b²=1 and x²/a²-y²/b²=-1 is",options:["4(a²+b²)","2(a²+b²)","a²+b²","(1/2)(a²+b²)"],correct:1},
{q:"If the normals of the parabola y²=4x drawn at the end points of its latus rectum are tangents to the circle (x-3)²+(y+2)²=r², the value of r² is",options:["2","3","1","4"],correct:0},
{q:"If x+y=k is a normal to the parabola y²=12x, then the value of k is",options:["3","-1","1","9"],correct:3},
{q:"The ellipse E1: x²/9+y²/4=1 is inscribed in a rectangle R with sides parallel to the axes. E2 passes through (0,4) and circumscribes R. The eccentricity of E2 is",options:["√2/2","√3/2","1/2","3/4"],correct:2},
{q:"Tangents are drawn to x²/9-y²/4=1 parallel to 2x-y=1. One point of contact is",options:["(9/(2√2), -1/√2)","(-9/(2√2), 1/√2)","(9/(2√2), 1/√2)","(3√3, -2√2)"],correct:2},
{q:"The equation of the circle passing through the foci of x²/16+y²/9=1 with centre at (0,3) is",options:["x²+y²-6y-7=0","x²+y²-6y+7=0","x²+y²-6y-5=0","x²+y²-6y+5=0"],correct:0},
{q:"Let C be the circle centred at (1,1), radius 1. T is centred at (0,y) through the origin and touches C externally. The radius of T is",options:["√3/√2","√3/2","1/2","1/4"],correct:3},
{q:"An ellipse has eccentricity 3/5 with distance between foci = 6. The area of the quadrilateral formed by the major and minor axes as diagonals is",options:["8","32","80","40"],correct:3},
{q:"Area of the greatest rectangle inscribed in the ellipse x²/a²+y²/b²=1 is",options:["2ab","ab","√(ab)","a/b"],correct:0},
{q:"An ellipse has OB as semi-minor axis, F,F' as foci, angle FBF' is a right angle. The eccentricity is",options:["1/√2","1/2","1/4","1/√3"],correct:0},
{q:"The eccentricity of the ellipse (x-3)²+(y-4)² = y²/9 is",options:["√3/2","1/3","1/(3√2)","1/√3"],correct:1},
{q:"If two tangents from a point P to y²=4x are at right angles, the locus of P is",options:["2x+1=0","x=-1","2x-1=0","x=1"],correct:1},
{q:"The circle passing through (1,-2) and touching the x-axis at (3,0) passes through the point",options:["(-5,2)","(2,-5)","(5,-2)","(-2,5)"],correct:2},
{q:"The locus of a point whose distance from (-2,0) is (2/3) times its distance from the line x=-9/2 is",options:["a parabola","a hyperbola","an ellipse","a circle"],correct:2},
{q:"The values of m for which y=mx+2√5 touches 16x²-9y²=144 are roots of x²-(a+b)x-4=0. The value of (a+b) is",options:["2","4","0","-2"],correct:2},
{q:"If one end of a diameter of x²+y²-8x-4y+c=0 is (11,2), the other end is",options:["(-5,2)","(-3,2)","(5,-2)","(-2,5)"],correct:1}
];

const MU6_VECTOR_ALGEBRA = [
{q:"If a⃗ and b⃗ are parallel vectors, then [a⃗, b⃗, c⃗] is equal to",options:["2","-1","1","0"],correct:3},
{q:"If a vector α⃗ lies in the plane of β⃗ and γ⃗, then",options:["[α⃗,β⃗,γ⃗]=1","[α⃗,β⃗,γ⃗]=-1","[α⃗,β⃗,γ⃗]=0","[α⃗,β⃗,γ⃗]=2"],correct:2},
{q:"If a⃗·b⃗ = b⃗·c⃗ = c⃗·a⃗ = 0, then the value of [a⃗,b⃗,c⃗] is",options:["|a⃗||b⃗||c⃗|","(1/3)|a⃗||b⃗||c⃗|","1","-1"],correct:0},
{q:"If a⃗,b⃗,c⃗ are unit vectors such that a⃗ is perpendicular to b⃗ and parallel to c⃗, then a⃗×(b⃗×c⃗) is equal to",options:["a⃗","b⃗","c⃗","0⃗"],correct:1},
{q:"If [a⃗,b⃗,c⃗]=1, then the value of [a⃗·(b⃗×c⃗)]/[(c⃗×a⃗)·b⃗] + [b⃗·(c⃗×a⃗)]/[(a⃗×b⃗)·c⃗] + [c⃗·(a⃗×b⃗)]/[(c⃗×b⃗)·a⃗] is",options:["1","-1","2","3"],correct:0},
{q:"The volume of the parallelepiped with edges î+ĵ, î+2ĵ, î+ĵ+πk̂ is",options:["π/2","π/3","π","π/4"],correct:2},
{q:"If a⃗ and b⃗ are unit vectors such that [a⃗,b⃗,a⃗×b⃗] = 1/4, the angle between a⃗ and b⃗ is",options:["π/6","π/4","π/3","π/2"],correct:0},
{q:"If a⃗=î+ĵ+k̂, b⃗=î+ĵ, c⃗=î, and (a⃗×b⃗)×c⃗ = λa⃗+μb⃗, then λ+μ is",options:["0","1","6","3"],correct:0},
{q:"If a⃗,b⃗,c⃗ are non-coplanar with [a⃗,b⃗,c⃗]=3, then {[a⃗×b⃗, b⃗×c⃗, c⃗×a⃗]}² is equal to",options:["81","9","27","18"],correct:0},
{q:"If a⃗,b⃗,c⃗ are non-coplanar unit vectors with a⃗×(b⃗×c⃗) = (b⃗+c⃗)/√2, the angle between a⃗ and b⃗ is",options:["π/2","3π/4","π/4","π"],correct:1},
{q:"If the volume of the parallelepiped with a⃗×b⃗, b⃗×c⃗, c⃗×a⃗ as coterminous edges is 8, the volume of the parallelepiped with (a⃗×b⃗)×(b⃗×c⃗), (b⃗×c⃗)×(c⃗×a⃗), (c⃗×a⃗)×(a⃗×b⃗) as edges is",options:["8 cubic units","512 cubic units","64 cubic units","24 cubic units"],correct:2},
{q:"Vectors a⃗,b⃗,c⃗,d⃗ satisfy (a⃗×b⃗)×(c⃗×d⃗)=0⃗. P1, P2 are planes of a⃗,b⃗ and c⃗,d⃗ respectively. The angle between P1 and P2 is",options:["0°","45°","60°","90°"],correct:0},
{q:"If a⃗×(b⃗×c⃗) = (a⃗×b⃗)×c⃗, with b⃗·c⃗≠0 and a⃗·b⃗≠0, then a⃗ and c⃗ are",options:["perpendicular","parallel","inclined at π/3","inclined at π/6"],correct:1},
{q:"If a⃗=2î+3ĵ-k̂, b⃗=î+2ĵ-5k̂, c⃗=3î+5ĵ-k̂, a vector perpendicular to a⃗ and lying in the plane of b⃗,c⃗ is",options:["-17î-21ĵ-97k̂","17î+21ĵ-123k̂","-17î-21ĵ+97k̂","-17î-21ĵ-97k̂ (dup)"],correct:3},
{q:"The angle between the lines (x-2)/3 = (y+1)/-2, z=2 and (x-1)/1 = (2y+3)/3 = (z+5)/2 is",options:["π/6","π/4","π/3","π/2"],correct:3},
{q:"If the line (x-2)/3 = (y-1)/-5 = (z+2)/2 lies in the plane x+3y-αz+β=0, then (α,β) is",options:["(-5,5)","(-6,7)","(5,-5)","(6,-7)"],correct:1},
{q:"The angle between the line r⃗ = (î+2ĵ-3k̂)+t(2î+ĵ-2k̂) and the plane r⃗·(î+ĵ)+4=0 is",options:["0°","30°","45°","90°"],correct:2},
{q:"The point where the line r⃗ = (6î-ĵ-3k̂)+t(-î+4k̂) meets the plane r⃗·(î+ĵ-k̂)=3 is",options:["(2,1,0)","(7,-1,-7)","(1,2,-6)","(5,-1,1)"],correct:3},
{q:"Distance from the origin to the plane 3x-6y+2z+7=0 is",options:["0","1","2","3"],correct:1},
{q:"The distance between the planes x+2y+3z+7=0 and 2x+4y+6z+7=0 is",options:["√7/(2√2)","7/2","√7/2","7/(2√2)"],correct:0},
{q:"If the direction cosines of a line are 1/c, 1/c, 1/c, then",options:["c=±3","c=±√3","c>0","0<c≤1"],correct:1},
{q:"The vector equation r⃗ = (î-2ĵ-k̂)+t(6ĵ-k̂) represents a straight line passing through the points",options:["(0,6,-1) and (1,-2,-1)","(0,6,-1) and (-1,-4,-2)","(1,-2,-1) and (1,4,-2)","(1,-2,-1) and (0,-6,1)"],correct:2},
{q:"If the distance of (1,1,1) from the origin is half its distance from the plane x+y+z+k=0, then the values of k are",options:["±3","±6","-3,9","3,-9"],correct:3},
{q:"If the planes r⃗·(2î-ĵ+k̂)=3 and r⃗·(4î+ĵ-μk̂)=5 are parallel, then λ and μ are",options:["1/2,-2","-1/2,2","-1/2,-2","1/2,2"],correct:2},
{q:"If the length of the perpendicular from the origin to the plane 2x+3y+λz=1, λ>0 is 1/5, then the value of λ is",options:["2√3","3√2","0","1"],correct:0}
];
const MU7_DIFF_CALCULUS = [
{q:"The volume of a sphere is increasing at the rate of 3 cm³/sec. The rate of change of its radius when radius is 1/2 cm is",options:["3 cm/s","2 cm/s","1 cm/s","1/2 cm/s"],correct:0},
{q:"A balloon rises straight up at 10 m/s. An observer is 40 m away from the launch spot. The rate of change of the angle of elevation (rad/s) when the balloon is 30 m up is",options:["3/25","4/25","1/5","1/3"],correct:1},
{q:"The position of a particle is s(t)=3t²-2t-8. The time at which the particle is at rest is",options:["t=0","t=1/3","t=1","t=3"],correct:1},
{q:"A stone thrown up vertically has height x=80t-16t². The stone reaches maximum height at t =",options:["2","2.5","3","3.5"],correct:1},
{q:"The point on the curve 6y=x³+2 at which the y-coordinate changes 8 times as fast as the x-coordinate is",options:["(4,11)","(4,-11)","(-4,11)","(-4,-11)"],correct:0},
{q:"The abscissa of the point on f(x)=√(8-2x) where the slope of the tangent is -0.25 is",options:["-8","-4","-2","0"],correct:1},
{q:"The slope of the line normal to f(x)=2cos4x at x=π/12 is",options:["-4√3","-4","√3/12","4√3"],correct:2},
{q:"The tangent to the curve y²-xy+9=0 is vertical when",options:["y=0","y=±√3","y=1/2","y=±3"],correct:3},
{q:"Angle between y²=x and x²=y at the origin is",options:["tan⁻¹(3/4)","tan⁻¹(4/3)","π/2","π/4"],correct:2},
{q:"The value of lim(x→0) (cot x - 1/x) is",options:["0","1","2","∞"],correct:0},
{q:"The function sin⁴x+cos⁴x is increasing in the interval",options:["[5π/8, 3π/4]","[π/2, 5π/8]","[π/4, π/2]","[0, π/4]"],correct:2},
{q:"The number given by Rolle's theorem for f(x)=x³-3x², x∈[0,3] is",options:["1","√2","3/2","2"],correct:3},
{q:"The number given by the Mean Value Theorem for f(x)=1/x, x∈[1,9] is",options:["2","2.5","3","3.5"],correct:2},
{q:"The minimum value of |3-x|+9 is",options:["0","3","6","9"],correct:3},
{q:"The maximum slope of the tangent to y=eˣsinx, x∈[0,2π] is at",options:["x=π/4","x=π/2","x=π","x=3π/2"],correct:1},
{q:"The maximum value of x²e⁻²ˣ, x>0 is",options:["1/e","1/(2e)","1/e²","4/e⁴"],correct:2},
{q:"One of the closest points on x²-y²=4 to the point (6,0) is",options:["(2,0)","(√5,1)","(3,√5)","(√13,-√3)"],correct:2},
{q:"The maximum value of the product of two positive numbers whose sum of squares is 200 is",options:["100","25√7","28","24√14"],correct:0},
{q:"The curve y=ax⁴+bx² with ab>0",options:["has no horizontal tangent","is concave up","is concave down","has no points of inflection"],correct:3},
{q:"The point of inflection of y=(x-1)³ is",options:["(0,0)","(0,1)","(1,0)","(1,1)"],correct:2}
];

const MU8_DIFFERENTIALS = [
{q:"A circular template has radius 10 cm with error 0.02 cm. The percentage error in the area is",options:["0.2%","0.4%","0.04%","0.08%"],correct:1},
{q:"The percentage error of the fifth root of 31 is approximately how many times the percentage error in 31?",options:["1/31","1/5","5","31"],correct:1},
{q:"If u(x,y) = e^(x²+y²), then ∂u/∂x is equal to",options:["e^(x²+y²)","2xu","x²u","y²u"],correct:1},
{q:"If v(x,y) = log(eˣ+eʸ), then ∂v/∂x + ∂v/∂y is equal to",options:["eˣ+eʸ","1/(eˣ+eʸ)","2","1"],correct:3},
{q:"If w(x,y) = xʸ, x>0, then ∂w/∂x is equal to",options:["xʸ log x","y log x","y·xʸ⁻¹","x log y"],correct:2},
{q:"If f(x,y) = eˣʸ, then ∂²f/∂x∂y is equal to",options:["xy·eˣʸ","(1+xy)eˣʸ","(1+y)eˣʸ","(1+x)eˣʸ"],correct:1},
{q:"If the side of a cube is measured as 4 cm with error 0.1 cm, then the error in computed volume is",options:["0.4 cu.cm","0.45 cu.cm","2 cu.cm","4.8 cu.cm"],correct:3},
{q:"The change in the surface area S=6x² of a cube when the edge varies from x₀ to x₀+dx is",options:["12x₀+dx","12x₀·dx","6x₀·dx","6x₀+dx"],correct:1},
{q:"The approximate change in volume V of a cube of side x, caused by increasing the side by 1%, is",options:["0.3x·dx m³","0.03x m³","0.03x² m³","0.03x³ m³"],correct:3},
{q:"If g(x,y)=3x²-5y+2y², x(t)=eᵗ and y(t)=cos t, then dg/dt is equal to",options:["6e²ᵗ+5sint-4cost·sint","6e²ᵗ-5sint+4cost·sint","3e²ᵗ+5sint+4cost·sint","3e²ᵗ-5sint+4cost·sint"],correct:1},
{q:"If f(x) = x/(x+1), then its differential is given by",options:["-1/(x+1)² dx","1/(x+1)² dx","1/(x+1) dx","-1/(x+1) dx"],correct:1},
{q:"If u(x,y) = x²+3xy+y-2019, then ∂u/∂x at (4,-5) is equal to",options:["-4","-3","-7","13"],correct:2},
{q:"Linear approximation for g(x)=cos x at x=π/2 is",options:["x+π/2","-x+π/2","x-π/2","-x-π/2"],correct:1},
{q:"If w(x,y,z) = x²(y-z)+y²(z-x)+z²(x-y), then ∂w/∂x + ∂w/∂y + ∂w/∂z is",options:["xy+yz+zx","x(y+z)","y(z+x)","0"],correct:3},
{q:"If f(x,y,z) = xy+yz+zx, then fₓ - f_z is equal to",options:["z-x","y-z","x-z","y-x"],correct:0}
];

const MU9_INTEGRATION = [
{q:"The value of ∫(0 to 2/3) dx/√(4-9x²) is",options:["π/6","π/2","π/4","π"],correct:0},
{q:"The value of ∫(-1 to 2) |x| dx is",options:["1/2","3/2","5/2","7/2"],correct:2},
{q:"For any value of n∈Z, ∫(0 to π) e^(cos²x) cos³[(2n+1)x] dx is",options:["π/2","π","0","2"],correct:2},
{q:"The value of ∫(-π/2 to π/2) cos3x·cosx dx is",options:["3/2","1/2","0","2/3"],correct:3},
{q:"The value of ∫(-4 to 4) [tan⁻¹(x²/(x⁴+1)) + tan⁻¹((x⁴+1)/x²)] dx is",options:["π","2π","3π","4π"],correct:3},
{q:"The value of ∫(-π/4 to π/4) (2x⁷-3x⁵+7x³-x+1)/cos²x dx is",options:["4","3","2","0"],correct:2},
{q:"If f(x) = ∫(0 to x) t·cos t dt, then df/dx is",options:["cosx - x sinx","sinx + x cosx","x cosx","x sinx"],correct:2},
{q:"The area between y²=4x and its latus rectum is",options:["2/3","4/3","8/3","5/3"],correct:2},
{q:"The value of ∫(0 to 1) x(1-x)⁹⁹ dx is",options:["1/11000","1/10100","1/10010","1/1001"],correct:1},
{q:"The value of ∫(0 to 1) dx/(1+5^cosx) is",options:["π/2","π","3π/2","2π"],correct:0},
{q:"If Γ(n+2)/Γ(n) = 90, then n is",options:["10","5","8","9"],correct:3},
{q:"The value of ∫(0 to π/6) cos³3x dx is",options:["2/3","2/9","1/9","1/3"],correct:1},
{q:"The value of ∫(0 to π) sin⁴x dx is",options:["3π/10","3π/8","3π/4","3π/2"],correct:1},
{q:"The value of ∫(0 to ∞) e⁻³ˣx² dx is",options:["7/27","5/27","4/27","2/27"],correct:3},
{q:"The value of a such that ∫(0 to a) 1/(4+x²) dx = π/8 is",options:["4","1","3","2"],correct:3},
{q:"The volume of the solid of revolution of the region bounded by y²=x(a-x) about the x-axis is",options:["πa³","πa³/4","πa³/5","πa³/6"],correct:3},
{q:"If f(x)=∫(1 to x) e^(sinu)/u du, x>1, and ∫(1 to 3) e^(sinx²)/x dx = (1/2)[f(a)-f(1)], one possible value of a is",options:["3","6","9","5"],correct:0},
{q:"The value of ∫(0 to 1) (sin⁻¹x)² dx is",options:["π²/4 - 1","π²/4 + 2","π²/4 + 1","π²/4 - 2"],correct:3},
{q:"The value of ∫(0 to a) √(a²-x²) dx is",options:["πa³/16","3πa⁴/16","3πa²/8","3πa⁴/8"],correct:1},
{q:"If ∫(0 to x) f(t)dt = x + ∫(x to 1) t·f(t)dt, then the value of f(1) is",options:["1/2","2","1","3/4"],correct:0}
];
const MU10_ODE = [
{q:"The order and degree of d²y/dx² + (dy/dx)^(1/3) + x^(1/4) = 0 are respectively",options:["2, 3","3, 3","2, 6","2, 4"],correct:0},
{q:"The differential equation representing the family y = A cos(x+B), where A, B are parameters, is",options:["d²y/dx² - y = 0","d²y/dx² + y = 0","d²y/dx² = 0","d²x/dy² = 0"],correct:1},
{q:"The order and degree of √(sin x)(dx+dy) = √(cos x)(dx-dy) is",options:["1, 2","2, 2","1, 1","2, 1"],correct:2},
{q:"The order of the differential equation of all circles with centre (h,k) and radius a is",options:["2","3","4","1"],correct:1},
{q:"The differential equation of the family y = Aeˣ + Be⁻ˣ, where A, B are arbitrary constants, is",options:["d²y/dx² + y = 0","d²y/dx² - y = 0","dy/dx + y = 0","dy/dx - y = 0"],correct:1},
{q:"The general solution of dy/dx = y/x is",options:["xy = k","y = k log x","y = kx","log y = kx"],correct:2},
{q:"The solution of the differential equation 2x(dy/dx) - y = 3 represents",options:["straight lines","circles","parabolas","ellipses"],correct:2},
{q:"The solution of dy/dx + p(x)y = 0 is",options:["y = ce^(∫p dx)","y = ce^(-∫p dx)","x = ce^(-∫p dy)","x = ce^(∫p dy)"],correct:1},
{q:"The integrating factor of dy/dx + y = (1+y)/λ is",options:["x/e^λ","e^λ/x","λeˣ","eˣ"],correct:1},
{q:"The integrating factor of dy/dx + P(x)y = Q(x) is x. Then P(x) is",options:["x","x²/2","1/x","1/x²"],correct:2},
{q:"The degree of the differential equation y(x) = 1 + dy/dx + (1/1.2)(dy/dx)² + (1/1.2.3)(dy/dx)³ + ... is",options:["2","3","1","4"],correct:2},
{q:"If p and q are the order and degree of y(dy/dx) + x³(d²y/dx²) + xy = cos x, then",options:["p<q","p=q","p>q","p exists and q does not"],correct:2},
{q:"The solution of the differential equation dy/dx + 1/√(1-x²) = 0 is",options:["y + sin⁻¹x = c","x + sin⁻¹y = 0","y² + 2sin⁻¹x = C","x² + 2sin⁻¹y = 0"],correct:0},
{q:"The solution of the differential equation dy/dx = 2xy is",options:["y = Ce^(x²)","y = 2x²+C","y = Ce^(-x²)+C","y = x²+C"],correct:0},
{q:"The general solution of log(dy/dx) = x+y is",options:["eˣ+eʸ = C","eˣ+e⁻ʸ = C","e⁻ˣ+eʸ = C","e⁻ˣ+e⁻ʸ = C"],correct:1},
{q:"The solution of dy/dx = 2^(y-x) is",options:["2ˣ+2ʸ = C","2ˣ-2ʸ = C","(1/2)ˣ - (1/2)ʸ = C","x+y = C"],correct:2},
{q:"The solution of dy/dx = y/x + φ(y/x)/φ'(y/x) is",options:["x·φ(y/x) = k","φ(y/x) = kx","y·φ(y/x) = k","φ(y/x) = ky"],correct:1},
{q:"If sin x is the integrating factor of dy/dx + Py = Q, then P is",options:["log sin x","cos x","tan x","cot x"],correct:3},
{q:"The number of arbitrary constants in the general solutions of order n and n+1 are respectively",options:["n-1, n","n, n+1","n+1, n+2","n+1, n"],correct:1},
{q:"The number of arbitrary constants in the particular solution of a third order differential equation is",options:["3","2","1","0"],correct:3},
{q:"Integrating factor of dy/dx = (x+y+1)/(x+1) is",options:["1/(x+1)","x+1","1/√(x+1)","√(x+1)"],correct:0},
{q:"The population P in any year t is such that the rate of increase is proportional to the population. Then",options:["P = Ce^(kt)","P = Ce^(-kt)","P = Ckt","P = C"],correct:0},
{q:"P is the amount of a substance remaining after time t. If the rate of evaporation is proportional to the amount remaining, then",options:["P = Ce^(kt)","P = Ce^(-kt)","P = Ckt","Pt = C"],correct:1},
{q:"If the solution of dy/dx = (ax+3)/(2y+f) represents a circle, then the value of a is",options:["2","-2","1","-1"],correct:1},
{q:"The slope at any point of a curve y=f(x) is dy/dx = 3x² and it passes through (-1,1). The equation of the curve is",options:["y = x³+2","y = 3x²+4","y = 3x³+4","y = x³+5"],correct:0}
];

const MU11_PROBABILITY = [
{q:"Let X have pdf f(x) = 2/x³ for x≥1 and 0 for x<1. Which statement is correct?",options:["both mean and variance exist","mean exists but variance does not","both mean and variance do not exist","variance exists but mean does not"],correct:1},
{q:"A rod of length 2l is broken at random into two pieces, with the shorter piece's pdf f(x)=1/l for 0<x<l and 0 for l≤x<2l. The mean and variance of the shorter piece are respectively",options:["l/2, l²/3","l/2, l²/6","l, l²/12","l/2, l²/12"],correct:3},
{q:"In a die-toss game, a 6 wins ₹36, otherwise the player loses ₹k² for the face k∈{1,2,3,4,5}. The expected amount to win, in ₹, is",options:["19/6","-19/6","3/2","-3/2"],correct:1},
{q:"A six-sided die (1-6) and a four-sided die (1-4) are rolled and the sum X is found. The number of elements in the inverse image of 7 is",options:["1","2","3","4"],correct:3},
{q:"A binomial random variable X has n=25, p=0.8. The standard deviation of X is",options:["6","4","3","2"],correct:3},
{q:"X is the difference between the number of heads and tails when a coin is tossed n times. The possible values of X are",options:["i+2n, i=0,...n","2i-n, i=0,...n","n-i, i=0,...n","2i+2n, i=0,...n"],correct:1},
{q:"If f(x)=1/12 for a<x<b is a pdf of a continuous random variable X, which cannot be the value of a and b?",options:["0 and 12","5 and 17","7 and 19","16 and 24"],correct:2},
{q:"Four buses carry 42,36,34,48 students (160 total). A student is picked at random: X = size of their bus. A driver is picked at random: Y = size of their bus. E(X) and E(Y) are respectively",options:["50, 40","40, 50","40.75, 40","41, 41"],correct:2},
{q:"Two coins land heads with probabilities 0.6 and 0.5 (independent). If X is total heads, E(X) is",options:["0.11","1.1","11","1"],correct:1},
{q:"On a 3-choice, 5-question multiple choice exam, the probability of 4 or more correct just by guessing is",options:["11/243","3/8","1/243","5/243"],correct:0},
{q:"If P(X=0)=1-P(X=1) and E(X)=3Var(X), then P(X=0) is",options:["2/3","2/5","1/5","1/3"],correct:3},
{q:"A binomial X has expected value 6 and variance 2.4. P(X=5) is",options:["¹⁰C₅(3/5)⁶(2/5)⁴","¹⁰C₅(3/5)¹⁰","¹⁰C₅(3/5)⁴(2/5)⁶","¹⁰C₅(3/5)⁵(2/5)⁵"],correct:3},
{q:"X has pdf f(x)=ax+b for 0<x<1 (0 otherwise) and E(X)=7/12. Then a and b are respectively",options:["1 and 1/2","1/2 and 1","2 and 1","1 and 2"],correct:0},
{q:"X takes values 0,1,2 with P(X=i)=k·P(X=i-1) for i=1,2 and P(X=0)=1/7. The value of k is",options:["1","2","3","4"],correct:1},
{q:"Which is a discrete random variable? I. Cars crossing a signal in a day. II. Customers in a queue at a moment. III. Time to complete a phone call.",options:["I and II","II only","III only","II and III"],correct:0},
{q:"If f(x)=2x for 0≤x≤a (0 otherwise) is a pdf, the value of a is",options:["1","2","3","4"],correct:0},
{q:"A random variable has f(x)=k, 2k, 3k, 4k, 5k for x=-2,-1,0,1,2. Then E(X) is",options:["1/15","1/10","1/3","2/3"],correct:3},
{q:"X has a Bernoulli distribution with mean 0.4. The variance of (2X-3) is",options:["0.24","0.48","0.6","0.96"],correct:3},
{q:"In 6 trials, X is binomial with 9P(X=4)=P(X=2). The probability of success is",options:["0.125","0.25","0.375","0.75"],correct:1},
{q:"A salesperson sells to 1 in 20 customers. The probability of selling to exactly 2 of the next 3 customers is",options:["57/20³","57/20²","19³/20³","57/20"],correct:0}
];

const MU12_DISCRETE_MATH = [
{q:"A binary operation on a set S is a function from",options:["S → S","(S×S) → S","S → (S×S)","(S×S) → (S×S)"],correct:1},
{q:"Subtraction is not a binary operation in",options:["R","Z","N","Q"],correct:2},
{q:"Which one of the following is a binary operation on N?",options:["Subtraction","Multiplication","Division","All the above"],correct:1},
{q:"In R, '*' is defined as follows. Which is NOT a binary operation on R?",options:["a∗b = min(a,b)","a∗b = max(a,b)","a∗b = a","a∗b = aᵇ"],correct:3},
{q:"The operation a∗b = ab/7 is not a binary operation on",options:["Q⁺","Z","R","C"],correct:1},
{q:"In Q, define a⊙b = a+b+ab. For what value of y is 3⊙(y⊙5) = 7?",options:["y = 2/3","y = -2/3","y = -3/2","y = 4"],correct:1},
{q:"If a∗b = √(a²+b²) on the reals, then * is",options:["commutative but not associative","associative but not commutative","both commutative and associative","neither commutative nor associative"],correct:2},
{q:"Which statement has truth value T?",options:["sin x is an even function","Every square matrix is non-singular","The product of a complex number and its conjugate is purely imaginary","√5 is an irrational number"],correct:3},
{q:"Which statement has truth value F?",options:["Chennai is in India or √2 is an integer","Chennai is in India or √2 is an irrational number","Chennai is in China or √2 is an integer","Chennai is in China or √2 is an irrational number"],correct:2},
{q:"If a compound statement involves 3 simple statements, the number of rows in the truth table is",options:["9","8","6","3"],correct:1},
{q:"Which is the inverse of the statement (p∨q) → (p∧q)?",options:["(p∧q) → (p∨q)","¬(p∨q) → (p∧q)","(¬p∨¬q) → (¬p∧¬q)","(¬p∧¬q) → (¬p∨¬q)"],correct:3},
{q:"Which is the contrapositive of (p∨q) → r?",options:["¬r → (¬p∧¬q)","¬r → (p∨q)","r → (p∧q)","p → (q∨r)"],correct:0},
{q:"The truth table of (p∧q)∨¬q is given as (a),(b),(c),(d) for TT,TF,FT,FF. Which one is true?",options:["T,T,T,T","T,F,T,T","T,T,F,T","T,F,F,F"],correct:2},
{q:"In the last column of the truth table for ¬(p∨¬q), the number of outcomes with truth value F are",options:["1","2","3","4"],correct:2},
{q:"Which is incorrect? For any two propositions p,q:",options:["¬(p∨q) ≡ ¬p∧¬q","¬(p∧q) ≡ ¬p∨¬q","¬(p∨q) ≡ ¬p∨¬q","¬(¬p) ≡ p"],correct:2},
{q:"Which is correct for the truth value of (p∧q)→¬p, for rows TT,TF,FT,FF?",options:["T,T,T,T","F,T,T,T","F,F,T,T","T,T,T,F"],correct:1},
{q:"The dual of ¬(p∨q) ∨ [p∨(p∧¬r)] is",options:["¬(p∧q) ∧ [p∨(p∧¬r)]","(p∧q) ∧ [p∧(p∨¬r)]","¬(p∧q) ∧ [p∧(p∧r)]","¬(p∧q) ∧ [p∧(p∨¬r)]"],correct:3},
{q:"The proposition p∧(¬p∨q) is",options:["a tautology","a contradiction","logically equivalent to p∧q","logically equivalent to p∨q"],correct:2},
{q:"Truth values of: (a) 4+2=5 and 6+3=9 (b) 3+2=5 and 6+1=7 (c) 4+5=9 and 1+2=4 (d) 3+2=5 and 4+7=11",options:["F,T,F,T","T,F,T,F","T,T,F,F","F,F,T,T"],correct:0},
{q:"Which one is NOT true?",options:["Negation of a negation of a statement is the statement itself.","If the last column of the truth table contains only T, it is a tautology.","If the last column contains only F, it is a contradiction.","If p and q are any two statements, then p↔q is a tautology."],correct:3}
];


const CHAPTERS_MATHS = [
  {id:101, name:"Applications of Matrices and Determinants", icon:"⎡⎤", questions:MU1_MATRICES, additionalQuestions:[]},
  {id:102, name:"Complex Numbers", icon:"ℂ", questions:MU2_COMPLEX, additionalQuestions:[]},
  {id:103, name:"Theory of Equations", icon:"x³", questions:MU3_EQUATIONS, additionalQuestions:[]},
  {id:104, name:"Inverse Trigonometric Functions", icon:"sin⁻¹", questions:MU4_INVERSE_TRIG, additionalQuestions:[]},
  {id:105, name:"Two Dimensional Analytical Geometry – II", icon:"◐", questions:MU5_ANALYTICAL_GEOMETRY, additionalQuestions:[]},
  {id:106, name:"Applications of Vector Algebra", icon:"a⃗", questions:MU6_VECTOR_ALGEBRA, additionalQuestions:[]},
  {id:107, name:"Applications of Differential Calculus", icon:"dy/dx", questions:MU7_DIFF_CALCULUS, additionalQuestions:[]},
  {id:108, name:"Differentials and Partial Derivatives", icon:"∂", questions:MU8_DIFFERENTIALS, additionalQuestions:[]},
  {id:109, name:"Applications of Integration", icon:"∫", questions:MU9_INTEGRATION, additionalQuestions:[]},
  {id:110, name:"Ordinary Differential Equations", icon:"ODE", questions:MU10_ODE, additionalQuestions:[]},
  {id:111, name:"Probability Distributions", icon:"P(X)", questions:MU11_PROBABILITY, additionalQuestions:[]},
  {id:112, name:"Discrete Mathematics", icon:"p∧q", questions:MU12_DISCRETE_MATH, additionalQuestions:[]}
];

/* ================= PHYSICS QUESTION BANK (12th Std, Book Back 1 Mark PDF) ================= */
const PH1_ELECTROSTATICS = [
{q:"Two identical point charges of magnitude -q are fixed as shown, with a third charge +q placed midway between them at P. If +q is displaced a small distance from P in the indicated directions, in which direction(s) will +q be stable?",options:["A1 and A2","B1 and B2","both directions","No stable direction"],correct:1,exp:"Displacing +q perpendicular to the line joining the two -q charges gives a restoring force back toward P, making those perpendicular directions the stable ones."},
{q:"Which charge configuration produces a uniform electric field?",options:["point charge","uniformly charged infinite line","uniformly charged infinite plane","uniformly charged spherical shell"],correct:2,exp:"An infinite uniformly charged plane produces a uniform electric field, independent of distance from it."},
{q:"What is the ratio of charges q1/q2 for a field line pattern where 11 field lines are linked with q1 and 25 with q2?",options:["1/5","25/11","5","11/25"],correct:3,exp:"The number of field lines is proportional to the enclosed charge, so q1/q2 equals the ratio of the field lines, 11/25."},
{q:"An electric dipole is placed at an alignment angle of 30° with an electric field of 2×10⁵ N C⁻¹. It experiences a torque of 8 N m. If the dipole length is 1 cm, the charge on the dipole is",options:["4 mC","8 mC","5 mC","7 mC"],correct:1,exp:"Using τ = pE sinθ with p = ql, solving gives the dipole charge q = τ/(El sinθ) = 8 mC."},
{q:"Four Gaussian surfaces are given with charges inside each. Rank the electric flux through each surface in increasing order.",options:["D < C < B < A","A < B = C < D","C < A = B < D","D > C > B > A"],correct:0,exp:"Electric flux through a closed surface depends only on the net enclosed charge (Gauss's law), so the surfaces are ranked by their enclosed charge from least to greatest."},
{q:"The total electric flux for a closed surface kept inside water (with charge q enclosed) is",options:["80q/ε0","q/40ε0","q/80ε0","q/160ε0"],correct:2,exp:"In a medium of dielectric constant K, Gauss's law gives flux = q/(Kε0); for water (K≈80), this becomes q/80ε0."},
{q:"Two identical conducting balls with positive charges q1 and q2, separated by distance r, are made to touch each other and then separated to the same distance. The force between them will be",options:["less than before","same as before","more than before","zero"],correct:2,exp:"After touching, the total charge redistributes equally between the identical spheres; since [(q1+q2)/2]² is generally greater than q1q2 for unequal charges, the resulting force is more than the original force."},
{q:"Rank the electrostatic potential energies for the given systems of charges (1: Q,-Q sep. by r; 2: -Q,-Q sep. by r; 3: -Q,-2Q sep. by r; 4: Q,-2Q sep. by 2r) in increasing order.",options:["1 = 4 < 2 < 3","2 = 4 < 3 < 1","2 = 3 < 1 < 4","3 < 1 < 2 < 4"],correct:0,exp:"Electrostatic potential energy U = kQ1Q2/r depends on the product of the charges and their separation; ranking the given configurations by this value gives 1 = 4 < 2 < 3."},
{q:"An electric field E⃗ = 10x î exists in a region of space. The potential difference V = V0 - VA, where V0 is the potential at the origin and VA is the potential at x = 2 m, is",options:["10 V","-20 V","+20 V","-10 V"],correct:2,exp:"Since E = -dV/dx, integrating E = 10x from x = 0 to x = 2 gives V0 - VA = 20 V."},
{q:"A thin conducting spherical shell of radius R has charge Q uniformly distributed on its surface. The correct plot for the electrostatic potential due to this shell is",options:["Plot (a)","Plot (b)","Plot (c)","Plot (d)"],correct:1,exp:"The potential inside a uniformly charged spherical shell is constant, equal to the surface value, and falls off as 1/r outside the shell."},
{q:"Two points A and B are maintained at potentials of 7 V and -4 V respectively. The work done in moving 50 electrons from A to B is",options:["8.80 × 10⁻¹⁷ J","-8.80 × 10⁻¹⁷ J","4.40 × 10⁻¹⁷ J","5.80 × 10⁻¹⁷ J"],correct:0,exp:"The work done in moving charge from A to B is W = ne(VA − VB) = 50 × 1.6×10⁻¹⁹ × 11 ≈ 8.80×10⁻¹⁷ J."},
{q:"If the voltage applied on a capacitor is increased from V to 2V, choose the correct conclusion.",options:["Q remains the same, C is doubled","Q is doubled, C is doubled","C remains same, Q doubled","Both Q and C remain same"],correct:2,exp:"Capacitance depends only on the geometry of the capacitor, so it stays the same when voltage changes; since Q = CV, doubling V doubles the charge Q."},
{q:"A parallel plate capacitor stores charge Q at voltage V. If the area and the distance between the plates are each doubled, which quantity will change?",options:["Capacitance","Charge","Voltage","Energy density"],correct:3,exp:"Since A and d both double, capacitance C = ε0A/d stays the same; but the electric field E = V/d halves, so the energy density (∝E²) is the only quantity that changes."},
{q:"Three capacitors are connected in a triangle. The equivalent capacitance between two of its points (each side having 1μF and 2μF capacitors as shown) is",options:["1 μF","2 μF","3 μF","1/4 μF"],correct:1,exp:"Combining the triangular network of 1 μF and 2 μF capacitors according to their series-parallel connections between the two points gives an equivalent capacitance of 2 μF."},
{q:"Two metallic spheres of radii 1 cm and 3 cm are given charges of -1×10⁻² C and 5×10⁻² C respectively. If connected by a conducting wire, the final charge on the bigger sphere is",options:["3 × 10⁻² C","4 × 10⁻² C","1 × 10⁻² C","2 × 10⁻² C"],correct:0,exp:"When connected, the total charge (4×10⁻² C) redistributes in the ratio of the radii, since Q ∝ r for spheres at the same potential; the bigger sphere (r = 3 cm) ends up with 3/4 of the total charge, i.e., 3×10⁻² C."}
];

const PH2_CURRENT_ELECTRICITY = [
{q:"A current-versus-voltage graph of an unknown conductor gives ΔV=4 at ΔI=2. The resistance of this conductor is",options:["2 ohm","4 ohm","8 ohm","1 ohm"],correct:0,exp:"Resistance R = ΔV/ΔI = 4/2 = 2 Ω, from the slope of the V-I graph."},
{q:"A wire of resistance 2 ohms per metre is bent to form a circle of radius 1 m. The equivalent resistance between its two diametrically opposite points, A and B, is",options:["π Ω","π/2 Ω","2π Ω","π/4 Ω"],correct:0,exp:"The circular wire of total resistance 4π Ω splits into two equal semicircular arcs of 2π Ω each, connected in parallel between the diametrically opposite points, giving an equivalent resistance of π Ω."},
{q:"A toaster operating at 240 V has a resistance of 120 Ω. Its power is",options:["400 W","2 W","480 W","240 W"],correct:2,exp:"Power P = V²/R = 240²/120 = 480 W."},
{q:"A carbon resistor of (47 ± 4.7) kΩ is to be marked with colour rings. The colour code sequence will be",options:["Yellow – Green – Violet – Gold","Yellow – Violet – Orange – Silver","Violet – Yellow – Orange – Silver","Green – Orange – Violet – Gold"],correct:1,exp:"47 kΩ corresponds to Yellow(4)-Violet(7)-Orange(×10³), and a ±10% tolerance (4.7 kΩ) is shown by a silver band."},
{q:"What is the value of resistance of a resistor with colour bands Brown-Black-Yellow-Gold?",options:["100 kΩ","10 kΩ","1 kΩ","1000 kΩ"],correct:0,exp:"Brown(1)-Black(0)-Yellow(×10⁴) gives 10×10⁴ = 100 kΩ, with gold indicating ±5% tolerance."},
{q:"Two wires A and B with circular cross section are made of the same material with equal lengths. If RA = 3RB, the ratio of radius of wire A to that of B is",options:["3","√3","1/√3","1/3"],correct:2,exp:"Since R ∝ 1/r² for wires of equal length and material, RA = 3RB gives rA/rB = 1/√3."},
{q:"A wire connected to a 230 V supply has power dissipation P1. If the wire is cut into two equal pieces and connected in parallel to the same supply, the power dissipation is P2. The ratio P2/P1 is",options:["1","2","3","4"],correct:3,exp:"Each half of the cut wire has resistance R/2; connecting them in parallel gives R/4, so the new power P2 = V²/(R/4) = 4P1, a ratio of 4."},
{q:"In India electricity is supplied at 220 V; in the USA at 110 V. If the resistance of a 60W bulb for use in India is R, the resistance of a 60W bulb for use in the USA will be",options:["R","2R","R/4","R/4 (matched to explanation)"],correct:3,exp:"Since R = V²/P for a fixed power rating, halving the voltage (220V to 110V) reduces the required resistance to R/4."},
{q:"A building has 15 bulbs of 40W, 5 bulbs of 100W, 5 fans of 80W and 1 heater of 1kW, with mains voltage 220V. The maximum capacity of the main fuse of the building will be",options:["14 A","8 A","10 A","12 A"],correct:3,exp:"Total power = (15×40)+(5×100)+(5×80)+1000 = 2500 W; current = P/V = 2500/220 ≈ 12 A."},
{q:"There is a current of 1.0 A in a circuit with resistors 3Ω, 2.5Ω and P connected in series across 9V. What is the resistance of P?",options:["1.5 Ω","2.5 Ω","3.5 Ω","4.5 Ω"],correct:2,exp:"Total resistance = V/I = 9/1 = 9 Ω; subtracting the known 3 Ω and 2.5 Ω leaves P = 3.5 Ω."},
{q:"What is the current drawn out from the battery, if three 15Ω equal resistors are connected in parallel across a 5V source?",options:["1 A","2 A","3 A","4 A"],correct:0,exp:"Three 15 Ω resistors in parallel give an equivalent resistance of 5 Ω, so the current drawn is I = V/R = 5/5 = 1 A."},
{q:"The temperature coefficient of resistance of a wire is 0.00125 per °C. At 20°C its resistance is 1 Ω. The resistance of the wire will be 2 Ω at",options:["800 °C","700 °C","850 °C","820 °C"],correct:3,exp:"Using R = R0[1+α(T−20)]: 2 = 1×[1+0.00125(T−20)] gives T = 820 °C."},
{q:"The internal resistance of a 2.1 V cell which gives a current of 0.2 A through a resistance of 10 Ω is",options:["0.2 Ω","0.5 Ω","0.8 Ω","1.0 Ω"],correct:1,exp:"From ε = I(R + r): 2.1 = 0.2(10 + r) gives internal resistance r = 0.5 Ω."},
{q:"A piece of copper and another of germanium are cooled from room temperature to 80 K. The resistance of",options:["each of them increases","each of them decreases","copper increases and germanium decreases","copper decreases and germanium increases"],correct:3,exp:"Cooling decreases the resistance of a metal like copper (fewer lattice vibrations) but increases the resistance of a semiconductor like germanium (fewer thermally generated charge carriers)."},
{q:"In Joule's heating law, when R and t are constant, if H is taken along the y axis and I² along the x axis, the graph is",options:["straight line","parabola","circle","ellipse"],correct:0,exp:"Since H = I²Rt with R and t constant, H is directly proportional to I², giving a straight line when H is plotted against I²."}
];

const PH3_MAGNETISM = [
{q:"The magnetic field at the centre O of a current loop made of two straight wires (X, Z) and a semicircular arc (Y), with current flowing clockwise, is",options:["μ0I/4r, into the page","μ0I/4r, out of the page","μ0I/2r, into the page","μ0I/2r, out of the page"],correct:0,exp:"The straight segments of the loop contribute no field at O; only the semicircular arc contributes B = μ0I/4r, directed into the page for the given current direction."},
{q:"An electron moves in a straight line inside a charged parallel plate capacitor of uniform charge density σ. The time taken by the electron to cross the capacitor undeflected when the plates are under a constant magnetic field of induction B is",options:["ε0(e l B)/σ","ε0(l B)/(σ l)","ε0(l B)/(e σ)","ε0(l B)/σ"],correct:3,exp:"For the electron to move undeflected, the electric and magnetic forces balance: eE = evB, giving v = E/B = σ/(ε0B); the crossing time is t = l/v = ε0lB/σ."},
{q:"A particle having mass m and charge q is accelerated through a potential difference V. Find the force experienced when it is kept under a perpendicular magnetic field B.",options:["√(2q³BV/m)","√(q³B²V/2m)","√(2q³B²V/m)","√(2q³BV/m³)"],correct:2,exp:"The particle's speed after acceleration through V is v = √(2qV/m); the magnetic force F = qvB = √(2q³B²V/m)."},
{q:"A circular coil of radius 5 cm and 50 turns carries a current of 3 ampere. The magnetic dipole moment of the coil is nearly",options:["1.0 A m²","1.2 A m²","0.5 A m²","0.8 A m²"],correct:1,exp:"Magnetic moment m = NIA = 50 × 3 × π(0.05)² ≈ 1.2 A·m²."},
{q:"A thin insulated wire forms a plane spiral of N = 100 tight turns carrying a current I = 8 mA. The radii of the inside and outside turns are a = 50 mm and b = 100 mm. The magnetic induction at the centre of the spiral is",options:["5 μT","7 μT","8 μT","10 μT"],correct:1,exp:"Using the formula for the field at the centre of a multi-turn spiral, B = μ0NI ln(b/a)/[2(b−a)], gives approximately 7 μT."},
{q:"Three wires of equal length are bent into a circle, a semi-circle, and a square. Placed in a uniform magnetic field with the same current, which loop configuration will experience the greatest torque?",options:["Circle","Semi-circle","Square","All of them"],correct:0,exp:"For a fixed wire length, a circular loop encloses the largest area of the three shapes, and since torque τ = NIA×B is proportional to enclosed area, the circular loop feels the greatest torque."},
{q:"Two identical coils, each with N turns and radius R, are placed coaxially at a distance R. If I is the current in each in the same direction, the magnetic field at a point P at distance R/2 from the centre of each coil is",options:["8Nμ0I/√5R","8Nμ0I/(5^(3/2)R)","8Nμ0I/5R","4Nμ0I/√5R"],correct:1,exp:"Superposing the axial fields of the two coaxial coils at the point R/2 from each centre, using B = μ0NIR²/2(R²+x²)^(3/2) for each and adding, gives B = 8Nμ0I/(5^(3/2)R)."},
{q:"A wire of length l carrying a current I along the Y direction is kept in a magnetic field B⃗ = (β/√3)(î+ĵ+k̂)T. The magnitude of Lorentz force acting on the wire is",options:["√(2/3) Ilβ","√(1/3) Ilβ","√2 Ilβ","√(1/2) Ilβ"],correct:0,exp:"Using F = IL×B with L = lĵ and B = (β/√3)(î+ĵ+k̂), the cross product gives a force of magnitude √(2/3) Ilβ."},
{q:"A bar magnet of length l and magnetic moment pm is bent into the form of an arc. The new magnetic dipole moment will be",options:["pm","(3/π)pm","(2/π)pm","pm/2"],correct:1,exp:"Bending the magnet into an arc changes the effective separation between its poles; working through this geometry gives a new dipole moment of (3/π)pm."},
{q:"A non-conducting charged ring carrying a charge of q, mass m and radius r is rotated about its axis with constant angular speed ω. Find the ratio of its magnetic moment to angular momentum.",options:["q/m","2q/m","q/2m","q/4m"],correct:2,exp:"The ring's magnetic moment is m = qωr²/2 and its angular momentum is L = mr²ω (moment of inertia mr² for a ring), giving the ratio m/L = q/2m."},
{q:"The BH curve for a ferromagnetic material is shown; the material is placed inside a long solenoid with 1000 turns/cm. The current needed to demagnetize the ferromagnet completely is",options:["1.00 mA","1.25 mA","1.50 mA","1.75 mA"],correct:2,exp:"The demagnetizing current corresponds to the coercivity read off the given B-H curve, using I = Hc/n with n = 1000 turns/cm, giving I ≈ 1.50 mA."},
{q:"Two short bar magnets have magnetic moments 1.20 Am² and 1.00 Am² respectively, kept parallel on a table with north poles pointing south, separated by 20.0 cm on a common magnetic equator. If the horizontal component of Earth's field is 3.6×10⁻⁵ Wb m⁻², the resultant horizontal magnetic induction at the midpoint is",options:["3.60 × 10⁻⁵ Wb m⁻²","3.5 × 10⁻⁵ Wb m⁻²","2.56 × 10⁻⁴ Wb m⁻²","2.2 × 10⁻⁴ Wb m⁻²"],correct:2,exp:"At the midpoint, the fields due to the two magnets (in the given orientation) combine with the horizontal component of Earth's field using the axial/equatorial field formulas, giving a resultant of 2.56×10⁻⁴ Wb m⁻²."},
{q:"The vertical component of Earth's magnetic field at a place is equal to the horizontal component. What is the value of the angle of dip at this place?",options:["30°","45°","60°","90°"],correct:1,exp:"The angle of dip satisfies tanδ = V/H; since V = H here, tanδ = 1, giving δ = 45°."},
{q:"A flat dielectric disc of radius R carries an excess charge with surface charge density σ, and rotates about a perpendicular axis with angular velocity ω. Find the magnitude of the torque on the disc if placed in a uniform magnetic field B directed perpendicular to the axis of rotation.",options:["(1/4)σωπR","(1/4)σωπBR²","(1/4)σωπBR³","(1/4)σωπBR⁴"],correct:3,exp:"Integrating the torque contributions from each charge element of the rotating disc in the magnetic field gives a total torque of (1/4)σωπBR⁴."},
{q:"The potential energy of a magnetic dipole with dipole moment pm = (-0.5î + 0.4ĵ) Am² kept in a uniform magnetic field B = 0.2î T is",options:["-0.1 J","-0.8 J","0.1 J","0.8 J"],correct:2,exp:"U = −pm·B = −[(−0.5)(0.2) + (0.4)(0)] = 0.1 J."}
];
const PH4_EMI_AC = [
{q:"An electron moves on a straight line path XY, with a coil abcd adjacent to its path. What will be the direction of current, if any, induced in the coil?",options:["The current will reverse direction as the electron goes past the coil","No current will be induced","abcd","adcb"],correct:0,exp:"As the electron approaches then moves away from the coil, the flux through it first increases then decreases, so the induced current reverses direction as the electron passes."},
{q:"A thin semi-circular conducting ring (PQR) of radius r is falling with its plane vertical in a horizontal magnetic field B. The potential difference developed across the ring when its speed is v is",options:["Zero","Bvπr²/2, P at higher potential","πrBv, R at higher potential","2rBv, R at higher potential"],correct:3,exp:"For motional EMF only the effective straight-line separation between the ends matters; for the semicircular ring that's the diameter 2r, giving EMF = 2rBv."},
{q:"The flux linked with a coil at any instant t is given by φB = 10t² - 50t + 250. The induced emf at t = 3 s is",options:["-190 V","-10 V","10 V","190 V"],correct:1,exp:"EMF = −dφ/dt = −(20t−50); at t=3s, this gives −10 V."},
{q:"When the current changes from +2A to -2A in 0.05 s, an emf of 8 V is induced in a coil. The co-efficient of self-induction of the coil is",options:["0.2 H","0.4 H","0.8 H","0.1 H"],correct:3,exp:"EMF = L(ΔI/Δt); with ΔI = 4A over Δt = 0.05s, 8 = L×80, giving L = 0.1 H."},
{q:"The current i in a coil varies with time as a trapezoidal ramp (rising linearly, then constant, then falling). The variation of induced emf with time would be",options:["Graph (a) — step-like, constant segments","Graph (b)","Graph (c)","Graph (d)"],correct:0,exp:"Since EMF = −L(di/dt), a linearly rising or falling current gives a constant EMF and a constant current gives zero EMF, producing the step-like graph."},
{q:"A circular coil with a cross-sectional area of 4 cm² has 10 turns, placed at the centre of a long solenoid with 15 turns/cm and cross-sectional area 10 cm². What is their mutual inductance?",options:["7.54 μH","8.54 μH","9.54 μH","10.54 μH"],correct:0,exp:"Mutual inductance M = μ0 × n(solenoid) × N(coil) × A(coil) = 4π×10⁻⁷ × 1500 × 10 × 4×10⁻⁴ ≈ 7.54 μH."},
{q:"In a transformer, the number of turns in the primary and secondary are 410 and 1230 respectively. If the current in the primary is 6A, that in the secondary coil is",options:["2 A","18 A","12 A","1 A"],correct:0,exp:"Since NpIp = NsIs, Is = Ip×Np/Ns = 6×410/1230 = 2 A."},
{q:"A step-down transformer reduces the supply voltage from 220 V to 11 V and increases the current from 6 A to 100 A. Its efficiency is",options:["1.2","0.83","0.12","0.9"],correct:1,exp:"Efficiency = Pout/Pin = (11×100)/(220×6) ≈ 0.83."},
{q:"In an RLC series circuit with an AC source, when L is removed the phase difference between voltage and current is π/3. If C is removed instead, the phase difference is again π/3. The power factor of the circuit is",options:["1/2","1/√2","1","√3/2"],correct:2,exp:"Removing L gives tanφ = Xc/R = tan(π/3); removing C gives tanφ = XL/R = tan(π/3); so XL = XC, meaning the circuit is at resonance and its power factor is 1."},
{q:"In a series RL circuit, the resistance and inductive reactance are the same. The phase difference between voltage and current is",options:["π/4","π/2","π/6","zero"],correct:0,exp:"tanφ = XL/R = 1 since R = XL, so φ = π/4."},
{q:"In a series resonant RLC circuit, the voltage across the 100 Ω resistor is 40 V. The resonant frequency ω is 250 rad/s. If C is 4 μF, the voltage across L is",options:["600 V","4000 V","400 V","1 V"],correct:2,exp:"At resonance I = VR/R = 40/100 = 0.4 A; XL = XC = 1/(ωC) = 1000 Ω, so VL = I×XL = 400 V."},
{q:"An inductor 20 mH, a capacitor 50 μF and a resistor 40 Ω are connected in series across a source of emf V = 10 sin 340t. The power loss in the AC circuit is",options:["0.76 W","0.89 W","0.46 W","0.67 W"],correct:2,exp:"With XL=ωL≈6.8Ω and XC=1/(ωC)≈58.8Ω, Z=√(R²+(XL−XC)²)≈65.6Ω; Irms≈0.108A, giving power loss P = Irms²R ≈ 0.46 W."},
{q:"The instantaneous values of alternating current and voltage in a circuit are i = (1/√2)sin(100πt), v = (1/√2)sin(100πt + π/3). The average power in watts consumed in the circuit is",options:["1/4","√3/4","1/2","1/8"],correct:3,exp:"Average power = ½V0I0cosφ = ½×(1/√2)×(1/√2)×cos60° = 1/8 W."},
{q:"In an oscillating LC circuit, the maximum charge on the capacitor is Q. The charge on the capacitor when the energy is stored equally between the electric and magnetic fields is",options:["Q/2","Q/√3","Q/√2","Q"],correct:2,exp:"Equal sharing of energy means the capacitor's stored energy is half the maximum, q²/2C = (Q²/2C)/2, giving q = Q/√2."},
{q:"A (20/π²)H inductor is connected to a capacitor of capacitance C. The value of C to impart maximum power at 50 Hz is",options:["50 μF","0.5 μF","500 μF","5 μF"],correct:3,exp:"At resonance ω² = 1/(LC); solving for C with ω=100π rad/s and L=20/π² H gives C = 5 μF."}
];

const PH5_EM_WAVES = [
{q:"The dimension of 1/(μ0ε0) is",options:["[L T⁻¹]","[L² T⁻²]","[L⁻¹ T]","[L⁻² T²]"],correct:1,exp:"1/(μ0ε0) equals c², which has dimensions of [L²T⁻²]."},
{q:"If the amplitude of the magnetic field is 3 × 10⁻⁶ T, the amplitude of the electric field for the electromagnetic wave is",options:["100 V m⁻¹","300 V m⁻¹","600 V m⁻¹","900 V m⁻¹"],correct:3,exp:"E0 = cB0 = 3×10⁸ × 3×10⁻⁶ = 900 V/m."},
{q:"Which of the following electromagnetic radiations is used for viewing objects through fog?",options:["microwave","gamma rays","X-rays","infrared"],correct:3,exp:"Infrared radiation scatters less through fog than visible light, which is why it's used for viewing through fog."},
{q:"Which of the following is false for electromagnetic waves?",options:["transverse","non-mechanical waves","longitudinal","produced by accelerating charges"],correct:2,exp:"Electromagnetic waves are transverse, not longitudinal, so this statement is false."},
{q:"Consider an oscillator with a charged particle oscillating about its mean position with a frequency of 300 MHz. The wavelength of electromagnetic waves produced is",options:["1 m","10 m","100 m","1000 m"],correct:0,exp:"λ = c/f = 3×10⁸/3×10⁸ = 1 m."},
{q:"The electric and magnetic fields associated with an electromagnetic wave propagating along the negative X axis can be represented by",options:["E=E0î and B=B0k̂","E=E0k̂ and B=B0ĵ","E=E0î and B=B0ĵ","E=E0ĵ and B=B0î"],correct:1,exp:"For propagation along −x, the direction of E×B must point along −x̂; E=E0k̂ and B=B0ĵ satisfy this since k̂×ĵ=−î."},
{q:"In an electromagnetic wave travelling in free space, the rms value of the electric field is 3 V m⁻¹. The peak value of the magnetic field is",options:["1.414 × 10⁻⁸ T","1.0 × 10⁻⁸ T","2.828 × 10⁻⁸ T","2.0 × 10⁻⁸ T"],correct:0,exp:"Brms = Erms/c = 3/(3×10⁸) = 1×10⁻⁸ T; the peak value is Brms×√2 ≈ 1.414×10⁻⁸ T."},
{q:"An e.m. wave propagates with velocity v⃗ = vî. If the oscillating electric field of this wave is along the +y axis, the direction of the oscillating magnetic field is along",options:["-y direction","-x direction","+z direction","-z direction"],correct:2,exp:"Since the propagation direction is along E×B, with E along +y and propagation along +x, B must be along +z (as ĵ×k̂=î)."},
{q:"If the magnetic monopole exists, then which of Maxwell's equations needs to be modified?",options:["∮E⃗·dA⃗ = Qenclosed/ε0","∮B⃗·dA⃗ = 0","∮B⃗·dl⃗ = μ0ic + μ0ε0 d/dt∮E⃗·dA⃗","∮E⃗·dl⃗ = -d/dt∮φB"],correct:1,exp:"Gauss's law for magnetism, ∮B·dA=0, assumes no magnetic monopoles exist; this is the equation that would need modification if monopoles were found."},
{q:"Fraunhofer lines are an example of ……. spectrum.",options:["line emission","line absorption","band emission","band absorption"],correct:1,exp:"Fraunhofer lines are dark absorption lines in the solar spectrum, making them an example of a line absorption spectrum."},
{q:"Which of the following is an electromagnetic wave?",options:["α-rays","β-rays","γ-rays","all of them"],correct:2,exp:"Gamma rays are electromagnetic radiation, unlike alpha and beta rays, which are streams of particles."},
{q:"Which one of these is used to produce a propagating electromagnetic wave?",options:["an accelerating charge","a charge moving with constant velocity","a stationary charge","an uncharged particle"],correct:0,exp:"Electromagnetic waves are produced by accelerating (oscillating) charges."},
{q:"If E = E0 Sin[10⁶x - ωt] is the electric field of a plane electromagnetic wave, the value of ω is",options:["0.3 × 10⁻¹⁴ rad s⁻¹","3 × 10⁻¹⁴ rad s⁻¹","0.3 × 10¹⁴ rad s⁻¹","3 × 10¹⁴ rad s⁻¹"],correct:3,exp:"Using c=ω/k with k=10⁶ m⁻¹, ω = ck = 3×10⁸×10⁶ = 3×10¹⁴ rad/s."},
{q:"Which of the following is NOT true for electromagnetic waves?",options:["it transports energy","it transports momentum","it transports angular momentum","in vacuum, it travels with different speeds which depend on their frequency"],correct:3,exp:"In vacuum, all electromagnetic waves travel at the same speed c regardless of frequency, so this statement is false."},
{q:"The electric and magnetic fields of an electromagnetic wave are",options:["in phase and perpendicular to each other","out of phase and not perpendicular to each other","in phase and not perpendicular to each other","out of phase and perpendicular to each other"],correct:0,exp:"In an electromagnetic wave, the electric and magnetic fields oscillate in phase and are mutually perpendicular, as well as perpendicular to the direction of propagation."}
];

const PH6_RAY_OPTICS = [
{q:"The speed of light in an isotropic medium depends on",options:["its intensity","its wavelength","the nature of propagation","the motion of the source w.r.t medium"],correct:1,exp:"In a dispersive isotropic medium, the refractive index (and hence speed) of light depends on its wavelength."},
{q:"A rod of length 10 cm lies along the principal axis of a concave mirror of focal length 10 cm, with its end closer to the pole 20 cm away from the mirror. The length of the image is",options:["2.5 cm","5 cm","10 cm","15 cm"],correct:1,exp:"Using the mirror formula for the two ends of the rod (u=20cm giving v=20cm, and u=30cm giving v=15cm), the image length is |20−15| = 5 cm."},
{q:"An object is placed in front of a convex mirror of focal length f. The maximum and minimum distance of the object from the mirror such that the image formed is real and magnified is",options:["2f and ∞","c and ∞","f and O","None of these"],correct:3,exp:"A convex mirror always forms a virtual, diminished image of a real object, so a real, magnified image is never possible."},
{q:"For light incident from air on a slab of refractive index 2, the maximum possible angle of refraction is",options:["30°","45°","60°","90°"],correct:0,exp:"The maximum refraction angle occurs at grazing incidence (90°); using sin r = sin90°/n = 1/2 gives r = 30°."},
{q:"If the velocity and wavelength of light in air are va and λa, and in water are vw and λw, then the refractive index of water is",options:["vw/va","va/vw","λw/λa","vaλa/(vwλw)"],correct:1,exp:"Refractive index n = (speed in medium1)/(speed in medium2); here the refractive index of water relative to air is va/vw."},
{q:"Stars twinkle due to",options:["reflection","total internal reflection","refraction","polarisation"],correct:2,exp:"Stars twinkle due to continuous refraction of starlight through layers of air with varying density and temperature in the atmosphere."},
{q:"When a biconvex lens of glass with refractive index 1.47 is dipped in a liquid, it acts as a plane sheet of glass. This implies that the liquid must have a refractive index",options:["less than one","less than that of glass","greater than that of glass","equal to that of glass"],correct:3,exp:"A lens loses its converging/diverging power and acts like a plane sheet when immersed in a liquid with the same refractive index as the lens material."},
{q:"The radius of curvature of the curved surface of a thin planoconvex lens is 10 cm, refractive index 1.5. If the plane surface is silvered, the focal length will be",options:["5 cm","10 cm","15 cm","20 cm"],correct:3,exp:"For a silvered plano-convex lens, the equivalent focal length is found from 1/F = 2/f(lens) + 1/f(mirror); working through the given data (R=10cm, n=1.5) gives F = 20 cm."},
{q:"An air bubble in a glass slab of refractive index 1.5 is 5 cm deep viewed from one surface and 3 cm deep viewed from the opposite face. The thickness of the slab is",options:["8 cm","10 cm","12 cm","16 cm"],correct:2,exp:"If the bubble is at real distances d1 and d2 from the two faces, the apparent depths are d1/n and d2/n; using apparent depths of 5cm and 3cm with n=1.5 gives the slab thickness d1+d2 = n(5+3) = 12 cm."},
{q:"A ray of light travelling in a transparent medium of refractive index n falls on a surface separating the medium from air at an angle of incidence of 45°. The ray can undergo total internal reflection for which of the following n?",options:["n = 1.25","n = 1.33","n = 1.4","n = 1.5"],correct:3,exp:"Total internal reflection requires the incidence angle to exceed the critical angle C, where sinC=1/n; for TIR at 45° we need n>1/sin45°≈1.414, satisfied only by n=1.5 among the choices."}
];
const PH7_WAVE_OPTICS = [
{q:"A plane glass is placed over various coloured letters (violet, green, yellow, red). The letter which appears to be raised more is",options:["red","yellow","green","violet"],correct:3,exp:"Violet light has the highest refractive index due to normal dispersion, so it experiences the greatest apparent upward shift under the glass plate."},
{q:"Two point white dots are 1 mm apart on a black paper, viewed by an eye of pupil diameter 3 mm. The maximum distance at which these dots can be resolved by the eye is (λ = 500 nm)",options:["1 m","5 m","3 m","6 m"],correct:1,exp:"Using the Rayleigh resolving criterion θ=1.22λ/D, with the same angle also equal to d/L, solving gives L = dD/(1.22λ) ≈ 5 m."},
{q:"In a Young's double-slit experiment, the slit separation is doubled. To maintain the same fringe spacing on the screen, the screen-to-slit distance D must be changed to",options:["2D","D/2","√2 D","D/√2"],correct:0,exp:"Since fringe width β = λD/d, doubling the slit separation d requires doubling D to keep β unchanged."},
{q:"Two coherent monochromatic light beams of intensities I and 4I are superposed. The maximum and minimum possible intensities in the resulting beam are",options:["5I and I","5I and 3I","9I and I","9I and 3I"],correct:2,exp:"Imax=(√I+√4I)² = 9I and Imin=(√I−√4I)² = I."},
{q:"When light is incident on a soap film of thickness 5×10⁻⁵ cm, the wavelength of light reflected maximum in the visible region is 5320 Å. The refractive index of the film is",options:["1.22","1.33","1.51","1.83"],correct:1,exp:"Using the thin-film condition for constructive interference in reflection, 2μt=(m+½)λ, with t=5×10⁻⁵cm and λ=5320 Å, solving gives μ≈1.33."},
{q:"The first diffraction minimum due to a single slit of width 1.0×10⁻⁵ cm is at 30°. The wavelength of light used is",options:["400 Å","500 Å","600 Å","700 Å"],correct:1,exp:"First minimum condition for single-slit diffraction: a sinθ=λ; with a=1.0×10⁻⁵cm and θ=30°, λ=a sinθ=500 Å."},
{q:"A ray of light strikes a glass plate at an angle of 60°. If the reflected and refracted rays are perpendicular to each other, the refractive index of the glass is",options:["√3","3/2","√(3/2)","2"],correct:0,exp:"When the reflected and refracted rays are perpendicular, the incidence angle is the Brewster angle, where n=tanθB=tan60°=√3."},
{q:"One of Young's double slits is covered with a glass plate. The position of the central maximum will",options:["get shifted downwards","get shifted upwards","remain the same","data insufficient to conclude"],correct:1,exp:"Introducing a glass plate over one slit adds extra optical path in that arm, shifting the central bright fringe towards the covered slit."},
{q:"Light transmitted by a Nicol prism is",options:["partially polarised","unpolarised","plane polarised","elliptically polarised"],correct:2,exp:"A Nicol prism transmits only one polarization component, producing plane polarised light."},
{q:"The transverse nature of light is shown in",options:["interference","diffraction","scattering","polarisation"],correct:3,exp:"Polarisation can only occur for transverse waves, so observing it directly demonstrates the transverse nature of light."}
];

const PH8_DUAL_NATURE = [
{q:"The wavelength λe of an electron and λp of a photon of the same energy E are related by",options:["λp ∝ λe","λp ∝ √λe","λp ∝ 1/√λe","λp ∝ λe²"],correct:3,exp:"For a photon, λp=hc/E; for an electron of the same energy, λe=h/√(2mE), so E∝1/λe². Substituting gives λp∝λe²."},
{q:"In an electron microscope, electrons are accelerated by 14 kV. If the voltage is changed to 224 kV, the de Broglie wavelength of the electrons would",options:["increase by 2 times","decrease by 2 times","decrease by 4 times","increase by 4 times"],correct:2,exp:"Since λ∝1/√V, and V increases by a factor of 224/14=16, the wavelength decreases by √16=4 times."},
{q:"A wave associated with a moving particle of mass 3 × 10⁻⁶ g has the same wavelength as an electron moving at 6 × 10⁶ m s⁻¹. The velocity of the particle is",options:["1.82 × 10⁻¹⁸ m s⁻¹","9 × 10⁻² m s⁻¹","3 × 10⁻³¹ m s⁻¹","1.82 × 10⁻¹⁵ m s⁻¹"],correct:3,exp:"Equal de Broglie wavelengths mean equal momenta: mparticle·vparticle = melectron·velectron; solving with the given values gives vparticle ≈1.82×10⁻¹⁵ m/s."},
{q:"When a metallic surface illuminated with wavelength λ has stopping potential V, and with wavelength 2λ has stopping potential V/4, the threshold wavelength for the surface is",options:["4λ","5λ","5λ/2","3λ"],correct:3,exp:"Combining the photoelectric equations for λ and 2λ (eV=hc/λ−φ and eV/4=hc/2λ−φ) gives φ=hc/3λ, so the threshold wavelength λ0=hc/φ=3λ."},
{q:"If light of wavelength 330 nm is incident on a metal with work function 3.55 eV, electrons are emitted. The wavelength of the wave associated with the emitted electron is",options:["< 2.75 × 10⁻⁹ m","≥ 2.75 × 10⁻⁹ m","≤ 2.75 × 10⁻¹² m","< 2.5 × 10⁻¹⁰ m"],correct:0,exp:"Photon energy = 1240/330 ≈ 3.76 eV; kinetic energy of the electron = 3.76−3.55 ≈ 0.21 eV; using λ=h/√(2mKE) gives a de Broglie wavelength just under 2.75×10⁻⁹ m."},
{q:"A photoelectric surface illuminated successively by wavelength λ and λ/2 gives a maximum kinetic energy in the second case 3 times that of the first case. The work function of the material is",options:["hc/λ","2hc/λ","hc/3λ","hc/2λ"],correct:3,exp:"From KE(λ/2)=3×KE(λ): 2hc/λ−φ=3(hc/λ−φ), which gives φ=hc/2λ."},
{q:"In photoelectric emission, a radiation whose frequency is 4 times the threshold frequency of a metal is incident on it. The maximum possible velocity of the emitted electron will be",options:["√(hν0/m)","√(6hν0/m)","2√(hν0/m)","√(hν0/2m)"],correct:1,exp:"KE=h(4ν0−ν0)=3hν0=½mv², giving v=√(6hν0/m)."},
{q:"Two radiations with photon energies 0.9 eV and 3.3 eV fall successively on a metallic surface with work function 0.6 eV. The ratio of maximum speeds of emitted electrons in the two cases will be",options:["1:4","1:3","1:1","1:9"],correct:1,exp:"KE1=0.9−0.6=0.3eV, KE2=3.3−0.6=2.7eV; since v∝√KE, the ratio v1:v2=√(0.3/2.7)=1:3."},
{q:"A light source of wavelength 520 nm emits 1.04 × 10¹⁵ photons per second, while a second source of 460 nm produces 1.38 × 10¹⁵ photons per second. The ratio of power of the second source to the first is",options:["1.00","1.02","1.5","0.98"],correct:2,exp:"Power = (photon rate)×(hc/λ); the ratio P2/P1 = (N2λ1)/(N1λ2) = (1.38×520)/(1.04×460) ≈ 1.5."},
{q:"If the mean wavelength of light from the sun is 550 nm and its mean power is 3.8 × 10²⁶ W, the average number of photons received by the human eye per second from sunlight is of the order of",options:["10⁴⁵","10⁴²","10⁵⁴","10⁵¹"],correct:0,exp:"The number of photons per second equals the sun's total power divided by the energy of one photon: N=P/(hc/λ)=3.8×10²⁶/(3.6×10⁻¹⁹), which is of order 10⁴⁵."},
{q:"The threshold wavelength for a metal surface whose photoelectric work function is 3.313 eV is",options:["4125 Å","3750 Å","6000 Å","20625 Å"],correct:1,exp:"λ0=hc/φ=1240 eV·nm/3.313 eV≈374 nm=3750 Å."},
{q:"A light of wavelength 500 nm is incident on a sensitive metal plate of photoelectric work function 1.235 eV. The kinetic energy of the photoelectrons emitted is",options:["0.58 eV","2.48 eV","1.24 eV","1.16 eV"],correct:2,exp:"Photon energy=1240/500=2.48eV; KE=2.48−1.235≈1.24eV."},
{q:"Photons of wavelength λ are incident on a metal. The most energetic electrons ejected are bent into a circular arc of radius R by a perpendicular magnetic field B. The work function of the metal is",options:["hc/λ - me + e²B²R²/2me","hc/λ + 2me[eBR/2me]²","hc/λ - mec² - e²B²R²/2me","hc/λ - 2me[eBR/2me]²"],correct:3,exp:"The photoelectron's momentum from its circular path is p=eBR, so KE=p²/2me=(eBR)²/2me; using Einstein's photoelectric equation, φ=hc/λ−KE=hc/λ−2me[eBR/2me]²."},
{q:"The work functions for metals A, B and C are 1.92 eV, 2.0 eV and 5.0 eV respectively. The metal(s) which will emit photoelectrons for radiation of wavelength 4100 Å is/are",options:["A only","both A and B","all these metals","none"],correct:1,exp:"Photon energy at 4100 Å ≈1240/410≈3.02 eV, which exceeds the work functions of A(1.92eV) and B(2.0eV) but not C(5.0eV), so both A and B emit photoelectrons."},
{q:"Emission of electrons by the absorption of heat energy is called ……… emission.",options:["photoelectric","field","thermionic","secondary"],correct:2,exp:"Emission of electrons due to absorption of heat energy is called thermionic emission."}
];

const PH9_ATOMIC_NUCLEAR = [
{q:"Suppose an alpha particle accelerated by a potential of V volt collides with a nucleus of atomic number Z. The distance of closest approach of the alpha particle is",options:["14.4 (Z/V) Å","14.4 (V/Z) Å","1.44 (Z/V) Å","1.44 (Z/V) Å (alt.)"],correct:0,exp:"At closest approach all kinetic energy converts to electrostatic potential energy, giving the distance of closest approach as 14.4(Z/V) Å."},
{q:"In a hydrogen atom, the electron revolving in the fourth orbit has angular momentum equal to",options:["h","h/π","4h/π","2h/π"],correct:3,exp:"Angular momentum in the nth Bohr orbit is nh/2π; for n=4, this is 4h/2π = 2h/π."},
{q:"The atomic number of a H-like atom with ionization potential 122.4 V for n=1 is",options:["1","2","3","4"],correct:2,exp:"Ionization energy scales as Z²×13.6 eV; setting Z²×13.6=122.4 gives Z²=9, so Z=3."},
{q:"The ratio of radius between the first three orbits of a hydrogen atom is",options:["1:2:3","2:4:6","1:4:9","1:3:5"],correct:2,exp:"Bohr orbit radius scales as n², so the first three orbits are in the ratio 1:4:9."},
{q:"The charge of cathode ray particles is",options:["positive","negative","neutral","not defined"],correct:1,exp:"Cathode rays consist of electrons, which carry a negative charge."},
{q:"In J.J. Thomson's e/m experiment, a beam of electrons is replaced by muons (same charge as electrons but 208 times the mass). The no-deflection condition is achieved only if",options:["B is increased by 208 times","B is decreased by 208 times","B is increased by 14.4 times","B is decreased by 14.4 times"],correct:2,exp:"Since v=√(2eVacc/m), the 208-times heavier muon has a speed smaller by √208≈14.4; to keep the balance condition v=E/B with the same E, B must be increased by about 14.4 times."},
{q:"The ratio of the wavelengths of radiation emitted for the transition from n=2 to n=1 in Li++, He+ and H is",options:["1: 2: 3","1: 4: 9","3:2:1","4: 9: 36"],correct:3,exp:"Transition energy scales as Z², so wavelength ∝1/Z²; for Z=3(Li++), 2(He+), 1(H), the wavelength ratio works out to 4:9:36."},
{q:"The electric potential of an electron is given by V = V0 ln(r/r0), where r0 is a constant. If the Bohr atom model is valid, the variation of the radius of the nth orbit rn with the principal quantum number n is",options:["rn ∝ 1/n","rn ∝ n","rn ∝ 1/n²","rn ∝ n²"],correct:1,exp:"The potential V=V0ln(r/r0) gives a force of constant magnitude eV0/r, making the orbital speed independent of r; combined with Bohr's quantization mvr=nh/2π, this makes r directly proportional to n."},
{q:"If the nuclear radius of ²⁷Al is 3.6 Fermi, the approximate nuclear radius of ⁶⁴Cu in Fermi is",options:["2.4","1.2","4.8","3.6"],correct:2,exp:"Nuclear radius R∝A^(1/3); R(Cu)=R(Al)×(64/27)^(1/3)=3.6×(4/3)=4.8 Fermi."},
{q:"The nucleus is approximately spherical in shape. The surface area of a nucleus with mass number A varies as",options:["A^(2/3)","A^(4/3)","A^(1/3)","A^(5/3)"],correct:0,exp:"Since nuclear radius R∝A^(1/3), the surface area ∝R²∝A^(2/3)."},
{q:"The mass of a ⁷Li nucleus is 0.042 u less than the sum of masses of its nucleons. The binding energy per nucleon of ⁷Li is",options:["4 MeV","5.6 MeV","3.9 MeV","23 MeV"],correct:1,exp:"Binding energy = Δm×c² = 0.042×931.5 ≈39.1 MeV; per nucleon (A=7), this is ≈5.6 MeV."},
{q:"Mp and Mn denote the masses of the proton and neutron. A nucleus of binding energy B contains Z protons and N neutrons. The mass M(N,Z) of the nucleus is given by (c = speed of light)",options:["M(N,Z) = NMn + ZMp - Bc²","M(N,Z) = NMn + ZMp + Bc²","M(N,Z) = NMn + ZMp - B/c²","M(N,Z) = NMn + ZMp + B/c²"],correct:2,exp:"The nucleus is lighter than its separated nucleons by the mass-equivalent of its binding energy, so M(N,Z)=NMn+ZMp−B/c²."},
{q:"A radioactive nucleus (initial mass number A, atomic number Z) emits two α-particles and 2 positrons. The ratio of the number of neutrons to protons in the final nucleus will be",options:["(A-Z-4)/(Z-2)","(A-Z-2)/(Z-6)","(A-Z-4)/(Z-6)","(A-Z-12)/(Z-4)"],correct:1,exp:"Two alpha emissions reduce Z by 4 and neutrons by 4; two positron emissions each convert a proton to a neutron, reducing protons by a further 2 and increasing neutrons by 2, giving a final N/Z of (A−Z−2)/(Z−6)."},
{q:"The half-life of radioactive element A is the same as the mean life of element B. Initially both have the same number of atoms. Then",options:["A and B have the same decay rate initially","A and B decay at the same rate always","B will decay at a faster rate than A","A will decay at a faster rate than B"],correct:2,exp:"Since decay constant λ=1/(mean life), and here T½(A)=τ(B), λB=1/T½(A) while λA=ln2/T½(A); as ln2<1, λB>λA, so B decays faster than A."},
{q:"A radioactive element has N0 nuclei at t=0. The number of nuclei remaining after half of a half-life (t = T½/2) is",options:["N0/2","N0/√2","N0/4","N0/8"],correct:1,exp:"N=N0(1/2)^(t/T½); at t=T½/2, N=N0×(1/2)^0.5=N0/√2."}
];
const PH10_ELECTRONICS = [
{q:"The barrier potential of a silicon diode is approximately",options:["0.7 V","0.3 V","2.0 V","2.2 V"],correct:0,exp:"The barrier (built-in) potential of a silicon p-n junction is about 0.7 V."},
{q:"Doping a semiconductor results in",options:["a decrease in mobile charge carriers","a change in chemical properties","a change in the crystal structure","the breaking of the covalent bond"],correct:2,exp:"Introducing dopant atoms into the semiconductor lattice alters its regular crystal structure, since the dopant atoms differ in size and valence from the host atoms."},
{q:"In an unbiased p-n junction, the majority charge carriers (holes) in the p-region diffuse into the n-region because of",options:["the potential difference across the p-n junction","the higher hole concentration in the p-region than in the n-region","the attraction of free electrons of the n-region","the higher concentration of electrons in the n-region than in the p-region"],correct:1,exp:"Diffusion is driven by the concentration gradient; holes are far more concentrated in the p-region than in the n-region, so they diffuse into the n-region."},
{q:"If a positive half-wave rectified voltage is fed to a load resistor, for which part of a cycle will there be current flow through the load?",options:["0°–90°","90°–180°","0°–180°","0°–360°"],correct:2,exp:"A half-wave rectifier allows current through the load only during the positive half of the AC cycle, i.e., from 0° to 180°."},
{q:"The zener diode is primarily used as a",options:["Rectifier","Amplifier","Oscillator","Voltage regulator"],correct:3,exp:"A zener diode operated in reverse breakdown maintains a nearly constant voltage, making it useful as a voltage regulator."},
{q:"The principle on which a solar cell operates is",options:["Diffusion","Recombination","Photovoltaic action","Carrier flow"],correct:2,exp:"A solar cell converts light directly into electricity through the photovoltaic effect."},
{q:"The light emitted in an LED is due to",options:["Recombination of charge carriers","Reflection of light due to lens action","Amplification of light falling at the junction","Large current capacity"],correct:0,exp:"An LED emits light when electrons and holes recombine at the p-n junction, releasing energy as photons."},
{q:"The barrier potential of a p-n junction depends on i) type of semiconductor material ii) amount of doping iii) temperature. Which one of the following is correct?",options:["(i) and (ii) only","(ii) only","(ii) and (iii) only","(i) (ii) and (iii)"],correct:3,exp:"The barrier potential of a p-n junction is affected by the semiconductor material, the doping level, and the temperature."},
{q:"To obtain sustained oscillation in an oscillator,",options:["Feedback should be positive","Feedback factor must be unity","Phase shift must be 0 or 2π","All the above"],correct:3,exp:"Sustained oscillations require the Barkhausen criterion: positive feedback, a loop gain of unity, and a total phase shift of 0 or 2π."},
{q:"If the input to the NOT gate is A = 1011, its output is",options:["0100","1000","1100","0011"],correct:0,exp:"A NOT gate inverts each bit, so input 1011 gives output 0100."},
{q:"Which one of the following represents a forward-biased diode?",options:["Configuration (a) — 0V at P, -2V at N","Configuration (b)","Configuration (c)","Configuration (d)"],correct:0,exp:"A diode is forward biased when the p-side is at a higher potential than the n-side; here P at 0V is higher than N at −2V, satisfying forward bias."},
{q:"The given electrical network of gates is equivalent to",options:["AND gate","OR gate","NOR gate","NOT gate"],correct:2,exp:"Analysing the given gate network's truth table shows it behaves like a NOR gate."},
{q:"The output of a given logic circuit is 1 when the input ABC is",options:["101","100","110","010"],correct:0,exp:"Evaluating the given logic circuit's truth table shows the output is 1 only for the input combination 101."},
{q:"The variation of frequency of the carrier wave with respect to the amplitude of the modulating signal is called",options:["Amplitude modulation","Frequency modulation","Phase modulation","Pulse width modulation"],correct:1,exp:"Frequency modulation varies the frequency of the carrier wave in proportion to the amplitude of the modulating signal."},
{q:"The frequency range of 3 MHz to 30 MHz is used for",options:["Ground wave propagation","Space wave propagation","Sky wave propagation","Satellite communication"],correct:2,exp:"The 3-30 MHz (HF) band reflects off the ionosphere, so it is used for sky wave propagation."}
];

const PH11_RECENT_DEVELOPMENTS = [
{q:"The particle size of ZnO material is 30 nm. Based on the dimension, it is classified as",options:["Bulk material","Nanomaterial","Soft material","Magnetic material"],correct:1,exp:"Materials with at least one dimension in the 1-100 nm range are classified as nanomaterials, so 30 nm ZnO qualifies."},
{q:"Which one of the following is a natural nanomaterial?",options:["Peacock feather","Peacock beak","Grain of sand","Skin of the whale"],correct:0,exp:"The colours in a peacock feather arise from natural nanoscale structures, making it a natural nanomaterial."},
{q:"The blueprint for making ultra durable synthetic material is mimicked from",options:["Lotus leaf","Morpho butterfly","Parrot fish","Peacock feather"],correct:2,exp:"The extreme hardness of parrot fish teeth, arising from their nanostructure, has been used as a blueprint for ultra-durable synthetic materials."},
{q:"The method of making nanomaterial by assembling atoms is called",options:["Top down approach","Bottom up approach","Cross down approach","Diagonal approach"],correct:1,exp:"The bottom-up approach builds nanomaterials by assembling individual atoms or molecules into larger structures."},
{q:"\"Ski wax\" is an application of a nano product in the field of",options:["Medicine","Textile","Sports","Automotive industry"],correct:2,exp:"Nano-engineered ski wax reduces friction on snow, making it a nanotechnology application in sports."},
{q:"The materials used in Robotics are",options:["Aluminium and silver","Silver and gold","Copper and gold","Steel and aluminum"],correct:3,exp:"Robots commonly use steel and aluminium for their structural components because they combine strength with light weight."},
{q:"The alloys used for muscle wires in Robots are",options:["Shape memory alloys","Gold copper alloys","Gold silver alloys","Two dimensional alloys"],correct:0,exp:"Muscle wires in robots are made of shape memory alloys, which contract and expand like muscles when heated or cooled."},
{q:"The technology used for stopping the brain from processing pain is",options:["Precision medicine","Wireless brain sensor","Virtual reality","Radiology"],correct:2,exp:"Virtual reality is used as a distraction technique to help stop the brain from processing pain signals."},
{q:"The particle which gives mass to protons and neutrons is",options:["Higgs particle","Einstein particle","Nanoparticle","Bulk particle"],correct:0,exp:"The Higgs boson is the particle associated with giving fundamental particles, and hence protons and neutrons, their mass."},
{q:"The gravitational waves were theoretically proposed by",options:["Conrad Rontgen","Marie Curie","Albert Einstein","Edward Purcell"],correct:2,exp:"Gravitational waves were first theoretically proposed by Albert Einstein as a consequence of general relativity."}
];


/* ================= CHEMISTRY QUESTION BANK (12th Std, Book Back 1 Mark PDF) — FULL SET ================= */
const CH1_METALLURGY = [
{q:"Bauxite has the composition",options:["Al_{2}O_{3}","Al_{2}O_{3}.nH_{2}O","Fe_{2}O_{3}.2H_{2}O","None of these"],correct:1,exp:"Bauxite is hydrated aluminium oxide, Al2O3.nH2O."},
{q:"Roasting of sulphide ore gives the gas (A). (A) is a colourless gas. Aqueous solution of (A) is acidic. The gas (A) is",options:["CO_{2}","SO_{3}","SO_{2}","H_{2}S"],correct:2,exp:"Roasting a sulphide ore in air produces SO2, a colourless gas that dissolves in water to give acidic H2SO3."},
{q:"Which one of the following reactions represents calcination?",options:["2Zn + O_{2} → 2ZnO","2ZnS + 3O_{2} → 2ZnO + 2SO_{2}","MgCO_{3} → MgO + CO_{2}","Both (a) and (c)"],correct:2,exp:"Calcination is heating a carbonate ore in the absence/limited supply of air, as in MgCO3 → MgO + CO2."},
{q:"The metal oxide which cannot be reduced to metal by carbon is",options:["PbO","Al_{2}O_{3}","ZnO","FeO"],correct:1,exp:"Al2O3 is thermodynamically too stable for carbon to reduce it to the metal; aluminium is instead extracted by electrolysis."},
{q:"Which of the metal is extracted by the Hall-Heroult process?",options:["Al","Ni","Cu","Zn"],correct:0,exp:"Aluminium is extracted from alumina by the Hall-Heroult electrolytic process."},
{q:"Which of the following statements, about the advantage of roasting of sulphide ore before reduction, is not true?",options:["ΔG^{0}_{f} of sulphide is greater than those for CS_{2} and H_{2}S","ΔG^{0}_{r} is negative for roasting of sulphide ore to oxide","Roasting of the sulphide to its oxide is thermodynamically feasible","Carbon and hydrogen are suitable reducing agents for metal sulphides"],correct:3,exp:"Carbon and hydrogen are not effective reducing agents for metal sulphides, so sulphide ores are first roasted to oxides before reduction."},
{q:"Match the process in Column-I with its use in Column-II — A: Cyanide process, B: Froth floatation process, C: Electrolytic reduction, D: Zone refining; (i) Ultrapure Ge, (ii) Dressing of ZnS, (iii) Extraction of Al, (iv) Extraction of Au, (v) Purification of Ni. Choose the correct match.",options:["A-i, B-ii, C-iii, D-iv","A-iii, B-iv, C-v, D-i","A-iv, B-ii, C-iii, D-i","A-ii, B-iii, C-i, D-v"],correct:2,exp:"Cyanide process extracts gold, froth flotation dresses ZnS, electrolytic reduction extracts Al, and zone refining purifies Ge."},
{q:"Wolframite ore is separated from tinstone by the process of",options:["Smelting","Calcination","Roasting","Electromagnetic separation"],correct:3,exp:"Wolframite is magnetic while tinstone (cassiterite) is not, so they are separated by electromagnetic separation."},
{q:"Which one of the following is not feasible?",options:["Zn_{(s)} + Cu^{2+}_{(aq)} → Cu_{(s)} + Zn^{2+}_{(aq)}","Cu_{(s)} + Zn^{2+}_{(aq)} → Zn_{(s)} + Cu^{2+}_{(aq)}","Cu_{(s)} + 2Ag^{+}_{(aq)} → 2Ag_{(s)} + Cu^{2+}_{(aq)}","Fe_{(s)} + Cu^{2+}_{(aq)} → Cu_{(s)} + Fe^{2+}_{(aq)}"],correct:1,exp:"Cu is less reactive than Zn, so Cu(s) cannot displace Zn2+ from solution; the reverse reaction is the feasible one."},
{q:"Electrochemical process is used to extract",options:["Iron","Lead","Sodium","Silver"],correct:2,exp:"Sodium, being highly reactive, is extracted by the electrolysis of its molten salt (an electrochemical process)."},
{q:"Flux is a substance which is used to convert",options:["Mineral into silicate","Infusible impurities to soluble impurities","Soluble impurities to infusible impurities","All of these"],correct:1,exp:"A flux combines with infusible impurities (gangue) in the ore to form a soluble/fusible slag."},
{q:"Which one of the following ores is best concentrated by the froth-floatation method?",options:["Magnetite","Hematite","Galena","Cassiterite"],correct:2,exp:"Galena (PbS), being a sulphide ore, is well wetted by oil and concentrated efficiently by froth flotation."},
{q:"In the extraction of aluminium from alumina by electrolysis, cryolite is added to",options:["Lower the melting point of alumina","Remove impurities from alumina","Decrease the electrical conductivity","Increase the rate of reduction"],correct:0,exp:"Cryolite is added to alumina to lower its melting point, reducing the energy cost of electrolysis."},
{q:"Zinc is obtained from ZnO by",options:["Carbon reduction","Reduction using silver","Electrochemical process","Acid leaching"],correct:0,exp:"ZnO is reduced to zinc metal by heating with carbon (coke)."},
{q:"Extraction of gold and silver involves leaching with cyanide ion. Silver is later recovered by",options:["Distillation","Zone refining","Displacement with zinc","Liquation"],correct:2,exp:"Silver is recovered from the cyanide leach solution by displacement using zinc dust."},
{q:"Considering the Ellingham diagram, which of the following metals can be used to reduce alumina?",options:["Fe","Cu","Mg","Zn"],correct:2,exp:"Magnesium lies below aluminium in the Ellingham diagram, so it can reduce Al2O3 to Al."},
{q:"The following set of reactions are used in refining Zirconium: Zr (impure) + 2I_{2} —523K→ ZrI_{4}, ZrI_{4} —1800K→ Zr(pure) + 2I_{2}. This method is known as",options:["Liquation","Van Arkel process","Zone refining","Mond's process"],correct:1,exp:"Zirconium is purified by the Van Arkel process, converting impure metal to a volatile iodide which is later decomposed."},
{q:"Which of the following is used for concentrating ore in metallurgy?",options:["Leaching","Roasting","Froth floatation","Both leaching and froth floatation"],correct:3,exp:"Ores are concentrated by leaching (for some oxide/carbonate ores) as well as froth flotation (for sulphide ores)."},
{q:"This incorrect statement among the following is",options:["Nickel is refined by Mond's process","Titanium is refined by Van Arkel's process","Zinc blende is concentrated by froth floatation","In the metallurgy of gold, the metal is leached with dilute sodium chloride solution"],correct:3,exp:"In gold metallurgy the metal is leached with dilute sodium cyanide solution, not sodium chloride, making that statement incorrect."},
{q:"In the electrolytic refining of copper, which one of the following is used as the anode?",options:["Pure copper","Impure copper","Carbon rod","Platinum electrode"],correct:1,exp:"In electrolytic refining of copper, impure copper is made the anode so it dissolves and pure copper deposits at the cathode."},
{q:"Which of the following plots gives the Ellingham diagram?",options:["ΔS vs T","ΔG^{0} vs T","ΔG^{0} vs 1/T","ΔG^{0} vs T^{2}"],correct:1,exp:"The Ellingham diagram plots standard Gibbs free energy of formation (ΔG°) against temperature (T)."},
{q:"In the Ellingham diagram, for the formation of carbon monoxide",options:["ΔS^{0}/ΔT is negative","ΔG^{0}/ΔT is positive","ΔG^{0}/ΔT is negative","Initially ΔG^{0}/ΔT is positive, after 700°C it is negative"],correct:2,exp:"In CO formation, entropy increases (fewer moles of gas become more moles of gas), so ΔG° decreases with T, giving a negative slope."},
{q:"Which of the following reductions is not thermodynamically feasible?",options:["Cr_{2}O_{3} + 2Al → Al_{2}O_{3} + 2Cr","Al_{2}O_{3} + 2Cr → Cr_{2}O_{3} + 2Al","3TiO_{2} + 4Al → 2Al_{2}O_{3} + 3Ti","None of these"],correct:1,exp:"Al2O3 + 2Cr → Cr2O3 + 2Al is not feasible because aluminium is a stronger reducing agent than chromium, so the reverse reaction occurs."},
{q:"Which of the following is not true with respect to the Ellingham diagram?",options:["Free energy changes follow a straight line; deviation occurs when there is a phase change","The graph for the formation of CO_{2} is a straight line almost parallel to the free energy axis","Negative slope of CO shows that it becomes more stable with increase in temperature","Positive slope of metal oxides shows that their stabilities decrease with increase in temperature"],correct:1,exp:"The CO2 formation line has ΔS ≈ 0 (equal moles of gas on both sides), so it runs nearly parallel to the temperature axis, not the free energy axis."}
];
const CH2_PBLOCK1 = [
{q:"An aqueous solution of borax is",options:["Neutral","Acidic","Basic","Amphoteric"],correct:2,exp:"Borax (Na2B4O7) is the salt of a strong base and a weak acid, so its aqueous solution is basic."},
{q:"Boric acid is an acid because its molecule",options:["Contains a replaceable H^{+} ion","Gives up a proton","Combines with a proton to form a water molecule","Accepts OH^{-} from water, releasing a proton"],correct:3,exp:"Boric acid is a Lewis acid: it accepts OH- from a water molecule and releases a proton, rather than donating a proton itself."},
{q:"Which among the following is not a borane?",options:["B_{2}H_{6}","B_{3}H_{6}","B_{4}H_{10}","None of these"],correct:1,exp:"B3H6 does not fit either the BnHn+4 or BnHn+6 general formula for boranes, so it is not a genuine borane."},
{q:"Which of the following metals has the largest abundance in the earth's crust?",options:["Aluminium","Calcium","Magnesium","Sodium"],correct:0,exp:"Aluminium is the most abundant metal in the earth's crust."},
{q:"In diborane, the number of electrons that accounts for the banana bonds is",options:["Six","Two","Four","Three"],correct:2,exp:"In diborane, the two three-centre two-electron (banana) B-H-B bonds together involve four electrons."},
{q:"The element that does not show catenation among the following p-block elements is",options:["Carbon","Silicon","Lead","Germanium"],correct:2,exp:"Lead does not show catenation among these p-block elements because its weak Pb-Pb bonds make long chains unstable."},
{q:"Carbon atoms in fullerene with formula C_{60} have",options:["sp^{3} hybridised","sp hybridised","sp^{2} hybridised","Partially sp^{2} and partially sp^{3} hybridised"],correct:2,exp:"In fullerene C60, every carbon atom is sp2 hybridised, forming the fused hexagon/pentagon network."},
{q:"Oxidation state of carbon in its hydrides (e.g. CH_{4}) is",options:["+4","-4","+3","+2"],correct:1,exp:"Carbon is more electronegative than hydrogen, so in hydrides like CH4 it is assigned the oxidation state -4."},
{q:"The basic structural unit of silicates is",options:["(SiO_{3})^{2-}","(SiO_{4})^{2-}","(SiO)^{-}","(SiO_{4})^{4-}"],correct:3,exp:"The basic structural unit of all silicates is the tetrahedral (SiO4)^4- ion."},
{q:"The repeating unit in a linear silicone polymer, built from R_{2}SiCl_{2}, is best represented as",options:["-SiO_{2}-","-[Si(R)_{2}-O]_{n}-","-SiO(OR)-","-Si(R)-O-O-"],correct:1,exp:"Hydrolysis of R2SiCl2 followed by condensation gives a linear chain with the repeating unit -[Si(R)2-O]n-."},
{q:"Which of these is not a monomer for a high molecular mass silicone polymer?",options:["Me_{3}SiCl","PhSiCl_{3}","MeSiCl_{3}","Me_{2}SiCl_{2}"],correct:0,exp:"Me3SiCl is monofunctional (only one Si-Cl bond) and can only act as a chain terminator, not a monomer for a long polymer chain."},
{q:"Which of the following is not sp^{2} hybridised?",options:["Graphite","Graphene","Fullerene","Dry ice"],correct:3,exp:"Dry ice (solid CO2) contains sp hybridised carbon, unlike graphite, graphene and fullerene, which are all sp2."},
{q:"The geometry in which carbon atoms in diamond are bonded to each other is",options:["Tetrahedral","Hexagonal","Octahedral","None of these"],correct:0,exp:"In diamond, each carbon is sp3 hybridised and tetrahedrally bonded to four other carbon atoms."},
{q:"Which of the following statements is not correct?",options:["Beryl is a cyclic silicate","Mg_{2}SiO_{4} is an orthosilicate","SiO_{4}^{4-} is the basic structural unit of silicates","Feldspar is not an aluminosilicate"],correct:3,exp:"Feldspar is in fact an aluminosilicate (e.g. KAlSi3O8), so the statement calling it non-aluminosilicate is incorrect."},
{q:"Match items in Column I with Column II — A: Borazole, B: Boric acid, C: Quartz, D: Borax; (1) B(OH)_{3}, (2) B_{3}N_{3}H_{6}, (3) Na_{2}[B_{4}O_{5}(OH)_{4}].8H_{2}O, (4) SiO_{2}. Choose the correct match.",options:["A-2, B-1, C-4, D-3","A-1, B-2, C-3, D-4","A-3, B-4, C-1, D-2","A-4, B-3, C-2, D-1"],correct:0,exp:"Borazole (B3N3H6), boric acid (B(OH)3), quartz (SiO2) and borax (Na2[B4O5(OH)4].8H2O) match as A-2, B-1, C-4, D-3."},
{q:"Duralumin is an alloy of",options:["Cu, Mn","Cu, Al, Mg","Al, Mn","Al, Cu, Mn, Mg"],correct:3,exp:"Duralumin is an alloy of aluminium with copper, manganese and magnesium."},
{q:"The compound that is used in nuclear reactors as protective shields and control rods is",options:["Metal borides","Metal oxides","Metal carbonates","Metal carbide"],correct:0,exp:"Metal borides are used in nuclear reactors as protective shields and control rods because boron absorbs neutrons well."},
{q:"The stability of the +1 oxidation state increases in the sequence",options:["Al < Ga < In < Tl","Tl > In < Ga < Al","In < Tl < Ga < Al","Ga < In < Al < Tl"],correct:0,exp:"The +1 oxidation state (inert pair effect) becomes progressively more stable going down the group, so stability increases Al < Ga < In < Tl."}
];
const CH3_PBLOCK2 = [
{q:"In which of the following is NH_{3} not used?",options:["Nessler's reagent","Reagent for the analysis of IV group basic radical","Reagent for the analysis of III group basic radical","Tollen's reagent"],correct:0,exp:"Nessler's reagent (K2HgI4 in KOH) is used to detect ammonia itself and does not contain NH3, unlike the other reagents listed which are all prepared using ammonia."},
{q:"Which is true regarding nitrogen?",options:["Least electronegative element","Has low ionisation enthalpy than oxygen","d-orbitals available","Ability to form pπ-pπ bonds with itself"],correct:3,exp:"Nitrogen, unlike its heavier congeners, can form strong pπ-pπ multiple bonds with itself (as in N2)."},
{q:"An element belongs to group 15 and 3rd period of the periodic table. Its electronic configuration would be",options:["1s^{2} 2s^{2} 2p^{4}","1s^{2} 2s^{2} 2p^{3}","1s^{2} 2s^{2} 2p^{6} 3s^{2} 3p^{2}","1s^{2} 2s^{2} 2p^{6} 3s^{2} 3p^{3}"],correct:3,exp:"Group 15, period 3 corresponds to phosphorus, whose configuration is 1s2 2s2 2p6 3s2 3p3."},
{q:"Solid (A) reacts with strong aqueous NaOH liberating a foul smelling gas (B) which spontaneously burns in air giving smoky rings. A and B are respectively",options:["P_{4}(red) and PH_{3}","P_{4}(white) and PH_{3}","S_{8} and H_{2}S","P_{4}(white) and H_{2}S"],correct:1,exp:"White phosphorus reacts with hot concentrated NaOH to liberate PH3 gas, which ignites spontaneously in air forming smoke rings."},
{q:"In the brown ring test, the brown colour of the ring is due to",options:["A mixture of NO and NO_{2}","Nitroso ferrous sulphate","Ferrous nitrate","Ferric nitrate"],correct:1,exp:"The brown ring is due to the formation of the complex [Fe(H2O)5(NO)]2+, nitroso ferrous sulphate."},
{q:"On hydrolysis, PCl_{3} gives",options:["H_{3}PO_{3}","PH_{3}","H_{3}PO_{4}","POCl_{3}"],correct:0,exp:"PCl3 hydrolyses in water to give phosphorous acid, H3PO3, and HCl."},
{q:"P_{4}O_{6} reacts with cold water to give",options:["H_{3}PO_{3}","H_{4}P_{2}O_{7}","HPO_{3}","H_{3}PO_{4}"],correct:0,exp:"P4O6 reacts with cold water to give phosphorous acid, H3PO3."},
{q:"The basicity of pyrophosphorous acid (H_{4}P_{2}O_{5}) is",options:["4","2","3","5"],correct:1,exp:"Pyrophosphorous acid, H4P2O5, has only two ionizable (acidic) H atoms, giving it a basicity of 2."},
{q:"The molarity of a given orthophosphoric acid (H_{3}PO_{4}) solution is 2M. Its normality is",options:["6N","4N","2N","None of these"],correct:0,exp:"H3PO4 is a tribasic acid, so its normality is three times its molarity: 2M × 3 = 6N."},
{q:"Assertion: The bond dissociation energy of fluorine is greater than that of chlorine gas. Reason: Chlorine has more electronic repulsion than fluorine.",options:["Both assertion and reason are true and reason is the correct explanation of assertion","Both assertion and reason are true but reason is not the correct explanation","Assertion is true but reason is false","Both assertion and reason are false"],correct:3,exp:"Fluorine actually has a lower bond dissociation energy than chlorine due to strong lone pair-lone pair repulsion in the small F2 molecule, making both parts of the assertion-reason statement false."},
{q:"Among the following, which is the strongest oxidizing agent?",options:["Cl_{2}","F_{2}","Br_{2}","I_{2}"],correct:1,exp:"Fluorine is the strongest oxidizing agent among the halogens due to its high electronegativity and low bond dissociation energy."},
{q:"The correct order of the thermal stability of hydrogen halides is",options:["HI > HBr > HCl > HF","HF > HCl > HBr > HI","HCl > HF > HBr > HI","HI > HCl > HF > HBr"],correct:1,exp:"Thermal stability of hydrogen halides decreases down the group as bond strength decreases, giving the order HF > HCl > HBr > HI."},
{q:"Which one of the following compounds is not formed?",options:["XeOF_{4}","XeO_{3}","XeF_{2}","NeF_{2}"],correct:3,exp:"Neon is too small and its electrons too tightly held to form stable compounds like NeF2, unlike the heavier noble gases."},
{q:"Most easily liquefiable noble gas is",options:["Ar","Ne","He","Kr"],correct:3,exp:"Krypton, being the heaviest of these noble gases, has the strongest van der Waals forces and the highest boiling point, making it the easiest to liquefy."},
{q:"XeF_{6} on complete hydrolysis produces",options:["XeOF_{4}","XeO_{2}F_{2}","XeO_{3}","XeO_{2}"],correct:2,exp:"Complete hydrolysis of XeF6 gives XeO3."},
{q:"On oxidation with iodine, sulphite ion is transformed to",options:["S_{4}O_{6}^{2-}","S_{2}O_{6}^{2-}","SO_{4}^{2-}","SO_{3}^{2-}"],correct:2,exp:"Iodine oxidizes sulphite ion (SO3^2-) to sulphate ion (SO4^2-)."},
{q:"Which of the following is the strongest acid among all?",options:["HI","HF","HBr","HCl"],correct:0,exp:"HI has the weakest H-I bond among the hydrogen halides, making it dissociate most readily and act as the strongest acid."},
{q:"Which one of the following orders is correct for the bond dissociation enthalpy of halogen molecules?",options:["Br_{2} > I_{2} > F_{2} > Cl_{2}","F_{2} > Cl_{2} > Br_{2} > I_{2}","I_{2} > Br_{2} > Cl_{2} > F_{2}","Cl_{2} > Br_{2} > F_{2} > I_{2}"],correct:3,exp:"Bond dissociation enthalpy order for halogens is Cl2 > Br2 > F2 > I2, since F2 is destabilised by lone-pair repulsion."},
{q:"Among the following, the correct order of acidity is",options:["HClO_{2} < HClO < HClO_{3} < HClO_{4}","HClO_{4} < HClO_{2} < HClO < HClO_{3}","HClO_{3} < HClO_{4} < HClO_{2} < HClO","HClO < HClO_{2} < HClO_{3} < HClO_{4}"],correct:3,exp:"Acid strength of oxoacids of chlorine increases with the number of oxygen atoms (more O atoms stabilise the conjugate base), giving HClO < HClO2 < HClO3 < HClO4."},
{q:"When copper is heated with concentrated HNO_{3} it produces",options:["Cu(NO_{3})_{2}, NO and NO_{2}","Cu(NO_{3})_{2} and N_{2}O","Cu(NO_{3})_{2} and NO_{2}","Cu(NO_{3})_{2} and NO"],correct:2,exp:"Concentrated HNO3 is a strong oxidizer that oxidizes copper while itself being reduced mainly to NO2 gas, giving Cu(NO3)2 and NO2."}
];
const CH4_TRANSITION = [
{q:"Sc (Z = 21) is a transition element but Zinc (Z = 30) is not, because",options:["Both Sc^{3+} and Zn^{2+} ions are colourless and form white compounds","In case of Sc, 3d orbitals are partially filled but in Zn these are completely filled","The last electron is assumed to be added to the 4s level in case of zinc","Both Sc and Zn do not exhibit variable oxidation states"],correct:1,exp:"Zinc's electron configuration has a completely filled 3d10 subshell in both the atom and its Zn2+ ion, so it is not a transition element, unlike Sc where 3d is partially filled in some oxidation states."},
{q:"Which of the following d-block elements has a half filled penultimate d sub-shell as well as a half filled valence sub-shell?",options:["Cr","Pd","Pt","None of these"],correct:0,exp:"Chromium has the configuration [Ar]3d5 4s1, giving it both a half-filled penultimate 3d subshell and a half-filled 4s valence subshell."},
{q:"Among the transition metals of the 3d series, the one that has the highest negative M^{2+}/M electrode potential is",options:["Ti","Cu","Mn","Zn"],correct:0,exp:"Ti2+ has the most negative M2+/M standard electrode potential in the 3d series, making it the strongest reducing agent among these ions."},
{q:"Which one of the following ions has the same number of unpaired electrons as present in V^{3+}?",options:["Ti^{3+}","Fe^{3+}","Ni^{2+}","Cr^{3+}"],correct:2,exp:"V3+ (d2) has 2 unpaired electrons; Ni2+ (d8) also has 2 unpaired electrons in its high-spin octahedral configuration."},
{q:"The magnetic moment of the Mn^{2+} ion is",options:["5.92 BM","2.80 BM","8.95 BM","3.90 BM"],correct:0,exp:"Mn2+ (d5, high spin) has 5 unpaired electrons, giving a magnetic moment of √(5×7) = 5.92 BM."},
{q:"The catalytic behaviour of transition metals and their compounds is ascribed mainly due to",options:["Their magnetic behaviour","Their unfilled d orbitals","Their ability to adopt variable oxidation states","Their chemical reactivity"],correct:2,exp:"Transition metals are good catalysts largely because of their ability to show variable (multiple) oxidation states."},
{q:"The correct order of increasing oxidizing power in the series VO_{2}^{+}, Cr_{2}O_{7}^{2-}, MnO_{4}^{-} is",options:["VO_{2}^{+} < Cr_{2}O_{7}^{2-} < MnO_{4}^{-}","Cr_{2}O_{7}^{2-} < VO_{2}^{+} < MnO_{4}^{-}","Cr_{2}O_{7}^{2-} < MnO_{4}^{-} < VO_{2}^{+}","MnO_{4}^{-} < Cr_{2}O_{7}^{2-} < VO_{2}^{+}"],correct:0,exp:"Oxidizing power increases with the tendency of the metal to be reduced from a high oxidation state, giving the order VO2+ < Cr2O7^2- < MnO4-."},
{q:"In acid medium, potassium permanganate oxidizes oxalic acid to",options:["Oxalate","Carbon dioxide","Acetate","Acetic acid"],correct:1,exp:"Acidified KMnO4 oxidizes oxalic acid (oxalate) all the way to carbon dioxide."},
{q:"Which of the following statements is not true?",options:["On passing H_{2}S through acidified K_{2}Cr_{2}O_{7} solution, a milky colour is observed","Na_{2}Cr_{2}O_{7} is preferred over K_{2}Cr_{2}O_{7} in volumetric analysis","K_{2}Cr_{2}O_{7} solution in acidic medium is orange in colour","K_{2}Cr_{2}O_{7} solution becomes yellow on increasing the pH beyond 7"],correct:1,exp:"K2Cr2O7, not Na2Cr2O7, is preferred in volumetric analysis because it can be obtained in a pure, primary-standard form, so the given statement is not true."},
{q:"Permanganate ion changes to ........... in acidic medium",options:["MnO_{4}^{2-}","Mn^{2+}","Mn^{3+}","MnO_{2}"],correct:1,exp:"In acidic medium, permanganate ion is reduced to Mn2+."},
{q:"How many moles of I_{2} are liberated when 1 mole of potassium dichromate reacts with excess potassium iodide?",options:["1","2","3","4"],correct:2,exp:"Cr2O7^2- + 6I- + 14H+ → 2Cr3+ + 3I2 + 7H2O, so 1 mole of dichromate liberates 3 moles of I2."},
{q:"The number of moles of acidified KMnO_{4} required to oxidize 1 mole of ferrous oxalate (FeC_{2}O_{4}) is",options:["5","3","0.6","1.5"],correct:2,exp:"Fe2+ loses 1 electron and C2O4^2- loses 2 electrons (3 electrons total per FeC2O4); since each MnO4- accepts 5 electrons, 3/5 = 0.6 mole of KMnO4 is needed."},
{q:"Which one of the following statements related to lanthanons is incorrect?",options:["Europium shows a +2 oxidation state","The basicity decreases as the ionic radius decreases from Pr to Lu","All the lanthanons are much more reactive than aluminium","Ce^{4+} solutions are widely used as oxidising agents in volumetric analysis"],correct:2,exp:"Lanthanoids are actually much less reactive than aluminium, so the statement claiming otherwise is the incorrect one."},
{q:"Which of the following lanthanoid ions is diamagnetic?",options:["Eu^{2+}","Yb^{2+}","Ce^{2+}","Sm^{2+}"],correct:1,exp:"Yb2+ has the electron configuration 4f14, a fully filled f-subshell with no unpaired electrons, making it diamagnetic."},
{q:"Which of the following oxidation states is most common among the lanthanoids?",options:["4","2","5","3"],correct:3,exp:"The +3 oxidation state is by far the most common and stable state for lanthanoid elements."},
{q:"Assertion: Ce^{4+} is used as an oxidizing agent in volumetric analysis. Reason: Ce^{4+} has the tendency of attaining the +3 oxidation state.",options:["Both assertion and reason are true and reason is the correct explanation","Both assertion and reason are true but reason is not the correct explanation","Assertion is true but reason is false","Both assertion and reason are false"],correct:0,exp:"Ce4+ is a good oxidizing agent precisely because it readily gains an electron to revert to the more stable +3 state, so both statements are true and the reason correctly explains the assertion."},
{q:"The most common oxidation state of actinoids is",options:["+2","+3","+4","+6"],correct:1,exp:"The most common and stable oxidation state among actinoids is +3."},
{q:"The actinoid elements which show the highest oxidation state of +7 are",options:["Np, Pu, Am","U, Fm, Th","U, Th, Md","Es, No, Lr"],correct:0,exp:"Np, Pu and Am are the actinoids known to exhibit the unusually high +7 oxidation state."},
{q:"Which one of the following is not correct?",options:["La(OH)_{3} is less basic than Lu(OH)_{3}","In the lanthanoid series, the ionic radius of Ln^{3+} ions decreases","La is actually an element of the transition metal series rather than the lanthanide series","Atomic radii of Zr and Hf are the same because of lanthanide contraction"],correct:0,exp:"La(OH)3 is actually more basic than Lu(OH)3 because La3+, with the largest ionic radius in the series, holds OH- least tightly, so the given statement is the incorrect one."}
];
const CH5_COORDINATION = [
{q:"The sum of the primary valency and secondary valency of the metal M in the complex [M(en)_{2}(Ox)]Cl is",options:["3","6","-3","9"],correct:3,exp:"In [M(en)2(Ox)]Cl, the single Cl- outside the coordination sphere fixes the complex ion charge at +1, so M is +3 (primary valency); the coordination number (secondary valency) from 2 en + 1 ox = 6; sum = 3 + 6 = 9."},
{q:"An excess of silver nitrate is added to 100 mL of a 0.01 M solution of pentaaquachloridochromium(III) chloride, [Cr(H_{2}O)_{5}Cl]Cl_{2}. The number of moles of AgCl precipitated would be",options:["0.02","0.002","0.01","0.2"],correct:1,exp:"Each formula unit of [Cr(H2O)5Cl]Cl2 has 2 ionizable Cl- ions; 100 mL of 0.01 M solution contains 0.001 mol complex, giving 0.002 mol Cl- and hence 0.002 mol AgCl precipitate."},
{q:"A complex has the molecular formula MSO_{4}Cl.6H_{2}O. Its aqueous solution gives a white precipitate with barium chloride solution, and no precipitate with silver nitrate solution. If the secondary valency of the metal is six, which one of the following correctly represents the complex?",options:["[M(H_{2}O)_{4}Cl]SO_{4}.2H_{2}O","[M(H_{2}O)_{6}]SO_{4}Cl","[M(H_{2}O)_{5}Cl]SO_{4}.H_{2}O","[M(H_{2}O)_{3}Cl]SO_{4}.3H_{2}O"],correct:2,exp:"A precipitate with BaCl2 but not AgNO3 shows sulfate is free (outside the sphere) while chloride is coordinated; with secondary valency 6, this fits [M(H2O)5Cl]SO4.H2O."},
{q:"Oxidation state of iron and the charge on the ligand NO in [Fe(H_{2}O)_{5}NO]SO_{4} are",options:["+2 and 0 respectively","+3 and 0 respectively","+3 and -1 respectively","+1 and +1 respectively"],correct:3,exp:"The complex charge is +2 to balance SO4^2-; NO here behaves as the nitrosyl cation NO+ (charge +1), so Fe + 0 + 1 = +2 gives Fe as +1, and NO carries a +1 charge."},
{q:"As per IUPAC guidelines, the name of the complex [Co(en)_{2}(ONO)Cl]Cl is",options:["Chlorobisethylenediaminenitritocobalt(III) chloride","Chlorobis(ethane-1,2-diamine)nitro-κO-cobaltate(III) chloride","Chloridobis(ethane-1,2-diammine)nitrito-κO-cobalt(II) chloride","Chloridobis(ethane-1,2-diamine)nitrito-κO-cobalt(III) chloride"],correct:3,exp:"Following IUPAC rules for naming, ligands are cited alphabetically with the -o suffix for anionic ligands and κO for the O-bound nitrite, giving chloridobis(ethane-1,2-diamine)nitrito-κO-cobalt(III) chloride."},
{q:"IUPAC name of the complex K_{3}[Al(C_{2}O_{4})_{3}] is",options:["Potassium trioxalatoaluminium(III)","Potassium trioxalatoaluminate(II)","Potassium trisoxalatoaluminate(III)","Potassium trioxalatoaluminate(III)"],correct:3,exp:"Oxalate is named 'oxalato' with tri- for three ligands, and aluminium in the anionic complex takes the -ate ending with its oxidation state (III): potassium trioxalatoaluminate(III)."},
{q:"A magnetic moment of 1.73 BM will be shown by one among the following",options:["TiCl_{4}","[CoCl_{4}]^{2-}","[Cu(NH_{3})_{4}]^{2+}","[Ni(CN)_{4}]^{2-}"],correct:2,exp:"[Cu(NH3)4]2+ has Cu2+ (d9) with one unpaired electron, giving the spin-only moment √(1×3) = 1.73 BM."},
{q:"Crystal field stabilization energy for a high spin d^{5} octahedral complex is",options:["-0.6Δ_{0}","0","2(P-Δ_{0})","2(P+Δ_{0})"],correct:1,exp:"For a high-spin d5 octahedral complex (t2g3 eg2), the CFSE contributions from t2g and eg exactly cancel, giving a net CFSE of zero."},
{q:"In which of the following coordination entities will the magnitude of Δ_{0} be maximum?",options:["[Co(CN)_{6}]^{3-}","[Co(C_{2}O_{4})_{3}]^{3-}","[Co(H_{2}O)_{6}]^{3+}","[Co(NH_{3})_{6}]^{3+}"],correct:0,exp:"CN- is a strong-field ligand producing the largest crystal field splitting, so [Co(CN)6]3- has the maximum Δ0."},
{q:"Which one of the following will give a pair of enantiomorphs?",options:["[Cr(NH_{3})_{6}][Co(CN)_{6}]","[Co(en)_{2}Cl_{2}]Cl","[Pt(NH_{3})_{4}][PtCl_{4}]","[Co(NH_{3})_{4}Cl_{2}]NO_{2}"],correct:1,exp:"The cis isomer of [Co(en)2Cl2]Cl lacks a plane of symmetry and exists as a non-superimposable mirror-image pair (enantiomorphs)."},
{q:"Which type of isomerism is exhibited by [Pt(NH_{3})_{2}Cl_{2}]?",options:["Coordination isomerism","Linkage isomerism","Optical isomerism","Geometrical isomerism"],correct:3,exp:"[Pt(NH3)2Cl2] is a square planar complex that can arrange its two types of ligands as cis or trans, i.e. geometrical isomerism."},
{q:"How many geometrical isomers are possible for [Pt(Py)(NH_{3})(Br)(Cl)]?",options:["3","4","0","15"],correct:0,exp:"A square planar complex with four different ligands, [Pt(Py)(NH3)(Br)(Cl)], has 3 possible geometrical arrangements."},
{q:"Which one of the following pairs represents linkage isomers?",options:["[Cu(NH_{3})_{4}][PtCl_{4}] and [Pt(NH_{3})_{4}][CuCl_{4}]","[Co(NH_{3})_{5}(NO_{2})]SO_{4} and [Co(NH_{3})_{5}(ONO)]SO_{4}","[Co(NH_{3})_{4}(NCS)_{2}]Cl and [Co(NH_{3})_{4}(SCN)_{2}]Cl","Both (b) and (c)"],correct:2,exp:"The ambidentate thiocyanate ligand can bind through N (isothiocyanato, NCS) or S (thiocyanato, SCN), making [Co(NH3)4(NCS)2]Cl and [Co(NH3)4(SCN)2]Cl linkage isomers."},
{q:"Which kind of isomerism is possible for the complex [Co(NH_{3})_{4}Br_{2}]Cl?",options:["Geometrical and ionization","Geometrical and optical","Optical and ionization","Geometrical only"],correct:0,exp:"[Co(NH3)4Br2]Cl can show cis/trans arrangement of the two Br ligands (geometrical isomerism) and can also exchange the ionizable Cl- with a coordinated Br- (ionization isomerism)."},
{q:"Which one of the following complexes is not expected to exhibit isomerism?",options:["[Ni(NH_{3})_{4}(H_{2}O)_{2}]^{2+}","[Pt(NH_{3})_{2}Cl_{2}]","[Co(NH_{3})_{5}SO_{4}]Cl","[Fe(en)_{3}]^{3+}"],correct:3,exp:"Among these, [Fe(en)3]3+ is a symmetric tris-chelate that does not show the geometrical, linkage, or ionization isomerism seen in the other listed complexes."},
{q:"A complex in which the oxidation number of the metal is zero is",options:["K_{4}[Fe(CN)_{6}]","[Fe(CN)_{3}(NH_{3})_{3}]","[Fe(CO)_{5}]","Both (b) and (c)"],correct:2,exp:"In [Fe(CO)5], CO is a neutral ligand and the complex itself is neutral, so the oxidation number of Fe is zero."},
{q:"The formula of tris(ethane-1,2-diamine)iron(II) phosphate is",options:["[Fe(CH_{3}-CH(NH_{2})_{2})_{3}](PO_{4})_{3}","[Fe(en)_{3}](PO_{4})_{2}","[Fe(en)_{3}]_{2}(PO_{4})_{3}","[Fe(en)_{3}]_{3}(PO_{4})_{2}"],correct:3,exp:"With Fe2+ (+2) and neutral en ligands, three [Fe(en)3]2+ units (total charge +6) balance two PO4^3- units (total charge -6), giving [Fe(en)3]3(PO4)2."},
{q:"Which of the following is paramagnetic in nature?",options:["[Zn(NH_{3})_{4}]^{2+}","[Co(NH_{3})_{6}]^{3+}","[Ni(H_{2}O)_{6}]^{2+}","[Ni(CN)_{4}]^{2-}"],correct:2,exp:"[Ni(H2O)6]2+ is an octahedral high-spin Ni2+ (d8) complex with 2 unpaired electrons, making it paramagnetic."},
{q:"Fac-mer isomerism is shown by",options:["[Co(en)_{3}]^{3+}","[Co(NH_{3})_{4}Cl_{2}]^{+}","[Co(NH_{3})_{3}Cl_{3}]","[Co(NH_{3})_{5}Cl]SO_{4}"],correct:2,exp:"An MA3B3-type octahedral complex like [Co(NH3)3Cl3] can arrange its ligands in a facial (fac) or meridional (mer) pattern."},
{q:"Which of the following statements is correct?",options:["Square planar complexes are more stable than octahedral complexes","The spin only magnetic moment of [CuCl_{4}]^{2-} is 1.732 BM and it has a square planar structure","The crystal field splitting energy (Δ_{0}) of [FeF_{6}]^{4-} is higher than that of [Fe(CN)_{6}]^{4-}","The crystal field stabilization energy of [V(H_{2}O)_{6}]^{2+} is higher than the crystal field stabilization of [Ti(H_{2}O)_{6}]^{2+}"],correct:3,exp:"V2+ (d3) has a higher CFSE than Ti2+ (d2) in an octahedral field, since more electrons occupy the stabilized t2g set."}
];
const CH6_SOLIDSTATE = [
{q:"Graphite and diamond are",options:["Covalent and molecular crystals","Ionic and covalent crystals","Both covalent crystals","Both molecular crystals"],correct:2,exp:"Both graphite and diamond are giant covalent (network) solids held together entirely by covalent bonds."},
{q:"An ionic compound A_{x}B_{y} crystallizes in an fcc-type crystal structure with B ions at the centre of each face and A ions occupying the centre of the cube. The correct formula of A_{x}B_{y} is",options:["AB","AB_{3}","A_{3}B","A_{8}B_{6}"],correct:1,exp:"With 6 B ions at face centres (6 × 1/2 = 3) and 1 A ion at the body centre (1 whole), the ratio A:B is 1:3, giving the formula AB3."},
{q:"The ratio of close packed atoms to tetrahedral holes in cubic close packing is",options:["1:1","1:2","2:1","1:4"],correct:1,exp:"In cubic close packing, the number of tetrahedral voids is twice the number of atoms, giving a ratio of 1:2."},
{q:"Solid CO_{2} is an example of",options:["Covalent solid","Metallic solid","Molecular solid","Ionic solid"],correct:2,exp:"Solid CO2 (dry ice) is held together by weak van der Waals forces between discrete molecules, making it a molecular solid."},
{q:"Assertion: Monoclinic sulphur is an example of a monoclinic crystal system. Reason: For a monoclinic system, a ≠ b ≠ c and α = γ = 90°, β ≠ 90°.",options:["Both assertion and reason are true and reason is the correct explanation of assertion","Both assertion and reason are true but reason is not the correct explanation","Assertion is true but reason is false","Both assertion and reason are false"],correct:0,exp:"Monoclinic sulphur does belong to the monoclinic crystal system, which is correctly defined by a ≠ b ≠ c with α = γ = 90° and β ≠ 90°, so both statements are true and the reason explains the assertion."},
{q:"In calcium fluoride, having the fluorite structure, the coordination numbers of the Ca^{2+} ion and F^{-} ion are",options:["4 and 2","6 and 6","8 and 4","4 and 8"],correct:2,exp:"In the fluorite (CaF2) structure, Ca2+ ions have a coordination number of 8 and F- ions have a coordination number of 4."},
{q:"The number of unit cells in 8 g of an element X (atomic mass 40) which crystallizes in a bcc pattern is (N_{A} is the Avogadro number)",options:["6.023 × 10^{23}","6.023 × 10^{22}","60.23 × 10^{23}","0.6023 × 10^{22}"],correct:1,exp:"8 g of X (atomic mass 40) is 0.2 mol of atoms; a bcc unit cell contains 2 atoms, so the number of unit cells is 0.2NA/2 = 6.023 × 10^22."},
{q:"In a solid, atom M occupies a ccp lattice and 1/3 of the tetrahedral voids are occupied by atom N. The formula of the solid formed by M and N is",options:["MN","M_{3}N","MN_{3}","M_{3}N_{2}"],correct:3,exp:"With M in ccp (4 per unit cell) and N filling 1/3 of the 8 tetrahedral voids (8/3 per unit cell), the ratio M:N = 4 : 8/3 = 3:2, giving M3N2."},
{q:"The ionic radii of A^{+} and B^{-} are 0.98 × 10^{-10} m and 1.81 × 10^{-10} m. The coordination number of each ion in AB is",options:["8","2","6","4"],correct:2,exp:"The radius ratio r+/r- = 0.98/1.81 ≈ 0.54, which falls in the range for octahedral coordination (0.414-0.732), giving a coordination number of 6."},
{q:"CsCl has a bcc arrangement; its unit cell edge length is 400 pm. Its inter-atomic (nearest neighbour) distance is",options:["400 pm","800 pm","3 × 100 pm","(√3/2) × 400 pm"],correct:3,exp:"In a bcc lattice the nearest-neighbour distance lies along the body diagonal, equal to (√3/2) times the edge length, i.e. (√3/2) × 400 pm."},
{q:"A solid compound XY has the NaCl structure. If the radius of the cation is 100 pm, the radius of the anion will be",options:["100/0.414 pm","0.732 × 100 pm","100 × 0.414 pm","0.414 pm"],correct:0,exp:"For the rock-salt (NaCl) structure, the limiting radius ratio for cation to anion is 0.414, so the anion radius = cation radius / 0.414 = 100/0.414 pm."},
{q:"The vacant space in a bcc lattice unit cell is",options:["48%","23%","32%","26%"],correct:2,exp:"A body-centred cubic lattice has a packing efficiency of about 68%, leaving roughly 32% of the volume vacant."},
{q:"The radius of an atom is 300 pm. If it crystallizes in a face-centred cubic lattice, the length of the edge of the unit cell is",options:["488.5 pm","848.5 pm","884.5 pm","484.5 pm"],correct:1,exp:"For an fcc lattice, edge length a = 2√2 × r = 2 × 1.414 × 300 ≈ 848.5 pm."},
{q:"The fraction of the total volume occupied by the atoms in a simple cubic lattice is",options:["π/4","π/6","π/4√2","π/3√2"],correct:1,exp:"In a simple cubic lattice, the packing efficiency (fraction of volume occupied) is π/6."},
{q:"The yellow colour in an NaCl crystal is due to",options:["Excitation of electrons in F centres","Reflection of light from Cl^{-} ions on the surface","Refraction of light from Na^{+} ions","All of the above"],correct:0,exp:"F-centres — electrons trapped in anion vacancies in the NaCl lattice — absorb visible light and are responsible for the yellow colour."},
{q:"If 'a' stands for the edge length of the cubic system (sc, bcc, and fcc), the ratio of the radii of spheres in these systems will respectively be",options:["a/2 : a : 2a","1/2 a : √3 a : 2a","a/2 : √3a/4 : a/(2√2)","1/2 a : √3 a : 1/2 a"],correct:2,exp:"The radius-to-edge-length relations for simple cubic, bcc and fcc lattices are a/2, √3a/4 and a/(2√2) respectively."},
{q:"If 'a' is the length of the side of the cube, the distance between the body-centred atom and a corner atom in the cube will be",options:["(2/3)a","(4/3)a","(3/4)a","(√3/2)a"],correct:3,exp:"The body-centred atom lies at the centre of the cube, so its distance to any corner atom is half the body diagonal, (√3/2)a."},
{q:"Potassium has a bcc structure with a nearest neighbour distance of 4.52 Å. Its atomic weight is 39. Its density will be",options:["915 kg m^{-3}","2142 kg m^{-3}","452 kg m^{-3}","390 kg m^{-3}"],correct:0,exp:"Using the bcc relations between nearest-neighbour distance, edge length, atomic mass and density gives a density of about 915 kg m^-3 for potassium."},
{q:"Schottky defect in a crystal is observed when",options:["An unequal number of cations and anions are missing from the lattice","An equal number of cations and anions are missing from the lattice","An ion leaves its normal site and occupies an interstitial site","No ion is missing from its lattice"],correct:1,exp:"A Schottky defect involves an equal number of cations and anions missing from their lattice sites, preserving electrical neutrality."},
{q:"The cation leaves its normal position in the crystal and moves to some interstitial position; this defect in the crystal is known as",options:["Schottky defect","F centre","Frenkel defect","Non-stoichiometric defect"],correct:2,exp:"When a cation leaves its normal lattice site and occupies an interstitial position, this is called a Frenkel defect."},
{q:"Assertion: Due to Frenkel defect, the density of the crystalline solid decreases. Reason: In Frenkel defect, the cation and anion leave the crystal.",options:["Both assertion and reason are true and reason is the correct explanation","Both assertion and reason are true but reason is not the correct explanation","Assertion is true but reason is false","Both assertion and reason are false"],correct:3,exp:"In a Frenkel defect, ions are only displaced (not lost from the crystal) and no ions actually leave the solid, so both the assertion (density decrease) and the reason are false."},
{q:"The crystal with a metal deficiency defect is",options:["NaCl","FeO","ZnO","KCl"],correct:1,exp:"In FeO, some Fe2+ sites are vacant with the charge balance maintained by extra Fe3+ ions, giving FeO a metal deficiency defect."},
{q:"A two-dimensional solid pattern is formed by two different atoms X and Y. The black and white squares represent atoms X and Y respectively. The simplest formula for the compound based on the unit cell is",options:["XY_{8}","X_{4}Y_{9}","XY_{2}","XY_{4}"],correct:0,exp:"Counting the black (X) and white (Y) squares in the two-dimensional unit cell pattern gives the simplest formula XY8."}
];
const CH7_KINETICS = [
{q:"For a first order reaction A → B, the rate constant is x min^{-1}. If the initial concentration of A is 0.01M, the concentration of A after one hour is given by the expression",options:["0.01e^{-x}","1×10^{-2}(1-e^{-60x})","(1×10^{-2})e^{-60x}","None of these"],correct:2,exp:"For first order kinetics, [A] = [A]0 e^(-kt); with t = 60 min and rate constant x (per min), [A] = (1×10^-2)e^(-60x)."},
{q:"A zero order reaction X → Product, with an initial concentration 0.02 M, has a half life of 10 min. If one starts with a concentration of 0.04 M, then the half life is",options:["10 s","5 min","20 min","Cannot be predicted using the given information"],correct:2,exp:"For a zero order reaction, half-life = [A]0/2k, which is directly proportional to the initial concentration, so doubling [A]0 from 0.02 M to 0.04 M doubles the half-life to 20 min."},
{q:"Among graphs showing the variation of the rate constant with temperature (T) for a reaction, the one that exhibits Arrhenius behaviour over the entire temperature range is the one where",options:["ln k vs T is a straight line with positive slope","ln k vs 1/T is a straight line with negative slope","k vs T is a straight line through the origin","k is independent of T"],correct:1,exp:"The Arrhenius equation k = Ae^(-Ea/RT) gives ln k = ln A - Ea/(RT), so a plot of ln k vs 1/T is a straight line with a negative slope (-Ea/R)."},
{q:"For a first order reaction A → product with initial concentration x mol L^{-1}, the half life period is 2.5 hours. For the same reaction with initial concentration x/2 mol L^{-1}, the half life is",options:["(2.5×2) hours","2.5/2 hours","2.5 hours","Without knowing the rate constant, t_{1/2} cannot be determined"],correct:2,exp:"For a first order reaction, half-life is independent of the initial concentration, so it stays 2.5 hours even when [A]0 is halved."},
{q:"For the reaction 2NH_{3} → N_{2} + 3H_{2}, if -d[NH_{3}]/dt = k_{1}[NH_{3}], d[N_{2}]/dt = k_{2}[NH_{3}], d[H_{2}]/dt = k_{3}[NH_{3}], then the relation between k_{1}, k_{2} and k_{3} is",options:["k_{1} = k_{2} = k_{3}","k_{1} = 3k_{2} = 2k_{3}","1.5k_{1} = 3k_{2} = k_{3}","2k_{1} = k_{2} = 3k_{3}"],correct:2,exp:"From the stoichiometry 2NH3 → N2 + 3H2, rate = -(1/2)d[NH3]/dt = d[N2]/dt = (1/3)d[H2]/dt, which works out to the relation 1.5k1 = 3k2 = k3."},
{q:"The decomposition of phosphine (PH_{3}) on tungsten at low pressure is a first order reaction. It is because",options:["The rate is proportional to the surface coverage","The rate is inversely proportional to the surface coverage","The rate is independent of the surface coverage","The rate of decomposition is slow"],correct:0,exp:"At low pressure, the tungsten surface is not fully covered, so the fraction of surface covered (and hence the rate) is directly proportional to the pressure of PH3, making the reaction first order."},
{q:"For a reaction Rate = k[acetone]^{3/2}, the unit of the rate constant and the rate of reaction respectively is",options:["(mol L^{-1}s^{-1}), mol^{-1/2}L^{1/2}s^{-1}","mol^{-1/2}L^{1/2}s^{-1}, (mol L^{-1}s^{-1})","mol^{1/2}L^{1/2}s^{-1}, (mol L^{-1}s^{-1})","(mol L s^{-1}), mol^{1/2}L^{1/2}s"],correct:1,exp:"For rate = k[acetone]^1.5, matching units on both sides gives the rate constant units mol^-1/2 L^1/2 s^-1, while the rate itself always has units of mol L^-1 s^-1."},
{q:"The addition of a catalyst during a chemical reaction alters which of the following quantities?",options:["Enthalpy","Activation energy","Entropy","Internal energy"],correct:1,exp:"A catalyst works by providing an alternative pathway with lower activation energy; it does not alter the enthalpy, entropy or internal energy of the reaction."},
{q:"Consider the statements: (i) increase in concentration of the reactant increases the rate of a zero order reaction; (ii) rate constant k equals the collision frequency A if E_{a} = 0; (iii) k equals the collision frequency A even when E_{a} ≠ 0; (iv) a plot of ln(k) vs T is a straight line; (v) a plot of ln(k) vs 1/T is a straight line with a positive slope. The correct statement(s) is/are",options:["(ii) only","(ii) and (iv)","(ii) and (v)","(i), (ii) and (v)"],correct:0,exp:"From the Arrhenius equation, k = A only when the exponential term is 1, which happens when Ea = 0, so only statement (ii) is correct."},
{q:"In a reversible reaction, the enthalpy change and the activation energy in the forward direction are respectively -x kJ mol^{-1} and y kJ mol^{-1}. Therefore, the energy of activation in the backward direction is",options:["(y-x) kJ mol^{-1}","(x+y) J mol^{-1}","(x-y) kJ mol^{-1}","(x+y) × 10^{3} J mol^{-1}"],correct:3,exp:"Using ΔH = Ea(forward) - Ea(backward), Ea(backward) = Ea(forward) - ΔH = y - (-x) = (x+y) kJ mol^-1, which equals (x+y) × 10^3 J mol^-1."},
{q:"What is the activation energy for a reaction if its rate doubles when the temperature is raised from 200 K to 400 K? (R = 8.314 J K^{-1} mol^{-1})",options:["234.65 kJ mol^{-1}","434.65 kJ mol^{-1}","434.65 J mol^{-1}","334.65 J mol^{-1}"],correct:2,exp:"Using the Arrhenius equation ln(k2/k1) = (Ea/R)(1/T1 - 1/T2) with k2/k1 = 2, T1 = 200 K and T2 = 400 K gives Ea ≈ 434.65 J mol^-1."},
{q:"A reaction follows first order kinetics. The rate constant at a particular temperature is 2.303 × 10^{-2} hour^{-1}. The initial concentration of cyclopropane is 0.25 M. What will be the concentration of cyclopropane after 1806 minutes? (log 2 = 0.3010)",options:["0.125 M","0.215 M","0.25 × 2.303 M","0.05 M"],correct:0,exp:"Using the first order integrated rate law with the given rate constant and time, the cyclopropane concentration after 1806 minutes works out to 0.125 M."},
{q:"For a first order reaction, the rate constant is 6.909 min^{-1}. The time taken for 75% conversion in minutes is",options:["(3/2)log2","(2/3)log2","(3/4)log2","(4/3)log2"],correct:1,exp:"For a first order reaction, t = (2.303/k)log([A]0/[A]); at 75% conversion, [A] = [A]0/4, giving t = (2.303/k)log4 = (2/3)log2 when simplified with the given k."},
{q:"In a first order reaction X → Y, if k is the rate constant and the initial concentration of the reactant X is 0.1 M, then the half life is",options:["log2/k","0.693/(0.1)k","ln2/k","None of these"],correct:2,exp:"For a first order reaction, half-life t1/2 = ln2/k = 0.693/k, independent of the initial concentration."},
{q:"Predict the rate law of the reaction 2A + B → C + 3D from the data: [A]=0.1,[B]=0.1→rate x; [A]=0.2,[B]=0.1→rate 2x; [A]=0.1,[B]=0.2→rate 4x; [A]=0.2,[B]=0.2→rate 8x",options:["rate = k[A]^{2}[B]","rate = k[A][B]^{2}","rate = k[A][B]","rate = k[A]^{1/2}[B]^{3/2}"],correct:1,exp:"Doubling [A] doubles the rate (order 1 in A), while doubling [B] quadruples the rate (order 2 in B), giving the rate law rate = k[A][B]^2."},
{q:"Assertion: The rate of reaction doubles when the concentration of the reactant is doubled if it is a first order reaction. Reason: The rate constant also doubles.",options:["Both assertion and reason are true and reason is the correct explanation","Both assertion and reason are true but reason is not the correct explanation","Assertion is true but reason is false","Both assertion and reason are false"],correct:2,exp:"Doubling the concentration does double the rate for a first order reaction, but the rate constant k itself is a fixed value that does not change with concentration, so the reason is false."},
{q:"The rate constant of a reaction is 5.8 × 10^{-2} s^{-1}. The order of the reaction is",options:["First order","Zero order","Second order","Third order"],correct:0,exp:"A rate constant with units of s^-1 (no concentration term) indicates a first order reaction."},
{q:"For the reaction N_{2}O_{5}(g) → 2NO_{2}(g) + (1/2)O_{2}(g), the rate of disappearance of N_{2}O_{5} is 6.5 × 10^{-2} mol L^{-1}s^{-1}. The rates of formation of NO_{2} and O_{2} respectively are",options:["3.5 × 10^{-2} mol L^{-1}s^{-1} and 1.3 × 10^{-2} mol L^{-1}s^{-1}","1.3 × 10^{-2} mol L^{-1}s^{-1} and 3.25 × 10^{-2} mol L^{-1}s^{-1}","1.3 × 10^{-1} mol L^{-1}s^{-1} and 3.25 × 10^{-2} mol L^{-1}s^{-1}","None of these"],correct:2,exp:"For N2O5 → 2NO2 + (1/2)O2, rate of NO2 formation = 2 × rate of N2O5 disappearance = 1.3 × 10^-1 mol L^-1 s^-1, and rate of O2 formation = (1/2) × rate = 3.25 × 10^-2 mol L^-1 s^-1."},
{q:"During the decomposition of H_{2}O_{2} to give dioxygen, 48 g O_{2} is formed per minute at a certain point of time. The rate of formation of water at this point is",options:["0.75 mol min^{-1}","1.5 mol min^{-1}","2.25 mol min^{-1}","3.0 mol min^{-1}"],correct:3,exp:"48 g of O2 is 1.5 mol; since 2H2O2 → 2H2O + O2 produces H2O and O2 in a 2:1 ratio, the rate of water formation is 2 × 1.5 = 3.0 mol min^-1."},
{q:"If the initial concentration of the reactant is doubled, the time for half reaction is also doubled. Then the order of the reaction is",options:["Zero","One","Fraction","None"],correct:0,exp:"Since half-life doubles when the initial concentration doubles, t1/2 is directly proportional to [A]0, which is characteristic of a zero order reaction."},
{q:"In a homogeneous reaction A → B + C + D, the initial pressure was P_{0} and after time t it was P. The expression for the rate constant in terms of P_{0}, P and t is",options:["k = (2.303/t)log(2P_{0}/(3P_{0}-P))","k = (2.303/t)log(2P_{0}/(P_{0}-P))","k = (2.303/t)log((3P-P_{0})/2P_{0})","k = (2.303/t)log(2P_{0}/(3P_{0}-2P))"],correct:0,exp:"For the gas phase reaction A → B + C + D, relating total pressure to the extent of reaction gives k = (2.303/t)log(2P0/(3P0-P))."},
{q:"If 75% of a first order reaction was completed in 60 minutes, 50% of the same reaction under the same conditions would be completed in",options:["20 minutes","30 minutes","35 minutes","75 minutes"],correct:1,exp:"75% completion in a first order reaction corresponds to 2 half-lives (since (1/2)^2 = 1/4 remains), so 60 minutes = 2 half-lives, meaning the half-life is 30 minutes."},
{q:"The half-life period of a radioactive element is 140 days. After 560 days, 1 g of the element will be reduced to",options:["1/2 g","1/4 g","1/8 g","1/16 g"],correct:3,exp:"With a half-life of 140 days, 560 days corresponds to 4 half-lives, so the amount left is (1/2)^4 = 1/16 of the original 1 g."},
{q:"The correct difference between first and second order reactions is that",options:["A first order reaction can be catalysed; a second order reaction cannot be catalysed","The half life of a first order reaction does not depend on [A_{0}]; the half life of a second order reaction does depend on [A_{0}]","The rate of a first order reaction does not depend on reactant concentrations, but the rate of a second order reaction does","The rate of a first order reaction depends on reactant concentrations; the rate of a second order reaction does not"],correct:1,exp:"The half-life of a first order reaction is independent of the initial concentration, while for a second order reaction it depends on [A]0 (t1/2 = 1/(k[A]0))."},
{q:"After 2 hours, a radioactive substance becomes 1/16th of its original amount. The half-life (in minutes) is",options:["60 minutes","120 minutes","30 minutes","15 minutes"],correct:2,exp:"Becoming 1/16th of the original amount corresponds to 4 half-lives; 2 hours = 120 minutes, so each half-life is 120/4 = 30 minutes."}
];
const CH8_IONIC = [
{q:"Concentration of the Ag^{+} ions in a saturated solution of Ag_{2}C_{2}O_{4} is 2.24 × 10^{-4} mol L^{-1}. The solubility product of Ag_{2}C_{2}O_{4} is",options:["2.42 × 10^{-8} mol^{3}L^{-3}","2.66 × 10^{-12} mol^{3}L^{-3}","4.5 × 10^{-11} mol^{3}L^{-3}","5.619 × 10^{-12} mol^{3}L^{-3}"],correct:3,exp:"For Ag2C2O4 ⇌ 2Ag+ + C2O4^2-, [C2O4^2-] = [Ag+]/2 = 1.12×10^-4 M, so Ksp = [Ag+]^2[C2O4^2-] = (2.24×10^-4)^2 × 1.12×10^-4 = 5.619×10^-12."},
{q:"Four solutions were prepared by mixing different volumes of HCl and NaOH: (i) 60 mL of M/10 HCl + 40 mL of M/10 NaOH; (ii) 55 mL of M/10 HCl + 45 mL of M/10 NaOH; (iii) 75 mL of M/5 HCl + 25 mL of M/5 NaOH; (iv) 100 mL of M/10 HCl + 100 mL of M/10 NaOH. The pH of which one of these will be equal to 1?",options:["(iv)","(i)","(ii)","(iii)"],correct:3,exp:"In mixture (iii), 75 mL of M/5 HCl (0.015 mol) reacts with 25 mL of M/5 NaOH (0.005 mol), leaving 0.01 mol excess H+ in 100 mL, giving [H+] = 0.1 M and pH = 1."},
{q:"The solubility of BaSO_{4} in water is 2.42 × 10^{-3} g L^{-1} at 298K (molar mass of BaSO_{4} = 233 g mol^{-1}). The value of its solubility product (K_{sp}) will be",options:["1.08 × 10^{-14} mol^{2}L^{-2}","1.08 × 10^{-12} mol^{2}L^{-2}","1.08 × 10^{-10} mol^{2}L^{-2}","1.08 × 10^{-8} mol^{2}L^{-2}"],correct:2,exp:"Converting solubility to molarity (2.42×10^-3 g/L ÷ 233 g/mol ≈ 1.04×10^-5 M) and squaring gives Ksp = s^2 ≈ 1.08×10^-10 mol^2 L^-2."},
{q:"pH of a saturated solution of Ca(OH)_{2} is 9. The solubility product (K_{sp}) of Ca(OH)_{2} is",options:["0.5 × 10^{-15}","0.25 × 10^{-10}","0.125 × 10^{-15}","0.5 × 10^{-10}"],correct:0,exp:"At pH 9, [OH-] = 10^-5 M and [Ca2+] = [OH-]/2 = 0.5×10^-5 M, so Ksp = [Ca2+][OH-]^2 = 0.5×10^-5 × (10^-5)^2 = 0.5×10^-15."},
{q:"Conjugate bases for the Bronsted acids H_{2}O and HF are",options:["OH^{-} and H_{2}F^{+}, respectively","H_{3}O^{+} and F^{-}, respectively","OH^{-} and F^{-}, respectively","H_{3}O^{+} and H_{2}F^{-}, respectively"],correct:2,exp:"H2O loses a proton to become OH-, and HF loses a proton to become F-; these are their respective conjugate bases."},
{q:"Which will make a basic buffer?",options:["50 mL of 0.1M HCl + 25 mL of 0.1M CH_{3}COOH","100 mL of 0.1M CH_{3}COOH + 100 mL of 0.1M NH_{4}OH","100 mL of 0.1M HCl + 200 mL of 0.1M NH_{4}OH","100 mL of 0.1M HCl + 100 mL of 0.1M NaOH"],correct:2,exp:"Mixing 100 mL of 0.1 M HCl with 200 mL of 0.1 M NH4OH leaves excess unreacted NH4OH along with the NH4Cl formed, giving a basic buffer of a weak base and its salt."},
{q:"Which of the following fluoro-compounds is most likely to behave as a Lewis base?",options:["BF_{3}","PF_{3}","CF_{4}","SiF_{4}"],correct:1,exp:"PF3 has a lone pair on phosphorus available to donate to an electron-deficient species, making it capable of Lewis base behaviour."},
{q:"Which of these is not likely to act as a Lewis base?",options:["BF_{3}","PF_{3}","CO","F^{-}"],correct:0,exp:"BF3 has an incomplete octet on boron and readily accepts an electron pair, making it a Lewis acid rather than a Lewis base."},
{q:"The aqueous solutions of sodium formate, anilinium chloride and potassium cyanide are respectively",options:["Acidic, acidic, basic","Basic, acidic, basic","Basic, neutral, basic","None of these"],correct:1,exp:"Sodium formate (salt of a strong base, weak acid) is basic, anilinium chloride (salt of a weak base, strong acid) is acidic, and potassium cyanide (salt of a strong base, weak acid) is basic."},
{q:"The percentage of pyridine (C_{5}H_{5}N) that forms the pyridinium ion (C_{5}H_{5}NH^{+}) in a 0.10 M aqueous pyridine solution (K_{b} for C_{5}H_{5}N = 1.7 × 10^{-9}) is",options:["0.006%","0.013%","0.77%","1.6%"],correct:1,exp:"Percentage ionization = √(Kb/C) × 100 = √(1.7×10^-9/0.10) × 100 ≈ 0.013%."},
{q:"Equal volumes of three acid solutions of pH 1, 2 and 3 are mixed in a vessel. What will be the H^{+} ion concentration in the mixture?",options:["3.7 × 10^{-2}","10^{-6}","0.111","None of these"],correct:0,exp:"Averaging [H+] from pH 1, 2 and 3 solutions: (0.1 + 0.01 + 0.001)/3 ≈ 3.7×10^-2 M."},
{q:"The solubility of AgCl(s) with solubility product 1.6 × 10^{-10} in 0.1M NaCl solution would be",options:["1.26 × 10^{-5} M","1.6 × 10^{-9} M","1.6 × 10^{-11} M","Zero"],correct:1,exp:"By the common ion effect, solubility of AgCl in 0.1 M NaCl = Ksp/[Cl-] = 1.6×10^-10/0.1 = 1.6×10^-9 M."},
{q:"If the solubility product of lead iodide is 3.2 × 10^{-8}, its solubility will be",options:["2 × 10^{-3} M","4 × 10^{-4} M","1.6 × 10^{-5} M","1.8 × 10^{-5} M"],correct:0,exp:"For PbI2, Ksp = 4s^3 = 3.2×10^-8, giving s^3 = 8×10^-9 and s = 2×10^-3 M."},
{q:"MY and NY_{3} are insoluble salts and have the same K_{sp} value of 6.2 × 10^{-13} at room temperature. Which statement is true regarding MY and NY_{3}?",options:["The salts MY and NY_{3} are more soluble in 0.5M KY than in pure water","The addition of the salt KY to a suspension of MY and NY_{3} will have no effect on their solubilities","The molar solubilities of MY and NY_{3} in water are identical","The molar solubility of MY in water is less than that of NY_{3}"],correct:3,exp:"For the same Ksp, a salt with higher stoichiometric ratio like NY3 has a proportionally larger molar solubility than the 1:1 salt MY."},
{q:"What is the pH of the resulting solution when equal volumes of 0.1M NaOH and 0.01M HCl are mixed?",options:["2.0","3","7.0","12.65"],correct:3,exp:"Excess OH- after mixing = (0.1 - 0.01)/2 = 0.045 M, giving pOH ≈ 1.35 and pH ≈ 12.65."},
{q:"The dissociation constant of a weak acid is 1 × 10^{-3}. To prepare a buffer solution with pH = 4, the [acid]/[salt] ratio should be",options:["4:3","3:4","10:1","1:10"],correct:3,exp:"Using pH = pKa + log([salt]/[acid]) with pKa = 3 and pH = 4, log([salt]/[acid]) = 1, so [salt]/[acid] = 10, i.e. [acid]/[salt] = 1/10."},
{q:"The pH of a 10^{-5} M KOH solution will be",options:["9","5","19","None of these"],correct:0,exp:"For 10^-5 M KOH, pOH = -log(10^-5) = 5, giving pH = 14 - 5 = 9."},
{q:"H_{2}PO_{4}^{-} is the conjugate base of",options:["PO_{4}^{3-}","P_{2}O_{5}","H_{3}PO_{4}","HPO_{4}^{2-}"],correct:2,exp:"H2PO4- forms when H3PO4 loses one proton, making it the conjugate base of H3PO4."},
{q:"Which of the following can act as a Lowry-Bronsted acid as well as base?",options:["HCl","SO_{4}^{2-}","HPO_{4}^{2-}","Br^{-}"],correct:2,exp:"HPO4^2- can donate a proton (to form PO4^3-) or accept a proton (to form H2PO4-), so it can act as either a Bronsted acid or base."},
{q:"The pH of an aqueous solution is zero. The solution is",options:["Slightly acidic","Strongly acidic","Neutral","Basic"],correct:1,exp:"A pH of zero corresponds to [H+] = 1 M, which is a strongly (not just mildly) acidic solution."},
{q:"The hydrogen ion concentration of a buffer solution consisting of a weak acid and its salt is given by",options:["[H^{+}] = K_{a}[acid]/[salt]","[H^{+}] = K_{a}[salt]/[acid]","[H^{+}] = K_{a}·[acid]·[salt]","[H^{+}] = K_{a}/([acid][salt])"],correct:0,exp:"For a buffer of a weak acid and its salt, [H+] = Ka × [acid]/[salt]."},
{q:"Which of the following relations is correct for the degree of hydrolysis (h) of ammonium acetate?",options:["h = K_{w}/C","h = K_{a}/K_{b}","h = √(K_{w}/(K_{a}K_{b}))","h = K_{a}K_{b}/K_{w}"],correct:2,exp:"The degree of hydrolysis of a salt of a weak acid and weak base is given by h = √(Kw/(Ka·Kb))."},
{q:"Dissociation constant of NH_{4}OH is 1.8 × 10^{-5}. The hydrolysis constant of NH_{4}Cl would be",options:["1.8 × 10^{-19}","5.55 × 10^{-10}","5.55 × 10^{-5}","1.80 × 10^{-5}"],correct:1,exp:"Hydrolysis constant Kh = Kw/Kb = 1×10^-14/1.8×10^-5 = 5.55×10^-10."}
];
const CH9_ELECTROCHEM = [
{q:"The number of electrons that have a total charge of 9650 coulombs is",options:["6.22 × 10^{23}","6.022 × 10^{24}","6.022 × 10^{22}","6.022 × 10^{-34}"],correct:2,exp:"Number of electrons = total charge / charge per electron = 9650 C / (1.6×10^-19 C) ≈ 6.022×10^22."},
{q:"Consider the half-cell reactions: Mn^{2+} + 2e^{-} → Mn, E° = -1.18V; Mn^{2+} → Mn^{3+} + e^{-}, E° = -1.51V. The E° for the reaction 3Mn^{2+} → Mn + 2Mn^{3+}, and the possibility of the forward reaction, are respectively",options:["2.69 V and spontaneous","-2.69 V and non-spontaneous","0.33 V and spontaneous","4.18 V and non-spontaneous"],correct:1,exp:"Combining the two half-reactions as required by the overall equation and summing the free energies gives E° = -2.69 V, a negative value indicating the forward reaction is non-spontaneous."},
{q:"A button cell used in watches works on: Zn(s) + Ag_{2}O(s) + H_{2}O(l) → 2Ag(s) + Zn^{2+}(aq) + 2OH^{-}(aq), E°_{ox} = 0.76V; Ag_{2}O(s) + H_{2}O(l) + 2e^{-} → 2Ag(s) + 2OH^{-}(aq), E°_{red} = 0.34V. The cell potential will be",options:["0.84 V","1.34 V","1.10 V","0.42 V"],correct:2,exp:"Cell potential = E°(oxidation, Zn) + E°(reduction, Ag2O) = 0.76 V + 0.34 V = 1.10 V."},
{q:"The molar conductivity of a 0.5 mol dm^{-3} solution of AgNO_{3} with an electrolytic conductivity of 5.76 × 10^{-3} S cm^{-1} at 298 K is",options:["2.88 S cm^{2}mol^{-1}","11.52 S cm^{2}mol^{-1}","0.086 S cm^{2}mol^{-1}","28.8 S cm^{2}mol^{-1}"],correct:1,exp:"Molar conductivity Λm = κ × 1000/M = (5.76×10^-3 × 1000)/0.5 = 11.52 S cm^2 mol^-1."},
{q:"Given the molar conductances at infinite dilution: KCl = 149.9, KNO_{3} = 145.0, HCl = 426.2, NaOAc = 91.0, NaCl = 126.5 (S cm^{2}mol^{-1}). Calculate Λ°(HOAc) using these values.",options:["517.2","552.7","390.7","217.5"],correct:2,exp:"By Kohlrausch's law, Λ°(HOAc) = Λ°(HCl) + Λ°(NaOAc) - Λ°(NaCl) = 426.2 + 91.0 - 126.5 = 390.7 S cm^2 mol^-1."},
{q:"Faraday's constant is defined as",options:["Charge carried by 1 electron","Charge carried by one mole of electrons","Charge required to deposit one mole of substance","Charge carried by 6.22 × 10^{10} electrons"],correct:1,exp:"A faraday is defined as the charge carried by one mole of electrons (≈96500 C)."},
{q:"How many faradays of electricity are required for the reaction MnO_{4}^{-} → Mn^{2+} to occur?",options:["5F","3F","1F","7F"],correct:0,exp:"MnO4- is reduced to Mn2+, a change in oxidation state from +7 to +2, requiring 5 electrons, i.e. 5 faradays per mole."},
{q:"A current strength of 3.86 A was passed through molten calcium oxide for 41 minutes 40 seconds. The mass of calcium deposited at the cathode is (atomic mass of Ca = 40 g/mol, 1F = 96500 C)",options:["4 g","2 g","8 g","6 g"],correct:1,exp:"Charge passed = 3.86 A × 2500 s = 9650 C = 0.1 mol of electrons; since Ca2+ + 2e- → Ca, this deposits 0.05 mol Ca, i.e. 0.05 × 40 = 2 g."},
{q:"During the electrolysis of molten sodium chloride, the time required to produce 0.1 mole of chlorine gas using a current of 3A is",options:["55 minutes","107.2 minutes","220 minutes","330 minutes"],correct:1,exp:"Producing 0.1 mol Cl2 from 2Cl- → Cl2 + 2e- requires 0.2 mol electrons (19300 C); at 3 A this takes 19300/3 ≈ 6433 s ≈ 107.2 minutes."},
{q:"The number of electrons delivered at the cathode during electrolysis by a current of 1 A in 60 seconds is (charge of electron = 1.6 × 10^{-19} C)",options:["6.22 × 10^{23}","6.022 × 10^{20}","3.75 × 10^{20}","7.48 × 10^{23}"],correct:2,exp:"Charge passed = 1 A × 60 s = 60 C, giving 60/96500 ≈ 6.22×10^-4 mol electrons, or 6.22×10^-4 × 6.022×10^23 ≈ 3.75×10^20 electrons."},
{q:"Which of the following electrolytic solutions has the least specific conductance?",options:["2N","0.002N","0.02N","0.2N"],correct:1,exp:"Specific conductance decreases with dilution, so the most dilute solution, 0.002 N, has the least specific conductance."},
{q:"While charging a lead storage battery",options:["PbSO_{4} on the cathode is reduced to Pb","PbSO_{4} on the anode is oxidised to PbO_{2}","PbSO_{4} on the anode is reduced to Pb","PbSO_{4} on the cathode is oxidised to Pb"],correct:2,exp:"During charging, the lead storage battery reactions are reversed, converting PbSO4 on the anode back to PbO2 (oxidation)."},
{q:"Among the following cells: (I) Leclanche cell (II) Nickel-Cadmium cell (III) Lead storage battery (IV) Mercury cell — the primary cells are",options:["I and IV","I and III","III and IV","II and III"],correct:0,exp:"The Leclanche (dry) cell and the mercury cell are primary cells that cannot be recharged, unlike the nickel-cadmium cell and lead storage battery."},
{q:"Zinc can be coated on iron to produce galvanized iron but the reverse is not possible. It is because",options:["Zinc is lighter than iron","Zinc has a lower melting point than iron","Zinc has a lower negative electrode potential than iron","Zinc has a higher negative electrode potential than iron"],correct:3,exp:"Zinc has a higher (more negative) reduction potential than iron, so it is more easily oxidized and sacrificially protects the iron underneath."},
{q:"Assertion: Pure iron when heated in dry air is converted into a layer of rust. Reason: Rust has the composition Fe_{3}O_{4}.",options:["Both assertion and reason are true and reason is the correct explanation","Both assertion and reason are true but reason is not the correct explanation","Assertion is true but reason is false","Both assertion and reason are false"],correct:3,exp:"Rust actually has the approximate composition Fe2O3.xH2O, not Fe3O4, so both the assertion and reason as stated are false."},
{q:"In the H_{2}-O_{2} fuel cell, the reaction that occurs at the cathode is",options:["O_{2}(g) + 2H_{2}O(l) + 4e^{-} → 4OH^{-}(aq)","H^{+}(aq) + OH^{-}(aq) → H_{2}O(l)","2H_{2}(g) + O_{2}(g) → 2H_{2}O(g)","H^{+}(aq) + e^{-} → 1/2 H_{2}(g)"],correct:0,exp:"At the cathode of the H2-O2 fuel cell, oxygen is reduced: O2(g) + 2H2O(l) + 4e- → 4OH-(aq)."},
{q:"The equivalent conductance of an M/36 solution of a weak monobasic acid is 6 mho cm^{2}equivalent^{-1}, and at infinite dilution it is 400 mho cm^{2}equivalent^{-1}. The dissociation constant of this acid is",options:["1.25 × 10^{-6}","6.25 × 10^{-6}","1.25 × 10^{-4}","6.25 × 10^{-5}"],correct:1,exp:"With degree of dissociation α = λ/λ° = 6/400 = 0.015, Ka ≈ Cα^2 = (1/36) × (0.015)^2 ≈ 6.25×10^-6."},
{q:"A conductivity cell was calibrated with a 0.01M, 1:1 electrolytic solution (specific conductance = 1.25 × 10^{-3} S cm^{-1}) and the measured resistance was 800 Ω at 25°C. The cell constant is",options:["10^{-1} cm^{-1}","10^{1} cm^{-1}","1 cm^{-1}","5.7 × 10^{-12}"],correct:2,exp:"Cell constant = specific conductance × resistance = 1.25×10^-3 S cm^-1 × 800 Ω = 1 cm^-1."},
{q:"The conductivity of a saturated solution of a sparingly soluble salt AB (1:1 electrolyte) at 298 K is 1.85 × 10^{-5} S m^{-1}. Given Λ°_{m}(AB) = 14 × 10^{-3} S m^{2}mol^{-1}, the solubility product of AB at 298 K is",options:["5.7 × 10^{-12}","1.32 × 10^{-12}","7.5 × 10^{-12}","1.74 × 10^{-12}"],correct:3,exp:"Using the measured conductivity to find the solubility (κ/Λ°m) and squaring it gives the solubility product Ksp ≈ 1.74×10^-12."},
{q:"In the electrochemical cell Zn | ZnSO_{4}(0.01M) || CuSO_{4}(1.0M) | Cu, the emf is E_{1}. When the concentration of ZnSO_{4} is changed to 1.0M and CuSO_{4} to 0.01M, the emf changes to E_{2}. The relationship between E_{1} and E_{2} is",options:["E_{1} < E_{2}","E_{1} > E_{2}","E_{2} ≥ E_{1}","E_{1} = E_{2}"],correct:1,exp:"Reversing the concentrations increases the reaction quotient Q for the second cell, which by the Nernst equation lowers the emf, so E1 > E2."},
{q:"Consider the change in oxidation state of bromine corresponding to different emf values (BrO_{4}^{-} → BrO_{3}^{-} → HBrO → Br_{2} → Br^{-}). The species undergoing disproportionation is",options:["Br_{2}","BrO_{4}^{-}","BrO_{3}^{-}","HBrO"],correct:3,exp:"HBrO occupies an intermediate oxidation state of bromine between the higher (BrO3-, BrO4-) and lower (Br2, Br-) states, so it can both oxidize and be oxidized — undergoing disproportionation."},
{q:"For the cell reaction 2Fe^{3+}(aq) + 2I^{-}(aq) → 2Fe^{2+}(aq) + I_{2}(aq), E°_{cell} = 0.24 V at 298 K. The standard Gibbs energy (ΔG°) of the cell reaction is",options:["-46.32 kJ mol^{-1}","-23.16 kJ mol^{-1}","46.32 kJ mol^{-1}","23.16 kJ mol^{-1}"],correct:0,exp:"ΔG° = -nFE°cell = -2 × 96500 × 0.24 ≈ -46320 J mol^-1 = -46.32 kJ mol^-1."},
{q:"A certain current liberated 0.504 g of hydrogen in 2 hours. How many grams of copper can be liberated by the same current flowing for the same time through copper sulphate solution?",options:["31.75","15.8","7.5","63.5"],correct:1,exp:"By Faraday's laws, the same charge liberates chemically equivalent amounts; 0.504 g H2 (0.504 equivalents) liberates 0.504 × 31.75 g ≈ 15.8 g of copper (equivalent weight 31.75)."},
{q:"A gas X at 1 atm is bubbled through a solution containing a mixture of 1M Y^{-} and 1M Z^{-} at 25°C. If the reduction potential of Z > Y > X, then",options:["Y will oxidize X and not Z","Y will oxidize Z and not X","Y will oxidize both X and Z","Y will reduce both X and Z"],correct:0,exp:"Since the reduction potential order is Z > Y > X, Y can oxidize the weaker oxidant X (lower reduction potential) but cannot oxidize Z, which has a higher reduction potential than Y."},
{q:"For the cell reaction A + 2B^{+} → A^{2+} + 2B; given A^{2+} + 2e^{-} → A, E° = +0.34 V and log_{10}K = 15.6 at 300 K for the cell reaction, find E° for B^{+} + e^{-} → B.",options:["0.80","1.26","-0.54","-10.94"],correct:0,exp:"Using E°cell = (2.303RT/nF)logK with n = 2 and logK = 15.6 gives E°cell ≈ 0.46 V; since E°cell = E°(B+/B) - E°(A2+/A) and E°(A2+/A) = 0.34 V, E°(B+/B) ≈ 0.80 V."}
];
const CH10_SURFACE = [
{q:"For a Freundlich isotherm, a graph of log(x/m) is plotted against log p. The slope and y-axis intercept respectively correspond to",options:["1/n, k","log(1/n), k","1/n, log k","log(1/n), log k"],correct:2,exp:"The Freundlich isotherm log(x/m) = log k + (1/n)log p is linear, with slope 1/n and y-intercept log k."},
{q:"Which of the following is incorrect for physisorption?",options:["Reversible","Increases with increase in temperature","Low heat of adsorption","Increases with increase in surface area"],correct:1,exp:"Physisorption is exothermic and driven by weak van der Waals forces, so it actually decreases as temperature increases, making that statement the incorrect one."},
{q:"Which one of the following characteristics is associated with adsorption?",options:["ΔG and ΔH are negative but ΔS is positive","ΔG and ΔS are negative but ΔH is positive","ΔG is negative but ΔH and ΔS are positive","ΔG, ΔH and ΔS are all negative"],correct:3,exp:"Adsorption is spontaneous (ΔG negative) and exothermic (ΔH negative), while randomness decreases as gas molecules settle onto the surface, making ΔS negative too."},
{q:"Fog is a colloidal solution of",options:["Solid in gas","Gas in gas","Liquid in gas","Gas in liquid"],correct:2,exp:"Fog is a colloidal dispersion of liquid droplets in a gas (air)."},
{q:"Assertion: The coagulation power of Al^{3+} is more than Na^{+}. Reason: The greater the valency of the flocculating ion added, the greater its power to cause precipitation.",options:["Both assertion and reason are true and reason is the correct explanation","Both assertion and reason are true but reason is not the correct explanation","Assertion is true but reason is false","Both assertion and reason are false"],correct:0,exp:"By the Hardy-Schulze rule, the coagulating power of a flocculating ion increases sharply with its valency, so Al3+ coagulates far more effectively than Na+."},
{q:"To stop bleeding from an injury, ferric chloride can be applied. Which comment about this is justified?",options:["It is not true; ferric chloride is a poison","It is true; Fe^{3+} ions coagulate blood, which is a negatively charged sol","It is not true; ferric chloride is ionic and gets into the blood stream","It is true; coagulation happens due to a negatively charged sol with Cl^{-}"],correct:1,exp:"Blood is a negatively charged sol; the Fe3+ ions from ferric chloride neutralize this charge and coagulate the blood, stopping bleeding."},
{q:"Hair cream is a/an",options:["Gel","Emulsion","Solid sol","Sol"],correct:1,exp:"Hair cream is a dispersion of oil and water stabilized together, making it an emulsion."},
{q:"Which one of the following is correctly matched?",options:["Emulsion - Smoke","Gel - Butter","Foam - Mist","Whipped cream - Sol"],correct:1,exp:"Butter is a semi-solid dispersion of a liquid in a solid, which is characteristic of a gel."},
{q:"The most effective electrolyte for the coagulation of an As_{2}S_{3} sol is",options:["NaCl","Ba(NO_{3})_{2}","K_{3}[Fe(CN)_{6}]","Al_{2}(SO_{4})_{3}"],correct:3,exp:"By the Hardy-Schulze rule, the highest-valency counter-ion is most effective; Al2(SO4)3 provides Al3+, the highest charge cation among the options, making it most effective against the negative As2S3 sol."},
{q:"Which one of the following is not a surfactant?",options:["CH_{3}(CH_{2})_{15}N^{+}(CH_{3})_{3}Br^{-}","CH_{3}(CH_{2})_{15}NH_{2}","CH_{3}(CH_{2})_{16}CH_{2}OSO_{3}^{-}Na^{+}","OHC(CH_{2})_{14}CH_{2}COO^{-}Na^{+}"],correct:1,exp:"A simple long-chain primary amine lacks the polar/ionic head group combined with a nonpolar tail needed for strong surface activity, unlike the charged head groups in the other listed compounds."},
{q:"The phenomenon observed when a beam of light is passed through a colloidal solution is",options:["Cataphoresis","Electrophoresis","Coagulation","Tyndall effect"],correct:3,exp:"When a beam of light passed through a colloidal solution is scattered by the dispersed particles, this visible light path is called the Tyndall effect."},
{q:"In an electrical field, the particles of a colloidal system move towards the cathode. The coagulation of the same sol is studied using K_{2}SO_{4}(i), Na_{3}PO_{4}(ii), K_{4}[Fe(CN)_{6}](iii) and NaCl(iv). Their coagulating power order should be",options:["II > I > IV > III","III > II > I > IV","I > II > III > IV","None of these"],correct:1,exp:"Since the particles migrate to the cathode, the sol is positively charged, so anions coagulate it; by the Hardy-Schulze rule, higher anion valency gives greater coagulating power, in the order [Fe(CN)6]4- > PO4^3- > SO4^2- > Cl-."},
{q:"Collodion is a 4% solution of which one of the following compounds in an alcohol-ether mixture?",options:["Nitroglycerine","Cellulose acetate","Glycol dinitrate","Nitrocellulose"],correct:3,exp:"Collodion is a 4% solution of nitrocellulose in a mixture of alcohol and ether."},
{q:"Which one of the following is an example of homogeneous catalysis?",options:["Manufacture of ammonia by Haber's process","Manufacture of sulphuric acid by the contact process","Hydrogenation of oil","Hydrolysis of sucrose in the presence of dilute HCl"],correct:3,exp:"In the acid-catalysed hydrolysis of sucrose, both the catalyst (dilute HCl) and the reactant are in the same (liquid) phase, making it homogeneous catalysis."},
{q:"Match the following: (A) V_{2}O_{5}, (B) Ziegler-Natta catalyst, (C) Peroxide, (D) Finely divided Fe — with the process they catalyse: (i) High density polyethylene, (ii) Polymerisation to PAN, (iii) NH_{3} synthesis, (iv) H_{2}SO_{4} manufacture (contact process). Choose the correct match.",options:["A-iv, B-i, C-ii, D-iii","A-i, B-ii, C-iv, D-iii","A-ii, B-iii, C-iv, D-i","A-iii, B-iv, C-ii, D-i"],correct:0,exp:"V2O5 catalyses the contact process (H2SO4), the Ziegler-Natta catalyst is used for high density polyethylene, peroxides initiate PAN polymerisation, and finely divided iron catalyses ammonia synthesis (Haber process)."},
{q:"The coagulation values (in millimoles per litre) of electrolytes used for the coagulation of As_{2}S_{3} are: NaCl = 52, BaCl_{2} = 0.69, MgSO_{4} = 0.22. The correct order of their coagulating power is",options:["MgSO_{4} > BaCl_{2} > NaCl","NaCl > BaCl_{2} > MgSO_{4}","NaCl > MgSO_{4} > BaCl_{2}","BaCl_{2} > MgSO_{4} > NaCl"],correct:0,exp:"A lower coagulation value means a more effective electrolyte, so the order of coagulating power (based on the given values) is MgSO4 > BaCl2 > NaCl."},
{q:"Adsorption of a gas on a solid metal surface is spontaneous and exothermic; then",options:["ΔH increases","ΔS increases","ΔG increases","ΔS decreases"],correct:3,exp:"Adsorption of gas molecules onto a surface reduces the freedom/randomness of the gas molecules, so the entropy change (ΔS) is negative."},
{q:"If x is the amount of adsorbate and m is the amount of adsorbent, which of the following relations is not related to the adsorption process?",options:["x/m = f(P) at constant T","x/m = f(T) at constant P","P = f(T) at constant x/m","x/m = PT"],correct:3,exp:"The relation x/m = PT does not correspond to a physically meaningful adsorption isotherm relation, unlike the pressure- and temperature-dependence relations in the other options."},
{q:"On which of the following properties does the coagulating power of an ion depend?",options:["Both the magnitude and sign of the charge on the ion","Size of the ion alone","The magnitude of the charge on the ion alone","The sign of charge on the ion alone"],correct:0,exp:"The coagulating power of an ion depends on both the magnitude of its charge (per the Hardy-Schulze rule) and its sign matching the sol's opposite charge."},
{q:"Match the following: (A) Pure nitrogen, (B) Haber process, (C) Contact process, (D) Deacon's process — with: (i) Sodium/Barium azide, (ii) Sulphuric acid, (iii) Ammonia, (iv) Chlorine. Choose the correct option.",options:["A-i, B-ii, C-iii, D-iv","A-ii, B-iv, C-i, D-iii","A-iii, B-iv, C-ii, D-i","A-iv, B-iii, C-ii, D-i"],correct:3,exp:"Matching each process to its product: chlorine from Deacon's process, ammonia from the Haber process, sulphuric acid from the contact process, and pure nitrogen from the thermal decomposition of sodium or barium azide."}
];
const CH11_HYDROXY = [
{q:"An alcohol X gives a blue colour in the Victor Meyer's test. 3.7 g of X, when treated with metallic sodium, liberates 560 mL of hydrogen at 273 K and 1 atm pressure. What is the possible structure of X?",options:["CH_{3}CH(OH)CH_{2}CH_{3}","CH_{3}CH(OH)CH_{3}","(CH_{3})_{3}C-OH","CH_{3}CH_{2}CH(OH)CH_{2}CH_{3}"],correct:0,exp:"From the H2 liberated with sodium (0.025 mol H2, so 0.05 mol -OH groups) and the mass given, X has molar mass 74, corresponding to butan-2-ol, CH3CH(OH)CH2CH3, a secondary alcohol consistent with the blue Victor Meyer test."},
{q:"Which of the following compounds on reaction with methyl magnesium bromide will give a tertiary alcohol?",options:["Benzaldehyde","Propanoic acid","Methyl propanoate","Acetaldehyde"],correct:2,exp:"An ester like methyl propanoate reacts with two equivalents of Grignard reagent, giving a tertiary alcohol after the second addition."},
{q:"1-Pentene is treated with (i) B_{2}H_{6} (ii) H_{2}O_{2}/OH^{-}. The anti-Markovnikov product X is",options:["CH_{3}CH_{2}CH_{2}CH_{2}CH_{2}OH","CH_{3}CH_{2}CH_{2}CH(OH)CH_{3}","CH_{3}CH_{2}CH(OH)CH_{2}CH_{3}","(CH_{3})_{2}CHCH_{2}CH_{2}OH"],correct:0,exp:"Hydroboration-oxidation adds H and OH in an anti-Markovnikov fashion, placing -OH on the less substituted (terminal) carbon to give pentan-1-ol."},
{q:"In the reaction sequence: Ethane → (Cl_{2}) → A → (H_{2}O) → ethane-1,2-diol, A and the second reagent respectively are",options:["Chloroethane and NaOH","Ethanol and H_{2}SO_{4}","2-chloroethan-1-ol and NaHCO_{3}","Ethanol and H_{2}O"],correct:2,exp:"Ethane must first be converted to a chloroalcohol (2-chloroethan-1-ol) as intermediate A, which on hydrolysis with mild aqueous base gives ethane-1,2-diol."},
{q:"Which one of the following is the strongest acid among the substituted phenols?",options:["2-nitrophenol","4-chlorophenol","4-nitrophenol","3-nitrophenol"],correct:2,exp:"The nitro group's strong electron-withdrawing resonance effect at the para position most effectively stabilizes the phenoxide ion, making 4-nitrophenol the strongest acid among these substituted phenols."},
{q:"Benzyl alcohol (C_{6}H_{5}CH_{2}OH) on treatment with concentrated H_{2}SO_{4} predominantly gives",options:["Toluene via an unstable carbocation","A stabilized benzylic carbocation leading to substitution/elimination products","Benzoic acid","Benzaldehyde"],correct:1,exp:"Protonation of the -OH group in benzyl alcohol by concentrated H2SO4 generates a resonance-stabilized benzylic carbocation, which goes on to substitution/elimination products."},
{q:"Carbolic acid is",options:["Phenol","Picric acid","Benzoic acid","Phenylacetic acid"],correct:0,exp:"Carbolic acid is the common name for phenol."},
{q:"Which one of the following will react with phenol to give salicylaldehyde after hydrolysis?",options:["Dichloromethane","Trichloroethane","Trichloromethane (CHCl_{3}/NaOH)","CO_{2}"],correct:2,exp:"Phenol treated with chloroform and NaOH undergoes the Reimer-Tiemann reaction, introducing a -CHO group ortho to the -OH to give salicylaldehyde."},
{q:"(CH_{3})_{3}C-CH(OH)-CH_{3}, on treatment with concentrated H_{2}SO_{4}, gives the major product X, which is",options:["(CH_{3})_{3}C-CH=CH_{2}","(CH_{3})_{2}C=C(CH_{3})_{2}","CH_{2}=C(CH_{3})CH_{2}CH_{2}CH_{3}","CH_{2}=C(CH_{3})CH(CH_{3})CH_{3}"],correct:1,exp:"Protonation and loss of water from this secondary alcohol is followed by a methyl shift to the more stable tertiary carbocation, giving the more substituted alkene (CH3)2C=C(CH3)2 as the major product."},
{q:"The correct IUPAC name of the compound H_{3}C-CH(CH_{3})-CH(CH_{3})-CH(Cl)-CH_{2}OH is",options:["4-chloro-2,3-dimethylpentan-1-ol","2,3-dimethyl-4-chloropentan-1-ol","2,3,4-trimethyl-4-chlorobutan-1-ol","4-chloro-2,3,4-trimethylpentan-1-ol"],correct:0,exp:"Numbering the longest chain from the end nearer the -OH group and naming the substituents gives 4-chloro-2,3-dimethylpentan-1-ol."},
{q:"Assertion: Phenol is more acidic than ethanol. Reason: The phenoxide ion is resonance stabilized.",options:["Both assertion and reason are true and reason is the correct explanation","Both assertion and reason are true but reason is not the correct explanation","Assertion is true but reason is false","Both assertion and reason are false"],correct:0,exp:"Phenol is more acidic than ethanol because the phenoxide ion formed on deprotonation is stabilized by resonance delocalization into the ring."},
{q:"In the reaction sequence ethanol → (PCl_{5}) → chloroethane (X) → (alc. KOH) → ethene (Y) → (H_{2}SO_{4}/H_{2}O) → Z, the final product Z is",options:["Ethane","Ethoxyethane","Ethyl bisulphite","Ethanol"],correct:3,exp:"Acid-catalysed hydration of ethene (Markovnikov addition of water) regenerates ethanol as the final product Z."},
{q:"The reaction: cyclic alcohol + NaOH → sodium alkoxide, then + CH_{3}I → methyl ether, can be classified as",options:["Dehydration","Williamson alcohol synthesis","Williamson ether synthesis","Dehydrogenation of alcohol"],correct:2,exp:"An alkoxide reacting with an alkyl halide (here CH3I) to form an ether is the Williamson ether synthesis."},
{q:"Isopropylbenzene (cumene) on air oxidation in the presence of dilute acid gives",options:["C_{6}H_{5}COOH","C_{6}H_{5}COCH_{3}","C_{6}H_{5}COC_{6}H_{5}","C_{6}H_{5}OH"],correct:3,exp:"In the cumene process, isopropylbenzene is air-oxidized to cumene hydroperoxide, which on acid treatment rearranges and cleaves to give phenol (and acetone)."},
{q:"Assertion: Phenol is more reactive than benzene towards electrophilic substitution. Reason: In phenol, the intermediate arenium ion is more stabilized by resonance.",options:["Both assertion and reason are true and reason is the correct explanation","Both assertion and reason are true but reason is not the correct explanation","Assertion is true but reason is false","Both assertion and reason are false"],correct:0,exp:"Phenol's -OH group donates electron density into the ring by resonance, stabilizing the arenium ion intermediate in electrophilic substitution, so both statements are true and the reason correctly explains the assertion."},
{q:"HOCH_{2}CH_{2}OH on heating with periodic acid (HIO_{4}) gives",options:["Methanoic acid","Glyoxal (OHC-CHO)","Methanal (HCHO)","CO_{2}"],correct:2,exp:"Periodic acid cleaves the C-C bond of a vicinal diol like ethane-1,2-diol, converting each -CH2OH into a molecule of methanal (formaldehyde)."},
{q:"Which of the following compounds can be used as antifreeze in automobile radiators?",options:["Methanol","Ethanol","Neopentyl alcohol","Ethane-1,2-diol"],correct:3,exp:"Ethane-1,2-diol (ethylene glycol) has a low freezing point in water mixtures, making it the standard automobile antifreeze."},
{q:"The reaction of an alcohol with NaOH followed by CH_{3}I to give the corresponding methyl ether is an example of",options:["Wurtz reaction","A cyclic addition reaction","Williamson ether synthesis","Kolbe's reaction"],correct:2,exp:"Converting an alcohol to its sodium alkoxide with NaOH, then reacting with an alkyl halide like CH3I, is the Williamson ether synthesis."},
{q:"One mole of an organic compound (A) with the formula C_{3}H_{8}O reacts completely with two moles of HI to form X and Y. When Y is boiled with aqueous alkali it forms Z, which answers the iodoform test. The compound (A) is",options:["Propan-2-ol","Propan-1-ol","Ethoxyethane","Methoxyethane"],correct:3,exp:"The compound methoxyethane (CH3-O-CH2CH3) reacts with 2 mol HI to cleave the ether, and the resulting ethanol fragment, on oxidation/base treatment, gives a product that answers the iodoform test."},
{q:"Among the following ethers, which one will produce methyl alcohol on treatment with hot HI?",options:["(CH_{3})_{3}C-O-CH_{3}","(CH_{3})_{2}CH-CH_{2}-O-CH_{3}","CH_{3}(CH_{2})_{2}-O-CH_{3}","CH_{3}CH_{2}CH(CH_{3})-O-CH_{3}"],correct:0,exp:"tert-Butyl methyl ether cleaves via an SN1 pathway at the tertiary carbon with hot HI, releasing methanol and tert-butyl iodide."},
{q:"Williamson synthesis of preparing dimethyl ether is a/an",options:["SN1 reaction","SN2 reaction","Electrophilic addition","Electrophilic substitution"],correct:1,exp:"The Williamson ether synthesis proceeds by a bimolecular nucleophilic substitution (SN2) of the alkoxide ion on the alkyl halide."},
{q:"On reacting with neutral ferric chloride, phenol gives",options:["Red colour","Violet colour","Dark green colour","No colouration"],correct:1,exp:"Phenol gives a characteristic violet colouration with neutral ferric chloride solution, a classic test for the phenolic -OH group."}
];
const CH12_CARBONYL = [
{q:"Cyclohex-2-en-1-one is treated with H_{2} gas (1 atm), Pd/C in ethanol. The correct structure of the product A formed is",options:["Cyclohexanol","Cyclohexanone","Cyclohexene","Phenol"],correct:1,exp:"Catalytic hydrogenation with Pd/C at 1 atm selectively reduces the C=C double bond while leaving the ketone C=O intact, giving cyclohexanone."},
{q:"The formation of cyanohydrin from acetone is an example of",options:["Nucleophilic substitution","Electrophilic substitution","Electrophilic addition","Nucleophilic addition"],correct:3,exp:"HCN adding across the polarized C=O bond of acetone to form a cyanohydrin is a classic example of nucleophilic addition."},
{q:"Reaction of acetone with one of the following reagents involves nucleophilic addition followed by elimination of water. The reagent is",options:["Grignard reagent","Sn/HCl","Hydrazine in the presence of a slightly acidic solution","Hydrocyanic acid"],correct:2,exp:"Hydrazine under mildly acidic conditions first adds to the carbonyl and then eliminates water, forming a hydrazone (addition-elimination/condensation)."},
{q:"HC≡CH is treated with dilute H_{2}SO_{4}/HgSO_{4} to give product X (Kucherov reaction). Product X will not give",options:["Tollens' test","Victor Meyer test","Iodoform test","Fehling's test"],correct:1,exp:"The Kucherov reaction converts acetylene to acetaldehyde (X); as a simple aldehyde without the required structural features, it does not give a positive Victor Meyer test."},
{q:"CH_{2}=CH_{2} is treated with (i) O_{3} (ii) Zn/H_{2}O to give X, which is then treated with NH_{3} to give Y. Y is",options:["Formaldehyde","Diacetone ammonia","Hexamethylenetetramine","An oxime"],correct:2,exp:"Ozonolysis of ethene gives formaldehyde (X), and formaldehyde condensing with ammonia forms hexamethylenetetramine (Y)."},
{q:"Predict the product Z in the sequence: ethanoic acid → (PCl_{5}) → X → (anhydrous AlCl_{3}, C_{6}H_{6}) → Y → (i) CH_{3}MgBr (ii) H_{3}O^{+} → Z.",options:["(CH_{3})_{2}C(OH)C_{6}H_{5}","CH_{3}CH(OH)C_{6}H_{5}","CH_{3}CH(OH)CH_{2}CH_{3}","C_{6}H_{5}CH_{2}OH"],correct:0,exp:"Converting the acid to acetyl chloride (X) via PCl5, then Friedel-Crafts acylation on benzene gives acetophenone (Y), which reacts with CH3MgBr and then H3O+ to form the tertiary alcohol (CH3)2C(OH)C6H5."},
{q:"Assertion: 2,2-dimethylpropanoic acid does not give the HVZ reaction. Reason: 2,2-dimethylpropanoic acid does not have an α-hydrogen atom.",options:["Both assertion and reason are true and reason is the correct explanation","Both assertion and reason are true but reason is not the correct explanation","Assertion is true but reason is false","Both assertion and reason are false"],correct:0,exp:"2,2-Dimethylpropanoic acid has no α-hydrogen atom (the α-carbon bears only methyl groups), so it cannot undergo the Hell-Volhard-Zelinsky reaction."},
{q:"Which of the following represents the correct order of acidity in haloacetic acids?",options:["FCH_{2}COOH > CH_{3}COOH > BrCH_{2}COOH > ClCH_{2}COOH","FCH_{2}COOH > ClCH_{2}COOH > BrCH_{2}COOH > CH_{3}COOH","CH_{3}COOH > ClCH_{2}COOH > FCH_{2}COOH > BrCH_{2}COOH","ClCH_{2}COOH > CH_{3}COOH > BrCH_{2}COOH > ICH_{2}COOH"],correct:1,exp:"Fluorine's strong electronegativity gives the strongest -I effect, making the acidity order FCH2COOH > ClCH2COOH > BrCH2COOH > CH3COOH."},
{q:"Benzoic acid is treated with (i) NH_{3} (ii) NaOBr to give A, then with NaNO_{2}/HCl to give C. C is",options:["Anilinium chloride","o-Nitroaniline","Benzene diazonium chloride","m-Nitrobenzoic acid"],correct:2,exp:"Benzamide undergoes Hofmann bromamide degradation to aniline (A), which is then diazotized with NaNO2/HCl to give benzene diazonium chloride (C)."},
{q:"Ethanoic acid on reaction with P/Br_{2} gives 2-bromoethanoic acid. This reaction is called",options:["Finkelstein reaction","Haloform reaction","Hell-Volhard-Zelinsky reaction","None of these"],correct:2,exp:"Treating a carboxylic acid with P/Br2 to introduce an α-bromo substituent is the Hell-Volhard-Zelinsky reaction."},
{q:"CH_{3}Br is treated with (A) KCN, then (B) H_{3}O^{+}, then (C) PCl_{5}. Product (C) is",options:["Acetyl chloride","Chloroacetic acid","α-chlorocyanoethanoic acid","None of these"],correct:0,exp:"CH3Br converted via cyanide substitution and hydrolysis gives acetic acid, which then reacts with PCl5 to form acetyl chloride."},
{q:"Which one of the following reduces Tollens' reagent?",options:["Formic acid","Acetic acid","Benzophenone","None of these"],correct:0,exp:"Formic acid has an aldehyde-like -CHO group within its structure, allowing it to reduce Tollens' reagent, unlike acetic acid."},
{q:"Bromobenzene is treated with (i) Mg, ether to give A, then (ii) CO_{2} followed by H_{3}O^{+} to give B. B is",options:["Phenol","Benzoic acid","Benzaldehyde","Acetophenone"],correct:1,exp:"Bromobenzene forms a Grignard reagent (A) with Mg, which reacts with CO2 and then H3O+ to give benzoic acid (B)."},
{q:"The IUPAC name of CH_{2}=CH-CH_{2}-COOH is",options:["But-3-enoic acid","But-1-ene-4-oic acid","But-2-ene-1-oic acid","But-3-ene-1-oic acid"],correct:0,exp:"Numbering from the carboxylic acid carbon, CH2=CH-CH2-COOH is named but-3-enoic acid."},
{q:"Identify the product formed when a ketone is treated with N_{2}H_{4}/C_{2}H_{5}ONa (Wolff-Kishner conditions)",options:["The corresponding alcohol","The corresponding amine","The corresponding carboxylic acid","The corresponding methylene (CH_{2}) compound"],correct:3,exp:"Wolff-Kishner reduction (with hydrazine and base) converts a ketone's C=O group fully into a CH2 (methylene) group."},
{q:"In which case is a chiral carbon not generated by reaction with HCN?",options:["Acetone (a symmetric ketone)","Butan-2-one","Phenyl methyl ketone","Benzaldehyde"],correct:0,exp:"Acetone is a symmetric ketone with two identical methyl groups, so addition of HCN across its carbonyl does not create a stereocenter."},
{q:"Assertion: p-N,N-dimethylaminobenzaldehyde undergoes benzoin condensation. Reason: The aldehydic (-CHO) group is meta directing.",options:["Both assertion and reason are true and reason is the correct explanation","Both assertion and reason are true but reason is not the correct explanation","Assertion is true but reason is false","Both assertion and reason are false"],correct:1,exp:"The aldehydic (-CHO) group is actually ortho/para directing (not meta directing), so while the assertion may hold, the reason given is false."},
{q:"Which one of the following reactions is an example of a disproportionation reaction?",options:["Aldol condensation","Cannizzaro reaction","Benzoin condensation","None of these"],correct:1,exp:"The Cannizzaro reaction, where one molecule of an aldehyde without α-hydrogen is oxidized while another is reduced, is a classic disproportionation reaction."},
{q:"Which one of the following undergoes reaction with 50% sodium hydroxide solution to give the corresponding alcohol and acid?",options:["Phenylmethanal","Ethanal","Ethanol","Methanol"],correct:0,exp:"Phenylmethanal (benzaldehyde) has no α-hydrogen, so with 50% NaOH it undergoes the Cannizzaro reaction, giving both an alcohol and an acid."},
{q:"The reagent used to distinguish between acetaldehyde and benzaldehyde is",options:["Tollens' reagent","Fehling's solution","2,4-dinitrophenylhydrazine","Semicarbazide"],correct:1,exp:"Fehling's solution reduces with aliphatic aldehydes like acetaldehyde but not with aromatic aldehydes like benzaldehyde, distinguishing the two."},
{q:"Phenylmethanal is reacted with concentrated NaOH to give two products X and Y (Cannizzaro reaction). X reacts with metallic sodium to liberate hydrogen. X and Y are",options:["Sodium benzoate and phenol","Sodium benzoate and phenylmethanol","Phenylmethanol and sodium benzoate","None of these"],correct:2,exp:"In the Cannizzaro reaction, benzaldehyde disproportionates into sodium benzoate and phenylmethanol (benzyl alcohol); the alcohol product (X) reacts with sodium metal to release hydrogen."},
{q:"In which of the following reactions is a new carbon-carbon bond not formed?",options:["Aldol condensation","Friedel-Crafts reaction","Kolbe's reaction","Wolff-Kishner reduction"],correct:3,exp:"Wolff-Kishner reduction only replaces a C=O with C-H2 bonds and forms no new carbon-carbon bond, unlike aldol condensation, Friedel-Crafts, or Kolbe's reaction."},
{q:"An alkene A, on reaction with O_{3} and Zn/H_{2}O, gives propanone and ethanal in equimolar ratio (A is 2-methylbut-2-ene). Addition of HCl to A gives B as the major (Markovnikov) product. The structure of B is",options:["ClCH_{2}CH_{2}CH(CH_{3})CH_{2}Cl","CH_{3}CH_{2}CH(Cl)CH_{3}","CH_{3}CH_{2}C(Cl)(CH_{3})_{2}","CH_{3}CH(Cl)CH(CH_{3})_{2}"],correct:2,exp:"Ozonolysis of 2-methylbut-2-ene gives propanone and ethanal; Markovnikov addition of HCl places Cl on the more substituted carbon, giving CH3CH2C(Cl)(CH3)2."},
{q:"Carboxylic acids have higher boiling points than aldehydes, ketones and even alcohols of comparable molecular mass. It is due to their",options:["More extensive association via van der Waals forces","Formation of a carboxylate ion","Formation of intramolecular H-bonding","Formation of intermolecular H-bonding"],correct:3,exp:"Carboxylic acids form strong intermolecular hydrogen-bonded dimers, which raises their boiling points above those of aldehydes, ketones and alcohols of similar mass."}
];
const CH13_NITROGEN = [
{q:"Which of the following reagents can be used to convert nitrobenzene to aniline?",options:["Sn/HCl","Zn-Hg/NaOH","LiAlH_{4}","All of these"],correct:0,exp:"Sn and concentrated HCl reduce the nitro group of nitrobenzene to give aniline."},
{q:"The method by which aniline cannot be prepared is",options:["Degradation of benzamide with Br_{2}/NaOH","Potassium salt of phthalimide treated with chlorobenzene followed by hydrolysis","Hydrolysis of phenylcyanide with acidic solution","Reduction of nitrobenzene by Sn/HCl"],correct:1,exp:"The Gabriel phthalimide synthesis requires an alkyl halide (SN2 pathway), so treating potassium phthalimide with chlorobenzene (an aryl halide) does not work to prepare aniline."},
{q:"Which one of the following will not undergo the Hofmann bromamide reaction?",options:["CH_{3}CONHCH_{3}","CH_{3}CH_{2}CONH_{2}","CH_{3}CONH_{2}","C_{6}H_{5}CONH_{2}"],correct:0,exp:"The Hofmann bromamide degradation requires an unsubstituted primary amide (RCONH2); CH3CONHCH3 is N-substituted and so does not undergo this reaction."},
{q:"Assertion: Acetamide on reaction with KOH and bromine gives acetic acid. Reason: Bromine catalyses the hydrolysis of acetamide.",options:["Both assertion and reason are true and reason is the correct explanation","Both assertion and reason are true but reason is not the correct explanation","Assertion is true but reason is false","Both assertion and reason are false"],correct:3,exp:"Acetamide treated with Br2/KOH undergoes Hofmann degradation to give methanamine, not acetic acid, so both the assertion and the reason are false."},
{q:"In the sequence CH_{3}CH_{2}Br → (aq. NaOH, Δ) A → (KMnO_{4}/H^{+}, Δ) B → (NH_{3}, Δ) C → (Br_{2}/NaOH, Δ) D, D is",options:["Bromomethane","α-bromo sodium acetate","Methanamine","Acetamide"],correct:2,exp:"Following the reaction sequence through oxidation, ammonolysis and Hofmann degradation of the resulting amide, the final product D is methanamine."},
{q:"Which one of the following nitro compounds does not react with nitrous acid?",options:["CH_{3}-CH_{2}-CH_{2}-NO_{2}","(CH_{3})_{2}CH-CH_{2}NO_{2}","(CH_{3})_{3}C-NO_{2}","CH_{3}-CH(NO_{2})-OCH_{3}"],correct:2,exp:"Tertiary nitroalkanes like (CH3)3C-NO2 have no α-hydrogen, so they cannot react with nitrous acid the way primary or secondary nitroalkanes do."},
{q:"Aniline plus benzoyl chloride in the presence of NaOH gives C_{6}H_{5}-NH-COC_{6}H_{5}. This reaction is known as",options:["Friedel-Crafts reaction","HVZ reaction","Schotten-Baumann reaction","None of these"],correct:2,exp:"Aniline reacting with benzoyl chloride in the presence of base to form an anilide is known as the Schotten-Baumann reaction."},
{q:"The product formed by the reaction of an aldehyde with a primary amine is",options:["Carboxylic acid","Aromatic acid","Schiff's base","Ketone"],correct:2,exp:"An aldehyde reacting with a primary amine forms an imine, commonly called a Schiff's base."},
{q:"Which of the following reactions is not correct?",options:["CH_{3}CH_{2}NH_{2} + HNO_{2} → CH_{3}CH_{2}OH + N_{2}","(CH_{3})_{2}NH + NaNO_{2}/HCl → (CH_{3})_{2}N-N=O","CH_{3}CONH_{2} + Br_{2}/NaOH → CH_{3}NH_{2}","Aniline + (CH_{3}CO)_{2}O → acetanilide"],correct:1,exp:"Checking each transformation against known amine and amide chemistry identifies the listed statement as inconsistent with the expected reaction outcome."},
{q:"When aniline reacts with acetic anhydride the product formed is",options:["o-aminoacetophenone","m-aminoacetophenone","p-aminoacetophenone","Acetanilide"],correct:3,exp:"Aniline reacting with acetic anhydride is acetylated at nitrogen to give acetanilide."},
{q:"The order of basic strength for methyl-substituted amines in aqueous solution is",options:["N(CH_{3})_{3} > N(CH_{3})_{2}H > N(CH_{3})H_{2} > NH_{3}","N(CH_{3})H_{2} > N(CH_{3})_{2}H > N(CH_{3})_{3} > NH_{3}","NH_{3} > N(CH_{3})H_{2} > N(CH_{3})_{2}H > N(CH_{3})_{3}","N(CH_{3})_{2}H > N(CH_{3})H_{2} > N(CH_{3})_{3} > NH_{3}"],correct:3,exp:"Steric hindrance and solvation effects in aqueous solution give methylamines the basicity order N(CH3)2H > N(CH3)H2 > N(CH3)3 > NH3."},
{q:"Benzene diazonium chloride is converted to benzene using reagent A. A is",options:["H_{3}PO_{2} and H_{2}O","H^{+}/H_{2}O","HgSO_{4}/H_{2}SO_{4}","Cu_{2}Cl_{2}"],correct:0,exp:"H3PO2 and water reduce a benzene diazonium salt, replacing the -N2+ group with hydrogen to give benzene."},
{q:"In the sequence C_{6}H_{5}NO_{2} → (Fe/HCl) A → (NaNO_{2}/HCl, 273K) B → (H_{2}O, Δ) C, C is",options:["C_{6}H_{5}-OH","C_{6}H_{5}-CH_{2}OH","C_{6}H_{5}-CHO","C_{6}H_{5}NH_{2}"],correct:0,exp:"Nitrobenzene is reduced to aniline (A), diazotized at low temperature to the diazonium salt (B), which on warming with water hydrolyses to phenol (C)."},
{q:"Nitrobenzene on reaction with concentrated HNO_{3}/H_{2}SO_{4} at 80-100°C forms which one of the following products?",options:["1,4-dinitrobenzene","2,4,6-trinitrobenzene","1,2-dinitrobenzene","1,3-dinitrobenzene"],correct:3,exp:"Since the nitro group is deactivating and meta-directing, further nitration of nitrobenzene occurs at the meta position, giving 1,3-dinitrobenzene."},
{q:"C_{5}H_{13}N reacts with HNO_{2} to give an optically active compound. The compound is",options:["Pentan-1-amine","Pentan-2-amine","N,N-dimethylpropan-2-amine","N-methylbutan-2-amine"],correct:1,exp:"Pentan-2-amine has a stereocenter; diazotization with nitrous acid replaces -NH2 while retaining the chiral centre, giving an optically active product."},
{q:"Secondary nitroalkanes react with nitrous acid to form",options:["A red solution","A blue solution","A green solution","A yellow solution"],correct:1,exp:"Secondary nitroalkanes react with nitrous acid to form a pseudonitrole that gives a characteristic blue colouration."},
{q:"Which of the following amines does not undergo acetylation?",options:["t-butylamine","Ethylamine","Diethylamine","Triethylamine"],correct:3,exp:"Triethylamine, a tertiary amine, has no N-H hydrogen available for the acylation reaction, so it cannot undergo acetylation."},
{q:"Which one of the following is most basic?",options:["2,4-dichloroaniline","2,4-dimethylaniline","2,4-dinitroaniline","2,4-dibromoaniline"],correct:1,exp:"Electron-donating methyl groups in 2,4-dimethylaniline increase the availability of the nitrogen lone pair, making it more basic than the halogen- or nitro-substituted anilines."},
{q:"When p-nitrosonitrobenzene-type dinitro compound is reduced with Sn/HCl, the pair of compounds formed are",options:["Ethanol, hydroxylamine hydrochloride","Ethanol, ammonium hydroxide","Ethanol, NH_{4}OH","C_{3}H_{5}NH_{2}, H_{2}O"],correct:0,exp:"Reduction of this dinitro/nitroso aromatic compound with Sn/HCl gives the corresponding amino alcohol along with hydroxylamine hydrochloride as by-products."},
{q:"The IUPAC name for the amine (CH_{3})_{2}N-C(CH_{3})(C_{2}H_{5})-CH_{2}CH_{3} is",options:["3-Dimethylamino-3-methylpentane","3-(N,N-triethyl)-3-aminopentane","3-N,N-trimethylpentanamine","3-(N,N-dimethylamino)-3-methylpentane"],correct:3,exp:"Naming the parent pentane chain with the two methyl groups on N and the branch point gives 3-(N,N-dimethylamino)-3-methylpentane."},
{q:"Benzonitrile (C_{6}H_{5}CN) is treated with CH_{3}MgBr followed by H_{3}O^{+} to give product P. P is",options:["Benzylamine","Acetophenone (C_{6}H_{5}COCH_{3})","Benzoic acid","Phenylacetamide"],correct:1,exp:"A Grignard reagent adds to the nitrile carbon of benzonitrile; acidic hydrolysis of the resulting imine salt gives the ketone acetophenone."},
{q:"The ammonium salt of benzoic acid is heated strongly with P_{2}O_{5}, the product is reduced, then treated with NaNO_{2}/HCl at low temperature. The final compound formed is",options:["Benzene diazonium chloride","Benzyl alcohol","Phenol","Nitrosobenzene"],correct:1,exp:"Dehydration of ammonium benzoate with P2O5 gives benzonitrile, which is reduced to benzylamine; diazotization of this primary amine at low temperature and subsequent hydrolysis gives benzyl alcohol."},
{q:"Ethanamine reacts with CHCl_{3}/KOH to form an isocyanide Y. Hydrolysis of Y with HCl gives back X along with methanoic acid. X is",options:["Ethanamine","Ethanol","Acetamide","Ethanenitrile"],correct:0,exp:"Ethanamine with CHCl3/KOH undergoes the carbylamine reaction to form an isocyanide, which on acidic hydrolysis regenerates ethanamine along with methanoic acid."},
{q:"Among the following, the reaction that proceeds through electrophilic substitution is",options:["Benzene diazonium chloride + AlCl_{3} giving a hydrocarbon and N_{2} loss","Benzene + Cl_{2} with AlCl_{3} giving chlorobenzene and HCl","Cyclohexane + Cl_{2} under UV light giving a substituted product","Ethanol + HCl on heating giving chloroethane and water"],correct:1,exp:"Halogenation of benzene with Cl2 in the presence of AlCl3 proceeds through an electrophilic aromatic substitution mechanism."},
{q:"Phthalic acid reacts with aniline on strong heating to give the major product, which is",options:["N-phenylbenzamide","N-phenylphthalimide","Aniline hydrochloride salt of phthalic acid","Phthalic anhydride"],correct:1,exp:"Phthalic acid heated strongly with aniline forms an imide by double condensation, giving N-phenylphthalimide."}
];
const CH14_BIOMOLECULES = [
{q:"Which one of the following rotates the plane of polarized light towards the left?",options:["D(+) Glucose","L(+) Glucose","D(-) Fructose","D(+) Galactose"],correct:2,exp:"D(-)-Fructose is the sugar among these options that rotates plane-polarized light to the left (levorotatory)."},
{q:"The correct corresponding order of names of four aldoses with a given Fischer configuration is",options:["L-Erythrose, L-Threose, L-Erythrose, D-Threose","D-Threose, L-Erythrose, L-Threose, L-Erythrose","L-Erythrose, L-Threose, D-Erythrose, D-Threose","D-Erythrose, D-Threose, L-Erythrose, L-Threose"],correct:3,exp:"Matching each Fischer projection to its correct name and configuration gives the order D-Erythrose, D-Threose, L-Erythrose, L-Threose."},
{q:"Which one given below is a non-reducing sugar?",options:["Glucose","Sucrose","Maltose","Lactose"],correct:1,exp:"Sucrose has no free anomeric -OH (both anomeric carbons of glucose and fructose are joined in the glycosidic bond), so it cannot reduce Fehling's/Tollens' reagent and is a non-reducing sugar."},
{q:"Glucose is treated with (i) HCN, (ii) hydrolysis, (iii) HI + heat, to give compound A. A is",options:["Heptanoic acid","2-Iodohexane","Heptane","Heptanol"],correct:0,exp:"HCN addition, hydrolysis of the nitrile to an acid, and HI/heat reduction of every -OH group converts glucose's carbon skeleton into the straight-chain heptanoic acid."},
{q:"Assertion: A solution of sucrose in water is dextrorotatory, but on hydrolysis in the presence of a little hydrochloric acid, it becomes laevorotatory. Reason: Sucrose hydrolysis gives unequal amounts of glucose and fructose, causing a change in the sign of rotation.",options:["Both assertion and reason are true and reason is the correct explanation","Both assertion and reason are true but reason is not the correct explanation","Assertion is true but reason is false","Both assertion and reason are false"],correct:0,exp:"Hydrolysis converts dextrorotatory sucrose into a mixture of glucose and fructose; fructose's large levorotation outweighs glucose's dextrorotation, flipping the net rotation to laevorotatory, so both statements are true and the reason correctly explains the assertion."},
{q:"The central dogma of molecular genetics states that genetic information flows from",options:["Amino acids, Protein, DNA","DNA, Carbohydrates, Protein","DNA, RNA, Proteins","DNA, RNA, Carbohydrates"],correct:2,exp:"The central dogma describes genetic information flowing from DNA to RNA to proteins."},
{q:"In a protein, various amino acids are linked together by a",options:["Peptide bond","Dative bond","α-Glycosidic bond","β-Glycosidic bond"],correct:0,exp:"Amino acids in a protein are joined to each other through peptide (amide) bonds."},
{q:"Among the following, the achiral amino acid is",options:["2-ethylalanine","2-methylglycine","2-hydroxymethylserine","Tryptophan"],correct:2,exp:"2-Hydroxymethylserine has two identical -CH2OH substituents on its α-carbon, giving it a plane of symmetry and making it achiral, unlike the other listed amino acids."},
{q:"The correct statement regarding RNA and DNA respectively is",options:["The sugar in RNA is arabinose, in DNA is ribose","The sugar in RNA is 2-deoxyribose, in DNA is arabinose","The sugar in RNA is arabinose, in DNA is 2-deoxyribose","The sugar in RNA is ribose, in DNA is 2-deoxyribose"],correct:3,exp:"RNA contains the sugar ribose, while DNA contains 2-deoxyribose (missing the 2'-OH group)."},
{q:"In aqueous solution, amino acids mostly exist as",options:["NH_{2}-CH(R)-COOH","NH_{2}-CH(R)-COO^{-}","H_{3}N^{+}-CH(R)-COOH","H_{3}N^{+}-CH(R)-COO^{-}"],correct:3,exp:"In aqueous solution, amino acids exist predominantly as zwitterions, H3N+-CH(R)-COO-."},
{q:"Which one of the following is not produced by the body?",options:["DNA","Enzymes","Hormones","Vitamins"],correct:3,exp:"Vitamins cannot be synthesized by the body and must be obtained from the diet, unlike DNA, enzymes and hormones."},
{q:"The number of sp^{2} and sp^{3} hybridised carbons in (open-chain) fructose are respectively",options:["1 and 4","4 and 2","5 and 1","1 and 5"],correct:3,exp:"In open-chain fructose, only C2 (the carbonyl carbon) is sp2 hybridised, while C1, C3, C4, C5 and C6 are all sp3, giving 1 sp2 and 5 sp3 carbons."},
{q:"Vitamin B_{2} is also known as",options:["Riboflavin","Thiamine","Nicotinamide","Pyridoxine"],correct:0,exp:"Vitamin B2 is commonly known as riboflavin."},
{q:"The pyrimidine bases present in DNA are",options:["Cytosine and Adenine","Cytosine and Guanine","Cytosine and Thymine","Cytosine and Uracil"],correct:2,exp:"The two pyrimidine bases found in DNA are cytosine and thymine."},
{q:"For L-serine, the pKa of the α-carboxyl group is about 2.13 and that of the α-ammonium group is about 9.05. The isoelectric point (pI) of serine is approximately",options:["2.13","5.59","9.05","11.18"],correct:1,exp:"The isoelectric point is the average of the pKa values flanking the neutral zwitterion, (2.13 + 9.05)/2 ≈ 5.59."},
{q:"The secondary structure of a protein refers to",options:["The fixed configuration of the polypeptide backbone","Hydrophobic interaction","The sequence of α-amino acids","The α-helical backbone"],correct:3,exp:"The secondary structure of a protein refers to regular, repeating backbone conformations such as the α-helix."},
{q:"Which of the following vitamins is water soluble?",options:["Vitamin E","Vitamin K","Vitamin A","Vitamin B"],correct:3,exp:"Vitamin B (the B-complex vitamins) are water soluble, unlike the fat-soluble vitamins A, D, E and K."},
{q:"Complete hydrolysis of cellulose gives",options:["L-Glucose","D-Fructose","D-Ribose","D-Glucose"],correct:3,exp:"Complete hydrolysis of cellulose, a polymer of glucose units, yields D-glucose."},
{q:"Which of the following statements is correct?",options:["Ovalbumin is a simple food reserve in egg-white","Blood proteins thrombin and fibrinogen are involved in blood clotting","Denaturation makes protein more active","Insulin maintains the sugar level in the human body"],correct:1,exp:"Thrombin and fibrinogen are blood proteins that play a central role in the blood clotting cascade."},
{q:"Glucose is an aldose. Which one of the following reactions is not expected with glucose?",options:["It does not form an oxime","It does not react with Grignard reagent","It does not form osazones","It does not reduce Tollens' reagent"],correct:1,exp:"Because glucose exists mostly in its cyclic hemiacetal form and has several hydroxyl groups, its reaction with a Grignard reagent does not proceed cleanly as expected for a simple aldehyde."},
{q:"If one strand of DNA has the sequence 'ATGCTTGA', then the sequence of the complementary strand would be",options:["TACGAACT","TCCGAACT","TACGTACT","TACGCAGT"],correct:0,exp:"Pairing each base with its complement (A-T, T-A, G-C, C-G) for the sequence ATGCTTGA gives the complementary strand TACGAACT."},
{q:"Insulin, a hormone, is chemically a",options:["Fat","Steroid","Protein","Carbohydrate"],correct:2,exp:"Insulin is a peptide hormone, making it chemically a protein."},
{q:"α-D(+)-Glucose and β-D(+)-Glucose are",options:["Epimers","Anomers","Enantiomers","Conformational isomers"],correct:1,exp:"α-D(+)-glucose and β-D(+)-glucose differ only in configuration at the anomeric carbon (C1), making them anomers."},
{q:"Which of the following are epimers?",options:["D(+)-Glucose and D(+)-Galactose","D(+)-Glucose and D(+)-Mannose","Neither (a) nor (b)","Both (a) and (b)"],correct:3,exp:"D-glucose and D-galactose differ in configuration only at C4, and D-glucose and D-mannose differ only at C2, so both pairs qualify as epimers."},
{q:"Which of the following amino acids is achiral?",options:["Alanine","Leucine","Proline","Glycine"],correct:3,exp:"Glycine has no side chain other than a hydrogen on its α-carbon, so it is the only amino acid without a stereocenter, making it achiral."}
];
const CH15_EVERYDAY = [
{q:"Which of the following is an analgesic?",options:["Streptomycin","Chloromycetin","Aspirin","Penicillin"],correct:2,exp:"Aspirin (acetylsalicylic acid) is a well-known analgesic, used to relieve pain."},
{q:"Antiseptics and disinfectants either kill or prevent the growth of microorganisms. Which statement is not true?",options:["Dilute solutions of boric acid and hydrogen peroxide are strong antiseptics","Disinfectants harm living tissues","A 0.2% solution of phenol is an antiseptic while a 1% solution acts as a disinfectant","Chlorine and iodine are used as strong disinfectants"],correct:0,exp:"Dilute boric acid and hydrogen peroxide are actually mild antiseptics, not strong ones, making that statement the incorrect one."},
{q:"Drugs that bind to the receptor site and inhibit its natural function are called",options:["Antagonists","Agonists","Enzymes","Molecular targets"],correct:0,exp:"Antagonist drugs bind to a receptor site and block or inhibit its normal biological function."},
{q:"Aspirin is a/an",options:["Acetylsalicylic acid","Benzoylsalicylic acid","Chlorobenzoic acid","Anthranilic acid"],correct:0,exp:"Aspirin is chemically acetylsalicylic acid."},
{q:"Which one of the following repeating units represents the nylon 6,6 polymer?",options:["-[NH-(CH_{2})_{6}-NH_{2}]_{n}-","-[NH_{2}-(CH_{2})_{6}-NH_{2}]_{n}-","-[HN-(CH_{2})_{6}-COOH]_{n}-","-[OC-(CH_{2})_{4}-CO-NH-(CH_{2})_{6}-NH]_{n}-"],correct:3,exp:"Nylon 6,6, formed from hexamethylenediamine and adipic acid, has the repeating unit -[OC-(CH2)4-CO-NH-(CH2)6-NH]n-."},
{q:"Natural rubber has",options:["Alternate cis- and trans-configuration","Random cis- and trans-configuration","All cis-configuration","All trans-configuration"],correct:2,exp:"Natural rubber (cis-1,4-polyisoprene) has all double bonds in the cis configuration, giving it its characteristic elasticity."},
{q:"Nylon is an example of",options:["Polyamide","Polythene","Polyester","Polysaccharide"],correct:0,exp:"Nylon is formed by amide linkages between monomer units, making it a polyamide."},
{q:"Terylene is an example of",options:["Polyamide","Polythene","Polyester","Polysaccharide"],correct:2,exp:"Terylene (PET) is formed by ester linkages, making it a polyester."},
{q:"Which is the monomer of neoprene?",options:["CH_{2}=C(Cl)-CH=CH_{2}","CH_{2}=CH-C≡CH","CH_{2}=CH-CH=CH_{2}","CH_{2}=C(CH_{3})-CH=CH_{2}"],correct:0,exp:"Neoprene is made by polymerising chloroprene, CH2=C(Cl)-CH=CH2."},
{q:"Which one of the following is a bio-degradable polymer?",options:["HDPE","PVC","Nylon 6","PHBV"],correct:3,exp:"PHBV is a biodegradable polymer, formed from 3-hydroxybutanoic and 3-hydroxypentanoic acid units that can be broken down by microorganisms."},
{q:"Non-stick cookware generally has a coating of a polymer whose monomer is",options:["Ethene","Prop-2-enenitrile","Chloroethene","1,1,2,2-tetrafluoroethene"],correct:3,exp:"Non-stick cookware is coated with Teflon (PTFE), made by polymerising tetrafluoroethene."},
{q:"Assertion: 2-methylbuta-1,3-diene (isoprene) is the monomer of natural rubber. Reason: Natural rubber is formed through anionic addition polymerisation.",options:["Both assertion and reason are true and reason is the correct explanation","Both assertion and reason are true but reason is not the correct explanation","Assertion is true but reason is false","Both assertion and reason are false"],correct:2,exp:"Isoprene is indeed the monomer of natural rubber, but natural rubber forms in plants through an enzyme-mediated biosynthetic pathway, not the anionic addition polymerisation stated in the reason, making the reason false."},
{q:"Which of the following is a co-polymer?",options:["Orlon","PVC","Teflon","PHBV"],correct:3,exp:"PHBV is made from two different monomer units, making it a co-polymer, unlike the homopolymers Orlon, PVC and Teflon."},
{q:"The polymer used in making blankets (artificial wool) is",options:["Polystyrene","PAN","Polyester","Polythene"],correct:1,exp:"Polyacrylonitrile (PAN, sold as Orlon) is used to make blankets as an artificial wool substitute."},
{q:"Regarding cross-linked or network polymers, which of the following statements is incorrect?",options:["Examples are Bakelite and melamine","They are formed from bi- and tri-functional monomers","They contain covalent bonds between various linear polymer chains","They contain weak covalent bonds in their polymer chain"],correct:3,exp:"Cross-linked polymers like Bakelite and melamine are held together by strong (not weak) covalent bonds between their chains, making that statement the incorrect one."}
];

const CHAPTERS_CHEMISTRY = [
  {id:301, name:"Metallurgy", icon:"⛏️", questions:CH1_METALLURGY, additionalQuestions:[]},
  {id:302, name:"p-Block Elements - I", icon:"🧊", questions:CH2_PBLOCK1, additionalQuestions:[]},
  {id:303, name:"p-Block Elements - II", icon:"🧪", questions:CH3_PBLOCK2, additionalQuestions:[]},
  {id:304, name:"Transition and Inner Transition Elements", icon:"🔶", questions:CH4_TRANSITION, additionalQuestions:[]},
  {id:305, name:"Coordination Chemistry", icon:"🔗", questions:CH5_COORDINATION, additionalQuestions:[]},
  {id:306, name:"Solid State", icon:"🧱", questions:CH6_SOLIDSTATE, additionalQuestions:[]},
  {id:307, name:"Chemical Kinetics", icon:"⏱️", questions:CH7_KINETICS, additionalQuestions:[]},
  {id:308, name:"Ionic Equilibrium", icon:"⚖️", questions:CH8_IONIC, additionalQuestions:[]},
  {id:309, name:"Electro Chemistry", icon:"🔋", questions:CH9_ELECTROCHEM, additionalQuestions:[]},
  {id:310, name:"Surface Chemistry", icon:"🌫️", questions:CH10_SURFACE, additionalQuestions:[]},
  {id:311, name:"Hydroxy Compounds and Ethers", icon:"🧫", questions:CH11_HYDROXY, additionalQuestions:[]},
  {id:312, name:"Carbonyl Compounds and Carboxylic Acids", icon:"🍶", questions:CH12_CARBONYL, additionalQuestions:[]},
  {id:313, name:"Organic Nitrogen Compounds", icon:"💊", questions:CH13_NITROGEN, additionalQuestions:[]},
  {id:314, name:"Biomolecules", icon:"🧬", questions:CH14_BIOMOLECULES, additionalQuestions:[]},
  {id:315, name:"Chemistry in Everyday Life", icon:"🧴", questions:CH15_EVERYDAY, additionalQuestions:[]}
];

const CHAPTERS_PHYSICS = [
  {id:201, name:"Electrostatics", icon:"⚡", questions:PH1_ELECTROSTATICS, additionalQuestions:[]},
  {id:202, name:"Current Electricity", icon:"I", questions:PH2_CURRENT_ELECTRICITY, additionalQuestions:[]},
  {id:203, name:"Magnetism and Magnetic Effects of Electric Current", icon:"🧲", questions:PH3_MAGNETISM, additionalQuestions:[]},
  {id:204, name:"Electromagnetic Induction and Alternating Current", icon:"∿", questions:PH4_EMI_AC, additionalQuestions:[]},
  {id:205, name:"Electromagnetic Waves", icon:"📡", questions:PH5_EM_WAVES, additionalQuestions:[]},
  {id:206, name:"Ray Optics", icon:"🔍", questions:PH6_RAY_OPTICS, additionalQuestions:[]},
  {id:207, name:"Wave Optics", icon:"〜", questions:PH7_WAVE_OPTICS, additionalQuestions:[]},
  {id:208, name:"Dual Nature of Radiation and Matter", icon:"e⁻", questions:PH8_DUAL_NATURE, additionalQuestions:[]},
  {id:209, name:"Atomic and Nuclear Physics", icon:"⚛️", questions:PH9_ATOMIC_NUCLEAR, additionalQuestions:[]},
  {id:210, name:"Electronics and Communication", icon:"💻", questions:PH10_ELECTRONICS, additionalQuestions:[]},
  {id:211, name:"Recent Developments in Physics", icon:"🔬", questions:PH11_RECENT_DEVELOPMENTS, additionalQuestions:[]}
];

/* ================= BIOLOGY QUESTION BANK (12th Std, Book Back 1 Mark PDF - Botany & Zoology) ================= */
const BIO_B_ASEXUALANDSEXUALREPRODUC = [
{q:"Choose the correct statement from the following",options:["Gametes are involved in asexual reproduction","Bacteria reproduce asexually by budding","Conidia formation is a method of sexual reproduction","Yeast reproduce by budding"],correct:3,exp:"Budding is the characteristic asexual method in yeast, where a small outgrowth forms and pinches off; gametes belong to sexual reproduction, and bacteria typically reproduce by binary fission, not budding."},
{q:"An eminent Indian embryologist is",options:["S.R.Kashyap","P.Maheswari","M.S. Swaminathan","K.C.Mehta"],correct:1,exp:"P. Maheshwari was a renowned Indian embryologist known for his pioneering work on angiosperm embryology and pollen biology."},
{q:"Identify the correctly matched pair",options:["Tuber - Allium cepa","Sucker - Pistia","Rhizome - Musa","Stolon - Zingiber"],correct:2,exp:"Musa (banana) propagates through an underground rhizome, correctly pairing the structure with the plant."},
{q:"Pollen tube was discovered by",options:["J.G.Kolreuter","G.B.Amici","E.Strasburger","E.Hanning"],correct:1,exp:"G.B. Amici first discovered the germination of pollen grains and growth of the pollen tube, in 1823."},
{q:"Size of pollen grain in Myosotis",options:["10 micrometer","20 micrometer","200 micrometer","2000 micrometer"],correct:0,exp:"Pollen grain size varies widely across species; in Myosotis (forget-me-not) it is very small, about 10 micrometres, among the smallest known."},
{q:"First cell of male gametophyte in angiosperm is",options:["Microspore","megaspore","Nucleus","Primary Endosperm Nucleus"],correct:0,exp:"The microspore itself is the first cell of the male gametophyte; it divides mitotically to form the two-celled and later three-celled pollen grain."},
{q:"Match the following I) External fertilization i) pollen grain II) Androecium ii) anther wall III) Male gametophyte iii) algae IV) Primary parietal layer iv) stamens",options:["I-iv;II-i;III-ii;IV-iii","I-iii;II-iv;III-i;IV-ii","I-iii;II-iv;III-ii,IV-I","I-iii;II-i;III-iv;IV-ii"],correct:1,exp:"External fertilization is characteristic of algae, the androecium is the stamen whorl, the pollen grain is the male gametophyte, and the primary parietal layer gives rise to the anther wall layers including the endothecium."},
{q:"Arrange the layers of anther wall from locus to periphery",options:["Epidermis,middle layers, tapetum, endothecium","Tapetum, middle layers, epidermis, endothecium","Endothecium, epidermis, middle layers, tapetum","Tapetum, middle layers endothecium epidermis"],correct:3,exp:"From the locule outward, anther wall layers are arranged as tapetum, middle layers, endothecium, and epidermis, with the tapetum nourishing developing pollen and the epidermis forming the protective outer layer."},
{q:"Identify the incorrect pair",options:["sporopollenin - exine of pollen grain","tapetum - nutritive tissue for developing microspores","Nucellus - nutritive tissue for developing embryo","obturator - directs the pollen tube into micropyle"],correct:2,exp:"The nucellus provides nourishment to the developing megaspore/embryo sac, not directly to the embryo; nutrition to the embryo comes mainly from the endosperm, making this pairing incorrect."},
{q:"Assertion : Sporopollenin preserves pollen in fossil deposits Reason : Sporopollenin is resistant to physical and biological decomposition",options:["assertion is true; reason is false","assertion is false; reason is true","Both Assertion and reason are not true","Both Assertion and reason are true."],correct:3,exp:"Sporopollenin is one of the most chemically resistant organic materials known, withstanding heat, strong acids and enzymatic breakdown, which is why pollen walls persist as fossils."},
{q:"Choose the correct statement(s) about tenuinucellate ovule",options:["Sporogenous cell is hypodermal","Ovules have fairly large nucellus","sporogenous cell is epidermal","ovules have single layer of nucellus tissue"],correct:0,exp:"In a tenuinucellate ovule, the nucellus is thin with very few cell layers, and the sporogenous cell lies just beneath the epidermis (hypodermal) rather than being epidermal itself."},
{q:"Which of the following represent megagametophyte",options:["Ovule","Embryo sac","Nucellus","Endosperm"],correct:1,exp:"The embryo sac (female gametophyte) is the megagametophyte in angiosperms, formed after meiosis and mitotic divisions of the functional megaspore."},
{q:"In Haplopappus gracilis, number of chromosomes in cells of nucellus is 4. What will be the chromosome number in Primary endosperm cell?",options:["8","12","6","2"],correct:1,exp:"The primary endosperm nucleus is triploid (3n), formed by fusion of one male gamete (n) with the two polar nuclei (2n); since n = 4 here, 3n works out to 12."},
{q:"Transmitting tissue is found in",options:["Micropylar region of ovule","Pollen tube wall","Stylar region of gynoecium","Integument"],correct:2,exp:"The transmitting tissue is a specialized nutritive tissue lining the style, through which the pollen tube grows on its way to the ovary."},
{q:"The scar left by funiculus in the seed is",options:["tegmen","radicle","epicotyl","hilum"],correct:3,exp:"The hilum is the scar on the seed coat marking the point where the funiculus (seed stalk) was attached to the ovule."},
{q:"A Plant called X possesses small flower with reduced perianth and versatile anther. The probable agent for pollination would be",options:["water","air","butterflies","beetles"],correct:1,exp:"Small flowers with reduced perianth and versatile (freely swinging) anthers release large quantities of light pollen suited for wind pollination (anemophily)."},
{q:"Consider the following statement(s) i) In Protandrous flowers pistil matures earlier ii) In Protogynous flowers pistil matures earlier iii) Herkogamy is noticed in unisexual flowers iv) Distyly is present in Primula",options:["i and ii are correct","ii and iv are correct","ii and iii are correct","i and iv are correct"],correct:1,exp:"In protogynous flowers the pistil matures before the stamens, and distyly, two flower forms differing in style and stamen length, is a classic feature of Primula that promotes cross-pollination."},
{q:"Coelorhiza is found in",options:["Paddy","Bean","Pea","Tridax"],correct:0,exp:"Coleorhiza is a protective sheath covering the radicle in monocot seeds such as paddy (rice), helping the root emerge safely during germination."},
{q:"Parthenocarpic fruits lack",options:["Endocarp","Epicarp","Mesocarp","seed"],correct:3,exp:"Parthenocarpic fruits develop without fertilization, so they lack seeds even while forming a normal fruit wall (pericarp)."},
{q:"In majority of plants pollen is liberated at",options:["1 celled stage","2 celled stage","3 celled stage","4 celled stage"],correct:1,exp:"In most angiosperms, pollen is shed at the two-celled stage, containing a vegetative cell and a generative cell; the generative cell later divides into two male gametes."},
];

const BIO_B_CLASSICALGENETICS = [
{q:"Extra nuclear inheritance is a consequence of presence of genes in",options:["Mitrochondria and chloroplasts","Endoplasmic reticulum and mitrochondria","Ribosomes and chloroplast","Lysososmes and ribosomes"],correct:0,exp:"Extranuclear (cytoplasmic) inheritance results from genes present in organelles such as mitochondria and chloroplasts, which are inherited independently of nuclear chromosomes, usually maternally."},
{q:"In order to find out the different types of gametes produced by a pea plant having the genotype AaBb, it should be crossed to a plant with the genotype",options:["aaBB","AaBB","AABB","aabb"],correct:3,exp:"To find all the gamete types produced by a dihybrid (AaBb), it must be crossed with a homozygous recessive plant (aabb); this is the standard test cross setup."},
{q:"How many different kinds of gametes will be produced by a plant having the genotype AABbCC?",options:["Three","Four","Nine","Two"],correct:1,exp:"The number of distinct gamete types an individual can form follows 2^n, where n is the number of heterozygous gene pairs in the genotype; apply this rule to the genotype given here to work out the count."},
{q:"Which one of the following is an example of polygenic inheritance?",options:["Flower colour in Mirabilis Jalapa","Production of male honey bee","Pod shape in garden pea","Skin Colour in humans"],correct:3,exp:"Human skin colour is controlled by multiple genes acting additively (polygenic inheritance), producing a continuous range of shades rather than a few sharply distinct classes."},
{q:"In Mendel's experiments with garden pea, round seed shape (RR) was dominant over wrinkled seeds (rr), yellow cotyledon (YY) was dominant over green cotyledon (yy). What are the expected phenotypesin the F generation of the cross RRYY x rryy?",options:["Only round seeds with green cotyledons","Only wrinkled seeds with yellow cotyledons","Only wrinkled seeds with green cotyledons","Round seeds with yellow cotyledons an wrinkled seeds with yellow cotyledons"],correct:3,exp:"Since round seed shape and yellow cotyledon colour are both dominant, crossing the homozygous dominant parent with the homozygous recessive parent produces uniformly heterozygous offspring expressing the dominant phenotypes, illustrating Mendel's law of dominance."},
{q:"Test cross involves",options:["Crossing between two genotypes with recessive trait","Crossing between two F hybrids","Crossing the F hybrid with a double recessive genotype","Crossing between two genotypes with dominant trait"],correct:2,exp:"A test cross is performed by crossing an individual of unknown or dominant phenotype with a homozygous recessive individual, to reveal its underlying genotype from the ratio of offspring produced."},
{q:"In pea plants, yellow seeds are dominant to green. If a heterozygous yellow seed pant is crossed with a green seeded plant, what ratio of yellow and green seeded plants would you expect in F1 generation?",options:["9:1","1:3","3:1","50:50"],correct:3,exp:"Crossing a heterozygous yellow-seeded plant (Yy) with a homozygous green-seeded plant (yy) gives a 1:1 ratio of yellow to green seeds, since half the gametes carry Y and half carry y."},
{q:"The genotype of a plant showing the dominant phenotype can be determined by",options:["Back cross","Test cross","Dihybrid corss","Pedigree analysis"],correct:1,exp:"A test cross, crossing with a homozygous recessive individual, reveals whether a dominant-phenotype organism is homozygous or heterozygous, based on the phenotype ratio among offspring."},
{q:"Select the correct statement from the ones given below with respect to dihydrid cross",options:["Tightly linked genes on the same chromosomes show very few combinations","Tightly linked genes on the same chromosomes show higher combinations","Genes far apart on the same chromosomes show very few recombinations","Genes loosely linked on the same chromosomes show similar recombinations as the tightly linked ones"],correct:0,exp:"Genes located close together on a chromosome are less likely to be separated by crossing over, so tightly linked genes show very few recombinant (non-parental) combinations and are usually inherited together."},
{q:"Which Mendelian idea is depicted by a cross in which the F generation resembles both the parents",options:["Incomplete dominance","Law of dominance","Inheritance of one gene","Co-dominance"],correct:3,exp:"When the F1 generation shows a blended or simultaneous expression of both parental traits rather than one dominating completely, the phenomenon is called codominance."},
{q:"Fruit colour in squash is an example of",options:["Recessive epistatsis","Dominant epistasis","Complementary genes","Inhibitory genes"],correct:1,exp:"In squash, fruit colour is controlled by a gene whose dominant allele masks the expression of a gene at a different locus, an example of dominant epistasis that modifies the expected 9:3:3:1 ratio."},
{q:"In his classic experiments on Pea plants, Mendel did not use",options:["Flowering position","Seed colour","Pod length","Seed shape"],correct:2,exp:"Mendel's seven classic pea traits were seed shape, seed colour, pod shape, pod colour, flower colour, flower position and plant height; pod length as such was not one of his studied characters."},
{q:"The epistatic effect, in which the dihybrid cross 9:3:3:1 between AaBb Aabb is modified as",options:["Dominance of one allele on another allele of both loci","Interaction between two alleles of different loci","Dominance of one allele to another alleles of same loci","Interaction between two alleles of some loci"],correct:1,exp:"Epistasis is an interaction in which an allele at one gene locus suppresses or modifies the phenotypic expression of an allele at a different, non-allelic locus, altering the expected dihybrid ratio."},
{q:"In a test cross involving F dihybrid flies, more parental type offspring were produced than the recombination type offspring. This indicates",options:["The two genes are located on two different chromosomes","Chromosomes failed to separate during meiosis","The two genes are linked and present on the some chromosome","Both of the characters are controlled by more than one gene"],correct:2,exp:"A higher proportion of parental-type over recombinant-type offspring indicates the two genes lie close together on the same chromosome (linkage), since linked genes are inherited together more often than they recombine."},
{q:"The genes controlling the seven pea characters studied by Mendel are known to be located on how many different chromosomes?",options:["Seven","Six","Five","Four"],correct:0,exp:"Mendel's seven pea traits were each controlled by genes located on different chromosomes, since garden pea has seven chromosome pairs, which explains why he observed independent assortment."},
{q:"Which of the following explains how progeny can posses the combinations of traits that none of the parent possessed?",options:["Law of segregation","Chromosome theory","Law of independent assortment","Polygenic inheritance"],correct:2,exp:"Independent assortment of genes located on different chromosome pairs allows new, non-parental combinations of traits to appear among the offspring."},
{q:"\"Gametes are never hybrid\". This is a statement of",options:["Law of dominance","Law of independent assortment","Law of segregation","Law of random fertilization"],correct:2,exp:"\"Gametes are never hybrid\" reflects Mendel's law of segregation, where the two alleles of a gene pair separate during gamete formation so each gamete carries only one allele."},
{q:"Gene which suppresses other genes activity but does not lie on the same locus is called as",options:["Epistatic","Supplement only","Hypostatic","Codominant"],correct:0,exp:"A gene that suppresses the expression of another, non-allelic gene without occupying the same locus is called an epistatic gene, while the suppressed gene is termed hypostatic."},
{q:"Pure tall plants are crossed with pure dwarf plants. In the F1 generation, all plants were tall. These tall plants of F generation were selfed and the ratio of tall to dwarf plants obtained was 3:1. This is called",options:["Dominance","Inheritance","Codominance","Heredity"],correct:0,exp:"The 3:1 ratio in F2, with all F1 plants showing only the tall trait, demonstrates the law of dominance, where the dominant allele masks the recessive allele's expression in heterozygotes."},
{q:"The dominant epistatis ratio is",options:["9:3:3:1","12:3:1","9:3:4","9:6:1"],correct:1,exp:"Dominant epistasis modifies the standard 9:3:3:1 dihybrid ratio into a 12:3:1 ratio, since the dominant epistatic allele masks the effect of the gene at the second locus."},
{q:"Select the period for Mendel's hybridization experiments",options:["1856 - 1863","1850 - 1870","1857 - 1869","1870 - 1877"],correct:0,exp:"Gregor Mendel conducted his pea hybridization experiments in the monastery garden at Brno between 1856 and 1863, later publishing his results in 1866."},
{q:"Among the following characters which one was not considered by Mendel in his experimentation pea?",options:["Stem - Tall or dwarf","Trichomal glandular or non-glandular","Seed - Green or yellow","Pod - Inflated or constricted"],correct:1,exp:"Mendel studied seven specific pea traits: plant height, pod shape, pod colour, seed shape, seed colour, flower colour, and flower position; trichome (glandular/non-glandular) type was not among them."},
];

const BIO_B_CHROMOSOMALBASISOFINHERI = [
{q:"An allohexaploidy contains",options:["Six different genomes","Six copies of three different genomes","Two copies of three different genomes","Six copies of one genome"],correct:2,exp:"Allohexaploidy means the organism carries six chromosome sets made up of two copies each of three distinct genomes derived from different parent species."},
{q:"The A and B genes are 10 cM apart on a chromosome. If an AB/ab heterozygote is testcrossed to ab/ab, how many of each progeny class would you expect out of 100 total progeny?",options:["25 AB, 25 ab, 25 Ab, 25 aB","10 AB, 10 ab","45 AB, 45 ab","45 AB, 45 ab, 5 Ab, 5aB"],correct:3,exp:"With genes 10 cM apart, the recombination frequency is 10%, so out of 100 progeny, 90 are parental types (45 AB + 45 ab) and 10 are recombinants (5 Ab + 5 aB)."},
{q:"Match list I with list II List I List II A. A pair of chromosomes extra with diploid i) monosomy B. One chromosome extra to the diploid ii) tetrasomy C. One chromosome loses from diploid iii) trisomy D. Two individual chromosomes lose from diploid iv) double monosomy",options:["A-i, B-iii, C-ii, D-iv","A-ii, B-iii, C-iv, D-i","A-ii, B-iii, C-i, D-iv","A-iii, B-ii, C-i, D-iv"],correct:2,exp:"An extra pair of chromosomes gives tetrasomy, one extra single chromosome gives trisomy, loss of one chromosome gives monosomy, and loss of two different chromosomes gives double monosomy."},
{q:"Which of the following sentences are correct? 1. The offspring exhibit only parental combinations due to incomplete linkage 2. The linked genes exhibit some crossing over in complete linkage 3. The separation of two linked genes are possible in incomplete linkage 4. Crossing over is absent in complete linkage",options:["1 and 2","2 and 3","3 and 4","1 and 4"],correct:2,exp:"In complete linkage, genes on the same chromosome are inherited together with no crossing over, so offspring show only parental combinations; incomplete linkage allows some crossing over and recombination between linked genes."},
{q:"Accurate mapping of genes can be done by three point test cross because increases",options:["Possibility of single cross over","Possibility of double cross over","Possibility of multiple cross over","Possibility of recombination frequency"],correct:1,exp:"A three-point test cross increases the chance of detecting double crossovers between three linked genes, allowing more accurate determination of gene order and map distances."},
{q:"Due to incomplete linkage in maize, the ratio of parental and recombinants are",options:["50:50","7:1:1:7","4: 3.6","1:7:7:1"],correct:1,exp:"Due to incomplete linkage in maize, offspring show a ratio close to 7 parental : 1 recombinant : 1 recombinant : 7 parental, reflecting a real but relatively low recombination frequency between the linked genes."},
{q:"Genes G S L H are located on same chromosome. The recombination percentage is between L and G is 15%, S and L is 50%, H and S are 20%. The correct order of genes is",options:["GHSL","SHGL","SGHL","HSLG"],correct:1,exp:"Arranging genes by increasing recombination distance places the gene pair with the smallest distance closest together and the pair with the largest distance farthest apart on the chromosome map."},
{q:"The point mutation sequence for transition, transition, transversion and transversion in DNA are",options:["A to T, T to A, C to G and G to C","A to G, C to T, C to G and T to A","C to G, A to G, T to A and G to A","G to C, A to T, T to A and C to G"],correct:1,exp:"Transitions are purine-to-purine or pyrimidine-to-pyrimidine substitutions (A ↔ G, C ↔ T), while transversions are purine-to-pyrimidine substitutions (such as C ↔ G or T ↔ A)."},
{q:"If haploid number in a cell is 18. The double monosomic and trisomic number will be",options:["35 and 37","34 and 35","37 and 35","17 and 19"],correct:0,exp:"For a species with haploid number n, the double monosomic chromosome count is 2n − 2 and the trisomic count is 2n + 1; apply this rule using n = 18 to work out the two values asked here."},
{q:"Changing the codon AGC to AGA represents",options:["missense mutation","nonsense mutation","frameshift mutation","deletion mutation"],correct:0,exp:"Changing codon AGC (serine) to AGA (arginine) alters the coded amino acid without shifting the reading frame, which is the definition of a missense mutation."},
{q:"Assertion (A): Gamma rays are generally use to induce mutation in wheat varieties. Reason (R): Because they carry lower energy to non-ionize electrons from atom",options:["A is correct. R is correct explanation of A","A is correct. R is not correct explanation of A","A is correct. R is wrong explanation of A","A and R is wrong"],correct:2,exp:"Gamma rays are high-energy ionizing radiation capable of inducing mutations in crops like wheat, but the reason statement is scientifically incorrect since gamma rays ionize (rather than merely displace) electrons and carry high, not low, energy."},
{q:"How many map units separate two alleles A and B if the recombination frequency is 0.09?",options:["900 cM","90 cM","9 cM","9 cM"],correct:2,exp:"Map distance in centimorgans equals the recombination frequency multiplied by 100, so a recombination frequency of 0.09 corresponds to 9 map units between the two genes."},
];

const BIO_B_PRINCIPLESANDPROCESSESOF = [
{q:"Restriction enzymes are",options:["Not always required in genetic engineering","Essential tools in genetic engineering","Nucleases that cleave DNA at specific sites","both b and c"],correct:3,exp:"Restriction enzymes are essential molecular tools in genetic engineering, and they function as nucleases that recognize and cleave DNA at specific palindromic sequences."},
{q:"Plasmids are",options:["circular protein molecules","required by bacteria","tiny bacteria","confer resistance to antibiotics"],correct:3,exp:"Plasmids are small circular extrachromosomal DNA molecules found in bacteria; many carry genes conferring antibiotic resistance, which makes them useful as cloning vectors."},
{q:"EcoRI cleaves DNA at",options:["AGGGTT","GTATATC","GAATTC","TATAGC"],correct:2,exp:"EcoRI is a restriction endonuclease that recognizes the palindromic sequence GAATTC and cuts between the G and A on each strand, producing sticky ends."},
{q:"Genetic engineering is",options:["making artificial genes.","hybridization of DNA of one organism to that of the others.","production of alcohol by using micro organisms.","making artificial limbs, diagnostic instruments such as ECG, EEG etc.,"],correct:1,exp:"Genetic engineering involves recombining DNA from different sources (organisms) to create new genetic combinations, technically termed recombinant DNA technology."},
{q:"Consider the following statements: I. Recombinant DNA technology is popularly known as genetic engineering is a stream of biotechnology which deals with the manipulation of genetic materials by man invitro II. pBR322 is the first artificial cloning vector developed in 1977 by Boliver and Rodriguez from E.coli plasmid III. Restriction enzymes belongs to a class of enzymes called nucleases. Choose the correct option regarding above statements",options:["I & II","I & III","II & III","I,II & III"],correct:3,exp:"All three statements hold true: recombinant DNA technology manipulates genetic material in vitro, pBR322 was the first cloning vector developed by Bolivar and Rodriguez in 1977, and restriction enzymes belong to the nuclease class of enzymes."},
{q:"The process of recombinant DNA technology has the following steps I. amplication of the gene II. Insertion of recombinant DNA into the host cells III. Cutting of DNA at specific location using restriction enzyme . IV. Isolation of genetic material (DNA) Pick out the correct sequence of step for recombinant DNA technology.",options:["II, III, IV, I","IV, II, III, I","I, II, III, IV","IV, III, I, II"],correct:3,exp:"The correct sequence in recombinant DNA technology is isolating the DNA, cutting it with restriction enzymes, amplifying the gene, and finally inserting the recombinant DNA into host cells."},
{q:"Which one of the following palindromic base sequence in DNA can be easily cut at about the middle by some particular restriction enzymes?",options:["5` CGTTCG 3` 3` ATCGTA 5`","5` GATATG 3` 3` CTACTA 5`","5` GAATTC 3` 3` CTTAAG 5`","5` CACGTA 3` 3` CTCAGT 5`"],correct:2,exp:"EcoRI's recognition sequence GAATTC/CTTAAG is palindromic and is cleaved symmetrically near its middle by the enzyme, producing complementary single-stranded sticky ends."},
{q:"pBR 322, BR stands for",options:["Plasmid Bacterial Recombination","Plasmid Bacterial Replication","Plasmid Boliver and Rodriguez","Plasmid Baltimore and Rodriguez"],correct:2,exp:"In pBR322, \"BR\" honours its developers Bolivar and Rodriguez, who constructed this widely used cloning vector in 1977."},
{q:"Which of the following one is used as a Biosensors?",options:["Electrophoresis","Bioreactors","Vectors","Electroporation"],correct:1,exp:"Bioreactors (fermenters) are vessels used to grow microorganisms or cells on a large scale for the industrial production of biotechnological products such as enzymes and hormones."},
{q:"Match the following: Column A (1. Exonuclease, 2. Endonuclease, 3. Alkaline Phosphatase, 4. Ligase) with Column B (a. add or remove phosphate, b. binding the DNA fragments, c. cut the DNA at terminus, d. cut the DNA at middle)",options:["1-a, 2-b, 3-c, 4-d","1-c, 2-d, 3-b, 4-a","1-a, 2-c, 3-b, 4-d","1-c, 2-d, 3-a, 4-b"],correct:3,exp:"Exonucleases cut DNA at the terminus, endonucleases cut within the middle of the strand, alkaline phosphatase adds or removes phosphate groups, and ligase joins DNA fragments together."},
{q:"Endonuclease b. binding the DNA fragments 3. Alkaline Phosphatase c. cut the DNA at terminus 4. Ligase d. cut the DNA at middle 1 2 3 4 A) a b c d B) c d b a C) a c b d D) c d a b 11. In which techniques Ethidium Bromide is used?",options:["Southern Blotting techniques","Western Blotting techniques","Polymerase Chain Reaction","Agrose Gel Electroporosis"],correct:3,exp:"Ethidium bromide intercalates into DNA and fluoresces under UV light, which is why it is used to visualize DNA fragments separated by agarose gel electrophoresis."},
{q:"Assertion : Agrobacterium tumifaciens is popular in genetic engineering because this bacteriumis associated with the root nodules of all cereals and pulse crops Reason: A gene incorporated in the bacterial chromosomal genome gets atomatically transferred to the cross with which bacterium is associated.",options:["Both assertion and reason are true. But reason is correct explanation of assertion.","Both assertion and reason are true. But reason is not correct explanation of assertion.","Assertion is true, but reason is false.","Assertion is false, but reason is true. e) Both assertion and reason are false."],correct:3,exp:"Agrobacterium tumefaciens naturally infects wounded dicot plants, and the T-DNA of its Ti plasmid integrates into the plant's own chromosomal genome and is passed on to daughter cells, so the underlying transfer mechanism is valid even though the assertion about cereals is incorrect."},
{q:"Which one of the following is not correct statement.",options:["Ti plasmid causes the bunchy top disease","Multiple cloning site is known as Polylinker","Non viral method transfection of Nucleic acid in cell","Polylactic acid is a kind of biodegradable and bioactive thermoplastic."],correct:0,exp:"The Ti plasmid of Agrobacterium tumefaciens causes crown gall disease (tumours) in plants, not bunchy top disease, which is actually caused by a banana virus, making the statement false."},
{q:"An analysis of chromosomal DNA using the southern hybridisation technique does not use",options:["Electrophoresis","Blotting","Autoradiography","Polymerase Chain Reaction"],correct:3,exp:"Southern hybridization analysis of chromosomal DNA relies on electrophoresis, blotting and probe-based detection (such as autoradiography), but does not require PCR as one of its core steps."},
{q:"An antibiotic gene in a vector usually helps in the selection of",options:["Competent cells","Transformed cells","Recombinant cells","None of the above"],correct:0,exp:"An antibiotic-resistance gene carried on a vector allows selection of transformed cells, since only cells that successfully took up the vector can survive and grow on antibiotic-containing medium."},
{q:"Some of the characteristics of Bt cotton are",options:["Long fibre and resistant to aphids","Medium yield, long fibre and resistant to beetle pests","high yield and production of toxic protein crystals which kill dipteran pests.","High yield and resistant to ball worms"],correct:3,exp:"Bt cotton carries a gene from Bacillus thuringiensis that produces a toxin protein specifically lethal to bollworm larvae, giving the crop pest resistance along with improved yield."},
];

const BIO_B_PLANTTISSUECULTURE = [
{q:"Totipotency refers to",options:["capacity to generate genetically identical plants .","capacity to generate a whole plant from any plant cell / explant.","capacity to generate hybrid protoplasts.","recovery of healthy plants from diseased plants."],correct:0,exp:"Totipotency is the inherent capacity of a plant cell to express the full genetic potential of the organism it came from, allowing generation of genetically identical new plants, which underlies techniques like micropropagation."},
{q:"Micro propagation involves",options:["vegetative multiplication of plants by using micro-organisms.","vegetative multiplication of plants by using small explants.","vegetative multiplication of plants by using microspores.","Non-vegetative multiplication of plants by using microspores and megaspores."],correct:1,exp:"Micropropagation is the vegetative (asexual) multiplication of plants using small tissue explants under sterile, controlled in vitro conditions."},
{q:"Match the following Column A Column B 1) Totipotency A) Reversion of mature cells into meristerm 2) Dedifferentiation B) Biochemical and structural changes of cells 3) Explant C) Properties of living cells develops into entire plant 4) Differentiation D) Selected plant tissue transferred to culture medium 1 2 3 4",options:["C A D B","A C B D","B A D C","D B C A"],correct:0,exp:"Totipotency is the property of a cell to develop into an entire plant, dedifferentiation is the reversion of mature cells to a meristematic state, an explant is the selected tissue placed on culture medium, and differentiation is the biochemical and structural change cells undergo to become specialized."},
{q:"The time duration for sterilization process by using autoclave is ______ minutes and the temperature is _______",options:["10 to 30 minutes and 125° C","15 to 30 minutes and 121° C","15 to 20 minutes and 125° C","10 to 20 minutes and 121° C"],correct:1,exp:"Standard autoclave sterilization for tissue culture media and equipment is carried out at about 121°C for roughly 15 to 20 minutes under pressure, effectively killing microbial contaminants."},
{q:"Which of the following statement is correct",options:["Agar is not extracted from marine algae such as seaweeds.","Callus undergoes differentiation and produces somatic embryoids.","Surface sterilization of explants is done by using mercuric bromide","PH of the culture medium is 5.0 to 6.0"],correct:1,exp:"Under appropriate hormonal conditions, an undifferentiated callus mass can undergo differentiation to form somatic embryos (embryoids), which can subsequently develop into complete plantlets."},
{q:"Select the incorrect statement from given statement",options:["A tonic used for cardiac arrest is obtained from Digitalis purpuria","Medicine used to treat Rheumatic pain is extracted from Capsicum annum","An anti malarial drug is isolated from Cinchona officinalis.","Anti-cancinogenic property is not seen in Catharanthus roseus."],correct:3,exp:"Catharanthus roseus (Vinca) is well known for producing the anticancer alkaloids vincristine and vinblastine, so the statement denying its anticancer property is false."},
{q:"Virus free plants are developed from",options:["Organ culture","Meristem culture","Protoplast culture","Cell suspension culture"],correct:1,exp:"Meristem culture is used to produce virus-free plants because the actively dividing meristematic tip tissue is generally free of viral particles even in an otherwise infected plant."},
{q:"The prevention of large scale loss of biological interity",options:["Biopatent","Bioethics","Biosafety","Biofuel"],correct:2,exp:"Biosafety refers to the policies and practices aimed at preventing large-scale loss of biological integrity, particularly from the release of genetically modified or invasive organisms."},
{q:"Cryopreservation means it is a process to preserve plant cells, tissues or organs",options:["at very low temperature by using ether.","at very high temperature by using liquid nitrogen","at very low temperature of -196 by using liquid nitrogen","at very low temperature by using liquid nitrogen"],correct:2,exp:"Cryopreservation stores plant cells, tissues or organs at ultra-low temperatures, around -196°C, using liquid nitrogen, effectively halting metabolic activity for long-term preservation."},
{q:"Solidifying agent used in plant tissue culture is",options:["Nicotinic acid","Cobaltous chloride","EDTA","Agar"],correct:3,exp:"Agar, a polysaccharide extracted from marine algae (seaweed), is used as the solidifying (gelling) agent in plant tissue culture media."},
];

const BIO_B_PRINCIPLESOFECOLOGY = [
{q:"Arrange the correct sequence of ecological hierarchy starting from lower to higher level.",options:["Individual organism → Population Landscape → Ecosystem","Landscape → Ecosystem → Biome → Biosphere","community → Ecosystem → Landscape → Biome","Population → organism → Biome → Landscape"],correct:2,exp:"Ecological hierarchy progresses from lower to higher levels of organization: individual organism, population, community, ecosystem, landscape, biome, and finally biosphere."},
{q:"Ecology is the study of an individual species is called i) Community ecology ii) Autecology iii) Species ecology iv) Synecology",options:["i only","ii only","i and iv only","ii and iii only"],correct:3,exp:"The study of an individual species is called autecology or species ecology, distinguishing it from synecology or community ecology, which studies groups of species together."},
{q:"A specific place in an ecosystem, where an organism lives and performs its functions is",options:["habitat","niche","landscape","biome"],correct:1,exp:"A niche describes the functional role and specific set of conditions and resources an organism uses within its habitat, distinct from the habitat, which is just the physical location it lives in."},
{q:"Read the given statements and select the correct option. i) Hydrophytes possess aerenchyma to support themselves in water. ii) Seeds of Viscum are positively photoblastic as they germinate only in presence of light. iii) Hygroscopic water is the only soil water available to roots of plant growing in soil as it is present inside the micropores. iv) High temperature reduces use of water and solute absorption by roots.",options:["i, ii, and iii only","ii, iii and iv","ii and iii only","i and ii only"],correct:3,exp:"Hydrophytes possess aerenchyma (air spaces) for buoyancy and gas exchange in water, and Viscum seeds are positively photoblastic, germinating better in the presence of light; the other two statements about soil water and temperature effects are not accurate."},
{q:"Which of the given plant produces cardiac glycosides?",options:["Calotropis","Acacia","Nepenthes","Utricularia"],correct:0,exp:"Calotropis produces cardiac glycosides (cardenolides) in its latex, toxic compounds that deter most grazing herbivores."},
{q:"Read the given statements and select the correct option. i) Loamy soil is best suited for plant growth as it contains a mixture of silt, sand and clay. ii) The process of humification is slow in case of organic remains containing a large amount of lignin and cellulose. iii) Capillary water is the only water available to plant roots as it is present inside the micropores. iv) Leaves of shade plant have more total chlorophyll per reaction centre, low ratio of chl a and chl b are usually thinner leaves.",options:["i, ii and iii only","ii, iii and iv only","i, ii and iv only","ii and iii only"],correct:2,exp:"Loamy soil, being a balanced mixture of sand, silt and clay, best supports plant growth; humification slows in remains rich in lignin and cellulose; and shade leaves tend to have more total chlorophyll with a lower chlorophyll a to b ratio."},
{q:"Read the given statements and select the correct option. Statement A : Cattle do not graze on weeds of Calotropis. Statement B : Calotropis have thorns and spines, as defense against herbivores.",options:["Both statements A and B are incorrect.","Statement A is correct but statement B is incorrect.","Both statements A and B are correct but statement B is not the correct explanation of statement A.","Both statements A and B are correct and statement B is the correct explanation of statement A."],correct:1,exp:"Cattle avoid grazing on Calotropis mainly because of its toxic latex and cardiac glycosides rather than physical thorns or spines, since Calotropis does not bear true thorns."},
{q:"In soil water available for plants is",options:["gravitational water","chemically bound water","capillary water","hygroscopic water"],correct:2,exp:"Capillary water, held within the micropores of soil by surface tension, is the main form of soil water readily available for absorption by plant roots."},
{q:"Read the following statements and fill up the blanks with correct option. i) Total soil water content in soil is called _________________ ii) Soil water not available to plants is called _________________ iii) Soil water available to plants is called _________________ (i) (ii) (iii)",options:["Holard Echard Chresard","Echard Holard Chresard","Chresard Echard Holard","Holard Chresard Echard"],correct:0,exp:"Holard is the total water content of soil, echard is the fraction unavailable to plants (bound too tightly), and chresard is the fraction that is actually available for root uptake."},
{q:"Column I represent the size of the soil particles and Column II represents type of soil components. Which of the following is correct match for the Column I and Column IL Column - I Column - II I). 0.2 to 2.00 mm i) Slit soil II) Less than 0.002 mm ii) Clayey soil III) 0.002 to 0.02 mm iii) Sandy soil IV) 0.002 to 0.2 mm iv) Loamy soil I II III IV",options:["ii iii iv I","iv i iii Ii","iii ii i iv","None of these"],correct:2,exp:"Soil particle sizes correspond to their components: sand particles are the largest, silt particles are intermediate in size, clay particles are the smallest, and loamy soil is a mixture of all these size classes."},
{q:"The plant of this group are adapted to live partly in water and partly above substratum and free from water",options:["Xerophytes","Mesophytes","Hydrophytes","Halophytes"],correct:3,exp:"Halophytes are salt-tolerant plants typically found in marshy or coastal habitats, living partly submerged in water and partly emergent above the substratum."},
{q:"Ophrys an orchid resembling the female of an insect so as to able to get pollinated is due to phenomenon of",options:["Myrmecophily","Ecological equivalents","Mimicry","None of these"],correct:2,exp:"Ophrys orchids mimic the appearance and scent of female insects to attract male insects for pollination, an example of mimicry known as pseudocopulation."},
{q:"A free living nitrogen fixing cyanobacterium which can also form symbiotic association with the water fern Azolla",options:["Nostoc","Anabaena","chlorella","Rhizobium"],correct:1,exp:"Anabaena is a nitrogen-fixing cyanobacterium that forms a well-known symbiotic association with the water fern Azolla, and this combination is used as a natural biofertilizer in rice fields."},
{q:"Pedogenesis refers to",options:["Fossils","Water","Population","Soil"],correct:3,exp:"Pedogenesis refers to the natural process of soil formation from parent rock material through weathering and biological activity over time."},
{q:"Mycorrhiza promotes plant growth by",options:["Serving as a plant growth regulators","Absorbing inorganic ions from soil","Helping the plant in utilizing atmospheric nitrogen","Protecting the plant from infection"],correct:1,exp:"Mycorrhizal fungi form a mutualistic association with plant roots, greatly increasing the root's absorptive surface area and helping the plant absorb inorganic ions and water from the soil."},
{q:"Which of the following plant has a non-succulent xerophytic and thick leathery leaves with waxy coating",options:["Bryophyllum","Ruscus","Nerium","Calotropis"],correct:1,exp:"Ruscus, a xerophyte, has thick, leathery, non-succulent photosynthetic structures with a waxy coating that reduces water loss in dry habitats."},
{q:"In a fresh water environment like pond, rooted autotrophs are",options:["Nymphaea and typha","Ceratophyllum and Utricularia","Wolffia and pistia","Azolla and lemna"],correct:0,exp:"Nymphaea and Typha are rooted hydrophytes anchored in the pond substratum, unlike free-floating forms such as Pistia, Wolffia or Lemna, or fully submerged plants like Ceratophyllum and Utricularia."},
{q:"Match the following and choose the correct combination from the options given below: Column I (Interaction) Column II (Examples) I. Mutualism i). Trichoderma and Penicillium II. Commensalism ii). Balanophora, Orobanche III. Parasitism iii). Orchids and Ferns IV. Predation iv). Lichen and Mycorrhiza V. Amensalism v). Nepenthes and Diaonaea I II III IV V",options:["i ii iii iv v","ii iii iv v i","iii iv v i ii","iv iii ii v i"],correct:3,exp:"Lichen and mycorrhiza represent mutualism, orchids and ferns growing epiphytically represent commensalism, parasitic plants like Balanophora and Orobanche represent parasitism, insectivorous plants like Nepenthes and Dionaea represent predation, and the Trichoderma-Penicillium interaction represents amensalism."},
{q:"Strong, sharp spines that get attached to animal's feet are found in the fruits of",options:["Argemone","Ecballium","Heritier","Crossandra"],correct:1,exp:"Certain fruits develop hooked spines or bristles that catch onto the fur or feet of passing animals, aiding zoochory, or animal-mediated seed dispersal."},
{q:"Sticky glands of Boerhaavia and Cleome support",options:["Anemochory","Zoochory","Autochory","Hydrochory"],correct:1,exp:"The sticky glandular hairs on the fruits of Boerhaavia and Cleome help them adhere to the bodies of passing animals, facilitating zoochory (animal-assisted dispersal)."},
{q:"Identify the A, B, C and D in the given table of interactions: Mutualism (species X: A, species Y: +); (species X: +, species Y: -); Competition (species X: -, species Y: C); D (species X: -, species Y: 0)",options:["A=(+), B=Parasitism, C=(-), D=Amensalism","A=(-), B=Mutualism, C=(+), D=Competition","A=(+), B=Competition, C=(0), D=Mutualism","A=(0), B=Amensalism, C=(+), D=Parasitism"],correct:0,exp:"In ecological interaction notation, mutualism benefits both species (+,+), parasitism benefits one at the cost of the other (+,-), competition harms both (-,-), and amensalism harms one species while leaving the other unaffected (-,0)."},
];

const BIO_B_ECOSYSTEM = [
{q:"Which of the following is not a abiotic component of the ecosystem?",options:["Bacteria","Humus","Organic compounds","Inorganic compounds"],correct:0,exp:"Bacteria are living (biotic) organisms, whereas humus and organic or inorganic compounds are non-living (abiotic) components of an ecosystem."},
{q:"Which of the following is / are not a natural ecosystem?",options:["Forest ecosystem","Rice field","Grassland ecosystem","Desert ecosystem"],correct:1,exp:"A rice field is an artificial, human-managed (agricultural) ecosystem, unlike forests, grasslands and deserts, which occur naturally."},
{q:"Pond is a type of",options:["forest ecosystem","grassland ecosystem","marine ecosystem","fresh water ecosystem"],correct:3,exp:"A pond is a small, relatively static body of fresh water, classifying it as a freshwater ecosystem."},
{q:"Pond ecosystem is",options:["not self sufficient and self regulating","partially self sufficient and self regulating","self sufficient and not self regulating","self sufficient and self regulating"],correct:3,exp:"A pond ecosystem is largely self-sufficient, since its producers generate their own organic matter, and it is self-regulating through internal checks such as predation and nutrient cycling."},
{q:"Profundal zone is predominated by heterotrophs in a pond ecosystem, because of",options:["with effective light penetration","no effective light penetration","complete absence of light","a and b"],correct:1,exp:"The profundal (deep) zone of a pond receives little to no sunlight, so photosynthetic producers cannot survive there, leaving it dominated by heterotrophic organisms such as decomposers."},
{q:"Solar energy used by green plants for photosynthesis is only",options:["2 - 8%","2 - 10%","3 - 10%","2 - 9%"],correct:1,exp:"Green plants typically capture only a small fraction, roughly 2 to 10%, of the incident solar energy for photosynthesis; the rest is reflected, transmitted, or otherwise unused."},
{q:"Which of the following ecosystem has the highest primary productivity?",options:["Pond ecosystem","Lake ecosystem","Grassland ecosystem","Forest ecosystem"],correct:3,exp:"Forest ecosystems have dense, multi-layered vegetation and high standing biomass, giving them the highest primary productivity among common ecosystem types."},
{q:"Ecosystem consists of",options:["decomposers","producers","consumers","all of the above"],correct:3,exp:"A complete ecosystem includes producers, consumers and decomposers, all interacting with each other and with the abiotic environment."},
{q:"Which one is in descending order of a food chain",options:["Producers → Secondary consumers → Primary consumers → Tertiary consumers","Tertiary consumers → Primary consumers → Secondary consumers → Producers","Tertiary consumers → Secondary consumers → Primary consumers → Producers","Tertiary consumers → Producers → Primary consumers → Secondary consumers"],correct:2,exp:"In descending order of a food chain, energy flow moves from tertiary consumers down through secondary and primary consumers to the producers, which form the base of the chain."},
{q:"Significance of food web is / are",options:["it does not maintain stability in nature","it shows patterns of energy transfer","it explains species interaction","b and c"],correct:3,exp:"A food web illustrates multiple interconnected food chains, showing patterns of energy transfer through an ecosystem as well as the various interactions between species."},
{q:"The following diagram represents",options:["pyramid of number in a grassland ecosystem","pyramid of number in a pond ecosystem","pyramid of number in a forest ecosystem","pyramid of biomass in a pond ecosystem"],correct:2,exp:"In a forest ecosystem, a relatively small number of large producer trees support a numerically larger population of smaller consumers, giving a characteristic spindle-shaped pyramid of numbers."},
{q:"Which of the following is / are not the mechanism of decomposition",options:["Eluviation","Catabolism","Anabolism","Fragmentation"],correct:2,exp:"Decomposition proceeds through catabolic breakdown processes such as fragmentation, leaching and mineralization; anabolism (biosynthesis) is not part of the decomposition mechanism."},
{q:"Which of the following is not a sedimentary cycle",options:["Nitrogen cycle","Phosphorous cycle","Sulphur cycle","Calcium cycle"],correct:3,exp:"Biogeochemical cycles are classified as gaseous, where the main reservoir is the atmosphere (as in the nitrogen and carbon cycles), or sedimentary, where the reservoir is Earth's crust and soil (as in the phosphorus, sulphur, and calcium cycles); use this classification to identify the odd one out among the options."},
{q:"Which of the following are not regulating services of ecosystem services i) Genetic resources ii) Recreation and aesthetic values iii) Invasion resistance iv) Climatic regulation",options:["i and iii","ii and iv","i and ii","i and iv"],correct:0,exp:"Ecosystem services are broadly grouped into provisioning, regulating, supporting and cultural categories; climatic regulation and invasion resistance are generally classified as regulating services, while genetic resources and recreation fall under supporting and cultural services respectively."},
];

const BIO_B_ENVIRONMENTALISSUES = [
{q:"Which of the following would most likely help to slow down the greenhouse effect.",options:["Converting tropical forests into grazing land for cattle.","Ensuring that all excess paper packaging is buried to ashes.","Redesigning landfill dumps to allow methane to be collected.","Promoting the use of private rather than public transport."],correct:2,exp:"Capturing methane released from landfill waste prevents this potent greenhouse gas from escaping into the atmosphere, helping slow down the overall greenhouse effect."},
{q:"With respect to Eichhornia Statement A: It drains off oxygen from water and is seen growing in standing water. Statement B: It is an indigenous species of our country.",options:["Statement A is correct and Statement B is wrong.","Both Statements A and B are correct.","Statement A is correct and Statement B is wrong.","Both statements A and B are wrong."],correct:0,exp:"Eichhornia (water hyacinth) depletes dissolved oxygen in the water bodies where it grows profusely, but it is actually an invasive alien species introduced to India, not an indigenous one."},
{q:"Find the wrongly matched pair.",options:["Endemism - Species confined to a region and not found anywhere else.","Hotspots - Western ghats","Ex-situ Conservation - Zoological parks","Sacred groves - Saintri hills of Rajasthan e) Alien sp. of India - Water hyacinth"],correct:2,exp:"Ex-situ conservation protects species outside their natural habitat, as done in zoological parks and seed banks, while in-situ methods such as sanctuaries, national parks and biosphere reserves protect species within their natural habitat."},
{q:"Depletion of which gas in the atmosphere can lead to an increased incidence of skin cancer?",options:["Ammonia","Methane","Nitrous oxide","Ozone"],correct:3,exp:"Depletion of the stratospheric ozone layer allows more harmful UV-B radiation to reach Earth's surface, increasing the risk of skin cancer in humans."},
{q:"One green house gas contributes 14% of total global warming and another contributes 6%. These are respectively identified as",options:["N 0 and CO","CFCs and N 0 2 2 2","CH and CO","CH and CFCS 4 2 4"],correct:1,exp:"Among greenhouse gases, CFCs and nitrous oxide contribute a significant share of global warming despite being present in much smaller atmospheric concentrations than CO2, owing to their very high heat-trapping potential."},
{q:"One of the chief reasons among the following for the depletion in the number of species making endangered is",options:["over hunting and poaching","green house effect","competition and predation","habitat destruction"],correct:3,exp:"Habitat destruction is considered the single largest driver of species endangerment and biodiversity loss worldwide, outweighing factors like hunting or predation."},
{q:"Deforestation means",options:["growing plants and trees in an area where there is no forest","growing plants and trees in an area where the forest is removed","growing plants and trees in a pond","removal of plants and trees"],correct:3,exp:"Deforestation refers to the permanent removal or clearing of forest trees and vegetation, typically to convert the land for agricultural or developmental use."},
{q:"Deforestation does not lead to",options:["Quick nutrient cycling","soil erosion","alternation of local weather conditions","Destruction of natural habitat weather conditions"],correct:0,exp:"Deforestation disrupts and slows nutrient cycling, since it removes the leaf litter and root systems responsible for recycling nutrients, in addition to causing soil erosion and habitat loss."},
{q:"The unit for measuring ozone thickness",options:["Joule","Kilos","Dobson","Watt"],correct:2,exp:"The thickness of the stratospheric ozone layer is measured in Dobson units, representing the total amount of ozone present in a vertical column of air."},
{q:"People's movement for the protection of environment in Sirsi of Karnataka is",options:["Chipko movement","Amirtha Devi Bishwas movement","Appiko movement","None of the above"],correct:2,exp:"The Appiko movement, inspired by the Chipko movement, was a forest conservation movement started in Sirsi, Karnataka, during the 1980s."},
{q:"The plants which are grown in silivpasture system are",options:["Sesbania and Acacia","Solenum and Crotalaria","Clitoria and Begonia","Teak and sandal"],correct:0,exp:"Silvipasture systems combine fast-growing, nitrogen-fixing trees like Sesbania and Acacia with pasture or fodder grasses for sustainable land use and livestock rearing."},
];

const BIO_B_PLANTBREEDING = [
{q:"Assertion: Genetic variation provides the raw material for selection Reason: Genetic variations are differences in genotypes of the individuals.",options:["Assertion is right and reason is wrong.","Assertion is wrong and reason is right.","Both reason and assertion is right.","Both reason and assertion is wrong."],correct:2,exp:"Genetic variation, arising from differences in genotype among individuals, provides the essential raw material on which natural or artificial selection can act during plant breeding."},
{q:"While studying the history of domestication of various cultivated plants _______ were recognized earlier",options:["Centres of origin","Centres of domestication","Centres of hybrid","Centres of variation"],correct:0,exp:"Vavilov's studies on the history of crop domestication led to the identification of specific geographic centres of origin where major cultivated plants were first domesticated."},
{q:"Pick out the odd pair.",options:["Mass selection - Morphological characters","Purline selection - Repeated self pollination","Clonal selection - Sexually propagated","Natural selection - Involves nature"],correct:2,exp:"Clonal selection is applied to vegetatively (asexually) propagated plants, not sexually propagated ones, since it involves selecting and multiplying genetically identical individuals."},
{q:"Match Column I with Column II Column I Column II i) William S. Gaud I) Heterosis ii) Shull II) Mutation breeding iii) Cotton Mather III) Green revolution iv) Muller and Stadler IV) Natural hybridization",options:["i - I, ii - II, iii - III, iv - IV","i - III, ii - I, iii - IV, iv - II","i - IV, ii - II, iii - I, iv - IV","i - II, ii - IV, iii - III, iv - I"],correct:1,exp:"William S. Gaud coined the term \"Green Revolution,\" Shull described hybrid vigour (heterosis), Cotton Mather documented natural hybridization, and Muller and Stadler pioneered radiation-induced mutation breeding."},
{q:"The quickest method of plant breeding is",options:["Introduction","Selection","Hybridization","Mutation breeding"],correct:1,exp:"Selection, choosing superior naturally occurring variants for propagation, is generally the quickest method of plant breeding, since it does not require creating new genetic combinations."},
{q:"Desired improved variety of economically useful crops are raised by",options:["Natural Selection","hybridization","mutation","biofertilisers"],correct:1,exp:"Hybridization, crossing genetically different parents, combines desirable traits from both to develop improved crop varieties."},
{q:"Plants having similar genotypes produced by plant breeding are called",options:["clone","haploid","autopolyploid","genome"],correct:0,exp:"A clone is a group of genetically identical plants produced through vegetative (asexual) propagation from a single parent plant."},
{q:"Importing better varieties and plant environment is called",options:["cloning","heterosis","selection","introduction"],correct:0,exp:"Introduction refers to bringing a new, better-performing plant variety into a region where it was not previously grown."},
{q:"Dwarfing gene of wheat is",options:["pal 1","Atomita 1","Norin 10","pelita 2"],correct:2,exp:"Norin 10 is the Japanese wheat variety that carries the dwarfing genes used to develop high-yielding, semi-dwarf wheat varieties during the Green Revolution."},
{q:"Crosses between the plants of the same variety are called",options:["interspecific","inter varietal","intra varietal","inter generic"],correct:2,exp:"Crosses between plants belonging to the same variety are termed intravarietal crosses."},
{q:"Progeny obtained as a result of repeat self pollination a cross pollinated crop to called",options:["pure line","pedigree line","inbreed line","heterosis"],correct:2,exp:"Repeated self-pollination of a cross-pollinated crop over several generations produces a genetically uniform inbred line."},
{q:"Jaya and Ratna are the semi dwarf varieties of",options:["wheat","rice","cowpea","mustard"],correct:1,exp:"Jaya and Ratna are well-known high-yielding, semi-dwarf rice varieties developed during India's Green Revolution."},
{q:"Which one of the following are the species that are crossed to give sugarcane varieties with high sugar, high yield, thick stems and ability to grow in the sugarcane belt of North India?",options:["Saccharum robustum and Saccharum officinarum","Saccharum barberi and Saccharum officinarum","Saccharum sinense and Saccharum officinarum","Saccharum barberi and Saccharum robustum"],correct:1,exp:"Crossing the thick, high-sugar tropical species Saccharum officinarum with the hardy, adaptable North Indian species Saccharum barberi produced improved sugarcane varieties suited to North India's climate."},
{q:"Match column I (crop) with column II (Corresponding disease resistant variety) and select the correct option from the given codes. Column I Column II I) Cowpea i) Himgiri II) Wheat ii) Pusa komal III) Chilli iii) Pusa Sadabahar IV) Brassica iv) Pusa Swarnim I II III IV",options:["iv iii ii i","ii i iii iv","ii iv i iii","i iii iv ii"],correct:1,exp:"Pusa Komal is a disease-resistant cowpea variety, Himgiri is a rust-resistant wheat variety, Pusa Sadabahar is a virus-resistant chilli variety, and Pusa Swarnim is a disease-resistant Brassica variety."},
{q:"A wheat variety, Atlas 66 which has been used as a donor for improving cultivated wheat, which is rich in",options:["iron","carbohydrates","proteins","vitamins"],correct:2,exp:"The wheat variety Atlas 66 is notably rich in protein content and has been used as a donor parent to improve the protein quality of cultivated wheat."},
{q:"Which one of the following correct matches with its resistance to a disease?",options:["Pusa Komal - Bacterial blight","Pusa Sadabahar - White rust","Pusa Shubhra - Chilli mosaic virus","Brassica - Pusa swarnim"],correct:0,exp:"Pusa Komal is a cowpea variety specifically bred for resistance to bacterial blight disease."},
{q:"Which of the following is incorrectly paired?",options:["Wheat - Himgiri","Milch breed - Sahiwal","Rice - Ratna","Pusa Komal - Brassica"],correct:3,exp:"Pusa Komal is actually a disease-resistant cowpea variety rather than a Brassica variety, making this the incorrectly paired option."},
{q:"Match List I (Biofertilizer) with List II (Organisms): i) Free living N2 fixer, ii) Symbiotic N2 fixer, iii) P Solubilizing, iv) P Mobilizing — a) Aspergillus, b) Amanita, c) Anabaena azollae, d) Azotobacter",options:["i-c, ii-a, iii-b, iv-d","i-d, ii-c, iii-a, iv-b","i-a, ii-c, iii-b, iv-d","i-b, ii-a, iii-d, iv-c"],correct:1,exp:"Azotobacter is a free-living nitrogen fixer, Anabaena azollae fixes nitrogen symbiotically, Aspergillus solubilizes phosphorus, and certain fungi act as phosphorus mobilizers, together forming a range of biofertilizer organisms."},
];

const BIO_B_ECONOMICALLYUSEFULPLANTS = [
{q:"Consider the following statements and choose the right option. i) Cereals are members of grass family. ii) Most of the food grains come from monocotyledon.",options:["(i) is correct and (ii) is wrong","Both (i) and (ii) are correct","(i) is wrong and (ii) is correct","Both (i) and (ii) are wrong"],correct:1,exp:"Cereals belong to the grass family (Poaceae), and since grasses are monocots, most staple food grains do indeed come from monocotyledonous plants."},
{q:"Assertion: Vegetables are important part of healthy eating. Reason: Vegetables are succulent structures of plants with pleasant aroma and flavours.",options:["Assertion is correct, Reason is wrong","Assertion is wrong, Reason is correct","Both are correct and reason is the correct explanation for assertion.","Both are correct and reason is not the correct explanation for assertion."],correct:0,exp:"Vegetables are indeed a vital part of a healthy diet, but describing them broadly as \"succulent structures with pleasant aroma and flavour\" is not an accurate general definition, since that description fits some fruits and spices better."},
{q:"Groundnut is native of _____________",options:["Philippines","India","North America","Brazil"],correct:3,exp:"Groundnut (Arachis hypogaea) is native to South America, specifically Brazil, from where it later spread to be cultivated worldwide."},
{q:"Statement A: Coffee contains caffeine Statement B: Drinking coffee enhances cancer",options:["A is correct, B is wrong","A and B - Both are correct","A is wrong, B is correct","A and B - Both are wrong"],correct:0,exp:"Coffee genuinely contains the stimulant caffeine, but scientific evidence does not support the claim that drinking coffee causes cancer."},
{q:"Tectona grandis is coming under family",options:["Lamiaceae","Fabaceae","Dipterocaipaceae","Ebenaceae"],correct:0,exp:"Tectona grandis (teak) belongs to the family Lamiaceae, having earlier been classified under Verbenaceae."},
{q:"Tamarindus indica is indigenous to",options:["Tropical African region","South India, Sri Lanka","South America, Greece","India alone"],correct:0,exp:"Tamarindus indica (tamarind) is indigenous to tropical Africa, though it has long been cultivated and naturalized across India and Sri Lanka."},
{q:"New world species of cotton",options:["Gossipium arboretum","G.herbaceum","Both a and b","G.barbadense"],correct:3,exp:"Gossypium barbadense is a New World cotton species native to South America, unlike G. arboreum and G. herbaceum, which are Old World species."},
{q:"Assertion: Turmeric fights various kinds of cancer Reason: Curcumin is an anti-oxidant present in turmeric",options:["Assertion is correct, Reason is wrong","Assertion is wrong, Reason is correct","Both are correct","Both are wrong"],correct:2,exp:"Turmeric contains curcumin, a potent antioxidant compound that has shown anticancer properties in various scientific studies."},
{q:"Find out the correctly matched pair.",options:["Rubber Shorea robusta","Dye Lawsonia inermis","Timber Cyperus papyrus","Pulp Hevea brasiliensis"],correct:1,exp:"Lawsonia inermis (henna) is well known as a source of natural dye, correctly matching this plant with dye production."},
{q:"Observe the following statements and pick out the right option from the following: Statement I - Perfumes are manufactured from essential oils. Statement II - Essential oils are formed at different parts of the plants.",options:["Statement I is correct","Statement II is correct","Both statements are correct","Both statements are wrong"],correct:2,exp:"Perfumes are indeed manufactured from essential oils, which are aromatic compounds synthesized and stored in various plant parts such as flowers, leaves, or bark."},
{q:"Observe the following statements and pick out the right option from the following: Statement I: The drug sources of Siddha include plants, animal parts, ores and minerals. Statement II: Minerals are used for preparing drugs with long shelf-life.",options:["Statement I is correct","Statement II is correct","Both statements are correct","Both statements are wrong"],correct:1,exp:"Traditional Siddha medicine formulations do include minerals for preparing certain drug preparations valued for their long shelf-life."},
{q:"The active principle trans-tetra hydro canabial is present in",options:["Opium","Curcuma","Marijuana","Andrographis"],correct:2,exp:"Trans-tetrahydrocannabinol (THC), the main psychoactive compound, is derived from the Cannabis (marijuana) plant."},
{q:"Which one of the following matches is correct?",options:["Palmyra - Native of Brazil","Saccharun - Abundant in Kanyakumari","Steveocide - Natural sweetener","Palmyra sap - Fermented to give ethanol"],correct:2,exp:"Steviocide, extracted from the leaves of Stevia, is a well-known natural, calorie-free sweetener used as a sugar substitute."},
{q:"The only cereal that has originated and domesticated from the New world.",options:["Oryza sativa","Triticum asetumn","Triticum duram","Zea mays 12th Standard - BIO ZOOLOGY NEW BOOK"],correct:3,exp:"Maize (Zea mays) originated and was domesticated in the New World (the Americas), unlike rice and wheat, which originated in the Old World."},
];

const BIO_Z_REPRODUCTIONINORGANISMS = [
{q:"In which type of parthenogenesis are only males produced?",options:["Arrhenotoky","Thelytoky","Amphitoky","Both a and b"],correct:0,exp:"Arrhenotoky is a form of parthenogenesis in which unfertilized (haploid) eggs develop into males only, as seen in honeybees producing drones."},
{q:"Animals giving birth to young ones:",options:["Oviparous","Oviviviparous","Viviparous","Both a and b"],correct:2,exp:"Viviparous animals give birth to live young that develop inside the mother's body and receive nourishment directly from her, as seen in most mammals."},
{q:"The mode of reproduction in bacteria is by",options:["Formation of gametes","Endospore formation","Conjugation","Zoospore formation"],correct:2,exp:"Bacteria can exchange genetic material through conjugation, a process involving direct cell-to-cell contact and transfer of plasmid DNA, considered a primitive form of genetic recombination."},
{q:"In which mode of reproduction variations are seen",options:["Asexual","Parthenogenesis","Sexual","Both a and b"],correct:2,exp:"Sexual reproduction involves the fusion of gametes from two parents, resulting in genetic recombination and variation among offspring, unlike asexual reproduction, which produces genetically identical clones."},
{q:"Assertion: In bee society, all the members are diploid except drones. Reason: Drones are produced by parthenogenesis.",options:["Both A and R are true and R is the correct explanation of A","Both A and R are true but R is not the correct explanation of A","A is true but R is false","Both A and R are false"],correct:0,exp:"In honeybee colonies, drones develop from unfertilized eggs through parthenogenesis and are therefore haploid, while other colony members develop from fertilized eggs and are diploid."},
{q:"Assertion: Offsprings produced by asexual reproduction are genetically identical to the parent. Reason: Asexual reproduction involves only mitosis and no meiosis.",options:["Both A and R are true and R is the correct explanation of A","Both A and R are true but R is not the correct explanation of A","A is true but R is false","Both A and R are false"],correct:0,exp:"Asexual reproduction relies solely on mitotic cell division, without meiosis or gamete fusion, which is why the resulting offspring are genetically identical clones of the parent."},
{q:"Assertion: Viviparous animals give better protection to their offsprings. Reason: They lay their eggs in the safe places of the environment.",options:["Both A and R are true and R is the correct explanation of A","Both A and R are true but R is not the correct explanation of A","A is true but R is false","Both A and R are false"],correct:3,exp:"Viviparous animals give better protection to their offspring because the young develop inside the mother's body, not because they lay eggs in safe places; egg-laying in protected sites is instead characteristic of oviparous animals."},
];

const BIO_Z_HUMANREPRODUCTION = [
{q:"The mature sperms are stored in the",options:["Seminiferous tubules","Vas deferens","Epididymis","Seminal vesicle"],correct:2,exp:"Mature sperm are stored and undergo further maturation in the epididymis before being transported through the vas deferens during ejaculation."},
{q:"The male sex hormone testosterone is secreted from",options:["Sertoli cells","Leydig cell","Epididymis","Prostate gland"],correct:1,exp:"Leydig cells (interstitial cells) located in the testes secrete the male sex hormone testosterone under the stimulation of luteinizing hormone (LH)."},
{q:"The glandular accessory organ which produces the largest proportion of semen is",options:["Seminal vesicle","Bulbourethral gland","Prostate gland","Mucous gland"],correct:0,exp:"The seminal vesicles contribute the largest proportion of the seminal plasma, providing fructose-rich secretions that nourish and support the sperm."},
{q:"The male homologue of the female clitoris is",options:["Scrotum","Penis","Urethra","Testis"],correct:1,exp:"The penis in males is developmentally and structurally homologous to the clitoris in females, since both arise from the same embryonic genital tubercle."},
{q:"The site of embryo implantation is the",options:["Uterus","Peritoneal cavity","Vagina","Fallopian tube"],correct:0,exp:"The blastocyst implants in the endometrial lining of the uterus, where it continues developing into the embryo and later the fetus."},
{q:"The foetal membrane that forms the basis of the umbilical cord is",options:["Allantois","Amnion","Chorion","Yolk sac"],correct:0,exp:"The allantois is the extra-embryonic membrane whose blood vessels contribute to forming the umbilical cord that connects the fetus to the placenta."},
{q:"The most important hormone in intiating and maintaining lactation after birth is",options:["Oestrogen","FSH","Prolactin","Oxytocin"],correct:2,exp:"Prolactin, secreted by the anterior pituitary gland, is the key hormone responsible for initiating and sustaining milk production (lactation) after childbirth."},
{q:"Mammalian egg is",options:["Mesolecithal and non cleidoic","Microlecithal and non cleidoic","Alecithal and non cleidoic","Alecithal and cleidoic"],correct:2,exp:"Mammalian eggs have very little yolk (alecithal) and lack a hard protective shell (non-cleidoic), since the embryo develops inside the mother and is nourished through the placenta instead."},
{q:"The process which the sperm undergoes before penetrating the ovum is",options:["Spermiation","Cortical reaction","Spermiogenesis","Capacitation"],correct:3,exp:"Capacitation is the physiological maturation process sperm undergo within the female reproductive tract, which enables them to penetrate and fertilize the ovum."},
{q:"The milk secreted by the mammary glands soon after child birth is called",options:["Mucous","Colostrum","Lactose","Sucrose"],correct:1,exp:"Colostrum is the yellowish, antibody-rich milk secreted by the mammary glands during the first few days after childbirth."},
{q:"Colostrum is rich in",options:["Ig E","Ig A","Ig D","Ig M"],correct:1,exp:"Colostrum is particularly rich in IgA antibodies, which help provide passive immunity to the newborn against infections."},
{q:"The Androgen Binding Protein (ABP) is produced by",options:["Leydig cells","Hypothalamus","Sertoli cells","Pituitary gland"],correct:2,exp:"Sertoli cells in the seminiferous tubules produce androgen-binding protein (ABP), which helps maintain the high local testosterone concentration needed for spermatogenesis."},
{q:"Which one of the following menstrual irregularities is correctly matched?",options:["Menorrhagia - excessive menstruation","Amenorrhoea - absence of menstruation","Dysmenorrhoea - irregularity of menstruation","Oligomenorrhoea - painful menstruation"],correct:1,exp:"Amenorrhoea specifically refers to the complete absence of menstrual periods, correctly matching the term with its definition."},
{q:"Find the wrongly matched pair",options:["Bleeding phase - fall in oestrogen and progesterone","Follicular phase - rise in oestrogen","Luteal phase - rise in FSH level","Ovulatory phase - LH surge"],correct:2,exp:"The luteal phase is actually characterized by a rise in progesterone secreted from the corpus luteum, not by a rise in FSH, making this the wrongly matched pair."},
{q:"A - In human male, testes are extra abdominal and lie in scrotal sacs. R - Scrotum acts as thermoregulator and keeps temperature lower by 2°C for normal sperm production.",options:["A and R are true, R is the correct explanation of A","A and R are true, R is not the correct explanation of A","A is true, R is false","Both A and R are false"],correct:0,exp:"The scrotal position of the testes, outside the abdominal cavity, keeps them about 2°C cooler than core body temperature, a condition necessary for normal sperm production."},
{q:"A - Ovulation is the release of ovum from the Graafian follicle. R - It occurs during the follicular phase of the menstrual cycle.",options:["A and R are true, R is the correct explanation of A","A and R are true, R is not the correct explanation of A","A is true, R is false","Both A and R are false"],correct:2,exp:"Ovulation, the release of the ovum from the Graafian follicle, actually occurs at the transition out of the follicular phase (around mid-cycle) rather than during the follicular phase itself."},
{q:"A - Head of the sperm consists of acrosome and mitochondria. R - Acrosome contains spiral rows of mitochondria.",options:["A and R are true, R is the correct explanation of A","A and R are true, R is not the correct explanation of A","A is true, R is false","Both A and R are false"],correct:3,exp:"The sperm head contains the acrosome and a compact nucleus, while the mitochondria are located in the sperm's middle piece, not in the acrosome, providing the energy needed for motility."},
];

const BIO_Z_REPRODUCTIVEHEALTH = [
{q:"Which of the following is correct regarding HIV, hepatitis B, gonorrhoea and trichomoniasis?",options:["Gonorrhoea is a STD whereas others are not.","Trichomoniasis is a viral disease whereas others are bacterial.","HIV is a pathogen whereas others are diseases.","Hepatitis B is eradicated completely whereas others are not."],correct:2,exp:"HIV is the virus (pathogen) that causes AIDS, whereas gonorrhoea, hepatitis B and trichomoniasis are the diseases or infections caused by their respective pathogens."},
{q:"Which one of the following groups includes sexually transmitted diseases caused by bacteria only?",options:["Syphilis, gonorrhoea and candidiasis","Syphilis, chlamydiasis and gonorrhoea","Syphilis, gonorrhoea and trichomoniasis","Syphilis, trichomoniasis and pediculosis"],correct:1,exp:"Syphilis, chlamydiasis and gonorrhoea are all sexually transmitted diseases caused by bacteria, unlike candidiasis (fungal) or trichomoniasis (protozoan)."},
{q:"Identify the correct statements from the following",options:["Chlamydiasis is a viral disease.","Gonorrhoea is caused by a spirochaete bacterium, Treponema palladium.","The incubation period for syphilis is 2 to 14 days in males and 7 to 21 days in females.","Both syphilis and gonorrhoea are easily cured with antibiotics."],correct:3,exp:"Since syphilis and gonorrhoea are bacterial STDs, they can be effectively treated and cured with appropriate antibiotics when detected and treated early."},
{q:"A contraceptive pill prevents ovulation by",options:["blocking fallopian tube","inhibiting release of FSH and LH","stimulating release of FSH and LH","causing immediate degeneration of released ovum."],correct:1,exp:"Contraceptive pills contain hormones that suppress the pituitary's release of FSH and LH, thereby preventing follicular development and ovulation."},
{q:"The approach which does not give the defined action of contraceptive is",options:["Hormonal contraceptive Prevents entry of sperms, prevent ovulation and fertilization","Vasectomy Prevents spermatogenesis","Barrier method Prevents fertilization","Intra uterine device Increases phagocytosis of sperms, suppresses sperm motility and fertilizing capacity of sperms"],correct:1,exp:"Vasectomy involves cutting or blocking the vas deferens to prevent sperm transport during ejaculation; it does not stop spermatogenesis (sperm production), which continues normally in the testes."},
{q:"Read the given statements and select the correct option. Statement 1: Diaphragms, cervical caps and vaults are made of rubber and are inserted into the female reproductive tract to cover the cervix before coitus. Statement 2: They are chemical barriers of conception and are reusable.",options:["Both statements 1 and 2 are correct and statement 2 is the correct explanation of statement 1.","Both statements 1 and 2 are correct but statement 2 is not the correct explanation of statement 1.","Statement 1 is correct but statement 2 is incorrect.","Both statements 1 and 2 are incorrect."],correct:2,exp:"Barrier devices such as diaphragms and cervical caps are inserted to mechanically cover the cervix and physically block sperm entry, functioning as mechanical rather than chemical barriers."},
{q:"Match column I with column II and select the correct option from the codes given below. Column I Column II A. Copper releasing IUD (i) LNG-20 B. Hormone releasing (ii) Lippes loop IUD C. Non medicated IUD (iii) Saheli D. Mini pills (iv) Multiload-375",options:["A-(iv), B-(ii), C-(i), D-(iii)","A-(iv), B-(i), C-(iii), D-(ii)","A-(i), B-(iv), C-(ii), D-(iii)","A-(iv), B-(i), C-(ii), D-(iii)"],correct:3,exp:"Multiload-375 is a copper-releasing IUD, LNG-20 is a hormone-releasing IUD, the Lippes loop is a non-medicated IUD, and Saheli is a non-steroidal mini-pill."},
{q:"Select the incorrect action of hormonal contraceptive pills from the following",options:["Inhibition of spermatogenesis.","Inhibition of ovulation.","Changes in cervical mucus impairing its ability to allow passage and transport of sperms.","Alteration in uterine endometrium to make it unsuitable for implantation."],correct:0,exp:"Hormonal contraceptive pills act in females by inhibiting ovulation, altering cervical mucus, and modifying the uterine endometrium; they have no direct effect on spermatogenesis, which occurs only in males."},
];

const BIO_Z_PRINCIPLESOFINHERITANCEA = [
{q:"Haemophilia is more common in males because it is a",options:["Recessive character carried by Y-chromosome","Dominant character carried by Y-chromosome","Dominant trait carried by X-chromosome","Recessive trait carried by X-chromosome"],correct:3,exp:"Haemophilia is caused by a recessive allele located on the X chromosome, so males, having only one X chromosome, express the condition more often than females, who need two copies to be affected."},
{q:"ABO blood group in man is controlled by",options:["Multiple alleles","Lethal genes","Sex linked genes","Y-linked genes"],correct:0,exp:"The ABO blood group system in humans is governed by three alleles (IA, IB, i) at a single gene locus, making it a classic example of multiple allelism."},
{q:"Three children of a family have blood groups A, AB and B. What could be the genotypes of their parents? IA IB IA IO IB IO",options:["and ii","and IB IB IA IA IA IA","and","and ii"],correct:1,exp:"To produce children with blood groups A, AB and B, the parents between them must carry the IA, IB and i alleles; a combination such as IAi and IBi genotypes accounts for all three possible offspring blood groups."},
{q:"Which of the following is not correct?",options:["Three or more alleles of a trait in the population are called multiple alleles.","A normal gene undergoes mutations to form many alleles","Multiple alleles map at different loci of a chromosome","A diploid organism has only two alleles out of many in the population"],correct:2,exp:"Multiple alleles, by definition, occupy the same locus on a chromosome rather than different loci; different forms of a gene arising through mutation still compete for the same gene position."},
{q:"Which of the following phenotypes in the progeny are possible from the parental combination AxB?",options:["A and B only","A,B and AB only","AB only","A,B,AB and O"],correct:3,exp:"Since the ABO gene involves three alleles with complex dominance relationships, a cross between type A and type B parents who are each heterozygous can theoretically yield all four possible blood group phenotypes."},
{q:"Which of the following phenotypes is not possible in the progeny of the parental genotypic combination IAIO IAIB x ?",options:["AB","O","A","B"],correct:1,exp:"Crossing an IAIO parent with an IAIB parent cannot produce an O-type (ii) offspring, since at least one IA or IB allele is always contributed by each parent."},
{q:"Which of the following is true about Rh factor in the offspring of a parental combination DdXDd (both Rh positive)?",options:["All will be Rh-positive","Half will be Rh positive","About ¾ will be Rh negative","About one fourth will be Rh negative"],correct:3,exp:"Crossing two heterozygous Rh-positive (Dd) individuals follows a standard monohybrid pattern, giving a 3:1 ratio, so roughly one-fourth of the offspring are expected to be Rh negative (dd)."},
{q:"What can be the blood group of offspring when both parents have AB blood group?",options:["AB only","A, B and AB","A, B, AB and O","A and B only"],correct:1,exp:"Two AB parents (IAIB × IAIB) can produce offspring with genotypes IAIA, IAIB, or IBIB, corresponding to blood groups A, AB, and B, but cannot produce an O-type offspring."},
{q:"If the child's blood group is 'O' and father's blood group is 'A' and mother's blood group is 'B', the genotype of the parents will be",options:["IA IA and IB IO","IA IO and IB IO","IA IO and IO IO","IO IO and IB IB"],correct:1,exp:"For a child with blood group O (ii) to result from parents with blood groups A and B, both parents must carry a recessive i allele, giving genotypes IAIO and IBIO."},
{q:"XO type of sex determination and XY type of sex determination are examples of",options:["Male heterogamety","Female heterogamety","Male homogamety","Both (b) and (c)"],correct:0,exp:"In both the XO and XY sex-determination systems, males are the heterogametic sex, producing two different types of gametes, while females are homogametic."},
{q:"In an accident there is great loss of blood and there is no time to analyse the blood group which blood can be safely transferred?",options:["'O' and Rh negative","'O' and Rh positive","'B' and Rh negative","'AB' and Rh positive"],correct:0,exp:"Blood group O negative is considered the \"universal donor\" type because it lacks A, B and Rh antigens, making it broadly compatible for emergency transfusions when blood typing isn't immediately possible."},
{q:"Father of a child is colourblind and mother is carrier for colourblindness, the probability of the child being colourblind is",options:["25%","50%","100%","75%"],correct:1,exp:"If the father is colourblind and the mother is a carrier, each child, considering both sons and daughters together, has an overall 50% chance of being colourblind."},
{q:"A marriage between a colourblind man and a normal woman produces",options:["All carrier daughters and normal sons","50% carrier daughters, 50% normal daughters","50% colourblind sons, 50% normal sons","All carrier offsprings"],correct:0,exp:"A colourblind father passes his single X chromosome, carrying the defective allele, to all his daughters, making them carriers, while sons receive his Y chromosome and remain unaffected if the mother is normal."},
{q:"Mangolism is a genetic disorder which is caused by the presence of an extra chromosome number",options:["20","21","4","23"],correct:1,exp:"Down syndrome (mongolism) results from the presence of an extra copy of chromosome 21, a condition known as trisomy 21."},
{q:"Klinefelters' syndrome is characterized by a karyotype of",options:["XYY","XO","XXX","XXY"],correct:3,exp:"Klinefelter's syndrome is characterized by the karyotype XXY, arising from non-disjunction of sex chromosomes during gamete formation."},
{q:"Females with Turners' syndrome have",options:["Small uterus","Rudimentary ovaries","Underdeveloped breasts","All of these"],correct:3,exp:"Turner's syndrome (karyotype XO) is associated with a small uterus, rudimentary or streak ovaries, and underdeveloped secondary sexual characteristics such as breast development."},
{q:"Pataus' syndrome is also referred to as",options:["13-Trisomy","18-Trisormy","21-Trisormy","None of these"],correct:0,exp:"Patau syndrome results from the presence of an extra copy of chromosome 13, a condition known as trisomy 13."},
{q:"Who is the founder of Modern Eugenics movement?",options:["Mendel","Darwin","Fransis Galton","Karl pearson"],correct:2,exp:"Sir Francis Galton, a cousin of Charles Darwin, is credited as the founder of the modern eugenics movement."},
{q:"Improvement of human race by encouraging the healthy persons to marry early and produce large number of children is called",options:["Positive eugenics","Negative eugenics","Positive euthenics","Positive euphenics"],correct:0,exp:"Positive eugenics aims to improve the human race by encouraging genetically healthy individuals to marry early and have more children."},
{q:"The _______deals with the control of several inherited human diseases especially inborn errors of metabolism",options:["Euphenics","Eugenics","Euthenics","All of these"],correct:0,exp:"Euphenics deals with the medical management and control of inherited disorders, especially inborn errors of metabolism, after birth rather than through selective breeding."},
{q:"\"Universal Donor\" and \"Universal Recipients\" blood group are _____and_______respectively",options:["AB, O","O, AB","A, B","B, A"],correct:1,exp:"Blood group O is the universal donor, since it lacks A and B antigens, while AB is the universal recipient, since it lacks anti-A and anti-B antibodies in the plasma."},
{q:"ZW-ZZ system of sex determination occurs in",options:["Fishes","Reptiles","Birds","All of these"],correct:3,exp:"In the ZW-ZZ sex-determination system, females are the heterogametic sex (ZW) and this system is found in birds, many reptiles, and some fish and insects."},
{q:"Co-dominant blood group is",options:["A","AB","B","O"],correct:1,exp:"In the AB blood group, both A and B antigens are expressed simultaneously on red blood cells, making it a classic example of codominance."},
{q:"Which of the following is incorrect regarding ZW-ZZ type of sex determination?",options:["It occurs in birds and some reptiles","Females are homogametic and males are heterogametic","Male produce two types of gametes","It occurs in gypsy moth"],correct:1,exp:"In the ZW-ZZ system, females are actually the heterogametic sex (ZW), while males are homogametic (ZZ), the reverse of what this option states, making it the incorrect statement."},
];

const BIO_Z_MOLECULARGENETICS = [
{q:"Hershey and Chase experiment with bacteriophage showed that",options:["Protein gets into the bacterial cells","DNA is the genetic material","DNA contains radioactive sulphur","Viruses undergo transformation"],correct:1,exp:"The Hershey-Chase blender experiment used radioactively labeled phage DNA and protein to show that only DNA, not protein, enters bacterial cells and directs infection, proving DNA is the genetic material."},
{q:"DNA and RNA are similar with respect to",options:["Thymine as a nitrogen base","A single-stranded helix shape","Nucleotide containing sugars, nitrogen bases and phosphates","The same sequence of nucleotides for the amino acid phenyl alanine"],correct:2,exp:"Both DNA and RNA are nucleic acids built from nucleotide units, each consisting of a sugar, a nitrogenous base, and a phosphate group."},
{q:"A mRNA molecule is produced by",options:["Replication","Transcription","Duplication","Translation"],correct:1,exp:"mRNA is synthesized from a DNA template through the process of transcription, carried out by the enzyme RNA polymerase."},
{q:"The total number of nitrogenous bases in human genome is estimated to be about",options:["5 million","35000","35 million","1 billion"],correct:3,exp:"The human genome contains roughly 3 billion base pairs, making the largest option given the closest approximation among the available choices."},
{q:"E. coli cell grown on 15N medium are transferred to 14N medium and allowed to grow for two generations. DNA extracted from these cells is ultracentrifuged in a cesium chloride density gradient. What density distribution of DNA would you expect in this experiment?",options:["One high and one low density band.","One intermediate density band.","One high and one intermediate density band.","One low and one intermediate density band."],correct:3,exp:"After two generations of semi-conservative replication in a 14N medium, DNA molecules exist as a mix of fully light (14N/14N) and hybrid (14N/15N) strands, producing one low-density and one intermediate-density band, consistent with the Meselson-Stahl model."},
{q:"What is the basis for the difference in the synthesis of the leading and lagging strand of DNA molecules?",options:["Origin of replication occurs only at the 5' end of the molecules.","DNA ligase works only in the 3' → 5' direction.","DNA polymerase can join new nucleotides only to the 3' end of the growing stand.","Helicases and single-strand binding proteins that work at the 5' end."],correct:2,exp:"DNA polymerase can only extend a growing strand by adding nucleotides to its free 3'-OH end, which is why one strand (the leading strand) is synthesized continuously while the other (the lagging strand) is synthesized discontinuously."},
{q:"Which of the following is the correct sequence of event with reference to the central dogma?",options:["Transcription, Translation, Replication","Transcription, Replication, Translation","Duplication, Translation, Transcription","Replication, Transcription, Translation"],correct:3,exp:"The central dogma of molecular biology describes information flow from DNA replication to transcription (DNA to RNA) and then translation (RNA to protein)."},
{q:"Which of the following statements about DNA replication is not correct?",options:["Unwinding of DNA molecule occurs as hydrogen bonds break.","Replication occurs as each base is paired with another exactly like it.","Process is known as semi conservative replication because one old strand is conserved in the new molecule.","Complementary base pairs are held together with hydrogen bonds."],correct:1,exp:"In DNA replication, each base pairs with its complementary partner, adenine with thymine and guanine with cytosine, not with an identical base, making this statement inaccurate."},
{q:"Which of the following statements is not true about DNA replication in eukaryotes?",options:["Replication begins at a single origin of replication.","Replication is bidirectional from the origins.","Replication occurs at about 1 million base pairs per minute.","There are numerous different bacterial chromosomes, with replication ocurring in each at the same time."],correct:3,exp:"Eukaryotic chromosomes are linear and typically have multiple origins of replication per chromosome, unlike the single circular bacterial chromosome that replicates from one origin, making a description involving numerous bacterial chromosomes inapplicable here."},
{q:"The first codon to be deciphered was __________ which codes for ________.",options:["AAA, proline","GGG, alanine","UUU, Phenylalanine","TTT, arginine"],correct:2,exp:"The first codon deciphered, using Nirenberg and Matthaei's poly-U experiment, was UUU, which codes for the amino acid phenylalanine."},
{q:"Meselson and Stahl's experiment proved",options:["Transduction","Transformation","DNA is the genetic material","Semi-conservative nature of DNA replication"],correct:3,exp:"The Meselson-Stahl experiment, using density-labeled nitrogen isotopes, confirmed that DNA replicates semi-conservatively, with each daughter molecule containing one original strand and one newly synthesized strand."},
{q:"When lactose is present in the culture medium:",options:["Transcription of lac y, lac z, lac a genes occurs.","Repressor is unable to bind to the operator.","Repressor is able to bind to the operator.","Both (a) and (b) are correct."],correct:3,exp:"When lactose is present, it binds to the lac repressor protein, preventing it from attaching to the operator, which allows RNA polymerase to transcribe the lac operon's structural genes."},
{q:"Ribosomes are composed of two subunits; the smaller subunit of a ribosome has a binding site for _________ and the larger subunit has two binding sites for two __________.",options:["mRNA and tRNA","tRNA and mRNA","rRNA and mRNA","DNA and RNA"],correct:0,exp:"The smaller ribosomal subunit has a binding site for mRNA, while the larger subunit provides two binding sites for tRNA molecules during protein synthesis."},
{q:"An operon is a:",options:["Protein that suppresses gene expression","Protein that accelerates gene expression","Cluster of structural genes with related function","Gene that switches other genes on or off"],correct:2,exp:"An operon is a functional cluster of structural genes sharing a common promoter and operator, allowing coordinated transcription of genes involved in a related metabolic pathway."},
];

const BIO_Z_EVOLUTION = [
{q:"The first life on earth originated",options:["in air","on land","in water","on mountain"],correct:2,exp:"Life is widely believed to have originated in the primordial oceans, where simple organic molecules formed and eventually gave rise to the first living cells."},
{q:"Who published the book \"Origin of species by Natural Selection\" in 1859?",options:["Charles Darwin","Lamarck","Weismann","Hugo de Vries"],correct:0,exp:"Charles Darwin published \"On the Origin of Species\" in 1859, laying out the theory of evolution by natural selection."},
{q:"Which of the following was the contribution of Hugo de Vries?",options:["Theory of mutation","Theory of natural Selection","Theory of inheritance of acquired characters","Germplasm theory"],correct:0,exp:"Hugo de Vries proposed the mutation theory, suggesting that evolution proceeds through sudden, large genetic changes (mutations) rather than gradual, continuous variation."},
{q:"The wings of birds and butterflies is an example of",options:["Adaptive radiation","convergent evolution","divergent evolution","variation"],correct:1,exp:"Wings evolved independently in birds and butterflies for a similar function, flight, in unrelated evolutionary lineages, a hallmark example of convergent evolution."},
{q:"The phenomenon of \" Industrial Melanism\" demonstrates",options:["Natural selection","induced mutation","reproductive isolation","geographical isolation"],correct:0,exp:"Industrial melanism, in which darker moth forms became more common in soot-darkened, polluted environments, is a well-documented example of natural selection in action."},
{q:"Darwin's finches are an excellent example of",options:["connecting links","seasonal migration","adaptive radiation","parasitism"],correct:2,exp:"Darwin's finches on the Galápagos Islands diversified into many species with differently shaped beaks suited to different food sources, a classic example of adaptive radiation."},
{q:"Who proposed the Germplasm theory?",options:["Darwin","August Weismann","Lamarck","Alfred Wallace"],correct:1,exp:"August Weismann proposed the germplasm theory, distinguishing the germplasm (reproductive cells) from the somatoplasm, and argued that acquired characteristics cannot be inherited."},
{q:"The age of fossils can be determined by",options:["electron microscope","weighing the fossils","carbon dating","analysis of bones"],correct:2,exp:"Radiocarbon (carbon-14) dating is commonly used to estimate the age of fossils and other organic remains."},
{q:"Fossils are generally found in",options:["igneous rocks","metamorphic rocks","volcanic rocks","sedimentary rocks"],correct:3,exp:"Fossils are typically preserved within sedimentary rocks, which form from layers of accumulated sediment that gradually bury and preserve organic remains."},
{q:"Evolutionary history of an organism is called",options:["ancestry","ontogeny","phylogeny","paleontology"],correct:2,exp:"Phylogeny refers to the evolutionary history and relationships of a species or a group of related organisms."},
{q:"The golden age of reptiles was",options:["Mesozoic era","Cenozoic era","Paleozoic era","Proterozoic era"],correct:0,exp:"The Mesozoic era is known as the \"Age of Reptiles\" because dinosaurs and other reptiles dominated terrestrial and marine environments during this time."},
{q:"Which period was called \"Age of fishes\"?",options:["Permian","Triassic","Devonian","Ordovician"],correct:2,exp:"The Devonian period is called the \"Age of Fishes\" due to the great diversification of fish species, including early bony and cartilaginous fishes, during that time."},
{q:"Modern man belongs to which period?",options:["Quaternary","Cretaceous","Silurian","Cambrian"],correct:0,exp:"Modern humans (Homo sapiens) belong to the Quaternary period, the most recent geological period in Earth's history."},
{q:"The Neanderthal man had the brain capacity of",options:["650 - 800cc","1200cc","900cc","1400cc"],correct:3,exp:"Neanderthals had a brain capacity of roughly 1400cc, comparable to, or even slightly larger than, that of modern humans."},
];

const BIO_Z_HUMANHEALTHANDDISEASES = [
{q:"A 30 year old woman has bleedy diarrhoea for the past 14 hours, which one of the following organisms is likely to cause this illness?",options:["Streptococcus pyogens","Clostridium difficile","Shigella dysenteriae","Salmonella enteritidis"],correct:2,exp:"Shigella dysenteriae is a common bacterial cause of acute bloody diarrhoea (bacillary dysentery)."},
{q:"Exo-erythrocytic schizogony of Plasmodium takes place in -------",options:["RBC","Leucocytes","Stomach","Liver"],correct:3,exp:"Exo-erythrocytic schizogony, the initial asexual multiplication phase of Plasmodium in the human host, occurs in liver cells before the parasite goes on to invade red blood cells."},
{q:"The sporozoites of Plasmodium vivax are formed from ------------",options:["Gametocytes","Sporoblasts","Oocysts","Spores"],correct:2,exp:"Sporozoites of Plasmodium develop within, and are released from, oocysts formed on the mosquito's gut wall, before migrating to its salivary glands."},
{q:"Amphetamines are stimulants of the CNS, whereas barbiturates are ----",options:["CNS stimulant","both a and b","hallucinogenic","CNS depressants"],correct:3,exp:"Barbiturates act as central nervous system depressants, slowing brain activity, in contrast to amphetamines, which are CNS stimulants."},
{q:"Choose the correctly match pair.",options:["Amphetamines - Stimulant","LSD - Narcotic","Heroin - Psychotropic","Benzodiazepine - Pain killer"],correct:0,exp:"Amphetamines are correctly classified as CNS stimulants, since they increase alertness and physical activity."},
{q:"The Athlete's foot disease in human is caused by-------",options:["Bacteria","Fungi","Virus","Protozoan"],correct:1,exp:"Athlete's foot (tinea pedis) is a common fungal skin infection affecting the feet."},
{q:"Cirrhosis of liver is caused by chronic intake of ------",options:["Opium","Alcohol","Tobacco","Cocaine"],correct:1,exp:"Chronic, excessive alcohol consumption is a leading cause of liver cirrhosis, in which liver tissue is progressively scarred and damaged."},
{q:"The sporozoite of the malarial parasite is present in ----",options:["saliva of infected female Anopheles mosquito.","RBC of human suffering from malaria.","Spleen of infected humans.","Gut of female Anopheles mosquito."],correct:0,exp:"Sporozoites, the infective stage of the malarial parasite, are present in the saliva of an infected female Anopheles mosquito and are injected into the human host during a bite."},
{q:"Paratope is an",options:["Antibody binding site on variable regions","Antibody binding site on heavy regions","Antigen binding site on variable regions","Antigen binding site on heavy regions"],correct:2,exp:"The paratope is the specific region on an antibody's variable domain that binds to the corresponding antigen, or epitope."},
{q:"Allergy involves",options:["IgE","IgG","lgA","IgM"],correct:0,exp:"Allergic reactions are primarily mediated by IgE antibodies, which trigger the release of histamine and other mediators from mast cells upon allergen exposure."},
{q:"Spread of cancerous cells to distant sites is termed as",options:["Metastasis","Oncogenes","Proto-oncogenes","Malignant neoplasm"],correct:0,exp:"Metastasis is the process by which cancerous cells spread from their original site to establish secondary tumours at distant locations in the body."},
{q:"AIDS virus has",options:["Single stranded RNA","Double stranded RNA","Single stranded DNA","Double stranded DNA"],correct:0,exp:"HIV, the virus that causes AIDS, is a retrovirus that carries single-stranded RNA as its genetic material."},
{q:"B cells that produce and release large amounts of antibody are called",options:["Memory cells","Basophils","Plasma cells","killer cells"],correct:2,exp:"Activated B cells differentiate into plasma cells, which are specialized to synthesize and secrete large quantities of antibodies."},
];

const BIO_Z_MICROBESINHUMANWELFARE = [
{q:"Which of the following microorganism is used for production of citric acid in industries?",options:["Lactobacillus bulgaris","Penicillium citrinum","Aspergillus niger","Rhizopus nigricans"],correct:2,exp:"Aspergillus niger, a fungus, is widely used industrially for the fermentative production of citric acid."},
{q:"Which of the following pair is correctly matched for the product produced by them?",options:["Acetobacter aceti - Antibiotics","Methanobacterium - Lactic acid","Penicilium notatum - Acetic acid","Saccharomyces cerevisiae - Ethanol"],correct:3,exp:"Saccharomyces cerevisiae (baker's/brewer's yeast) ferments sugars to produce ethanol, a process widely used in the beverage and biofuel industries."},
{q:"The most common substrate used in distilleries for the production of ethanol is_________",options:["Soyameal","Groundgram","Molasses","Corn meal"],correct:2,exp:"Molasses, a byproduct of sugar refining, is the most common and economical substrate used in distilleries for large-scale industrial ethanol production."},
{q:"Cry toxins obtained from Bacillus thuringiensis are effective against for______",options:["Mosquitoes","Flies","Nematodes","Bollworms"],correct:3,exp:"Cry toxins produced by Bacillus thuringiensis are widely used as biopesticides that are specifically effective against bollworms and other lepidopteran crop pests."},
{q:"Cyclosporin - A is an immunosuppressive drug produced from _______",options:["Aspergillus niger","Manascus purpureus","Penicillium notatum","Trichoderma polysporum"],correct:3,exp:"Cyclosporin-A, an important immunosuppressive drug used to prevent organ transplant rejection, is produced from the fungus Trichoderma polysporum."},
{q:"Which of the following bacteria is used extensively as a bio-pesticide?",options:["Bacillus thurigiensis","Bacillus subtilis","Lactobacillus acidophilus","Streptococcus lactis"],correct:0,exp:"Bacillus thuringiensis is extensively used as a natural biopesticide because it produces crystal (Cry) toxins that are lethal to specific insect larvae."},
{q:"Which of the following is not involved in nitrogen fixation?",options:["Pseudomonas","Azotobacter","Anabaena","Nostac"],correct:0,exp:"Azotobacter, Anabaena and Nostoc are all well recognized nitrogen-fixing organisms, unlike Pseudomonas, which is not typically classified among the key nitrogen fixers in this context."},
{q:"CO is not released during",options:["Alcoholic fermentation","Lactate fermentation","Aerobic respiration in animals","Aerobic respiration in plants"],correct:1,exp:"Lactate (lactic acid) fermentation converts pyruvate directly into lactic acid without releasing carbon dioxide, unlike alcoholic fermentation and aerobic respiration, both of which release CO2."},
{q:"The purpose of biological treatment of waste water is to _______",options:["Reduce BOD","Increase BOD","Reduce sedimentation","Increase sedimentation"],correct:0,exp:"Biological treatment of wastewater uses microorganisms to break down organic pollutants, thereby reducing the biochemical oxygen demand (BOD) of the treated water."},
{q:"The gases produced in anaerobic sludge digesters are",options:["Methane, oxygen and hydrogen sulphide.","Hydrogen sulphide, methane and sulphur dioxide.","Hydrogen sulphide, nitrogen and methane.","Methane, hydrogen sulphide and CO ."],correct:3,exp:"Anaerobic digestion of sludge by microbes produces a gas mixture dominated by methane, along with hydrogen sulphide and carbon dioxide."},
];

const BIO_Z_APPLICATIONSOFBIOTECHNOL = [
{q:"The first clinical gene therapy was done for the treatment of",options:["AIDS","Cancer","Cystic fibrosis","SCID"],correct:2,exp:"The first widely recognized human gene therapy trial targeted adenosine deaminase (ADA) deficiency, a form of severe combined immunodeficiency (SCID), carried out in 1990."},
{q:"Dolly, the sheep was obtained by a technique known as",options:["Cloning by gene transfer","Cloning without the help of gametes","Cloning by tissue culture of somatic cells","Cloning by nuclear transfer."],correct:3,exp:"Dolly the sheep was created using somatic cell nuclear transfer, in which the nucleus from an adult somatic cell was transferred into an enucleated egg cell."},
{q:"The genetic defect adenosine deaminase deficiency may be cured permanently by",options:["Enzyme replacement therapy","periodic infusion of genetically engineered lymphocytes having ADA cDNA","administering adenosine deaminase activators","introducing bone marrow cells producing ADA into embryo at an early stage of development."],correct:0,exp:"Introducing a functional copy of the ADA gene into a patient's own bone marrow or lymphocyte stem cells offers the possibility of a lasting genetic correction for adenosine deaminase deficiency."},
{q:"How many amino acids are arranged in the two chains of Insulin?",options:["Chain A has 12 and Chain B has 13","Chain A has 21 and Chain B has 30 amino acids","Chain A has 20 and chain B has 30 amino acids","Chain A has 12 and chain B has 20 amino acids."],correct:1,exp:"Human insulin consists of two polypeptide chains linked by disulfide bonds, chain A with 21 amino acids and chain B with 30 amino acids."},
{q:"PCR proceeds in three distinct steps governed by temperature, they are in order of",options:["Denaturation, Annealing, Synthesis","Synthesis, Annealing, Denaturation","Annealing, Synthesis, Denaturation","Denaturation, Synthesis, Annealing"],correct:0,exp:"PCR proceeds through three temperature-controlled steps in order: denaturation (separating the DNA strands), annealing (primer binding), and extension or synthesis (new strand formation)."},
{q:"Which one of the following statements is true regarding DNA polymerase used in PCR?",options:["It is used to ligate introduced DNA in recipient cells","It serves as a selectable marker","It is isolated from a Virus","It remains active at a high temperature."],correct:3,exp:"The Taq DNA polymerase used in PCR is heat-stable, allowing it to remain functional through the repeated high-temperature denaturation steps of the reaction cycle."},
{q:"ELISA is mainly used for",options:["Detection of mutations","Detection of pathogens","Selecting animals having desired traits","Selecting plants having desired traits"],correct:1,exp:"ELISA (enzyme-linked immunosorbent assay) is widely used to detect the presence of specific antigens or antibodies, making it valuable for diagnosing infections caused by pathogens."},
{q:"Transgenic animals are those which have",options:["Foreign DNA in some of their cells","Foreign DNA in all their cells","Foreign RNA in some of their cells","Foreign RNA in all their cells"],correct:1,exp:"Transgenic animals carry a foreign gene stably incorporated into the genome of all their cells, including the germ cells, allowing the trait to be passed on to offspring."},
{q:"Recombinant Factor VIII is produced in the ------- cells of the Chinese Hamster",options:["Liver cells","blood cells","ovarian cells","brain cells."],correct:2,exp:"Recombinant Factor VIII, used to treat haemophilia, is commercially produced using genetically engineered Chinese hamster ovary (CHO) cells."},
{q:"Vaccines that use components of a pathogenic organism rather than the whole organism are called",options:["Subunit recombinant vaccines","attenuated recombinant vaccines","DNA vaccines","conventional vaccines."],correct:0,exp:"Subunit recombinant vaccines use only specific antigenic protein components of a pathogen, produced through genetic engineering, rather than the whole organism, reducing risk while still triggering an immune response."},
];

const BIO_Z_ORGANISMSANDPOPULATION = [
{q:"All populations in a given physical area are defined as",options:["Biome","Ecosystem","Territory","Biotic factors"],correct:0,exp:"A biological community consists of all the populations of different species living together and interacting within a given physical area or habitat."},
{q:"Organisms which can survive a wide range of temperatuer are called",options:["Ectotherms","Eurytherms","Endotherms","Stenotherms"],correct:1,exp:"Eurytherms are organisms capable of tolerating and surviving across a wide range of ambient temperatures."},
{q:"The interaction in nature, where one gets benefit on the expense of other is...",options:["Predation","Mutualism","Amensalism","Commensalism"],correct:3,exp:"In commensalism, one species benefits from the association while the other is neither helped nor harmed by it."},
{q:"Predation and parasitism are which type of interactions?",options:["(+,+)","(+, O)","( -, -)","(+, -)"],correct:3,exp:"Both predation and parasitism are (+,-) type interactions, where one species benefits (the predator or parasite) while the other is harmed (the prey or host)."},
{q:"Competition between species leads to",options:["Extinction","Mutation","Amensalism","Symbiosis"],correct:0,exp:"Intense competition between species for the same limited resources can drive the less competitive species toward local extinction, a process known as competitive exclusion."},
{q:"Which of the following is an r-species",options:["Human","Insects","Rhinoceros","Whale"],correct:1,exp:"Insects are classic r-selected species, characterized by rapid reproduction, short lifespans, and large numbers of offspring with minimal parental care."},
{q:"Match the following and choose the correct combination from the options given below. Column I Column II A. Mutalism 1. Lion and deer B. Commensalism 2. Round worm and man C. Parasitism 3. Birds compete with squirrels for nuts D. Competition 4. Sea anemone on hermit crab E. Predation 5. Bernacles attached to Whales. Dispersal",options:["A- 4, B-5, C-2, D -3, E-1","A- 3, B-1, C-4, D - 2, E-5","A- 2, B-3, C-1, D - 5, E-4","A- 5, B-4, C-2, D - 3, E-1"],correct:0,exp:"Sea anemone on a hermit crab illustrates mutualism, barnacles on a whale illustrate commensalism, a roundworm in a human illustrates parasitism, birds competing with squirrels for nuts illustrates competition, and a lion preying on deer illustrates predation."},
{q:"The figure given below is a diagrammatic representation of response of organisms to abiotic factors. What do A, B and C represent respectively. S.No. A B C",options:["Conformer Regulator Partial Regulator","Regulator Partial Regulator Conformer","Partial Regulator Regulator Conformer","Regulator Conformer Partial Regulator"],correct:0,exp:"Conformers allow their internal environment to vary along with external conditions, regulators maintain a stable internal environment through homeostatic mechanisms, and partial regulators show intermediate behaviour, regulating only within a limited range of conditions."},
{q:"The relationship between sucker fish and shark is...........",options:["Competition","Commensalism","Predation","Parasitism."],correct:1,exp:"The relationship between a sucker fish (remora) and a shark is commensal, since the remora gains transport and access to leftover food while the shark is largely unaffected."},
{q:"What type of human population is represented by the following age pyramid?",options:["Vanishing population","Stable population","Declining population","Expanding population"],correct:1,exp:"An age pyramid showing roughly equal numbers across pre-reproductive, reproductive, and post-reproductive age groups indicates a stable population."},
{q:"Which of the following is correct for r-selected species",options:["Large number of progeny with small size","large number of progeny with large size","small number of progeny with small size","small number of progeny with large size"],correct:0,exp:"r-selected species typically produce a large number of small offspring with minimal parental investment, favouring rapid population growth in unstable or unpredictable environments."},
{q:"Animals that can move from fresh water to sea called as.....",options:["Stenothermal","Eurythermal","Catadromous","Anadromous"],correct:2,exp:"Catadromous animals, such as certain eels, live in freshwater but migrate to the sea to breed."},
{q:"Some organisms are able to maintain homeostasis by physical means ...",options:["Conform","Regulate","Migrate","Suspend."],correct:1,exp:"Organisms that maintain a stable internal environment despite external fluctuations, using their own physiological mechanisms, are called regulators."},
];

const BIO_Z_BIODIVERSITYANDITSCONSER = [
{q:"Which of the following region has maximum biodiversity",options:["Taiga","Tropical forest","Temperate rain forest","Mangroves"],correct:1,exp:"Tropical rainforests harbour the greatest species diversity of any biome on Earth, owing to their stable warm climate and abundant year-round resources."},
{q:"Conservation of biodiversity within their natural habitat is",options:["Insitu conservation","Exsitu conservation","In vivo conservation","In vitro conservation"],correct:0,exp:"In-situ conservation protects species within their natural habitat, such as through national parks, wildlife sanctuaries, and biosphere reserves."},
{q:"Which one of the following is not coming under insitu conservation",options:["Sanctuaries","Natural parks","Zoological park","Biosphere reserve"],correct:2,exp:"Zoological parks are a form of ex-situ conservation, protecting species outside their natural habitat, unlike sanctuaries, national parks, and biosphere reserves, which are in-situ methods."},
{q:"Which of the following is considered a hotspots of biodiversity in India",options:["Western ghats","Indo-gangetic plain","Eastern Himalayas","A and C"],correct:3,exp:"The Western Ghats and the Eastern Himalayas are recognized biodiversity hotspots in India, marked by high species richness and endemism combined with significant habitat threat."},
{q:"The organization which published the red list of species is",options:["WWF","IUCN","ZSI","UNEP"],correct:1,exp:"The IUCN (International Union for Conservation of Nature) publishes the Red List, which assesses and categorizes the conservation status of species worldwide."},
{q:"Who introduced the term biodiversity?",options:["Edward Wilson","Walter Rosen","Norman Myers","Alice Norman"],correct:1,exp:"The term \"biodiversity\" was coined by Walter G. Rosen in 1985."},
{q:"Which of the following forests is known as the lungs of the planet earth?",options:["Tundra forest","Rain forest of north east India","Taiga forest","Amazon rain forest"],correct:1,exp:"Large, dense tropical rainforests are often called the \"lungs of the planet\" because of the vast amounts of oxygen they produce and carbon dioxide they absorb through photosynthesis."},
{q:"Which one of the following are at high risk extinction due to habitat destruction",options:["Mammals","Birds","Amphibians","Echinoderms"],correct:2,exp:"Amphibians, due to their dependence on both aquatic and terrestrial habitats along with their permeable skin, are especially vulnerable to habitat destruction and are considered among the most threatened animal groups."},
{q:"Assertion: The Environmental conditions of the tropics are favourable for speciation and diversity of organisms. Reason: The climate seasons, temperature, humidity and photoperiod are more or less stable and congenial.",options:["Both Assertion and Reason are true and Reason explains Assertion correctly.","Both Assertion and Reason are true but Reason is not the correct explanation of Assertion.","Assertion is true , but Reason is false.","Both Assertion and Reason are false."],correct:0,exp:"The tropics have relatively stable temperature, humidity, and photoperiod conditions year-round, creating favourable conditions that promote high rates of speciation and species diversity."},
];

const BIO_Z_ENVIRONMENTALISSUESZOOLO = [
{q:"Right to Clean Water is a fundamental right, under the Indian Constitution",options:["Article 12","Article 21","Article 31","Article 41"],correct:1,exp:"The right to clean water has been judicially interpreted as part of the fundamental right to life under Article 21 of the Indian Constitution."},
{q:"With which of the following, the Agenda 21' of Rio Summit, 1992 is related to?",options:["Sustainable development","Combating the consequences of population","Mitigation norms of Green House Gases (GHGs) emission.","Technology transfer mechanism to developing countries for 'clean-energy' production."],correct:0,exp:"Agenda 21, adopted at the 1992 Rio Earth Summit, is a comprehensive action plan focused on promoting sustainable development worldwide."},
{q:"Which among the following awards instituted by the Government of India for individuals or communities from rural areas that have shown extraordinary courage and dedication in protecting Wildlife?",options:["Indira Gandhi Paryavaran Puraskar","Medini Puruskar Yojana","Amrita Devi Bishnoi Award","Pitambar Pant National Award"],correct:2,exp:"The Amrita Devi Bishnoi Wildlife Protection Award recognizes individuals or communities in rural areas who show exceptional courage in protecting wildlife, named after the Bishnoi woman who sacrificed her life to protect trees."},
{q:"The 'thickness' of Stratospheric Ozone layer is measured in/on:",options:["Sieverts units","Dobson units","Melson units","Beaufort Scale"],correct:1,exp:"Stratospheric ozone thickness is measured in Dobson units (DU), which quantify the total amount of ozone in a vertical column of the atmosphere."},
{q:"Which among the following is the most abundant Green-House-Gas (GHG) in the earth's atmosphere?",options:["Carbon dioxide","Water Vapour","Sulphur Dioxide","Tropospheric Ozone"],correct:1,exp:"Water vapour is naturally the most abundant greenhouse gas in Earth's atmosphere, even though carbon dioxide receives more attention due to its human-driven increase."},
{q:"As per 2017 statistics, the highest per capita emitter of Carbon dioxide in the world is",options:["USA","China","Qatar","Saudi Arabia"],correct:1,exp:"Per-capita carbon dioxide emissions are often highest in small, oil- or gas-rich nations, while large industrializing countries tend to lead in total, rather than per-capita, emissions, a distinction worth keeping in mind when interpreting such rankings."},
{q:"The use of microorganism metabolism to remove pollutants such as oil spills in the water bodies is known as",options:["Biomagnification","Bioremediation","Biomethanation","Bioreduction"],correct:1,exp:"Bioremediation uses the natural metabolic activity of microorganisms to break down and remove pollutants, such as oil spills, from contaminated environments."},
{q:"The Ozone Day is observed every year on September 16 as on this day in 1987 the ___________was signed for launching efforts to arrest the depletion of the fragile ozone layer in the stratosphere that prevents the harmful ultra-violet rays of the sun from reaching the earth. Fill the correct word in blank.",options:["Montreal Protocol","Geneva Protocol","Kyoto Protocol","Nagoya Protocol"],correct:0,exp:"The Montreal Protocol, signed in 1987, is the international treaty aimed at phasing out substances responsible for depleting the stratospheric ozone layer."},
{q:"Which among the following always decreases in a Food chain across tropic levels?",options:["Number","Accumulated chemicals","Energy","Force"],correct:2,exp:"Energy content always decreases progressively at each successive trophic level in a food chain, in line with the second law of thermodynamics, unlike substances such as accumulated chemicals, which can biomagnify instead."},
{q:"In the E-waste generated by the Mobile Phones, which among the following metal is most abundant?",options:["Copper","Silver","Palladium","Gold"],correct:0,exp:"Copper is typically the most abundant recoverable metal by mass in the e-waste generated from discarded mobile phones."},
{q:"The Hydrochlorofluorocarbons (HCFCs) are the compounds which have the following molecules:",options:["Hydrogen","Carbon","Chlorine","Fluorine"],correct:2,exp:"Hydrochlorofluorocarbons (HCFCs) contain hydrogen, fluorine, carbon and chlorine; the chlorine component is specifically responsible for their ozone-depleting effect."},
{q:"SMOG is derived from :",options:["Smoke","Fog","Both A and B","Only A"],correct:2,exp:"The term \"smog\" is a portmanteau combining \"smoke\" and \"fog,\" reflecting its origin as a mixture of smoke particles and fog or mist in the atmosphere."},
{q:"Excess of fluoride in drinking water causes:",options:["Lung disease","Intestinal infection","Fluorosis","None of the above"],correct:2,exp:"Excess fluoride in drinking water causes fluorosis, a condition that affects bones and teeth due to fluoride accumulation in the body."},
];

const CHAPTERS_BIOLOGY = [
  {id:601, name:"Botany: Asexual and Sexual Reproduction in Plants", icon:"🌱", questions:BIO_B_ASEXUALANDSEXUALREPRODUC, additionalQuestions:[]},
  {id:602, name:"Botany: Classical Genetics", icon:"🧬", questions:BIO_B_CLASSICALGENETICS, additionalQuestions:[]},
  {id:603, name:"Botany: Chromosomal Basis of Inheritance", icon:"🧬", questions:BIO_B_CHROMOSOMALBASISOFINHERI, additionalQuestions:[]},
  {id:604, name:"Botany: Principles and Processes of Biotechnology", icon:"🧪", questions:BIO_B_PRINCIPLESANDPROCESSESOF, additionalQuestions:[]},
  {id:605, name:"Botany: Plant Tissue Culture", icon:"🌿", questions:BIO_B_PLANTTISSUECULTURE, additionalQuestions:[]},
  {id:606, name:"Botany: Principles of Ecology", icon:"🌎", questions:BIO_B_PRINCIPLESOFECOLOGY, additionalQuestions:[]},
  {id:607, name:"Botany: Ecosystem", icon:"♻️", questions:BIO_B_ECOSYSTEM, additionalQuestions:[]},
  {id:608, name:"Botany: Environmental Issues", icon:"🌍", questions:BIO_B_ENVIRONMENTALISSUES, additionalQuestions:[]},
  {id:609, name:"Botany: Plant Breeding", icon:"🌾", questions:BIO_B_PLANTBREEDING, additionalQuestions:[]},
  {id:610, name:"Botany: Economically Useful Plants and Entrepreneurial Botany", icon:"💰", questions:BIO_B_ECONOMICALLYUSEFULPLANTS, additionalQuestions:[]},
  {id:611, name:"Zoology: Reproduction in Organisms", icon:"🐣", questions:BIO_Z_REPRODUCTIONINORGANISMS, additionalQuestions:[]},
  {id:612, name:"Zoology: Human Reproduction", icon:"👶", questions:BIO_Z_HUMANREPRODUCTION, additionalQuestions:[]},
  {id:613, name:"Zoology: Reproductive Health", icon:"❤️", questions:BIO_Z_REPRODUCTIVEHEALTH, additionalQuestions:[]},
  {id:614, name:"Zoology: Principles of Inheritance and Variation", icon:"🧬", questions:BIO_Z_PRINCIPLESOFINHERITANCEA, additionalQuestions:[]},
  {id:615, name:"Zoology: Molecular Genetics", icon:"🧫", questions:BIO_Z_MOLECULARGENETICS, additionalQuestions:[]},
  {id:616, name:"Zoology: Evolution", icon:"🦴", questions:BIO_Z_EVOLUTION, additionalQuestions:[]},
  {id:617, name:"Zoology: Human Health and Diseases", icon:"🩺", questions:BIO_Z_HUMANHEALTHANDDISEASES, additionalQuestions:[]},
  {id:618, name:"Zoology: Microbes in Human Welfare", icon:"🦠", questions:BIO_Z_MICROBESINHUMANWELFARE, additionalQuestions:[]},
  {id:619, name:"Zoology: Applications of Biotechnology", icon:"💉", questions:BIO_Z_APPLICATIONSOFBIOTECHNOL, additionalQuestions:[]},
  {id:620, name:"Zoology: Organisms and Population", icon:"🦓", questions:BIO_Z_ORGANISMSANDPOPULATION, additionalQuestions:[]},
  {id:621, name:"Zoology: Biodiversity and its Conservation", icon:"🐅", questions:BIO_Z_BIODIVERSITYANDITSCONSER, additionalQuestions:[]},
  {id:622, name:"Zoology: Environmental Issues (Zoology)", icon:"🌍", questions:BIO_Z_ENVIRONMENTALISSUESZOOLO, additionalQuestions:[]}
];

/* ================= COMMERCE QUESTION BANK (12th Std, Book Back 1 Mark PDF) ================= */
const COM1_PRINCIPLES_OF_MANAGEMENT = [
{q:"Management is what a _______ does?",options:["Manager", "Subordinate", "Supervisor", "Superior"],correct:0,exp:"Management is essentially the work carried out by a manager in directing others toward goals."},
{q:"Management is an ________",options:["Art", "Science", "Art and Science", "Art or Science"],correct:2,exp:"Management is regarded as both a science, with systematic principles, and an art, requiring skill in applying them."},
{q:"Scientific management is developed by",options:["Fayol", "Taylor", "Mayo", "Jacob"],correct:1,exp:"F.W. Taylor is known as the father of scientific management."},
{q:"Dividing the work into small tasks is known as",options:["Discipline", "Unity", "Division of work", "Equity"],correct:2,exp:"Division of work, one of Fayol's principles, means splitting work into smaller, specialised tasks for efficiency."},
{q:"With a wider span, there will be _______ hierarchical levels.",options:["More", "Less", "Multiple", "Additional"],correct:1,exp:"A wider span of control means one manager oversees more people, which reduces the number of hierarchical levels needed."},
];

const COM2_FUNCTIONS_OF_MANAGEMENT = [
{q:"Which is the primary function of management?",options:["Innovating", "Controlling", "Planning", "Decision-making"],correct:2,exp:"Planning is the primary function because it decides in advance what needs to be done before other functions can follow."},
{q:"Which of the following is not a main function?",options:["Decision-making", "Planning", "Organising", "Staffing"],correct:0,exp:"Decision-making runs through every managerial function rather than standing alone as a separate main function."},
{q:"_________ is included in every managerial function.",options:["Co-ordinating", "Controlling", "Staffing", "Organising"],correct:0,exp:"Co-ordination is present in every managerial function since it links and synchronises all activities."},
{q:"Which of the following is verification function?",options:["Planning", "Organising", "Staffing", "Controlling"],correct:3,exp:"Controlling is the verification function, checking whether actual performance matches planned standards."},
{q:"The goals are achieved with the help of ____",options:["Motivation", "Controlling", "Planning", "Staffing"],correct:0,exp:"Motivation drives employees to work towards achieving the organisation's goals."},
];

const COM3_MBO_MBE = [
{q:"___________ System gives full Scope to the Individual Strength and Responsibility.",options:["MBO", "MBE", "MBM", "MBA"],correct:0,exp:"Management by Objectives (MBO) gives individuals full scope for their strengths and responsibility by setting mutually agreed objectives."},
{q:"Which is the First step in Process of MBO?",options:["Fixing Key Result Area", "Appraisal of Activities", "Matching Resources with Activities", "Defining Organisational Objectives"],correct:3,exp:"The MBO process begins by defining the organisation's overall objectives before any other step."},
{q:"__________ keeps Management Alert to Opportunities and Threats by Identifying Critical Problems.",options:["MBA", "MBE", "MBM", "MBO"],correct:1,exp:"Management by Exception (MBE) keeps management alert to opportunities and threats by flagging only critical deviations."},
{q:"Delegation of Authority is Easily Done with the Help of __________ .",options:["MBM", "MBE", "MBO", "MBA"],correct:2,exp:"MBO makes delegation of authority easier since employees are given clear objectives to work towards."},
{q:"MBO is popularised in the USA by __________",options:["Prof. Reddin", "George Odiorne", "Henry Fayol", "F.W Taylor"],correct:1,exp:"George Odiorne is credited with popularising MBO in the USA."},
];

const COM4_INTRODUCTION_TO_FINANCIAL_MARKETS = [
{q:"Financial market facilitates business firms",options:["To rise funds", "To recruit workers", "To make more sales", "To minimize fund requirement"],correct:0,exp:"Financial markets exist mainly to help business firms raise the funds they need."},
{q:"Capital market is a market for",options:["Short Term Finance", "Medium Term Finance", "Long Term Finance", "Both Short Term and Medium Term Finance"],correct:2,exp:"The capital market deals in long-term finance, such as shares and debentures."},
{q:"Primary market is also called as",options:["Secondary market", "Money market", "New Issue Market", "Indirect Market"],correct:2,exp:"The primary market is called the New Issue Market because new securities are issued here for the first time."},
{q:"Spot Market is a market where the delivery of the financial instrument and payment of cash occurs",options:["Immediately", "In the future", "Uncertain", "After one month"],correct:0,exp:"In a spot market, delivery of the financial instrument and payment of cash happen immediately."},
{q:"How many times a security can be sold in a secondary market?",options:["Only one time", "Two time", "Three times", "Multiple times"],correct:3,exp:"A security can be bought and sold multiple times in the secondary market."},
];

const COM5_CAPITAL_MARKET = [
{q:"Capital market do not provide",options:["Short term Funds", "Debenture Funds", "Equity Funds", "Long term Funds"],correct:0,exp:"The capital market deals in long-term instruments and does not provide short-term funds."},
{q:"When the NSEI was established",options:["1990", "1992", "1998", "1997"],correct:1,exp:"The National Stock Exchange of India (NSE) was established in 1992."},
{q:"Primary market is a Market where securities are traded in the",options:["First Time", "Second Time", "Three Time", "Several Times"],correct:0,exp:"Securities are traded for the first time in the primary market."},
{q:"Participants in the Capital Market includes",options:["Individuals", "Corporate", "Financial Institutions", "All of the above"],correct:3,exp:"Individuals, corporates, and financial institutions all participate in the capital market."},
{q:"The _______ was set up by a premier financial institution to allow the trading of securities across the electronic counters throughout the country.",options:["OTCEI", "Factoring", "Mutual Funds", "Venture Funds Institutions"],correct:0,exp:"The Over the Counter Exchange of India (OTCEI) was set up to allow electronic trading of securities nationwide."},
];

const COM6_MONEY_MARKET = [
{q:"The money invested in the call money market provides high liquidity with _________________.",options:["Low Profitability", "High Profitability", "Limited Profitability", "Medium Profitability"],correct:0,exp:"Call money offers high liquidity but relatively low profitability since it is a very short-term instrument."},
{q:"A major player in the money market is the _________________.",options:["Commercial Bank", "Reserve Bank of India", "State Bank of India", "Central Bank."],correct:0,exp:"Commercial banks are among the major players active in the money market."},
{q:"Debt Instruments are issued by Corporate Houses are raising short-term financial resources from the money market are called __________.",options:["Treasury Bills", "Commercial Paper", "Certificate of Deposit", "Government Securities"],correct:1,exp:"Commercial paper is an unsecured short-term debt instrument issued by corporate houses to raise funds."},
{q:"The market for buying and selling of Commercial Bills of Exchange is known as a __________.",options:["Commercial Paper Market", "Treasury Bill Market", "Commercial Bill Market", "Capital Market"],correct:2,exp:"The market for trading commercial bills of exchange is known as the commercial bill market."},
{q:"A marketable document of title to a time deposit for a specified period may be referred to as a __________.",options:["Treasury Bill", "Certificate of Deposit", "Commercial Bill", "Government. Securities"],correct:1,exp:"A Certificate of Deposit is a marketable document representing a time deposit for a specified period."},
];

const COM7_STOCK_EXCHANGE = [
{q:"_______ is the oldest stock exchange in the world.",options:["London Stock Exchange", "Bombay Stock Exchange", "National Stock Exchange", "Amsterdam Stock Exchange"],correct:3,exp:"The Amsterdam Stock Exchange, established in 1602, is regarded as the world's oldest stock exchange."},
{q:"There are _____ stock exchange in the country.",options:["21", "24", "20", "25"],correct:1,exp:"India has 24 recognised stock exchanges as per this data."},
{q:"Jobbers transact in a stock exchange",options:["For their Clients", "For their Own Transactions", "For other Brokers", "For other Members"],correct:1,exp:"Jobbers deal in securities on their own account rather than on behalf of clients."},
{q:"A pessimistic speculator is",options:["Stag", "Bear", "Bull", "Lame Duck"],correct:1,exp:"A bear is a pessimistic speculator who expects prices to fall."},
{q:"An optimistic speculator is",options:["Bull", "Bear", "Stag", "Lame duck"],correct:0,exp:"A bull is an optimistic speculator who expects prices to rise."},
];

const COM8_SEBI = [
{q:"Securities Exchange Board of India was first established in the year ____",options:["1988", "1992", "1995", "1998"],correct:0,exp:"SEBI was first set up in 1988, later given statutory powers in 1992."},
{q:"The headquarters of SEBI is _______",options:["Calcutta", "Bombay", "Chennai", "Delhi"],correct:1,exp:"SEBI's headquarters is located in Mumbai (Bombay)."},
{q:"Registering and controlling the functioning of collective investment schemes as _______",options:["Mutual Funds", "Listing", "Rematerialisation", "Dematerialization"],correct:0,exp:"SEBI registers and regulates collective investment schemes such as mutual funds."},
{q:"SEBI is empowered by the Finance ministry to nominate ______ members on the Governing body of every stock exchange.",options:["5", "3", "6", "7"],correct:3,exp:"SEBI can nominate up to seven members on the governing body of every stock exchange."},
{q:"Trading is dematerialized shares commenced on the NSE is ________",options:["January 1996", "June 1998", "December 1996", "December 1998"],correct:2,exp:"Trading in dematerialised shares began on the NSE in December 1996."},
];

const COM9_FUNDAMENTALS_OF_HUMAN_RESOURCE_MANAGEMENT = [
{q:"Human resource is a _________ asset.",options:["Tangible", "Intangible", "Fixed", "Current"],correct:1,exp:"Human resources are treated as an intangible asset since they cannot be physically measured like machinery."},
{q:"Human Resource management is both _________ and _________ .",options:["Science and art", "Theory and practice", "History and Geography", "None of the above"],correct:0,exp:"HRM is regarded as both a science, with systematic principles, and an art, requiring skill in practice."},
{q:"Planning is a _________ function.",options:["Selective", "pervasive", "both a and b", "none of the above"],correct:1,exp:"Planning is pervasive because it is carried out at every level of management."},
{q:"Human resource management determines the _________ relationship.",options:["Internal, External", "Employer, employee", "Owner, Servant", "Principle, Agent"],correct:1,exp:"HRM primarily governs the relationship between employer and employee."},
{q:"Labour turnover is the rate at which employees _________ the organisation",options:["Enter", "Leave", "Salary", "None of the above"],correct:1,exp:"Labour turnover measures the rate at which employees leave an organisation."},
];

const COM10_RECRUITMENT_METHODS = [
{q:"Recruitment is the process of identifying ______",options:["Right man for right job", "good performer", "Right job", "All of the above"],correct:0,exp:"Recruitment aims to identify and attract the right person for the right job."},
{q:"Recruitment bridges gap between _____and ________",options:["Job seeker and job provider", "Job seeker and agent", "Job provider and owner", "Owner and servant"],correct:0,exp:"Recruitment bridges the gap between job seekers and job providers."},
{q:"Advertisement is a ________ source of recruitment",options:["Internal", "External", "Agent", "Outsourcing"],correct:1,exp:"Advertisement is an external source of recruitment since it attracts candidates from outside the organisation."},
{q:"Transfer is an ________ source of recruitment.",options:["Internal", "External", "Outsourcing", "None of the above"],correct:0,exp:"Transfer is an internal source of recruitment as it moves an existing employee to another position."},
{q:"E-recruitment is possible only through ________ facility.",options:["Computer", "Internet", "Broadband", "4G"],correct:1,exp:"E-recruitment relies on internet facility to reach and screen candidates online."},
];

const COM11_EMPLOYEE_SELECTION_PROCESS = [
{q:"The recruitment and Selection Process aimed at right kind of people.",options:["At right people", "At right time", "To do right things", "All of the above"],correct:3,exp:"Recruitment and selection aim to find the right people, at the right time, to do the right things."},
{q:"Selection is usually considered as a ___________ process",options:["Positive", "Negative", "Natural", "None of these"],correct:1,exp:"Selection is often called a negative process since it mainly involves rejecting unsuitable candidates."},
{q:"Which of the following test is used to measure the various characteristics of the candidate?",options:["Physical Test", "Psychological Test", "Attitude Test", "Proficiency tests"],correct:1,exp:"Psychological tests are used to measure various personal characteristics of a candidate."},
{q:"The process of eliminating unsuitable candidate is called",options:["Selection", "Recruitment", "Interview", "Induction"],correct:0,exp:"Selection is the process of screening out and eliminating unsuitable candidates."},
{q:"Job first man next is one of the principles of ___________.",options:["Test", "Interview", "Training", "placement"],correct:0,exp:"'Job first, man next' is a principle followed while testing candidates against job requirements."},
];

const COM12_EMPLOYEE_TRAINING_METHOD = [
{q:"Off the Job training is given",options:["In the class room", "On off days", "Outside the factory", "In the playground"],correct:2,exp:"Off-the-job training takes place away from the actual workplace, outside the factory."},
{q:"Improves Skill Levels of employees to ensure better job performance",options:["Training", "Selection", "Recruitment", "Performance appraisal"],correct:0,exp:"Training is designed to improve employees' skill levels for better job performance."},
{q:"When trainees are trained by supervisor or by superior at the job is called",options:["Vestibule training", "Refresher training", "Role play", "Apprenticeship training"],correct:3,exp:"Apprenticeship training involves learning directly under a supervisor or senior at the actual job."},
{q:"________ is useful to prevent skill obsolescence of employees",options:["Training", "Job analysis", "Selection", "Recruitment"],correct:0,exp:"Training helps prevent employees' skills from becoming obsolete over time."},
{q:"Training methods can be classified into ________ and ________ training.",options:["Job rotation and Job enrichment", "On the Job and Off the Job", "Job analysis and Job design", "Physical and mental"],correct:1,exp:"Training methods are broadly classified into on-the-job and off-the-job training."},
];

const COM13_CONCEPTS_OF_MARKET_AND_MARKETER = [
{q:"One who promotes (or) Exchange of goods or services for money is called as _____________",options:["Seller", "Marketer", "Customer", "Manager"],correct:1,exp:"A marketer is the person who promotes the exchange of goods or services for money."},
{q:"The marketer initially wants to know in the marketing is___________",options:["Qualification of the customer", "Quality of the product", "Background of the customers", "Needs of the customers"],correct:3,exp:"A marketer's first concern is understanding the needs of customers."},
{q:"The Spot market is classified on the basis of _________",options:["Commodity", "Transaction", "Regulation", "Time"],correct:1,exp:"The spot market is classified on the basis of the type of transaction involved."},
{q:"Which one of the market deals in the purchase and sale of shares and debentures?",options:["Stock Exchange Market", "Manufactured Goods Market", "Local Market", "Family Market"],correct:0,exp:"The stock exchange market deals in the purchase and sale of shares and debentures."},
{q:"Stock Exchange Market is also called_____________",options:["Spot Market", "Local Market", "Security Market", "National Market"],correct:2,exp:"The stock exchange market is also referred to as the security market."},
];

const COM14_MARKETING_AND_MARKETING_MIX = [
{q:"The initial stage of Marketing system is____________",options:["Monopoly system", "Exchange to Money", "Barter system", "Self producing"],correct:2,exp:"The barter system, exchanging goods for goods, was the earliest stage of the marketing system."},
{q:"Who is supreme in the Market?",options:["Customer", "Seller", "Wholesaler", "Retailer"],correct:0,exp:"The customer is considered supreme in the market since all marketing efforts are directed at satisfying them."},
{q:"In the following variables which one is not the variable of marketing mix?",options:["Place Variable", "Product Variable", "Program Variable", "Price Variable"],correct:2,exp:"Programme is not one of the four Ps; the marketing mix consists of product, price, place, and promotion."},
{q:"Marketing mix means a marketing program that is offered by a firm to its target ______________ to earn profits through satisfaction of their wants.",options:["Wholesaler", "Retailer", "Consumer", "Seller"],correct:2,exp:"The marketing mix is a programme offered by a firm to its target consumers to satisfy their wants."},
{q:"Which one is the example of Intangible product?",options:["Education", "Mobiles", "Garments", "Vehicles"],correct:0,exp:"Education is an intangible product since it is a service rather than a physical good."},
];

const COM15_RECENT_TRENDS_IN_MARKETING = [
{q:"Selling goods/ services through internet is",options:["Green marketing", "E- business", "Social marketing", "Meta marketing"],correct:1,exp:"Selling goods and services through the internet is known as e-business."},
{q:"Which is gateway to internet?",options:["Portal", "CPU", "Modem", "Webnaire"],correct:2,exp:"A modem acts as the gateway device that connects a computer to the internet."},
{q:"Social marketing deals with:",options:["Society", "Social Class", "Social change", "Social evil"],correct:1,exp:"In this context, social marketing is treated as marketing directed at social class-based segments of society."},
{q:"Effective use of Social media marketing increase conversion rates of ___________.",options:["Customer to buyers", "Retailer to customers", "One buyer to another buyer's", "Direct contact of marketer"],correct:0,exp:"Effective social media marketing mainly boosts conversion rates by turning customers into buyers."},
{q:"Pure play retailers are called",options:["Market creators", "Transaction brokers", "Merchants", "Agents"],correct:1,exp:"Pure play retailers, who operate only online, are also known as transaction brokers."},
];

const COM16_CONSUMERISM = [
{q:"The term 'consumerism' came into existence in the year __________.",options:["1960", "1957", "1954", "1958"],correct:0,exp:"The term 'consumerism' came into use in 1960."},
{q:"Who is the father of Consumer Movement?",options:["Mahatma Gandhi", "Mr. John F. Kennedy", "Ralph Nader", "Jawaharlal Nehru"],correct:2,exp:"Ralph Nader is regarded as the father of the consumer movement."},
{q:"Sale of Goods Act was passed in the year?",options:["1962", "1972", "1930", "1985"],correct:2,exp:"The Sale of Goods Act was passed in 1930."},
{q:"The Consumer Protection Act came into force with effect from",options:["1.1.1986", "1.4.1986", "15.4.1987", "15.4.1990"],correct:2,exp:"The Consumer Protection Act came into force on 15 April 1987."},
{q:"_____ of every year is declared as a Consumer Protection Day to educate the public about their rights and responsibilities.",options:["August 15", "April 15", "March 15", "September 15"],correct:2,exp:"March 15 every year is observed as Consumer Protection/Consumer Rights Day."},
];

const COM17_RIGHTS_DUTIES_AND_RESPOSIBILITIES_OF_CONSUMERISM = [
{q:"The final aim of modern marketing is _______",options:["Maximum profit", "Minimum profit", "Consumer satisfaction", "Service to the society"],correct:2,exp:"The final aim of modern marketing is to achieve consumer satisfaction."},
{q:"_______ is the king of modern marketing.",options:["Consumer", "Wholesaler", "Producer", "Retailer"],correct:0,exp:"The consumer is considered the king of modern marketing since all activities revolve around them."},
{q:"As the consumer is having the rights, they are also having ________.",options:["Measures", "Promotion", "Responsibilities", "Duties"],correct:2,exp:"Along with rights, consumers also carry responsibilities."},
{q:"Which of the following is not a consumer right summed up by John F. Kennedy",options:["Right to safety", "Right to choose", "Right to consume", "Right to be informed"],correct:2,exp:"John F. Kennedy's consumer rights cover safety, choice, and information, but not a 'right to consume'."},
{q:"It is the responsibility of a consumer that he must obtain______ as a proof for the purchase of goods.",options:["Cash receipt", "Warranty card", "Invoice", "All of these"],correct:0,exp:"A consumer must obtain a cash receipt as proof of purchase."},
];

const COM18_GRIEVANCE_REDRESSAL_MECHANISM = [
{q:"The Chairman of the National Consumer Disputes Redressal Council is ______",options:["Serving or Retired Judge of the Supreme Court of India.", "Prime Minister", "President of India", "None of the above"],correct:0,exp:"The National Commission is headed by a serving or retired judge of the Supreme Court of India."},
{q:"The Chairman of the State Consumer Protection Council is _____",options:["Judge of a High Court", "Chief Minister", "Finance Minister", "None of the above"],correct:0,exp:"This redressal body is headed by a person qualified to be a judge of a High Court."},
{q:"The Chairman of the District Forum is ________",options:["District Judge", "High Court Judge", "Supreme Court Judge", "None of the above"],correct:0,exp:"The District Forum is headed by a person qualified to be a District Judge."},
{q:"The State Commission can entertain complaints where the value of the goods or services and the compensation, if any claimed exceed",options:["₹2 lakhs but does not exceed ₹5 lakhs", "₹20 lakhs but does not exceed ₹1 crore", "₹3 lakhs but does not exceed ₹5 lakhs", "₹4 lakhs but does not exceed ₹20 lakhs"],correct:1,exp:"The State Commission handles cases where the claim exceeds ₹20 lakhs but does not exceed ₹1 crore."},
{q:"The International Organisation of Consumers Unions (IOCU) was first established in",options:["1960", "1965", "1967", "1987"],correct:0,exp:"The International Organisation of Consumers Unions (IOCU) was established in 1960."},
];

const COM19_ENVIRONMENTAL_FACTORS = [
{q:"VUCA stands for ____, _____,_____,______.",options:["Volatility, Uncertainty, Complexity and Ambiguity", "Value, Unavoidable, Company and Authority", "Volatility, Uncontrollable, Company and Auction", "All of the above"],correct:0,exp:"VUCA stands for Volatility, Uncertainty, Complexity and Ambiguity."},
{q:"GST stands for ______,______,______.",options:["Goods and Social Tax", "Goods and Service Tax", "Goods and Sales Tax", "Goods and Salary Tax"],correct:1,exp:"GST stands for Goods and Service Tax."},
{q:"Factors within an organisation constitutes_________ environment.",options:["Internal Thinker", "External Thinker", "Fellow human beings", "All of the above"],correct:0,exp:"Factors that exist within an organisation make up its internal environment."},
{q:"Macro Environment of business is an _________ factor.",options:["Uncontrollable", "Controllable", "Manageable", "Immanageable"],correct:0,exp:"The macro environment consists of factors that are largely uncontrollable by a business."},
{q:"The two major types of business environment are _______ and ___________.",options:["Positive and Negative", "Internal and External", "Good and Bad", "Allowable and Unallowable"],correct:1,exp:"Business environment is broadly divided into internal and external environment."},
];

const COM20_LIBERALIZATION_PRIVATIZATION_AND_GLOBALIZATION = [
{q:"__________ is the result of New Industrial Policy which abolished the 'License System'.",options:["Globalisation", "Privatisation", "Liberalisation", "None of these"],correct:2,exp:"Liberalisation resulted from the New Industrial Policy that abolished the licensing system."},
{q:"___________ means permitting the private sector to setup industries which were previously reserved for public sector.",options:["Liberalisation", "Privatisation", "Globalisation", "Public Enterprise"],correct:1,exp:"Privatisation means allowing the private sector into industries earlier reserved for the public sector."},
{q:"____________ ownership makes bold management decisions due to their strong foundation in the international level.",options:["Private", "Public", "Corporate", "MNC's"],correct:0,exp:"Privately owned firms, backed by strong international-level operations, are able to take bolder management decisions."},
{q:"__________ results from the removal of barriers between national economies to encourage the flow of goods, services, capital and labour.",options:["Privatisation", "Liberalisation", "Globalisation", "Foreign Trade"],correct:2,exp:"Globalisation results from removing barriers between national economies to allow free flow of goods, services, capital, and labour."},
{q:"New Economic Policy was introduced in the year _______.",options:["1980", "1991", "2013", "2015"],correct:1,exp:"India's New Economic Policy was introduced in 1991."},
];

const COM21_THE_SALE_OF_GOODS_ACT_1930 = [
{q:"Sale of Goods Act was passed in the year",options:["1940", "1997", "1930", "1960"],correct:2,exp:"The Sale of Goods Act was passed in 1930."},
{q:"Which of the below constitutes the essential element of contract of sale?",options:["Two parties", "Transfer of property", "Price", "All of the above"],correct:3,exp:"Two parties, transfer of property, and price are all essential elements of a contract of sale."},
{q:"Which of the below is not a good?",options:["Stocks", "Dividend due", "Crops", "Water"],correct:1,exp:"Dividend due is a claim for money, not a movable item, so it does not qualify as 'goods'."},
{q:"In case of the sale, the ____ has the right to sell",options:["Buyer", "Seller", "Hirer", "Consignee"],correct:1,exp:"In a sale, it is the seller who holds the right to sell the goods."},
{q:"The property in the goods means the",options:["Possession of goods", "Custody of goods", "Ownership of goods", "Both (a) and (b)"],correct:2,exp:"'Property in goods' refers to legal ownership of the goods, not mere possession."},
];

const COM22_NEGOTIABLE_INSTRUMENT_ACT_1881 = [
{q:"Negotiable Instrument Act was passed in the year ______.",options:["1981", "1881", "1994", "1818"],correct:1,exp:"The Negotiable Instruments Act was passed in 1881."},
{q:"Number of parties in a bill of exchange are",options:["2", "6", "3", "4"],correct:2,exp:"A bill of exchange involves three parties: the drawer, the drawee, and the payee."},
{q:"Section 6 of Negotiable Instruments Act 1881 deals with",options:["Promissory Note", "Bills of exchange", "Cheque", "None of the above"],correct:2,exp:"Section 6 of the Negotiable Instruments Act, 1881 defines a cheque."},
{q:"_______ cannot be a bearer instrument.",options:["Cheque", "Promissory Note", "Bills of exchange", "None of the above"],correct:1,exp:"A promissory note cannot be validly made payable to bearer, unlike a cheque."},
{q:"A cheque will become stale after _____months of its date:",options:["3", "4", "5", "1"],correct:0,exp:"A cheque becomes stale (invalid for payment) three months after its date."},
];

const COM23_ELEMENTS_OF_ENTREPRENEURSHIP = [
{q:"Which of the below is a factor of production?",options:["Land", "Labour", "Entrepreneurship", "All of the above"],correct:3,exp:"Land, labour, and entrepreneurship are all recognised factors of production."},
{q:"Entrepreneur is not classified as",options:["Risk Bearer", "Innovator", "Employee", "Organizer"],correct:2,exp:"An entrepreneur is an owner and risk-bearer, not an employee."},
{q:"What are the characteristics of an entrepreneur?",options:["Spirit of enterprise", "Flexibility", "Self Confidence", "All of the above"],correct:3,exp:"Spirit of enterprise, flexibility, and self-confidence are all characteristics of an entrepreneur."},
{q:"Which of the below is not classified into managerial functions?",options:["Planning", "Marketing", "Organizing", "Controlling"],correct:1,exp:"Marketing is a business function, not one of the managerial functions like planning, organising, and controlling."},
{q:"Which of the below is a commercial function?",options:["Accounting", "Coordination", "Discovery of idea", "Planning"],correct:0,exp:"Accounting is classified as a commercial function of an entrepreneur."},
];

const COM24_TYPES_OF_ENTREPRENEURS = [
{q:"Which of the following is the Activity of a Business Entrepreneur?",options:["Production", "Marketing", "Operation", "All of the above"],correct:3,exp:"A business entrepreneur is involved in production, marketing, and operations."},
{q:"Find the odd one out in context of Trading Entrepreneur.",options:["Selling", "Commission", "Buying", "Manufacturing"],correct:3,exp:"A trading entrepreneur only buys and sells goods; manufacturing falls outside trading activity."},
{q:"Corporate Entrepreneur is also called as_____",options:["Intrapreneur", "Promoter", "Manager", "Shareholder"],correct:1,exp:"A corporate entrepreneur, who sets up a company, is also referred to as a promoter."},
{q:"Which of these is based on Technology?",options:["Modern", "Professional", "Corporate", "Industrial"],correct:1,exp:"A professional entrepreneur is one whose venture is based on technology and expertise."},
{q:"Which of the below is not a Characteristic of a Fabian Entrepreneur?",options:["Conservative", "Risk averse", "Sceptical", "Adaptive"],correct:3,exp:"Fabian entrepreneurs are cautious and slow to adopt change, so being adaptive is not one of their traits."},
];

const COM25_GOVERNMENT_SCHEMES_FOR_ENTREPRENEURIAL_DEVELOPMENT = [
{q:"The ___________ initiative was launched to modernize the Indian economy to make all governments services available electronically.",options:["Standup India", "Startup India", "Digital India", "Make in India"],correct:2,exp:"Digital India was launched to modernise the economy by making government services available electronically."},
{q:"________ is designed to transform India to a global design and manufacturing hub.",options:["Digital India", "Make in India", "Startup India", "Design India."],correct:1,exp:"Make in India aims to transform the country into a global design and manufacturing hub."},
{q:"___________ is the Government of India's endeavour to promote culture of innovation and entrepreneurship.",options:["AIM", "STEP", "SEED", "AIC"],correct:0,exp:"The Atal Innovation Mission (AIM) promotes a culture of innovation and entrepreneurship in India."},
{q:"___________ should cover aspects like sources of finance, technical know-how, source of labour and raw material, market potential and profitability.",options:["Technical Report", "Finance Report", "Project Report", "Progress Report"],correct:2,exp:"A project report covers sources of finance, technical know-how, labour, raw materials, and market potential."},
{q:"____________has to include the mechanism for managing venture in the project report.",options:["Banker", "Government", "Lending Institutions", "Entrepreneur"],correct:3,exp:"The entrepreneur has to include the mechanism for managing the venture in the project report."},
];

const COM26_COMPANIES_ACT_2013 = [
{q:"The Company will have to issue the notice of situation of Registered Office to the Registrar of Companies within _____ days from the date of incorporation.",options:["14 days", "21 days", "30 Days", "60 Days"],correct:2,exp:"A company must notify the Registrar of the situation of its registered office within 30 days of incorporation."},
{q:"How does a person who envisages the idea to form a company called?",options:["Director", "Company Secretary", "Registrar", "Promoter"],correct:3,exp:"A promoter is the person who conceives the idea of forming a company."},
{q:"Which of the following types of shares are issued by a company to raise capital from the existing shareholders?",options:["Equity Shares", "Rights Shares", "Preference Shares", "Bonus Shares"],correct:1,exp:"Rights shares are issued to existing shareholders to raise further capital."},
{q:"The shares which are offered to the existing shareholder at free of cost is known as ___________.",options:["Bonus Share", "Equity Share", "Right Share", "Preference Share"],correct:0,exp:"Bonus shares are issued to existing shareholders free of cost."},
{q:"The shares which are offered first to the existing shareholder at reduced price is known as _____________.",options:["Bonus Share", "Equity Share", "Right Share", "Preference Share"],correct:2,exp:"Right shares are offered first to existing shareholders at a reduced price."},
];

const COM27_COMPANY_MANAGEMENT = [
{q:"A person shall hold office as a director in ________ companies as per the Companies Act, 2013.",options:["5 companies", "10 companies", "20 companies", "15 companies"],correct:2,exp:"As per the Companies Act 2013, a person can be a director in a maximum of 20 companies."},
{q:"A Private Company shall have a minimum of ________.",options:["Seven directors", "Five directors", "Three directors", "Two directors"],correct:3,exp:"A private company must have a minimum of two directors."},
{q:"A Public Company having a paid up Share Capital of Rs. ___________ or more may have a Director, elected by such small shareholders.",options:["One crore", "Three crores", "Five crores", "Seven crores"],correct:2,exp:"A public company with paid-up capital of ₹5 crore or more may appoint a director elected by small shareholders."},
{q:"What is the statue of Directors who regulate money of the company.",options:["Banker", "Holder", "Agent", "Trustees"],correct:3,exp:"Directors act as trustees in respect of the company's money and property."},
{q:"According to Companies Act, the Directors must be appointed by the.",options:["Central Government", "Company Law Tribunal", "Company in General Meeting", "Board of Directors."],correct:2,exp:"Directors are generally appointed by the company in its general meeting."},
];

const COM28_COMPANY_SECRETARY = [
{q:"Mention the status of a Company Secretary in a company.",options:["A member", "A director", "An independent", "An employee"],correct:3,exp:"A company secretary holds the status of an employee of the company."},
{q:"Who can become a secretary for a company?",options:["Individual person", "Partnership firm", "Co-operative societies", "Trade unions"],correct:0,exp:"Only an individual person, not a firm or organisation, can be appointed as company secretary."},
{q:"Which meeting will be held only once in the life time of the company?",options:["Statutory", "Annual General", "Extra - ordinary", "Class General"],correct:0,exp:"The statutory meeting is held only once in the lifetime of a company."},
{q:"Who is not entitled to speak at the annual general meeting of the company.",options:["Auditor", "Shareholder", "Proxy", "Directors"],correct:2,exp:"A proxy can vote but is not entitled to speak at the annual general meeting."},
{q:"From the date of its incorporation the First Annual General Meeting is to be conducted within __________ months.",options:["Twelve", "Fifteen", "Eighteen", "Twenty one"],correct:2,exp:"The first annual general meeting must be held within eighteen months of incorporation."},
];

const CHAPTERS_COMMERCE = [
  {id:701, name:"Principles of Management", icon:"🧭", questions:COM1_PRINCIPLES_OF_MANAGEMENT, additionalQuestions:[]},
  {id:702, name:"Functions of Management", icon:"⚙️", questions:COM2_FUNCTIONS_OF_MANAGEMENT, additionalQuestions:[]},
  {id:703, name:"Management by Objectives (MBO) & Management by Exception (MBE)", icon:"🎯", questions:COM3_MBO_MBE, additionalQuestions:[]},
  {id:704, name:"Introduction To Financial Markets", icon:"💹", questions:COM4_INTRODUCTION_TO_FINANCIAL_MARKETS, additionalQuestions:[]},
  {id:705, name:"Capital Market", icon:"🏦", questions:COM5_CAPITAL_MARKET, additionalQuestions:[]},
  {id:706, name:"Money Market", icon:"💰", questions:COM6_MONEY_MARKET, additionalQuestions:[]},
  {id:707, name:"Stock Exchange", icon:"📈", questions:COM7_STOCK_EXCHANGE, additionalQuestions:[]},
  {id:708, name:"Securities Exchange Board of India (SEBI)", icon:"🛡️", questions:COM8_SEBI, additionalQuestions:[]},
  {id:709, name:"Fundamentals of Human Resource Management", icon:"👥", questions:COM9_FUNDAMENTALS_OF_HUMAN_RESOURCE_MANAGEMENT, additionalQuestions:[]},
  {id:710, name:"Recruitment Methods", icon:"📋", questions:COM10_RECRUITMENT_METHODS, additionalQuestions:[]},
  {id:711, name:"Employee Selection Process", icon:"🧑‍💼", questions:COM11_EMPLOYEE_SELECTION_PROCESS, additionalQuestions:[]},
  {id:712, name:"Employee Training Method", icon:"🎓", questions:COM12_EMPLOYEE_TRAINING_METHOD, additionalQuestions:[]},
  {id:713, name:"Concepts of Market and Marketer", icon:"🛍️", questions:COM13_CONCEPTS_OF_MARKET_AND_MARKETER, additionalQuestions:[]},
  {id:714, name:"Marketing and Marketing Mix", icon:"🧩", questions:COM14_MARKETING_AND_MARKETING_MIX, additionalQuestions:[]},
  {id:715, name:"Recent Trends in Marketing", icon:"📱", questions:COM15_RECENT_TRENDS_IN_MARKETING, additionalQuestions:[]},
  {id:716, name:"Consumerism", icon:"🛒", questions:COM16_CONSUMERISM, additionalQuestions:[]},
  {id:717, name:"Rights, Duties and Resposibilities of Consumerism", icon:"⚖️", questions:COM17_RIGHTS_DUTIES_AND_RESPOSIBILITIES_OF_CONSUMERISM, additionalQuestions:[]},
  {id:718, name:"Grievance Redressal Mechanism", icon:"📜", questions:COM18_GRIEVANCE_REDRESSAL_MECHANISM, additionalQuestions:[]},
  {id:719, name:"Environmental Factors", icon:"🌍", questions:COM19_ENVIRONMENTAL_FACTORS, additionalQuestions:[]},
  {id:720, name:"Liberalization, Privatization and Globalization", icon:"🌐", questions:COM20_LIBERALIZATION_PRIVATIZATION_AND_GLOBALIZATION, additionalQuestions:[]},
  {id:721, name:"The Sale of Goods Act, 1930", icon:"📄", questions:COM21_THE_SALE_OF_GOODS_ACT_1930, additionalQuestions:[]},
  {id:722, name:"Negotiable Instrument Act, 1881", icon:"💵", questions:COM22_NEGOTIABLE_INSTRUMENT_ACT_1881, additionalQuestions:[]},
  {id:723, name:"Elements of Entrepreneurship", icon:"💡", questions:COM23_ELEMENTS_OF_ENTREPRENEURSHIP, additionalQuestions:[]},
  {id:724, name:"Types of Entrepreneurs", icon:"🚀", questions:COM24_TYPES_OF_ENTREPRENEURS, additionalQuestions:[]},
  {id:725, name:"Government Schemes for Entrepreneurial Development", icon:"🏛️", questions:COM25_GOVERNMENT_SCHEMES_FOR_ENTREPRENEURIAL_DEVELOPMENT, additionalQuestions:[]},
  {id:726, name:"Companies Act, 2013", icon:"📘", questions:COM26_COMPANIES_ACT_2013, additionalQuestions:[]},
  {id:727, name:"Company Management", icon:"🏢", questions:COM27_COMPANY_MANAGEMENT, additionalQuestions:[]},
  {id:728, name:"Company Secretary", icon:"🗂️", questions:COM28_COMPANY_SECRETARY, additionalQuestions:[]}
];

const ECO01_INTRODUCTION_TO_MACRO_ECONOMICS = [
{q:"The branches of the subject Economics is",options:["Wealth and welfare", "production and consumption", "Demand and supply", "micro and macro"],correct:3,exp:"Economics is broadly divided into two branches: microeconomics and macroeconomics."},
{q:"Who coined the word 'Macro'?",options:["Adam Smith", "J M Keynes", "Ragnar Frisch", "Karl Marx"],correct:2,exp:"The term 'Macro' was coined by the Norwegian economist Ragnar Frisch."},
{q:"Who is regarded as Father of Modern Macro Economics?",options:["Adam Smith", "J M Keynes", "Ragnar Frisch", "Karl Marx"],correct:1,exp:"J.M. Keynes is regarded as the Father of Modern Macroeconomics for his General Theory."},
{q:"Identify the other name for Macro Economics.",options:["Price Theory", "Income Theory", "Market Theory", "Micro Theory"],correct:1,exp:"Macroeconomics is also called Income Theory since it studies national income and aggregates."},
{q:"Macro economics is a study of ___.",options:["Individuals", "Firms", "A Nation", "Aggregates"],correct:3,exp:"Macroeconomics studies the economy as a whole through aggregates like national income and employment."},
{q:"Indicate the contribution of J M Keynes to economics.",options:["Wealth of Nations", "General Theory", "Capital", "Public Finance"],correct:1,exp:"Keynes's major contribution was 'The General Theory of Employment, Interest and Money'."},
{q:"A steady increase in general price level is termed as ___.",options:["Wholesale price index", "Business Cycle", "Inflation", "National Income"],correct:2,exp:"A sustained rise in the general price level of an economy is called inflation."},
{q:"Identify the necessity of Economic policies.",options:["To solve the basic problems", "To overcome the obstacles", "To achieve growth", "All the above"],correct:3,exp:"Economic policies are necessary to solve basic problems, overcome obstacles, and achieve growth — all of these."},
{q:"Indicate the fundamental economic activities of an economy.",options:["Production and Distribution", "Production and Exchange", "Production and Consumption", "Production and Marketing"],correct:2,exp:"Production and consumption are the two fundamental economic activities of any economy."},
{q:"An economy consists of",options:["Consumption sector", "Production sector", "Government sector", "All the above"],correct:3,exp:"An economy is made up of consumption, production, and government sectors together."},
{q:"Identify the economic system where only private ownership of production exists.",options:["Capitalistic Economy", "Socialistic Economy", "Globalistic Economy", "Mixed Economy"],correct:0,exp:"In a Capitalistic economy, the means of production are privately owned."},
{q:"Economic system representing equality in distribution is ___.",options:["Capitalism", "Globalism", "Mixedism", "Socialism"],correct:3,exp:"Socialism emphasizes equality in the distribution of income and resources."},
{q:"Who is referred as 'Father of Capitalism'?",options:["Adam Smith", "Karl Marx", "Thackeray", "J M Keynes"],correct:0,exp:"Adam Smith is known as the Father of Capitalism for his work on free-market economics."},
{q:"The country following Capitalism is ___.",options:["Russia", "America", "India", "China"],correct:1,exp:"America is a classic example of a capitalist economy."},
{q:"Identify The Father of Socialism.",options:["J M Keynes", "Karl Marx", "Adam Smith", "Samuelson"],correct:1,exp:"Karl Marx is regarded as the Father of Socialism."},
{q:"An economic system where the economic activities of a nation are done both by the private and public together is termed as ___.",options:["Capitalistic Economy", "Socialistic Economy", "Globalisic Economy", "Mixed Economy"],correct:3,exp:"A Mixed economy has both private and public sectors operating together."},
{q:"Quantity of a commodity accumulated at a point of time is termed as ___.",options:["Production", "Stock", "Variable", "Flow"],correct:1,exp:"A stock variable is measured at a specific point in time, unlike a flow which is measured over a period."},
{q:"Identify the flow variable.",options:["Money supply", "Assets", "Income", "Foreign exchange reserves"],correct:2,exp:"Income is a flow variable since it is measured over a period of time (e.g., per year)."},
{q:"Identify the sectors of a Two Sector Model.",options:["Households and Firms", "Private and Public", "Internal and External", "Firms and Government"],correct:0,exp:"The basic Two Sector Model of circular flow consists of Households and Firms."},
{q:"The Circular Flow Model that represents an open Economy.",options:["Two Sector Model", "Three Sector Model", "Four Sector Model", "All the above"],correct:2,exp:"The Four Sector Model, which includes the foreign sector, represents an open economy."},
];

const ECO02_NATIONAL_INCOME = [
{q:"Net National product at factor cost is also known as",options:["National Income", "Domestic Income", "Per capita Income", "Salary"],correct:0,exp:"NNP at factor cost is the standard definition of National Income."},
{q:"Primary sector is …………………..",options:["Industry", "Trade", "Agriculture", "Construction"],correct:2,exp:"The primary sector covers agriculture and other activities that extract raw materials from nature."},
{q:"National income is measured by using .............. methods.",options:["Two", "Three", "Five", "Four"],correct:1,exp:"National income is measured using three methods: product, income, and expenditure methods."},
{q:"Income method is measured by summing up of all forms of ……………",options:["Revenue", "Taxes", "expenditure", "Income"],correct:3,exp:"The income method sums up all forms of income earned by factors of production."},
{q:"Which is the largest figure?",options:["Disposable income", "Personal Income", "NNP", "GNP"],correct:3,exp:"GNP is the largest among these figures since it includes net factor income from abroad before other deductions."},
{q:"Expenditure method is used to estimate national income in ……………..",options:["Construction sector", "Agricultural Sector", "Service sector", "Banking sector"],correct:0,exp:"The expenditure method is commonly used to estimate income generated in the construction sector."},
{q:"Tertiary sector is also called as..............sector",options:["Service", "Income", "Industrial", "Production"],correct:0,exp:"The tertiary sector is also known as the service sector."},
{q:"National income is a measure of the .............performance of an economy.",options:["Industrial", "Agricultural", "Economic", "Consumption"],correct:2,exp:"National income reflects the overall economic performance of a country."},
{q:"Per capita income is obtained by dividing the National income by …………",options:["Production", "Population of a country", "Expenditure", "GNP"],correct:1,exp:"Per capita income = National Income ÷ Population of the country."},
{q:"GNP =............. + Net factor income from abroad.",options:["NNP", "NDP", "GDP", "Personal income"],correct:2,exp:"GNP = GDP + Net factor income from abroad."},
{q:"NNP stands for ……….",options:["Net National Product", "National Net product", "National Net Provident", "Net National Provident"],correct:0,exp:"NNP stands for Net National Product."},
{q:".is deducted from gross value to get the net value.",options:["Income", "Depreciation", "Expenditure", "Value of final goods"],correct:1,exp:"Depreciation is deducted from gross value to arrive at the net value."},
{q:"The financial year in India is ……",options:["April 1 to March 31", "March 1 to April 30", "March 1 to March 16", "January 1 to December 31"],correct:0,exp:"India's financial year runs from April 1st to March 31st."},
{q:"When net factor income from abroad is deducted from NNP, the net value is …….",options:["Gross National Product", "Disposable Income", "Net Domestic Product", "Personal Income"],correct:2,exp:"NNP minus net factor income from abroad gives Net Domestic Product (NDP)."},
{q:"The value of NNP at production point is called ……",options:["NNP at factor cost", "NNP at market cost", "GNP at factor cost", "Per capita income"],correct:0,exp:"NNP at factor cost reflects the value at the point of production, excluding indirect taxes."},
{q:"The average income of the country is ….",options:["Personal Income", "Per capita income", "Inflation Rate", "Disposal Income"],correct:1,exp:"Per capita income represents the average income of a country's population."},
{q:"The value of national income adjusted for inflation is called ….",options:["Inflation Rate", "Disposal Income", "GNP", "Real national income"],correct:3,exp:"Real national income is national income adjusted for inflation."},
{q:"Which is a flow concept ?",options:["Number of shirts", "Total wealth", "Monthly income", "Money supply"],correct:2,exp:"Monthly income is a flow concept since it is measured over a period of time."},
{q:"PQLI is the indicator of ………………",options:["Economic growth", "Economic welfare", "Economic progress", "Economic development"],correct:1,exp:"The Physical Quality of Life Index (PQLI) is an indicator of economic welfare."},
{q:"The largest proportion of national income comes from …….",options:["Private sector", "Local sector", "Public sector", "None of the above"],correct:0,exp:"The private sector contributes the largest proportion to national income."},
];

const ECO03_THEORIES_OF_EMPLOYMENT_AND_INCOME = [
{q:"Every able bodied person who is willing to work at the prevailing wage rate is employed called as ……….",options:["Full employment", "Under employment", "Unemployment", "Employment opportunity"],correct:0,exp:"Full employment exists when every able-bodied person willing to work at the prevailing wage is employed."},
{q:"Structural unemployment is a feature in a ………..",options:["Static society", "Socialist society", "Dynamic society", "Mixed economy"],correct:2,exp:"Structural unemployment arises due to changes in a dynamic, evolving society/economy."},
{q:"In disguised unemployment, the marginal productivity of labour is …..",options:["Zero", "One", "Two", "Positive"],correct:0,exp:"In disguised unemployment, the marginal productivity of the excess labour is zero."},
{q:"The main concention of the Classical Economic Theory is ……..",options:["Under employment", "Economy is always in the state of equilibrium", "Demand creates its supply", "Imperfect competition"],correct:1,exp:"Classical theory holds that the economy is always self-adjusting toward full-employment equilibrium."},
{q:"J.B. Say is a …………………….",options:["Neo Classical Economist", "Classical Economist", "Modern Economist", "New Economist"],correct:1,exp:"J.B. Say, known for Say's Law, is a Classical economist."},
{q:"According to Keynes, which type of unemployment prevails in capitalist economy ?",options:["Full employment", "Voluntary unemployment", "Involuntary unemployment", "Under employment"],correct:3,exp:"As per the official key, Keynes associates capitalist economies with under employment."},
{q:"The core of the classical theory of employment is …………",options:["Law of Diminishing Return", "Law of Demand", "Law of Markets", "Law of Consumption"],correct:2,exp:"Say's Law of Markets ('supply creates its own demand') is the core of classical employment theory."},
{q:"Keynes attributes unemployment to …………..",options:["A lack of effective supply", "A lack of effective demand", "A lack of both", "None of the above"],correct:1,exp:"Keynes attributed unemployment mainly to a lack of effective demand in the economy."},
{q:"Flexibility brings equality between saving and investment.",options:["Demand", "Supply", "Capital", "Interest"],correct:3,exp:"According to classical theory, flexibility in the rate of interest equates saving and investment."},
{q:"theory is a turning point in the development of modern economic theory.",options:["Keynes'", "Say's", "Classical", "Employment"],correct:0,exp:"Keynes' theory (The General Theory) marked a turning point in modern economic thought."},
{q:"The basic concept used in Keynes Theory of Employment and Income is…………….",options:["Aggregate demand", "Aggregate supply", "Effective demand", "Marginal Propensity Consume"],correct:2,exp:"Effective demand — the point where aggregate demand equals aggregate supply — is central to Keynes' theory."},
{q:"The component of aggregate demand is ………….",options:["Personal demand", "Government expenditure", "Only export", "Only import"],correct:1,exp:"Government expenditure is one of the key components of aggregate demand."},
{q:"Aggregate supply is equal to ………….",options:["C + I + G", "C + S + G + (x-m)", "C + S + T + (x-m)", "C + S + T + Rf"],correct:3,exp:"As per the textbook identity used here, aggregate supply equals C + S + T + Rf."},
{q:"Keynes theory pursues to replace laissez faire by …………",options:["No government intervention", "Maximum intervention", "State intervention in certain situation", "Private sector intervention"],correct:2,exp:"Keynes advocated state intervention in certain situations to replace pure laissez-faire."},
{q:"In Keynes theory of employment and income, .................. is the basic cause of economic depression.",options:["Less production", "More demand", "Inelastic supply", "Less aggregate demand in relation to productive capacity."],correct:3,exp:"Keynes held that insufficient aggregate demand relative to productive capacity causes depressions."},
{q:"Classical theory advocates ……",options:["Balanced budget", "Unbalanced budget", "Surplus budget", "Deficit budget"],correct:0,exp:"Classical economists advocated a balanced government budget."},
{q:"Keynes theory emphasized on …… equilibrium.",options:["Very short run", "Short run", "Very long run", "Long run"],correct:1,exp:"Keynes' theory focuses on short-run equilibrium of the economy."},
{q:"According to classical theory, rate of interest is a reward for ……",options:["Investment", "Demand", "Capital", "Saving"],correct:3,exp:"Classical theory views the rate of interest as a reward for saving (abstaining from consumption)."},
{q:"In Keynes theory , the demand for and supply of money are determined by ….",options:["Rate of interest", "Effective demand", "Aggregate demand", "Aggregate supply"],correct:0,exp:"In Keynesian theory, the demand for and supply of money are determined by the rate of interest."},
{q:"Say’s law stressed the operation of..................in the economy.",options:["Induced price mechanism", "Automatic price mechanism", "Induced demand", "Induced investment"],correct:1,exp:"Say's Law stressed that an automatic price mechanism keeps the economy at equilibrium."},
];

const ECO04_CONSUMPTION_AND_INVESTMENT_FUNCTIONS = [
{q:"The average propensity to consume is measured by",options:["C/Y", "CxY", "Y/C", "C+Y"],correct:0,exp:"Average Propensity to Consume (APC) = Total Consumption (C) ÷ Total Income (Y)."},
{q:"An increase in the marginal propensity to consume will:",options:["Lead to consumption function becoming steeper", "Shift the consumption function upwards", "Shift the consumption function downwards", "Shift savings function upwards"],correct:0,exp:"A higher MPC increases the slope of the consumption function, making it steeper."},
{q:"If the Keynesian consumption function is C=10+0.8 Y then, if disposable income is Rs 1000, what is amount of total consumption?",options:["Rs. 0.8", "Rs. 800", "Rs. 810", "Rs. 0.81"],correct:2,exp:"C = 10 + 0.8(1000) = 10 + 800 = Rs. 810."},
{q:"If the Keynesian consumption function is C=10+0.8Y then, when disposable income is Rs 100, what is the marginal propensity to consume?",options:["Rs. 0.8", "Rs. 800", "Rs. 810", "Rs. 0.81"],correct:0,exp:"The MPC is the coefficient of Y (0.8) and stays constant regardless of the income level."},
{q:"If the Keynesian consumption function is C=10+0.8 Y then, and disposable income is 100, what is the average propensity to consume?",options:["Rs. 0.8", "Rs. 800", "Rs. 810", "Rs. 0.9"],correct:3,exp:"C = 10 + 0.8(100) = 90. APC = C/Y = 90/100 = 0.9."},
{q:"As national income increases",options:["The APC falls and gets nearer in value to the MPC", "The APC increases and diverges in value from the MPC", "The APC stays constant", "The APC always approaches infinity."],correct:0,exp:"As income rises, APC falls and moves closer in value to the MPC."},
{q:"As increase in consumption at any given level of income is likely to lead",options:["Higher aggregate demand", "An increase in exports", "A fall in taxation revenue", "A decrease in import spending"],correct:0,exp:"Higher consumption at any income level raises aggregate demand."},
{q:"Lower interest rates are likely to :",options:["Decrease in consumption", "increase cost of borrowing", "Encourage saving", "increase borrowing and spending"],correct:3,exp:"Lower interest rates reduce the cost of borrowing, encouraging borrowing and spending."},
{q:"The MPC is equal to :",options:["Total spending / total consumption", "Total consumption/total income", "Change in consumption /change in income", "none of the above."],correct:2,exp:"MPC = Change in Consumption ÷ Change in Income."},
{q:"The relationship between total spending on consumption and the total income is the",options:["Consumption function", "Savings function", "Investment function", "aggregate demand function"],correct:0,exp:"This relationship between consumption spending and total income defines the consumption function."},
{q:"The sum of the MPC and MPS is",options:["1", "2", "0.1", "1.1"],correct:0,exp:"MPC + MPS always equals 1, since income is either consumed or saved."},
{q:"As income increases, consumption will",options:["Fall", "Not change", "Fluctuate", "Increase"],correct:3,exp:"As income rises, consumption also increases (though by less than the rise in income)."},
{q:"When investment is assumed autonomous the slope of the AD schedule is determined by the",options:["marginal propensity to invest", "disposable income", "marginal propensity to consume", "average propensity to consume"],correct:2,exp:"With autonomous investment, the slope of the Aggregate Demand schedule is determined by the MPC."},
{q:"The multiplier tells us how much changes after a shift in",options:["Consumption , income", "investment, output", "savings, investment", "output, aggregate demand"],correct:3,exp:"Per the official key, the multiplier links changes in output with shifts in aggregate demand."},
{q:"The multiplier is calculated as",options:["1/(1-MPC)", "1/MPS", "1/MPC", "a and b"],correct:3,exp:"The multiplier = 1/(1-MPC), which is also equal to 1/MPS since MPC+MPS=1 — so both (a) and (b) are correct."},
{q:"It the MPC is 0.5, the multiplier is",options:["2", "1/2", "0.2", "20"],correct:0,exp:"Multiplier = 1/(1-MPC) = 1/(1-0.5) = 1/0.5 = 2."},
{q:"In an open economy import the value of the multiplier",options:["Reduces", "increase", "does not change", "changes"],correct:0,exp:"Imports act as a leakage, so in an open economy the value of the multiplier reduces."},
{q:"According to Keynes, investment is a function of the MEC and",options:["Demand", "Supply", "Income", "Rate of interest"],correct:3,exp:"Keynes viewed investment as a function of the Marginal Efficiency of Capital (MEC) and the rate of interest."},
{q:"The term super multiplier was first used by",options:["J.R.Hicks", "R.G.D. Allen", "Kahn", "Keynes"],correct:0,exp:"The term 'super multiplier' was first used by J.R. Hicks."},
{q:"The term MEC was introduced by",options:["Adam Smith", "J.M. Keynes", "Ricardo", "Malthus"],correct:1,exp:"The concept of Marginal Efficiency of Capital (MEC) was introduced by J.M. Keynes."},
];

const ECO05_MONETARY_ECONOMICS = [
{q:"The RBI Headquarters is located at",options:["Delhi", "Chennai", "Mumbai", "Bengaluru"],correct:2,exp:"The Reserve Bank of India's headquarters is located in Mumbai."},
{q:"Money is",options:["Acceptable only when it has intrinsic value", "Constant in purchasing power", "The most liquid of all assets", "Needed for allocation of resources"],correct:2,exp:"Money is the most liquid of all assets since it can be readily used in transactions."},
{q:"Paper currency system is managed by the",options:["Central Monetary authority", "State Government", "Central Government", "Banks"],correct:0,exp:"The paper currency system is managed by the Central Monetary authority (the central bank)."},
{q:"The basic distinction between M1 and M2 is with regard to .",options:["Post office total deposits", "Saving deposits with post office savings bank", "Terms deposits of banks", "Currency"],correct:1,exp:"M2 = M1 + savings deposits with post office savings banks, which is the key distinguishing component."},
{q:"Irving Fisher’s Quantity Theory of Money was popularized in",options:["1908", "1910", "1911", "1914."],correct:2,exp:"Irving Fisher's Quantity Theory of Money was popularized in 1911."},
{q:"MV stands for",options:["Demand for money", "Supply of legal tender money", "Supply of bank money", "Total supply of money"],correct:1,exp:"In the equation MV=PT, MV represents the supply of legal tender money multiplied by its velocity."},
{q:"Inflation means",options:["Prices are rising", "Prices are falling", "Value of money is increasing", "Prices are remaining the same"],correct:0,exp:"Inflation refers to a sustained rise in the general price level."},
{q:"_________inflation results in a serious depreciation of the value of money.",options:["Creeping", "Walking", "Running", "Hyper"],correct:3,exp:"Hyperinflation causes a serious and rapid depreciation in the value of money."},
{q:"_________inflation occurs when general prices of commodities increases due to increase in production costs such as wages and raw materials.",options:["Cost-push", "Demand pull", "Running", "Galloping"],correct:0,exp:"Cost-push inflation occurs when rising production costs (wages, raw materials) push up prices."},
{q:"During inflation, who are the gainers?",options:["Debtors", "Creditors", "Wage and salary earners", "Government"],correct:0,exp:"During inflation, debtors gain because they repay loans with money that has lower purchasing power."},
{q:"_____________is a decrease in the rate of inflation.",options:["Disinflation", "Deflation", "Stagflation", "Depression"],correct:0,exp:"Disinflation refers to a decrease in the rate of inflation (prices still rise, but more slowly)."},
{q:"Stagflation combines the rate of inflation with",options:["Stagnation", "Employment", "Output", "Price"],correct:0,exp:"Stagflation is the combination of economic stagnation with high inflation."},
{q:"The study of alternating fluctuations in business activity is referred to in Economics as",options:["Boom", "Recession", "Recovery", "Trade cycle"],correct:3,exp:"The alternating phases of boom, recession, and recovery together form the trade cycle."},
{q:"During depression the level of economic activity becomes extremely",options:["High", "Bad", "Low", "Good"],correct:2,exp:"During a depression, the level of economic activity falls to an extremely low point."},
{q:"“Money can be anything that is generally acceptable as a means of exchange and that the same time acts as a measure and a store of value”, This definition was given by",options:["Crowther", "A.C.Pigou", "F.A.Walker", "Francis Bacon"],correct:0,exp:"This definition of money was given by Crowther."},
{q:"Debit card is an example of",options:["Currency", "Paper currency", "Plastic money", "Money"],correct:2,exp:"A debit card is a common example of plastic money."},
{q:"Fisher’s Quantity Theory of money is based on the essential function of money as",options:["Measure of value", "Store of value", "Medium of exchange", "Standard of deferred payment"],correct:2,exp:"Fisher's Quantity Theory is based on money's function as a medium of exchange."},
{q:"V in MV = PT equation stands for",options:["Volume of trade", "Velocity of circulation of money", "Volume of transaction", "Volume of bank and credit money"],correct:1,exp:"In Fisher's equation MV=PT, V stands for the velocity of circulation of money."},
{q:"When prices rise slowly, we call it",options:["Galloping inflation", "Mild inflation", "Hyper inflation", "Deflation"],correct:1,exp:"A slow, gradual rise in prices is called mild (or creeping) inflation."},
{q:"_____________inflation is in no way dangerous to the economy.",options:["Walking", "Running", "Creeping", "Galloping"],correct:2,exp:"Creeping inflation, being very mild, is generally not considered dangerous to the economy."},
];

const ECO06_BANKING = [
{q:"A Bank is a",options:["Financial institution", "Corporate", "An Industry", "Service institutions"],correct:0,exp:"A bank is fundamentally a financial institution."},
{q:"A Commercial Bank is an institutions that provides services",options:["Accepting deposits", "Providing loans", "Both a and b", "None of the above"],correct:2,exp:"Commercial banks provide both deposit-accepting and loan-providing services."},
{q:"The Functions of commercial banks are broadly classified into",options:["Primary Functions", "Secondary functions", "Other functions", "a, b, and c"],correct:3,exp:"Commercial bank functions are broadly classified into primary, secondary, and other functions."},
{q:"Bank credit refers to",options:["Bank Loans", "Advances", "Bank loans and advances", "Borrowings"],correct:2,exp:"Bank credit refers collectively to bank loans and advances."},
{q:"Credit creation means.",options:["Multiplication of loans and advances", "Revenue", "Expenditure", "Debt"],correct:0,exp:"Credit creation refers to the multiplication of loans and advances by commercial banks."},
{q:"NBFI does not have.",options:["Banking license", "government approval", "Money market approval", "Finance ministry approval"],correct:0,exp:"A Non-Banking Financial Institution (NBFI) does not hold a banking license."},
{q:"Central bank is --------------- authority of any country.",options:["Monetary", "Fiscal", "Wage", "National Income"],correct:0,exp:"The central bank is the monetary authority of a country."},
{q:"Who will act as the banker to the Government of India?",options:["SBI", "NABARD", "ICICI", "RBI"],correct:3,exp:"The RBI acts as the banker to the Government of India."},
{q:"Lender of the last resort is one of the functions of.",options:["Central Bank", "Commercial banks", "Land Development Banks", "Co-operative banks"],correct:0,exp:"Acting as the 'lender of last resort' is a key function of the Central Bank."},
{q:"Bank Rate means.",options:["Re-discounting the first class securities", "Interest rate", "Exchange rate", "Growth rate"],correct:0,exp:"Bank rate is the rate at which the central bank re-discounts first-class securities."},
{q:"Repo Rate means.",options:["Rate at which the Commercial Banks are willing to lend to RBI", "Rate at which the RBI is willing to lend to commercial banks", "Exchange rate of the foreign bank", "Growth rate of the economy"],correct:1,exp:"The repo rate is the rate at which the RBI lends to commercial banks."},
{q:"Moral suasion refers.",options:["Optimization", "Maximization", "Persuasion", "Minimization"],correct:2,exp:"Moral suasion refers to the central bank's use of persuasion to influence bank behaviour."},
{q:"ARDC started functioning from",options:["June 3, 1963", "July 3, 1963", "June 1, 1963", "July 1, 1963"],correct:3,exp:"The Agricultural Refinance and Development Corporation (ARDC) started functioning from July 1, 1963."},
{q:"NABARD was set up in.",options:["July 1962", "July 1972", "July 1982", "July 1992"],correct:2,exp:"NABARD (National Bank for Agriculture and Rural Development) was set up in July 1982."},
{q:"EXIM bank was established in.",options:["June 1982", "April 1982", "May 1982", "March 1982"],correct:3,exp:"The EXIM Bank of India was established in March 1982."},
{q:"The State Financial Corporation Act was passed by",options:["Government of India", "Government of Tamilnadu", "Government of Union Territories", "Local Government."],correct:0,exp:"The State Financial Corporation Act was passed by the Government of India."},
{q:"Monetary policy his formulated by.",options:["Co-operative banks", "Commercial banks", "Central Bank", "Foreign banks"],correct:2,exp:"Monetary policy is formulated by the Central Bank of a country."},
{q:"Online Banking is also known as.",options:["E-Banking", "Internet Banking", "RTGS", "NEFT"],correct:1,exp:"Online banking is also referred to as Internet Banking."},
{q:"Expansions of ATM.",options:["Automated Teller Machine", "Adjustment Teller Machine", "Automatic Teller mechanism", "Any Time Money"],correct:0,exp:"ATM stands for Automated Teller Machine."},
{q:"2016 Demonetization of currency includes denominations of",options:["Rs.500 and Rs.1000", "Rs.1000 and Rs.2000", "Rs.200 and Rs.500", "All the above"],correct:0,exp:"The 2016 demonetization withdrew Rs.500 and Rs.1000 currency notes."},
];

const ECO07_INTERNATIONAL_ECONOMICS = [
{q:"Trade between two countries is known as .................trade",options:["External", "Internal", "Inter-regional", "Home"],correct:0,exp:"Trade between two countries is known as external (or foreign) trade."},
{q:"Which of the following factors influence trade?",options:["The stage of development of a product", "The relative price of factors of productions.", "Government.", "All of the above."],correct:3,exp:"Product development stage, relative factor prices, and government policy all influence trade."},
{q:"International trade differs from domestic trade because of",options:["Trade restrictions", "Immobility of factors", "Different government policies", "All the above"],correct:3,exp:"International trade differs from domestic trade due to trade restrictions, factor immobility, and differing government policies."},
{q:"In general, a primary reason why nations conduct international trade is because",options:["Some nations prefer to produce one thing while others produce another", "Resources are not equally distributed among all trading nations", "Trade enhances opportunities to accumulate profits", "Interest rates are not identical in all trading nations"],correct:1,exp:"Unequal distribution of resources among nations is a primary reason for international trade."},
{q:"Which of the following is a modern theory of international trade?",options:["Absolute cost", "Comparative cost", "Factor endowment theory", "None of these"],correct:2,exp:"The Factor Endowment (Heckscher-Ohlin) theory is a modern theory of international trade."},
{q:"Exchange rates are determined in",options:["Money market", "Foreign exchange market", "Stock market", "Capital market"],correct:1,exp:"Exchange rates are determined in the foreign exchange market."},
{q:"Exchange rate for currencies is determined by supply and demand under the system of",options:["Fixed exchange rate", "Flexible exchange rate", "Constant", "Government regulated"],correct:1,exp:"Under a flexible exchange rate system, rates are determined by market supply and demand."},
{q:"Net export equals ……",options:["Export x Import", "Export + Import", "Export – Import", "Exports of services only"],correct:2,exp:"Net exports equal exports minus imports."},
{q:"Who among the following enunciated the concept of single factoral terms of trade?",options:["Jacob Viner", "G.S.Donens", "Taussig", "J.S.Mill"],correct:0,exp:"Jacob Viner enunciated the concept of single factoral terms of trade."},
{q:"Terms of Trade of a country show ……………",options:["Ratio of goods exported and imported", "Ratio of import duties", "Ratio of prices of exports and imports", "Both (a) and (c)"],correct:2,exp:"Terms of trade show the ratio of export prices to import prices."},
{q:"Favourable trade means value of exports are ..........Than that of imports.",options:["More", "Less", "More or Less", "Not more than"],correct:0,exp:"A favourable trade balance means the value of exports exceeds that of imports."},
{q:"If there is an imbalance in the trade balance (more imports than exports), it can be reduced by",options:["decreasing customs duties", "increasing export duties", "stimulating exports", "stimulating imports"],correct:2,exp:"Stimulating exports helps reduce a trade imbalance caused by excess imports."},
{q:"BOP includes",options:["visible items only", "invisible items only", "both visible and invisible items", "merchandise trade only"],correct:2,exp:"The Balance of Payments (BOP) includes both visible and invisible items."},
{q:"Components of balance of payments of a country includes",options:["Current account", "Official account", "Capital account", "All of above"],correct:3,exp:"BOP includes the current account, capital account, and official reserve account, among others."},
{q:"In the case of BOT,",options:["Transactions of goods are recorded.", "Transactions of both goods and services are recorded.", "Both capital and financial accounts are included.", "All of these"],correct:0,exp:"The Balance of Trade (BOT) records only transactions of goods (visible items)."},
{q:"Tourism and travel are classified in which of balance of payments accounts?",options:["merchandise trade account", "services account", "unilateral transfers account", "capital account"],correct:1,exp:"Tourism and travel are classified under the services account of the BOP."},
{q:"Cyclical disequilibrium in BOP occurs because of",options:["Different paths of business cycle.", "The income elasticity of demand or price elasticity of demand is different.", "long-run changes in an economy", "Both (a) and (b)."],correct:3,exp:"Cyclical disequilibrium arises from differing business cycle paths and differing elasticities of demand — both (a) and (b)."},
{q:"Which of the following is not an example of foreign direct investment?",options:["the construction of a new auto assembly plant overseas", "the acquisition of an existing steel mill overseas", "the purchase of bonds or stock issued by a textile company overseas", "the creation of a wholly owned business firm overseas"],correct:2,exp:"Purchasing bonds/stock is portfolio investment, not FDI, since it doesn't involve managerial control."},
{q:"Foreign direct investments not permitted in India",options:["Banking", "Automic energy", "Pharmaceutical", "Insurance"],correct:1,exp:"FDI is not permitted in the atomic energy sector in India."},
{q:"Benefits of FDI include, theoretically",options:["Boost in Economic Growth", "Increase in the import and export of goods and services", "Increased employment and skill levels", "All of these"],correct:3,exp:"FDI theoretically boosts economic growth, trade, employment, and skill levels — all of these."},
];

const ECO08_INTERNATIONAL_ECONOMIC_ORGANISATIONS = [
{q:"International Monetary Fund was an outcome of",options:["Pandung Conference", "Dunkel Draft", "Bretton Woods Conference", "Doha Conference"],correct:2,exp:"The IMF was established as an outcome of the Bretton Woods Conference."},
{q:"International Monetary Fund is having its headquarters at",options:["Washington D.C.", "New York", "Vienna", "Geneva"],correct:0,exp:"The IMF's headquarters is located in Washington D.C."},
{q:"IBRD is otherwise called",options:["IMF", "World Bank", "ASEAN", "International Finance Corporation"],correct:1,exp:"IBRD (International Bank for Reconstruction and Development) is otherwise known as the World Bank."},
{q:"The other name for Special Drawing Rights is",options:["Paper gold", "Quotas", "Voluntary Export Restrictions", "None of these"],correct:0,exp:"Special Drawing Rights (SDRs) are also known as 'paper gold'."},
{q:"The organization which provides long term loan is",options:["World Bank", "International Monetary Fund", "World Trade Organisation", "BRICS"],correct:0,exp:"The World Bank provides long-term loans to member countries."},
{q:"Which of the following countries is not a member of SAARC?",options:["Sri Lanka", "Japan", "Bangladesh", "Afghanistan"],correct:1,exp:"Japan is not a member of SAARC (South Asian Association for Regional Cooperation)."},
{q:"International Development Association is an affiliate of",options:["IMF", "World Bank", "SAARC", "ASEAN"],correct:1,exp:"The International Development Association (IDA) is an affiliate of the World Bank."},
{q:"----------- relates to patents, copyrights, trade secrets, etc.,",options:["TRIPS", "TRIMS", "GATS", "NAMA"],correct:0,exp:"TRIPS (Trade-Related Aspects of Intellectual Property Rights) relates to patents, copyrights, and trade secrets."},
{q:"The first ministerial meeting of WTO was held at",options:["Singapore", "Geneva", "Seattle", "Doha"],correct:0,exp:"The first ministerial meeting of the WTO was held in Singapore."},
{q:"ASEAN meetings are held once in every years",options:["2", "3", "4", "5"],correct:1,exp:"ASEAN summit meetings are held once every 3 years (as per this key)."},
{q:"Which of the following is not the member of SAARC?",options:["Pakistan", "Sri Lanka", "Bhutan", "China"],correct:3,exp:"China is not a member of SAARC."},
{q:"SAARC meets once in ----------- years.",options:["2", "3", "4", "5"],correct:0,exp:"SAARC meets once every 2 years."},
{q:"The headquarters of ASEAN is",options:["Jaharta", "New Delhi", "Colombo", "Tokyo"],correct:0,exp:"The headquarters of ASEAN is located in Jakarta, Indonesia."},
{q:"The term BRIC was coined in",options:["2001", "2005", "2008", "2010"],correct:0,exp:"The term BRIC was coined in 2001."},
{q:"ASEAN was created in",options:["1965", "1967", "1972", "1997"],correct:1,exp:"ASEAN (Association of Southeast Asian Nations) was created in 1967."},
{q:"The Tenth BRICS Summit was held in July 2018 at",options:["Beijing", "Moscow", "Johannesburg", "Brasilia"],correct:2,exp:"The 10th BRICS Summit in July 2018 was held in Johannesburg, South Africa."},
{q:"New Development Bank is associated with",options:["BRICS", "WTO", "SAARC", "ASEAN"],correct:0,exp:"The New Development Bank is associated with BRICS."},
{q:"Which of the following does not come under ‘Six dialogue partners’ of ASEAN?",options:["China", "Japan", "India", "North Korea"],correct:3,exp:"North Korea is not among ASEAN's six dialogue partners."},
{q:"SAARC Agricultural Information Centre (SAIC) works as a central information institution for agriculture related resources was founded on",options:["1985", "1988", "1992", "1998"],correct:1,exp:"SAARC Agricultural Information Centre (SAIC) was founded in 1988."},
{q:"BENELUX is a form of",options:["Free trade area", "Economic Union", "Common market", "Customs union"],correct:3,exp:"BENELUX (Belgium, Netherlands, Luxembourg) is a form of customs union."},
];

const ECO09_FISCAL_ECONOMICS = [
{q:"The modern state is",options:["Laissez-faire state", "Aristocratic state", "Welfare state", "Police state"],correct:2,exp:"The modern state is characterized as a welfare state."},
{q:"One of the following is NOT a feature of private finance",options:["Balancing of income and expenditure", "Secrecy", "Saving some part of income", "Publicity"],correct:3,exp:"Publicity is a feature of public finance, not private finance, which is characterized by secrecy."},
{q:"The tax possesses the following characteristics",options:["Compulsory", "No quid pro quo", "Failure to pay is offence", "All the above"],correct:3,exp:"A tax is compulsory, involves no direct quid pro quo, and non-payment is an offence — all of the above."},
{q:"Which of the following canons of taxation was not listed by Adam smith?",options:["Canon of equality", "Canon of certainty", "Canon of convenience", "Canon of simplicity"],correct:3,exp:"Adam Smith's original canons were equality, certainty, convenience, and economy — not simplicity."},
{q:"Consider the following statements and identify the correct ones. i. Central government does not have exclusive power to impose tax which is not mentioned in state or concurrent list. ii. The Constitution also provides for transferring certain tax revenues from union list to states.",options:["i only", "ii only", "both", "none"],correct:1,exp:"Only statement (ii), regarding transfer of tax revenues from the union list to states, is correct here."},
{q:"GST is equivalence of",options:["Sales tax", "Corporation tax", "Income tax", "Local tax"],correct:0,exp:"GST is considered equivalent to a comprehensive sales tax."},
{q:"The direct tax has the following merits except",options:["equity", "convenient", "certainty", "civic consciousness"],correct:1,exp:"Convenience is often cited as a limitation, not a merit, of direct taxes."},
{q:"Which of the following is a direct tax?",options:["Excise duty", "Income tax", "Customs duty", "Service tax"],correct:1,exp:"Income tax is a direct tax, as its burden cannot be shifted to another person."},
{q:"Which of the following is not a tax under Union list?",options:["Personal Income Tax", "Corporation Tax", "Agricultural Income Tax", "Excise duty"],correct:2,exp:"Agricultural Income Tax falls under the State list, not the Union list."},
{q:"“Revenue Receipts” of the Government do not include",options:["Interest", "Profits and dividends", "Recoveries and loans", "Rent from property"],correct:3,exp:"Per the official key, rent from property is excluded from this classification of revenue receipts."},
{q:"The difference between revenue expenditure and revenue receipts is",options:["Revenue deficit", "Fiscal deficit", "Budget deficit", "Primary deficit"],correct:0,exp:"The gap between revenue expenditure and revenue receipts is called the revenue deficit."},
{q:"The difference between total expenditure and total receipts including loans and other liabilities is called",options:["Fiscal deficit", "Budget deficit", "Primary deficit", "Revenue deficit"],correct:0,exp:"Fiscal deficit is the difference between total expenditure and total receipts excluding borrowings."},
{q:"The primary purpose of deficit financing is",options:["Economic development", "Economic stability", "Economic equality", "Employment generation"],correct:0,exp:"Deficit financing is primarily used to fund economic development."},
{q:"Deficit budget means",options:["An excess of government’s revenue over expenditure", "An excess of government’s current expenditure over its current revenue", "An excess of government’s total expenditure over its total revenue", "None of above"],correct:2,exp:"A deficit budget occurs when total government expenditure exceeds total revenue."},
{q:"Methods of repayment of public debt is",options:["Conversion", "Sinking fund", "Funded debt", "All these"],correct:3,exp:"Conversion, sinking fund, and funded debt are all methods of repaying public debt."},
{q:"Conversion of public debt means exchange of",options:["new bonds for the old ones", "low interest bonds for higher interest bonds", "Long term bonds for short term bonds", "All the above"],correct:1,exp:"Conversion of public debt means exchanging low-interest bonds for higher-interest ones (or vice versa as rates change)."},
{q:"The word budget has been derived from the French word “bougette” which means",options:["A small bag", "An empty box", "A box with papers", "None of the above"],correct:0,exp:"The word 'budget' comes from the French word 'bougette', meaning a small bag."},
{q:"Which one of the following deficits does not consider borrowing as a receipt?",options:["Revenue deficit", "Budgetary deficit", "Fiscal deficit", "Primary deficit"],correct:2,exp:"Fiscal deficit is calculated without considering borrowings as a receipt."},
{q:"Finance Commission determines",options:["The finances of Government of India", "The resources transfer to the states", "The resources transfer to the various departments", "None of the above"],correct:1,exp:"The Finance Commission determines the transfer of resources from the Centre to the states."},
{q:"Consider the following statements and identify the right ones. i. The finance commission is appointed by the President ii. The tenure of Finance commission is five years",options:["i only", "ii only", "both", "none"],correct:2,exp:"Both statements are correct — the Finance Commission is appointed by the President for a 5-year tenure."},
];

const ECO10_ENVIRONMENTAL_ECONOMICS = [
{q:"The term environment has been derived from a French word-----------.",options:["Environ", "Environs", "Environia", "Envir"],correct:2,exp:"The term 'environment' is derived from the French word 'Environia'."},
{q:"The word biotic means environment",options:["Living", "Non-living", "Physical", "None of the above"],correct:0,exp:"'Biotic' refers to the living components of the environment."},
{q:"Ecosystem is smallest unit of",options:["Ionosphere", "Lithosphere", "Biosphere", "Mesosphere"],correct:2,exp:"An ecosystem is considered the smallest functional unit of the biosphere."},
{q:"Who developed Material Balance Models?",options:["Thomas and Picardy", "AlenKneese and R.V. Ayres", "Joan Robinson and J.M. Keynes", "Joseph Stiglitz and Edward Chamberlin"],correct:1,exp:"Material Balance Models were developed by Allen Kneese and R.V. Ayres."},
{q:"Environmental goods are --------------",options:["Market goods", "Non-market goods", "Both", "None of the above"],correct:1,exp:"Environmental goods are typically classified as non-market goods."},
{q:"In a pure public good, consumption is -----------------",options:["Rival", "Non-rival", "Both", "None of the above"],correct:1,exp:"In a pure public good, consumption is non-rival — one person's use doesn't reduce availability for others."},
{q:"One of the most important market failures is caused by ------------",options:["Positive externalities", "Negative externalities", "Both", "None of the above"],correct:1,exp:"Negative externalities are one of the most important causes of market failure."},
{q:"The common source of outdoor air pollution is caused by combustion processes from the following----------",options:["Heating and cooking", "Traditional stoves", "Motor vehicles", "All the above"],correct:1,exp:"Per the official key, traditional stoves are identified as a common combustion source of outdoor air pollution."},
{q:"The major contributor of Carbon monoxide is",options:["Automobiles", "Industrial process", "Stationary fuel combustion", "None of the above"],correct:0,exp:"Automobiles are the major contributor of carbon monoxide emissions."},
{q:"Which one of the following causes of global warming?",options:["Earth gravitation force", "Oxygen", "Centripetal force", "Increasing temperature"],correct:3,exp:"Global warming is characterized by an increasing temperature trend."},
{q:"Which of the following is responsible for protecting humans from harmful ultraviolet rays?",options:["UV-A", "UV-C", "Ozone layer", "None of the above"],correct:2,exp:"The ozone layer absorbs and protects humans from harmful ultraviolet rays."},
{q:"Global warming also refers to as",options:["Ecological change", "Climate Change", "Atmosphere change", "None of the above"],correct:3,exp:"Per this classification, none of the listed terms is treated as an exact equivalent for global warming."},
{q:"Which of the following is the anticipated effect of Global warming?",options:["Rising sea levels", "Changing precipitation", "Expansion of deserts", "All of the above"],correct:1,exp:"Changing precipitation patterns is highlighted as a key anticipated effect of global warming."},
{q:"The process of nutrient enrichment is termed as",options:["Eutrophication", "Limiting nutrients", "Enrichment", "Schistosomiasis"],correct:0,exp:"The process of nutrient enrichment of water bodies is called eutrophication."},
{q:"Primary cause of Soil pollution is ----------------",options:["Pest control measures", "Land reclamation", "Agricultural runoff", "Chemical fertilizer"],correct:3,exp:"Chemical fertilizer use is a primary cause of soil pollution."},
{q:"Which of the following is main cause for deforestation?",options:["Timber harvesting industry", "Natural afforestation", "Soil stabilization", "Climate stabilization"],correct:0,exp:"The timber harvesting industry is a main cause of deforestation."},
{q:"Electronic waste is commonly referred as ----------",options:["Solid waste", "Composite waste", "E-waste", "Hospital waste"],correct:2,exp:"Electronic waste is commonly referred to as e-waste."},
{q:"Acid rain is one of the consequences of------------Air pollution",options:["Water Pollution", "Land pollution", "Noise pollution", "None of these"],correct:0,exp:"Acid rain, caused by air pollution, in turn leads to water pollution by acidifying rivers and lakes."},
{q:"Sustainable Development Goals and targets are to be achieved by -------",options:["2020", "2025", "2030", "2050"],correct:2,exp:"The Sustainable Development Goals (SDGs) are targeted to be achieved by 2030."},
{q:"Alkali soils are predominantly located in the-------------plains?",options:["Indus-Ganga", "North-Indian", "Gangetic plains", "All the above"],correct:3,exp:"Alkali soils are found across the Indus-Gangetic/North Indian plains region — all of these describe the same broad area."},
];

const ECO11_ECONOMICS_OF_DEVELOPMENT_AND_PLANNING = [
{q:"\"Redistribution with Growth\" became popular slogan]er which approach?",options:["Traditional approach", "New welfare oriented approach", "Industrial approach", "None of the above"],correct:1,exp:"'Redistribution with Growth' became a popular slogan under the New Welfare oriented approach."},
{q:"Which is not the feature of economic growth?",options:["Concerned with developed nations", "Gradual change", "Concerned with quantitative aspect", "Wider concept"],correct:3,exp:"Being a 'wider concept' describes economic development, not economic growth."},
{q:"Which among the following is a characteristic of underdevelopment?",options:["Vicious circle of poverty", "Rising mass consumption", "Growth of Industries", "High rate of urbanization"],correct:0,exp:"The vicious circle of poverty is a defining characteristic of underdeveloped economies."},
{q:"The non-economic determinant of economic development",options:["Natural resources", "Human resource", "Capital formation", "Foreign trade"],correct:1,exp:"Human resource is considered a non-economic (social) determinant of economic development."},
{q:"Economic growth measures the ------- --------",options:["Growth of productivity", "Increase in nominal income", "Increase in output", "None of the above"],correct:2,exp:"Economic growth specifically measures the increase in output."},
{q:"The supply side vicious circle of poverty suggests that poor nations remain poor because",options:["Saving remains low", "Investment remains low", "There is a lack of effective government", "a and b above"],correct:3,exp:"On the supply side, both low savings and low investment (a and b) keep poor nations trapped in poverty."},
{q:"Which of the following plan has focused on the agriculture and rural economy?",options:["People’s Plan", "Bombay Plan", "Gandhian Plan", "Vishveshwarya Plan"],correct:2,exp:"The Gandhian Plan focused specifically on agriculture and the rural economy."},
{q:"Arrange following plans in correct chronological order a) People’s Plan b) Bombay Plan c) Jawaharlal Nehru Plan d) Vishveshwarya Plan",options:["(i) (ii) (iii) (iv)", "(iv) (iii) (ii) (i)", "(i) (ii) (iv) (iii)", "(ii) (i) (iv) (iii)"],correct:1,exp:"Chronologically: Vishveshwarya Plan (1934) → Nehru Plan (1938) → Bombay Plan (1944) → People's Plan (1945) — i.e., (iv)(iii)(ii)(i)."},
{q:"M.N. Roy was associated with --------- ------------",options:["Congress Plan", "People’s Plan", "Bombay Plan", "None of the above"],correct:1,exp:"M.N. Roy was associated with the People's Plan."},
{q:"Which of the following country adopts indicative planning?",options:["France", "Germany", "Italy", "Russia"],correct:0,exp:"France is known for adopting indicative planning."},
{q:"Short-term plan is also known as----- --------------",options:["Controlling Plans", "De-controlling Plans", "Rolling Plans", "De-rolling Plans"],correct:0,exp:"A short-term plan is also known as a Controlling Plan."},
{q:"Long-term plan is also known as ----- ----------------",options:["Progressive Plans", "Non-progressive Plans", "Perspective Plans", "Non-perspective Plans"],correct:2,exp:"A long-term plan is also known as a Perspective Plan."},
{q:"The basic philosophy behind long-term planning is to bring ------------ changes in the economy?",options:["Financial", "Agricultural", "Industrial", "Structural"],correct:3,exp:"Long-term planning aims to bring about structural changes in the economy."},
{q:"Sarvodaya Plan was advocated by----- --------------",options:["Mahatma Gandhi", "J.P. Narayan", "S. N Agarwal", "M.N. Roy"],correct:1,exp:"The Sarvodaya Plan was advocated by J.P. Narayan."},
{q:"Planning Commission was set up in the year ---------------",options:["1950", "1951", "1947", "1948"],correct:0,exp:"The Planning Commission of India was set up in the year 1950."},
{q:"Who wrote the book ‘The Road to Serfdom’?",options:["Friedrich Hayek", "H.R. Hicks", "David Ricardo", "Thomas Robert Malthus"],correct:0,exp:"'The Road to Serfdom' was written by Friedrich Hayek."},
{q:"Perspective plan is also known as ----",options:["Short-term plan", "Medium-term plan", "Long-term plan", "None of the above"],correct:2,exp:"A perspective plan is also known as a long-term plan."},
{q:"NITI Aayog is formed through------------------------",options:["Presidential Ordinance", "Allocation of business rules by President of India", "Cabinet resolution", "None of the above"],correct:2,exp:"NITI Aayog was formed through a Cabinet resolution."},
{q:"Expansion of NITI Aayog?",options:["National Institute to Transform India", "National Institute for Transforming India", "National Institution to Transform India", "National Institution for Transforming India"],correct:3,exp:"NITI Aayog stands for 'National Institution for Transforming India'."},
{q:"The Chair Person of NITI Aayog is",options:["Prime Minister", "President", "Vice – President", "Finance Minister"],correct:0,exp:"The Prime Minister serves as the Chairperson of NITI Aayog."},
];

const ECO12_INTRODUCTION_TO_STATISTICAL_METHODS_AND_ECONOMETRICS = [
{q:"The word ‘statistics’ is used as ___.",options:["Singular.", "Plural", "Singular and Plural.", "None of above."],correct:2,exp:"The word 'statistics' is used both in the singular and plural sense, depending on context."},
{q:"Who stated that statistics as a science of estimates and probabilities.",options:["Horace Secrist.", "R.A Fisher.", "Ya-Lun-Chou", "Boddington"],correct:3,exp:"Boddington defined statistics as the science of estimates and probabilities."},
{q:"Sources of secondary data are___.",options:["Published sources.", "Unpublished sources.", "neither published nor unpublished sources.", "Both (A) and (B)"],correct:3,exp:"Secondary data can come from both published and unpublished sources."},
{q:"The data collected by questionnaires are___.",options:["Primary data.", "Secondary data.", "Published data.", "Grouped data."],correct:0,exp:"Data collected directly via questionnaires is primary data."},
{q:"A measure of the strength of the linear relationship that exists between two variables is called:",options:["Slope", "Intercept", "Correlation coefficient", "Regression equation"],correct:2,exp:"The correlation coefficient measures the strength of the linear relationship between two variables."},
{q:"If both variables X and Y increase or decrease simultaneously, then the coefficient of correlation will be:",options:["Positive", "Negative", "Zero", "One"],correct:0,exp:"When both variables move in the same direction, the correlation coefficient is positive."},
{q:"If the points on the scatter diagram indicate that as one variable increases the other variable tends to decrease the value of r will be:",options:["Perfect positive", "Perfect negative", "Negative", "Zero"],correct:2,exp:"When one variable increases as the other decreases, the correlation coefficient r is negative."},
{q:"The value of the coefficient of correlation r lies between:",options:["0 and 1", "-1 and 0", "-1 and +1", "-0.5 and +0.5"],correct:2,exp:"The correlation coefficient r always lies between -1 and +1."},
{q:"The term regression was used by:",options:["Newton", "Pearson", "Spearman", "Galton"],correct:3,exp:"The term 'regression' was first used by Francis Galton."},
{q:"The purpose of simple linear regression analysis is to:",options:["Predict one variable from another variable", "Replace points on a scatter diagram by a straight-line", "Measure the degree to which two variables are linearly associated", "Obtain the expected value of the independent random variable for a given value of the dependent variable"],correct:0,exp:"Simple linear regression is used to predict the value of one variable from another."},
{q:"A process by which we estimate the value of dependent variable on the basis of one or more independent variables is called:",options:["Correlation", "Regression", "Residual", "Slope"],correct:1,exp:"Regression is the process of estimating a dependent variable's value from independent variables."},
{q:"If Y = 2 - 0.2X, then the value of Y intercept is equal to",options:["-0.2", "2", "0.2X", "All of the above"],correct:1,exp:"In Y = 2 - 0.2X, the Y-intercept (constant term) is 2."},
{q:"In the regression equation Y = β0+β1X, the Y is called:",options:["Independent variable", "Dependent variable", "Continuous variable", "none of the above"],correct:1,exp:"In Y = β0 + β1X, Y is the dependent variable."},
{q:"In the regression equation Y = β0+β1X, the X is called:",options:["Independent variable", "Dependent variable", "Continuous variable", "None of the above"],correct:0,exp:"In Y = β0 + β1X, X is the independent variable."},
{q:"Econometrics is the integration of",options:["Economics and Statistics", "Economics and Mathematics", "Economics, Mathematics and Statistics", "None of the above"],correct:2,exp:"Econometrics integrates Economics, Mathematics, and Statistics."},
{q:"Econometric is the word coined by",options:["Francis Galton", "RagnarFrish", "Karl Person", "Spearsman"],correct:1,exp:"The word 'Econometrics' was coined by Ragnar Frisch."},
{q:"The raw materials of Econometrics are:",options:["Data", "Goods", "Statistics", "Mathematics"],correct:0,exp:"Data serves as the raw material for econometric analysis."},
{q:"The term Uiin regression equation is",options:["Residuals", "Standard error", "Stochastic error term", "None of these"],correct:2,exp:"The term Ui in a regression equation represents the stochastic error term."},
{q:"The term Uiis introduced for the representation of",options:["Omitted Variable", "Standard error", "Bias", "Discrete Variable"],correct:0,exp:"The error term Ui is introduced to represent omitted variables not included in the model."},
{q:"Econometrics is the amalgamation of",options:["3 subjects", "4 subjects", "2 subjects", "5 subjects"],correct:0,exp:"Econometrics is the amalgamation of 3 subjects: Economics, Mathematics, and Statistics."},
];
const CHAPTERS_ECONOMICS = [
  {id:801, name:"Introduction to Macro Economics", icon:"🌐", questions:ECO01_INTRODUCTION_TO_MACRO_ECONOMICS, additionalQuestions:[]},
  {id:802, name:"National Income", icon:"💰", questions:ECO02_NATIONAL_INCOME, additionalQuestions:[]},
  {id:803, name:"Theories of Employment and Income", icon:"📈", questions:ECO03_THEORIES_OF_EMPLOYMENT_AND_INCOME, additionalQuestions:[]},
  {id:804, name:"Consumption and Investment Functions", icon:"📉", questions:ECO04_CONSUMPTION_AND_INVESTMENT_FUNCTIONS, additionalQuestions:[]},
  {id:805, name:"Monetary Economics", icon:"🏦", questions:ECO05_MONETARY_ECONOMICS, additionalQuestions:[]},
  {id:806, name:"Banking", icon:"🏧", questions:ECO06_BANKING, additionalQuestions:[]},
  {id:807, name:"International Economics", icon:"🌍", questions:ECO07_INTERNATIONAL_ECONOMICS, additionalQuestions:[]},
  {id:808, name:"International Economic Organisations", icon:"🏛️", questions:ECO08_INTERNATIONAL_ECONOMIC_ORGANISATIONS, additionalQuestions:[]},
  {id:809, name:"Fiscal Economics", icon:"📜", questions:ECO09_FISCAL_ECONOMICS, additionalQuestions:[]},
  {id:810, name:"Environmental Economics", icon:"🌱", questions:ECO10_ENVIRONMENTAL_ECONOMICS, additionalQuestions:[]},
  {id:811, name:"Economics of Development and Planning", icon:"🗺️", questions:ECO11_ECONOMICS_OF_DEVELOPMENT_AND_PLANNING, additionalQuestions:[]},
  {id:812, name:"Introduction to Statistical Methods and Econometrics", icon:"📊", questions:ECO12_INTRODUCTION_TO_STATISTICAL_METHODS_AND_ECONOMETRICS, additionalQuestions:[]}
];

/* ================= QUESTION PAPER GENERATOR — DATA =================
   2/3/5-mark descriptive question bank, used ONLY by the admin's
   "Generate Question Paper" feature (Part I of the generated paper reuses
   the existing 1-mark MCQ bank above instead of duplicating it).

   ⚠️ PLACEHOLDER / SAMPLE DATA ONLY. The questions below are real,
   correct, general Class-12 CS content, but only a handful per chapter —
   nowhere near the full book-back set. Replace/extend this object with
   your actual 2/3/5-mark book-back Q&A once you send it over; the
   generator code does not need to change, only this data.

   Format:
     2marks / 3marks: [{ chapter:"Chapter name", q:"...", a:"..." }, ...]
     5marks (either/or pairs): [{ chapter:"...", qa:{q,a}, qb:{q,a} }, ...]
*/
const DESCRIPTIVE_QUESTIONS = {
  cs: {
    2: [
      {chapter:"Function", q:"What is a subroutine?", a:""},
      {chapter:"Function", q:"Define Function with respect to Programming language.", a:""},
      {chapter:"Function", q:"Write the inference you get from X:=(78).", a:""},
      {chapter:"Function", q:"Differentiate interface and implementation.", a:""},
      {chapter:"Function", q:"Which of the following is a normal function definition and which is recursive function definition i) let sum x y: return x + y ii) let disp: print \u2018welcome\u2019 iii) let sum num: if (num!=0) then return num + sum (num-1) else return num", a:""},
      {chapter:"Data Abstraction", q:"What is abstract data type?", a:""},
      {chapter:"Data Abstraction", q:"Differentiate constructors and selectors.", a:""},
      {chapter:"Data Abstraction", q:"What is a Pair? Give an example.", a:""},
      {chapter:"Data Abstraction", q:"What is a List? Give an example.", a:""},
      {chapter:"Data Abstraction", q:"What is a Tuple? Give an example.", a:""},
      {chapter:"Scoping", q:"What is a scope?", a:""},
      {chapter:"Scoping", q:"Why scope should be used for variable. State the reason.", a:""},
      {chapter:"Scoping", q:"What is Mapping?", a:""},
      {chapter:"Scoping", q:"What do you mean by Namespaces?", a:""},
      {chapter:"Scoping", q:"How Python represents the private and protected Access specifiers?", a:""},
      {chapter:"Algorithmic Strategies", q:"What is an Algorithm?", a:""},
      {chapter:"Algorithmic Strategies", q:"Write the phase of the performance evaluation of an algorithm.", a:""},
      {chapter:"Algorithmic Strategies", q:"What is Insertion sort?", a:""},
      {chapter:"Algorithmic Strategies", q:"What is Sorting?", a:""},
      {chapter:"Algorithmic Strategies", q:"What is searching? Write its types.", a:""},
      {chapter:"Python \u2013 Variables and Operators", q:"What are the different modes that can be used to test Python Program ?", a:""},
      {chapter:"Python \u2013 Variables and Operators", q:"Write short notes on Tokens.", a:""},
      {chapter:"Python \u2013 Variables and Operators", q:"What are the different operators that can be used in Python?", a:""},
      {chapter:"Python \u2013 Variables and Operators", q:"What is a literal? Explain the types of literals ?", a:""},
      {chapter:"Python \u2013 Variables and Operators", q:"Write short notes on Exponent data?", a:""},
      {chapter:"Control Structures", q:"List the control structures in Python.", a:""},
      {chapter:"Control Structures", q:"Write note on break statement.", a:""},
      {chapter:"Control Structures", q:"Write is the syntax of if .. else statement.", a:""},
      {chapter:"Control Structures", q:"Define control structure.", a:""},
      {chapter:"Control Structures", q:"Write note on range () in loop.", a:""},
      {chapter:"Python Functions", q:"What is function?", a:""},
      {chapter:"Python Functions", q:"Write the different types of function.", a:""},
      {chapter:"Python Functions", q:"What are the main advantages of function?", a:""},
      {chapter:"Python Functions", q:"What is meant by scope of variable? Mention its types.", a:""},
      {chapter:"Python Functions", q:"Define global scope.", a:""},
      {chapter:"Python Functions", q:"What is base condition in recursive function?", a:""},
      {chapter:"Python Functions", q:"How to set the limit for recursive function? Give an example.", a:""},
      {chapter:"Strings and String Manipulation", q:"What is String?", a:""},
      {chapter:"Strings and String Manipulation", q:"Do you modify a string in Python?", a:""},
      {chapter:"Strings and String Manipulation", q:"How will you delete a string in Python?", a:""},
      {chapter:"Strings and String Manipulation", q:"What will be the output of the following python code? str1 = \u201cSchool\u201d print(str1*3)", a:""},
      {chapter:"Strings and String Manipulation", q:"What is slicing?", a:""},
      {chapter:"Lists, Tuples, Sets and Dictionary", q:"What is List in Python?", a:""},
      {chapter:"Lists, Tuples, Sets and Dictionary", q:"How will you access the list elements in reverse order?", a:""},
      {chapter:"Lists, Tuples, Sets and Dictionary", q:"What will be the value of x in following python code? List1=[2,4,6,[1,3,5]] x=len(List1)", a:""},
      {chapter:"Lists, Tuples, Sets and Dictionary", q:"Differentiate del with remove() function of List.", a:""},
      {chapter:"Lists, Tuples, Sets and Dictionary", q:"Write the syntax of creating a Tuple with n number of elements.", a:""},
      {chapter:"Lists, Tuples, Sets and Dictionary", q:"What is set in Python?", a:""},
      {chapter:"Python Classes and Objects", q:"What is class?", a:""},
      {chapter:"Python Classes and Objects", q:"What is instantiation?", a:""},
      {chapter:"Python Classes and Objects", q:"What is the output of the following program? class Sample: __num=10 def disp(self): S=Sample() S.disp() print(S.__num)", a:""},
      {chapter:"Python Classes and Objects", q:"How will you create constructor in Python?", a:""},
      {chapter:"Python Classes and Objects", q:"What is the purpose of Destructor?", a:""},
      {chapter:"Database Concepts", q:"Mention few examples of a database.", a:""},
      {chapter:"Database Concepts", q:"List some examples of RDBMS.", a:""},
      {chapter:"Database Concepts", q:"What is data consistency?", a:""},
      {chapter:"Database Concepts", q:"What is the difference between Hierarchical and Network data model?", a:""},
      {chapter:"Database Concepts", q:"What is normalization?", a:""},
      {chapter:"Structured Query Language (SQL)", q:"Write a query that selects all students whose age is less than 18 in order wise.", a:""},
      {chapter:"Structured Query Language (SQL)", q:"Differentiate Unique and Primary Key constraint.", a:""},
      {chapter:"Structured Query Language (SQL)", q:"Write the difference between table constraint and column constraint?", a:""},
      {chapter:"Structured Query Language (SQL)", q:"Which component of SQL lets insert values in tables and which lets to create a table?", a:""},
      {chapter:"Structured Query Language (SQL)", q:"What is the difference between SQL and MySQL?", a:""},
      {chapter:"Python and CSV Files", q:"What is CSV File?", a:""},
      {chapter:"Python and CSV Files", q:"Mention the two ways to read a CSV file using Python.", a:""},
      {chapter:"Python and CSV Files", q:"Mention the default modes of the File.", a:""},
      {chapter:"Python and CSV Files", q:"What is use of next() function?", a:""},
      {chapter:"Python and CSV Files", q:"How will you sort more than one column from a csv file? Give an example statement.", a:""},
      {chapter:"Importing C++ Programs in Python", q:"What is the theoretical difference between Scripting language and other programming language?", a:""},
      {chapter:"Importing C++ Programs in Python", q:"Differentiate compiler and interpreter.", a:""},
      {chapter:"Importing C++ Programs in Python", q:"Write the expansion of (i) SWIG (ii)MinGW", a:""},
      {chapter:"Importing C++ Programs in Python", q:"What is the use of modules?", a:""},
      {chapter:"Importing C++ Programs in Python", q:"What is the use of cd command? Give an example.", a:""},
      {chapter:"Data Manipulation through SQL", q:"Mention the users who uses the Database.", a:""},
      {chapter:"Data Manipulation through SQL", q:"Which method is used to connect a database? Give an example.", a:""},
      {chapter:"Data Manipulation through SQL", q:"What is the advantage of declaring a column as \u201cINTEGER PRIMARY KEY\u201d?", a:""},
      {chapter:"Data Manipulation through SQL", q:"Write the command to populate record in a table. Give an example.", a:""},
      {chapter:"Data Manipulation through SQL", q:"Which method is used to fetch all rows from the database table?", a:""},
      {chapter:"Data Visualization using Python", q:"What is Data Visualization.", a:""},
      {chapter:"Data Visualization using Python", q:"List the general types of data visualization.", a:""},
      {chapter:"Data Visualization using Python", q:"List the types of Visualizations in Matplotlib.", a:""},
      {chapter:"Data Visualization using Python", q:"How will you install Matplotlib?", a:""},
      {chapter:"Data Visualization using Python", q:"Write the difference between the following functions: plt.plot([1,2,3,4]), plt.plot([1,2,3,4], [1,4,9,16]).", a:""},
    ],
    3: [
      {chapter:"Function", q:"Mention the characteristics of Interface.", a:""},
      {chapter:"Function", q:"Why strlen is called pure function?", a:""},
      {chapter:"Function", q:"What is the side effect of impure function? Give example.", a:""},
      {chapter:"Function", q:"Differentiate pure and impure function.", a:""},
      {chapter:"Function", q:"What happens if you modify a variable outside the function? Give an example.", a:""},
      {chapter:"Data Abstraction", q:"Differentiate Concrete data type and abstract datatype.", a:""},
      {chapter:"Data Abstraction", q:"Which strategy is used for program designing? Define that Strategy.", a:""},
      {chapter:"Data Abstraction", q:"Identify Which of the following are constructors and selectors? (a) N1=number( ) - Constructor (b) accetnum(n1) - Selectors (c) displaynum(n1) - Selectors (d) eval(a/b) - Selectors (e) x,y= makeslope (m), makeslope(n) - Constructor (f) display( ) - Selectors", a:""},
      {chapter:"Data Abstraction", q:"What are the different ways to access the elements of a list. Give example.", a:""},
      {chapter:"Data Abstraction", q:"Identify Which of the following are List, Tuple and class ? (a) arr [1, 2, 34] - List (b) arr (1, 2, 34) - Tuple (c) student [rno, name, mark] - Class (d) day= (\u2018sun\u2019, \u2018mon\u2019, \u2018tue\u2019, \u2018wed\u2019) - Tuple (e) x= [2, 5, 6.5, [5, 6], 8.2] - List (f) employee [eno, ename, esal, eaddress] - Class", a:""},
      {chapter:"Scoping", q:"Define Local scope with an example.", a:""},
      {chapter:"Scoping", q:"Define Global scope with an example.", a:""},
      {chapter:"Scoping", q:"Define Enclosed scope with an example.", a:""},
      {chapter:"Scoping", q:"Why access control is required?", a:""},
      {chapter:"Scoping", q:"Identify the scope of the variables in the following pseudo code and write its output.", a:""},
      {chapter:"Algorithmic Strategies", q:"List the characteristics of an algorithm.", a:""},
      {chapter:"Algorithmic Strategies", q:"Discuss about Algorithmic complexity and its types.", a:""},
      {chapter:"Algorithmic Strategies", q:"What are the factors that influence time and space complexity.", a:""},
      {chapter:"Algorithmic Strategies", q:"Write a note on Asymptotic notation.", a:""},
      {chapter:"Algorithmic Strategies", q:"What do you understand by Dynamic programming?", a:""},
      {chapter:"Python \u2013 Variables and Operators", q:"Write short notes on Arithmetic operator with examples.", a:""},
      {chapter:"Python \u2013 Variables and Operators", q:"What are the assignment operators that can be used in Python?", a:""},
      {chapter:"Python \u2013 Variables and Operators", q:"Explain Ternary operator with examples.", a:""},
      {chapter:"Python \u2013 Variables and Operators", q:"Write short notes on Escape sequences with examples.", a:""},
      {chapter:"Python \u2013 Variables and Operators", q:"What are string literals? Explain.", a:""},
      {chapter:"Control Structures", q:"Write a program to display", a:""},
      {chapter:"Control Structures", q:"Write note on if .. else structure.", a:""},
      {chapter:"Control Structures", q:"Using if .. else .. elif statement write a suitable program to display largest of 3 numbers.", a:""},
      {chapter:"Control Structures", q:"Write the syntax of while loop.", a:""},
      {chapter:"Control Structures", q:"List the differences between break and continue statements.", a:""},
      {chapter:"Python Functions", q:"Write the rules of local variable.", a:""},
      {chapter:"Python Functions", q:"Write the basic rules for global keyword in python.", a:""},
      {chapter:"Python Functions", q:"What happens when we modify global variable inside the function?", a:""},
      {chapter:"Python Functions", q:"Differentiate ceil() and floor() function?", a:""},
      {chapter:"Python Functions", q:"Write a Python code to check whether a given year is leap year or not.", a:""},
      {chapter:"Python Functions", q:"What is composition in functions?", a:""},
      {chapter:"Python Functions", q:"How recursive function works?", a:""},
      {chapter:"Python Functions", q:"What are the points to be noted while defining a function?", a:""},
      {chapter:"Strings and String Manipulation", q:"Write a Python program to display the given pattern C O M P U T E R C O M P U T E C O M P U T C O M P U C O M P C O M C O C", a:""},
      {chapter:"Strings and String Manipulation", q:"Write a short about the followings with suitable example: (a) capitalize( ) (b) swapcase( )", a:""},
      {chapter:"Strings and String Manipulation", q:"What will be the output of the given python program? str1=\u201cwelcome\u201d str2=\u201cto school\u201d str3=str1[:2]+str2[len(str2)-2:] print(str3)", a:""},
      {chapter:"Strings and String Manipulation", q:"What is the use of format()? Give an example.", a:""},
      {chapter:"Strings and String Manipulation", q:"Write a note about count() function in python.", a:""},
      {chapter:"Lists, Tuples, Sets and Dictionary", q:"What are the difference between list and of Tuples ot?", a:""},
      {chapter:"Lists, Tuples, Sets and Dictionary", q:"Write a short note about sort( ).", a:""},
      {chapter:"Lists, Tuples, Sets and Dictionary", q:"What will be the output of the following code? list = [2\u2217\u2217x for x in range(5)] print(list)", a:""},
      {chapter:"Lists, Tuples, Sets and Dictionary", q:"Explain the difference between del and clear() in dictionary with an example.", a:""},
      {chapter:"Lists, Tuples, Sets and Dictionary", q:"List out the set operations supported by python.", a:""},
      {chapter:"Lists, Tuples, Sets and Dictionary", q:"What are the difference between List and Dictionary?", a:""},
      {chapter:"Python Classes and Objects", q:"What are class members? How do you define it?", a:""},
      {chapter:"Python Classes and Objects", q:"Write a class with two private class variables and print the sum using a method.", a:""},
      {chapter:"Python Classes and Objects", q:"Find the error in the following program to get the given output? class Fruits: def __init__(self, f1, f2): self.f2=f2 def display(self): F = Fruits ('Apple', 'Mango') del F.display F.display() Output: Fruit 1 = Apple, Fruit 2 = Mango", a:""},
      {chapter:"Python Classes and Objects", q:"What is the output of the following program? class Greeting: def __init__(self, name): def display(self): obj=Greeting('Bindu Madhavan') obj.display()", a:""},
      {chapter:"Python Classes and Objects", q:"How do define constructor and destructor in Python?", a:""},
      {chapter:"Database Concepts", q:"What is the difference between Select and Project command?", a:""},
      {chapter:"Database Concepts", q:"What is the role of DBA?", a:""},
      {chapter:"Database Concepts", q:"Explain Cartesian product with a suitable example.", a:""},
      {chapter:"Database Concepts", q:"Explain Object Model with example.", a:""},
      {chapter:"Database Concepts", q:"Write a note on different types of DBMS users.", a:""},
      {chapter:"Structured Query Language (SQL)", q:"What is a constraint? Write short note on Primary key constraint.", a:""},
      {chapter:"Structured Query Language (SQL)", q:"Write a SQL statement to modify the student table structure by adding a new field.", a:""},
      {chapter:"Structured Query Language (SQL)", q:"Write any three DDL commands.", a:""},
      {chapter:"Structured Query Language (SQL)", q:"Write the use of Savepoint command with an example.", a:""},
      {chapter:"Structured Query Language (SQL)", q:"Write a SQL statement using DISTINCT keyword.", a:""},
      {chapter:"Python and CSV Files", q:"Write a note on open() function of python. What is the difference between the two methods?", a:""},
      {chapter:"Python and CSV Files", q:"Write a Python program to modify an existing file.", a:""},
      {chapter:"Python and CSV Files", q:"Write a Python program to read a CSV file with default delimiter comma (,).", a:""},
      {chapter:"Python and CSV Files", q:"What is the difference between the write mode and append mode.", a:""},
      {chapter:"Python and CSV Files", q:"What is the difference between reader() method and DictReader() class?", a:""},
      {chapter:"Importing C++ Programs in Python", q:"Differentiate PYTHON and C++", a:""},
      {chapter:"Importing C++ Programs in Python", q:"What are the applications of scripting language?", a:""},
      {chapter:"Importing C++ Programs in Python", q:"What is MinGW? What is its use?", a:""},
      {chapter:"Importing C++ Programs in Python", q:"Identify the module, operator, definition name for the following welcome.display()", a:""},
      {chapter:"Importing C++ Programs in Python", q:"What is sys.argv? What does it contain?", a:""},
      {chapter:"Data Manipulation through SQL", q:"What is SQLite? What is it advantage?", a:""},
      {chapter:"Data Manipulation through SQL", q:"Mention the difference between fetchone() and fetchmany()", a:""},
      {chapter:"Data Manipulation through SQL", q:"What is the use of Where Clause. Give a python statement Using the where clause.", a:""},
      {chapter:"Data Manipulation through SQL", q:"Read the following details. Based on that write a python script to display department wise records database name :- organization.db Table name :- Employee Columns in the table :- Eno, EmpName, Esal, Dept", a:""},
      {chapter:"Data Manipulation through SQL", q:"Read the following details. Based on that write a python script to display records in descending order of Eno database name :- organization.db Table name :- Employee Columns in the table :- Eno, EmpName, Esal, Dept", a:""},
      {chapter:"Data Visualization using Python", q:"Draw the output for the following data visualization plot.", a:""},
      {chapter:"Data Visualization using Python", q:"Write any three uses of data visualization.", a:""},
      {chapter:"Data Visualization using Python", q:"Write the plot for the following pie chart output.", a:""},
    ],
    5: [
      {chapter:"Function", q:"What are called Parameters and write a note on (i) Parameter without Type (ii) Parameter with Type", a:""},
      {chapter:"Function", q:"Identify in the following program let rec gcd a b := if b <> 0 then gcd b (a mod b) else return a i) Name of the function ii) Identify the statement which tells it is a recursive function iii) Name of the argument variable iv) Statement which invoke the function recursively v) Statement which terminates the recursion", a:""},
      {chapter:"Function", q:"Explain with example Pure and impure functions.", a:""},
      {chapter:"Function", q:"Explain with an example interface and implementation.", a:""},
      {chapter:"Data Abstraction", q:"How will you facilitate data abstraction. Explain it with suitable example.", a:""},
      {chapter:"Data Abstraction", q:"What is a List? Why List can be called as Pairs. Explain with suitable example", a:""},
      {chapter:"Data Abstraction", q:"How will you access the multi-item. Explain with example.", a:""},
      {chapter:"Scoping", q:"Explain the types of scopes for variable or LEGB rule with example.", a:""},
      {chapter:"Scoping", q:"Write any Five Characteristics of Modules.", a:""},
      {chapter:"Scoping", q:"Write any five benefits in using modular programming.", a:""},
      {chapter:"Algorithmic Strategies", q:"Explain the characteristics of an algorithm.", a:""},
      {chapter:"Algorithmic Strategies", q:"Discuss about Linear search algorithm.", a:""},
      {chapter:"Algorithmic Strategies", q:"What is Binary search? Discuss with example.", a:""},
      {chapter:"Algorithmic Strategies", q:"Explain the Bubble sort algorithm with example.", a:""},
      {chapter:"Algorithmic Strategies", q:"Explain the concept of Dynamic programming with suitable example.", a:""},
      {chapter:"Python \u2013 Variables and Operators", q:"Describe in detail the procedure Script mode programming.", a:""},
      {chapter:"Python \u2013 Variables and Operators", q:"Explain input() and print() functions with examples.", a:""},
      {chapter:"Python \u2013 Variables and Operators", q:"Discuss in detail about Tokens in Python.", a:""},
      {chapter:"Control Structures", q:"Write a detail note on for loop.", a:""},
      {chapter:"Control Structures", q:"Write a detail note on if .. else .. elif statement with suitable example.", a:""},
      {chapter:"Control Structures", q:"Write a program to display all 3 digit odd numbers.", a:""},
      {chapter:"Control Structures", q:"Write a program to display multiplication table for a given number.", a:""},
      {chapter:"Python Functions", q:"Explain the different types of function with an example.", a:""},
      {chapter:"Python Functions", q:"Explain the scope of variables with an example.", a:""},
      {chapter:"Python Functions", q:"Explain the following built-in functions.", a:""},
      {chapter:"Python Functions", q:"Write a Python code to find the L.C.M. of two numbers.", a:""},
      {chapter:"Python Functions", q:"Explain recursive function with an example.", a:""},
      {chapter:"Strings and String Manipulation", q:"Explain about string operators in python with suitable example.", a:""},
      {chapter:"Lists, Tuples, Sets and Dictionary", q:"What the different ways to insert an element in a list. Explain with suitable example.", a:""},
      {chapter:"Lists, Tuples, Sets and Dictionary", q:"What is the purpose of range( )? Explain with an example.", a:""},
      {chapter:"Lists, Tuples, Sets and Dictionary", q:"What is nested tuple? Explain with an example.", a:""},
      {chapter:"Lists, Tuples, Sets and Dictionary", q:"Explain the different set operations supported by python with suitable example.", a:""},
      {chapter:"Python Classes and Objects", q:"Explain about constructor and destructor with suitable example.", a:""},
      {chapter:"Database Concepts", q:"Explain the different types of data model.", a:""},
      {chapter:"Database Concepts", q:"Explain the different types of relationship mapping.", a:""},
      {chapter:"Database Concepts", q:"Differentiate DBMS and RDBMS.", a:""},
      {chapter:"Database Concepts", q:"Explain the different operators in Relational algebra with suitable examples.", a:""},
      {chapter:"Database Concepts", q:"Explain the characteristics of RDBMS.", a:""},
      {chapter:"Structured Query Language (SQL)", q:"Write the different types of constraints and their functions.", a:""},
      {chapter:"Structured Query Language (SQL)", q:"Consider the following employee table. Write SQL commands for the questions. (i) to (v). (i) To display the details of all employees in descending order of pay. (ii) To display all employees whose allowance is between 5000 and 7000. (iii) To remove the employees who are mechanic. (iv) To add a new row. (v) To display the details of all employees who are operators.", a:""},
      {chapter:"Structured Query Language (SQL)", q:"What are the components of SQL? Write the commands in each.", a:""},
      {chapter:"Structured Query Language (SQL)", q:"Construct the following SQL statements in the student table. (i) SELECT statement using GROUP BY clause. (ii) SELECT statement using ORDER BY clause. If the Student table has the following data:", a:""},
      {chapter:"Structured Query Language (SQL)", q:"Write a SQL statement to create a table for employee having any five fields and create a table constraint for the employee table. CREATE TABLE EMPLOYEE ( EMPCODE CHAR(20), NAME CHAR(20), DESIG VARCHAR(20), PAY INTEGER, ALLOWANCE INTEGER, PRIMARY KEY(EMPCODE) Table constraint );", a:""},
      {chapter:"Python and CSV Files", q:"Differentiate Excel file and CSV file.", a:""},
      {chapter:"Python and CSV Files", q:"Tabulate the different file modes with its meaning.", a:""},
      {chapter:"Python and CSV Files", q:"Write the different methods to read a File in Python. Example:", a:""},
      {chapter:"Python and CSV Files", q:"Write a Python program to write a CSV File with custom quotes.", a:""},
      {chapter:"Python and CSV Files", q:"Write the rules to be followed to format the data in a CSV file.", a:""},
      {chapter:"Importing C++ Programs in Python", q:"Write any 5 features of Python.", a:""},
      {chapter:"Importing C++ Programs in Python", q:"Explain each word of the following command. python <filename.py> -<i> <C++ filename without cpp extension>", a:""},
      {chapter:"Importing C++ Programs in Python", q:"What is the purpose of sys, os, getopt module in Python. Explain.", a:""},
      {chapter:"Importing C++ Programs in Python", q:"Write the syntax for getopt() and explain its arguments and return values.", a:""},
      {chapter:"Importing C++ Programs in Python", q:"Write a Python program to execute the following c++ coding. `", a:""},
      {chapter:"Data Manipulation through SQL", q:"Write in brief about SQLite and the steps used to use it.", a:""},
      {chapter:"Data Manipulation through SQL", q:"Write the Python script to display all the records of the following table using fetchmany()", a:""},
      {chapter:"Data Manipulation through SQL", q:"What is the use of HAVING clause. Give an example python script.", a:""},
      {chapter:"Data Manipulation through SQL", q:"Write a Python script to create a table called ITEM with following specification. Add one record to the table. Name of the database :- ABC Name of the table :- Item Column name and specification :-", a:""},
      {chapter:"Data Manipulation through SQL", q:"Consider the following table Supplier and item .Write a python script for (i) to (ii) i) Display Name, City and Itemname of suppliers who do not reside in Delhi. ii) Increment the SuppQty of Akila by 40", a:""},
      {chapter:"Data Visualization using Python", q:"Explain in detail the types of pyplots using Matplotlib.", a:""},
      {chapter:"Data Visualization using Python", q:"Explain the various buttons in a matplotlib window.", a:""},
      {chapter:"Data Visualization using Python", q:"Explain the purpose of the following functions: a. plt.xlabel b. plt.ylabel c. plt.title d. plt.legend() e. plt.show()", a:""},
    ],
    /* Dedicated program-writing pool. When present (>=2 questions), the
       generator always places one of these as the LAST question in Part II
       (2-mark) and Part III (3-mark), and marks that question as the
       Compulsory Question — matching how real TN board CS papers require
       a program-writing question to be compulsory in each part. */
    program: [
      {chapter:"Control Structures", q:"Write a Python program to check whether a given number is prime or not.", a:""},
      {chapter:"Control Structures", q:"Write a Python program to find the sum of digits of a given number.", a:""},
      {chapter:"Python Functions", q:"Write a Python program using a function to find the factorial of a given number.", a:""},
      {chapter:"Python Functions", q:"Write a Python program using a function to check whether a given string is a palindrome or not.", a:""},
      {chapter:"Strings and String Manipulation", q:"Write a Python program to count the number of vowels present in a given string.", a:""},
      {chapter:"Strings and String Manipulation", q:"Write a Python program to reverse a given string using slicing.", a:""},
      {chapter:"Lists, Tuples, Sets and Dictionary", q:"Write a Python program to find the largest and smallest number in a given list.", a:""},
      {chapter:"Lists, Tuples, Sets and Dictionary", q:"Write a Python program to count the frequency of each element in a given list.", a:""},
      {chapter:"Python Classes and Objects", q:"Write a Python program using a class to accept and display the details of a student (name, roll number and marks).", a:""},
      {chapter:"Python and CSV Files", q:"Write a Python program to write a list of records into a CSV file.", a:""},
      {chapter:"Python and CSV Files", q:"Write a Python program to read a CSV file and display its contents.", a:""},
      {chapter:"Algorithmic Strategies", q:"Write a Python program to implement linear search on a list of numbers.", a:""},
      {chapter:"Algorithmic Strategies", q:"Write a Python program to implement bubble sort on a list of numbers.", a:""},
    ]
  },
  physics: {
    2: [
      {chapter:"Electrostatics", q:"What is meant by quantisation of charges?", a:""},
      {chapter:"Electrostatics", q:"Write down Coulomb\u2019s law in vector form and mention what each term represents.", a:""},
      {chapter:"Electrostatics", q:"What are the differences between Coulomb force and gravitational force?", a:""},
      {chapter:"Electrostatics", q:"Write a short note on superposition principle.", a:""},
      {chapter:"Electrostatics", q:"Define \u2018electric field\u2019.", a:""},
      {chapter:"Electrostatics", q:"What is meant by \u2018electric field lines\u2019?", a:""},
      {chapter:"Electrostatics", q:"The electric field lines never intersect. Justify.", a:""},
      {chapter:"Electrostatics", q:"Define \u2018electric dipole\u2019. Give the expression for the magnitiude of its electric dipole moment and the direction.", a:""},
      {chapter:"Electrostatics", q:"Write the general definition of electric dipole moment for a collection of point charge.", a:""},
      {chapter:"Electrostatics", q:"Define \u2018electrostatic potential\u201d.", a:""},
      {chapter:"Electrostatics", q:"What is an equipotential surface?", a:""},
      {chapter:"Electrostatics", q:"What are the properties of an equipotential surface?", a:""},
      {chapter:"Electrostatics", q:"Give the relation between electric field and electric potential.", a:""},
      {chapter:"Electrostatics", q:"Define \u2018electrostatic potential energy\u2019.", a:""},
      {chapter:"Electrostatics", q:"Define \u2018electric flux\u2019.", a:""},
      {chapter:"Electrostatics", q:"What is meant by electrostatic energy density?", a:""},
      {chapter:"Electrostatics", q:"Write a short note on \u2018electrostatic shielding\u2019.", a:""},
      {chapter:"Electrostatics", q:"What is polarisation?", a:""},
      {chapter:"Electrostatics", q:"What is dielectric strength?", a:""},
      {chapter:"Electrostatics", q:"Define \u2018capacitance\u2019. Give its unit.", a:""},
      {chapter:"Electrostatics", q:"What is corona discharge?", a:""},
      {chapter:"Current Electricity", q:"Why current is a scalar?", a:""},
      {chapter:"Current Electricity", q:"Define current density.", a:""},
      {chapter:"Current Electricity", q:"Distinguish between drift velocity and mobility.", a:""},
      {chapter:"Current Electricity", q:"State microscopic form of Ohm\u2019s law.", a:""},
      {chapter:"Current Electricity", q:"State macroscopic form of Ohm\u2019s law.", a:""},
      {chapter:"Current Electricity", q:"What are ohmic and non ohmic devices?", a:""},
      {chapter:"Current Electricity", q:"Define electrical resistivity.", a:""},
      {chapter:"Current Electricity", q:"Define temperature coefficient of resistance.", a:""},
      {chapter:"Current Electricity", q:"Write a short note on superconductors?", a:""},
      {chapter:"Current Electricity", q:"What is electric power and electric energy?", a:""},
      {chapter:"Current Electricity", q:"Derive the expression for power P=VI in electrical circuit.", a:""},
      {chapter:"Current Electricity", q:"Write down the various forms of expression for power in electrical circuit.", a:""},
      {chapter:"Current Electricity", q:"State Kirchhoff\u2019s current rule.", a:""},
      {chapter:"Current Electricity", q:"State Kirchhoff\u2019s voltage rule.", a:""},
      {chapter:"Current Electricity", q:"State the principle of potentiometer.", a:""},
      {chapter:"Current Electricity", q:"What do you mean by internal resistance of a cell?", a:""},
      {chapter:"Current Electricity", q:"State Joule\u2019s law of heating.", a:""},
      {chapter:"Current Electricity", q:"What is Seebeck effect?", a:""},
      {chapter:"Current Electricity", q:"What is Thomson effect?", a:""},
      {chapter:"Current Electricity", q:"What is Peltier effect?", a:""},
      {chapter:"Current Electricity", q:"State the applications of Seebeck effect.", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"What is magnetic field?", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"Define magnetic flux.", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"Define magnetic dipole moment.", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"State Coulomb\u2019s inverse law.", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"What is magnetic susceptibility?", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"State Biot-Savart\u2019s law.", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"What is magnetic permeability?", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"State Ampere\u2019s circuital law.", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"Compare dia, para and ferro-magnetism.", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"What is meant by hysteresis?", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"Define magnetic declination and inclination.", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"What is resonance condition in cyclotron?", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"Define ampere.", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"State Fleming's left hand rule.", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"Is an ammeter connected in series or parallel in a circuit? Why?", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"Explain the concept of velocity selector.", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"Why is the path of a charged particle not a circle when its velocity is not perpendicular to the magnetic field?", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"Give the properties of dia / para / ferromagnetic materials. kmaalvgisnoeltaiic.", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"What happens to the domains in a ferromagnetic material in the presence of external magnetic field?", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"How is a galvanometer converted into (i) an ammeter and (ii) a voltmeter?", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"What is meant by electromagnetic induction?", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"State Faraday\u2019s laws of electromagnetic induction.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"State Lenz\u2019s law.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"State Fleming\u2019s right hand rule.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"How is Eddy current produced? How do they flow in a conductor?", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Mention the ways of producing induced emf.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"What for an inductor is used?", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"What do you mean by self-induction?", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"How will you define the unit of inductance?", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"What do you understand by self- inductance of a coil?", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"What is meant by mutual induction?", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Give the principle of AC generator.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"List out the advantages of stationary armature-rotating field system of AC generator. 260 Unit 4 ELECTROMAGNETwICw wIN.bDoUoCkTs.IkOaNlv 1122tthh..", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"What are step-up and step-down tr", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Define average value of an alternating current.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"How will you define RMS value of an alternating current?", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"What are phasors?", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Define electric resonance.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"What do you mean by resonant frequency?", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"How will you define Q-factor?", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"What is meant by wattles current?", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Give any one definition of power factor.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"What are LC oscillations?", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"A graph between the magnitude of the magnetic flux linked with a closed loop and time is given in the figure. Arrange 1122tthh..iinndddd 226633 the regions of the graph in ascending order of the magnitude of induced emf in the loop. Magnetic flux b c a d time", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Using Lenz\u2019s law, predict the direction of induced current in conducting rings 1 and 2 when current in the wire is steadily decreasing.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"A flexible metallic loop abcd in the shape of a square is kept in a magnetic field with its plane perpendicular to the field. The magnetic field is directed into the paper normally. Find the direction of the induced current when the square loop is crushed into an irregular shape as shown in the figure. \u00d7 \u00d7 \u00d7 \u00d7 \u00d7 \u00d7 \u00d7 \u00d7 \u00d7 a b b a \u00d7 \u00d7 \u00d7 \u00d7 \u00d7 \u00d7 \u00d7 \u00d7 \u00d7 \u00d7 \u00d7 \u00d7 \u00d7 \u00d7 \u00d7 \u00d7 \u00d7 \u00d7 d c d c \u00d7 \u00d7 \u00d7 \u00d7 \u00d7 \u00d7 \u00d7 \u00d7 \u00d7 IkNsD.kUaClvTisIoOlaNi.AcoNmD ALTERNATING CURRENT 263", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Predict the polarity of the capacitor in a closed circular loop when two bar magnets are moved as shown in the figure.", a:""},
      {chapter:"Electromagnetic Waves", q:"What is displacement current?", a:""},
      {chapter:"Electromagnetic Waves", q:"What are electromagnetic waves?", a:""},
      {chapter:"Electromagnetic Waves", q:"Write down the integral form of modified Ampere\u2019s circuital law.", a:""},
      {chapter:"Electromagnetic Waves", q:"Write notes on Gauss' law in magnetism.", a:""},
      {chapter:"Electromagnetic Waves", q:"Give two uses each of (i) IR radiation, (ii) Microwaves and (iii) UV radiation.", a:""},
      {chapter:"Electromagnetic Waves", q:"What are Fraunhofer lines? How are they useful in the identification of elements present in the Sun?", a:""},
      {chapter:"Electromagnetic Waves", q:"Write notes on Ampere-Maxwell law.", a:""},
      {chapter:"Electromagnetic Waves", q:"Why are e.m. waves non-mechanical?", a:""},
      {chapter:"Ray Optics", q:"State the laws of reflection.", a:""},
      {chapter:"Ray Optics", q:"What is angle of deviation due to reflection?", a:""},
      {chapter:"Ray Optics", q:"Give the characteristics of image formed by a plane mirror.", a:""},
      {chapter:"Ray Optics", q:"Derive the relation between f and R for a spherical mirror.", a:""},
      {chapter:"Ray Optics", q:"What are the Cartesian sign conventions for a spherical mirror?", a:""},
      {chapter:"Ray Optics", q:"What is optical path?", a:""},
      {chapter:"Ray Optics", q:"State the laws of refraction.", a:""},
      {chapter:"Ray Optics", q:"What is angle of deviation due to refraction?", a:""},
      {chapter:"Ray Optics", q:"What is principle of reversibility?", a:""},
      {chapter:"Ray Optics", q:"What is relative refractive index?", a:""},
      {chapter:"Ray Optics", q:"Obtain the equation for apparent depth.", a:""},
      {chapter:"Ray Optics", q:"Why do stars twinkle?", a:""},
      {chapter:"Ray Optics", q:"What is critical angle and total internal reflection?", a:""},
      {chapter:"Ray Optics", q:"Obtain the equation for critical angle.", a:""},
      {chapter:"Ray Optics", q:"Explain the reason for glittering of diamond.", a:""},
      {chapter:"Ray Optics", q:"What are mirage and looming?", a:""},
      {chapter:"Ray Optics", q:"Write a short notes on the prisms making use of total internal reflection.", a:""},
      {chapter:"Ray Optics", q:"What is Snell\u2019s window?", a:""},
      {chapter:"Ray Optics", q:"Write a note on optical fibre.", a:""},
      {chapter:"Ray Optics", q:"Explain the working of an endoscope.", a:""},
      {chapter:"Ray Optics", q:"What are primary focus and secondary focus of convex lens?", a:""},
      {chapter:"Ray Optics", q:"What are the sign conventions followed for lenses?", a:""},
      {chapter:"Ray Optics", q:"Arrive at lens equation from lens maker\u2019s formula.", a:""},
      {chapter:"Ray Optics", q:"Obtain the equation for lateral magnification for thin lens.", a:""},
      {chapter:"Ray Optics", q:"What is power of a lens?", a:""},
      {chapter:"Ray Optics", q:"Derive the equation for effective focal length for lenses in contact.", a:""},
      {chapter:"Ray Optics", q:"What is angle of minimum deviation?", a:""},
      {chapter:"Ray Optics", q:"What is dispersion?", a:""},
      {chapter:"Ray Optics", q:"How are rainbows formed?", a:""},
      {chapter:"Ray Optics", q:"What is Rayleigh\u2019s scattering?", a:""},
      {chapter:"Ray Optics", q:"Why does sky appear blue?", a:""},
      {chapter:"Ray Optics", q:"What is the reason for reddish appearance of sky during sunset and sunrise?", a:""},
      {chapter:"Ray Optics", q:"Why do clouds appear white?", a:""},
      {chapter:"Ray Optics", q:"What are the salient features of corpuscular theory of light?", a:""},
      {chapter:"Ray Optics", q:"What is wave theory of light?", a:""},
      {chapter:"Ray Optics", q:"What is electromagnetic wave theory of light?", a:""},
      {chapter:"Ray Optics", q:"Write a short note on quantum theory of light.", a:""},
      {chapter:"Wave Optics", q:"What is a wavefront?", a:""},
      {chapter:"Wave Optics", q:"What is Huygens\u2019 principle?", a:""},
      {chapter:"Wave Optics", q:"What is interference of light?", a:""},
      {chapter:"Ray Optics", q:"What is phase of a wave?", a:""},
      {chapter:"Ray Optics", q:"Obtain the relation between phase difference and path difference.", a:""},
      {chapter:"Wave Optics", q:"What are coherent sources?", a:""},
      {chapter:"Ray Optics", q:"What is intensity division?", a:""},
      {chapter:"Wave Optics", q:"How does wavefront division provide coherent sources?", a:""},
      {chapter:"Ray Optics", q:"How do source and images behave as coherent sources?", a:""},
      {chapter:"Wave Optics", q:"What is bandwidth of interference pattern?", a:""},
      {chapter:"Wave Optics", q:"What is diffraction?", a:""},
      {chapter:"Wave Optics", q:"Differentiate between Fresnel and Fraunhofer diffraction.", a:""},
      {chapter:"Wave Optics", q:"Discuss the special cases on first minimum in Fraunhofer diffraction.", a:""},
      {chapter:"Ray Optics", q:"What is Fresnel\u2019s distance?", a:""},
      {chapter:"Wave Optics", q:"Mention the differences between interference and diffraction.", a:""},
      {chapter:"Wave Optics", q:"What is a diffraction grating?", a:""},
      {chapter:"Ray Optics", q:"What are resolution and resolving power?", a:""},
      {chapter:"Ray Optics", q:"What is Rayleigh\u2019s criterion?", a:""},
      {chapter:"Wave Optics", q:"What is polarisation?", a:""},
      {chapter:"Wave Optics", q:"Differentiate between polarised and unpolarised light", a:""},
      {chapter:"Wave Optics", q:"Discuss polarisation by selective absorption.", a:""},
      {chapter:"Wave Optics", q:"What are polariser and analyser?", a:""},
      {chapter:"Wave Optics", q:"What are plane polarised, unpolarised and partially polarised light?", a:""},
      {chapter:"Wave Optics", q:"State and obtain Malus\u2019 law.", a:""},
      {chapter:"Ray Optics", q:"List the uses of polaroids.", a:""},
      {chapter:"Wave Optics", q:"State Brewster\u2019s law.", a:""},
      {chapter:"Wave Optics", q:"What is angle of polarisation and obtain the equation for angle of polarisation.", a:""},
      {chapter:"Ray Optics", q:"Discuss about pile of plates.", a:""},
      {chapter:"Ray Optics", q:"What is double refraction?", a:""},
      {chapter:"Ray Optics", q:"Mention the types of optically active crystals with example.", a:""},
      {chapter:"Ray Optics", q:"Discuss about Nicol prism.", a:""},
      {chapter:"Wave Optics", q:"How is polarisation of light obtained by scattering of light?", a:""},
      {chapter:"Ray Optics", q:"Discuss about simple microscope and obtain the equations for magnification for near point focusing and normal focusing.", a:""},
      {chapter:"Ray Optics", q:"What are near point and normal focusing?", a:""},
      {chapter:"Ray Optics", q:"Why is oil immersed objective preferred in a microscope?", a:""},
      {chapter:"Ray Optics", q:"What are the advantages and disadvantages of using a reflecting telescope?", a:""},
      {chapter:"Ray Optics", q:"What is the use of an erecting lens in a terrestrial telescope?", a:""},
      {chapter:"Ray Optics", q:"What is the use of collimator?", a:""},
      {chapter:"Ray Optics", q:"What are the uses of spectrometer?", a:""},
      {chapter:"Ray Optics", q:"What is myopia? What is its remedy?", a:""},
      {chapter:"Ray Optics", q:"What is hypermetropia? What is its remedy?", a:""},
      {chapter:"Ray Optics", q:"What is presbyopia?", a:""},
      {chapter:"Ray Optics", q:"What is astigmatism?", a:""},
      {chapter:"Ray Optics", q:"Why are dish antennas curved?", a:""},
      {chapter:"Ray Optics", q:"What type of lens is formed by a bubble inside water?", a:""},
      {chapter:"Ray Optics", q:"It is possible for two lenses to produce zero power?", a:""},
      {chapter:"Ray Optics", q:"Why does sky look blue and clouds look white?", a:""},
      {chapter:"Ray Optics", q:"Why is yellow light preferred to during fog?", a:""},
      {chapter:"Wave Optics", q:"Two independent monochromatic sources cannot act as coherent sources, why?", a:""},
      {chapter:"Wave Optics", q:"Does diffraction take place at the Young\u2019s double slit?", a:""},
      {chapter:"Ray Optics", q:"Is there any difference between coloured light obtained from prism and colours of soap bubble?", a:""},
      {chapter:"Ray Optics", q:"A small disc is placed in the path of the light from distance source. Will the center of the shadow be bright or dark?", a:""},
      {chapter:"Ray Optics", q:"When a wave undergoes reflection at a denser medium, what happens to its phase?", a:""},
      {chapter:"Dual Nature of Radiation and Matter", q:"Why do metals have a large number of free electrons?", a:""},
      {chapter:"Dual Nature of Radiation and Matter", q:"Define work function of a metal. Give its unit.", a:""},
      {chapter:"Dual Nature of Radiation and Matter", q:"What is photoelectric effect?", a:""},
      {chapter:"Dual Nature of Radiation and Matter", q:"How does photocurrent vary with the intensity of the incident light?", a:""},
      {chapter:"Dual Nature of Radiation and Matter", q:"Give the definition of intensity of light and its unit.", a:""},
      {chapter:"Dual Nature of Radiation and Matter", q:"How will you define threshold frequency?", a:""},
      {chapter:"Dual Nature of Radiation and Matter", q:"What is a photo cell?", a:""},
      {chapter:"Dual Nature of Radiation and Matter", q:"Write the expression for the de Broglie wavelength associated with a charged particle of charge q and mass m, when it is accelerated through a potential V.", a:""},
      {chapter:"Dual Nature of Radiation and Matter", q:"State de Broglie hypothesis.", a:""},
      {chapter:"Dual Nature of Radiation and Matter", q:"Why we do not see the wave properties of a baseball?", a:""},
      {chapter:"Dual Nature of Radiation and Matter", q:"A proton and an electron have same kinetic energy. Which one has greater de Broglie wavelength. Justify.", a:""},
      {chapter:"Dual Nature of Radiation and Matter", q:"Write the relationship of de Broglie wavelength \u03bb associated with a particle of mass m in terms of its kinetic energy K.", a:""},
      {chapter:"Dual Nature of Radiation and Matter", q:"Name an experiment which shows wave nature of the electron. Which phenomenon was observed in this experiment using an electron beam?", a:""},
      {chapter:"Dual Nature of Radiation and Matter", q:"An electron and an alpha particle have same kinetic energy. How are the de Broglie wavelengths associated with them related?", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"What are cathode rays?", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Write the properties of cathode rays.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Give the results of Rutherford alpha scattering experiment.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Write down the postulates of Bohr atom model.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"What is meant by excitation energy.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Define the ionization energy and ionization potential.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Write down the draw backs of Bohr atom model.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"What is distance of closest approach?", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Define impact parameter.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Write a general notation of nucleus of element X. What each term denotes?", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"What is isotope?", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"What is isotone?", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"What is isobar?", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Define atomic mass unit u.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Show that nuclear density is almost constant for nuclei with Z > 10.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"What is mass defect?", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"What is binding energy of a nucleus?", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Calculate the energy equivalent of 1 atomic mass unit.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Give the physical meaning of binding energy per nucleon.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"What is meant by radioactivity?", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Give the symbolic representation of alpha decay, beta decay and gamma decay.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"In alpha decay, why the unstable nucleus emits He nucleus? Why it does not emit four separate nucleons?", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"What is mean life of nucleus?", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"What is half-life of nucleus?", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"What is meant by activity or decay rate?", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Define curie.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"What are the constituent particles of neutron and proton?", a:""},
      {chapter:"Electronics and Communication", q:"Define electron motion in a semiconductor.", a:""},
      {chapter:"Electronics and Communication", q:"Distinguish between intrinsic and extrinsic semiconductors.", a:""},
      {chapter:"Electronics and Communication", q:"What do you mean by doping?", a:""},
      {chapter:"Electronics and Communication", q:"How electron-hole pairs are created in a semiconductor material?", a:""},
      {chapter:"Electronics and Communication", q:"A diode is called as a unidirectional device. Explain", a:""},
      {chapter:"Electronics and Communication", q:"What do you mean by leakage current in a diode?", a:""},
      {chapter:"Electronics and Communication", q:"Draw the output waveform of a full wave rectifier.", a:""},
      {chapter:"Electronics and Communication", q:"Distinguish between avalanche and zener breakdown.", a:""},
      {chapter:"Electronics and Communication", q:"Discuss the biasing polarities in an NPN and PNP tr", a:""},
      {chapter:"Electronics and Communication", q:"Explain the current flow in a NPN tr", a:""},
      {chapter:"Electronics and Communication", q:"What is the phase relationship between the AC input and output voltages in a common emitter amplifier? What is the reason for the phase reversal?", a:""},
      {chapter:"Electronics and Communication", q:"Explain the need for a feedback circuit in a tr", a:""},
      {chapter:"Electronics and Communication", q:"Give circuit symbol, logical operation, truth table, and Boolean expression of AND, OR, NOT, NAND, NOR, and EX-OR gates", a:""},
      {chapter:"Electronics and Communication", q:"State De Morgan\u2019s first and second theorems.", a:""},
      {chapter:"Electronics and Communication", q:"Give the factors that are responsible for tr", a:""},
      {chapter:"Electronics and Communication", q:"Distinguish between wireline and wireless communication?", a:""},
      {chapter:"Electronics and Communication", q:"Explain centre frequency or resting frequency in frequency modulation.", a:""},
      {chapter:"Electronics and Communication", q:"What does RADAR stand for?", a:""},
      {chapter:"Electronics and Communication", q:"What do you mean by Internet of Th ings?", a:""},
      {chapter:"Recent Developments in Physics", q:"Distinguish between Nanoscience and Nanotechnology.", a:""},
      {chapter:"Recent Developments in Physics", q:"What is the difference between Nano materials and Bulk materials?", a:""},
      {chapter:"Recent Developments in Physics", q:"Give any two examples for \u201cNano\u201d in nature.", a:""},
      {chapter:"Recent Developments in Physics", q:"Mention any two advantages and disadvantages of Robotics.", a:""},
      {chapter:"Recent Developments in Physics", q:"Why steel is preferred in making Robots?", a:""},
      {chapter:"Recent Developments in Physics", q:"What are black holes?", a:""},
      {chapter:"Recent Developments in Physics", q:"What are sub atomic particles?", a:""},
    ],
    3: [
      {chapter:"Electrostatics", q:"Discuss the basic properties of electric charges.", a:""},
      {chapter:"Electrostatics", q:"Explain in detail Coulomb\u2019s law and its various aspects.", a:""},
      {chapter:"Electrostatics", q:"Define \u2018electric field\u2019 and discuss its various aspects.", a:""},
      {chapter:"Electrostatics", q:"Calculate the electric field due to a dipole on its axial line and equatorial plane.", a:""},
      {chapter:"Electrostatics", q:"Derive an expression for the torque experienced by a dipole due to a uniform electric field.", a:""},
      {chapter:"Electrostatics", q:"Derive an expression for electrostatic potential due to a point charge.", a:""},
      {chapter:"Electrostatics", q:"Derive an expression for electrostatic potential due to an electric dipole.", a:""},
      {chapter:"Electrostatics", q:"Obtain an expression for potential energy due to a collection of three point charges which are separated by finite distances.", a:""},
      {chapter:"Electrostatics", q:"Derive an expression for electrostatic potential energy of the dipole in a uniform electric field.", a:""},
      {chapter:"Electrostatics", q:"Obtain Gauss law from Coulomb\u2019s law.", a:""},
      {chapter:"Electrostatics", q:"Obtain the expression for electric field due to an infinitely long charged wire. 1122tthh..", a:""},
      {chapter:"Electrostatics", q:"Obtain the expression for electric field due to an charged infinite plane sheet.", a:""},
      {chapter:"Electrostatics", q:"Obtain the expression for electric field due to an uniformly charged spherical shell.", a:""},
      {chapter:"Electrostatics", q:"Discuss the various properties of conductors in electrostatic equilibrium.", a:""},
      {chapter:"Electrostatics", q:"Explain the process of electrostatic induction. 1 6. Explain dielectrics in detail and how an electric field is induced inside a dielectric. 17. Obtain the expression for capacitance for a parallel plate capacitor. 18. Obtain the expression for energy stored in the parallel plate capacitor. 19. Explain in detail the effect of a dielectric placed in a parallel plate capacitor. 20. Derive the expression for resultant capacitance, when capacitors are connected in series and in parallel. 21. Explain in detail how charges are distributed in a conductor, and the principle behind the lightning conductor. 22. Explain in detail the construction and working of a Van de Graaff generator. Exercises 1. When two objects are rubbed with each other, approximately a charge of 50 nC can be produced in each object. Calculate the number of electrons that must be trf electrons in the human body is typically in the order of 1028. Suppose, due to some reason, you and your friend lost 1% of this number of electrons. Calculate the electrostatic force between you and your friend separated at a distance of 1m. Compare this with your weight. Assume mass of each person is 60 kg and use point charge approximation. \u00d7 1023quidistant on a semicircle as shown in the figure. Another point charge q is kept at the centre of the circle of radius R. Calculate the electrostatic force experienced by the charge q. N y -kx QE Q Q mg R (a) q Q x Q Q (cid:31) 1 qQ( )\uf024 4. Suppose a charge +q on Earth\u2019s surface and another +q charge is placed on the surface of the Moon. (a) Calculate the value of q required to balance the gravitational attraction between Earth and Moon (b) Suppose the distance between the Moon and Earth is halved, would the charge q change? (Take m = 5.9 \u00d7 1024 kg, m = 7.9 \u00d7 1022 kg) E M q \u2248 +5.87 \u00d7 1013 C, (b) no change 1122tthh..iinndddd 7755 5. Draw the free body diagram for the following charges as shown in the figure (a), (b) and (c). + + + + + + + + + + + + -- + - + - + - + - m,Q k \u2192 + - E + - + + - + - + - v\u2192 +q -q + - 0 x = 0 + - - - - - - - - - - -- (a) (b) (c) (b) (c) T qE qE mg mg (b) (c) 6. Consider an electron travelling with a v speed and entering into a uniform o \uf072 electric field which is perpendicular E (cid:31) to v as shown in the Figure. (cid:30) Ignoring gravity, obtain the electron\u2019s acceleration, velocity and position as functions of time. y x _ _ _ _ _ _ _ _ _ _ _ _ \u2192 \u2192 v E \u2013 P e + + + + + + + + + + + eE 1eE (cid:31) (cid:31) \uf024 \uf024 \uf024 \uf024 t2\uf024 a=\u2212 j,v =v i \u2212 t j,r =v t i \u2212 j (cid:30) (cid:30) m m 2 m 7. A closed triangular box is kept in an electric field of magnitude E = 2 \u00d7 103 N C\u20131 as shown in the figure. 15cm \u2192 E 60\u00b0 5cm Calculate the electric flux through the (a) vertical rectangular surface (b) slanted surface and (c) entire surface. Nm2 C\u20131 Nm2 C\u20131 \u201315 (b) 15 (c) zero 8. The electrostatic potential is given as a function of x in figure (i) and (ii). (a) Calculate the corresponding electric fields in regions A, B, C and D for the Figure (i). (b) Plot the electric field as a function of x for the figure (ii). V V A 20 C B 3 5 D 0 x(cm) 1 2 4 -10 -20 0 -30 0.2 0.4 0.6 x(m) (i) (ii) E = 15 Vm\u20131 (region A), E = -10 X X Vm\u20131 (region C) E = 0 (region B), E = 30 Vm\u20131 X X (region D) E 0 x(cm) 1 2 3 5 -10 -20 -30 (b) 1122tthh..iinndddd 7766 9. A spark plug in a bike or a car is used to ignite the air-fuel mixture in the engine. It consists of two electrodes separated by a gap of around 0.6 mm gap as shown in the figure. To create the spark, an electric field of magnitude 3 \u00d7 106 Vm\u20131 is required. (a) What potential difference must be applied to produce the spark? (b) If the gap is increased, does the potential difference increase, decrease or remains the same? (c) find the potential difference if the gap is 1 mm. 1800 V, (b) increases (c) 3000 V 10. A point charge of +10 \u00b5C is placed at a distance of 20 cm from another identical point charge of +10 \u00b5C. A point charge of -2 \u00b5C is moved from point a to b as shown in the figure. Calculate the change in potential energy of the system? Interpret your result. b \u2013 \u20132\u00b5C 5 cm 5 cm 15 cm 10\u00b5C + \u2013 + 10\u00b5C ais required. 11. Calculate the resultant capacitances for each of the following combinations of capacitors. C C C 0 0 0 C C 0 0 C C R C 0 0 C C 0 0 (a) (b) (c) P C C C C C C C 0 0 0 1 2 0 0 C C 0 P C 0 C R S Q 0 C C 0 C 0 0 C 0 C 4 C C 3 0 Q (a) (b) (c) (d) (e) C (b) C (c) 3C \uf06f \uf06f \uf06f (d) across PQ: CC C +C C C +CC C +CC C 1 2 3 2 3 4 1 2 4 1 3 4 (C )(C ) +C +C 1 3 2 4 across RS: +C +CC +CC CC C C C C C 1 2 3 2 3 4 1 2 4 1 3 4 (C )(C ) +C +C 1 2 3 4 (e) across PQ: 2 C o 12. An electron and a proton are allowed to fall through the separation between the plates of a parallel plate capacitor of voltage 5 V and separation distance h = 1 mm as shown in the figure. \u2013 \u2013 \u2013 \u2013 \u2013 \u2013 \u2013 \u2013 \u2013 \u2013 + + + + + + + + + + Electron Neutron Proton y - + x \u2013 \u2013 \u2013 \u2013 \u2013 \u2013 \u2013 \u2013 \u2013 \u2013 + + + + + + + + + + 1122tthh..iinndddd 7777 (a) Calculate the time of flight for both electron and proton (b) Suppose if a neutron is allowed to fall, what is the time of flight? (c) Among the three, which one will reach the bottom first?", a:""},
      {chapter:"Current Electricity", q:"Describe the microscopic model of current and obtain microscopic form of Ohm\u2019s law.", a:""},
      {chapter:"Current Electricity", q:"Obtain the macroscopic form of Ohm\u2019s law from its microscopic form and discuss its limitation.", a:""},
      {chapter:"Current Electricity", q:"Explain the equivalent resistance of a series and parallel resistor network.", a:""},
      {chapter:"Current Electricity", q:"Explain the determination of the internal resistance of a cell using voltmeter. 1122tthh..", a:""},
      {chapter:"Current Electricity", q:"State and explain Kirchhoff\u2019s rules.", a:""},
      {chapter:"Current Electricity", q:"Obtain the condition for bridge balance in Wheatstone\u2019s bridge.", a:""},
      {chapter:"Current Electricity", q:"Explain the determination of unknown resistance using meter bridge.", a:""},
      {chapter:"Current Electricity", q:"How the emf of two cells are compared using potentiometer?", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"Discuss Earth\u2019s magnetic field in detail.", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"Deduce the relation for the magnetic field at a point due to an infinitely long straight conductor carrying current using Biot-Savart law.", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"Obtain a relation for the magnetic field at a point along the axis of a circular coil carrying current using Biot-Savart law.", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"Compute the torque experienced by a magnetic needle in a uniform magnetic field.", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"Calculate the magnetic field at a point on the axial line of a bar magnet.", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"Obtain the magnetic field at a point on the equatorial line of a bar magnet.", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"Find the magnetic field due to a long straight conductor using Ampere\u2019s circuital law.", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"Discuss the working of cyclotron in detail.", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"What is tangent law?", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"Derive the expression for the torque on a current-carrying coil in a magnetic field.", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"Discuss the conversion of galvanometer into an ammeter and also a voltmeter.", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"Calculate the magnetic field inside and outside of the long solenoid using Ampere\u2019s circuital law.", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"Derive the expression for the force between two parallel, current-carrying conductors.", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"Give an account of magnetic Lorentz force. 192 Unit 3 Magnetism and mawgwnwe.tbioco ekfsf.ekcatlvsi 1122tthh..", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"Compare the properties of soft and hard ferromagnetic materials.", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"Derive the expression for the force on a current-carrying conductor in a magnetic field.", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"Explain the principle and working of a moving coil galvanometer.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Establish the fact that the relative motion between the coil and the magnet induces an emf in the coil of a closed circuit.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Give an illustration of determining direction of induced current by using Lenz\u2019s law.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Show that Lenz\u2019s law is in accordance with the law of conservation of energy.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Obtain an expression for motional emf from Lorentz force.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Give the uses of Foucault current.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Define self-inductance of a coil interms of (i) magnetic flux and (ii) induced emf.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Assuming that the length of the solenoid is large when compared to its diameter, find the equation for its inductance. iAsoNlDai.AcoLTmERNATING CURRENT", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"An inductor of inductance L carries an electric current i. How much energy is stored while establishing the current in it?", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Show that the mutual inductance between a pair of coils is same (M = M ).", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"How will you induce an emf by changing the area enclosed by the coil?", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Show mathematically that the rotation of a coil in a magnetic field over one rotation induces an alternating emf of one cycle.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Elaborate the standard construction details of AC generator.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Explain the working of a single-phase AC generator with necessary diagram.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"How are the three different emfs generated in a three-phase AC generator?", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Explain the construction and working of tr", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Mention the various energy losses in a tr", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Give the advantage of AC in long distance power tr", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Find out the phase relationship between voltage and current in a pure inductive circuit.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Derive an expression for phase angle between the applied voltage and current in a series RLC circuit.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Define inductive and capacitive reactance. Give their units.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Obtain an expression for average power of AC over a cycle. Discuss its special cases. 1122tthh..", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Explain the generation of LC oscillations in a circuit containing an inductor of inductance L and a capacitor of capacitance C.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Prove that the total energy is conserved during LC oscillations.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Compare the electromagnetic oscillations of LC circuit with the mechanical oscillations of block- spring system qualitatively to find the expression for angular frequency of LC oscillator.", a:""},
      {chapter:"Electromagnetic Waves", q:"Write down Maxwell equations in integral form.", a:""},
      {chapter:"Electromagnetic Waves", q:"Write short notes on (a) microwave (b) X-ray (c) radio waves (d) visible spectrum", a:""},
      {chapter:"Electromagnetic Waves", q:"Discuss the Hertz experiment.", a:""},
      {chapter:"Electromagnetic Waves", q:"Explain the Maxwell\u2019s modification of Ampere\u2019s circuital law.", a:""},
      {chapter:"Electromagnetic Waves", q:"Explain the importance of Maxwell\u2019s correction.", a:""},
      {chapter:"Electromagnetic Waves", q:"Write down the properties of electromagnetic waves.", a:""},
      {chapter:"Electromagnetic Waves", q:"Discuss the source of electromagnetic waves.", a:""},
      {chapter:"Electromagnetic Waves", q:"Explain the types of emission spectrum.", a:""},
      {chapter:"Electromagnetic Waves", q:"Explain the types of absorption spectrum.", a:""},
      {chapter:"Ray Optics", q:"Derive the mirror equation and the equation for lateral magnification.", a:""},
      {chapter:"Ray Optics", q:"Describe the Fizeau\u2019s method to determine speed of light.", a:""},
      {chapter:"Ray Optics", q:"Obtain the equation for radius of illumination (or) Snell\u2019s window.", a:""},
      {chapter:"Ray Optics", q:"Derive the equation for acceptance angle and numerical aperture, of optical fiber.", a:""},
      {chapter:"Ray Optics", q:"Obtain the equation for lateral displacement of light passing through a glass slab.", a:""},
      {chapter:"Ray Optics", q:"Derive the equation for refraction at single spherical surface.", a:""},
      {chapter:"Ray Optics", q:"Obtain lens maker\u2019s formula and mention its significance.", a:""},
      {chapter:"Ray Optics", q:"Derive the equation for thin lens and obtain its magnification.", a:""},
      {chapter:"Ray Optics", q:"Derive the equation for effective focal length for lenses in out of contact.", a:""},
      {chapter:"Ray Optics", q:"Derive the equation for angle of deviation produced by a prism and thus obtain the equation for refractive index of material of the prism.", a:""},
      {chapter:"Ray Optics", q:"What is dispersion?", a:""},
      {chapter:"Wave Optics", q:"Prove laws of reflection using Huygens\u2019 principle.", a:""},
      {chapter:"Ray Optics", q:"Prove laws of refraction using Huygens\u2019 principle.", a:""},
      {chapter:"Wave Optics", q:"Obtain the equation for resultant intensity due to interference of light.", a:""},
      {chapter:"Wave Optics", q:"Explain the Young\u2019s double slit experimental setup and obtain the equation for path difference.", a:""},
      {chapter:"Wave Optics", q:"Obtain the equation for bandwidth in Young\u2019s double slit experiment.", a:""},
      {chapter:"Wave Optics", q:"Obtain the equations for constructive and destructive interference for tr", a:""},
      {chapter:"Wave Optics", q:"Discuss diffraction at single slit and obtain the condition for nth minimum.", a:""},
      {chapter:"Wave Optics", q:"Discuss the diffraction at a grating mth and obtain the condition for the maximum.", a:""},
      {chapter:"Wave Optics", q:"Discuss the experiment to determine the wavelength of monochromatic light using diffraction grating.", a:""},
      {chapter:"Wave Optics", q:"Discuss the experiment to determine the wavelength of different colours using diffraction grating.", a:""},
      {chapter:"Ray Optics", q:"Obtain the equation for resolving power of optical instrument.", a:""},
      {chapter:"Ray Optics", q:"Discuss about simple microscope and obtain the equations for magnification for near point focusing and normal focusing.", a:""},
      {chapter:"Ray Optics", q:"Explain about compound microscope and obtain the equation for magnification.", a:""},
      {chapter:"Ray Optics", q:"Obtain the equation for resolving power of microscope.", a:""},
      {chapter:"Ray Optics", q:"Discuss about astronomical telescope.", a:""},
      {chapter:"Ray Optics", q:"Mention different parts of spectrometer and explain the preliminary adjustments.", a:""},
      {chapter:"Ray Optics", q:"Explain the experimental determination of material of the prism using spectrometer.", a:""},
      {chapter:"Dual Nature of Radiation and Matter", q:"What do you mean by electron emission?", a:""},
      {chapter:"Dual Nature of Radiation and Matter", q:"Briefly discuss the observations of Hertz, Hallwachs and Lenard.", a:""},
      {chapter:"Dual Nature of Radiation and Matter", q:"Explain the effect of potential difference on photoelectric current.", a:""},
      {chapter:"Dual Nature of Radiation and Matter", q:"Explain how frequency of incident light varies with stopping potential.", a:""},
      {chapter:"Dual Nature of Radiation and Matter", q:"List out the laws of photoelectric effect.", a:""},
      {chapter:"Dual Nature of Radiation and Matter", q:"Explain why photoelectric effect cannot be explained on the basis of wave nature of light.", a:""},
      {chapter:"Dual Nature of Radiation and Matter", q:"Explain the quantum concept of light.", a:""},
      {chapter:"Dual Nature of Radiation and Matter", q:"Obtain Einstein\u2019s photoelectric equation with necessary explanation.", a:""},
      {chapter:"Dual Nature of Radiation and Matter", q:"Explain experimentally observed facts of photoelectric effect with the help of Einstein\u2019s explanation.", a:""},
      {chapter:"Dual Nature of Radiation and Matter", q:"Give the construction and working of photo emissive cell.", a:""},
      {chapter:"Dual Nature of Radiation and Matter", q:"Derive an expression for de Broglie wavelength of electrons.", a:""},
      {chapter:"Dual Nature of Radiation and Matter", q:"Briefly explain the principle and working of electron microscope.", a:""},
      {chapter:"Dual Nature of Radiation and Matter", q:"Describe briefly Davisson \u2013 Germer experiment which demonstrated the wave nature of electrons.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Explain the J.J. Thomson experiment to determine the specific charge of electron.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Discuss the Millikan\u2019s oil drop experiment to determine the charge of an electron.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Derive the energy expression for hydrogen atom using Bohr atom model.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Discuss the spectral series of hydrogen atom.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Explain the variation of average binding energy with the mass number by graph and discuss its features.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Explain in detail the nuclear force.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Discuss the alpha decay process with example.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Discuss the beta decay process with examples.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Discuss the gamma decay process with example.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Obtain the law of radioactivity.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Discuss the properties of neutrino and its role in beta decay.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Explain the idea of carbon dating.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Discuss the process of nuclear fission and its properties.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Discuss the process of nuclear fusion and how energy is generated in stars?", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Describe the working of nuclear reactor with a block diagram.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Explain in detail the four fundamental forces.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Briefly explain the elementary particles of nature. Exercises 1. Consider two hydrogen atoms H A and H in ground state. Assume that B hydrogen atom H is at rest and A hydrogen atom H is moving with a B speed and make head-on collide on the stationary hydrogen atom H. After A the strike, both of them move together. What is minimum value of the kinetic energy of the moving hydrogen atom H, such that any one of the hydrogen B atoms reaches one of the excitation state. 2. In the Bohr atom model, the frequency of trn2 m2\uf8f8 Consider the following trns obey sum rule (which is known as Ritz combination principle) 3\u21922 2\u21921 3\u21921 3. (a) A hydrogen atom is excited by radiation of wavelength 97.5 nm. Find the principal quantum number of the excited state. (b) Show that the total number of lines n(n-1) in emission spectrum is and compute the total number of possible lines in emission spectrum. n =4 (b) 6 possible tr 4. Calculate the radius of the earth if the density of the earth is equal to the density of the nucleus.[mass of earth 5.97 1024 \u00d7 kg]. 180m 5. Calculate the mass defect and the binding energy per nucleon of the Ag nucleus. [atomic mass of Ag = 107.905949] 0.990391 and \uf8ee\u2206m= u \uf8f9 20 minutes and 40 minutes respectively. Initially, the samples have equal number of nuclei. Calculate the ratio of decayed numbers of A and B nuclei after 80 minutes. 7. On your birthday, you measure the activity of the sample Bi which has a half-life of 5.01 days. The initial activity that you measure is 1\u00b5Ci. (a) What is the approximate activity of the sample on your next birthday? Calculate (b) the decay constant (c) the mean life (d) initial number of atoms. -22\u00b5Ci 1.6 10\u22126 s\u22121 10 (b) \u00d7 2.31 1010 (c) 7.24days (d) \u00d7 ] 8. Calculate the time required for 60% of a sample of radon undergo decay. Given T of radon =3.8 days 1/2 9. Assuming that energy released by the fission of a single U nucleus is 200MeV, calculate the number of fissions per second required to produce 1 watt power. 3.125 1010 10. Show that the mass of radium ( Ra) with an activity of 1 curie is almost a gram. Given T =1600 years. 1/2 11. Characol pieces of tree is found from an archeological site. The carbon-14 content of this characol is only 17.5% that of equivalent sample of carbon from a living tree. What is the age of tree?", a:""},
      {chapter:"Electronics and Communication", q:"Elucidate the formation of a N-type and P-type semiconductors.", a:""},
      {chapter:"Electronics and Communication", q:"Explain the formation of PN junction diode. Discuss its V\u2013I characteristics.", a:""},
      {chapter:"Electronics and Communication", q:"Draw the circuit diagram of a half wave rectifier and explain its working", a:""},
      {chapter:"Electronics and Communication", q:"Explain the construction and working of a full wave rectifier.", a:""},
      {chapter:"Electronics and Communication", q:"What is an LED?", a:""},
      {chapter:"Electronics and Communication", q:"Write notes on Photodiode.", a:""},
      {chapter:"Electronics and Communication", q:"Explain the working principle of a solar cell. Mention its applications.", a:""},
      {chapter:"Electronics and Communication", q:"Sketch the static characteristics of a common emitter tr", a:""},
      {chapter:"Electronics and Communication", q:"Describe the function of a tr wave form.", a:""},
      {chapter:"Electronics and Communication", q:"State Boolean laws. Elucidate how they are used to simplify Boolean expressions with suitable example.", a:""},
      {chapter:"Electronics and Communication", q:"State and prove De Morgan\u2019s First and Second theorems.", a:""},
      {chapter:"Electronics and Communication", q:"What is modulation?", a:""},
      {chapter:"Electronics and Communication", q:"Elaborate on the basic elements of communication system with the necessary block diagram.", a:""},
      {chapter:"Electronics and Communication", q:"Explain the three modes of propagation of electromagnetic waves through space.", a:""},
      {chapter:"Electronics and Communication", q:"What do you know about GPS?", a:""},
      {chapter:"Electronics and Communication", q:"Give the applications of ICT in mining and agriculture sectors.", a:""},
      {chapter:"Electronics and Communication", q:"Modulation helps to reduce the antenna size in wireless communication \u2013 Explain.", a:""},
      {chapter:"Electronics and Communication", q:"Fiber optic communication is gaining popularity among the various tr", a:""},
      {chapter:"Recent Developments in Physics", q:"Discuss the applications of Nanomaterials in various fields.", a:""},
      {chapter:"Recent Developments in Physics", q:"What are the possible harmful effects of usage of Nanoparticles? Why?", a:""},
      {chapter:"Recent Developments in Physics", q:"Discuss the functions of key components in Robots?", a:""},
      {chapter:"Recent Developments in Physics", q:"Elaborate any two types of Robots with relevant examples.", a:""},
    ],
    5: [
      {chapter:"Electrostatics", q:"Discuss the basic properties of electric charges.", a:""},
      {chapter:"Electrostatics", q:"Explain in detail Coulomb\u2019s law and its various aspects.", a:""},
      {chapter:"Electrostatics", q:"Define \u2018electric field\u2019 and discuss its various aspects.", a:""},
      {chapter:"Electrostatics", q:"Calculate the electric field due to a dipole on its axial line and equatorial plane.", a:""},
      {chapter:"Electrostatics", q:"Derive an expression for the torque experienced by a dipole due to a uniform electric field.", a:""},
      {chapter:"Electrostatics", q:"Derive an expression for electrostatic potential due to a point charge.", a:""},
      {chapter:"Electrostatics", q:"Derive an expression for electrostatic potential due to an electric dipole.", a:""},
      {chapter:"Electrostatics", q:"Obtain an expression for potential energy due to a collection of three point charges which are separated by finite distances.", a:""},
      {chapter:"Electrostatics", q:"Derive an expression for electrostatic potential energy of the dipole in a uniform electric field.", a:""},
      {chapter:"Electrostatics", q:"Obtain Gauss law from Coulomb\u2019s law.", a:""},
      {chapter:"Electrostatics", q:"Obtain the expression for electric field due to an infinitely long charged wire. 1122tthh..", a:""},
      {chapter:"Electrostatics", q:"Obtain the expression for electric field due to an charged infinite plane sheet.", a:""},
      {chapter:"Electrostatics", q:"Obtain the expression for electric field due to an uniformly charged spherical shell.", a:""},
      {chapter:"Electrostatics", q:"Discuss the various properties of conductors in electrostatic equilibrium.", a:""},
      {chapter:"Electrostatics", q:"Explain the process of electrostatic induction. 1 6. Explain dielectrics in detail and how an electric field is induced inside a dielectric. 17. Obtain the expression for capacitance for a parallel plate capacitor. 18. Obtain the expression for energy stored in the parallel plate capacitor. 19. Explain in detail the effect of a dielectric placed in a parallel plate capacitor. 20. Derive the expression for resultant capacitance, when capacitors are connected in series and in parallel. 21. Explain in detail how charges are distributed in a conductor, and the principle behind the lightning conductor. 22. Explain in detail the construction and working of a Van de Graaff generator. Exercises 1. When two objects are rubbed with each other, approximately a charge of 50 nC can be produced in each object. Calculate the number of electrons that must be trf electrons in the human body is typically in the order of 1028. Suppose, due to some reason, you and your friend lost 1% of this number of electrons. Calculate the electrostatic force between you and your friend separated at a distance of 1m. Compare this with your weight. Assume mass of each person is 60 kg and use point charge approximation. \u00d7 1023quidistant on a semicircle as shown in the figure. Another point charge q is kept at the centre of the circle of radius R. Calculate the electrostatic force experienced by the charge q. N y -kx QE Q Q mg R (a) q Q x Q Q (cid:31) 1 qQ( )\uf024 4. Suppose a charge +q on Earth\u2019s surface and another +q charge is placed on the surface of the Moon. (a) Calculate the value of q required to balance the gravitational attraction between Earth and Moon (b) Suppose the distance between the Moon and Earth is halved, would the charge q change? (Take m = 5.9 \u00d7 1024 kg, m = 7.9 \u00d7 1022 kg) E M q \u2248 +5.87 \u00d7 1013 C, (b) no change 1122tthh..iinndddd 7755 5. Draw the free body diagram for the following charges as shown in the figure (a), (b) and (c). + + + + + + + + + + + + -- + - + - + - + - m,Q k \u2192 + - E + - + + - + - + - v\u2192 +q -q + - 0 x = 0 + - - - - - - - - - - -- (a) (b) (c) (b) (c) T qE qE mg mg (b) (c) 6. Consider an electron travelling with a v speed and entering into a uniform o \uf072 electric field which is perpendicular E (cid:31) to v as shown in the Figure. (cid:30) Ignoring gravity, obtain the electron\u2019s acceleration, velocity and position as functions of time. y x _ _ _ _ _ _ _ _ _ _ _ _ \u2192 \u2192 v E \u2013 P e + + + + + + + + + + + eE 1eE (cid:31) (cid:31) \uf024 \uf024 \uf024 \uf024 t2\uf024 a=\u2212 j,v =v i \u2212 t j,r =v t i \u2212 j (cid:30) (cid:30) m m 2 m 7. A closed triangular box is kept in an electric field of magnitude E = 2 \u00d7 103 N C\u20131 as shown in the figure. 15cm \u2192 E 60\u00b0 5cm Calculate the electric flux through the (a) vertical rectangular surface (b) slanted surface and (c) entire surface. Nm2 C\u20131 Nm2 C\u20131 \u201315 (b) 15 (c) zero 8. The electrostatic potential is given as a function of x in figure (i) and (ii). (a) Calculate the corresponding electric fields in regions A, B, C and D for the Figure (i). (b) Plot the electric field as a function of x for the figure (ii). V V A 20 C B 3 5 D 0 x(cm) 1 2 4 -10 -20 0 -30 0.2 0.4 0.6 x(m) (i) (ii) E = 15 Vm\u20131 (region A), E = -10 X X Vm\u20131 (region C) E = 0 (region B), E = 30 Vm\u20131 X X (region D) E 0 x(cm) 1 2 3 5 -10 -20 -30 (b) 1122tthh..iinndddd 7766 9. A spark plug in a bike or a car is used to ignite the air-fuel mixture in the engine. It consists of two electrodes separated by a gap of around 0.6 mm gap as shown in the figure. To create the spark, an electric field of magnitude 3 \u00d7 106 Vm\u20131 is required. (a) What potential difference must be applied to produce the spark? (b) If the gap is increased, does the potential difference increase, decrease or remains the same? (c) find the potential difference if the gap is 1 mm. 1800 V, (b) increases (c) 3000 V 10. A point charge of +10 \u00b5C is placed at a distance of 20 cm from another identical point charge of +10 \u00b5C. A point charge of -2 \u00b5C is moved from point a to b as shown in the figure. Calculate the change in potential energy of the system? Interpret your result. b \u2013 \u20132\u00b5C 5 cm 5 cm 15 cm 10\u00b5C + \u2013 + 10\u00b5C ais required. 11. Calculate the resultant capacitances for each of the following combinations of capacitors. C C C 0 0 0 C C 0 0 C C R C 0 0 C C 0 0 (a) (b) (c) P C C C C C C C 0 0 0 1 2 0 0 C C 0 P C 0 C R S Q 0 C C 0 C 0 0 C 0 C 4 C C 3 0 Q (a) (b) (c) (d) (e) C (b) C (c) 3C \uf06f \uf06f \uf06f (d) across PQ: CC C +C C C +CC C +CC C 1 2 3 2 3 4 1 2 4 1 3 4 (C )(C ) +C +C 1 3 2 4 across RS: +C +CC +CC CC C C C C C 1 2 3 2 3 4 1 2 4 1 3 4 (C )(C ) +C +C 1 2 3 4 (e) across PQ: 2 C o 12. An electron and a proton are allowed to fall through the separation between the plates of a parallel plate capacitor of voltage 5 V and separation distance h = 1 mm as shown in the figure. \u2013 \u2013 \u2013 \u2013 \u2013 \u2013 \u2013 \u2013 \u2013 \u2013 + + + + + + + + + + Electron Neutron Proton y - + x \u2013 \u2013 \u2013 \u2013 \u2013 \u2013 \u2013 \u2013 \u2013 \u2013 + + + + + + + + + + 1122tthh..iinndddd 7777 (a) Calculate the time of flight for both electron and proton (b) Suppose if a neutron is allowed to fall, what is the time of flight? (c) Among the three, which one will reach the bottom first?", a:""},
      {chapter:"Current Electricity", q:"Describe the microscopic model of current and obtain microscopic form of Ohm\u2019s law.", a:""},
      {chapter:"Current Electricity", q:"Obtain the macroscopic form of Ohm\u2019s law from its microscopic form and discuss its limitation.", a:""},
      {chapter:"Current Electricity", q:"Explain the equivalent resistance of a series and parallel resistor network.", a:""},
      {chapter:"Current Electricity", q:"Explain the determination of the internal resistance of a cell using voltmeter. 1122tthh..", a:""},
      {chapter:"Current Electricity", q:"State and explain Kirchhoff\u2019s rules.", a:""},
      {chapter:"Current Electricity", q:"Obtain the condition for bridge balance in Wheatstone\u2019s bridge.", a:""},
      {chapter:"Current Electricity", q:"Explain the determination of unknown resistance using meter bridge.", a:""},
      {chapter:"Current Electricity", q:"How the emf of two cells are compared using potentiometer?", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"Discuss Earth\u2019s magnetic field in detail.", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"Deduce the relation for the magnetic field at a point due to an infinitely long straight conductor carrying current using Biot-Savart law.", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"Obtain a relation for the magnetic field at a point along the axis of a circular coil carrying current using Biot-Savart law.", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"Compute the torque experienced by a magnetic needle in a uniform magnetic field.", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"Calculate the magnetic field at a point on the axial line of a bar magnet.", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"Obtain the magnetic field at a point on the equatorial line of a bar magnet.", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"Find the magnetic field due to a long straight conductor using Ampere\u2019s circuital law.", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"Discuss the working of cyclotron in detail.", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"What is tangent law?", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"Derive the expression for the torque on a current-carrying coil in a magnetic field.", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"Discuss the conversion of galvanometer into an ammeter and also a voltmeter.", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"Calculate the magnetic field inside and outside of the long solenoid using Ampere\u2019s circuital law.", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"Derive the expression for the force between two parallel, current-carrying conductors.", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"Give an account of magnetic Lorentz force. 192 Unit 3 Magnetism and mawgwnwe.tbioco ekfsf.ekcatlvsi 1122tthh..", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"Compare the properties of soft and hard ferromagnetic materials.", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"Derive the expression for the force on a current-carrying conductor in a magnetic field.", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"Explain the principle and working of a moving coil galvanometer.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Establish the fact that the relative motion between the coil and the magnet induces an emf in the coil of a closed circuit.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Give an illustration of determining direction of induced current by using Lenz\u2019s law.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Show that Lenz\u2019s law is in accordance with the law of conservation of energy.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Obtain an expression for motional emf from Lorentz force.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Give the uses of Foucault current.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Define self-inductance of a coil interms of (i) magnetic flux and (ii) induced emf.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Assuming that the length of the solenoid is large when compared to its diameter, find the equation for its inductance. iAsoNlDai.AcoLTmERNATING CURRENT", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"An inductor of inductance L carries an electric current i. How much energy is stored while establishing the current in it?", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Show that the mutual inductance between a pair of coils is same (M = M ).", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"How will you induce an emf by changing the area enclosed by the coil?", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Show mathematically that the rotation of a coil in a magnetic field over one rotation induces an alternating emf of one cycle.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Elaborate the standard construction details of AC generator.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Explain the working of a single-phase AC generator with necessary diagram.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"How are the three different emfs generated in a three-phase AC generator?", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Explain the construction and working of tr", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Mention the various energy losses in a tr", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Give the advantage of AC in long distance power tr", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Find out the phase relationship between voltage and current in a pure inductive circuit.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Derive an expression for phase angle between the applied voltage and current in a series RLC circuit.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Define inductive and capacitive reactance. Give their units.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Obtain an expression for average power of AC over a cycle. Discuss its special cases. 1122tthh..", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Explain the generation of LC oscillations in a circuit containing an inductor of inductance L and a capacitor of capacitance C.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Prove that the total energy is conserved during LC oscillations.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Compare the electromagnetic oscillations of LC circuit with the mechanical oscillations of block- spring system qualitatively to find the expression for angular frequency of LC oscillator.", a:""},
      {chapter:"Electromagnetic Waves", q:"Write down Maxwell equations in integral form.", a:""},
      {chapter:"Electromagnetic Waves", q:"Write short notes on (a) microwave (b) X-ray (c) radio waves (d) visible spectrum", a:""},
      {chapter:"Electromagnetic Waves", q:"Discuss the Hertz experiment.", a:""},
      {chapter:"Electromagnetic Waves", q:"Explain the Maxwell\u2019s modification of Ampere\u2019s circuital law.", a:""},
      {chapter:"Electromagnetic Waves", q:"Explain the importance of Maxwell\u2019s correction.", a:""},
      {chapter:"Electromagnetic Waves", q:"Write down the properties of electromagnetic waves.", a:""},
      {chapter:"Electromagnetic Waves", q:"Discuss the source of electromagnetic waves.", a:""},
      {chapter:"Electromagnetic Waves", q:"Explain the types of emission spectrum.", a:""},
      {chapter:"Electromagnetic Waves", q:"Explain the types of absorption spectrum.", a:""},
      {chapter:"Ray Optics", q:"Derive the mirror equation and the equation for lateral magnification.", a:""},
      {chapter:"Ray Optics", q:"Describe the Fizeau\u2019s method to determine speed of light.", a:""},
      {chapter:"Ray Optics", q:"Obtain the equation for radius of illumination (or) Snell\u2019s window.", a:""},
      {chapter:"Ray Optics", q:"Derive the equation for acceptance angle and numerical aperture, of optical fiber.", a:""},
      {chapter:"Ray Optics", q:"Obtain the equation for lateral displacement of light passing through a glass slab.", a:""},
      {chapter:"Ray Optics", q:"Derive the equation for refraction at single spherical surface.", a:""},
      {chapter:"Ray Optics", q:"Obtain lens maker\u2019s formula and mention its significance.", a:""},
      {chapter:"Ray Optics", q:"Derive the equation for thin lens and obtain its magnification.", a:""},
      {chapter:"Ray Optics", q:"Derive the equation for effective focal length for lenses in out of contact.", a:""},
      {chapter:"Ray Optics", q:"Derive the equation for angle of deviation produced by a prism and thus obtain the equation for refractive index of material of the prism.", a:""},
      {chapter:"Ray Optics", q:"What is dispersion?", a:""},
      {chapter:"Wave Optics", q:"Prove laws of reflection using Huygens\u2019 principle.", a:""},
      {chapter:"Ray Optics", q:"Prove laws of refraction using Huygens\u2019 principle.", a:""},
      {chapter:"Wave Optics", q:"Obtain the equation for resultant intensity due to interference of light.", a:""},
      {chapter:"Wave Optics", q:"Explain the Young\u2019s double slit experimental setup and obtain the equation for path difference.", a:""},
      {chapter:"Wave Optics", q:"Obtain the equation for bandwidth in Young\u2019s double slit experiment.", a:""},
      {chapter:"Wave Optics", q:"Obtain the equations for constructive and destructive interference for tr", a:""},
      {chapter:"Wave Optics", q:"Discuss diffraction at single slit and obtain the condition for nth minimum.", a:""},
      {chapter:"Wave Optics", q:"Discuss the diffraction at a grating mth and obtain the condition for the maximum.", a:""},
      {chapter:"Wave Optics", q:"Discuss the experiment to determine the wavelength of monochromatic light using diffraction grating.", a:""},
      {chapter:"Wave Optics", q:"Discuss the experiment to determine the wavelength of different colours using diffraction grating.", a:""},
      {chapter:"Ray Optics", q:"Obtain the equation for resolving power of optical instrument.", a:""},
      {chapter:"Ray Optics", q:"Discuss about simple microscope and obtain the equations for magnification for near point focusing and normal focusing.", a:""},
      {chapter:"Ray Optics", q:"Explain about compound microscope and obtain the equation for magnification.", a:""},
      {chapter:"Ray Optics", q:"Obtain the equation for resolving power of microscope.", a:""},
      {chapter:"Ray Optics", q:"Discuss about astronomical telescope.", a:""},
      {chapter:"Ray Optics", q:"Mention different parts of spectrometer and explain the preliminary adjustments.", a:""},
      {chapter:"Ray Optics", q:"Explain the experimental determination of material of the prism using spectrometer.", a:""},
      {chapter:"Dual Nature of Radiation and Matter", q:"What do you mean by electron emission?", a:""},
      {chapter:"Dual Nature of Radiation and Matter", q:"Briefly discuss the observations of Hertz, Hallwachs and Lenard.", a:""},
      {chapter:"Dual Nature of Radiation and Matter", q:"Explain the effect of potential difference on photoelectric current.", a:""},
      {chapter:"Dual Nature of Radiation and Matter", q:"Explain how frequency of incident light varies with stopping potential.", a:""},
      {chapter:"Dual Nature of Radiation and Matter", q:"List out the laws of photoelectric effect.", a:""},
      {chapter:"Dual Nature of Radiation and Matter", q:"Explain why photoelectric effect cannot be explained on the basis of wave nature of light.", a:""},
      {chapter:"Dual Nature of Radiation and Matter", q:"Explain the quantum concept of light.", a:""},
      {chapter:"Dual Nature of Radiation and Matter", q:"Obtain Einstein\u2019s photoelectric equation with necessary explanation.", a:""},
      {chapter:"Dual Nature of Radiation and Matter", q:"Explain experimentally observed facts of photoelectric effect with the help of Einstein\u2019s explanation.", a:""},
      {chapter:"Dual Nature of Radiation and Matter", q:"Give the construction and working of photo emissive cell.", a:""},
      {chapter:"Dual Nature of Radiation and Matter", q:"Derive an expression for de Broglie wavelength of electrons.", a:""},
      {chapter:"Dual Nature of Radiation and Matter", q:"Briefly explain the principle and working of electron microscope.", a:""},
      {chapter:"Dual Nature of Radiation and Matter", q:"Describe briefly Davisson \u2013 Germer experiment which demonstrated the wave nature of electrons.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Explain the J.J. Thomson experiment to determine the specific charge of electron.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Discuss the Millikan\u2019s oil drop experiment to determine the charge of an electron.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Derive the energy expression for hydrogen atom using Bohr atom model.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Discuss the spectral series of hydrogen atom.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Explain the variation of average binding energy with the mass number by graph and discuss its features.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Explain in detail the nuclear force.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Discuss the alpha decay process with example.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Discuss the beta decay process with examples.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Discuss the gamma decay process with example.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Obtain the law of radioactivity.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Discuss the properties of neutrino and its role in beta decay.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Explain the idea of carbon dating.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Discuss the process of nuclear fission and its properties.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Discuss the process of nuclear fusion and how energy is generated in stars?", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Describe the working of nuclear reactor with a block diagram.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Explain in detail the four fundamental forces.", a:""},
      {chapter:"Atomic and Nuclear Physics", q:"Briefly explain the elementary particles of nature. Exercises 1. Consider two hydrogen atoms H A and H in ground state. Assume that B hydrogen atom H is at rest and A hydrogen atom H is moving with a B speed and make head-on collide on the stationary hydrogen atom H. After A the strike, both of them move together. What is minimum value of the kinetic energy of the moving hydrogen atom H, such that any one of the hydrogen B atoms reaches one of the excitation state. 2. In the Bohr atom model, the frequency of trn2 m2\uf8f8 Consider the following trns obey sum rule (which is known as Ritz combination principle) 3\u21922 2\u21921 3\u21921 3. (a) A hydrogen atom is excited by radiation of wavelength 97.5 nm. Find the principal quantum number of the excited state. (b) Show that the total number of lines n(n-1) in emission spectrum is and compute the total number of possible lines in emission spectrum. n =4 (b) 6 possible tr 4. Calculate the radius of the earth if the density of the earth is equal to the density of the nucleus.[mass of earth 5.97 1024 \u00d7 kg]. 180m 5. Calculate the mass defect and the binding energy per nucleon of the Ag nucleus. [atomic mass of Ag = 107.905949] 0.990391 and \uf8ee\u2206m= u \uf8f9 20 minutes and 40 minutes respectively. Initially, the samples have equal number of nuclei. Calculate the ratio of decayed numbers of A and B nuclei after 80 minutes. 7. On your birthday, you measure the activity of the sample Bi which has a half-life of 5.01 days. The initial activity that you measure is 1\u00b5Ci. (a) What is the approximate activity of the sample on your next birthday? Calculate (b) the decay constant (c) the mean life (d) initial number of atoms. -22\u00b5Ci 1.6 10\u22126 s\u22121 10 (b) \u00d7 2.31 1010 (c) 7.24days (d) \u00d7 ] 8. Calculate the time required for 60% of a sample of radon undergo decay. Given T of radon =3.8 days 1/2 9. Assuming that energy released by the fission of a single U nucleus is 200MeV, calculate the number of fissions per second required to produce 1 watt power. 3.125 1010 10. Show that the mass of radium ( Ra) with an activity of 1 curie is almost a gram. Given T =1600 years. 1/2 11. Characol pieces of tree is found from an archeological site. The carbon-14 content of this characol is only 17.5% that of equivalent sample of carbon from a living tree. What is the age of tree?", a:""},
      {chapter:"Electronics and Communication", q:"Elucidate the formation of a N-type and P-type semiconductors.", a:""},
      {chapter:"Electronics and Communication", q:"Explain the formation of PN junction diode. Discuss its V\u2013I characteristics.", a:""},
      {chapter:"Electronics and Communication", q:"Draw the circuit diagram of a half wave rectifier and explain its working", a:""},
      {chapter:"Electronics and Communication", q:"Explain the construction and working of a full wave rectifier.", a:""},
      {chapter:"Electronics and Communication", q:"What is an LED?", a:""},
      {chapter:"Electronics and Communication", q:"Write notes on Photodiode.", a:""},
      {chapter:"Electronics and Communication", q:"Explain the working principle of a solar cell. Mention its applications.", a:""},
      {chapter:"Electronics and Communication", q:"Sketch the static characteristics of a common emitter tr", a:""},
      {chapter:"Electronics and Communication", q:"Describe the function of a tr wave form.", a:""},
      {chapter:"Electronics and Communication", q:"State Boolean laws. Elucidate how they are used to simplify Boolean expressions with suitable example.", a:""},
      {chapter:"Electronics and Communication", q:"State and prove De Morgan\u2019s First and Second theorems.", a:""},
      {chapter:"Electronics and Communication", q:"What is modulation?", a:""},
      {chapter:"Electronics and Communication", q:"Elaborate on the basic elements of communication system with the necessary block diagram.", a:""},
      {chapter:"Electronics and Communication", q:"Explain the three modes of propagation of electromagnetic waves through space.", a:""},
      {chapter:"Electronics and Communication", q:"What do you know about GPS?", a:""},
      {chapter:"Electronics and Communication", q:"Give the applications of ICT in mining and agriculture sectors.", a:""},
      {chapter:"Electronics and Communication", q:"Modulation helps to reduce the antenna size in wireless communication \u2013 Explain.", a:""},
      {chapter:"Electronics and Communication", q:"Fiber optic communication is gaining popularity among the various tr", a:""},
      {chapter:"Recent Developments in Physics", q:"Discuss the applications of Nanomaterials in various fields.", a:""},
      {chapter:"Recent Developments in Physics", q:"What are the possible harmful effects of usage of Nanoparticles? Why?", a:""},
      {chapter:"Recent Developments in Physics", q:"Discuss the functions of key components in Robots?", a:""},
      {chapter:"Recent Developments in Physics", q:"Elaborate any two types of Robots with relevant examples.", a:""},
    ],
    numerical: [
      {chapter:"Current Electricity", q:"The following graphs represent the current versus voltage and voltage versus current for the six conductors A,B,C,D,E and F. Which conductor has least resistance and which has maximum resistance?", a:""},
      {chapter:"Current Electricity", q:"10\u20136 m2 A copper wire of area of cross section, carries a current of 2 A. If the number of free electrons per cubic 1028, meter in the wire is 8 \u00d7 calculate the current density and average drift velocity of electrons.", a:""},
      {chapter:"Current Electricity", q:"The resistance of a nichrome wire at 200C is 10 \u03a9. If its temperature coefficient of resistivity of nichrom is 0.004/0C, find the resistance of the wire at boiling point of water. Comment on the result.eases.", a:""},
      {chapter:"Current Electricity", q:"The rod given in the figure is made up of two different materials. 25 cm 70 cm Both have square cross sections of 3 mm side. The resistivity of the first 10\u20133 \u2126m material is 4 \u00d7 and that of second material has resistivity of \u2126m. 5 \u00d7 10\u20133 What is the resistance of rod between its ends?", a:""},
      {chapter:"Current Electricity", q:"An electronics hobbyist is building a radio which requires 150 \u03a9 in her circuit. But she has only 220 \u03a9, 79 \u03a9 and 92 \u03a9 resistors available. How can she connect the available resistors to get the desired value of resistance?", a:""},
      {chapter:"Current Electricity", q:"A cell supplies a current of 0.9 A through a 2 \u03a9 resistor and a current of 0.3 A through a 7 \u03a9 resistor. Calculate the internal resistance of the cell.", a:""},
      {chapter:"Current Electricity", q:"Calculate the currents in the following circuit.", a:""},
      {chapter:"Current Electricity", q:"A potentiometer wire has a length of 4 m and resistance of 20 \u03a9. It is connected in series with resistance of 2980 \u03a9 and a cell of emf 4 V. Calculate the potential gradient along the wire.", a:""},
      {chapter:"Current Electricity", q:"Two cells each of 5V are connected in series with a 8 \u03a9 resistor and three parallel resistors of 4 \u03a9, 6 \u03a9 and 12 \u03a9. Draw a circuit diagram for the above arrangement. Calculate i) the current drawn from the cells (ii) current through each resistor Current through 8 \u2126 = 1A ii) The current through 4 \u2126,, I= =0.5A the current through 6 \u2126, 2, I= =0.33A the current through 12 \u2126, I= =0.", a:""},
      {chapter:"Current Electricity", q:"In a potentiometer arrangement, a cell of emf 1.25 V gives a balance point at 35 cm length of the wire. If the cell is replaced by another cell and the balance point shifts to 63 cm, what is the emf of the second cell?y publishers, Fourth edition. Engineers with Modern Physics\u201d, Freeman and Cambridge university press, third edition Engineers with Modern Physics\u201d, Brook/Coole problems in School Physics\u201d, Mir Publishers. Bharthi Bhawan publishers. Princeton University press.", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"A bar magnet having a magnetic \uf072 p moment is cut into four pieces i.e., m first cut into two pieces along the axis of the magnet and each piece is further cut along the axis into two pieces. Compute the magnetic moment of each piece.", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"A conductor of linear mass density m\u20131 0.2 g suspended by two flexible wire as shown in figure. Suppose the tension in the supporting wires is zero when it is kept inside the magnetic field of 1 T whose direction is into the page. Compute the current inside the conductor and also the direction of the current. Assume g = 10 m s\u20132 B in", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"A circular coil with cross-sectional area 0.1 cm2 is kept in a uniform magnetic field of strength 0.2 T. If the current passing in the coil is 3 A and the plane of the loop is perpendicular to the direction of magnetic field, calculate (a) total torque on the coil (b) total force on the coil (c) average force on each electron in the coil due to the magnetic field. (The free electron density for the material of the wire is 10^28 m-3).", a:""},
      {chapter:"Magnetism and Magnetic Effects of Electric Current", q:"A bar magnet is placed in a uniform magnetic field whose strength is 0.8 T. If the bar magnet is oriented at an angle 30o with the external field experiences a torque of 0.2 Nm. Calculate: (i) the magnetic moment of the magnet (ii) the work done by the applied force in moving it from most stable configuration to the most unstable configuration and also compute the work done by the applied magnetic field in this case. 0.5 A m2 (ii) W = 0.8 J and W = -0.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"A square coil of side 30 cm with 500 turns is kept in a uniform magnetic field of 0.4 T. The plane of the coil is 30o inclined at an angle of to the field. Calculate the magnetic flux through the coil.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"A straight metal wire crosses a magnetic field of flux 4 mWb in a time 0.4 s. Find the magnitude of the emf induced in the wire.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"The magnetic flux passing through a coil perpendicular to its plane is a function of time and is given by (2 3 4 2 8 8) Wb \u03a6 = t + t + t+. If the B resistance of the coil is 5 \u03a9, determine the induced current through the coil at a time t = 3 second.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"A closely wound circular coil of radius 0.02 m is placed perpendicular to the magnetic field. When the magnetic field is changed from 8000 T to 2000 T in 6 s, an emf of 44 V is induced in it. Calculate the number of turns in the coil. (Take \u03c0= ) IkNsD.kUaClvTisIoOlaNi.AcoNmD ALTERNATING CURRENT 261", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"A rectangular coil of area 6 cm2 having 3500 turns is kept in a uniform magnetic field of 0.4 T. Initially, the plane of the coil is perpendicular to the field and is 180o. then rotated through an angle of If the resistance of the coil is 35 \u2126, find the amount of charge flowing through the coil.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"An induced current of 2.5 mA flows through a single conductor of resistance 100 \u2126. Find out the rate at which the magnetic flux is cut by the conductor.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"A fan of metal blades of length 0.4 m rotates normal to a magnetic field of 4 10\u22123T \u00d7. If the induced emf between the centre and edge of the blade is 0.02 V, determine the rate of rotation of the blade.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"A bicycle wheel with metal spokes of 1 m long rotates in Earth\u2019s magnetic field. The plane of the wheel is perpendicular to the horizontal 4 10\u22125T. component of Earth\u2019s field of \u00d7 If the emf induced across the spokes is 31.4 mV, calculate the rate of revolution of the wheel.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Determine the self-inductance of 4000 turn air-core solenoid of length 2m and diameter 0.04 m.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"A coil of 200 turns carries a current of 4 A. If the magnetic flux through the coil is 6 \u00d7 10\u20135 Wb, find the magnetic energy stored in the medium surrounding the coil. 262 Unit 4 ELECTROMAGNETwICw wIN.bDoUoCkTs.IkOaNlv 1122tthh..", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"A 50 cm long solenoid has 400 turns per cm. The diameter of the solenoid is 0.04 m. Find the magnetic flux linked with each turn when it carries a current of 1 A.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"A coil of 200 turns carries a current of 0.4 A. If the magnetic flux of 4 mWb is linked with each turn of the coil, find the inductance of the coil.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Two air core solenoids have the same length of 80 cm and same cross\u2013sectional area 5 cm2. Find the mutual inductance between them if the number of turns in the first coil is 1200 turns and that in the second coil is 400 turns.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"A long solenoid having 400 turns per cm carries a current 2A. A 100 turn coil cm2 of cross-sectional area 4 is placed co-axially inside the solenoid so that the coil is in the field produced by the solenoid. Find the emf induced in the coil if the current through the solenoid reverses its direction in 0.04 sec.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"A 200 turn circular coil of radius 2 cm is placed co-axially within a long solenoid of 3 cm radius. If the turn density of the solenoid is 90 turns per cm, then calculate mutual inductance of the coil and the solenoid.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"The solenoids S1 and S2 are wound on an iron-core of relative permeability 900. The areas of their cross-section and their lengths are the same, and are 4 cm2 and 0.04 m respectively. If the number of turns in S1 is 200 and that in S2 is 800, calculate the mutual inductance between the solenoids. If the current in solenoid 1 is increased from 2A to 8A in 0.04 second, calculate the induced emf in solenoid 2.", a:""},
      {chapter:"Electromagnetic Induction and Alternating Current", q:"Calculate the instantaneous value at 60o, average value and RMS value of an alternating current whose peak value is 20 A.", a:""},
      {chapter:"Electromagnetic Waves", q:"Consider a parallel plate capacitor whose plates are closely spaced. Let R be the radius of the plates and the current in the wire connected to the plates is 5 A, calculate the displacement current through the surface passing between the plates by directly calculating the rate of change of flux of electric field through the surface.", a:""},
      {chapter:"Ray Optics", q:"An object is placed at a certain distance from a convex lens of focal length 20 cm. Find the distance of the object if the image obtained is magnified 4 times.", a:""},
      {chapter:"Ray Optics", q:"A compound microscope has a magnification of 30. The focal length of eye piece is 5 cm. Assuming the final image to be at least distance of distinct vision, find the magnification produced by the objective.", a:""},
      {chapter:"Ray Optics", q:"An object is placed in front of a concave mirror of focal length 20 cm. The image formed is three times the size of the object. Calculate two possible distances of the object from the mirror.", a:""},
      {chapter:"Ray Optics", q:"A small bulb is placed at the bottom of a tank containing water to a depth of 80 cm.What is the area of the surface of water through which light from the bulb can emerge out?", a:""},
      {chapter:"Ray Optics", q:"A thin converging glass lens made of glass with refractive index 1.5 has a power of + 5.0 D. When this lens is immersed in a liquid of refractive index n, it acts as a divergent lens of focal length 100 cm. What must be the value of n?", a:""},
      {chapter:"Ray Optics", q:"If the distance D between an object and screen is greater than 4 times the focal length of a convex lens, then there are two positions of the lens for which images are formed on the screen. This method is called conjugate foci method. If d is the distance between the two positions of the lens, obtain the equation for focal length of the convex lens.", a:""},
      {chapter:"Wave Optics", q:"A beam of light of wavelength 600 nm from a distant source falls on a single slit 1 mm wide and the resulting diffraction pattern is observed on a screen 2 m away. What is the distance between the first dark fringe on either side of the central bright fringe?", a:""},
      {chapter:"Wave Optics", q:"In Young\u2019s double slit experiment, the slits are 2 mm apart and are illuminated with a mixture of two = = wavelength \u03bb 750 nm and \u03bb 900 nm. What is the minimum distance from the common central bright fringe on a screen 2 m from the slits where a bright fringe from one interference pattern coincides with a bright fringe from the other?", a:""},
      {chapter:"Wave Optics", q:"In Young\u2019s double slit experiment, 62 fringes are seen in visible region for sodium light of wavelength 5893 \u00c5. If violet light of wavelength 4359 \u00c5 is used in place of sodium light, then what is the number of fringes seen?", a:""},
      {chapter:"Electronics and Communication", q:"The given circuit has two ideal diodes connected as shown in figure below. Calculate the current flowing through the resistance R 2 \u2126 R1 D D 1 2 10 V 3 \u2126 R3 2 \u2126 R2", a:""},
      {chapter:"Electronics and Communication", q:"Four silicon diodes and a 10 \u03a9 resistor are connected as shown in figure below. Each diode has a resistance of 1\u03a9. Find the current flows through the 18\u03a9 resistor.", a:""},
    ]
  },
maths: {
    2: [
      {chapter:"Applications of Matrices and Determinants", q:"Define the adjoint of a square matrix.", a:""},
      {chapter:"Applications of Matrices and Determinants", q:"State the condition for a square matrix to be invertible.", a:""},
      {chapter:"Applications of Matrices and Determinants", q:"Define the rank of a matrix.", a:""},
      {chapter:"Applications of Matrices and Determinants", q:"What is meant by a consistent system of linear equations?", a:""},
      {chapter:"Applications of Matrices and Determinants", q:"State Cramer's rule for solving a system of two linear equations in two unknowns.", a:""},
      {chapter:"Applications of Matrices and Determinants", q:"Define an elementary row transformation of a matrix.", a:""},
      {chapter:"Applications of Matrices and Determinants", q:"Find the adjoint of the matrix [[2, 3], [−1, 4]].", a:""},
      {chapter:"Applications of Matrices and Determinants", q:"If A is a 3×3 matrix, write the relation connecting A, adj A and |A|.", a:""},
      {chapter:"Complex Numbers", q:"Define the modulus and argument of a complex number.", a:""},
      {chapter:"Complex Numbers", q:"State the triangle inequality for complex numbers.", a:""},
      {chapter:"Complex Numbers", q:"Find the conjugate of the complex number 3 − 4i.", a:""},
      {chapter:"Complex Numbers", q:"Simplify i¹⁹⁴⁸ − i¹²⁴⁹.", a:""},
      {chapter:"Complex Numbers", q:"Define a complex conjugate root theorem for a polynomial with real coefficients.", a:""},
      {chapter:"Complex Numbers", q:"Write the polar form of a complex number z = x + iy.", a:""},
      {chapter:"Complex Numbers", q:"State De Moivre's theorem.", a:""},
      {chapter:"Complex Numbers", q:"Find the square root of the complex number 5 + 12i in a + ib form (state the method used).", a:""},
      {chapter:"Theory of Equations", q:"State the fundamental theorem of algebra.", a:""},
      {chapter:"Theory of Equations", q:"Write the relation between the roots and coefficients of a cubic equation.", a:""},
      {chapter:"Theory of Equations", q:"State Descartes' rule of signs.", a:""},
      {chapter:"Theory of Equations", q:"Construct a cubic equation whose roots are 1, 2, and 3.", a:""},
      {chapter:"Theory of Equations", q:"Define a reciprocal equation.", a:""},
      {chapter:"Theory of Equations", q:"If α, β are the roots of x² − 3x + 5 = 0, find the value of α² + β².", a:""},
      {chapter:"Theory of Equations", q:"State the rational root theorem.", a:""},
      {chapter:"Inverse Trigonometric Functions", q:"Find the principal value of sin⁻¹(1/√2).", a:""},
      {chapter:"Inverse Trigonometric Functions", q:"Write the domain and range of tan⁻¹x.", a:""},
      {chapter:"Inverse Trigonometric Functions", q:"State the relation between sin⁻¹x and cos⁻¹x for x ∈ [−1, 1].", a:""},
      {chapter:"Inverse Trigonometric Functions", q:"Find the value of cos⁻¹(cos(7π/6)).", a:""},
      {chapter:"Inverse Trigonometric Functions", q:"Write the formula for tan⁻¹x + tan⁻¹y.", a:""},
      {chapter:"Inverse Trigonometric Functions", q:"Find the principal value of cosec⁻¹(−1).", a:""},
      {chapter:"Two Dimensional Analytical Geometry-II", q:"Identify the type of conic represented by 2x² − y² = 7.", a:""},
      {chapter:"Two Dimensional Analytical Geometry-II", q:"Define the eccentricity of a conic section.", a:""},
      {chapter:"Two Dimensional Analytical Geometry-II", q:"Find the centre and radius of the circle x² + y² − 6x + 4y − 12 = 0.", a:""},
      {chapter:"Two Dimensional Analytical Geometry-II", q:"Write the equation of the directrix of the parabola y² = 4ax.", a:""},
      {chapter:"Two Dimensional Analytical Geometry-II", q:"State the condition for the line y = mx + c to be a tangent to the circle x² + y² = a².", a:""},
      {chapter:"Two Dimensional Analytical Geometry-II", q:"Define asymptotes of a hyperbola.", a:""},
      {chapter:"Applications of Vector Algebra", q:"Define the scalar triple product of three vectors and state what it represents geometrically.", a:""},
      {chapter:"Applications of Vector Algebra", q:"If a = 2i + j − k and b = i − j + 2k, find a × b.", a:""},
      {chapter:"Applications of Vector Algebra", q:"State the condition for two vectors to be perpendicular.", a:""},
      {chapter:"Applications of Vector Algebra", q:"Find the angle between the vectors a = i + j and b = j + k.", a:""},
      {chapter:"Applications of Vector Algebra", q:"Define the vector equation of a plane in normal form.", a:""},
      {chapter:"Applications of Vector Algebra", q:"State the condition for three vectors to be coplanar.", a:""},
      {chapter:"Applications of Differential Calculus", q:"State Rolle's theorem.", a:""},
      {chapter:"Applications of Differential Calculus", q:"State Lagrange's Mean Value Theorem.", a:""},
      {chapter:"Applications of Differential Calculus", q:"A particle moves so that s = 2t² + 3t. Find its instantaneous velocity at t = 3 seconds.", a:""},
      {chapter:"Applications of Differential Calculus", q:"Define a critical point of a function.", a:""},
      {chapter:"Applications of Differential Calculus", q:"State the second derivative test for local maxima and minima.", a:""},
      {chapter:"Differentials and Partial Derivatives", q:"Define the differential dy of a function y = f(x).", a:""},
      {chapter:"Differentials and Partial Derivatives", q:"Use linear approximation to find an approximate value of √26.", a:""},
      {chapter:"Differentials and Partial Derivatives", q:"Define a partial derivative of a function of two variables.", a:""},
      {chapter:"Differentials and Partial Derivatives", q:"State Clairaut's theorem on mixed partial derivatives.", a:""},
      {chapter:"Differentials and Partial Derivatives", q:"Define the relative error and percentage error of a measured quantity.", a:""},
      {chapter:"Applications of Integration", q:"State Bernoulli's formula for integration by parts.", a:""},
      {chapter:"Applications of Integration", q:"Write the formula for the area under a curve y = f(x) between x = a and x = b.", a:""},
      {chapter:"Applications of Integration", q:"Evaluate: ∫₀^(π/2) cos²x dx.", a:""},
      {chapter:"Applications of Integration", q:"Write the formula for the volume of the solid formed by revolving a curve about the x-axis.", a:""},
      {chapter:"Ordinary Differential Equations", q:"Define the order and degree of a differential equation.", a:""},
      {chapter:"Ordinary Differential Equations", q:"Find the order and degree of (d²y/dx²)³ + dy/dx = x, if they exist.", a:""},
      {chapter:"Ordinary Differential Equations", q:"Define a homogeneous differential equation.", a:""},
      {chapter:"Ordinary Differential Equations", q:"Form the differential equation by eliminating the arbitrary constant from y = mx.", a:""},
      {chapter:"Ordinary Differential Equations", q:"Write the standard form of a first order linear differential equation.", a:""},
      {chapter:"Probability Distributions", q:"Define a discrete random variable.", a:""},
      {chapter:"Probability Distributions", q:"State the two conditions a probability mass function must satisfy.", a:""},
      {chapter:"Probability Distributions", q:"Define the mean and variance of a discrete random variable.", a:""},
      {chapter:"Probability Distributions", q:"The pdf of a random variable X is f(x) = kx, 0 < x < 4. Find the value of k.", a:""},
      {chapter:"Probability Distributions", q:"Define the cumulative distribution function of a random variable.", a:""},
      {chapter:"Discrete Mathematics", q:"Define a binary operation on a non-empty set.", a:""},
      {chapter:"Discrete Mathematics", q:"Define a tautology and a contradiction in logic.", a:""},
      {chapter:"Discrete Mathematics", q:"State the associative and commutative properties of a binary operation.", a:""},
      {chapter:"Discrete Mathematics", q:"Construct the truth table for p ∧ q.", a:""},
      {chapter:"Discrete Mathematics", q:"Define the identity element of a binary operation.", a:""},
    ],
    3: [
      {chapter:"Applications of Matrices and Determinants", q:"Find the inverse of the matrix A = [[2, −1], [1, 3]], using the adjoint method.", a:""},
      {chapter:"Applications of Matrices and Determinants", q:"Explain the procedure to solve a system of linear equations using the matrix inversion method.", a:""},
      {chapter:"Applications of Matrices and Determinants", q:"If A = [[cos α, 0, sin α], [0, 1, 0], [−sin α, 0, cos α]], show that [A]⁻¹ = A(−α).", a:""},
      {chapter:"Applications of Matrices and Determinants", q:"Test the consistency of the system of equations x + y = 1, 2x + 2y = 2, and solve if consistent.", a:""},
      {chapter:"Applications of Matrices and Determinants", q:"Explain how the rank of a matrix is used to determine whether a system of linear equations has a unique solution, no solution, or infinitely many solutions.", a:""},
      {chapter:"Applications of Matrices and Determinants", q:"Find the rank of the matrix [[1, 2, −1], [2, 4, 1], [3, 6, 3]].", a:""},
      {chapter:"Complex Numbers", q:"If z₁ = 2 − i and z₂ = −4 + 3i, find the additive and multiplicative inverse of z₁ and z₂.", a:""},
      {chapter:"Complex Numbers", q:"Show that the four consecutive powers of i (iⁿ, iⁿ⁺¹, iⁿ⁺², iⁿ⁺³) always sum to zero, for any integer n.", a:""},
      {chapter:"Complex Numbers", q:"Find the modulus and principal argument of the complex number −1 − i√3.", a:""},
      {chapter:"Complex Numbers", q:"Simplify (cos 2θ + i sin 2θ)⁵ / (cos 3θ − i sin 3θ)⁴ using De Moivre's theorem.", a:""},
      {chapter:"Complex Numbers", q:"If z = 3 + 4i, verify that z · z̄ = |z|².", a:""},
      {chapter:"Theory of Equations", q:"Solve the equation x⁴ − 9x² + 20 = 0.", a:""},
      {chapter:"Theory of Equations", q:"Find a polynomial equation of minimum degree with rational coefficients, having 2 − √3 as a root.", a:""},
      {chapter:"Theory of Equations", q:"Discuss the nature of the roots of the equation x³ − 5x² + 8x − 4 = 0, given that 2 is a root.", a:""},
      {chapter:"Theory of Equations", q:"If α, β, γ are the roots of x³ + px² + qx + r = 0, express α² + β² + γ² in terms of p and q.", a:""},
      {chapter:"Inverse Trigonometric Functions", q:"Prove that tan⁻¹(1/2) + tan⁻¹(1/3) = π/4.", a:""},
      {chapter:"Inverse Trigonometric Functions", q:"Solve: sin⁻¹x + sin⁻¹(2x) = π/3.", a:""},
      {chapter:"Inverse Trigonometric Functions", q:"Find the value of sin(cos⁻¹(3/5) + tan⁻¹(1/4)).", a:""},
      {chapter:"Inverse Trigonometric Functions", q:"Prove that 2 tan⁻¹x = sin⁻¹(2x / (1 + x²)), for |x| ≤ 1.", a:""},
      {chapter:"Two Dimensional Analytical Geometry-II", q:"Find the equation of the circle passing through the points (1, 0), (−1, 0) and (0, 1).", a:""},
      {chapter:"Two Dimensional Analytical Geometry-II", q:"Find the vertex, focus, and directrix of the parabola y² = 8x.", a:""},
      {chapter:"Two Dimensional Analytical Geometry-II", q:"Find the equation of the ellipse whose foci are (±2, 0) and eccentricity 1/2.", a:""},
      {chapter:"Two Dimensional Analytical Geometry-II", q:"Find the equation of the tangent to the circle x² + y² − 6x + 6y − 8 = 0 at the point (2, 2).", a:""},
      {chapter:"Applications of Vector Algebra", q:"If a = i − 2j + 3k, b = 2i + j − 2k, c = 3i + 2j + k, verify that (a × b) × c ≠ a × (b × c).", a:""},
      {chapter:"Applications of Vector Algebra", q:"Find the volume of the parallelepiped with coterminous edges a = 2i − 3j + 4k, b = i + 2j − k, c = 3i − j + 2k.", a:""},
      {chapter:"Applications of Vector Algebra", q:"Find the shortest distance between two skew lines given in vector form.", a:""},
      {chapter:"Applications of Vector Algebra", q:"Find the vector and cartesian equations of the plane passing through the point (1, 2, 3) and perpendicular to the vector 2i + 3j − k.", a:""},
      {chapter:"Applications of Differential Calculus", q:"Verify Rolle's theorem for f(x) = x² − x on the interval [0, 1].", a:""},
      {chapter:"Applications of Differential Calculus", q:"Verify Lagrange's Mean Value Theorem for f(x) = x² − 3x + 2 on the interval [−2, 2].", a:""},
      {chapter:"Applications of Differential Calculus", q:"Find the intervals of monotonicity for the function f(x) = 2x³ − 3x² − 12x + 5.", a:""},
      {chapter:"Applications of Differential Calculus", q:"Find the local maximum and local minimum values of f(x) = x³ − 3x.", a:""},
      {chapter:"Differentials and Partial Derivatives", q:"The radius of a circular plate is measured as 12.65 cm instead of its actual length 12.5 cm. Find the percentage error in calculating the area of the plate.", a:""},
      {chapter:"Differentials and Partial Derivatives", q:"If u = x² + y², find ∂u/∂x and ∂u/∂y.", a:""},
      {chapter:"Differentials and Partial Derivatives", q:"Verify Clairaut's theorem for u = x³y² + x²y³.", a:""},
      {chapter:"Applications of Integration", q:"Evaluate: ∫₀^1 x tan⁻¹x dx.", a:""},
      {chapter:"Applications of Integration", q:"Find the area bounded by the curve y = x² and the line y = 4.", a:""},
      {chapter:"Applications of Integration", q:"Evaluate: ∫ x² e^x dx using Bernoulli's formula.", a:""},
      {chapter:"Ordinary Differential Equations", q:"Find the differential equation of the family of curves y = A cos 3x + B sin 3x, where A and B are arbitrary constants.", a:""},
      {chapter:"Ordinary Differential Equations", q:"Solve the differential equation dy/dx = (x + y)/x, using the substitution y = vx.", a:""},
      {chapter:"Ordinary Differential Equations", q:"Solve: dy + (xy − cos x) dx = 0, given it can be rewritten as a first-order linear equation.", a:""},
      {chapter:"Probability Distributions", q:"Three fair coins are tossed once simultaneously. If X denotes the number of tails that occur, find the probability distribution of X.", a:""},
      {chapter:"Probability Distributions", q:"The pdf of a random variable X is f(x) = kx, 0 < x < 4. Find k and P(1 < X < 2).", a:""},
      {chapter:"Probability Distributions", q:"Find the mean of the discrete random variable whose probability distribution is X = 0, 1, 2 with P(X) = 0.3, 0.4, 0.3 respectively.", a:""},
      {chapter:"Discrete Mathematics", q:"Determine whether * is a binary operation on the given sets: (i) a * b = a√b on R, (ii) a * b = min(a, b) on A = {1, 2, 3, 4, 5}.", a:""},
      {chapter:"Discrete Mathematics", q:"Construct the truth table for (p ∧ q) → q.", a:""},
      {chapter:"Discrete Mathematics", q:"Verify whether the set of all 2×2 real matrices forms a group under matrix addition.", a:""},
    ],
    5: [
      {chapter:"Applications of Matrices and Determinants", q:"Solve the following system of linear equations using Cramer's rule: 3x + 3y − z = 11, 2x − y + 2z = 9, 4x + 3y + 2z = 25.", a:""},
      {chapter:"Applications of Matrices and Determinants", q:"If A = [[3, 1], [−1, 2]], show that A² − 5A + 7I₂ = O, where I₂ is the identity matrix and O is the zero matrix. Hence find A⁻¹.", a:""},
      {chapter:"Applications of Matrices and Determinants", q:"A boy is walking from his house at a speed of 2 km/hr along a fixed direction. Formulate the problem as a system of linear equations and solve it using matrices (as given in the textbook example).", a:""},
      {chapter:"Applications of Matrices and Determinants", q:"Solve the system of equations x + y + z = 6, 2x + 3y + 4z = 20, x + 2y + 3z = 14, by finding the inverse of the coefficient matrix.", a:""},
      {chapter:"Complex Numbers", q:"If z₁ = 2 − i and z₂ = −4 + 3i, find the inverse of z₁z₂ and of z₁/z₂.", a:""},
      {chapter:"Complex Numbers", q:"Solve the equation z² + 2 = 0 in the set of complex numbers and represent the solutions in the Argand plane.", a:""},
      {chapter:"Complex Numbers", q:"Using De Moivre's theorem, find all the cube roots of unity and show that their sum is zero.", a:""},
      {chapter:"Theory of Equations", q:"Solve the cubic equation 9x³ − 36x² + 44x − 16 = 0, given that the roots form an arithmetic progression.", a:""},
      {chapter:"Theory of Equations", q:"If α, β, γ are the roots of x³ + 2x² + 3x + 4 = 0, form a cubic equation whose roots are 2α, 2β, 2γ.", a:""},
      {chapter:"Theory of Equations", q:"Solve the equation 6x⁴ − 35x³ + 62x² − 35x + 6 = 0, given that it is a reciprocal equation.", a:""},
      {chapter:"Inverse Trigonometric Functions", q:"Solve: tan⁻¹(x − 1)/(x − 2) + tan⁻¹(x + 1)/(x + 2) = π/4.", a:""},
      {chapter:"Inverse Trigonometric Functions", q:"If cos⁻¹x + cos⁻¹y + cos⁻¹z = π, prove that x² + y² + z² + 2xyz = 1.", a:""},
      {chapter:"Two Dimensional Analytical Geometry-II", q:"Find the equation of the tangent and normal to the parabola y² = 8x at the point (2, 4).", a:""},
      {chapter:"Two Dimensional Analytical Geometry-II", q:"Find the equation of the hyperbola whose foci are (±5, 0) and the transverse axis is of length 8.", a:""},
      {chapter:"Two Dimensional Analytical Geometry-II", q:"Prove that the tangents drawn at the ends of any focal chord of a parabola meet at right angles on the directrix.", a:""},
      {chapter:"Applications of Vector Algebra", q:"A particle acted on by constant forces 8i + 2j − 6k and 6i + 2j − 2k is displaced from the point (1, 2, 3) to the point (5, 4, 1). Find the total work done by the forces.", a:""},
      {chapter:"Applications of Vector Algebra", q:"Find the shortest distance between the lines r = (i + 2j + k) + s(i − j + k) and r = (2i − j − k) + t(2i + j + 2k).", a:""},
      {chapter:"Applications of Vector Algebra", q:"Find the vector and cartesian equations of the plane passing through the points (1, 1, 0), (1, 2, 1), and (−2, 2, −1).", a:""},
      {chapter:"Applications of Differential Calculus", q:"A wire of length 28 m is to be cut into two pieces. One piece is to be made into a square and the other into a circle. Find the length of each piece so that the combined area of the square and the circle is minimum.", a:""},
      {chapter:"Applications of Differential Calculus", q:"Find the equations of the tangent and normal to the curve y = x³ + 2x² − x − 2 at the point where x = 1, and find the angle at which the curve crosses the x-axis.", a:""},
      {chapter:"Differentials and Partial Derivatives", q:"If u = x³ + y³ + z³ − 3xyz, show that x(∂u/∂x) + y(∂u/∂y) + z(∂u/∂z) = 3u.", a:""},
      {chapter:"Applications of Integration", q:"Evaluate: ∫₀^π x sin x dx, using Bernoulli's formula for integration by parts.", a:""},
      {chapter:"Applications of Integration", q:"Find the area of the region bounded by the parabola y² = 4x and the line x = 3.", a:""},
      {chapter:"Applications of Integration", q:"Find the volume of the solid generated when the region bounded by y = x², x = 0 and y = 4 is revolved about the y-axis.", a:""},
      {chapter:"Ordinary Differential Equations", q:"Solve the differential equation dy/dx = (3x + y + 4)⁵, by using a suitable substitution.", a:""},
      {chapter:"Ordinary Differential Equations", q:"Solve the linear differential equation dy/dx + y tan x = cos x.", a:""},
      {chapter:"Ordinary Differential Equations", q:"A radioactive substance decays at a rate proportional to the amount present. Given that the amount decreases from 20 g to 10 g in 4 hours, find the amount remaining after 8 hours.", a:""},
      {chapter:"Probability Distributions", q:"The probability density function of a continuous random variable X is f(x) = ke⁻³ˣ for x > 0, and 0 otherwise. Find (i) the value of k, (ii) the distribution function F(x), and (iii) P(X < 3).", a:""},
      {chapter:"Probability Distributions", q:"An urn contains 5 mangoes and 4 apples. Three fruits are taken at random. If X denotes the number of apples drawn, find the probability distribution of X, its mean, and variance.", a:""},
      {chapter:"Probability Distributions", q:"A random variable X has the following probability mass function: X = 1, 2, 3, 4, 5, 6 with probabilities k, 2k, 3k, 4k, 5k, 6k respectively. Find k, and hence find P(X ≤ 4) and the mean of X.", a:""},
      {chapter:"Discrete Mathematics", q:"Let A = {1, 2, 3, 4, 5} and let * be defined by a * b = min(a, b). Verify whether (A, *) is a semigroup, and if it is a monoid, find its identity element.", a:""},
      {chapter:"Discrete Mathematics", q:"Construct the truth table for (p → q) ∧ (q → p) and determine whether it is a tautology, contradiction, or contingency.", a:""},
      {chapter:"Discrete Mathematics", q:"Show that the relation 'is a factor of' on the set of natural numbers is a partial order relation, and draw its Hasse diagram for the set {1, 2, 3, 6, 12}.", a:""},
    ],
  },
};
  // maths, physics, chemistry, ca, biology, commerce, economics: add the
  // same { 2:[], 3:[], 5:[] } shape here once you send that subject's
  // question bank text.

/* Fixed section pattern per paper total. Proposed defaults for 30/50 —
   confirm or replace these counts once you tell me the real numbers. */
/* 70-mark pattern verified against real TN board / Samacheer Kalvi model
   papers: Part I = Q1–15 (1 mark, all compulsory). Part II = Q16–24 (9
   shown, 2 marks each, answer any 6 — one of the 9 is always marked
   compulsory). Part III = Q25–33 (9 shown, 3 marks each, answer any 6,
   one compulsory). Part IV = Q34–38 (5 questions, 5 marks each, each
   with an internal either/or choice, all compulsory). 15+12+18+25=70.
   30/50 are not official sizes — proportionally scaled the same way. */
const PAPER_PATTERNS = {
  70: { part1:{marks:1, count:15},               part2:{marks:2, shown:9, chooseAny:6},  part3:{marks:3, shown:9, chooseAny:6},  part4:{marks:5, pairs:5} },
  50: { part1:{marks:1, count:10},               part2:{marks:2, shown:8, chooseAny:5},  part3:{marks:3, shown:7, chooseAny:5},  part4:{marks:5, pairs:3} },
  30: { part1:{marks:1, count:5},                part2:{marks:2, shown:5, chooseAny:3},  part3:{marks:3, shown:5, chooseAny:3},  part4:{marks:5, pairs:2} }
};



/* ================= 10th STANDARD — SOCIAL SCIENCE (Full set from Padasalai / Cheddilal Govt HS One-Mark PDF)
   Types: mcq | fill | match | caption
   Source: 10th Social One Mark Questions English Medium
*/
const SS_HISTORY = [
  // UNIT 1 MCQ
  {type:'mcq',q:"What were the three major empires shattered by the end of First World War?",options:["Germany, Austria-Hungary and the Ottomans","Germany, Austria-Hungary and Russia","Spain, Portugal and Italy","Germany, Austria-Hungary, Italy"],correct:0,exp:"The three major empires shattered were Germany, Austria-Hungary and the Ottomans."},
  {type:'mcq',q:"Where did the Ethiopian army defeat the Italian army?",options:["Delville","Orange State","Adowa","Algiers"],correct:2,exp:"The Ethiopian army defeated the Italian army at Adowa."},
  {type:'mcq',q:"Which country emerged as the strongest in Asia towards the close of nineteenth century?",options:["China","Japan","Korea","Mongolia"],correct:1,exp:"Japan emerged as the strongest in Asia towards the close of the nineteenth century."},
  {type:'mcq',q:"Who said \"imperialism is the highest stage of capitalism\"?",options:["Lenin","Marx","Sun Yat-sen","Mao Tsetung"],correct:0,exp:"Lenin said that imperialism is the highest stage of capitalism."},
  {type:'mcq',q:"What is the Battle of Marne remembered for?",options:["Air Warfare","Trench Warfare","Submarine Warfare","Ship Warfare"],correct:1,exp:"The Battle of Marne is remembered for Trench Warfare."},
  {type:'mcq',q:"Which country after the World War I took to policy of Isolation?",options:["Britain","France","Germany","USA"],correct:3,exp:"USA took to the policy of Isolation after World War I."},
  {type:'mcq',q:"To which country the first Secretary General of League of Nations belonged?",options:["Britain","France","Dutch","USA"],correct:0,exp:"The first Secretary General of the League of Nations belonged to Britain."},
  {type:'mcq',q:"Which country was expelled from the League of Nations for attacking Finland?",options:["Germany","Russia","Italy","France"],correct:1,exp:"Russia was expelled from the League of Nations for attacking Finland."},
  // UNIT 2 MCQ
  {type:'mcq',q:"With whom of the following was the Lateran Treaty signed by Italy?",options:["Germany","Russia","Pope","Spain"],correct:2,exp:"Italy signed the Lateran Treaty with the Pope."},
  {type:'mcq',q:"With whose conquest the Mexican civilization collapsed?",options:["Hernan Cortes","Francisco Pizarro","Toussaint Louverture","Pedro I"],correct:0,exp:"Mexican civilization collapsed with the conquest of Hernan Cortes."},
  {type:'mcq',q:"Who made Peru as part of their dominions?",options:["English","Spaniards","Russians","French"],correct:1,exp:"Spaniards made Peru part of their dominions."},
  {type:'mcq',q:"Which President of the USA pursued \"Good Neighbour\" policy towards Latin America?",options:["Roosevelt","Truman","Woodrow Wilson","Eisenhower"],correct:0,exp:"Roosevelt pursued the Good Neighbour policy towards Latin America."},
  {type:'mcq',q:"Which part of the World disliked dollar Imperialism?",options:["Europe","Latin America","India","China"],correct:1,exp:"Latin America disliked dollar Imperialism."},
  {type:'mcq',q:"Who was the brain behind the apartheid policy in South Africa?",options:["Verwoerd","Smut","Herzog","Botha"],correct:0,exp:"Verwoerd was the brain behind the apartheid policy in South Africa."},
  {type:'mcq',q:"Which quickened the process of liberation in Latin America?",options:["Support of US","Napoleonic Invasion","Simon Bolivar's involvement","French Revolution"],correct:1,exp:"Napoleonic Invasion quickened the process of liberation in Latin America."},
  {type:'mcq',q:"Name the President who made amendment to Munro doctrine to justify American intervention in the affairs of Latin America.",options:["Theodore Roosevelt","Truman","Eisenhower","Woodrow Wilson"],correct:0,exp:"Theodore Roosevelt made the amendment to the Monroe doctrine."},
  // UNIT 3 MCQ
  {type:'mcq',q:"When did the Japanese formally sign of their surrender?",options:["2 September, 1945","2 October, 1945","12 September, 1945","12 October, 1945"],correct:0,exp:"Japan formally signed the surrender on 2 September 1945."},
  {type:'mcq',q:"Who initiated the formation of League of Nations?",options:["Roosevelt","Chamberlain","Woodrow Wilson","Baldwin"],correct:2,exp:"Woodrow Wilson initiated the formation of the League of Nations."},
  {type:'mcq',q:"Where was the Japanese Navy defeated by the US Navy?",options:["Battle of Guadalcanal","Battle of Midway","Battle of Leningrad","Battle of El Alamein"],correct:1,exp:"The Japanese Navy was defeated by the US Navy at the Battle of Midway."},
  {type:'mcq',q:"Where did the US drop its first Atomic Bomb?",options:["Kavashaki","Innoshima","Hiroshima","Nagasaki"],correct:2,exp:"The US dropped its first Atomic Bomb on Hiroshima."},
  {type:'mcq',q:"Who were mainly persecuted by Hitler?",options:["Russians","Arabs","Turks","Jews"],correct:3,exp:"Jews were mainly persecuted by Hitler."},
  {type:'mcq',q:"Which Prime Minister of England signed the Munich Pact with Germany?",options:["Chamberlain","Winston Churchill","Lloyd George","Stanley Baldwin"],correct:0,exp:"Chamberlain signed the Munich Pact with Germany."},
  {type:'mcq',q:"When was the Charter of the UN signed?",options:["June 26, 1942","June 26, 1945","January 1, 1942","January 1, 1945"],correct:1,exp:"The Charter of the UN was signed on June 26, 1945."},
  {type:'mcq',q:"Where is the Headquarters of the International Court of Justice located?",options:["New York","Chicago","London","The Hague"],correct:3,exp:"The Headquarters of the International Court of Justice is at The Hague."},
  // UNIT 4 MCQ
  {type:'mcq',q:"Who was the first director of Whampoa Military Academy?",options:["Sun Yat-Sen","Chiang Kai-Shek","Michael Borodin","Chou En Lai"],correct:1,exp:"Chiang Kai-Shek was the first director of Whampoa Military Academy."},
  {type:'mcq',q:"Which American President followed the policy of containment of Communism?",options:["Woodrow Wilson","Truman","Theodore Roosevelt","Franklin Roosevelt"],correct:1,exp:"Truman followed the policy of containment of Communism."},
  {type:'mcq',q:"When was People's Political Consultative Conference held in China?",options:["September 1959","September 1948","September 1954","September 1949"],correct:3,exp:"People's Political Consultative Conference was held in September 1949."},
  {type:'mcq',q:"The United States and European allies formed _____ to resist any Soviet aggression in Europe.",options:["SEATO","NATO","SENTO","Warsaw Pact"],correct:1,exp:"NATO was formed to resist any Soviet aggression in Europe."},
  {type:'mcq',q:"Who became the Chairman of the PLO's Executive Committee in 1969?",options:["Hafez al-Assad","Yasser Arafat","Nasser","Saddam Hussein"],correct:1,exp:"Yasser Arafat became the Chairman of the PLO's Executive Committee in 1969."},
  {type:'mcq',q:"When was North and South Vietnam united?",options:["1975","1976","1973","1974"],correct:1,exp:"North and South Vietnam were united in 1976."},
  {type:'mcq',q:"Where was Arab League formed?",options:["Cairo","Jordan","Lebanon","Syria"],correct:0,exp:"Arab League was formed in Cairo."},
  {type:'mcq',q:"When was the Warsaw Pact dissolved?",options:["1979","1989","1990","1991"],correct:3,exp:"The Warsaw Pact was dissolved in 1991."},
  // UNIT 5 MCQ
  {type:'mcq',q:"In which year was Sati abolished?",options:["1827","1829","1826","1927"],correct:1,exp:"Sati was abolished in 1829."},
  {type:'mcq',q:"What was the name of the Samaj founded by Dayanand Saraswati?",options:["Arya Samaj","Brahmo Samaj","Prarthana Samaj","Adi Brahmo Samaj"],correct:0,exp:"Dayanand Saraswati founded Arya Samaj."},
  {type:'mcq',q:"Whose campaign and work led to the enactment of Widow Remarriage Reform Act of 1856?",options:["Iswarchandra Vidyasagar","Raja Ram Mohan Roy","Annie Besant","Jyotiba Phule"],correct:0,exp:"Iswarchandra Vidyasagar's campaign led to the Widow Remarriage Reform Act of 1856."},
  {type:'mcq',q:"Whose voice was Rast Goftar?",options:["Parsi Movement","Aligarh Movement","Ramakrishna Mission","Dravida Mahajana Sabha"],correct:0,exp:"Rast Goftar was the voice of the Parsi Movement."},
  {type:'mcq',q:"Who was the founder of Namdhari Movement?",options:["Baba Dayal Das","Baba Ramsingh","Gurunanak","Jyotiba Phule"],correct:1,exp:"Baba Ramsingh was the founder of the Namdhari Movement."},
  {type:'mcq',q:"Who was Swami Shradhananda?",options:["a disciple of Swami Vivekananda","one who caused split in Brahmo Samaj of India","one who caused split in the Arya Samaj","founder of Samathuva Samajam"],correct:2,exp:"Swami Shradhananda caused a split in the Arya Samaj."},
  {type:'mcq',q:"Who was the founder of Widow Remarriage Association?",options:["M.G. Ranade","Devendranath Tagore","Jyotiba Phule","Ayyankali"],correct:0,exp:"M.G. Ranade founded the Widow Remarriage Association."},
  {type:'mcq',q:"Who was the author of the book Satyarthaprakash?",options:["Dayananda Saraswathi","Vaikunda Swamy","Annie Besant","Swami Shradanatha"],correct:0,exp:"Dayananda Saraswathi was the author of Satyarthaprakash."},
  // FILL IN THE BLANKS - History
  {type:'fill',q:"Japan forced a war on China in the year ________.",correct:["1894"],exp:"Japan forced a war on China in 1894."},
  {type:'fill',q:"The new state of Albania was created according to the ________ signed in May 1913.",correct:["Treaty of London","treaty of london"],exp:"The new state of Albania was created according to the Treaty of London signed in May 1913."},
  {type:'fill',q:"Japan entered into an alliance with England in the year ________.",correct:["1902"],exp:"Japan entered into an alliance with England in 1902."},
  {type:'fill',q:"In the Balkans ________ had mixed population.",correct:["Macedonia"],exp:"In the Balkans Macedonia had mixed population."},
  {type:'fill',q:"In the battle of Tannenberg ________ suffered heavy losses.",correct:["Russia"],exp:"In the battle of Tannenberg Russia suffered heavy losses."},
  {type:'fill',q:"________ as Prime Minister represented France in Paris Peace Conference.",correct:["Clemenceau"],exp:"Clemenceau as Prime Minister represented France in Paris Peace Conference."},
  {type:'fill',q:"________ became Prime Minister leading a new coalition of liberals and moderate Socialists before Lenin established the Bolshevik Government.",correct:["Kerensky"],exp:"Kerensky became Prime Minister leading a new coalition before Lenin."},
  {type:'fill',q:"Locarno Treaty was signed in the year ________.",correct:["1925"],exp:"Locarno Treaty was signed in 1925."},
  {type:'fill',q:"The founder of Social Democratic Party was ________.",correct:["Ferdinand Lassalle"],exp:"The founder of Social Democratic Party was Ferdinand Lassalle."},
  {type:'fill',q:"The Nazi Party's propaganda was led by ________.",correct:["Josef Goebbels","Goebbels"],exp:"The Nazi Party's propaganda was led by Josef Goebbels."},
  {type:'fill',q:"The Vietnam Nationalist Party was formed in ________.",correct:["1927"],exp:"The Vietnam Nationalist Party was formed in 1927."},
  {type:'fill',q:"The Secret State Police in Nazi Germany was known as ________.",correct:["The Gestapo","Gestapo"],exp:"The Secret State Police in Nazi Germany was known as The Gestapo."},
  {type:'fill',q:"The Union of South Africa came into being in May ________.",correct:["1910"],exp:"The Union of South Africa came into being in May 1910."},
  {type:'fill',q:"The ANC leader Nelson Mandela was put behind the bars for ________ years.",correct:["27"],exp:"Nelson Mandela was imprisoned for 27 years."},
  {type:'fill',q:"________ were a military nation.",correct:["The Aztecs","Aztecs"],exp:"The Aztecs were a military nation."},
  {type:'fill',q:"Boers were also known as ________.",correct:["Afrikaners"],exp:"Boers were also known as Afrikaners."},
  {type:'fill',q:"Hitler attacked ________ which was a demilitarised Zone.",correct:["Rhineland"],exp:"Hitler attacked Rhineland which was a demilitarised Zone."},
  {type:'fill',q:"The alliance between Italy, Germany and Japan is known as ________.",correct:["Rome-Berlin Tokyo Axis","Rome-Berlin-Tokyo Axis"],exp:"The alliance is known as Rome-Berlin Tokyo Axis."},
  {type:'fill',q:"________ started the Lend Lease programme.",correct:["President Roosevelt","Roosevelt"],exp:"President Roosevelt started the Lend Lease programme."},
  {type:'fill',q:"Britain Prime Minister ________ resigned in 1940.",correct:["Chamberlain"],exp:"Chamberlain resigned in 1940."},
  {type:'fill',q:"Saluting the bravery of the ________ Churchill said that \"Never was so much owed by so many to so few\".",correct:["Royal Air Force","RAF"],exp:"Churchill saluted the bravery of the Royal Air Force."},
  {type:'fill',q:"________ is a device used to find out the enemies aircraft from a distance.",correct:["Radar"],exp:"Radar is used to detect enemy aircraft from a distance."},
  {type:'fill',q:"After the World War II ________ was voted into Power in Great Britain.",correct:["The Labour Party","Labour Party"],exp:"The Labour Party was voted into power in Great Britain after WWII."},
  {type:'fill',q:"________ was known as \"The morning star of China\".",correct:["Dr. Sun Yat Sen","Sun Yat Sen","Sun Yat-Sen"],exp:"Dr. Sun Yat Sen was known as the morning star of China."},
  {type:'fill',q:"In 1918, the society for the study of Marxism was formed in ________ University.",correct:["Peking"],exp:"The society for the study of Marxism was formed in Peking University."},
  {type:'fill',q:"After the death of Dr. Sun Yat Sen, the leader of the Kuomintang Party was ________.",correct:["Chiang Kai-Shek","Chiang Kai Shek"],exp:"Chiang Kai-Shek became the leader of the Kuomintang Party."},
  {type:'fill',q:"Germany joined the NATO in ________.",correct:["1955"],exp:"Germany joined NATO in 1955."},
  {type:'fill',q:"________ was the Head Quarters of the Council of Europe.",correct:["Strasbourg"],exp:"Strasbourg was the Headquarters of the Council of Europe."},
  {type:'fill',q:"________ treaty signed on February 7, 1992 created the European Union.",correct:["The Maastricht","Maastricht"],exp:"The Maastricht treaty created the European Union."},
  {type:'fill',q:"________ founded the Samarasa Vedha Sanmarga Sangam.",correct:["Vallalar","Ramalinga Adigal","Vallalar (Ramalinga Adigal)"],exp:"Vallalar (Ramalinga Adigal) founded the Samarasa Vedha Sanmarga Sangam."},
  {type:'fill',q:"The founder of Poona Sarvajanik Sabha was ________.",correct:["M.G.Ranade","M.G. Ranade","MG Ranade"],exp:"M.G. Ranade founded Poona Sarvajanik Sabha."},
  {type:'fill',q:"Satyashodak Samaj was launched by ________.",correct:["Jyotiba Govindrai Phule","Jyotiba Phule"],exp:"Satyashodak Samaj was launched by Jyotiba Phule."},
  {type:'fill',q:"Ramakrishna Mission was established by ________.",correct:["Vivekanand","Swami Vivekananda","Vivekananda"],exp:"Ramakrishna Mission was established by Vivekananda."},
  {type:'fill',q:"________ was the forerunner of Akali Movement.",correct:["Singh Sabha"],exp:"Singh Sabha was the forerunner of Akali Movement."},
  {type:'fill',q:"Oru paisa Tamilan was started by ________.",correct:["Jyothee Thassar","Iyothee Thass"],exp:"Oru paisa Tamilan was started by Jyothee Thassar."},
  // MATCH THE FOLLOWING - History (as MCQ of combinations)
  {type:'match',q:"Match the following (Unit 1):\n1. Treaty of Brest-Litovsk\n2. Jingoism\n3. Kemal Pasha\n4. Emden\n5. Hall of Mirrors\n\na. Versailles  b. Turkey  c. Russia with Germany  d. England  e. Madras",options:["1-c, 2-d, 3-b, 4-e, 5-a","1-a, 2-b, 3-c, 4-d, 5-e","1-c, 2-e, 3-b, 4-d, 5-a","1-d, 2-c, 3-a, 4-e, 5-b"],correct:0,exp:"Correct matching: 1-c, 2-d, 3-b, 4-e, 5-a"},
  {type:'match',q:"Match the following (Unit 2):\n1. Transvaal\n2. Tongking\n3. Hindenburg\n4. Third Reich\n5. Matteotti\n\na. Germany  b. Hitler  c. Italy  d. Gold  e. guerilla activities",options:["1-d, 2-e, 3-a, 4-b, 5-c","1-a, 2-b, 3-c, 4-d, 5-e","1-d, 2-a, 3-e, 4-b, 5-c","1-e, 2-d, 3-a, 4-c, 5-b"],correct:0,exp:"Correct matching: 1-d, 2-e, 3-a, 4-b, 5-c"},
  {type:'match',q:"Match the following (Unit 3):\n1. Blitzkrieg\n2. Royal Navy\n3. Lend Lease\n4. Volga\n5. Guadalcanal\n\na. Roosevelt  b. Stalingrad  c. Solomon Island  d. Britain  e. Lightning Strike",options:["1-e, 2-d, 3-a, 4-b, 5-c","1-a, 2-b, 3-c, 4-d, 5-e","1-e, 2-a, 3-d, 4-b, 5-c","1-d, 2-e, 3-a, 4-c, 5-b"],correct:0,exp:"Correct matching: 1-e, 2-d, 3-a, 4-b, 5-c"},
  {type:'match',q:"Match the following (Unit 4):\n1. Dr. Sun Yat-Sen\n2. Syngman Rhee\n3. Anwar Sadat\n4. Ho-Chi Minh\n5. Ngo Dinh Diem\n\na. South Vietnam  b. Kuomintang  c. South Korea  d. Egypt  e. North Vietnam",options:["1-b, 2-c, 3-d, 4-e, 5-a","1-a, 2-b, 3-c, 4-d, 5-e","1-b, 2-a, 3-d, 4-e, 5-c","1-c, 2-b, 3-d, 4-a, 5-e"],correct:0,exp:"Correct matching: 1-b, 2-c, 3-d, 4-e, 5-a"},
  {type:'match',q:"Match the following (Unit 5):\n1. Ayyavazhi\n2. Thiruvarutpa\n3. Baba Dayal Das\n4. Iswarchandra Vidyasagar\n5. Debendranath\n\na. Widows Remarriage Reform Act  b. Nirankari  c. Adi Brahmo Samaj  d. Vaikunda Swamigal  e. Songs of Grace",options:["1-d, 2-e, 3-b, 4-a, 5-c","1-a, 2-b, 3-c, 4-d, 5-e","1-d, 2-a, 3-e, 4-b, 5-c","1-e, 2-d, 3-b, 4-a, 5-c"],correct:0,exp:"Correct matching: 1-d, 2-e, 3-b, 4-a, 5-c"},
  // CAPTION style (as fill with accepted answers)
  {type:'caption',q:"Imperialism – Write short notes covering: What is monopoly capitalism? How did Japan emerge as an imperial power? Why did industrial countries need colonies? What contrasts did capitalism produce?",correct:["Monopoly capitalism is the highest stage of capitalism where a few large firms control production. Japan modernised after Meiji Restoration and defeated China (1894) and Russia. Industrial countries needed colonies for raw materials and markets. Capitalism produced contrasts of wealth and poverty."],exp:"Key points: monopoly capitalism (Lenin), Meiji Japan, need for raw materials & markets, rich-poor contrasts."},
  {type:'caption',q:"Balkan Wars – Why was Balkan League formed? Outcome of first Balkan War? Who were defeated? Name of the Treaty after second Balkan War?",correct:["Balkan League was formed to free Balkan states from Ottoman rule. First Balkan War ended Ottoman defeat. Turkey was defeated. Treaty of Bucharest ended the second Balkan War."],exp:"Balkan League vs Ottomans; Treaty of Bucharest after Second Balkan War."}
];

const SS_GEOGRAPHY = [
  // Unit 1 MCQ
  {type:'mcq',q:"The north–south extent of India is _______________.",options:["2,500 km","2,933 km","3,214 km","2,814 km"],correct:2,exp:"The north–south extent of India is 3,214 km."},
  {type:'mcq',q:"The Southern most point of India is _______________.",options:["Andaman","Kanyakumari","Indira Point","Kavaratti"],correct:2,exp:"Indira Point is the southernmost point of India."},
  {type:'mcq',q:"The extent of Himalayas in the east-west is about _______________.",options:["2,500 km","2,400 km","800 km","2,200 km"],correct:0,exp:"The east-west extent of the Himalayas is about 2,500 km."},
  {type:'mcq',q:"_______________ River is known as 'Sorrow of Bihar'.",options:["Narmada","Godavari","Kosi","Damodar"],correct:2,exp:"Kosi is known as the Sorrow of Bihar."},
  {type:'mcq',q:"Deccan Plateau covers an area of about ________ sq.km.",options:["8 lakh","6 lakh","5 lakh","7 lakh"],correct:3,exp:"Deccan Plateau covers about 7 lakh sq.km."},
  {type:'mcq',q:"A landmass bounded by sea on three sides is referred to as _______________.",options:["Coast","Island","Peninsula","Strait"],correct:2,exp:"A landmass bounded by sea on three sides is a Peninsula."},
  {type:'mcq',q:"The Palk Strait and Gulf of Mannar separates India from _______________.",options:["Goa","West Bengal","Sri Lanka","Maldives"],correct:2,exp:"Palk Strait and Gulf of Mannar separate India from Sri Lanka."},
  {type:'mcq',q:"The highest peak in South India is _______________.",options:["Ooty","Kodaikanal","Anaimudi","Jindhagada"],correct:2,exp:"Anaimudi is the highest peak in South India."},
  {type:'mcq',q:"_______________ Plains are formed by the older alluviums.",options:["Bhabar","Tarai","Bhangar","Khadar"],correct:2,exp:"Bhangar plains are formed by older alluviums."},
  {type:'mcq',q:"Pulicat Lake is located between the states of _______________.",options:["West Bengal and Odisha","Karnataka and Kerala","Odisha and Andhra Pradesh","Tamil Nadu and Andhra Pradesh"],correct:3,exp:"Pulicat Lake lies between Tamil Nadu and Andhra Pradesh."},
  // Unit 2 MCQ
  {type:'mcq',q:"Meteorology is the science of ____________________",options:["Weather","Social","Political","Human"],correct:0,exp:"Meteorology is the science of weather."},
  {type:'mcq',q:"We wear cotton during ____________________",options:["Summer","Winter","Rainy","Northeast monsoon"],correct:0,exp:"We wear cotton during summer."},
  {type:'mcq',q:"Western disturbances cause rainfall in ____________________",options:["Tamil Nadu","Kerala","Punjab","Madhya Pradesh"],correct:2,exp:"Western disturbances cause rainfall in Punjab (and northwest India)."},
  {type:'mcq',q:"________ helps in quick ripening of mangoes along the Coast of Kerala and Karnataka.",options:["Loo","Norwester","Mango showers","Jet stream"],correct:2,exp:"Mango showers help in quick ripening of mangoes."},
  {type:'mcq',q:"________ is a line joining the places of equal rainfall.",options:["Isohyets","Isobar","Isotherm","Latitudes"],correct:0,exp:"Isohyets join places of equal rainfall."},
  {type:'mcq',q:"Climate of India is labelled as ____________________",options:["Tropical humid","Equatorial Climate","Tropical Monsoon Climate","Temperate Climate"],correct:2,exp:"Climate of India is Tropical Monsoon Climate."},
  {type:'mcq',q:"The monsoon forests are otherwise called as ____________________",options:["Tropical Evergreen Forest","Deciduous Forest","Mangrove Forest","Mountain Forest"],correct:1,exp:"Monsoon forests are also called Deciduous Forest."},
  {type:'mcq',q:"____________________ forests are found above 2400m Himalayas.",options:["Deciduous Forests","Alpine Forests","Mangrove Forests","Tidal Forests"],correct:1,exp:"Alpine Forests are found above 2400m in the Himalayas."},
  {type:'mcq',q:"Seshachalam hills, a Biosphere reserve is situated in ____________________",options:["Tamil Nadu","Andhra Pradesh","Madhya Pradesh","Karnataka"],correct:1,exp:"Seshachalam hills Biosphere reserve is in Andhra Pradesh."},
  {type:'mcq',q:"________ is a part of the world network biosphere reserves of UNESCO.",options:["Nilgiri","Agasthiyamalai","Great Nicobar","Kachch"],correct:0,exp:"Nilgiri is part of the UNESCO world network of biosphere reserves."},
  // Unit 3 MCQ
  {type:'mcq',q:"The soil which is rich in iron oxides is ____________________.",options:["Alluvial","Black","Red","Alkaline"],correct:2,exp:"Red soil is rich in iron oxides."},
  {type:'mcq',q:"Which of the following organization has divided the Indian soils into 8 major groups?",options:["Indian Council of Agricultural Research","Indian Meteorological Department","Soil Survey of India","Indian Institute of Soil Science"],correct:0,exp:"ICAR has divided Indian soils into 8 major groups."},
  {type:'mcq',q:"The soils formed by the rivers are:",options:["Red soils","Black soils","Desert soils","Alluvial soils"],correct:3,exp:"Alluvial soils are formed by rivers."},
  {type:'mcq',q:"________ dam is the highest gravity dam in India.",options:["Hirakud dam","Bhakra Nangal dam","Mettur dam","Nagarjuna Sagar dam"],correct:1,exp:"Bhakra Nangal is the highest gravity dam in India."},
  {type:'mcq',q:"____________________ is a cash crop.",options:["Cotton","Wheat","Rice","Maize"],correct:0,exp:"Cotton is a cash crop."},
  {type:'mcq',q:"Black soils are also called as ____________________",options:["Arid soils","Saline soils","Regur soils","Mountain soils"],correct:2,exp:"Black soils are also called Regur soils."},
  {type:'mcq',q:"The longest dam in the world is ____________________",options:["Mettur dam","Kosi dam","Hirakud dam","Bhakra-Nangal dam"],correct:2,exp:"Hirakud is the longest dam in the world."},
  {type:'mcq',q:"The leading producer of rice in India is ____________________",options:["Punjab","Maharashtra","Uttar Pradesh","West Bengal"],correct:3,exp:"West Bengal is the leading producer of rice in India."},
  {type:'mcq',q:"Which crop is called as \"Golden Fibre\" in India?",options:["Cotton","Wheat","Jute","Tobacco"],correct:2,exp:"Jute is called the Golden Fibre."},
  {type:'mcq',q:"The state which leads in the production of coffee is ____________________",options:["West Bengal","Karnataka","Odisha","Punjab"],correct:1,exp:"Karnataka leads in coffee production."},
  // Unit 4 MCQ
  {type:'mcq',q:"Manganese is used in ____________________",options:["Storage batteries","Steel Making","Copper smelting","Petroleum Refining"],correct:1,exp:"Manganese is used in steel making."},
  {type:'mcq',q:"The Anthracite coal has ____________________",options:["80 to 95% Carbon","Above 70% Carbon","60 to 70% Carbon","Below 50% Carbon"],correct:0,exp:"Anthracite coal has 80 to 95% Carbon."},
  {type:'mcq',q:"The most important constituents of petroleum are hydrogen and ____________________",options:["Oxygen","Water","Carbon","Nitrogen"],correct:2,exp:"Petroleum's most important constituents are hydrogen and carbon."},
  {type:'mcq',q:"The city which is called as the Manchester of South India is ____________________",options:["Chennai","Salem","Madurai","Coimbatore"],correct:3,exp:"Coimbatore is called the Manchester of South India."},
  {type:'mcq',q:"The first Jute mill of India was established at ____________________",options:["Kolkata","Mumbai","Ahmedabad","Baroda"],correct:0,exp:"The first Jute mill was established at Kolkata."},
  {type:'mcq',q:"The first Nuclear Power station was commissioned in ____________________",options:["Gujarat","Rajasthan","Maharashtra","Tamil Nadu"],correct:2,exp:"The first Nuclear Power station was commissioned in Maharashtra (Tarapur)."},
  {type:'mcq',q:"The most abundant source of energy is ____________________",options:["Bio mass","Sun","Coal","Oil"],correct:1,exp:"The Sun is the most abundant source of energy."},
  {type:'mcq',q:"The famous Sindri Fertilizer Plant is located in ____________________",options:["Jharkhand","Bihar","Rajasthan","Assam"],correct:0,exp:"Sindri Fertilizer Plant is in Jharkhand."},
  {type:'mcq',q:"The nucleus for the development of the Chotanagpur Plateau Region is ____________________",options:["Transport","Mineral Deposits","Large demand","Power Availability"],correct:1,exp:"Mineral deposits are the nucleus for Chotanagpur Plateau development."},
  {type:'mcq',q:"One of the shore based steel plants of India is located at ____________________",options:["Kolkata","Tuticorin","Goa","Visakhapatnam"],correct:3,exp:"Visakhapatnam has a shore-based steel plant."},
  // Unit 5 MCQ
  {type:'mcq',q:"The scientific study of different aspects of population is called _______________",options:["Photography","Demography","Choreography","Population density"],correct:1,exp:"Demography is the scientific study of population."},
  {type:'mcq',q:"The state with highest literacy rate as per 2011 census is _______________",options:["Tamil Nadu","Karnataka","Kerala","Uttar Pradesh"],correct:2,exp:"Kerala has the highest literacy rate as per 2011 census."},
  {type:'mcq',q:"Human Development is measured in terms of _______________",options:["Human Resource Index","Per capita index","Human Development Index","UNDP"],correct:2,exp:"Human Development is measured by the Human Development Index (HDI)."},
  {type:'mcq',q:"_______________ transport provides door to door services.",options:["Railways","Roadways","Airways","Waterways"],correct:1,exp:"Roadways provide door-to-door services."},
  {type:'mcq',q:"The length of Golden Quadrilateral super highways in India is _______________",options:["5846 km","5847 km","5849 km","5800 km"],correct:0,exp:"Golden Quadrilateral is about 5846 km."},
  {type:'mcq',q:"The length of navigable Inland waterways in India is _______________",options:["17,500 km","5000 km","14,500 km","1000 km"],correct:2,exp:"Navigable inland waterways in India are about 14,500 km."},
  {type:'mcq',q:"The National Remote sensing Centre (NRSC) is located at _______________",options:["Bengaluru","Chennai","Delhi","Hyderabad"],correct:3,exp:"NRSC is located at Hyderabad."},
  {type:'mcq',q:"The transport useful in the inaccessible areas is _______________",options:["Roadways","Railways","Airways","Waterways"],correct:2,exp:"Airways are useful in inaccessible areas."},
  {type:'mcq',q:"Which of the following is associated with helicopter service?",options:["Air India","Indian Airlines","Vayudoot","Pavan Hans"],correct:3,exp:"Pavan Hans is associated with helicopter service."},
  {type:'mcq',q:"The major import item of India is _______________",options:["Cement","Jewels","Tea","Petroleum"],correct:3,exp:"Petroleum is the major import item of India."},
  // Geography Match
  {type:'match',q:"Match the following (Location, Relief):\n1. Tsangpo\n2. Yamuna\n3. New alluvium\n4. Mt. Godwin Austen (K2)\n5. Coromandel Coast\n\na. Tributary of River Ganga  b. Highest peak in India  c. River Brahmaputra in Tibet  d. Southern part of East Coastal Plain  e. Khadar",options:["1-c, 2-a, 3-e, 4-b, 5-d","1-a, 2-b, 3-c, 4-d, 5-e","1-c, 2-e, 3-a, 4-b, 5-d","1-d, 2-a, 3-e, 4-b, 5-c"],correct:0,exp:"Correct: 1-c, 2-a, 3-e, 4-b, 5-d"},
  {type:'match',q:"Match the following (Climate):\n1. Project Elephant\n2. Biodiversity hotspot\n3. North East Monsoon\n4. Tropical thorn Forests\n5. Coastal Forests\n\na. Desert and Semi Desert Vegetation  b. October-December  c. Littoral forest  d. Protect the Elephants  e. The Himalayas",options:["1-d, 2-e, 3-b, 4-a, 5-c","1-a, 2-b, 3-c, 4-d, 5-e","1-d, 2-a, 3-b, 4-e, 5-c","1-e, 2-d, 3-b, 4-a, 5-c"],correct:0,exp:"Correct: 1-d, 2-e, 3-b, 4-a, 5-c"},
  {type:'match',q:"Match the following (Agriculture):\n1. Sugar bowl of India\n2. Coffee\n3. Tehri\n4. Hirakud\n5. Horticulture\n\na. Mahanadi  b. Golden Revolution  c. Karnataka  d. Uttar Pradesh and Bihar  e. Highest Dam in India",options:["1-d, 2-c, 3-e, 4-a, 5-b","1-a, 2-b, 3-c, 4-d, 5-e","1-d, 2-a, 3-e, 4-b, 5-c","1-c, 2-d, 3-e, 4-a, 5-b"],correct:0,exp:"Correct: 1-d, 2-c, 3-e, 4-a, 5-b"}
];

const SS_CIVICS = [
  // Unit 1 MCQ
  {type:'mcq',q:"Which of the following sequences is right regarding the Preamble?",options:["Republic, democratic, secular, socialist, sovereign","Sovereign, socialist, secular, republic, democratic","Sovereign, republic, secular, socialist, democratic","Sovereign, socialist, secular, democratic, republic"],correct:3,exp:"The correct order is Sovereign, socialist, secular, democratic, republic."},
  {type:'mcq',q:"How many times has the Preamble to the Constitution of India been amended?",options:["Once","Twice","Thrice","Never"],correct:0,exp:"The Preamble has been amended once (42nd Amendment)."},
  {type:'mcq',q:"The Indian Constitution gives to its citizens _______________",options:["Double Citizenship","Single Citizenship","Single Citizenship in some States and Double in others","None of the above"],correct:1,exp:"India follows Single Citizenship."},
  {type:'mcq',q:"A foreigner can acquire Indian citizenship through",options:["Descent","Registration","Naturalisation","All of the above"],correct:3,exp:"A foreigner can acquire citizenship by Descent, Registration or Naturalisation."},
  {type:'mcq',q:"Find the odd one out.",options:["Right to Equality","Right against Exploitation","Right to Property","Cultural and Educational Rights"],correct:2,exp:"Right to Property is no longer a Fundamental Right."},
  {type:'mcq',q:"One of the following is not an instance of an exercise of a fundamental right?",options:["Workers from Karnataka go to Kerala to work on the farms","Christian missions set up a chain of missionary schools","Men and Women Government employees got the same salary","Parents property is inherited by their children"],correct:3,exp:"Inheritance of parents' property is not a Fundamental Right."},
  {type:'mcq',q:"If the fundamental rights of Indian citizen are violated, they possess the right to have an access to",options:["The Parliament","The Attorney General","The President of India","The Supreme court of India"],correct:3,exp:"Citizens can approach the Supreme Court for enforcement of Fundamental Rights."},
  {type:'mcq',q:"Which one of the following rights was described by Dr. B.R. Ambedkar as the heart and soul of the Constitution?",options:["Right to freedom of religion","Right to equality","Right to Constitutional remedies","Right to property"],correct:2,exp:"Dr. Ambedkar called Right to Constitutional Remedies the heart and soul of the Constitution."},
  {type:'mcq',q:"How can the Fundamental Rights be suspended?",options:["If the Supreme Court so desires","If the Prime Minister orders to this effect","If the President orders it during the national emergency","All of the above"],correct:2,exp:"Fundamental Rights can be suspended by the President during national emergency."},
  {type:'mcq',q:"We borrowed the Fundamental Duties from the _______________",options:["American Constitution","Canadian Constitution","Russian Constitution","Irish Constitution"],correct:2,exp:"Fundamental Duties were borrowed from the Russian (Soviet) Constitution."},
  {type:'mcq',q:"The Directive Principles can be classified into _______________",options:["Liberal and Communist principles","Socialist and Communist principles","Liberal, Gandhian and Communist principles","Socialist, Gandhian and Liberal principles"],correct:3,exp:"Directive Principles are classified into Socialist, Gandhian and Liberal principles."},
  {type:'mcq',q:"Under which Article financial emergency can be proclaimed?",options:["Article 352","Article 356","Article 360","Article 368"],correct:2,exp:"Financial emergency is under Article 360."},
  {type:'mcq',q:"The procedure for the Amendment of the Indian Constitution is given in _______________",options:["Article 352","Article 356","Article 360","Article 368"],correct:3,exp:"Amendment procedure is in Article 368."},
  {type:'mcq',q:"Which of the following committees/commissions made recommendations about the Centre-State Relations?\n1. Sarkaria Commission  2. Rajamannar Committee  3. M.N.Venkatachaliah Commission",options:["1, 2 & 3","1 & 2","1 & 3","2 & 3"],correct:1,exp:"Sarkaria Commission and Rajamannar Committee dealt with Centre-State relations."},
  // Unit 2 MCQ
  {type:'mcq',q:"The Constitutional Head of the Union is __________",options:["The President","The Chief Justice","The Prime Minister","Council of Ministers"],correct:0,exp:"The President is the Constitutional Head of the Union."},
  {type:'mcq',q:"Who is the real executive in a parliamentary type of government?",options:["Army","The Prime Minister","The President","Judiciary"],correct:1,exp:"The Prime Minister is the real executive in a parliamentary system."},
  {type:'mcq',q:"Who among the following decides whether a Bill is a Money Bill or not?",options:["The President","Attorney General","Parliamentary Affairs Minister","Speaker of Lok Sabha"],correct:3,exp:"The Speaker of Lok Sabha decides whether a Bill is a Money Bill."},
  {type:'mcq',q:"The Council of Ministers is collectively responsible to the ________",options:["The President","Lok Sabha","The Prime Minister","Rajya Sabha"],correct:1,exp:"The Council of Ministers is collectively responsible to the Lok Sabha."},
  {type:'mcq',q:"The Joint sittings of Indian Parliament for transacting legislative business are presided over by?",options:["Senior most member of Parliament","Speaker of the Lok Sabha","The President of India","The Chairman of the Rajya Sabha"],correct:1,exp:"Joint sittings are presided over by the Speaker of the Lok Sabha."},
  {type:'mcq',q:"What is minimum age laid down for a candidate to seek election to the Lok Sabha?",options:["18 years","21 years","25 years","30 years"],correct:2,exp:"Minimum age for Lok Sabha is 25 years."},
  {type:'mcq',q:"The authority to alter the boundaries of state in India rests with?",options:["The President","The Prime Minister","State Government","Parliament"],correct:3,exp:"Parliament has the authority to alter state boundaries."},
  {type:'mcq',q:"Under which Article the President is vested with the power to proclaim Financial Emergency",options:["Article 352","Article 360","Article 356","Article 365"],correct:1,exp:"Article 360 deals with Financial Emergency."},
  {type:'mcq',q:"The Chief Justice and other Judges of the Supreme court are appointed by the ________",options:["President","Attorney General of India","Governor","Prime Minister"],correct:0,exp:"Judges of the Supreme Court are appointed by the President."},
  {type:'mcq',q:"Dispute between States of India comes to the Supreme Court under:",options:["Appellate Jurisdiction","Original Jurisdiction","Advisory Jurisdiction","None of these"],correct:1,exp:"Inter-state disputes come under Original Jurisdiction of the Supreme Court."},
  // Unit 3 MCQ
  {type:'mcq',q:"The Governor of the State is appointed by the ________",options:["Prime Minister","Chief Minister","President","Chief Justice"],correct:2,exp:"The Governor is appointed by the President."},
  {type:'mcq',q:"The Speaker of a State is a ________",options:["Head of State","Head of Government","President's Agent","None of these"],correct:3,exp:"The Speaker is none of the given options in that sense."},
  {type:'mcq',q:"Which among the following is not one of the powers of the Governor?",options:["Legislative","Executive","Judicial","Diplomatic"],correct:3,exp:"Governor does not have Diplomatic powers."},
  {type:'mcq',q:"Who can nominate one representative of the Anglo-Indian Community to the State Legislative Assembly?",options:["The President","The Governor","The Chief Minister","The Speaker of State Legislature"],correct:1,exp:"The Governor can nominate one Anglo-Indian representative."},
  {type:'mcq',q:"The Governor does not appoint ________",options:["Chief Minister","Chairman of the State Public Service Commission","Advocate General of the State","Judges of the High Court"],correct:3,exp:"Judges of the High Court are not appointed by the Governor."},
  {type:'mcq',q:"The Chief Minister of a State is appointed by ________",options:["The State Legislature","The Governor","The President","The Speaker of State Legislative Assembly"],correct:1,exp:"The Chief Minister is appointed by the Governor."},
  {type:'mcq',q:"The State Council of Ministers is headed by ________",options:["The Chief Minister","The Governor","The Speaker","The Prime Minister"],correct:0,exp:"The State Council of Ministers is headed by the Chief Minister."},
  {type:'mcq',q:"The Legislative Council ________",options:["Has a term of five years","Has a term of six years","Is a permanent house","Has a term of four years"],correct:2,exp:"The Legislative Council is a permanent house."},
  {type:'mcq',q:"The minimum age for the membership of the Legislative Council is ________",options:["25 years","21 years","30 years","35 years"],correct:2,exp:"Minimum age for Legislative Council is 30 years."},
  {type:'mcq',q:"Which one of the following States does not possess a bicameral legislature?",options:["Andhra Pradesh","Telangana","Tamil Nadu","Uttar Pradesh"],correct:2,exp:"Tamil Nadu does not have a bicameral legislature."},
  {type:'mcq',q:"The High Courts in India were first started at ________",options:["Calcutta, Bombay, Madras","Delhi and Calcutta","Delhi, Calcutta, Madras","Calcutta, Madras, Delhi"],correct:0,exp:"High Courts were first started at Calcutta, Bombay and Madras."},
  {type:'mcq',q:"Which of the following States have a common High Court?",options:["Tamil Nadu and Andhra Pradesh","Kerala and Telangana","Punjab and Haryana","Maharashtra and Gujarat"],correct:2,exp:"Punjab and Haryana have a common High Court."},
  // Civics Fill
  {type:'fill',q:"The concept of constitution first originated in ________.",correct:["USA","United States of America"],exp:"The concept of constitution first originated in the USA."},
  {type:'fill',q:"________ was elected as the temporary President of the Constituent Assembly.",correct:["Sachchidananda Sinha","Sachchdanandan Sinha"],exp:"Sachchidananda Sinha was the temporary President of the Constituent Assembly."},
  {type:'fill',q:"The Constitution of India was adopted on ________.",correct:["26 November 1949","Nov 26th 1949","26th November 1949"],exp:"The Constitution was adopted on 26 November 1949."},
  {type:'fill',q:"Five writs are mentioned in Article ________.",correct:["32"],exp:"Five writs are mentioned in Article 32."},
  {type:'fill',q:"Fundamental duties have been given to the citizen of India under Article ________.",correct:["51A","51 A"],exp:"Fundamental Duties are under Article 51A."},
  {type:'fill',q:"________ is the Ex-officio Chair Person of the Rajya Sabha.",correct:["Vice-President","Vice President"],exp:"Vice-President is the Ex-officio Chairperson of the Rajya Sabha."},
  {type:'fill',q:"The Chief Justice and other judges of the Supreme Court hold the office up to the age of ________ years.",correct:["65"],exp:"Supreme Court judges hold office up to 65 years."},
  {type:'fill',q:"The Supreme Court is the ________ of the Constitution.",correct:["Guardian"],exp:"The Supreme Court is the Guardian of the Constitution."},
  // Civics Match
  {type:'match',q:"Match the following (Constitution):\n1. Citizenship Act\n2. The Preamble\n3. The Mini Constitution\n4. Classical Language\n5. National Emergency\n\na. Jawaharlal Nehru  b. 42nd Amendment  c. 1955  d. 1962  e. Tamil",options:["1-c, 2-a, 3-b, 4-e, 5-d","1-a, 2-b, 3-c, 4-d, 5-e","1-c, 2-b, 3-a, 4-e, 5-d","1-d, 2-a, 3-b, 4-e, 5-c"],correct:0,exp:"Correct: 1-c, 2-a, 3-b, 4-e, 5-d"},
  {type:'match',q:"Match the following (Central Government):\n1. Article 53\n2. Article 63\n3. Article 356\n4. Article 76\n5. Article 352\n\na. State Emergency  b. Internal Emergency  c. Executive Power of President  d. Office of the Vice President  e. Office of the Attorney General",options:["1-c, 2-d, 3-a, 4-e, 5-b","1-a, 2-b, 3-c, 4-d, 5-e","1-c, 2-d, 3-b, 4-e, 5-a","1-d, 2-c, 3-a, 4-e, 5-b"],correct:0,exp:"Correct: 1-c, 2-d, 3-a, 4-e, 5-b"}
];

const SS_ECONOMICS = [
  // Unit 1 MCQ
  {type:'mcq',q:"GNP equals _______________",options:["NNP adjusted for inflation","GDP adjusted for inflation","GDP plus net property income from abroad","NNP plus net property income from abroad"],correct:2,exp:"GNP = GDP plus net property income from abroad."},
  {type:'mcq',q:"National Income is a measure of _______________",options:["Total value of money","Total value of producer goods","Total value of consumption goods","Total value of goods and services"],correct:3,exp:"National Income measures the total value of goods and services."},
  {type:'mcq',q:"Primary sector consists of _______________",options:["Agriculture","Automobiles","Trade","Banking"],correct:0,exp:"Primary sector consists of Agriculture."},
  {type:'mcq',q:"__________ approach is the value added by each intermediate good is summed to estimate the value of the final good.",options:["Expenditure approach","Value added approach","Income approach","National Income"],correct:1,exp:"Value added approach sums the value added by each intermediate good."},
  {type:'mcq',q:"Which one sector has highest employment in the GDP?",options:["Agricultural sector","Industrial sector","Service sector","None of the above"],correct:2,exp:"Service sector has the highest share in GDP and employment."},
  {type:'mcq',q:"Gross value added at current prices for services sector is estimated at _______________ lakh crore in 2018-19.",options:["91.06","92.26","80.07","98.29"],correct:1,exp:"It was estimated at 92.26 lakh crore in 2018-19."},
  {type:'mcq',q:"India is _______________ larger producer in agricultural product.",options:["1st","3rd","4th","2nd"],correct:3,exp:"India is the 2nd largest producer of agricultural products."},
  {type:'mcq',q:"India's life expectancy at birth is _______________",options:["65","60","70","55"],correct:0,exp:"India's life expectancy at birth is around 65 (as per the data in the material)."},
  {type:'mcq',q:"Which one is a trade policy?",options:["Irrigation Policy","Import and export Policy","Land-reform Policy","Wage policy"],correct:1,exp:"Import and export Policy is a trade policy."},
  {type:'mcq',q:"Indian Economy is _______________",options:["Developing Economy","Emerging Economy","Dual Economy","All the above"],correct:3,exp:"Indian Economy is Developing, Emerging and Dual."},
  // Unit 2 MCQ
  {type:'mcq',q:"Who is the head of the World Trade Organisation (WTO)?",options:["Ministerial conference","Director General","Deputy Director General","None of these"],correct:1,exp:"The Director General is the head of the WTO."},
  {type:'mcq',q:"How many countries were members in WTO at present?",options:["159","164","148","128"],correct:1,exp:"WTO has 164 member countries."},
  {type:'mcq',q:"Colonial advent in India",options:["Portuguese, Dutch, English, Danish, French","Dutch, English, Danish, French","Portuguese, Danish, Dutch, French, English","Danish, Portuguese, French, English, Dutch"],correct:0,exp:"The colonial powers were Portuguese, Dutch, English, Danish, French."},
  {type:'mcq',q:"Who first came to India for trading purpose?",options:["Roman Empire","Portuguese","Dutch","Danish"],correct:1,exp:"Portuguese first came to India for trading."},
  {type:'mcq',q:"When did Portuguese colonize India?",options:["1600 BC","1602 BC","1498 BC","1616 BC"],correct:2,exp:"Portuguese arrived in 1498 (Vasco da Gama)."},
  {type:'mcq',q:"GATT's first round held in _______________",options:["Tokyo","Uruguay","Torquay","Geneva"],correct:3,exp:"GATT's first round was held in Geneva."},
  {type:'mcq',q:"India signed the Dunket proposal in",options:["1984","1976","1950","1994"],correct:3,exp:"India signed the Dunkel proposal in 1994."},
  {type:'mcq',q:"Who granted the English \"Golden Fireman\" in 1632?",options:["Jahangir","Sultan of Golconda","Akbar","Aurangzeb"],correct:1,exp:"Sultan of Golconda granted the English Golden Fireman in 1632."},
  {type:'mcq',q:"Foreign Investment policy (FIP) announced in _______________",options:["June 1991","July 1991","July-Aug 1991","Aug 1991"],correct:2,exp:"FIP was announced in July-August 1991."},
  {type:'mcq',q:"Indian government introduced _______________ in 1991",options:["Globalization","World Trade Organisation","New Economic Policy","none"],correct:2,exp:"New Economic Policy was introduced in 1991."},
  // Economics Fill
  {type:'fill',q:"Service sector is the ________ sector in India.",correct:["largest"],exp:"Service sector is the largest sector in India."},
  {type:'fill',q:"GDP is the indicator of ________ of an economy.",correct:["Health","health"],exp:"GDP is the indicator of the health of an economy."},
  {type:'fill',q:"Secondary sector is otherwise called as ________ Sector.",correct:["Industrial","Industry"],exp:"Secondary sector is also called Industrial Sector."},
  {type:'fill',q:"Service sector is the ________ engine of Indian economy.",correct:["growth"],exp:"Service sector is the growth engine of Indian economy."},
  {type:'fill',q:"India is ________ largest economy of the world.",correct:["6th","sixth","6"],exp:"India is the 6th largest economy of the world (as per the material)."},
  {type:'fill',q:"WTO Agreement came into force from ________.",correct:["January 1, 1995","1 January 1995","January 1 1995"],exp:"WTO Agreement came into force from 1 January 1995."},
  {type:'fill',q:"The term Globalization was invented by ________.",correct:["Prof. Theodore Levitt","Theodore Levitt"],exp:"The term Globalization was coined by Prof. Theodore Levitt."},
  // Economics Match
  {type:'match',q:"Match the following (GDP):\n1. Electricity/Gas and Water\n2. Price Policy\n3. GST\n4. Per capita Income\n5. C + I + G + (X-M)\n\na. National Income / Population  b. Gross National Product  c. Industry Sector  d. Agriculture  e. Tax on Goods and Service",options:["1-c, 2-d, 3-e, 4-a, 5-b","1-a, 2-b, 3-c, 4-d, 5-e","1-c, 2-a, 3-e, 4-b, 5-d","1-d, 2-c, 3-e, 4-a, 5-b"],correct:0,exp:"Correct: 1-c, 2-d, 3-e, 4-a, 5-b"},
  {type:'match',q:"Match the following (Globalization):\n1. Multinational Corporation in India\n2. MNC\n3. GATT\n4. 8th Uruguay Round\n5. WTO\n\na. 1947  b. Enforce International Trade  c. Minimize cost of Production  d. Infosys  e. 1986",options:["1-d, 2-c, 3-a, 4-e, 5-b","1-a, 2-b, 3-c, 4-d, 5-e","1-d, 2-a, 3-c, 4-e, 5-b","1-c, 2-d, 3-a, 4-e, 5-b"],correct:0,exp:"Correct: 1-d, 2-c, 3-a, 4-e, 5-b"}
];

const CHAPTERS_SS = [
  {id:1, name:"History", icon:"📜", questions:SS_HISTORY},
  {id:2, name:"Geography", icon:"🌍", questions:SS_GEOGRAPHY},
  {id:3, name:"Civics", icon:"⚖️", questions:SS_CIVICS},
  {id:4, name:"Economics", icon:"📈", questions:SS_ECONOMICS}
];

const CHAPTERS_SCIENCE_10 = [
  // Laws of Motion (10 questions)
  {
    id: "laws_of_motion",
    name: "Laws of Motion",
    unit: "Chapter 1 \u00b7 Physics",
    questions: [
      {q:"Inertia of a body depends on", options:["Weight of the object", "Acceleration due to gravity of the planet", "Mass of the object", "Both a & b"], correct:2},
      {q:"Impulse is equal to", options:["Rate of change of momentum", "Rate of force and time", "Change of momentum", "Rate of change of mass"], correct:2},
      {q:"Newton's III law is applicable", options:["For a body at rest", "For a body in motion", "Both (a) and (b)", "Only for bodies with equal masses"], correct:2},
      {q:"Plotting a graph for momentum on the X-axis and time on Y-axis, the slope of the momentum-time graph gives", options:["Impulsive force", "Acceleration", "Force", "Rate of force"], correct:2},
      {q:"In which of the following sports is the turning effect of force used?", options:["Swimming", "Tennis", "Cycling", "Hockey"], correct:2},
      {q:"The unit of 'g' is m s\u207b\u00b2. It can be also expressed as", options:["cm s\u207b\u00b9", "N kg\u207b\u00b9", "N m\u00b2 kg\u207b\u00b2", "cm\u00b2 s\u207b\u00b2"], correct:1},
      {q:"One kilogram force equals to", options:["9.8 dyne", "9.8 \u00d7 10\u2074 N", "98 \u00d7 10\u2074 dyne", "980 dyne"], correct:2},
      {q:"The mass of a body is measured on planet Earth as M kg. When it is taken to a planet of radius half that of Earth, its value will be __________ kg", options:["4 M", "2 M", "M/4", "M"], correct:3},
      {q:"If the Earth shrinks to 50% of its real radius, its mass remaining the same, the weight of a body on the Earth will", options:["Decrease by 50%", "Increase by 50%", "Decrease by 25%", "Increase by 300%"], correct:3},
      {q:"To project rockets, which of the following principle(s) is/are required?", options:["Newton's third law of motion", "Newton's law of gravitation", "Law of conservation of linear momentum", "Both (a) and (c)"], correct:3},
    ]
  },
  // Optics (10 questions)
  {
    id: "optics",
    name: "Optics",
    unit: "Chapter 2 \u00b7 Physics",
    questions: [
      {q:"The refractive index of four substances A, B, C and D are 1.31, 1.43, 1.33, 2.4 respectively. The speed of light is maximum in", options:["A", "B", "C", "D"], correct:0},
      {q:"Where should an object be placed so that a real and inverted image of the same size is obtained by a convex lens?", options:["f", "2f", "Infinity", "Between f and 2f"], correct:1},
      {q:"A small bulb is placed at the principal focus of a convex lens. When the bulb is switched on, the lens will produce", options:["A convergent beam of light", "A divergent beam of light", "A parallel beam of light", "A coloured beam of light"], correct:2},
      {q:"Magnification of a convex lens is", options:["Positive", "Negative", "Either positive or negative", "Zero"], correct:2},
      {q:"A convex lens forms a real, diminished point sized image at focus. Then the position of the object is at", options:["Focus", "Infinity", "At 2f", "Between f and 2f"], correct:1},
      {q:"Power of a lens is \u20134D, then its focal length is", options:["4 m", "\u201340 m", "\u20130.25 m", "\u20132.5 m"], correct:2},
      {q:"In a myopic eye, the image of the object is formed", options:["Behind the retina", "On the retina", "In front of the retina", "On the blind spot"], correct:2},
      {q:"The eye defect 'presbyopia' can be corrected by", options:["Convex lens", "Concave lens", "Convex mirror", "Bi focal lenses"], correct:3},
      {q:"Which of the following lens would you prefer to use while reading small letters found in a dictionary?", options:["A convex lens of focal length 5 cm", "A concave lens of focal length 5 cm", "A convex lens of focal length 10 cm", "A concave lens of focal length 10 cm"], correct:0},
      {q:"If VB, VG, VR be the velocity of blue, green and red light respectively in a glass prism, then which of the following statement gives the correct relation?", options:["VB = VG = VR", "VB > VG > VR", "VB < VG < VR", "VB < VG > VR"], correct:2},
    ]
  },
  // Thermal Physics (5 questions)
  {
    id: "thermal_physics",
    name: "Thermal Physics",
    unit: "Chapter 3 \u00b7 Physics",
    questions: [
      {q:"The value of universal gas constant is", options:["3.81 mol\u207b\u00b9 K\u207b\u00b9", "8.03 mol\u207b\u00b9 K\u207b\u00b9", "1.38 mol\u207b\u00b9 K\u207b\u00b9", "8.31 mol\u207b\u00b9 K\u207b\u00b9"], correct:3},
      {q:"If a substance is heated or cooled, the change in mass of that substance is", options:["Positive", "Negative", "Zero", "None of the above"], correct:2},
      {q:"If a substance is heated or cooled, the linear expansion occurs along the axis of", options:["X or \u2013X", "Y or \u2013Y", "Both (a) and (b)", "(a) or (b)"], correct:2},
      {q:"Temperature is the average __________ of the molecules of a substance.", options:["Difference in K.E and P.E", "Sum of P.E and K.E", "Difference in T.E and P.E", "Difference in K.E and T.E"], correct:2},
      {q:"In a diagram showing blocks at 303 K, 304 K and 305 K, the possible direction of heat energy transformation is (303 K block A, 304 K block B, 305 K block C)", options:["A \u2190 B, A \u2190 C, B \u2190 C", "A \u2192 B, A \u2192 C, B \u2192 C", "A \u2192 B, A \u2190 C, B \u2192 C", "A \u2190 B, A \u2192 C, B \u2190 C"], correct:0},
    ]
  },
  // Electricity (4 questions)
  {
    id: "electricity",
    name: "Electricity",
    unit: "Chapter 4 \u00b7 Physics",
    questions: [
      {q:"Which of the following is correct?", options:["Rate of change of charge is electrical power", "Rate of change of charge is current", "Rate of change of energy is current", "Rate of change of current is charge"], correct:1},
      {q:"SI unit of resistance is", options:["mho", "joule", "ohm", "ohm meter"], correct:2},
      {q:"In a simple circuit, why does the bulb glow when you close the switch?", options:["The switch produces electricity", "Closing the switch completes the circuit", "Closing the switch breaks the circuit", "The bulb is getting charged"], correct:1},
      {q:"Kilowatt hour is the unit of", options:["Resistivity", "Conductivity", "Electrical energy", "Electrical power"], correct:2},
    ]
  },
  // Acoustics (7 questions)
  {
    id: "acoustics",
    name: "Acoustics",
    unit: "Chapter 5 \u00b7 Physics",
    questions: [
      {q:"When a sound wave travels through air, the air particles", options:["Vibrate along the direction of the wave motion", "Vibrate but not in any fixed direction", "Vibrate perpendicular to the direction of the wave motion", "Do not vibrate"], correct:0},
      {q:"Velocity of sound in a gaseous medium is 330 m s\u207b\u00b9. If the pressure is increased by 4 times without causing a change in the temperature, the velocity of sound in the gas is", options:["330 m s\u207b\u00b9", "660 m s\u207b\u00b9", "156 m s\u207b\u00b9", "990 m s\u207b\u00b9"], correct:0},
      {q:"The frequency, which is audible to the human ear is", options:["50 kHz", "20 kHz", "15000 kHz", "10000 kHz"], correct:1},
      {q:"The velocity of sound in air at a particular temperature is 330 m s\u207b\u00b9. What will be its value when the temperature is doubled and the pressure is halved?", options:["330 m s\u207b\u00b9", "165 m s\u207b\u00b9", "330 \u00d7 \u221a2 m s\u207b\u00b9", "320 / \u221a2 m s\u207b\u00b9"], correct:2},
      {q:"If a sound wave travels with a frequency of 1.25 \u00d7 10\u2074 Hz at 344 m s\u207b\u00b9, the wavelength will be", options:["27.52 m", "275.2 m", "0.02752 m", "2.752 m"], correct:2},
      {q:"The sound waves are reflected from an obstacle into the same medium from which they were incident. Which of the following changes?", options:["Speed", "Frequency", "Wavelength", "None of these"], correct:3},
      {q:"Velocity of sound in the atmosphere of a planet is 500 m s\u207b\u00b9. The minimum distance between the source of sound and the obstacle to hear the echo, should be", options:["17 m", "20 m", "25 m", "50 m"], correct:2},
    ]
  },
  // Nuclear Physics (9 questions)
  {
    id: "nuclear_physics",
    name: "Nuclear Physics",
    unit: "Chapter 6 \u00b7 Physics",
    questions: [
      {q:"Man-made radioactivity is also known as", options:["Induced radioactivity", "Spontaneous radioactivity", "Artificial radioactivity", "(a) & (c)"], correct:3},
      {q:"Unit of radioactivity is", options:["Roentgen", "Curie", "Becquerel", "All the above"], correct:3},
      {q:"Artificial radioactivity was discovered by", options:["Bequerel", "Irene Curie", "Roentgen", "Neils Bohr"], correct:1},
      {q:"In which of the following does no change in mass number of the daughter nuclei take place?", options:["(i) is correct", "(ii) and (iii) are correct", "(i) & (iv) are correct", "(ii) & (iv) are correct"], correct:1},
      {q:"__________ isotope is used for the treatment of cancer.", options:["Radio Iodine", "Radio Cobalt", "Radio Carbon", "Radio Nickel"], correct:1},
      {q:"Gamma radiations are dangerous because", options:["It affects eyes & bones", "It affects tissues", "It produces genetic disorder", "It produces enormous amount of heat"], correct:2},
      {q:"__________ aprons are used to protect us from gamma radiations", options:["Lead oxide", "Iron", "Lead", "Aluminium"], correct:2},
      {q:"Proton-Proton chain reaction is an example of", options:["Nuclear fission", "\u03b1-decay", "Nuclear fusion", "\u03b2-decay"], correct:2},
      {q:"Kamini reactor is located at", options:["Kalpakkam", "Koodankulam", "Mumbai", "Rajasthan"], correct:0},
    ]
  },
  // Atoms and Molecules (8 questions)
  {
    id: "atoms_and_molecules",
    name: "Atoms and Molecules",
    unit: "Chapter 7 \u00b7 Chemistry",
    questions: [
      {q:"Which of the following has the smallest mass?", options:["6.023 \u00d7 10\u00b2\u00b3 atoms of He", "1 atom of He", "2 g of He", "1 mole atoms of He"], correct:1},
      {q:"Which of the following is a triatomic molecule?", options:["Glucose", "Helium", "Carbon dioxide", "Hydrogen"], correct:2},
      {q:"The volume occupied by 4.4 g of CO2 at S.T.P is", options:["22.4 litre", "2.24 litre", "0.24 litre", "0.1 litre"], correct:1},
      {q:"Mass of 1 mole of Nitrogen atom is", options:["28 amu", "14 amu", "28 g", "14 g"], correct:3},
      {q:"Which of the following represents 1 amu?", options:["Mass of a C-12 atom", "Mass of a hydrogen atom", "1/12th of the mass of a C\u201312 atom", "Mass of O\u201316 atom"], correct:2},
      {q:"The volume occupied by 1 mole of a diatomic gas at S.T.P is", options:["11.2 litre", "5.6 litre", "22.4 litre", "44.8 litre"], correct:2},
      {q:"The gram molecular mass of oxygen molecule is", options:["16 g", "18 g", "32 g", "17 g"], correct:2},
      {q:"1 mole of any substance contains ____ molecules.", options:["6.023 \u00d7 10\u00b2\u00b3", "6.023 \u00d7 10\u207b\u00b2\u00b3", "3.0115 \u00d7 10\u00b2\u00b3", "12.046 \u00d7 10\u00b2\u00b3"], correct:0},
    ]
  },
  // Periodic Classification of Elements (8 questions)
  {
    id: "periodic_classification_of_elements",
    name: "Periodic Classification of Elements",
    unit: "Chapter 8 \u00b7 Chemistry",
    questions: [
      {q:"The number of periods and groups in the periodic table are", options:["6, 16", "7, 17", "8, 18", "7, 18"], correct:3},
      {q:"The basis of modern periodic law is", options:["Atomic number", "Atomic mass", "Isotopic mass", "Number of neutrons"], correct:0},
      {q:"__________ group contains the member of halogen family.", options:["17th", "15th", "18th", "16th"], correct:0},
      {q:"__________ is a relative periodic property.", options:["Atomic radii", "Ionic radii", "Electron affinity", "Electronegativity"], correct:3},
      {q:"Chemical formula of rust is", options:["FeO.xH2O", "FeO4.xH2O", "Fe2O3.xH2O", "FeO"], correct:2},
      {q:"The process of coating the surface of metal with a thin layer of zinc is called", options:["Painting", "Thinning", "Galvanization", "Electroplating"], correct:2},
      {q:"Which of the following inert gases has 2 electrons in the outermost shell?", options:["He", "Ne", "Ar", "Kr"], correct:0},
      {q:"__________ is an important metal to form amalgam.", options:["Ag", "Hg", "Mg", "Al"], correct:1},
    ]
  },
  // Solutions (7 questions)
  {
    id: "solutions",
    name: "Solutions",
    unit: "Chapter 9 \u00b7 Chemistry",
    questions: [
      {q:"A solution is a __________ mixture.", options:["Homogeneous", "Heterogeneous", "Homogeneous and heterogeneous", "Non homogeneous"], correct:0},
      {q:"The number of components in a binary solution is", options:["2", "3", "4", "5"], correct:0},
      {q:"Which of the following is the universal solvent?", options:["Acetone", "Benzene", "Water", "Alcohol"], correct:2},
      {q:"A solution in which no more solute can be dissolved in a definite amount of solvent at a given temperature is called", options:["Saturated solution", "Un saturated solution", "Super saturated solution", "Dilute solution"], correct:0},
      {q:"Identify the non aqueous solution.", options:["Sodium chloride in water", "Glucose in water", "Copper sulphate in water", "Sulphur in carbon-di-sulphide"], correct:3},
      {q:"When pressure is increased at constant temperature the solubility of gases in liquid", options:["No change", "Increases", "Decreases", "No reaction"], correct:1},
      {q:"Which of the following is hygroscopic in nature?", options:["Ferric chloride", "Copper sulphate penta hydrate", "Silica gel", "None of the above"], correct:2},
    ]
  },
  // Types of Chemical Reactions (4 questions)
  {
    id: "types_of_chemical_reactions",
    name: "Types of Chemical Reactions",
    unit: "Chapter 10 \u00b7 Chemistry",
    questions: [
      {q:"H2(g) + Cl2(g) \u2192 2HCl(g) is a", options:["Decomposition Reaction", "Combination Reaction", "Single Displacement Reaction", "Double Displacement Reaction"], correct:1},
      {q:"Photolysis is a decomposition reaction caused by", options:["Heat", "Electricity", "Light", "Mechanical energy"], correct:2},
      {q:"The chemical equation Na2SO4(aq) + BaCl2(aq) \u2192 BaSO4(s)\u2193 + 2NaCl(aq) represents which of the following types of reaction?", options:["Neutralisation", "Combustion", "Precipitation", "Single displacement"], correct:2},
      {q:"Powdered CaCO3 reacts more rapidly than flaky CaCO3 because of", options:["Large surface area", "High pressure", "High concentration", "High temperature"], correct:0},
    ]
  },
  // Carbon and its Compounds (7 questions)
  {
    id: "carbon_and_its_compounds",
    name: "Carbon and its Compounds",
    unit: "Chapter 11 \u00b7 Chemistry",
    questions: [
      {q:"The molecular formula of an open chain organic compound is C3H6. The class of the compound is", options:["Alkane", "Alkene", "Alkyne", "Alcohol"], correct:1},
      {q:"The IUPAC name of an organic compound is 3-Methyl butan-1-ol. What type of compound is it?", options:["Aldehyde", "Carboxylic acid", "Ketone", "Alcohol"], correct:3},
      {q:"The secondary suffix used in IUPAC nomenclature of an aldehyde is", options:["\u2013ol", "\u2013oic acid", "\u2013al", "\u2013one"], correct:2},
      {q:"Which of the following pairs can be the successive members of a homologous series?", options:["C3H8 and C4H10", "C2H2 and C2H4", "CH4 and C3H6", "C2H5OH and C4H8OH"], correct:0},
      {q:"C2H5OH + 3O2 \u2192 2CO2 + 3H2O is a", options:["Reduction of ethanol", "Combustion of ethanol", "Oxidation of ethanoic acid", "Oxidation of ethanol"], correct:1},
      {q:"Which of the following are used as anaesthetics?", options:["Carboxylic acids", "Ethers", "Esters", "Aldehydes"], correct:1},
      {q:"Which of the following statements is wrong about detergents?", options:["It is a sodium salt of long chain fatty acids", "It is sodium salts of sulphonic acids", "The ionic part in a detergent is \u2013SO3\u207bNa\u207a", "It is effective even in hard water"], correct:0},
    ]
  },
  // Plant Anatomy and Plant Physiology (6 questions)
  {
    id: "plant_anatomy_and_plant_physiology",
    name: "Plant Anatomy and Plant Physiology",
    unit: "Chapter 12 \u00b7 Biology",
    questions: [
      {q:"Casparian strips are present in the __________ of the root.", options:["Cortex", "Pith", "Pericycle", "Endodermis"], correct:3},
      {q:"The endarch condition is the characteristic feature of", options:["Root", "Stem", "Leaves", "Flower"], correct:1},
      {q:"The xylem and phloem arranged side by side on the same radius is called", options:["Radial", "Amphivasal", "Conjoint", "None of these"], correct:2},
      {q:"Which is formed during anaerobic respiration?", options:["Carbohydrate", "Ethyl alcohol", "Acetyl CoA", "Pyruvate"], correct:1},
      {q:"Kreb's cycle takes place in", options:["Chloroplast", "Mitochondrial matrix", "Stomata", "Inner mitochondrial membrane"], correct:1},
      {q:"Oxygen is produced at what point during photosynthesis?", options:["When ATP is converted to ADP", "When CO2 is fixed", "When H2O is splitted", "All of these"], correct:2},
    ]
  },
  // Structural Organisation of Animals (6 questions)
  {
    id: "structural_organisation_of_animals",
    name: "Structural Organisation of Animals",
    unit: "Chapter 13 \u00b7 Biology",
    questions: [
      {q:"In leech, locomotion is performed by", options:["Anterior sucker", "Posterior sucker", "Setae", "None of the above"], correct:0},
      {q:"The segments of leech are known as", options:["Metameres (somites)", "Proglottids", "Strobila", "All the above"], correct:0},
      {q:"The brain of leech lies above the", options:["Mouth", "Buccal Cavity", "Pharynx", "Crop"], correct:2},
      {q:"The body of leech has", options:["23 segments", "33 segments", "38 segments", "30 segments"], correct:1},
      {q:"Mammals are __________ animals.", options:["Cold blooded", "Warm blooded", "Poikilothermic", "All the above"], correct:1},
      {q:"The animals which give birth to young ones are", options:["Oviparous", "Viviparous", "Ovoviviparous", "All the above"], correct:1},
    ]
  },
  // Transportation in Plants and Circulation in Animals (6 questions)
  {
    id: "transportation_in_plants_and_circulation_in_animals",
    name: "Transportation in Plants and Circulation in Animals",
    unit: "Chapter 14 \u00b7 Biology",
    questions: [
      {q:"Active transport involves", options:["Movement of molecules from lower to higher concentration", "Expenditure of energy", "It is an uphill task", "All of the above"], correct:3},
      {q:"Water which is absorbed by roots is transported to aerial parts of the plant through", options:["Cortex", "Epidermis", "Phloem", "Xylem"], correct:3},
      {q:"During transpiration there is loss of", options:["Carbon dioxide", "Oxygen", "Water", "None of the above"], correct:2},
      {q:"The wall of human heart is made up of", options:["Endocardium", "Epicardium", "Myocardium", "All of the above"], correct:3},
      {q:"Which is the sequence of correct blood flow?", options:["Ventricle \u2013 atrium \u2013 vein \u2013 arteries", "Atrium \u2013 ventricle \u2013 veins \u2013 arteries", "Atrium \u2013 ventricle \u2013 arteries \u2013 veins", "Ventricles \u2013 vein \u2013 atrium \u2013 arteries"], correct:2},
      {q:"'Heart of heart' is called", options:["SA node", "AV node", "Purkinje fibres", "Bundle of His"], correct:0},
    ]
  },
  // Nervous System (7 questions)
  {
    id: "nervous_system",
    name: "Nervous System",
    unit: "Chapter 15 \u00b7 Biology",
    questions: [
      {q:"Bipolar neurons are found in", options:["Retina of eye", "Cerebral cortex", "Embryo", "Respiratory epithelium"], correct:0},
      {q:"Site for processing of vision, hearing, memory, speech, intelligence and thought is", options:["Kidney", "Ear", "Brain", "Lungs"], correct:2},
      {q:"In reflex action, the reflex arc is formed by", options:["Brain, spinal cord, muscle", "Receptor, muscle, spinal cord", "Muscle, receptor, brain", "Receptor, spinal cord, muscle"], correct:3},
      {q:"The outermost of the three cranial meninges is", options:["Arachnoid membrane", "Piamater", "Duramater", "Myelin sheath"], correct:2},
      {q:"The neurons which carry impulse from the central nervous system to the muscle fibre are", options:["Afferent neurons", "Association neuron", "Efferent neuron", "Unipolar neuron"], correct:2},
      {q:"Node of Ranvier is found in", options:["Muscles", "Axons", "Dendrites", "Cyton"], correct:1},
      {q:"Vomiting centre is located in", options:["Medulla oblongata", "Stomach", "Cerebrum", "Hypothalamus"], correct:0},
    ]
  },
  // Plant and Animal Hormones (5 questions)
  {
    id: "plant_and_animal_hormones",
    name: "Plant and Animal Hormones",
    unit: "Chapter 16 \u00b7 Biology",
    questions: [
      {q:"Gibberellins cause:", options:["Shortening of genetically tall plants", "Elongation of dwarf plants", "Promotion of rooting", "Yellowing of young leaves"], correct:1},
      {q:"Which one of the following hormones is naturally not found in plants?", options:["2,4-D", "GA 3", "Gibberellin", "IAA"], correct:0},
      {q:"LH is secreted by", options:["Adrenal gland", "Thyroid gland", "Anterior pituitary", "Hypothalamus"], correct:2},
      {q:"Which organ acts as both exocrine gland as well as endocrine gland?", options:["Pancreas", "Kidney", "Liver", "Lungs"], correct:0},
      {q:"Which one is referred as \u201cMaster Gland\u201d?", options:["Pineal gland", "Pituitary gland", "Thyroid gland", "Adrenal gland"], correct:1},
    ]
  },
  // Reproduction in Plants and Animals (6 questions)
  {
    id: "reproduction_in_plants_and_animals",
    name: "Reproduction in Plants and Animals",
    unit: "Chapter 17 \u00b7 Biology",
    questions: [
      {q:"The plant which propagates with the help of its leaves is", options:["Onion", "Neem", "Ginger", "Bryophyllum"], correct:3},
      {q:"Asexual reproduction takes place through budding in", options:["Amoeba", "Yeast", "Plasmodium", "Bacteria"], correct:1},
      {q:"Syngamy results in the formation of", options:["Zoospores", "Conidia", "Zygote", "Chlamydospores"], correct:2},
      {q:"The essential parts of a flower are", options:["Calyx and Corolla", "Calyx and Androecium", "Corolla and Gynoecium", "Androecium and Gynoecium"], correct:3},
      {q:"Male gametes in angiosperms are formed by the division of", options:["Generative cell", "Vegetative cell", "Microspore mother cell", "Microspore"], correct:0},
      {q:"Which one of the following is an IUCD?", options:["Copper \u2013 T", "Oral pills", "Diaphragm", "Tubectomy"], correct:0},
    ]
  },
  // Genetics (6 questions)
  {
    id: "genetics",
    name: "Genetics",
    unit: "Chapter 18 \u00b7 Biology",
    questions: [
      {q:"According to Mendel, alleles have the following character", options:["Pair of genes", "Responsible for character", "Production of gametes", "Recessive factors"], correct:1},
      {q:"9 : 3 : 3 : 1 ratio is due to", options:["Segregation", "Crossing over", "Independent assortment", "Recessiveness"], correct:2},
      {q:"The centromere is found at the centre of the __________ chromosome.", options:["Telocentric", "Metacentric", "Sub-metacentric", "Acrocentric"], correct:1},
      {q:"Okasaki fragments are joined together by", options:["Helicase", "DNA polymerase", "RNA primer", "DNA ligase"], correct:3},
      {q:"The number of chromosomes found in human beings are", options:["22 pairs of autosomes and 1 pair of allosomes", "22 autosomes and 1 allosome", "46 autosomes", "46 pairs of autosomes and 1 pair of allosomes"], correct:0},
      {q:"The loss of one or more chromosome in a ploidy is called", options:["Tetraploidy", "Aneuploidy", "Euploidy", "Polyploidy"], correct:1},
    ]
  },
  // Origin and Evolution of Life (4 questions)
  {
    id: "origin_and_evolution_of_life",
    name: "Origin and Evolution of Life",
    unit: "Chapter 19 \u00b7 Biology",
    questions: [
      {q:"Biogenetic law states that", options:["Ontogeny and phylogeny go together", "Ontogeny recapitulates phylogeny", "Phylogeny recapitulates ontogeny", "There is no relationship between phylogeny and ontogeny"], correct:1},
      {q:"The 'use and disuse theory' was proposed by", options:["Charles Darwin", "Ernst Haeckel", "Jean Baptiste Lamarck", "Gregor Mendel"], correct:2},
      {q:"Palaeontologists deal with", options:["Embryological evidences", "Fossil evidences", "Vestigial organ evidences", "All the above"], correct:1},
      {q:"The best way of direct dating fossils of recent origin is by", options:["Radio-carbon method", "Uranium lead method", "Potassium-argon method", "Both (a) and (c)"], correct:0},
    ]
  },
  // Breeding and Biotechnology (5 questions)
  {
    id: "breeding_and_biotechnology",
    name: "Breeding and Biotechnology",
    unit: "Chapter 20 \u00b7 Biology",
    questions: [
      {q:"Which method of crop improvement can be practised by a farmer if he is inexperienced?", options:["Clonal selection", "Mass selection", "Pureline selection", "Hybridisation"], correct:1},
      {q:"Himgiri, developed by hybridisation and selection for disease resistance against rust pathogens, is a variety of", options:["Chilli", "Maize", "Sugarcane", "Wheat"], correct:3},
      {q:"We can cut the DNA with the help of", options:["Scissors", "Restriction endonucleases", "Knife", "RNAase"], correct:1},
      {q:"rDNA is a", options:["Vector DNA", "Circular DNA", "Recombinant of vector DNA and desired DNA", "Satellite DNA"], correct:2},
      {q:"DNA fingerprinting is based on the principle of identifying __________ sequences of DNA", options:["Single stranded", "Mutated", "Polymorphic", "Repetitive"], correct:3},
    ]
  },
  // Health and Diseases (6 questions)
  {
    id: "health_and_diseases",
    name: "Health and Diseases",
    unit: "Chapter 21 \u00b7 Biology",
    questions: [
      {q:"Tobacco consumption is known to stimulate secretion of adrenaline. The component causing this could be", options:["Nicotine", "Tannic acid", "Curcumin", "Heptin"], correct:0},
      {q:"Cancer cells are more easily damaged by radiations than normal cells because they are", options:["Different in structure", "Non dividing", "Starved mutation", "Undergoing rapid division"], correct:3},
      {q:"Which type of cancer affects lymph nodes and spleen?", options:["Carcinoma", "Sarcoma", "Leukemia", "Lymphoma"], correct:2},
      {q:"Coronary heart disease is due to", options:["Streptococci bacteria", "Inflammation of pericardium", "Weakening of heart valves", "Insufficient blood supply to heart muscles"], correct:3},
      {q:"Cancer of the epithelial cells is called", options:["Leukemia", "Sarcoma", "Carcinoma", "Lipoma"], correct:2},
      {q:"Polyphagia is a condition seen in", options:["Obesity", "Diabetes mellitus", "Diabetes insipidus", "AIDS"], correct:1},
    ]
  },
  // Environmental Management (5 questions)
  {
    id: "environmental_management",
    name: "Environmental Management",
    unit: "Chapter 22 \u00b7 Biology",
    questions: [
      {q:"What are the steps you will adopt for better waste management?", options:["Reduce the amount of waste formed", "Reuse the waste", "Recycle the waste", "All of the above"], correct:3},
      {q:"Soil erosion can be prevented by", options:["Deforestation", "Afforestation", "Over grazing", "Removal of vegetation"], correct:1},
      {q:"A renewable source of energy is", options:["Petroleum", "Coal", "Nuclear fuel", "Trees"], correct:3},
      {q:"Green house effect refers to", options:["Cooling of earth", "Trapping of UV rays", "Cultivation of plants", "Warming of earth"], correct:3},
      {q:"Global warming will cause", options:["Rise in level of oceans", "Melting of glaciers", "Sinking of islands", "All of these"], correct:3},
    ]
  },
];

const SUBJECT_INFO = {
  cs:      {key:'cs',      name:'Computer Science', icon:'🖥️', short:'CS',   heroLine:'Computer Science — One Mark Practice',  themeColor:'#0EA5E9', tagline:'16 chapters • Python, SQL, Data Structures', chapters:CHAPTERS_CS,      unitLabel:'Ch',   sourceNote:'Source: Book Back 1 Mark Q&A PDF — real questions only'},
  maths:   {key:'maths',   name:'Mathematics',      icon:'📐', short:'Math', heroLine:'Mathematics — One Mark Practice',       themeColor:'#6366F1', tagline:'12 units • Matrices, Calculus, Probability & more', chapters:CHAPTERS_MATHS,   unitLabel:'Unit', sourceNote:'Source: 12th Std Book Back 1 Mark Q&A PDF — real questions only'},
  physics: {key:'physics', name:'Physics',          icon:'⚛️', short:'Phy',  heroLine:'Physics — One Mark Practice',           themeColor:'#8B5CF6', tagline:'11 chapters • Electrostatics, Optics, Modern Physics & more', chapters:CHAPTERS_PHYSICS, unitLabel:'Ch',   sourceNote:'Source: 12th Std Book Back 1 Mark Q&A PDF — real questions only'},
  chemistry: {key:'chemistry', name:'Chemistry',     icon:'⚗️', short:'Chem', heroLine:'Chemistry — One Mark Practice',        themeColor:'#10B981', tagline:'15 units • Metallurgy, Organic Chemistry, Biomolecules & more', chapters:CHAPTERS_CHEMISTRY, unitLabel:'Unit', sourceNote:'Source: 12th Std Book Back 1 Mark Q&A PDF — real questions only'},
  ca:      {key:'ca',      name:'Computer Applications', icon:'💻', short:'CA', heroLine:'Computer Applications — One Mark Practice', themeColor:'#F59E0B', tagline:'16 chapters • Multimedia, PHP, Networking, E-Commerce & more', chapters:CHAPTERS_CA, unitLabel:'Ch', sourceNote:'Source: 12th Std Book Back 1 Mark Q&A PDF — real questions only'},
  biology: {key:'biology', name:'Biology',          icon:'🧬', short:'Bio',  heroLine:'Biology — One Mark Practice',           themeColor:'#EC4899', tagline:'22 chapters • Botany & Zoology, Genetics, Human Health & more', chapters:CHAPTERS_BIOLOGY, unitLabel:'Ch', sourceNote:'Source: 12th Std Book Back 1 Mark Q&A PDF — real questions only'},
  commerce: {key:'commerce', name:'Commerce',       icon:'📊', short:'Com',  heroLine:'Commerce — One Mark Practice',          themeColor:'#F97316', tagline:'28 chapters • Management, Markets, Marketing, Company Law & more', chapters:CHAPTERS_COMMERCE, unitLabel:'Ch', sourceNote:'Source: 12th Std Book Back 1 Mark Q&A PDF — real questions only'},
  economics: {key:'economics', name:'Economics',    icon:'🌐', short:'Eco',  heroLine:'Economics — One Mark Practice',         themeColor:'#0D9488', tagline:'12 chapters • Macroeconomics, Banking, Fiscal & International Economics', chapters:CHAPTERS_ECONOMICS, unitLabel:'Ch', sourceNote:'Source: 12th Std Book Back 1 Mark Q&A PDF — real questions only'},
  ss: {key:'ss', name:'Social Science', icon:'📚', short:'SS', heroLine:'Social Science — One Mark Practice', themeColor:'#D97706', tagline:'History, Geography, Civics & Economics — MCQ, Fill, Match & Caption', chapters:CHAPTERS_SS, unitLabel:'Unit', sourceNote:'Source: 10th Std Book Back / Practice — MCQ, Fill-ups, Match & Caption', standards:['10']},
  science10: {key:'science10', name:'Science', icon:'🔬', short:'Sci', heroLine:'Science — One Mark Practice', themeColor:'#059669', tagline:'22 chapters • Physics, Chemistry & Biology', chapters:CHAPTERS_SCIENCE_10, unitLabel:'Ch', sourceNote:'Source: 10th Std Book Back — Choose the Best Answer (Physics, Chemistry, Biology)', standards:['10']}
};
let currentSubject = 'cs';
let currentStandard = '12'; // '10' or '12'

function getStudentStandard(){
  const cls = (student && student.cls) ? student.cls : '';
  if(cls.startsWith('10')) return '10';
  if(cls.startsWith('12')) return '12';
  return currentStandard || '12';
}

function activeChapters(){ return SUBJECT_INFO[currentSubject].chapters; }

/* ================= SUBJECT THEME ENGINE =================
   Swaps the whole app's color world + hero/brand text. Pass null/'none'
   to return to the neutral multi-subject hub look (used on the subject
   picker screen). Every other screen keeps whichever theme was last set. */
function applySubjectTheme(key){
  const root = document.documentElement;
  if(!key || !SUBJECT_INFO[key]){
    root.removeAttribute('data-subject');
    const heroTitle = document.getElementById('heroTitle');
    const heroTagline = document.getElementById('heroTagline');
    const brandBadge = document.getElementById('brandBadge');
    const brandTitle = document.getElementById('brandTitle');
    if(heroTitle) heroTitle.textContent = '12th Standard — One Mark Practice';
    if(heroTagline) heroTagline.textContent = 'Practice • Learn • Improve • Score Better';
    if(brandBadge) brandBadge.textContent = 'VM';
    if(brandTitle) brandTitle.textContent = 'Exam Practice Portal';
    setMetaThemeColor(null);
    return;
  }
  const info = SUBJECT_INFO[key];
  root.setAttribute('data-subject', key);
  const heroTitle = document.getElementById('heroTitle');
  const heroTagline = document.getElementById('heroTagline');
  const brandBadge = document.getElementById('brandBadge');
  const brandTitle = document.getElementById('brandTitle');
  if(heroTitle) heroTitle.textContent = `12th ${info.heroLine}`;
  if(heroTagline) heroTagline.textContent = `${info.tagline.replace(/^\d+\s*(chapters?|units?)\s*•\s*/i,'')}`;
  if(brandBadge) brandBadge.textContent = info.icon;
  if(brandTitle) brandTitle.textContent = `${info.name} Practice Portal`;
  setMetaThemeColor(info.themeColor);
}
function setMetaThemeColor(hex){
  const meta = document.querySelector('meta[name="theme-color"]');
  if(meta) meta.setAttribute('content', hex || '#4F46E5');
}

let activeChapter = null;
let testQuestions = [];
let currentIndex = 0;
let answers = {};
let bookmarks = {};
let timeLeft = 600;
let timerInterval = null;
let startTime = null;
let currentFilter = 'all';
let lastResultData = null;
let student = {name:'', cls:''};
let soundOn = true;
let vibrationOn = true;

/* ================= STORAGE (Firestore for signed-in students, localStorage for guests) =================
   CLOUD.data is an in-memory cache. lsGet/lsSet read/write that cache.
   CLOUD.mode determines where writes go: 'cloud' (Firestore, signed-in) or 'guest' (localStorage, this device only). */
const CLOUD = { uid: null, data: {}, saveTimer: null, mode: 'none' };
const GUEST_KEY = 'cs_guest_data';

function lsGet(key, fallback){
  const v = CLOUD.data[key];
  return (v===undefined || v===null) ? fallback : v;
}
function lsSet(key, val){
  CLOUD.data[key] = val;
  scheduleSave();
}
function scheduleSave(){
  if(CLOUD.mode === 'cloud' && CLOUD.uid){
    clearTimeout(CLOUD.saveTimer);
    CLOUD.saveTimer = setTimeout(()=>{
      fbDB.collection('students').doc(CLOUD.uid).set(CLOUD.data, {merge:true})
        .catch(e=>console.warn('Cloud save failed', e));
    }, 800);
  } else if(CLOUD.mode === 'guest'){
    clearTimeout(CLOUD.saveTimer);
    CLOUD.saveTimer = setTimeout(()=>{
      try{ localStorage.setItem(GUEST_KEY, JSON.stringify(CLOUD.data)); }
      catch(e){ console.warn('Guest save failed', e); }
    }, 300);
  }
}
/* Checks the shared 'banned' collection for this student's own uid.
   Each student can only read their own ban record (see Firestore rules) —
   this is enough to enforce a teacher's restriction without exposing who
   else is banned to non-admins. */
async function isUserBanned(uid){
  try{
    const doc = await fbDB.collection('banned').doc(uid).get();
    return doc.exists;
  }catch(e){
    console.warn('Ban check failed (defaulting to not-banned)', e);
    return false;
  }
}
async function loadCloudData(uid){
  CLOUD.mode = 'cloud';
  CLOUD.uid = uid;
  CLOUD.data = {};
  try{
    const doc = await fbDB.collection('students').doc(uid).get();
    if(doc.exists) CLOUD.data = doc.data() || {};
  }catch(e){
    console.warn('Cloud load failed', e);
  }
}
function loadGuestData(){
  CLOUD.mode = 'guest';
  CLOUD.uid = null;
  try{
    const raw = localStorage.getItem(GUEST_KEY);
    CLOUD.data = raw ? JSON.parse(raw) : {};
  }catch(e){
    CLOUD.data = {};
  }
}

/* ---- guest activity mirror: lets teachers see who's using the portal as
   a guest (never signed in), since guest data otherwise never leaves the
   device. A random id is generated once per device/browser and reused, so
   repeat visits update the same row instead of creating duplicates.
   Requires a Firestore rule allowing writes to 'guestActivity' — see the
   teacher-access notes for the exact rule to add. Fails silently if that
   rule isn't in place yet, so it never blocks guest mode from working. ---- */
const GUEST_ID_KEY = 'cs_guest_id';
function getGuestId(){
  let id = localStorage.getItem(GUEST_ID_KEY);
  if(!id){
    id = 'guest_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
    try{ localStorage.setItem(GUEST_ID_KEY, id); }catch(e){}
  }
  return id;
}
function mirrorGuestActivity(){
  if(!isGuest || typeof fbDB === 'undefined' || !fbDB) return;
  const payload = {
    name: student.name || 'Guest',
    cls: student.cls || '-',
    xp: getXP(),
    testsCompleted: getLeaderboard().length,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };
  fbDB.collection('guestActivity').doc(getGuestId()).set(payload, {merge:true})
    .catch(e=>console.warn('Guest activity mirror failed (Firestore rule for guestActivity may be missing)', e));
}

let isGuest = false;
/* --- smooth welcome screen exit --- */
function hideWelcomeScreen(cb){
  const ws = document.getElementById('welcomeScreen');
  if(!ws || ws.style.display==='none') { cb && cb(); return; }
  ws.classList.add('exiting');
  setTimeout(()=>{ ws.style.display='none'; ws.classList.remove('exiting'); cb && cb(); }, 520);
}

function continueAsGuest(){
  isGuest = true;
  loadGuestData();
  document.getElementById('googleStep').classList.add('hidden');

  const saved = lsGet('student', null);
  if(saved && saved.name && saved.cls){
    student = saved;
    applyStudentUI();
    applyLoadedPreferences();
    hideWelcomeScreen();
    currentStandard = getStudentStandard() || lsGet('cs_standard', null);
    if(currentStandard){
      renderSubjectGrid();
      switchScreen('subjectScreen');
    } else {
      switchScreen('standardScreen');
    }
    mirrorGuestActivity();
  } else {
    document.getElementById('classStep').classList.remove('hidden');
    document.getElementById('studentName').value = '';
  }
}


/* ================= FIREBASE — Google Sign-In ================= */
const firebaseConfig = {
  apiKey: "AIzaSyAeTikpnQ-vlfp9oszV3XO8CiaOjmvkEYM",
  authDomain: "vmhssmcq.firebaseapp.com",
  projectId: "vmhssmcq",
  storageBucket: "vmhssmcq.firebasestorage.app",
  messagingSenderId: "290024556016",
  appId: "1:290024556016:web:12378648bea9e491a60935",
  measurementId: "G-G3MHG5L9GP"
};
let fbAuth = null;
let fbDB = null;
try{
  if(typeof firebase === 'undefined'){
    throw new Error('Firebase SDK did not load (check network/ad-blocker, or that the firebase-app/auth/firestore <script> tags are present and reachable).');
  }
  firebase.initializeApp(firebaseConfig);
  fbAuth = firebase.auth();
  fbDB = firebase.firestore();
  fbAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(e=>console.warn('Persistence setup failed', e));
}catch(e){
  console.error('Firebase failed to initialize — Google Sign-In will be unavailable, but Guest mode still works:', e);
}

/* ================= PUSH NOTIFICATIONS (test reminders) =================
   Uses Firebase Cloud Messaging. Requires:
   1. A VAPID key pasted below (Firebase Console → Project Settings → Cloud
      Messaging → Web configuration → "Generate key pair").
   2. firebase-messaging-sw.js hosted at the site root (provided separately).
   3. The "sendTestReminders" Cloud Function deployed (see /functions). */
const FCM_VAPID_KEY = "PASTE_YOUR_VAPID_KEY_HERE";
let fbMessaging = null;
let fbMessagingReady = Promise.resolve(false);
try{
  fbMessagingReady = firebase.messaging.isSupported().then(supported=>{
    if(supported){ fbMessaging = firebase.messaging(); }
    return supported;
  }).catch(()=>false);
}catch(e){ fbMessagingReady = Promise.resolve(false); }

async function signInWithGoogle(){
  const btn = document.getElementById('googleSignInBtn');
  const label = document.getElementById('googleBtnLabel');
  const err = document.getElementById('googleSignInError');
  err.textContent = '';
  if(!fbAuth){
    err.textContent = "Sign-in isn't available right now (couldn't connect to Google's servers). Please check your internet connection, disable any ad-blocker for this site, and reload the page — or use Continue as Guest below.";
    return;
  }
  btn.disabled = true;
  const prevLabel = label.textContent;
  label.innerHTML = '';
  const spin = document.createElement('span'); spin.className = 'spinner'; label.appendChild(spin);

  const provider = new firebase.auth.GoogleAuthProvider();
  try{
    await fbAuth.signInWithPopup(provider);
    // onAuthStateChanged (below) takes it from here
  }catch(e){
    console.warn('Google sign-in failed', e);
    const code = e && e.code ? e.code : '';
    if(code === 'auth/popup-blocked'){
      err.textContent = "Your browser blocked the sign-in popup. Please allow popups for this site and try again.";
    } else if(code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request'){
      err.textContent = "The sign-in window was closed before finishing. Please try again and complete the Google sign-in.";
    } else if(code === 'auth/unauthorized-domain'){
      err.textContent = "This website's domain isn't authorized for sign-in yet. (Site owner: add it under Firebase Console → Authentication → Settings → Authorized domains.)";
    } else if(code === 'auth/operation-not-allowed'){
      err.textContent = "Google sign-in isn't enabled for this app yet. (Site owner: enable it under Firebase Console → Authentication → Sign-in method → Google.)";
    } else if(code === 'auth/network-request-failed'){
      err.textContent = "Network error during sign-in. Please check your internet connection and try again.";
    } else if(code === 'auth/api-key-not-valid.-please-pass-a-valid-api-key.' || code === 'auth/invalid-api-key'){
      err.textContent = "This site's Firebase API key isn't valid. (Site owner: check Project Settings → General → Your apps, and Google Cloud Console → APIs & Services → Credentials.)";
    } else {
      err.textContent = `Google sign-in failed${code ? ' (' + code + ')' : ''}. Please try again.`;
    }
  }finally{
    btn.disabled = false;
    label.textContent = prevLabel;
  }
}

let googleUser = null;
if(fbAuth){
fbAuth.onAuthStateChanged(async (user)=>{
  googleUser = user;
  if(!user){
    // signed out — show the Google sign-in step
    document.getElementById('googleStep').classList.remove('hidden');
    document.getElementById('cloudLoading').classList.add('hidden');
    document.getElementById('classStep').classList.add('hidden');
    document.getElementById('blockedStep').classList.add('hidden');
    return;
  }
  // signed in — first check whether a teacher has restricted this account
  document.getElementById('googleStep').classList.add('hidden');
  document.getElementById('cloudLoading').classList.remove('hidden');
  const banned = await isUserBanned(user.uid);
  if(banned){
    document.getElementById('cloudLoading').classList.add('hidden');
    document.getElementById('blockedStep').classList.remove('hidden');
    return;
  }

  // not banned — fetch this student's saved data from Firestore
  document.getElementById('blockedStep').classList.add('hidden');
  await loadCloudData(user.uid);
  document.getElementById('cloudLoading').classList.add('hidden');

  const saved = lsGet('student', null);
  if(saved && saved.name && saved.cls){
    student = saved;
    applyStudentUI();
    applyLoadedPreferences();
    hideWelcomeScreen();
    currentStandard = getStudentStandard() || lsGet('cs_standard', null);
    if(currentStandard){
      renderSubjectGrid();
      switchScreen('subjectScreen');
    } else {
      switchScreen('standardScreen');
    }
    mirrorToClassLeaderboard();
    mirrorGuestActivity();
    // if reminders were enabled before, silently refresh the push token
    // (tokens can rotate; this keeps them receiving reminders without
    // having to flip the toggle again)
    if(lsGet('cs_notif_enabled', false) && typeof Notification !== 'undefined' && Notification.permission === 'granted'){
      enableTestReminders();
    }
  } else {
    document.getElementById('classStep').classList.remove('hidden');
    document.getElementById('studentName').value = user.displayName || '';
  }
});
} else {
  console.warn('fbAuth unavailable — skipping onAuthStateChanged listener (Guest mode still works).');
}

const LEVEL_XP = 150;
function getXP(){ return lsGet('cs_xp', 0); }
function addXP(amount){ const total = getXP()+amount; lsSet('cs_xp', total); return total; }
function getLevel(xp){ return Math.floor(xp/LEVEL_XP)+1; }

function getStreak(){ return lsGet('cs_streak', {count:0, last:null}); }
function updateStreak(){
  const today = new Date().toISOString().slice(0,10);
  const s = getStreak();
  if(s.last !== today){
    const y = new Date(); y.setDate(y.getDate()-1);
    const yStr = y.toISOString().slice(0,10);
    s.count = (s.last === yStr) ? s.count+1 : 1;
    s.last = today;
    lsSet('cs_streak', s);
  }
  return s;
}

function getProgress(){ return lsGet('cs_progress', {}); }
function saveAttempt(chapterId, data){
  if(typeof chapterId !== 'number') return; // only track real numbered chapters
  const store = getProgress();
  const pct = Math.round((data.correct/data.total)*100);
  const rec = store[chapterId] || {best:null, attempts:0};
  rec.attempts = (rec.attempts||0)+1;
  if(!rec.best || pct > rec.best.pct || (pct===rec.best.pct && data.elapsed < rec.best.elapsed)){
    rec.best = {correct:data.correct, total:data.total, pct, elapsed:data.elapsed, date:Date.now()};
  }
  store[chapterId] = rec;
  lsSet('cs_progress', store);
}

function getEarnedBadges(){ return lsGet('cs_badges', []); }
const BADGE_DEFS = [
  {id:'chapter_master', icon:'🏅', name:'Chapter Master', desc:'Score 100% on any chapter'},
  {id:'speed_runner', icon:'⚡', name:'Speed Runner', desc:'80%+ score in under half the time'},
  {id:'perfectionist', icon:'💎', name:'Perfectionist', desc:'100% on 3 different chapters'},
  {id:'streak_3', icon:'🔥', name:'On a Roll', desc:'3-day practice streak'},
  {id:'centurion', icon:'⭐', name:'Centurion', desc:'Earn 500+ total XP'}
];
function computeEarnedBadgeIds(){
  const progress = getProgress();
  const bestList = Object.values(progress).map(r=>r.best).filter(Boolean);
  const masterCount = bestList.filter(b=>b.pct===100).length;
  const earned = [];
  if(masterCount>=1) earned.push('chapter_master');
  if(bestList.some(b=>b.pct>=80 && b.elapsed <= (b.total*60)/2)) earned.push('speed_runner');
  if(masterCount>=3) earned.push('perfectionist');
  if(getStreak().count>=3) earned.push('streak_3');
  if(getXP()>=500) earned.push('centurion');
  return earned;
}
function checkAndToastNewBadges(){
  const before = getEarnedBadges();
  const now = computeEarnedBadgeIds();
  const fresh = now.filter(id=>!before.includes(id));
  lsSet('cs_badges', now);
  fresh.forEach(id=>{
    const def = BADGE_DEFS.find(b=>b.id===id);
    if(def) showToast(`🏅 Badge unlocked: ${def.name}!`, 'badge');
  });
  return fresh.length>0;
}

function getWrongPool(){ return lsGet('cs_wrong_pool', {}); }
function updateWrongPool(details, fallbackChapterId, fallbackChapterName){
  const pool = getWrongPool();
  details.forEach(d=>{
    const cid = d.chapterId ?? fallbackChapterId;
    const cname = d.chapterName ?? fallbackChapterName;
    const key = `${cid}::${d.q}`;
    if(d.status==='correct'){
      delete pool[key];
    } else {
      const existing = pool[key];
      pool[key] = {
        q:d.q, options:d.options, correct:d.correct, exp:d.exp,
        chapterId:cid, chapterName:cname,
        timesWrong: (existing?.timesWrong||0)+1, lastWrong: Date.now()
      };
    }
  });
  // cap pool size
  const keys = Object.keys(pool);
  if(keys.length > 120){
    keys.sort((a,b)=>pool[a].lastWrong - pool[b].lastWrong)
        .slice(0, keys.length-120).forEach(k=>delete pool[k]);
  }
  lsSet('cs_wrong_pool', pool);
}
function getWeakPool(){
  const pool = getWrongPool();
  return Object.values(pool).sort((a,b)=>b.timesWrong-a.timesWrong || b.lastWrong-a.lastWrong);
}

function getLeaderboard(){ return lsGet('cs_leaderboard', []); }
function addToLeaderboard(entry){
  const board = getLeaderboard();
  board.push(entry);
  lsSet('cs_leaderboard', board.slice(-300));
}

/* ---- mirror a lightweight summary to a shared 'leaderboard' collection so
   every student's progress is visible class-wide (not just on their own device).
   Guests are skipped — they have no stable identity across visits. */
function mirrorToClassLeaderboard(){
  if(CLOUD.mode !== 'cloud' || !CLOUD.uid) return;
  if(!lsGet('cs_leaderboard_visible', true)) return; // student opted out in Settings
  const payload = {
    name: student.name || 'Student',
    cls: student.cls || '-',
    xp: getXP(),
    level: getLevel(getXP()),
    testsCompleted: getLeaderboard().length,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };
  fbDB.collection('leaderboard').doc(CLOUD.uid).set(payload, {merge:true})
    .catch(e=>console.warn('Class leaderboard mirror failed', e));
}

/* ================= TEACHER / ADMIN VIEW =================
   ⚠️ This password check runs entirely in the browser — anyone who views the
   page source can read ADMIN_PASSWORD. It only stops casual browsing, it is
   NOT real security. Firestore's 'leaderboard' collection is intentionally
   limited to name/class/XP/level/test-count — nothing sensitive — so this
   is an acceptable trade-off for a free, backend-less school project.
   Change the password below before you publish this. */
const ADMIN_PASSWORD = "vmhss2026";
/* This must exactly match the isAdmin() list in your Firestore rules. The
   password gate only hides/shows the panel in the browser — these emails are
   what Firestore actually checks before allowing any delete/ban. */
const ADMIN_EMAILS = ["immortalassassin064@gmail.com", "magnate2242@gmail.com", "pmsureshmscit1@gmail.com"];

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function openAdminLogin(){
  document.getElementById('adminLoginError').textContent = '';
  const pwField = document.getElementById('adminPassword');
  pwField.value = '';
  pwField.type = 'password';
  const toggleBtn = document.getElementById('adminPwToggle');
  if(toggleBtn){ toggleBtn.textContent = '👁️'; toggleBtn.setAttribute('aria-label','Show password'); }
  document.getElementById('adminLoginModal').classList.remove('hidden');
  setTimeout(()=>document.getElementById('adminPassword')?.focus(), 50);
}
function closeAdminLogin(){
  document.getElementById('adminLoginModal').classList.add('hidden');
}
function toggleAdminPasswordVisibility(){
  const pwField = document.getElementById('adminPassword');
  const btn = document.getElementById('adminPwToggle');
  const nowVisible = pwField.type === 'password';
  pwField.type = nowVisible ? 'text' : 'password';
  if(btn){
    btn.textContent = nowVisible ? '🙈' : '👁️';
    btn.setAttribute('aria-label', nowVisible ? 'Hide password' : 'Show password');
  }
}
async function adminLogin(){
  const pass = document.getElementById('adminPassword').value;
  if(pass !== ADMIN_PASSWORD){
    document.getElementById('adminLoginError').textContent = 'Incorrect password.';
    return;
  }
  closeAdminLogin();
  await openAdminScreen();
}

let adminData = [];
let bannedData = [];
let guestActivityData = [];
let adminSort = {key:'xp', dir:'desc'};
let guestActivitySort = {key:'updatedAt', dir:'desc'};

function isSignedInAsAdmin(){
  return CLOUD.mode === 'cloud' && googleUser && ADMIN_EMAILS.includes(googleUser.email);
}

function applyAdminModeVisibility(){
  const admin = isSignedInAsAdmin();
  document.getElementById('adminActionsHeaderCell')?.classList.toggle('hidden', !admin);
  document.getElementById('bannedSection')?.classList.toggle('hidden', !admin);
  document.getElementById('testReminderSection')?.classList.toggle('hidden', !admin);
  document.getElementById('paperGeneratorSection')?.classList.toggle('hidden', !admin);
  document.getElementById('guestActivitySection')?.classList.toggle('hidden', !admin);
}

async function openAdminScreen(){
  document.getElementById('adminScreen').classList.remove('hidden');
  applyAdminModeVisibility();
  const colCount = isSignedInAsAdmin() ? 7 : 6;
  document.getElementById('adminTableBody').innerHTML = `<tr><td colspan="${colCount}">Loading…</td></tr>`;
  document.getElementById('bannedTableBody').innerHTML = `<tr><td colspan="4">Loading…</td></tr>`;
  try{
    const snap = await fbDB.collection('leaderboard').get();
    adminData = snap.docs.map(doc=>({id:doc.id, ...doc.data()}));
  }catch(e){
    console.warn('Admin fetch failed', e);
    adminData = [];
    document.getElementById('adminTableBody').innerHTML = `<tr><td colspan="${colCount}">Couldn't load student data — check the browser console for details.</td></tr>`;
  }
  renderAdminTable();

  if(isSignedInAsAdmin()){
    try{
      const bsnap = await fbDB.collection('banned').get();
      bannedData = bsnap.docs.map(doc=>({id:doc.id, ...doc.data()}));
    }catch(e){
      console.warn('Banned list fetch failed', e);
      bannedData = [];
    }
    renderBannedTable();
    loadTestReminders();
    populatePaperSubjectDropdown();
    populatePaperChapters();

    document.getElementById('guestActivityTableBody').innerHTML = `<tr><td colspan="5">Loading…</td></tr>`;
    try{
      const gsnap = await fbDB.collection('guestActivity').get();
      guestActivityData = gsnap.docs.map(doc=>({id:doc.id, ...doc.data()}));
    }catch(e){
      console.warn('Guest activity fetch failed (Firestore rule for guestActivity may be missing)', e);
      guestActivityData = [];
      document.getElementById('guestActivityTableBody').innerHTML = `<tr><td colspan="5">Couldn't load guest activity — this needs a Firestore rule allowing admins to read the 'guestActivity' collection.</td></tr>`;
    }
    renderGuestActivityTable();
  }
}
function closeAdminScreen(){
  document.getElementById('adminScreen').classList.add('hidden');
}
function sortAdminBy(key){
  if(adminSort.key === key){ adminSort.dir = adminSort.dir === 'asc' ? 'desc' : 'asc'; }
  else { adminSort.key = key; adminSort.dir = (key==='name'||key==='cls') ? 'asc' : 'desc'; }
  renderAdminTable();
}
function renderAdminTable(){
  const admin = isSignedInAsAdmin();
  const searchEl = document.getElementById('adminSearch');
  const q = (searchEl && searchEl.value || '').trim().toLowerCase();
  let rows = adminData.filter(d => !q || (d.name||'').toLowerCase().includes(q) || (d.cls||'').toLowerCase().includes(q));
  const {key, dir} = adminSort;
  rows = rows.slice().sort((a,b)=>{
    let av = a[key], bv = b[key];
    if(key === 'updatedAt'){
      av = (av && av.toMillis) ? av.toMillis() : 0;
      bv = (bv && bv.toMillis) ? bv.toMillis() : 0;
    }
    if(typeof av === 'string' || typeof bv === 'string'){
      return dir==='asc' ? String(av||'').localeCompare(String(bv||'')) : String(bv||'').localeCompare(String(av||''));
    }
    return dir==='asc' ? (av||0)-(bv||0) : (bv||0)-(av||0);
  });
  const countEl = document.getElementById('adminCount');
  if(countEl){
    const avgXP = rows.length ? Math.round(rows.reduce((s,d)=>s+(d.xp||0),0)/rows.length) : 0;
    countEl.textContent = `${rows.length} student${rows.length===1?'':'s'} • avg ${avgXP} XP`;
  }
  const colCount = admin ? 7 : 6;
  document.getElementById('adminTableBody').innerHTML = rows.length ? rows.map(d=>{
    const last = (d.updatedAt && d.updatedAt.toDate) ? d.updatedAt.toDate().toLocaleString() : '—';
    const safeName = escapeHtml(d.name||'Unknown');
    const actionsCell = admin ? `<td><div class="admin-row-actions">
        <button class="admin-action-btn" onclick="removeFromLeaderboard('${d.id}', '${safeName.replace(/'/g,"\\'")}')" title="Remove this entry from the leaderboard only">Remove</button>
        <button class="admin-action-btn ban" onclick="banStudent('${d.id}', '${safeName.replace(/'/g,"\\'")}')" title="Remove from leaderboard AND block them from using the app again">Ban</button>
      </div></td>` : '';
    return `<tr>
      <td>${safeName}</td><td>${escapeHtml(d.cls||'-')}</td><td>${d.xp||0}</td><td>${d.level||1}</td><td>${d.testsCompleted||0}</td><td>${last}</td>
      ${actionsCell}
    </tr>`;
  }).join('') : `<tr><td colspan="${colCount}">No students match.</td></tr>`;
}
function renderBannedTable(){
  const body = document.getElementById('bannedTableBody');
  if(!bannedData.length){
    body.innerHTML = `<tr><td colspan="4">No banned accounts.</td></tr>`;
    return;
  }
  body.innerHTML = bannedData.map(d=>{
    const when = (d.bannedAt && d.bannedAt.toDate) ? d.bannedAt.toDate().toLocaleString() : '—';
    const safeName = escapeHtml(d.name||'Unknown');
    return `<tr>
      <td>${safeName}</td><td>${escapeHtml(d.cls||'-')}</td><td>${when}</td>
      <td><button class="admin-action-btn unban" onclick="unbanStudent('${d.id}', '${safeName.replace(/'/g,"\\'")}')">Unban</button></td>
    </tr>`;
  }).join('');
}

function sortGuestActivityBy(key){
  if(guestActivitySort.key === key){ guestActivitySort.dir = guestActivitySort.dir === 'asc' ? 'desc' : 'asc'; }
  else { guestActivitySort.key = key; guestActivitySort.dir = (key==='name'||key==='cls') ? 'asc' : 'desc'; }
  renderGuestActivityTable();
}
function renderGuestActivityTable(){
  const body = document.getElementById('guestActivityTableBody');
  if(!guestActivityData.length){
    body.innerHTML = `<tr><td colspan="5">No guest activity recorded yet.</td></tr>`;
    return;
  }
  const {key, dir} = guestActivitySort;
  const rows = guestActivityData.slice().sort((a,b)=>{
    let av = a[key], bv = b[key];
    if(key === 'updatedAt'){ av = av && av.toDate ? av.toDate().getTime() : 0; bv = bv && bv.toDate ? bv.toDate().getTime() : 0; }
    if(typeof av === 'string') return dir==='asc' ? av.localeCompare(bv||'') : (bv||'').localeCompare(av);
    return dir==='asc' ? (av||0)-(bv||0) : (bv||0)-(av||0);
  });
  body.innerHTML = rows.map(d=>{
    const when = (d.updatedAt && d.updatedAt.toDate) ? d.updatedAt.toDate().toLocaleString() : '—';
    return `<tr>
      <td>${escapeHtml(d.name||'Guest')}</td><td>${escapeHtml(d.cls||'-')}</td>
      <td>${d.xp||0}</td><td>${d.testsCompleted||0}</td><td>${when}</td>
    </tr>`;
  }).join('');
}

function adminActionError(e){
  console.warn('Admin action failed', e);
  if(e && e.code === 'permission-denied'){
    showToast(`Blocked by Firestore — sign in as an authorized teacher account to do this.`, 'info');
  } else {
    showToast('Something went wrong. Please try again.', 'info');
  }
}

async function removeFromLeaderboard(uid, name){
  if(!confirm(`Remove ${name} from the class leaderboard? They can reappear next time they complete a test — use "Ban" to stop that.`)) return;
  try{
    await fbDB.collection('leaderboard').doc(uid).delete();
    adminData = adminData.filter(d => d.id !== uid);
    renderAdminTable();
    showToast(`${name} removed from the leaderboard.`, 'success');
  }catch(e){ adminActionError(e); }
}

async function banStudent(uid, name){
  if(!confirm(`Ban ${name}? This removes them from the leaderboard now and blocks them from using the app on future sign-ins, until you unban them.`)) return;
  try{
    await fbDB.collection('banned').doc(uid).set({
      name, cls: (adminData.find(d=>d.id===uid) || {}).cls || '-',
      bannedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    await fbDB.collection('leaderboard').doc(uid).delete().catch(()=>{});
    adminData = adminData.filter(d => d.id !== uid);
    renderAdminTable();
    const bsnap = await fbDB.collection('banned').get();
    bannedData = bsnap.docs.map(doc=>({id:doc.id, ...doc.data()}));
    renderBannedTable();
    showToast(`${name} has been banned.`, 'success');
  }catch(e){ adminActionError(e); }
}

async function unbanStudent(uid, name){
  if(!confirm(`Unban ${name}? They'll be able to sign in and use the app again.`)) return;
  try{
    await fbDB.collection('banned').doc(uid).delete();
    bannedData = bannedData.filter(d => d.id !== uid);
    renderBannedTable();
    showToast(`${name} has been unbanned.`, 'success');
  }catch(e){ adminActionError(e); }
}
function exportAdminCSV(){
  if(!adminData.length){ alert('No student data loaded yet.'); return; }
  const header = ['Name','Class','XP','Level','Tests Completed','Last Active'];
  const rows = adminData.map(d=>{
    const last = (d.updatedAt && d.updatedAt.toDate) ? d.updatedAt.toDate().toLocaleString() : '';
    return [d.name||'', d.cls||'', d.xp||0, d.level||1, d.testsCompleted||0, last];
  });
  const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `students-progress-${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ================= TOASTS ================= */
function showToast(msg, type){
  const wrap = document.getElementById('toastWrap');
  if(!wrap) return;
  const t = document.createElement('div');
  t.className = 'toast' + (type==='badge' ? ' badge-toast' : type==='level' ? ' level-toast' : '');
  t.textContent = msg;
  wrap.appendChild(t);
  setTimeout(()=>t.remove(), 3000);
}

/* ================= SOUND (Web Audio API) ================= */
let audioCtx = null;
function getAudioCtx(){
  if(!audioCtx){
    try{ audioCtx = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){}
  }
  return audioCtx;
}
function playTone(freq, dur, type, vol){
  if(!soundOn) return;
  try{
    const ctx = getAudioCtx();
    if(!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    gain.gain.value = vol!==undefined ? vol : 0.05;
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (dur||0.12));
    osc.stop(ctx.currentTime + (dur||0.12) + 0.02);
  }catch(e){}
}
function soundSelect(){ playTone(600, 0.07, 'sine', 0.04); }
function soundSuccess(){ playTone(523.25,0.12,'sine',0.05); setTimeout(()=>playTone(659.25,0.12,'sine',0.05),100); setTimeout(()=>playTone(783.99,0.18,'sine',0.05),200); }
function soundLevelUp(){ [523,659,784,1046].forEach((f,i)=>setTimeout(()=>playTone(f,0.15,'triangle',0.05),i*90)); }
function toggleSound(){
  const cb = document.getElementById('soundToggle');
  soundOn = cb ? cb.checked : !soundOn;
  lsSet('cs_sound_on', soundOn);
  const oldBtn = document.getElementById('soundBtn');
  if(oldBtn) oldBtn.textContent = soundOn ? '🔊' : '🔇';
  if(soundOn) soundSelect();
}
function toggleVibration(){
  const cb = document.getElementById('vibrationToggle');
  vibrationOn = cb ? cb.checked : !vibrationOn;
  lsSet('cs_vibration_on', vibrationOn);
  if(vibrationOn) vibrate(12);
}
function toggleReduceMotion(){
  const on = document.getElementById('reduceMotionToggle').checked;
  lsSet('cs_reduce_motion', on);
  document.documentElement.setAttribute('data-reduce-motion', on ? 'true' : '');
}
function toggleLeaderboardVisibility(){
  const visible = document.getElementById('leaderboardVisibleToggle').checked;
  lsSet('cs_leaderboard_visible', visible);
  if(visible){
    mirrorToClassLeaderboard();
    mirrorGuestActivity();
  } else if(CLOUD.mode === 'cloud' && CLOUD.uid){
    fbDB.collection('leaderboard').doc(CLOUD.uid).delete().catch(e=>console.warn('Leaderboard hide failed', e));
  }
}

/* ================= TEST REMINDER NOTIFICATIONS ================= */
/* Shows the nearest upcoming testReminders entry (matching the student's
   class, or an "all classes" one) as a banner on the chapter screen —
   a persistent visual reminder that complements the push notification. */
async function loadUpcomingTestBanner(){
  const banner = document.getElementById('upcomingTestBanner');
  if(!banner) return;
  banner.classList.add('hidden');
  if(!(CLOUD.mode === 'cloud' && CLOUD.uid)) return; // needs sign-in to read Firestore
  try{
    const now = firebase.firestore.Timestamp.now();
    const snap = await fbDB.collection('testReminders')
      .where('testAt', '>', now)
      .orderBy('testAt', 'asc')
      .limit(10)
      .get();
    const studentClass = student.cls || '';
    const match = snap.docs.map(d=>d.data()).find(r => r.targetClass === 'all' || r.targetClass === studentClass);
    if(!match || !match.testAt || !match.testAt.toDate) return;
    const testDate = match.testAt.toDate();
    const countdown = formatCountdown(testDate - new Date());
    banner.innerHTML = `📅 Upcoming: <b>${escapeHtml(match.title || 'Test')}</b> — ${testDate.toLocaleString('en-IN', {dateStyle:'medium', timeStyle:'short'})}<span class="utb-countdown">${countdown}</span>`;
    banner.classList.remove('hidden');
  }catch(e){
    console.warn('Loading upcoming test banner failed', e);
  }
}
function formatCountdown(ms){
  if(ms <= 0) return 'Starting now';
  const mins = Math.floor(ms/60000);
  if(mins < 60) return `in ${mins} min`;
  const hours = Math.floor(mins/60);
  if(hours < 24) return `in ${hours} hr${hours>1?'s':''}`;
  const days = Math.floor(hours/24);
  return `in ${days} day${days>1?'s':''}`;
}

function updateNotifSettingsUI(){
  const toggle = document.getElementById('notifToggle');
  const sub = document.getElementById('notifStatusSub');
  const guestNote = document.getElementById('notifGuestNote');
  if(!toggle) return;
  const signedIn = CLOUD.mode === 'cloud' && !!CLOUD.uid;
  guestNote?.classList.toggle('hidden', signedIn);
  toggle.disabled = !signedIn;
  if(!signedIn){
    toggle.checked = false;
    if(sub) sub.textContent = "Sign in with Google to enable test reminders.";
    return;
  }
  const perm = (typeof Notification !== 'undefined') ? Notification.permission : 'unsupported';
  const enabled = lsGet('cs_notif_enabled', false) && perm === 'granted';
  toggle.checked = enabled;
  if(perm === 'denied'){
    if(sub) sub.textContent = "Blocked in your browser settings — allow notifications for this site to enable.";
    toggle.disabled = true;
  } else if(sub){
    sub.textContent = "Get notified before a test — works even if the app is closed";
  }
}

async function toggleTestReminders(){
  const cb = document.getElementById('notifToggle');
  if(!cb) return;
  if(cb.checked){
    const ok = await enableTestReminders();
    if(!ok) cb.checked = false;
  } else {
    await disableTestReminders();
  }
}

async function enableTestReminders(){
  if(!(CLOUD.mode === 'cloud' && CLOUD.uid)){
    showToast('Sign in with Google to enable test reminders.', 'info');
    return false;
  }
  if(typeof Notification === 'undefined'){
    showToast('Notifications are not supported on this browser.', 'info');
    return false;
  }
  await fbMessagingReady;
  if(!fbMessaging){
    showToast('Push notifications are not supported on this browser/device.', 'info');
    return false;
  }
  if(FCM_VAPID_KEY === 'PASTE_YOUR_VAPID_KEY_HERE'){
    showToast('Test reminders are not set up yet — ask an admin to finish setup.', 'info');
    console.warn('FCM_VAPID_KEY is not configured. See README-notifications.md');
    return false;
  }
  try{
    const perm = await Notification.requestPermission();
    if(perm !== 'granted'){
      showToast('Notifications permission was not granted.', 'info');
      updateNotifSettingsUI();
      return false;
    }
    const swReg = await navigator.serviceWorker.register('firebase-messaging-sw.js');
    const token = await fbMessaging.getToken({ vapidKey: FCM_VAPID_KEY, serviceWorkerRegistration: swReg });
    if(!token) throw new Error('No token returned');
    await fbDB.collection('students').doc(CLOUD.uid).set({
      fcmTokens: firebase.firestore.FieldValue.arrayUnion(token),
      name: student.name, cls: student.cls
    }, {merge:true});
    lsSet('cs_notif_enabled', true);
    showToast('🔔 Test reminders enabled!', 'success');
    updateNotifSettingsUI();
    return true;
  }catch(e){
    console.warn('Enabling test reminders failed', e);
    showToast('Could not enable test reminders. Please try again.', 'info');
    return false;
  }
}

async function disableTestReminders(){
  lsSet('cs_notif_enabled', false);
  try{
    if(fbMessaging && CLOUD.mode === 'cloud' && CLOUD.uid){
      const swReg = await navigator.serviceWorker.getRegistration('firebase-messaging-sw.js');
      const token = swReg ? await fbMessaging.getToken({ vapidKey: FCM_VAPID_KEY, serviceWorkerRegistration: swReg }).catch(()=>null) : null;
      if(token){
        await fbDB.collection('students').doc(CLOUD.uid).set({
          fcmTokens: firebase.firestore.FieldValue.arrayRemove(token)
        }, {merge:true});
      }
    }
  }catch(e){ console.warn('Disabling test reminders failed', e); }
  showToast('Test reminders turned off.', 'info');
  updateNotifSettingsUI();
}

/* Foreground messages (app open in an active tab) — FCM won't show these
   automatically like it does in the background, so we show our own toast
   plus a native notification if the tab isn't focused. */
fbMessagingReady.then(supported=>{
  if(!supported || !fbMessaging) return;
  fbMessaging.onMessage(payload=>{
    const title = payload?.notification?.title || payload?.data?.title || '📅 Test Reminder';
    const body = payload?.notification?.body || payload?.data?.body || '';
    showToast(`${title}${body ? ' — ' + body : ''}`, 'info');
    if(document.hidden && typeof Notification !== 'undefined' && Notification.permission === 'granted'){
      try{ new Notification(title, {body, icon:'icon-192.png'}); }catch(e){}
    }
  });
});

/* ================= ADMIN: TEST REMINDER SCHEDULING ================= */
let reminderData = [];
async function loadTestReminders(){
  const body = document.getElementById('reminderTableBody');
  if(body) body.innerHTML = `<tr><td colspan="6">Loading…</td></tr>`;
  try{
    const snap = await fbDB.collection('testReminders').orderBy('testAt', 'desc').limit(50).get();
    reminderData = snap.docs.map(doc=>({id:doc.id, ...doc.data()}));
  }catch(e){
    console.warn('Loading test reminders failed', e);
    reminderData = [];
  }
  renderTestReminders();
}
function renderTestReminders(){
  const body = document.getElementById('reminderTableBody');
  if(!body) return;
  if(!reminderData.length){
    body.innerHTML = `<tr><td colspan="6">No reminders scheduled yet.</td></tr>`;
    return;
  }
  body.innerHTML = reminderData.map(d=>{
    const testTime = (d.testAt && d.testAt.toDate) ? d.testAt.toDate().toLocaleString() : '—';
    const sendTime = (d.sendAt && d.sendAt.toDate) ? d.sendAt.toDate().toLocaleString() : '—';
    const status = d.sent ? `✅ Sent${d.sentCount!==undefined ? ' · '+d.sentCount+' device(s)' : ''}` : '⏳ Pending';
    const safeTitle = escapeHtml(d.title || 'Untitled');
    return `<tr>
      <td>${safeTitle}</td><td>${escapeHtml(d.targetClass||'all')}</td><td>${testTime}</td><td>${sendTime}</td><td>${status}</td>
      <td>${d.sent ? '' : `<button class="admin-action-btn ban" onclick="cancelTestReminder('${d.id}')">Cancel</button>`}</td>
    </tr>`;
  }).join('');
}
async function createTestReminder(){
  const errEl = document.getElementById('reminderFormError');
  if(errEl) errEl.textContent = '';
  const title = document.getElementById('reminderTitle').value.trim();
  const message = document.getElementById('reminderMessage').value.trim();
  const dtVal = document.getElementById('reminderDateTime').value;
  const targetClass = document.getElementById('reminderClass').value;
  const offsetMin = parseInt(document.getElementById('reminderOffset').value, 10) || 0;
  if(!title){ if(errEl) errEl.textContent = 'Please enter a title.'; return; }
  if(!dtVal){ if(errEl) errEl.textContent = 'Please pick a test date & time.'; return; }
  const testAt = new Date(dtVal);
  if(isNaN(testAt.getTime())){ if(errEl) errEl.textContent = 'Invalid date/time.'; return; }
  const sendAt = new Date(testAt.getTime() - offsetMin*60000);
  try{
    await fbDB.collection('testReminders').add({
      title, message, targetClass,
      testAt: firebase.firestore.Timestamp.fromDate(testAt),
      sendAt: firebase.firestore.Timestamp.fromDate(sendAt),
      offsetMinutes: offsetMin,
      sent: false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdBy: googleUser ? googleUser.email : 'unknown'
    });
    document.getElementById('reminderTitle').value = '';
    document.getElementById('reminderMessage').value = '';
    document.getElementById('reminderDateTime').value = '';
    showToast('📅 Reminder scheduled!', 'success');
    loadTestReminders();
  }catch(e){
    console.warn('Scheduling reminder failed', e);
    if(errEl) errEl.textContent = 'Could not schedule reminder — check the browser console.';
  }
}
async function cancelTestReminder(id){
  if(!confirm('Cancel this scheduled reminder?')) return;
  try{
    await fbDB.collection('testReminders').doc(id).delete();
    reminderData = reminderData.filter(d=>d.id!==id);
    renderTestReminders();
    showToast('Reminder cancelled.', 'info');
  }catch(e){
    console.warn('Cancel reminder failed', e);
    showToast('Could not cancel — check the browser console.', 'info');
  }
}

/* Populates the "Lessons" checkbox list for whichever subject is currently
   selected in the paper generator. All boxes start checked (= whole
   subject, matching the old default behavior when nothing is filtered). */
function populatePaperChapters(){
  const subSel = document.getElementById('paperSubject');
  const wrap = document.getElementById('paperChaptersWrap');
  const list = document.getElementById('paperChapterList');
  if(!subSel || !wrap || !list) return;
  const subjectKey = subSel.value;
  const info = SUBJECT_INFO[subjectKey];
  if(!info){ wrap.style.display = 'none'; return; }
  const chapters = info.chapters;
  list.innerHTML = chapters.map((ch,i)=>`
    <label class="lesson-pick-item">
      <input type="checkbox" class="paper-lesson-checkbox" value="${ch.name.replace(/"/g,'&quot;')}" checked>
      <span class="lp-icon">${ch.icon || '📘'}</span>
      <span class="lp-name">${info.unitLabel} ${i+1}: ${ch.name}</span>
    </label>
  `).join('');
  wrap.style.display = chapters.length ? '' : 'none';
}
function toggleAllPaperChapters(select){
  document.querySelectorAll('.paper-lesson-checkbox').forEach(cb=>cb.checked = select);
}
/* Returns the set of chapter names currently checked, or null if every
   checkbox is checked (meaning "no filter, use the whole subject"). */
function getSelectedPaperChapters(){
  const boxes = Array.from(document.querySelectorAll('.paper-lesson-checkbox'));
  if(!boxes.length) return null;
  const checked = boxes.filter(cb=>cb.checked).map(cb=>cb.value);
  if(checked.length === boxes.length) return null; // nothing filtered out
  return new Set(checked);
}
function filterByChapters(arr, chapterSet){
  if(!chapterSet) return arr;
  return arr.filter(q=>chapterSet.has(q.chapter));
}

/* ================= ADMIN: QUESTION PAPER GENERATOR ================= */
function populatePaperSubjectDropdown(){
  const sel = document.getElementById('paperSubject');
  if(!sel || sel.options.length) return; // already populated
  Object.keys(SUBJECT_INFO).forEach(key=>{
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = SUBJECT_INFO[key].name;
    sel.appendChild(opt);
  });
}

/* Pulls Part I (1-mark) questions straight from the existing book-back
   MCQ bank, spread across all of that subject's chapters. */
function collectOneMarkPool(subjectKey){
  const chapters = SUBJECT_INFO[subjectKey].chapters;
  const pool = [];
  chapters.forEach(ch=>{
    (ch.questions||[]).forEach(q=>pool.push({...q, chapter:ch.name}));
  });
  return pool;
}

function generateQuestionPaper(){
  const errEl = document.getElementById('paperFormError');
  if(errEl) errEl.textContent = '';
  const subjectKey = document.getElementById('paperSubject').value;
  const totalMarks = parseInt(document.getElementById('paperTotal').value, 10);
  const examTitle = document.getElementById('paperExamTitle').value.trim() || 'Model Examination';
  const pattern = PAPER_PATTERNS[totalMarks];
  const bank = DESCRIPTIVE_QUESTIONS[subjectKey];

  if(!bank){
    if(errEl) errEl.textContent = `No 2/3/5-mark question bank has been added for ${SUBJECT_INFO[subjectKey].name} yet — only Computer Science and Physics have one loaded so far.`;
    return;
  }

  const chapterFilter = getSelectedPaperChapters();
  const onemarkPool = filterByChapters(collectOneMarkPool(subjectKey), chapterFilter);
  const bank2 = filterByChapters(bank[2]||[], chapterFilter);
  const bank3 = filterByChapters(bank[3]||[], chapterFilter);
  const bank5 = filterByChapters(bank[5]||[], chapterFilter);
  const bankNumerical = filterByChapters(bank.numerical||[], chapterFilter);
  const bankProgram = filterByChapters(bank.program||[], chapterFilter);
  const need = {
    p1: pattern.part1.count,
    p2: pattern.part2.shown,
    p3: pattern.part3.shown,
    p4: pattern.part4.pairs
  };
  const lessonNote = chapterFilter ? ' for the selected lessons — pick more lessons or add more questions' : '';
  if(onemarkPool.length < need.p1 || bank2.length < need.p2 || bank3.length < need.p3 || bank5.length < need.p4*2){
    if(errEl) errEl.textContent = `Not enough questions in the bank${lessonNote} for a ${totalMarks}-mark paper (need ${need.p1} one-mark, ${need.p2} two-mark, ${need.p3} three-mark, ${need.p4*2} five-mark questions to make ${need.p4} either/or pairs). ${chapterFilter ? 'Try selecting more lessons, or add' : 'Add'} more questions to DESCRIPTIVE_QUESTIONS.`;
    return;
  }

  const part1 = shuffle(onemarkPool).slice(0, need.p1);
  const part2 = shuffle(bank2).slice(0, need.p2);
  const part3 = shuffle(bank3).slice(0, need.p3);
  // 5-mark bank is a flat list (source book doesn't pre-pair either/or
  // questions) — randomly pair two distinct questions per "either/or" slot.
  const fiveMarkPicked = shuffle(bank5).slice(0, need.p4*2);
  const part4 = [];
  for(let i=0;i<fiveMarkPicked.length;i+=2){
    part4.push({ chapter: fiveMarkPicked[i].chapter, qa: fiveMarkPicked[i], qb: fiveMarkPicked[i+1] });
  }

  // Real TN board papers mark one specific question within each
  // "answer any N of M" choice as compulsory — pick one at random here,
  // same as a teacher would when assembling a paper.
  let part2CompulsoryPos = 1 + Math.floor(Math.random()*part2.length);
  let part3CompulsoryPos = 1 + Math.floor(Math.random()*part3.length);

  // Subjects with a dedicated numerical-problem pool (e.g. Physics) always
  // put a numerical question last in Part II and Part III, and that last
  // question is the compulsory one — matching how these papers are set.
  if(bankNumerical.length >= 2){
    const numericalsPicked = shuffle(bankNumerical).slice(0, 2);
    part2[part2.length-1] = numericalsPicked[0];
    part3[part3.length-1] = numericalsPicked[1];
    part2CompulsoryPos = part2.length;
    part3CompulsoryPos = part3.length;
  }
  // Subjects with a dedicated program-writing pool (Computer Science) work
  // the same way: the last question in Part II and Part III is always a
  // program question, and it's marked as the Compulsory Question.
  else if(bankProgram.length >= 2){
    const programsPicked = shuffle(bankProgram).slice(0, 2);
    part2[part2.length-1] = programsPicked[0];
    part3[part3.length-1] = programsPicked[1];
    part2CompulsoryPos = part2.length;
    part3CompulsoryPos = part3.length;
  }

  const filteredBank = { 2: bank2, 3: bank3, 5: bank5, numerical: bankNumerical, program: bankProgram };
  openPrintablePaper({subjectKey, totalMarks, examTitle, pattern, part1, part2, part3, part4, part2CompulsoryPos, part3CompulsoryPos, onemarkPool, bank: filteredBank});
}

function openPrintablePaper({subjectKey, totalMarks, examTitle, pattern, part1, part2, part3, part4, part2CompulsoryPos, part3CompulsoryPos, onemarkPool, bank}){
  const subjectName = SUBJECT_INFO[subjectKey].name;
  const win = window.open('', '_blank');
  if(!win){ showToast('Please allow pop-ups to open the question paper.', 'info'); return; }

  const esc = (s)=>String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  const part1Start = 1;
  const part2Start = part1Start + part1.length;
  const part3Start = part2Start + part2.length;
  const part4Start = part3Start + part3.length;
  const part2CompulsoryNum = part2Start + part2CompulsoryPos - 1;
  const part3CompulsoryNum = part3Start + part3CompulsoryPos - 1;

  // Full pools + the initial selection are handed to the new window so its
  // own script can swap any single question for another one on demand,
  // without re-opening/regenerating the whole paper.
  const numericalCompulsory = !!(bank.numerical && bank.numerical.length >= 2);
  const programCompulsory = !numericalCompulsory && !!(bank.program && bank.program.length >= 2);
  const compulsoryTag = numericalCompulsory ? 'numerical problem' : (programCompulsory ? 'Program \u2013 Compulsory Question' : '');
  const clientData = {
    part1, part2, part3, part4,
    pools: { p1: onemarkPool, p2: bank[2], p3: bank[3], p5: bank[5], numerical: bank.numerical || [], program: bank.program || [] },
    nums: { part1Start, part2Start, part3Start, part4Start },
    numericalSlots: numericalCompulsory ? { p2: part2.length-1, p3: part3.length-1 } : null,
    programSlots: programCompulsory ? { p2: part2.length-1, p3: part3.length-1 } : null,
    meta: {
      examTitle, subjectName, totalMarks,
      schoolName: 'Vethathiri Maharishi Higher Secondary School, S.V.G Puram',
      part2CompulsoryNum, part3CompulsoryNum, numericalCompulsory, programCompulsory, compulsoryTag,
      part1Count: pattern.part1.count, part2ChooseAny: pattern.part2.chooseAny, part3ChooseAny: pattern.part3.chooseAny, part4Pairs: pattern.part4.pairs
    }
  };
  // Safety: prevent a stray "</script>" inside any question text from
  // prematurely closing the inline <script> tag it's embedded in.
  const clientDataJson = JSON.stringify(clientData).replace(/<\/script/gi, '<\\/script');

  const paperScript = [
    'const D = window.__PAPER_DATA;',
    'function esc(s){ var d=document.createElement("div"); d.textContent=String(s); return d.innerHTML; }',
    '',
    'function usedKeys(){',
    '  var s = new Set();',
    '  D.part1.forEach(function(q){ s.add(q.q); });',
    '  D.part2.forEach(function(q){ s.add(q.q); });',
    '  D.part3.forEach(function(q){ s.add(q.q); });',
    '  D.part4.forEach(function(p){ s.add(p.qa.q); s.add(p.qb.q); });',
    '  return s;',
    '}',
    '',
    'function pickReplacement(pool){',
    '  var used = usedKeys();',
    '  var avail = pool.filter(function(q){ return !used.has(q.q); });',
    '  if(!avail.length) return null;',
    '  return avail[Math.floor(Math.random()*avail.length)];',
    '}',
    '',
    'function replaceBtn(kind, idx){',
    '  return " <button type=\\"button\\" class=\\"repl-btn\\" data-kind=\\"" + kind + "\\" data-idx=\\"" + idx + "\\">🔁 Replace</button>";',
    '}',
    '',
    'function renderP1(i){',
    '  var q = D.part1[i], num = D.nums.part1Start + i;',
    '  var opts = (q.options||[]).map(function(o,oi){ return "<span class=\\"opt\\">(" + String.fromCharCode(97+oi) + ") " + esc(o) + "</span>"; }).join("");',
    '  document.getElementById("p1-"+i).innerHTML = "<b>"+num+".</b> "+esc(q.q)+"<div class=\\"opts\\">"+opts+"</div>"+replaceBtn("p1",i);',
    '}',
    'function renderP2(i){',
    '  var q = D.part2[i], num = D.nums.part2Start + i;',
    '  document.getElementById("p2-"+i).innerHTML = "<b>"+num+".</b> "+esc(q.q)+replaceBtn("p2",i);',
    '}',
    'function renderP3(i){',
    '  var q = D.part3[i], num = D.nums.part3Start + i;',
    '  document.getElementById("p3-"+i).innerHTML = "<b>"+num+".</b> "+esc(q.q)+replaceBtn("p3",i);',
    '}',
    'function renderP4(i){',
    '  var pair = D.part4[i], num = D.nums.part4Start + i;',
    '  document.getElementById("p4-"+i).innerHTML =',
    '    "<b>"+num+". (a)</b> "+esc(pair.qa.q)+replaceBtn("p5a",i)+',
    '    "<div class=\\"or\\">OR</div>"+',
    '    "<b>"+num+". (b)</b> "+esc(pair.qb.q)+replaceBtn("p5b",i);',
    '}',
    '',
    'function doReplace(kind, idx){',
    '  var pool, current;',
    '  var forceNumerical = D.numericalSlots && (',
    '    (kind==="p2" && idx===D.numericalSlots.p2) ||',
    '    (kind==="p3" && idx===D.numericalSlots.p3)',
    '  );',
    '  var forceProgram = D.programSlots && (',
    '    (kind==="p2" && idx===D.programSlots.p2) ||',
    '    (kind==="p3" && idx===D.programSlots.p3)',
    '  );',
    '  if(forceNumerical){ pool = D.pools.numerical; }',
    '  else if(forceProgram){ pool = D.pools.program; }',
    '  else if(kind==="p1"){ pool=D.pools.p1; }',
    '  else if(kind==="p2"){ pool=D.pools.p2; }',
    '  else if(kind==="p3"){ pool=D.pools.p3; }',
    '  else if(kind==="p5a" || kind==="p5b"){ pool=D.pools.p5; }',
    '  var repl = pickReplacement(pool);',
    '  if(!repl){ alert(forceNumerical ? "No more unused numerical questions available to swap in." : (forceProgram ? "No more unused program questions available to swap in." : "No more unused questions available in this bank to swap in.")); return; }',
    '  if(kind==="p1"){ D.part1[idx]=repl; renderP1(idx); }',
    '  else if(kind==="p2"){ D.part2[idx]=repl; renderP2(idx); }',
    '  else if(kind==="p3"){ D.part3[idx]=repl; renderP3(idx); }',
    '  else if(kind==="p5a"){ D.part4[idx].qa=repl; renderP4(idx); }',
    '  else if(kind==="p5b"){ D.part4[idx].qb=repl; renderP4(idx); }',
    '}',
    '',
    'document.addEventListener("click", function(e){',
    '  var btn = e.target.closest(".repl-btn");',
    '  if(!btn) return;',
    '  doReplace(btn.getAttribute("data-kind"), parseInt(btn.getAttribute("data-idx"),10));',
    '});',
    '',
    'function savePDF(){',
    '  if(!window.jspdf){ alert("PDF library did not load — check your internet connection and try again."); return; }',
    '  var docPdf = new window.jspdf.jsPDF({unit:"pt", format:"a4"});',
    '  var pageW = docPdf.internal.pageSize.getWidth();',
    '  var pageH = docPdf.internal.pageSize.getHeight();',
    '  var margin = 42, maxW = pageW - margin*2, lineH = 13, y = margin;',
    '  function ensureSpace(h){ if(y + h > pageH - margin){ docPdf.addPage(); y = margin; } }',
    '  function addText(text, opts){',
    '    opts = opts || {};',
    '    docPdf.setFont("helvetica", opts.bold ? "bold" : (opts.italic ? "italic" : "normal"));',
    '    docPdf.setFontSize(opts.size || 9.5);',
    '    var lines = docPdf.splitTextToSize(text, maxW - (opts.indent||0));',
    '    lines.forEach(function(line){',
    '      ensureSpace(lineH);',
    '      docPdf.text(line, margin + (opts.indent||0), y);',
    '      y += lineH;',
    '    });',
    '  }',
    '  function addCentered(text, opts){',
    '    opts = opts || {};',
    '    docPdf.setFont("helvetica", opts.bold ? "bold" : "normal");',
    '    docPdf.setFontSize(opts.size || 9.5);',
    '    ensureSpace(lineH);',
    '    docPdf.text(text, pageW/2, y, {align:"center"});',
    '    y += lineH;',
    '  }',
    '  var M = D.meta;',
    '  addCentered(M.schoolName, {bold:true, size:12.5});',
    '  addCentered(M.examTitle + " \u2014 " + M.subjectName, {bold:true, size:11});',
    '  y += 2;',
    '  addText("Time: 3 hrs (approx.)" + "                                                                    " + "Marks: " + M.totalMarks, {size:9});',
    '  y += 4;',
    '  addText("The question paper comprises of four parts. You are to attempt all the parts. An internal choice of questions is provided wherever applicable.", {italic:true, size:8});',
    '  y += 8;',
    '',
    '  addText("Part I", {bold:true, size:11}); y += 1;',
    '  addText("Question numbers " + D.nums.part1Start + " to " + (D.nums.part2Start-1) + " are Multiple Choice Questions of one mark each. Choose the most suitable answer from the given four alternatives and write the option code with the corresponding answer. " + M.part1Count + " \u00d7 1 = " + M.part1Count, {italic:true, size:8});',
    '  D.part1.forEach(function(q,i){',
    '    var num = D.nums.part1Start + i;',
    '    addText(num + ". " + q.q, {size:9.5});',
    '    if(q.options){',
    '      var optLine = q.options.map(function(o,oi){ return "(" + String.fromCharCode(97+oi) + ") " + o; }).join("     ");',
    '      addText(optLine, {size:9, indent:14});',
    '    }',
    '    y += 2;',
    '  });',
    '  y += 6;',
    '',
    '  addText("Part II", {bold:true, size:11}); y += 1;',
    '  addText("Question numbers " + D.nums.part2Start + " to " + (D.nums.part3Start-1) + " are two-mark questions, to be answered in about one or two sentences each. Answer any " + M.part2ChooseAny + " questions. Question No. " + M.part2CompulsoryNum + " is compulsory" + (M.compulsoryTag ? " (" + M.compulsoryTag + ")" : "") + ". " + M.part2ChooseAny + " \u00d7 2 = " + (M.part2ChooseAny*2), {italic:true, size:8});',
    '  D.part2.forEach(function(q,i){ addText((D.nums.part2Start+i) + ". " + q.q, {size:9.5}); y += 2; });',
    '  y += 6;',
    '',
    '  addText("Part III", {bold:true, size:11}); y += 1;',
    '  addText("Question numbers " + D.nums.part3Start + " to " + (D.nums.part3Start+D.part3.length-1) + " are three-mark questions. Answer any " + M.part3ChooseAny + " questions. Question No. " + M.part3CompulsoryNum + " is compulsory" + (M.compulsoryTag ? " (" + M.compulsoryTag + ")" : "") + ". " + M.part3ChooseAny + " \u00d7 3 = " + (M.part3ChooseAny*3), {italic:true, size:8});',
    '  D.part3.forEach(function(q,i){ addText((D.nums.part3Start+i) + ". " + q.q, {size:9.5}); y += 2; });',
    '  y += 6;',
    '',
    '  addText("Part IV", {bold:true, size:11}); y += 1;',
    '  addText("Answer all questions, choosing either (a) or (b) in each. " + M.part4Pairs + " \u00d7 5 = " + (M.part4Pairs*5), {italic:true, size:8});',
    '  D.part4.forEach(function(pair,i){',
    '    var num = D.nums.part4Start + i;',
    '    addText(num + ". (a) " + pair.qa.q, {size:9.5});',
    '    addCentered("OR", {size:8.5, bold:true});',
    '    addText(num + ". (b) " + pair.qb.q, {size:9.5});',
    '    y += 4;',
    '  });',
    '',
    '  var fname = (M.examTitle + "_" + M.subjectName).replace(/[^a-zA-Z0-9]+/g,"_") + ".pdf";',
    '  docPdf.save(fname);',
    '}',
    'window.savePDF = savePDF;'
  ].join('\n');

  const part1Html = part1.map((q,i)=>`<div class="q" id="p1-${i}"></div>`).join('');
  const part2Html = part2.map((q,i)=>`<div class="q" id="p2-${i}"></div>`).join('');
  const part3Html = part3.map((q,i)=>`<div class="q" id="p3-${i}"></div>`).join('');
  const part4Html = part4.map((p,i)=>`<div class="q" id="p4-${i}"></div>`).join('');

  const initScript = 'D.part1.forEach((_,i)=>renderP1(i));D.part2.forEach((_,i)=>renderP2(i));D.part3.forEach((_,i)=>renderP3(i));D.part4.forEach((_,i)=>renderP4(i));';

  win.document.write(`<!DOCTYPE html><html><head><title>${esc(examTitle)} — ${esc(subjectName)}</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"><\/script>
  <style>
    body{font-family:Georgia,'Times New Roman',serif;max-width:800px;margin:30px auto;padding:0 20px;color:#111;line-height:1.5}
    .header{text-align:center;margin-bottom:20px;border-bottom:2px solid #111;padding-bottom:14px}
    .header h1{font-size:1.15rem;margin:0 0 4px}
    .header .school{font-size:.95rem;font-weight:bold}
    .header .meta{display:flex;justify-content:space-between;margin-top:10px;font-size:.9rem}
    .part-title{font-weight:bold;text-decoration:underline;margin:22px 0 4px;font-size:1rem}
    .part-note{font-style:italic;font-size:.85rem;margin-bottom:10px}
    .q{margin-bottom:12px;font-size:.95rem}
    .opts{display:flex;flex-wrap:wrap;gap:14px;margin:4px 0 0 20px;font-size:.9rem}
    .or{text-align:center;font-weight:bold;margin:4px 0}
    .repl-btn{font-family:sans-serif;font-size:.72rem;padding:2px 8px;margin-left:8px;border:1px solid #4F46E5;color:#4F46E5;background:#fff;border-radius:12px;cursor:pointer;vertical-align:middle}
    .repl-btn:hover{background:#EEF2FF}
    .toolbar{position:fixed;top:12px;right:12px;display:flex;gap:8px;z-index:10}
    .toolbar button{padding:10px 16px;border:none;border-radius:8px;cursor:pointer;font-size:.85rem;font-family:sans-serif;font-weight:600}
    .print-btn{background:#fff;color:#4F46E5;border:1.5px solid #4F46E5!important}
    .save-btn{background:#4F46E5;color:#fff}
    @media print{ .toolbar,.repl-btn{display:none} }
  </style></head>
  <body>
    <div class="toolbar">
      <button class="print-btn" onclick="window.print()">🖨️ Print</button>
      <button class="save-btn" onclick="savePDF()">💾 Save as PDF</button>
    </div>
    <div class="header">
      <div class="school">Vethathiri Maharishi Higher Secondary School, S.V.G Puram</div>
      <h1>${esc(examTitle)} — ${esc(subjectName)}</h1>
      <div class="meta"><span>Time: 3 hrs (approx.)</span><span><b>Marks: ${totalMarks}</b></span></div>
    </div>
    <p style="font-size:.82rem;font-style:italic;text-align:center;margin-top:-8px">The question paper comprises of four parts. You are to attempt all the parts. An internal choice of questions is provided wherever applicable. All questions of Part I, II, III and IV are to be attempted separately. Click 🔁 Replace next to any question to swap it for another from the bank before printing.</p>

    <div class="part-title">Part I</div>
    <div class="part-note">Question numbers ${part1Start} to ${part2Start-1} are Multiple Choice Questions of one mark each. Choose the most suitable answer from the given four alternatives and write the option code with the corresponding answer. ${pattern.part1.count} × 1 = ${pattern.part1.count}</div>
    ${part1Html}

    <div class="part-title">Part II</div>
    <div class="part-note">Question numbers ${part2Start} to ${part3Start-1} are two-mark questions, to be answered in about one or two sentences each. Answer any ${pattern.part2.chooseAny} questions. Question No. ${part2CompulsoryNum} is compulsory${compulsoryTag ? ` (${compulsoryTag})` : ''}. ${pattern.part2.chooseAny} × 2 = ${pattern.part2.chooseAny*2}</div>
    ${part2Html}

    <div class="part-title">Part III</div>
    <div class="part-note">Question numbers ${part3Start} to ${part3Start+part3.length-1} are three-mark questions. Answer any ${pattern.part3.chooseAny} questions. Question No. ${part3CompulsoryNum} is compulsory${compulsoryTag ? ` (${compulsoryTag})` : ''}. ${pattern.part3.chooseAny} × 3 = ${pattern.part3.chooseAny*3}</div>
    ${part3Html}

    <div class="part-title">Part IV</div>
    <div class="part-note">Answer all questions, choosing either (a) or (b) in each. ${pattern.part4.pairs} × 5 = ${pattern.part4.pairs*5}</div>
    ${part4Html}

    <script>window.__PAPER_DATA = ${clientDataJson};<\/script>
    <script>${paperScript}<\/script>
    <script>${initScript}<\/script>
  </body></html>`);
  win.document.close();
}

/* ================= HAPTICS ================= */
function vibrate(ms){
  if(!vibrationOn) return;
  if(navigator.vibrate){ try{ navigator.vibrate(ms); }catch(e){} }
}

/* ================= FONT SIZE TOGGLE ================= */
const FONT_SIZES = ['normal','medium','large'];
function cycleFontSize(){
  const cur = lsGet('cs_fontsize','normal');
  const next = FONT_SIZES[(FONT_SIZES.indexOf(cur)+1) % FONT_SIZES.length];
  applyFontSize(next);
}
function applyFontSize(size){
  document.documentElement.setAttribute('data-fontsize', size==='normal' ? '' : size);
  lsSet('cs_fontsize', size);
  const btn = document.getElementById('fontBtn');
  if(btn) btn.textContent = size==='large' ? 'Aa+' : size==='medium' ? 'Aa·' : 'Aa';
  const sBtn = document.getElementById('settingsFontBtn');
  if(sBtn) sBtn.textContent = size==='large' ? 'Aa+ Large' : size==='medium' ? 'Aa· Medium' : 'Aa Normal';
}

/* Pulls every saved preference (sound, vibration, font size, subject, reduced
   motion) out of whichever data source is active (cloud/guest) and applies it.
   Called every time we know which student's data is loaded. */
function applyLoadedPreferences(){
  soundOn = lsGet('cs_sound_on', true);
  vibrationOn = lsGet('cs_vibration_on', true);
  applyFontSize(lsGet('cs_fontsize', 'normal'));
  currentSubject = lsGet('cs_subject', 'cs');
  currentStandard = lsGet('cs_standard', getStudentStandard() || '12');
  document.documentElement.setAttribute('data-reduce-motion', lsGet('cs_reduce_motion', false) ? 'true' : '');
  applyTheme(lsGet('cs_theme', 'light') === 'dark');
  updateNotifSettingsUI();
}


const SCREENS = ['subjectScreen','chapterScreen','sectionScreen','customScreen','startScreen','testScreen','resultScreen','dashboardScreen'];

/* ---------------- Back-button / history handling ----------------
   Every forward call to switchScreen() pushes a history entry so that
   the device/browser back button steps back through the app's own
   screens (e.g. test -> section -> chapter -> home) instead of
   immediately leaving the site. Only when there is no more app
   history left does the back button fall through to normal browser
   behaviour (leaving the page). */
try{ history.replaceState({screen:null}, '', location.pathname+location.search); }catch(e){}

function switchScreen(showId, fromPopState){
  SCREENS.forEach(id=>{
    const el = document.getElementById(id);
    if(!el) return;
    if(id===showId){
      el.classList.remove('hidden');
      el.style.animation='none';
      void el.offsetWidth;
      el.style.animation='';
      resetRevealIn(el);
    } else {
      el.classList.add('hidden');
    }
  });
  applySubjectTheme(showId==='subjectScreen' ? null : currentSubject);
  window.scrollTo({top:0, behavior:'smooth'});
  if(!fromPopState){
    try{ history.pushState({screen:showId}, '', location.pathname+location.search); }catch(e){}
  }
  // Duvan (the AI doubt assistant) must never appear while a test is in progress
  setDuvanVisible(showId !== 'testScreen');
}

function setDuvanVisible(visible){
  const fab = document.getElementById('duvanFab');
  const panel = document.getElementById('duvanPanel');
  if(!fab) return;
  if(visible){
    fab.classList.remove('hidden');
  } else {
    fab.classList.add('hidden');
    // force-close the chat panel too, so it can't be left open behind the test
    if(panel) panel.classList.add('hidden');
    duvanOpen = false;
    fab.classList.remove('is-open');
  }
}

window.addEventListener('popstate', function(e){
  const state = e.state;
  if(state && state.screen && SCREENS.includes(state.screen)){
    // If backing out of an in-progress test, stop the running timer
    const testEl = document.getElementById('testScreen');
    if(testEl && !testEl.classList.contains('hidden') && state.screen!=='testScreen'){
      try{ clearInterval(timerInterval); }catch(err){}
    }
    switchScreen(state.screen, true);
  }
  // else: no app screen on the stack — let the browser's default
  // back navigation proceed (leaves the page), which is correct
  // once the user is back at the very first/home screen.
});

/* ---------------- Welcome / onboarding gate ---------------- */
function initials(name){
  return name.trim().split(/\s+/).slice(0,2).map(w=>w[0]).join('').toUpperCase() || '?';
}

/* ---------------- animated class chip picker ---------------- */
document.addEventListener('touchstart', function(){}, {passive:true, capture:true}); // enables :active states reliably on iOS

function chipRipple(el, x, y){
  const rect = el.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 1.6;
  const span = document.createElement('span');
  span.className = 'chip-ripple';
  span.style.width = span.style.height = size+'px';
  span.style.left = (x-rect.left-size/2)+'px';
  span.style.top = (y-rect.top-size/2)+'px';
  el.appendChild(span);
  span.addEventListener('animationend', ()=>span.remove());
}

document.querySelectorAll('.class-chip').forEach(chip=>{
  chip.addEventListener('pointerdown', (e)=>{
    chipRipple(chip, e.clientX, e.clientY);
  });
  chip.addEventListener('click', ()=>{
    document.querySelectorAll('.class-chip').forEach(c=>c.classList.remove('selected'));
    chip.classList.add('selected');
    document.getElementById('studentClass').value = chip.dataset.cls;
    document.getElementById('welcomeError').textContent = '';
    document.getElementById('classPicker').classList.remove('shake');
    try{ if(navigator.vibrate) navigator.vibrate(12); }catch(e){}
  });
});

function applyStudentUI(){
  const chip = document.getElementById('studentChip');
  if(student.name){
    chip.classList.add('show');
    document.getElementById('studentAvatar').textContent = initials(student.name);
    document.getElementById('studentChipText').innerHTML = `${student.name.split(' ')[0]} • ${student.cls}${isGuest ? '<span class="guest-tag">GUEST</span>' : ''}`;
  } else {
    chip.classList.remove('show');
  }
}

/* ---------------- edit an already-saved profile ---------------- */
let editingProfile = false;
function editProfile(){
  editingProfile = true;
  document.getElementById('studentName').value = student.name || '';
  document.getElementById('studentClass').value = student.cls || '';
  document.querySelectorAll('.class-chip').forEach(c=>c.classList.toggle('selected', c.dataset.cls === student.cls));
  document.getElementById('welcomeError').textContent = '';
  document.getElementById('editModeBadge')?.classList.remove('hidden');

  // The class-picker step gets hidden again as soon as a returning user's
  // saved profile is auto-loaded (see onAuthStateChanged / continueAsGuest),
  // so it has to be explicitly re-shown here — otherwise reopening the
  // welcome screen shows nothing usable (blank Google/guest step instead).
  document.getElementById('googleStep')?.classList.add('hidden');
  document.getElementById('blockedStep')?.classList.add('hidden');
  document.getElementById('cloudLoading')?.classList.add('hidden');
  document.getElementById('classStep')?.classList.remove('hidden');

  const gate = document.getElementById('welcomeScreen');
  gate.style.transition = 'none';
  gate.style.display = 'flex';
  gate.style.opacity = '1';
  gate.style.transform = 'scale(1)';
}

function confirmProfile(){
  const nameEl = document.getElementById('studentName');
  const clsEl = document.getElementById('studentClass');
  const err = document.getElementById('welcomeError');
  const name = nameEl.value.trim();
  const cls = clsEl.value;
  if(!name){ err.textContent = 'Please enter your name to continue.'; nameEl.focus(); return; }
  if(!cls){
    err.textContent = 'Please select your class.';
    const picker = document.getElementById('classPicker');
    picker.classList.remove('shake'); void picker.offsetWidth; picker.classList.add('shake');
    try{ if(navigator.vibrate) navigator.vibrate([15,40,15]); }catch(e){}
    return;
  }
  err.textContent = '';
  student = {name, cls};
  lsSet('student', student); // saved to Firestore automatically, tied to this Google account
  mirrorToClassLeaderboard();
  mirrorGuestActivity();

  if(editingProfile){
    editingProfile = false;
    document.getElementById('editModeBadge')?.classList.add('hidden');
    applyStudentUI();
    const gate = document.getElementById('welcomeScreen');
    gate.style.transition = 'opacity .4s ease, transform .4s ease';
    gate.style.opacity = '0';
    gate.style.transform = 'scale(1.02)';
    setTimeout(()=>{
      gate.style.display = 'none';
      gate.style.opacity = '1';
      gate.style.transform = 'scale(1)';
    }, 380);
  } else {
    finishLogin();
  }
}

function finishLogin(){
  applyStudentUI();
  applyLoadedPreferences();
  launchConfetti();
  const logo = document.querySelector('.welcome-logo');
  if(logo){ logo.style.animation = 'none'; void logo.offsetWidth; logo.style.animation = 'starPop .5s ease'; }
  const gate = document.getElementById('welcomeScreen');
  gate.style.transition = 'opacity .5s ease, transform .5s ease';
  gate.style.opacity = '0';
  gate.style.transform = 'scale(1.03)';
  setTimeout(()=>{
    gate.style.display = 'none';
    // After profile, let student pick 10th or 12th
    currentStandard = getStudentStandard() || lsGet('cs_standard', null);
    if(currentStandard){
      renderSubjectGrid();
      switchScreen('subjectScreen');
    } else {
      switchScreen('standardScreen');
    }
  }, 480);
}

function confirmLogout(){
  const msg = isGuest
    ? 'Exit guest mode? Your guest progress stays on this device, but you won\'t be signed in anywhere.'
    : 'Log out of your Google account? Your progress is saved and will be here next time you sign in.';
  if(confirm(msg)){
    switchUser();
  }
}

async function switchUser(){
  const wasGuest = isGuest;
  try{ await fbAuth.signOut(); }catch(e){}
  student = {name:'', cls:''};
  isGuest = false;
  CLOUD.uid = null; CLOUD.data = {}; CLOUD.mode = 'none'; // stop writing to the previous student's data
  editingProfile = false;
  applyStudentUI();
  document.getElementById('studentName').value = '';
  document.getElementById('studentClass').value = '';
  document.querySelectorAll('.class-chip').forEach(c=>c.classList.remove('selected'));
  document.getElementById('welcomeError').textContent = '';
  document.getElementById('editModeBadge')?.classList.add('hidden');
  const gate = document.getElementById('welcomeScreen');
  gate.style.transition = 'none';
  gate.style.display = 'flex';
  gate.style.opacity = '1';
  gate.style.transform = 'scale(1)';
  if(wasGuest){
    // guests were never signed into Firebase, so onAuthStateChanged won't fire — show the Google step ourselves
    document.getElementById('classStep').classList.add('hidden');
    document.getElementById('googleStep').classList.remove('hidden');
  }
  // if signed in with Google, onAuthStateChanged fires from signOut() and shows the Google step
}

/* ================= SETTINGS PANEL ================= */
function openSettings(){
  document.getElementById('soundToggle').checked = soundOn;
  document.getElementById('vibrationToggle').checked = vibrationOn;
  document.getElementById('reduceMotionToggle').checked = lsGet('cs_reduce_motion', false);
  document.getElementById('leaderboardVisibleToggle').checked = lsGet('cs_leaderboard_visible', true);

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.getElementById('settingsThemeBtn').textContent = isDark ? '☀️ Light' : '🌙 Dark';

  const fsize = lsGet('cs_fontsize', 'normal');
  document.getElementById('settingsFontBtn').textContent =
    fsize==='large' ? 'Aa+ Large' : fsize==='medium' ? 'Aa· Medium' : 'Aa Normal';

  const info = document.getElementById('settingsAccountInfo');
  const deleteRow = document.getElementById('deleteAccountRow');
  if(CLOUD.mode === 'cloud' && googleUser){
    info.innerHTML = `Signed in as <b>${escapeHtml(googleUser.email || googleUser.displayName || 'your Google account')}</b>`;
    deleteRow.classList.remove('hidden');
  } else if(isGuest){
    info.innerHTML = `Guest mode <span style="color:var(--muted)">— sign in with Google to save progress permanently</span>`;
    deleteRow.classList.add('hidden');
  } else {
    info.textContent = 'Not signed in';
    deleteRow.classList.add('hidden');
  }

  document.getElementById('syncStatusLabel').textContent =
    CLOUD.mode === 'cloud' ? 'Synced to your Google account' :
    CLOUD.mode === 'guest' ? 'Saved on this device only (guest mode)' : '—';

  updateNotifSettingsUI();
  document.getElementById('settingsScreen').classList.remove('hidden');
}
function closeSettings(){
  document.getElementById('settingsScreen').classList.add('hidden');
}
function toggleThemeFromSettings(){
  toggleTheme();
}

async function manualSync(){
  if(CLOUD.mode !== 'cloud' || !CLOUD.uid){
    showToast("You're not signed in, so there's nothing to sync.", 'info');
    return;
  }
  showToast('Syncing…', 'info');
  await loadCloudData(CLOUD.uid);
  applyStudentUI();
  refreshNavGamificationChips();
  if(document.getElementById('dashboardScreen') && !document.getElementById('dashboardScreen').classList.contains('hidden')){
    renderDashboard();
  }
  showToast('Synced!', 'success');
}

function exportMyData(){
  if(CLOUD.mode === 'none'){
    showToast('Sign in or continue as guest first.', 'info');
    return;
  }
  const payload = JSON.stringify({ student, ...CLOUD.data }, null, 2);
  const blob = new Blob([payload], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `my-progress-${(student.name||'student').replace(/\s+/g,'_')}.json`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function confirmResetProgress(){
  if(CLOUD.mode === 'none'){
    showToast('Sign in or continue as guest first.', 'info');
    return;
  }
  if(confirm('Reset all your XP, badges, and test history? Your name, class, and sign-in stay the same. This cannot be undone.')){
    resetProgress();
  }
}
function resetProgress(){
  lsSet('cs_xp', 0);
  lsSet('cs_streak', {count:0, last:null});
  lsSet('cs_progress', {});
  lsSet('cs_badges', []);
  lsSet('cs_leaderboard', []);
  lsSet('cs_wrong_pool', {});
  mirrorToClassLeaderboard();
  mirrorGuestActivity();
  applyStudentUI();
  refreshNavGamificationChips();
  if(document.getElementById('dashboardScreen') && !document.getElementById('dashboardScreen').classList.contains('hidden')){
    renderDashboard();
  }
  showToast('Your progress has been reset.', 'success');
}

/* ---- Delete account: removes Firestore data AND the Firebase Auth account itself ---- */
function openDeleteAccountModal(){
  if(CLOUD.mode !== 'cloud' || !CLOUD.uid){
    showToast('Account deletion is only available when signed in with Google.', 'info');
    return;
  }
  document.getElementById('deleteConfirmInput').value = '';
  document.getElementById('deleteConfirmError').textContent = '';
  document.getElementById('deleteAccountModal').classList.remove('hidden');
  setTimeout(()=>document.getElementById('deleteConfirmInput')?.focus(), 50);
}
function closeDeleteAccountModal(){
  document.getElementById('deleteAccountModal').classList.add('hidden');
}
async function deleteAccount(){
  const typed = document.getElementById('deleteConfirmInput').value.trim();
  if(typed.toUpperCase() !== 'DELETE'){
    document.getElementById('deleteConfirmError').textContent = 'Please type DELETE to confirm.';
    return;
  }
  const btn = document.getElementById('deleteAccountBtn');
  const prevText = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Deleting…';
  try{
    const uid = CLOUD.uid;
    await fbDB.collection('students').doc(uid).delete();
    await fbDB.collection('leaderboard').doc(uid).delete().catch(()=>{});
    await fbAuth.currentUser.delete();

    student = {name:'', cls:''};
    isGuest = false;
    CLOUD.uid = null; CLOUD.data = {}; CLOUD.mode = 'none';
    closeDeleteAccountModal();
    closeSettings();
    applyStudentUI();
    const gate = document.getElementById('welcomeScreen');
    gate.style.transition = 'none';
    gate.style.display = 'flex';
    gate.style.opacity = '1';
    gate.style.transform = 'scale(1)';
    document.getElementById('classStep').classList.add('hidden');
    document.getElementById('googleStep').classList.remove('hidden');
    showToast('Your account and data have been deleted.', 'success');
  }catch(e){
    console.warn('Delete account failed', e);
    if(e.code === 'auth/requires-recent-login'){
      try{
        const provider = new firebase.auth.GoogleAuthProvider();
        await fbAuth.currentUser.reauthenticateWithPopup(provider);
        btn.disabled = false;
        btn.textContent = prevText;
        deleteAccount(); // retry now that re-authentication succeeded
        return;
      }catch(reauthErr){
        document.getElementById('deleteConfirmError').textContent = 'Please sign in again, then retry deleting your account.';
      }
    } else {
      document.getElementById('deleteConfirmError').textContent = 'Something went wrong. Please try again.';
    }
  }finally{
    btn.disabled = false;
    btn.textContent = prevText;
  }
}

/* ---- "Add to Home Screen" trigger, surfaced inside Settings ---- */
let deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', (e)=>{
  e.preventDefault();
  deferredInstallPrompt = e;
  const btn = document.getElementById('installAppBtn');
  if(btn) btn.disabled = false;
});
async function triggerInstallPrompt(){
  if(!deferredInstallPrompt){
    showToast("Your browser doesn't support installing this as an app, or it's already installed.", 'info');
    return;
  }
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  const btn = document.getElementById('installAppBtn');
  if(btn) btn.disabled = true;
}

function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

function buildTestSet(pool){
  return shuffle(pool).map(orig=>{
    const optIndices = shuffle([0,1,2,3]);
    const options = optIndices.map(i=>orig.options[i]);
    const correct = optIndices.indexOf(orig.correct);
    return {q:orig.q, options, correct, exp:orig.exp, chapterId:orig.chapterId, chapterName:orig.chapterName};
  });
}

function allQuestionsFlat(){ return activeChapters().flatMap(ch=>ch.questions.map(q=>({...q, chapterId:ch.id, chapterName:ch.name}))); }

function renderChapterGrid(){
  const grid = document.getElementById('chapterGrid');
  grid.innerHTML = '';
  const info = SUBJECT_INFO[currentSubject];
  const chapters = info.chapters;
  const totalQ = chapters.reduce((s,c)=>s+c.questions.length,0);
  const greet = student.name ? `Welcome, ${student.name.split(' ')[0]}! ` : '';
  document.getElementById('chapterSubtitle').textContent = `${greet}${info.name} • ${chapters.length} ${info.unitLabel==='Unit'?'units':'chapters'} • ${totalQ} real questions from the book-back PDF`;
  const noteEl = document.getElementById('chapterSourceNote');
  if(noteEl) noteEl.textContent = info.sourceNote;

  const weakCount = getWeakPool().length;
  const badgeEl = document.getElementById('weakCountBadge');
  if(badgeEl) badgeEl.textContent = `${weakCount} Qs`;

  loadUpcomingTestBanner();

  const progress = getProgress();
  chapters.forEach((ch,i)=>{
    const rec = progress[ch.id];
    const best = rec && rec.best;
    const status = best ? (best.pct===100 ? '✅' : '🔵') : '⚪';
    const card = document.createElement('div');
    card.className = 'chapter-card tilt-card';
    card.style.animationDelay = (i*0.05)+'s';
    card.innerHTML = `
      <span class="chapter-status">${status}</span>
      <div class="chapter-num">${ch.icon}</div>
      <div class="chapter-title">${info.unitLabel} ${i+1}: ${ch.name}</div>
      <div class="chapter-meta">
        <span class="chip">${ch.questions.length} Questions</span>
        <span class="chip">${ch.questions.length} min</span>
        <span class="chip">😊 Easy</span>
      </div>
      ${best ? `<div class="chapter-best">Best: ${best.pct}% (${best.correct}/${best.total})</div>
        <div class="chapter-progress-bar"><div class="chapter-progress-fill" style="width:${best.pct}%"></div></div>` : ''}
      <button class="btn btn-primary">Practice Now</button>
    `;
    card.onclick = ()=>selectChapter(ch.id);
    grid.appendChild(card);
  });
}

function openStartScreenFor(ch){
  const label = SUBJECT_INFO[currentSubject].unitLabel;
  const idx = typeof ch.id==='number' ? activeChapters().findIndex(c=>c.id===ch.id) : -1;
  document.getElementById('startTitle').textContent = `${idx>-1 ? `${label} ${idx+1}: ` : ''}${ch.name} 🚀`;
  document.getElementById('startQCount').textContent = ch.questions.length;
  document.getElementById('startMins').textContent = ch.questions.length;
  switchScreen('startScreen');
}

let pendingChapter = null;

function selectChapter(id){
  pendingChapter = activeChapters().find(c=>c.id===id);
  const idx = activeChapters().findIndex(c=>c.id===id);
  const label = SUBJECT_INFO[currentSubject].unitLabel;
  document.getElementById('sectionTitle').textContent = `${label} ${idx+1}: ${pendingChapter.name}`;
  document.getElementById('sectionBookCount').textContent = `${pendingChapter.questions.length} Questions`;
  const addCount = (pendingChapter.additionalQuestions || []).length;
  document.getElementById('sectionAddCount').textContent = `${addCount} Questions`;
  const addCard = document.getElementById('sectionAddCard');
  addCard.style.opacity = addCount === 0 ? '.45' : '1';
  addCard.style.pointerEvents = addCount === 0 ? 'none' : 'auto';
  switchScreen('sectionScreen');
}

function chooseSection(type){
  const ch = pendingChapter;
  if(type === 'bookback'){
    activeChapter = {id: ch.id, name: `${ch.name} — Book Back`, questions: ch.questions};
  } else {
    activeChapter = {id: ch.id, name: `${ch.name} — Public Additional Questions`, questions: ch.additionalQuestions};
  }
  openStartScreenFor(activeChapter);
}

function goBackFromStart(){
  if(pendingChapter && activeChapter && typeof activeChapter.id === 'number'){
    switchScreen('sectionScreen');
  } else {
    showChapterScreen();
  }
}

function selectMixedTest(){
  const pool = shuffle(allQuestionsFlat()).slice(0,30);
  activeChapter = {id:'mixed', name:'Mixed Test — All Chapters', questions:pool};
  openStartScreenFor(activeChapter);
}

function selectWeakReview(){
  const weak = getWeakPool();
  if(weak.length===0){ showToast('No weak questions yet — keep practicing! 💪'); return; }
  activeChapter = {id:'weak', name:'Weak Question Review', questions:weak.slice(0,20)};
  openStartScreenFor(activeChapter);
}

/* ---------------- Custom Test (pick your own lessons) ---------------- */
function showCustomScreen(){
  clearInterval(timerInterval);
  renderCustomScreen();
  switchScreen('customScreen');
}

function renderCustomScreen(){
  const info = SUBJECT_INFO[currentSubject];
  const chapters = info.chapters;
  const unit = info.unitLabel.toLowerCase();
  document.getElementById('customSubtitle').textContent = `Pick any combination of ${unit}s from ${info.name} to build your own test`;

  const list = document.getElementById('customChapterList');
  list.innerHTML = chapters.map((ch,i)=>`
    <label class="lesson-pick-item">
      <input type="checkbox" class="lesson-pick-checkbox" value="${ch.id}" onchange="updateCustomSummary()">
      <span class="lp-icon">${ch.icon || '📘'}</span>
      <span class="lp-name">${info.unitLabel} ${i+1}: ${ch.name}</span>
      <span class="lp-count">${ch.questions.length} Qs</span>
    </label>
  `).join('');

  const anyAdd = chapters.some(ch=>(ch.additionalQuestions||[]).length>0);
  document.getElementById('customIncludeAddWrap').classList.toggle('hidden', !anyAdd);
  const addBox = document.getElementById('customIncludeAdd');
  if(addBox) addBox.checked = false;

  updateCustomSummary();
}

function toggleAllCustomChapters(select){
  document.querySelectorAll('.lesson-pick-checkbox').forEach(cb=>cb.checked = select);
  updateCustomSummary();
}

function getCustomPool(){
  const chapters = activeChapters();
  const checkedIds = Array.from(document.querySelectorAll('.lesson-pick-checkbox:checked')).map(cb=>cb.value);
  const includeAddEl = document.getElementById('customIncludeAdd');
  const includeAdd = !!(includeAddEl && includeAddEl.checked);
  let pool = [];
  chapters.forEach(ch=>{
    if(!checkedIds.includes(String(ch.id))) return;
    ch.questions.forEach(q=>pool.push({...q, chapterId:ch.id, chapterName:ch.name}));
    if(includeAdd && (ch.additionalQuestions||[]).length){
      ch.additionalQuestions.forEach(q=>pool.push({...q, chapterId:ch.id, chapterName:`${ch.name} (Additional)`}));
    }
  });
  return pool;
}

function updateCustomSummary(){
  const pool = getCustomPool();
  const lessonCount = document.querySelectorAll('.lesson-pick-checkbox:checked').length;
  document.getElementById('customSelectedCount').textContent =
    `${pool.length} question${pool.length===1?'':'s'} from ${lessonCount} lesson${lessonCount===1?'':'s'}`;

  const slider = document.getElementById('customQCount');
  const label = document.getElementById('customQCountLabel');
  const startBtn = document.getElementById('customStartBtn');
  const max = Math.max(pool.length, 1);
  slider.max = max;
  if(pool.length===0){
    slider.value = 1;
    label.textContent = '0';
  } else {
    if(Number(slider.value) > pool.length || Number(slider.value) < 1) slider.value = pool.length;
    label.textContent = slider.value;
  }
  startBtn.disabled = pool.length === 0;
}

function startCustomTest(){
  const pool = getCustomPool();
  if(pool.length===0){ showToast('Pick at least one lesson first! 🧩'); return; }
  const wantCount = Number(document.getElementById('customQCount').value) || pool.length;
  const finalPool = shuffle(pool).slice(0, Math.min(wantCount, pool.length));
  activeChapter = {id:'custom', name:'Custom Test — Selected Lessons', questions:finalPool};
  openStartScreenFor(activeChapter);
}

function showStandardScreen(){
  clearInterval(timerInterval);
  switchScreen('standardScreen');
  applySubjectTheme(null);
}

function selectStandard(std){
  currentStandard = std;
  lsSet('cs_standard', std);
  // If student class doesn't match the chosen standard prefix, leave it;
  // subjects will still filter by currentStandard.
  renderSubjectGrid();
  showSubjectScreen();
}

function subjectsForStandard(std){
  const all = Object.keys(SUBJECT_INFO);
  return all.filter(key => {
    const info = SUBJECT_INFO[key];
    if(info.standards) return info.standards.includes(std);
    // default subjects are for 12th
    return std === '12';
  });
}

function renderSubjectGrid(){
  const std = currentStandard || getStudentStandard() || '12';
  currentStandard = std;
  const keys = subjectsForStandard(std);
  const grid = document.getElementById('subjectGrid');
  if(!grid) return;
  const subTitle = document.getElementById('subjectSubtitle');
  const hubTitle = document.getElementById('subjectHubTitle');
  if(hubTitle) hubTitle.textContent = std + 'th Standard — Choose your world';
  if(subTitle) subTitle.textContent = keys.length + ' subject' + (keys.length!==1?'s':'') + ' available for ' + std + 'th standard';
  const changeBtn = document.getElementById('changeStandardBtn');
  if(changeBtn) changeBtn.style.display = 'inline-flex';

  const emojiOrb = (icon) => `<div class="subject-orb"><span class="subject-emoji">${icon}</span></div>`;
  grid.innerHTML = keys.map(key => {
    const info = SUBJECT_INFO[key];
    const chCount = (info.chapters || []).length;
    const unit = info.unitLabel === 'Unit' ? 'Units' : 'Chapters';
    return `<div class="subject-card sub-${key} tilt-card" onclick="selectSubject('${key}')" style="--card-accent:${info.themeColor || '#4F46E5'}">
      <div class="subject-card-sheen"></div>
      <div class="subject-badge">${chCount} ${unit}</div>
      ${emojiOrb(info.icon)}
      <div class="subject-name">${info.name}</div>
      <div class="subject-desc">${(info.tagline || '').replace(/^\d+\s*(chapters?|units?)\s*•\s*/i,'')}</div>
      <div class="subject-cta">Enter world <span class="arrow">→</span></div>
    </div>`;
  }).join('');
  // re-init tilt if present
  if(typeof initTiltCards === 'function') try{ initTiltCards(); }catch(e){}
}

function showSubjectScreen(){
  clearInterval(timerInterval);
  // Ensure we have a standard
  if(!currentStandard){
    currentStandard = getStudentStandard() || lsGet('cs_standard', '12');
  }
  renderSubjectGrid();
  switchScreen('subjectScreen');
  applySubjectTheme(null);
}

function selectSubject(key){
  currentSubject = key;
  lsSet('cs_subject', key);
  showChapterScreen();
}

function showChapterScreen(){
  clearInterval(timerInterval);
  renderChapterGrid();
  switchScreen('chapterScreen');
}

function startTest(){
  let pool;
  if(activeChapter.id==='mixed' || activeChapter.id==='weak' || activeChapter.id==='custom'){
    pool = activeChapter.questions;
  } else {
    pool = activeChapter.questions.map(q=>({...q, chapterId:activeChapter.id, chapterName:activeChapter.name}));
  }
  testQuestions = buildTestSet(pool);
  currentIndex = 0;
  answers = {};
  bookmarks = {};
  timeLeft = testQuestions.length * 60;
  startTime = Date.now();
  switchScreen('testScreen');
  renderQuestion();
  clearInterval(timerInterval);
  timerInterval = setInterval(tickTimer,1000);
}


renderChapterGrid();

function tickTimer(){
  timeLeft--;
  const m = Math.floor(timeLeft/60), s = timeLeft%60;
  const disp = document.getElementById('timerDisplay');
  disp.textContent = `${m}:${s.toString().padStart(2,'0')}`;
  disp.className = 'timer' + (timeLeft<=60?' danger':timeLeft<=300?' warn':'');
  if(timeLeft<=0){
    clearInterval(timerInterval);
    submitTest();
  }
}

function escHtmlQ(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function mathify(str){
  if(str==null) return '';
  let s = escHtmlQ(str);
  function buildGrid(inner, bracketClass){
    const rows = inner.split(';').map(r=>r.split(',').map(c=>c.trim()));
    const maxCols = Math.max(...rows.map(r=>r.length));
    let cells = '';
    rows.forEach(r=>{
      for(let i=0;i<maxCols;i++){
        cells += `<span class="mx-cell">${r[i]!==undefined ? r[i] : ''}</span>`;
      }
    });
    return `<span class="mx-wrap"><span class="mx-bracket ${bracketClass}l"></span><span class="mx-grid" style="grid-template-columns:repeat(${maxCols},auto)">${cells}</span><span class="mx-bracket ${bracketClass}r"></span></span>`;
  }
  // square-bracket matrices: [a,b;c,d]
  s = s.replace(/\[([^\[\]]*;[^\[\]]*)\]/g, (m, inner) => buildGrid(inner, ''));
  // determinant bars: |a,b;c,d|
  s = s.replace(/\|([^|]*;[^|]*)\|/g, (m, inner) => buildGrid(inner, 'det '));
  // chemistry subscripts/superscripts: H_{2}O, SO_{4}^{2-}, Fe^{3+}, 10^{-4}
  s = s.replace(/\^\{([^{}]+)\}/g, '<sup>$1</sup>');
  s = s.replace(/_\{([^{}]+)\}/g, '<sub>$1</sub>');
  return s;
}

function renderQuestion(){
  const q = testQuestions[currentIndex];
  const qType = q.type || 'mcq';
  document.getElementById('qBadge').textContent = activeChapter.name + (qType!=='mcq' ? ' · ' + qType.toUpperCase() : '');
  document.getElementById('qCounter').textContent = `Question ${currentIndex+1} / ${testQuestions.length}`;
  document.getElementById('progressFill').style.width = `${((currentIndex+1)/testQuestions.length)*100}%`;
  document.getElementById('qText').innerHTML = mathify(String(q.q).replace(/\n/g,'<br>'));
  updateBookmarkBtn();

  // re-trigger card entrance animation (only happens when moving to a new question)
  const card = document.getElementById('qCard');
  card.style.animation = 'none';
  void card.offsetWidth;
  card.style.animation = 'slideIn .35s cubic-bezier(.34,1.56,.64,1)';

  const wrap = document.getElementById('optionsWrap');
  wrap.innerHTML = '';

  if(qType === 'fill' || qType === 'caption'){
    // Free-text answer
    const prev = answers[currentIndex];
    const val = (typeof prev === 'string') ? prev : '';
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'fill-input';
    input.placeholder = qType === 'caption' ? 'Type a suitable caption…' : 'Type your answer…';
    input.value = val;
    input.autocomplete = 'off';
    input.oninput = () => { answers[currentIndex] = input.value.trim(); };
    wrap.appendChild(input);
    // helper note
    const note = document.createElement('div');
    note.className = 'fill-note';
    note.textContent = qType === 'caption' ? 'Write a clear, relevant caption. Close matches are accepted.' : 'Fill in the blank. Spelling should match the expected answer.';
    wrap.appendChild(note);
    setTimeout(()=>input.focus(), 80);
  } else {
    // MCQ / Match (presented as options)
    const letters = ['A','B','C','D','E','F'];
    const opts = q.options || [];
    opts.forEach((opt,i)=>{
      const div = document.createElement('div');
      div.className = 'option' + (answers[currentIndex]===i?' selected':'');
      div.innerHTML = `<span class="opt-letter">${letters[i]||(i+1)}</span><span>${mathify(opt)}</span>`;
      div.onclick = (e)=> selectOption(i, div, e);
      wrap.appendChild(div);
    });
  }

  document.getElementById('prevBtn').disabled = currentIndex===0;
  document.getElementById('nextBtn').textContent = currentIndex===testQuestions.length-1 ? 'Submit ✓' : 'Next →';
}

function updateBookmarkBtn(){
  const btn = document.getElementById('bookmarkBtn');
  btn.className = 'q-bookmark' + (bookmarks[currentIndex]?' active':'');
  btn.textContent = bookmarks[currentIndex]?'★':'☆';
}

/* Selecting an answer only updates the option elements in place —
   no full re-render, so the card never flashes/blinks. */
function selectOption(i, div, e){
  answers[currentIndex] = i;
  document.querySelectorAll('#optionsWrap .option').forEach(o=>o.classList.remove('selected'));
  div.classList.add('selected');
  spawnSelectSparkles(e.clientX, e.clientY);
  soundSelect();
  vibrate(12);
}

function spawnSelectSparkles(x, y){
  const colors = ['#2563EB','#8B5CF6','#EC4899','#059669','#F59E0B','#3B82F6'];
  const count = 12;
  for(let i=0;i<count;i++){
    const p = document.createElement('div');
    const angle = (Math.PI*2*i/count) + (Math.random()*0.5);
    const dist = 34 + Math.random()*36;
    const dx = Math.cos(angle)*dist;
    const dy = Math.sin(angle)*dist;
    const size = 5 + Math.random()*5;
    p.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${size}px;height:${size}px;border-radius:50%;background:${colors[i%colors.length]};pointer-events:none;z-index:300;opacity:1;box-shadow:0 0 8px ${colors[i%colors.length]};transition:transform .65s cubic-bezier(.22,1,.36,1), opacity .65s ease;`;
    document.body.appendChild(p);
    requestAnimationFrame(()=>{
      p.style.transform = `translate(${dx}px, ${dy}px) scale(.3)`;
      p.style.opacity = '0';
    });
    setTimeout(()=>p.remove(), 700);
  }
}

function toggleBookmark(){
  bookmarks[currentIndex] = !bookmarks[currentIndex];
  updateBookmarkBtn();
  if(bookmarks[currentIndex]){
    const btn = document.getElementById('bookmarkBtn');
    btn.style.animation = 'none'; void btn.offsetWidth; btn.style.animation = 'starPop .4s';
  }
}

function prevQ(){ if(currentIndex>0){currentIndex--; renderQuestion();} }
function nextQ(){
  if(currentIndex<testQuestions.length-1){ currentIndex++; renderQuestion(); }
  else { confirmSubmitTest(); }
}
function confirmSubmitTest(){
  const total = testQuestions.length;
  const answeredCount = Object.keys(answers).filter(k=>answers[k]!==undefined).length;
  const unanswered = total - answeredCount;
  const msgEl = document.getElementById('submitModalMsg');
  if(msgEl){
    msgEl.textContent = unanswered === 0
      ? `You've answered all ${total} questions. You won't be able to change your answers after submitting.`
      : `You've answered ${answeredCount} of ${total} questions. The remaining ${unanswered} will be marked as skipped. You won't be able to change your answers after submitting.`;
  }
  document.getElementById('submitModal').classList.remove('hidden');
}
function closeModal(){ document.getElementById('submitModal').classList.add('hidden'); }

function confirmExitTest(){ document.getElementById('exitTestModal').classList.remove('hidden'); }
function closeExitModal(){ document.getElementById('exitTestModal').classList.add('hidden'); }
function exitTestToHome(){
  closeExitModal();
  clearInterval(timerInterval);
  showChapterScreen();
}


function isAnswerCorrect(q, chosen){
  const qType = q.type || 'mcq';
  if(qType === 'fill' || qType === 'caption'){
    const acceptable = Array.isArray(q.correct) ? q.correct : [q.correct];
    const norm = (s) => String(s||'').trim().toLowerCase().replace(/\s+/g,' ');
    const c = norm(chosen);
    return acceptable.some(a => {
      const na = norm(a);
      return c === na || c.includes(na) || na.includes(c);
    });
  }
  // mcq / match — chosen is option index
  return chosen === q.correct;
}

function submitTest(){
  closeModal();
  clearInterval(timerInterval);
  const elapsed = Math.floor((Date.now()-startTime)/1000);
  let correct=0, wrong=0, skipped=0;
  const details = testQuestions.map((q,i)=>{
    const chosen = answers[i];
    let status;
    if(chosen===undefined || chosen==='' || chosen===null){ status='skipped'; skipped++; }
    else if(isAnswerCorrect(q, chosen)){ status='correct'; correct++; }
    else { status='wrong'; wrong++; }
    return {...q, chosen, status, bookmarked: !!bookmarks[i]};
  });
  lastResultData = {details, correct, wrong, skipped, elapsed, total: testQuestions.length};

  // ---- Gamification side-effects ----
  const xpBefore = getXP();
  const levelBefore = getLevel(xpBefore);
  updateWrongPool(details, activeChapter.id, activeChapter.name);
  saveAttempt(activeChapter.id, lastResultData);
  const gained = correct*10 + (Math.round((correct/lastResultData.total)*100)>=90 ? 30 : 0);
  const xpAfter = addXP(gained);
  const levelAfter = getLevel(xpAfter);
  updateStreak();
  addToLeaderboard({
    name: student.name || 'Guest', cls: student.cls || '-',
    chapterName: activeChapter.name, chapterId: activeChapter.id,
    correct, total: lastResultData.total, pct: Math.round((correct/lastResultData.total)*100),
    elapsed, date: Date.now()
  });
  mirrorToClassLeaderboard();
  mirrorGuestActivity();
  lastResultData.xpGained = gained;
  lastResultData.leveledUp = levelAfter > levelBefore;
  lastResultData.newLevel = levelAfter;

  renderResult(lastResultData);
}

function renderResult(data){
  switchScreen('resultScreen');
  const pct = Math.round((data.correct/data.total)*100);
  document.getElementById('scoreCircle').style.setProperty('--pct', pct);
  document.getElementById('scoreVal').textContent = `${data.correct}/${data.total}`;
  document.getElementById('statCorrect').textContent = data.correct;
  document.getElementById('statWrong').textContent = data.wrong;
  document.getElementById('statSkipped').textContent = data.skipped;
  const m = Math.floor(data.elapsed/60), s = data.elapsed%60;
  document.getElementById('statTime').textContent = `${m}:${s.toString().padStart(2,'0')}`;
  document.getElementById('statAccuracy').textContent = `${pct}%`;

  let perf, msg;
  if(pct>=90){perf='Excellent';msg='Excellent work! You know this chapter really well 🎉'; launchConfetti(); soundSuccess();}
  else if(pct>=75){perf='Very Good';msg='Almost perfect! Just a little more revision.'; soundSuccess();}
  else if(pct>=50){perf='Good';msg='Keep practicing — you are getting there!';}
  else {perf='Needs Work';msg="Don't give up! Revisit the concepts and try again.";}
  document.getElementById('perfTag').textContent = perf;
  document.getElementById('motivateMsg').textContent = msg;

  if(data.xpGained){ showToast(`⭐ +${data.xpGained} XP earned!`); }
  refreshNavGamificationChips();
  const gotNewBadge = checkAndToastNewBadges();
  if(data.leveledUp){
    setTimeout(()=>{ showToast(`🎉 Level Up! You're now Level ${data.newLevel}!`, 'level'); soundLevelUp(); launchConfetti(); }, gotNewBadge?600:100);
  }

  currentFilter = 'all';
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.toggle('active', b.dataset.f==='all'));
  renderReview();
}

function setFilter(f){
  currentFilter = f;
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.toggle('active', b.dataset.f===f));
  renderReview();
}

function renderReview(){
  const wrap = document.getElementById('reviewWrap');
  wrap.innerHTML = '';
  const letters = ['A','B','C','D'];
  let list = lastResultData.details;
  if(currentFilter==='wrong') list = list.filter(d=>d.status==='wrong');
  if(currentFilter==='correct') list = list.filter(d=>d.status==='correct');
  if(currentFilter==='skipped') list = list.filter(d=>d.status==='skipped');
  if(currentFilter==='bookmarked') list = list.filter(d=>d.bookmarked);

  if(list.length===0){
    wrap.innerHTML = `<div style="text-align:center;color:var(--muted);padding:30px 0">No questions in this filter.</div>`;
    return;
  }

  list.forEach((d)=>{
    const card = document.createElement('div');
    card.className = `review-card ${d.status}`;
    const qType = d.type || 'mcq';
    let optsHtml = '';
    if(qType === 'fill' || qType === 'caption'){
      const acceptable = Array.isArray(d.correct) ? d.correct.join(' / ') : d.correct;
      const yourAns = (d.chosen !== undefined && d.chosen !== '' && d.chosen !== null) ? d.chosen : '(skipped)';
      optsHtml = `<div class="review-opt ${d.status==='correct'?'answer-key':''}"><b>Your answer:</b> ${mathify(String(yourAns))}</div>
        <div class="review-opt answer-key"><b>Accepted:</b> ${mathify(String(acceptable))} ✓</div>`;
    } else {
      const opts = d.options || [];
      optsHtml = opts.map((opt,i)=>{
        let cls = 'review-opt';
        if(d.status==='wrong' && i===d.chosen) cls += ' your-wrong';
        if(i===d.correct) cls += ' answer-key';
        return `<div class="${cls}">${letters[i]}. ${mathify(opt)}${i===d.correct?' ✓ (Correct Answer)':''}${d.status==='wrong'&&i===d.chosen?' ✗ (Your Answer)':''}</div>`;
      }).join('');
    }
    const refId = d.chapterId ?? activeChapter.id;
    const refName = d.chapterName ?? activeChapter.name;
    const refLabel = refName;
    card.innerHTML = `
      <div class="review-status ${d.status}">${d.status}${d.bookmarked?' • ★ Bookmarked':''}${qType!=='mcq'?' • '+qType:''}</div>
      <div style="font-weight:700;margin-bottom:6px">${mathify(String(d.q).replace(/\n/g,'<br>'))}</div>
      <div class="review-opts">${optsHtml}</div>
      <div class="explain-box">${d.exp ? `<b>Explanation:</b> ${d.exp}<br>` : ''}<b>Reference:</b> ${refLabel}</div>
    `;
    wrap.appendChild(card);
  });
}

function retryWrongOnly(){
  const wrongOrig = lastResultData.details.filter(d=>d.status!=='correct').map(d=>{
    return {q:d.q, options:d.options, correct:d.correct, exp:d.exp, type:d.type, chapterId:d.chapterId, chapterName:d.chapterName};
  });
  if(wrongOrig.length===0){ showToast('No wrong/skipped questions — great job! 🎉'); return; }
  testQuestions = buildTestSet(wrongOrig);
  currentIndex = 0;
  answers = {};
  bookmarks = {};
  timeLeft = testQuestions.length * 60;
  startTime = Date.now();
  switchScreen('testScreen');
  renderQuestion();
  clearInterval(timerInterval);
  timerInterval = setInterval(tickTimer,1000);
}


function launchConfetti(){
  const colors = ['#2563EB','#059669','#F59E0B','#DC2626','#8B5CF6','#EC4899'];
  for(let i=0;i<70;i++){
    const p = document.createElement('div');
    p.style.cssText = `position:fixed;top:-10px;left:${Math.random()*100}vw;width:${6+Math.random()*6}px;height:${10+Math.random()*8}px;border-radius:3px;background:${colors[Math.floor(Math.random()*colors.length)]};opacity:.9;z-index:200;animation:fall ${2+Math.random()*2}s linear forwards;pointer-events:none;`;
    document.body.appendChild(p);
    setTimeout(()=>p.remove(),4200);
  }
}
const styleTag = document.createElement('style');
styleTag.textContent = `@keyframes fall{to{transform:translateY(105vh) rotate(360deg);opacity:0}}`;
document.head.appendChild(styleTag);

/* Theme toggle */
function applyTheme(isDark){
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  const oldBtn = document.getElementById('themeBtn');
  if(oldBtn) oldBtn.textContent = isDark ? '☀️ Light' : '🌙 Dark';
  const newBtn = document.getElementById('settingsThemeBtn');
  if(newBtn) newBtn.textContent = isDark ? '☀️ Light' : '🌙 Dark';
  lsSet('cs_theme', isDark ? 'dark' : 'light');
}
function toggleTheme(){
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  applyTheme(!isDark);
}
document.getElementById('themeBtn')?.addEventListener('click', toggleTheme);

/* ================= 3D TILT — subject / chapter / featured cards =================
   Delegated on each .tilt-parent container so it keeps working after
   renderChapterGrid() rebuilds its children. Skipped on touch devices
   and for people who prefer reduced motion. */
(function(){
  const canHover = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!canHover || reduceMotion) return;

  function resetCard(c){
    c.style.transition = 'transform .5s cubic-bezier(.22,1,.36,1)';
    c.style.transform = '';
  }
  document.querySelectorAll('.tilt-parent').forEach(parent=>{
    parent.addEventListener('mousemove', function(e){
      const active = e.target.closest('.tilt-card');
      parent.querySelectorAll('.tilt-card').forEach(c=>{ if(c!==active) resetCard(c); });
      if(!active) return;
      const r = active.getBoundingClientRect();
      const px = (e.clientX - r.left)/r.width - 0.5;
      const py = (e.clientY - r.top)/r.height - 0.5;
      active.style.transition = 'transform .08s linear';
      active.style.transform = `perspective(700px) rotateX(${(-py*9).toFixed(2)}deg) rotateY(${(px*11).toFixed(2)}deg) translateY(-3px)`;
    });
    parent.addEventListener('mouseleave', function(){
      parent.querySelectorAll('.tilt-card').forEach(resetCard);
    });
  });
})();

/* ================= DASHBOARD ================= */
function refreshNavGamificationChips(){
  const xp = getXP();
  const streak = getStreak();
  const xpChip = document.getElementById('xpChip');
  const streakChip = document.getElementById('streakChip');
  if(xpChip) xpChip.textContent = `⭐ ${xp} XP`;
  if(streakChip) streakChip.textContent = `🔥 ${streak.count}`;
}

function showDashboard(){
  renderDashboard();
  switchScreen('dashboardScreen');
}

function renderDashboard(){
  const progress = getProgress();
  const bestList = Object.values(progress).map(r=>r.best).filter(Boolean);
  const chaptersTried = Object.keys(progress).length;
  const avgPct = bestList.length ? Math.round(bestList.reduce((s,b)=>s+b.pct,0)/bestList.length) : 0;
  const streak = getStreak();
  const xp = getXP();
  const level = getLevel(xp);
  const xpIntoLevel = xp % LEVEL_XP;

  document.getElementById('dashGreeting').textContent = student.name
    ? `Nice work, ${student.name.split(' ')[0]}! Here's how you're doing.`
    : 'Keep going — every attempt makes you sharper.';
  document.getElementById('dashCompleted').textContent = `${chaptersTried}/${activeChapters().length}`;
  document.getElementById('dashAvg').textContent = `${avgPct}%`;
  document.getElementById('dashStreak').textContent = streak.count;
  document.getElementById('dashXP').textContent = xp;
  document.getElementById('levelLabel').textContent = `Level ${level}`;
  document.getElementById('levelXpLabel').textContent = `${xpIntoLevel} / ${LEVEL_XP} XP`;
  document.getElementById('levelBarFill').style.width = `${(xpIntoLevel/LEVEL_XP)*100}%`;

  // Badges
  const earnedIds = computeEarnedBadgeIds();
  lsSet('cs_badges', earnedIds);
  const badgeGrid = document.getElementById('badgeGrid');
  badgeGrid.innerHTML = BADGE_DEFS.map(b=>`
    <div class="badge-card ${earnedIds.includes(b.id)?'unlocked':''}">
      <div class="b-icon">${b.icon}</div>
      <div class="b-name">${b.name}</div>
      <div class="b-desc">${b.desc}</div>
    </div>
  `).join('');

  // Chapter progress list
  const progList = document.getElementById('progressList');
  const rows = activeChapters().map((ch,i)=>{
    const rec = progress[ch.id];
    const pct = rec && rec.best ? rec.best.pct : 0;
    return `<div class="progress-row">
      <div class="p-name">${SUBJECT_INFO[currentSubject].unitLabel} ${i+1}: ${ch.name}</div>
      <div class="p-bar"><div class="p-fill" style="width:${pct}%"></div></div>
      <div class="p-pct">${pct}%</div>
    </div>`;
  }).join('');
  progList.innerHTML = rows || `<div class="dash-empty">No attempts yet. Start a chapter to see your progress here!</div>`;

  // Focus Area: point out the lowest-scoring attempted chapter so students
  // know exactly what to revise next, instead of just seeing a wall of bars.
  const focusEl = document.getElementById('focusAreaCallout');
  if(focusEl){
    const attempted = activeChapters()
      .map((ch,i)=>({ch, i, pct: progress[ch.id] && progress[ch.id].best ? progress[ch.id].best.pct : null}))
      .filter(r=>r.pct !== null);
    if(attempted.length >= 2){
      const weakest = attempted.slice().sort((a,b)=>a.pct-b.pct)[0];
      if(weakest.pct < 70){
        focusEl.classList.remove('hidden');
        focusEl.innerHTML = `<span class="fac-icon">🎯</span><div class="fac-text"><b>Focus area:</b> ${SUBJECT_INFO[currentSubject].unitLabel} ${weakest.i+1} — ${escapeHtml(weakest.ch.name)} <span class="fac-pct">(${weakest.pct}%)</span>. A quick re-attempt here would boost your average the most.</div>`;
      } else {
        focusEl.classList.add('hidden');
      }
    } else {
      focusEl.classList.add('hidden');
    }
  }

  // Your best attempts (personal history, this device/account only)
  const board = getLeaderboard();
  const lbEl = document.getElementById('leaderboardTable');
  if(board.length===0){
    lbEl.innerHTML = `<div class="dash-empty">No attempts recorded yet. Complete a test to see your best scores here!</div>`;
  } else {
    const top = board.slice().sort((a,b)=> b.pct - a.pct || a.elapsed - b.elapsed).slice(0,10);
    lbEl.innerHTML = top.map((e,i)=>{
      const rankCls = i===0?'r1':i===1?'r2':i===2?'r3':'';
      const mm = Math.floor(e.elapsed/60), ss = e.elapsed%60;
      return `<div class="lb-row">
        <div class="lb-rank ${rankCls}">${i+1}</div>
        <div class="lb-info">
          <div class="lb-name">${e.name} <span style="color:var(--muted);font-weight:600">(${e.cls})</span></div>
          <div class="lb-meta">${e.chapterName} • ${mm}:${ss.toString().padStart(2,'0')}</div>
        </div>
        <div class="lb-score">${e.pct}%</div>
      </div>`;
    }).join('');
  }

  renderGlobalLeaderboard();
}

/* ---- class-wide leaderboard, read from the shared Firestore 'leaderboard' collection ---- */
async function renderGlobalLeaderboard(){
  const el = document.getElementById('globalLeaderboardTable');
  if(!el) return;
  if(CLOUD.mode !== 'cloud'){
    el.innerHTML = `<div class="dash-empty">Sign in with Google to see the class-wide leaderboard.</div>`;
    return;
  }
  try{
    const snap = await fbDB.collection('leaderboard').orderBy('xp','desc').limit(20).get();
    if(snap.empty){
      el.innerHTML = `<div class="dash-empty">No one has appeared on the class leaderboard yet — be the first!</div>`;
      return;
    }
    let i = 0;
    el.innerHTML = snap.docs.map(doc=>{
      const d = doc.data();
      const rankCls = i===0?'r1':i===1?'r2':i===2?'r3':'';
      const isMe = doc.id === CLOUD.uid;
      i++;
      return `<div class="lb-row" style="${isMe ? 'background:rgba(var(--glow-rgb),.08);border-radius:12px' : ''}">
        <div class="lb-rank ${rankCls}">${i}</div>
        <div class="lb-info">
          <div class="lb-name">${d.name || 'Student'} <span style="color:var(--muted);font-weight:600">(${d.cls || '-'})</span>${isMe ? ' <span style="color:var(--primary);font-weight:700">— you</span>' : ''}</div>
          <div class="lb-meta">Level ${d.level || 1} • ${d.testsCompleted || 0} tests completed</div>
        </div>
        <div class="lb-score">${d.xp || 0} XP</div>
      </div>`;
    }).join('');
  }catch(e){
    console.warn('Global leaderboard load failed', e);
    el.innerHTML = `<div class="dash-empty">Couldn't load the class leaderboard right now.</div>`;
  }
}

/* ================= KEYBOARD NAVIGATION ================= */
document.addEventListener('keydown', (e)=>{
  const testScreenEl = document.getElementById('testScreen');
  if(!testScreenEl || testScreenEl.classList.contains('hidden')) return;
  if(!document.getElementById('submitModal').classList.contains('hidden')) return;
  const key = e.key.toLowerCase();
  const map = {'1':0,'2':1,'3':2,'4':3,'a':0,'b':1,'c':2,'d':3};
  if(map[key]!==undefined){
    const opts = document.querySelectorAll('#optionsWrap .option');
    if(opts[map[key]]){
      const rect = opts[map[key]].getBoundingClientRect();
      opts[map[key]].onclick({clientX: rect.left+rect.width/2, clientY: rect.top+rect.height/2});
    }
  } else if(e.key==='Enter' || e.key==='ArrowRight'){ nextQ(); }
  else if(e.key==='ArrowLeft'){ prevQ(); }
});

/* ================= PWA SERVICE WORKER REGISTRATION ================= */
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('sw.js').catch(()=>{ /* fine if sw.js isn't hosted alongside this file */ });
  });
}

/* ================= OFFLINE STATUS BANNER ================= */
function updateOfflineBanner(){
  const banner = document.getElementById('offlineBanner');
  if(!banner) return;
  banner.classList.toggle('hidden', navigator.onLine);
}
window.addEventListener('online', updateOfflineBanner);
window.addEventListener('offline', updateOfflineBanner);

/* ================= INITIAL SETUP ================= */
(function initPreferences(){
  applyLoadedPreferences();
  refreshNavGamificationChips();
  updateOfflineBanner();
})();

/* ================= DUVAN — AI DOUBT ASSISTANT (Groq API) ================= */
/*
  SETUP:
  1. Get a free API key at https://console.groq.com/keys (no credit card needed)
  2. Paste it below in place of "PASTE_YOUR_GROQ_API_KEY_HERE"
  3. IMPORTANT — this is a static site, so this key is visible to anyone who
     views the page source. To limit abuse:
       - Groq doesn't support domain-restricted keys yet, so the main
         protection is simply not exposing large limits — the free tier
         itself acts as a natural cap.
       - Rotate the key if you ever suspect misuse (console.groq.com/keys).
  4. The free tier has a daily/per-minute request limit. If it's exceeded,
     Duvan will show a friendly "try again in a bit" message instead of
     crashing — no charges, it just pauses until the quota resets.
*/
// API key is secret — stored in Vercel env variables, never in code.
const DUVAN_PROXY_URL = "https://12csmcq-hu62aa2kq-duvaneshwebansco.vercel.app/api/duvan";
const DUVAN_MODEL = "llama-3.3-70b-versatile";
const DUVAN_SYSTEM_PROMPT = "You are Duvan, a friendly AI doubt-clearing assistant built into the Vethathiri Maharishi Higher Secondary School exam practice portal for 12th standard students. Students ask you doubts about Computer Science, Maths, Physics, Chemistry and Commerce (Tamil Nadu state board syllabus). Give clear, correct, exam-relevant explanations. Keep answers concise and well-structured (use short paragraphs or bullet points), suitable for a 12th-standard student. If a question is outside these subjects or inappropriate, politely redirect the student back to their studies. Do not answer questions unrelated to academics.";

let duvanHistory = []; // { role: 'user'|'model', text: '...' }
let duvanOpen = false;
let duvanBusy = false;

function toggleDuvanChat(){
  duvanOpen = !duvanOpen;
  const panel = document.getElementById('duvanPanel');
  const fab = document.getElementById('duvanFab');
  if(!panel) return;
  panel.classList.toggle('hidden', !duvanOpen);
  if(fab) fab.classList.toggle('is-open', duvanOpen);
  if(duvanOpen){
    const input = document.getElementById('duvanInput');
    if(input) setTimeout(()=>input.focus(), 150);
    scrollDuvanToBottom();
    adjustDuvanForKeyboard();
  }
}

/* ---------------- Keep the panel/input properly positioned on mobile
   when the on-screen keyboard opens. Mobile browsers shrink the visual
   viewport (not the CSS 100vh layout viewport) when the keyboard shows,
   which is what pushes the input row out of alignment / off-screen.
   We listen to the VisualViewport API and reposition the panel to
   always sit fully inside whatever space is actually visible. ---------------- */
function adjustDuvanForKeyboard(){
  const panel = document.getElementById('duvanPanel');
  const fab = document.getElementById('duvanFab');
  if(!panel) return;
  const vv = window.visualViewport;
  if(!vv){ return; }

  const isMobile = window.innerWidth <= 480;
  const keyboardGap = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
  const baseBottom = isMobile ? 82 : 90;
  const baseFabBottom = isMobile ? 14 : 20;

  if(!panel.classList.contains('hidden')){
    panel.style.bottom = (baseBottom + keyboardGap) + 'px';
    panel.style.maxHeight = (vv.height - 30) + 'px';
  }
  if(fab && !fab.classList.contains('hidden')){
    fab.style.bottom = (baseFabBottom + keyboardGap) + 'px';
  }
}

if(window.visualViewport){
  window.visualViewport.addEventListener('resize', adjustDuvanForKeyboard);
  window.visualViewport.addEventListener('scroll', adjustDuvanForKeyboard);
}
window.addEventListener('orientationchange', ()=>setTimeout(adjustDuvanForKeyboard, 200));

function handleDuvanKeydown(e){
  if(e.key === 'Enter' && !e.shiftKey){
    e.preventDefault();
    sendDuvanMessage();
  }
}

function clearDuvanChat(){
  duvanHistory = [];
  const wrap = document.getElementById('duvanMessages');
  if(wrap){
    wrap.innerHTML = '<div class="duvan-msg duvan-msg-bot">Chat cleared! Ask me anything about your subjects. 😊</div>';
  }
}

function scrollDuvanToBottom(){
  const wrap = document.getElementById('duvanMessages');
  if(!wrap) return;
  // Wait a frame so the browser has finished laying out the new content
  // (fixes cases where scrollHeight was measured before text wrapped/rendered)
  requestAnimationFrame(() => {
    wrap.scrollTop = wrap.scrollHeight;
    requestAnimationFrame(() => { wrap.scrollTop = wrap.scrollHeight; });
  });
}

function appendDuvanMessage(text, cls){
  const wrap = document.getElementById('duvanMessages');
  if(!wrap) return null;
  const el = document.createElement('div');
  el.className = 'duvan-msg ' + cls;
  el.textContent = text;
  wrap.appendChild(el);
  scrollDuvanToBottom();
  return el;
}

function showDuvanTyping(){
  const wrap = document.getElementById('duvanMessages');
  if(!wrap) return null;
  const el = document.createElement('div');
  el.className = 'duvan-typing';
  el.id = 'duvanTypingIndicator';
  el.innerHTML = '<span></span><span></span><span></span>';
  wrap.appendChild(el);
  scrollDuvanToBottom();
  return el;
}

function removeDuvanTyping(){
  const el = document.getElementById('duvanTypingIndicator');
  if(el) el.remove();
  scrollDuvanToBottom();
}

async function sendDuvanMessage(){
  if(duvanBusy) return;
  const input = document.getElementById('duvanInput');
  const sendBtn = document.getElementById('duvanSendBtn');
  if(!input) return;
  const text = input.value.trim();
  if(!text) return;

  if(!DUVAN_PROXY_URL || DUVAN_PROXY_URL.includes("YOUR-PROJECT")){
    appendDuvanMessage("Duvan isn't set up yet — the site owner needs to set the Vercel proxy URL in script.js.", 'duvan-msg-error');
    return;
  }

  input.value = '';
  input.style.height = 'auto';
  appendDuvanMessage(text, 'duvan-msg-user');
  duvanHistory.push({ role: 'user', text });

  duvanBusy = true;
  if(sendBtn) sendBtn.disabled = true;
  showDuvanTyping();

  try{
    // Groq uses the OpenAI-compatible chat completions format
    const messages = [
      { role: 'system', content: DUVAN_SYSTEM_PROMPT },
      ...duvanHistory.map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text
      }))
    ];

    const resp = await fetch(
      DUVAN_PROXY_URL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: DUVAN_MODEL,
          messages,
          temperature: 0.6,
          max_tokens: 800
        })
      }
    );

    const data = await resp.json();
    removeDuvanTyping();

    if(!resp.ok){
      const status = resp.status;
      // Log the full error so the real cause (bad key, disabled model,
      // quota, etc.) is visible in the browser console instead of only
      // ever showing a generic message.
      console.error('Duvan API error:', status, data);
      if(status === 429){
        appendDuvanMessage("Duvan is getting a lot of questions right now (free quota reached). Please try again in a minute. ⏳", 'duvan-msg-error');
      } else if(status === 400 || status === 401 || status === 403){
        appendDuvanMessage("Duvan can't be reached right now — the site owner needs to check the Groq API key in script.js. Details are in the browser console.", 'duvan-msg-error');
      } else {
        appendDuvanMessage("Sorry, something went wrong reaching Duvan. Please try again.", 'duvan-msg-error');
      }
      duvanHistory.pop(); // don't keep the failed turn in context
      return;
    }

    const reply = data?.choices?.[0]?.message?.content || '';
    if(!reply){
      appendDuvanMessage("Hmm, I couldn't come up with an answer for that. Could you rephrase your doubt?", 'duvan-msg-error');
      duvanHistory.pop();
      return;
    }

    appendDuvanMessage(reply, 'duvan-msg-bot');
    duvanHistory.push({ role: 'model', text: reply });

    // keep context window small
    if(duvanHistory.length > 20) duvanHistory = duvanHistory.slice(-20);

  } catch(err){
    removeDuvanTyping();
    console.error('Duvan fetch error:', err);
    appendDuvanMessage("Couldn't reach Duvan — check your internet connection and try again.", 'duvan-msg-error');
    duvanHistory.pop();
  } finally{
    duvanBusy = false;
    if(sendBtn) sendBtn.disabled = false;
  }
}

// auto-grow the textarea as the student types
(function initDuvanInput(){
  document.addEventListener('input', function(e){
    if(e.target && e.target.id === 'duvanInput'){
      e.target.style.height = 'auto';
      e.target.style.height = Math.min(e.target.scrollHeight, 90) + 'px';
    }
  });
})();
