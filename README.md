# tree-sitter-gap

A tree-sitter parser for GAP. This is just my personal gap parser that I use. There is some features missing but it is pretty runnable.

- TO DO things:
    - Finish writing the syntax
        - Improve (fix) the regex that match identifiers
        - Reserved keywords that are currently parsed as identifiers
            - Assert
            - Info
            - IsBound
            - QUIT
            - quit
            - TryNextMethod
            - Unbind
            - atomic
            - local
            - readonly
            - readwrite
        - Fix the parsing of the {} operator over lists.
    - Add more modules if convenient

- Question: does GAP uses ~ for anything (outside strings)?
