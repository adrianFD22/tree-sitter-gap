#!/bin/bash

dir_to_parse=~/Work/GAP/DMM

for i in $(ls $dir_to_parse | grep ".*\.g")
do
	tree-sitter parse $dir_to_parse/$i | grep ERROR
done
