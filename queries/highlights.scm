
; Comments

(comment) @comment


; Functions

(function_literal
[
 "function"
 "end"
] @keyword.function)

(function_literal
  parameter: (identifier) @parameter)

"return" @keyword.return

(function_call
  name: (identifier) @function.call)


; Loops

(for_loop
[
 "for"
 "do"
 "od"
] @repeat)

(while_loop
[
 "while"
 "do"
 "od"
] @repeat)

(repeat_loop
[
 "repeat"
 "until"
] @repeat)


; Conditionals 

(conditional ["fi"] @conditional)

(if_statement
[
 "if"
 "then"
] @conditional)

(elif_statement 
[
 "elif"
 "then"
] @conditional)

(else_statement
[
 "else"
] @conditional)


; Operators
; TO DO

; Variables
(identifier) @variable
