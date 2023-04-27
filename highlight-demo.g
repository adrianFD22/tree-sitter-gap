# This is a comment

function(a, b) 
	local c, d;

	c := a;
	DoSomething();

	return c;
end;

myVariable := "hello";
myList := [1, 2.0, '3'];

Hello();

for i in myList do
	if i = 2 then
		Print(i);
	elif i <> 4 then 
		continue;
	else
		Print(i);
	fi;
od;

while false do 
	Print("ok");
od;

rec(a:= 1);
