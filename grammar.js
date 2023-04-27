// TO DO: refactor regex
// TO DO: add ~ and other things from the GAP manual
module.exports = grammar({
	name: 'gap',

	word: $ => $.identifier,

	precedences: _ => [
		[
			'comment',
			'statement'
		],

		[
			'exp',
			'unary_sum',
			'product',
			'binary_sum'
		],

		[
			'not',
			'and',
			'or'
		],

		[
			'component_id',
			'record_literal',
			'function_call',
			'expression',
			'literal'
		],

		[
			'arithmetic_operation',
			'comparison_operation',
			'logical_operation'
		]
	],

	extras: $ => [
		$.comment,
		/\s/
	],

	rules: {
		source_file: $ => repeat(
			choice(
				$._statement
			)
		),

		
		_statement: $ => seq(
			optional(choice(
				$.assignment,
				$._expression,	//Procedure call
				$.conditional,
				$.while_loop,
				$.repeat_loop,
				$.for_loop,
				$.break_statement,
				$.continue_statement,
				$.return_statement
			)),
			';'
		),

		comment: $ => /#[^\n]*\n/g,

		assignment: $ => seq(
			$._variable,
			':=',
			$._expression
		),

		_variable: $ => choice(
			$.identifier,
			$.list_element,
			$.record_component
		),

		// TO DO: fix this regex
		identifier: $ => /[a-zA-Z0-9_@]*[a-zA-Z_@][a-zA-Z0-9_@]*/,

		_expression: $ => choice(
			seq('(', $._expression_aux, ')'),
			seq($._expression_aux)
		),

		_expression_aux: $ => prec('expression', choice(
			$.function_call,
			$._operation,
			$._literal,
			$._variable,
			$.sublist
		)),

		list_element: $ => seq(
			$._variable,
			'[',
			$._expression,
			']'
		),
		
		sublist: $ => seq(
			$._expression,
			'{',
			$._expression,
			'}'
		),

		_operation: $ => choice(
			$.arithmetic_operation,
			$.comparison_operation,
			$.logical_operation
		),

		arithmetic_operation: $ => prec('arithmetic_operation', choice(
			prec.left('exp', seq($._expression, '^', $._expression)),
			prec.right('unary_sum', seq(/[+-]/, $._expression)),
			prec.left('product', seq($._expression, /\*|\/|mod/, $._expression)),
			prec.left('binary_sum', seq($._expression, /[+-]/, $._expression))
		)),

		comparison_operation: $ => prec('comparison_operation', choice(
			prec.left(seq($._expression, /=|<>|<|>|<=|>=|in/g, $._expression))
		)),

		logical_operation: $ => prec('logical_operation', choice(
			prec.right('not', seq('not', $._expression)),
			prec.left('and', seq($._expression, 'and', $._expression)),
			prec.left('or', seq($._expression, 'or', $._expression))
		)),

		_literal: $ => prec('literal', choice(
			$.function_literal,
			$.integer_literal,
			$.float_literal,
			$.permutation_literal,
			$.string_literal,
			$.character_literal,
			$.list_literal,
			$.record_literal,
			$.boolean_literal
		)),	

		function_call: $ => prec('function_call', seq(
			field('name', $._variable),	
			'(',
			field('arguments', commaSep($._expression)),
			')'
		)),
		
		function_literal: $ => choice(
			$._function_literal_lambda,
			$._function_literal_standard
		),

		_function_literal_lambda: $ => prec.right(seq(
			$._lambda_parameters,
			'->',
			$._expression
		)),

		_lambda_parameters: $ => choice(
			seq(
				'{',
				commaSep($.identifier),
				'}'
			),
			$.identifier
		),

		_function_literal_standard: $ => seq(
			'function',
			field('parameter', $._parameters),
			field('local', optional($.local_declaration)),
			repeat($._statement),
			'end'
		),


		_parameters: $ => seq(
			'(',
			choice(
				seq(commaSep($.identifier)),
				seq(commaSep1($.identifier), '...')
			),
			')',
		),

		local_declaration: $ => seq(
			'local',
			commaSep1($.identifier),
			';'
		),

		integer_literal: $ => /\d+/,

		float_literal: $ => /[-+]?[0-9]*\.{1}[0-9]+/,

		permutation_literal: $ => repeat1(
			seq(
				'(',
				commaSep2($.integer_literal),
				')'
			)
		),

		string_literal: $ => /"(?:[^"\\]|\\.)*"/g,

		character_literal: $ => /'(?:[^'\\]|\\.){1}'/g,

		list_literal: $ => seq(
			'[',
			choice(
				commaSep($._expression),
				seq(
					$._expression,
					'..',
					$._expression
				)
			),
			']'
		),

		record_literal: $ => seq(
			'rec',
			'(',
			field('components', commaSep(seq(
				$.identifier,
				':=',
				$._expression
			))),
			')'
		),

		_component_id: $ => prec.left('component_id', choice(
			seq(
				'(',
				choice(
					$._variable,
					$.function_call,
					$.string_literal,
				),
				')'
			),
			$._variable
		)),

		record_component: $ => prec.left(seq(
			$._variable,
			'.',
			$._component_id,
			repeat(seq('.', $._component_id))
		)),

		boolean_literal: $ => choice(
			'true',
			'false',
			'fail'
		),

		conditional: $ => seq(
			field('if', $.if_statement),
			repeat(field('elif', $.elif_statement)),
			field('else', optional($.else_statement)),
			'fi'
		),

		if_statement: $ => seq(
			'if',
			field('bool_expr', $._expression),
			'then',
			field('statements', repeat($._statement)),
		),

		elif_statement: $ => seq(
			'elif',
			field('bool_expr', $._expression),
			'then',
			field('statements', repeat($._statement)),
		),

		else_statement: $ => seq(
			'else',
			field('statements', repeat($._statement))
		),

		while_loop: $ => seq(
			'while',
			$._expression,
			'do',
			repeat($._statement),
			'od'
		),

		repeat_loop: $ => seq(
			'repeat',
			repeat($._statement),
			'until',
			$._expression
		),

		_iterable: $ => choice(
			$.identifier,
			$.function_call,
			$.list_literal,
			$.list_element,
			$.record_component
		),

		for_loop: $ => seq(
			'for',
			$.identifier,
			'in',
			$._iterable,	
			'do',
			repeat($._statement),
			'od'
		),

		break_statement: $ => seq(
			'break'
		),

		continue_statement: $ => seq(
			'continue'
		),

		return_statement: $ => seq(
			'return',
			optional($._expression)
		)
	}
});

function commaSep(rule) {
  return optional(commaSep1(rule));
}

function commaSep1(rule) {
  return seq(rule, repeat(seq(',', rule)));
}

function commaSep2(rule) {
  return seq(rule, ',', commaSep1(rule));
}
