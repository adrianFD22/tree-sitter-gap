# tree-sitter-gap

A tree-sitter parser for GAP.

- TO DO things:
    - Finish writing the syntax
        - Improve (fix) the regex that match identifiers
        - Reserved keywords that are currently parsed as identifiers
            - Assert
            - Info
            - IsBound
            - QUIT
            - TryNextMethod
            - Unbind
            - atomic
            - local
            - quit
            - readonly
            - readwrite
        - Fix the parsing of the {} operator over lists.
    - Add more modules if convenient

- Question: does GAP uses ~ for anything (outside strings)?
